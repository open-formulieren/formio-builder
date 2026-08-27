import type {AnyComponentSchema} from '@open-formulieren/types';
import {camelCase} from 'lodash';
import type {IntlShape} from 'react-intl';

import {
  MAIN_DROPZONE_ID,
  getComponentKeyFromDropzoneId,
} from '@/components/designer/dragDrop/utils/dropzone';
import type {ComponentDefinition} from '@/components/designer/types';
import {isPlaceholder, iterComponents} from '@/formio';
import {getRegistryEntry} from '@/registry';
import {hasOwnProperty} from '@/types';

/**
 * Get the components for a given dropzone.
 */
export const getDropzoneComponents = (
  components: ComponentDefinition[],
  dropzoneId: string
): ComponentDefinition[] | undefined => {
  if (dropzoneId === MAIN_DROPZONE_ID) {
    return components;
  }

  const parentKey = getComponentKeyFromDropzoneId(dropzoneId);
  return findDropzoneComponentsByParentReference(components, parentKey);
};

/**
 * Search for a layout component that belongs to the given reference and return its
 * children components.
 */
const findDropzoneComponentsByParentReference = (
  componentDefinitions: ComponentDefinition[],
  parentReference: string
): ComponentDefinition[] | undefined => {
  for (const {component} of iterComponents(componentDefinitions)) {
    if (isPlaceholder(component)) continue;

    const {getComponentSlots} = getRegistryEntry(component.type);
    if (!getComponentSlots) continue;

    for (const slot of getComponentSlots(component)) {
      if (slot.reference === parentReference) return slot.collection;
    }
  }

  return undefined;
};

/**
 * Create a new component with a unique key for the given component schema.
 *
 * The componentDefinitions are used to create a truly unique key.
 *
 * @param schema - A fully preconfigured component schema, either from the component-specific
 *                 defaults, or a schema from the defaults with overrides from the presets.
 * @param uniquifyKey - Callback function that ensures the `key` candidate is made unique in
 *                      the whole form (definition) namespace.
 */
export const createComponent = <S extends AnyComponentSchema>(
  schema: S,
  uniquifyKey: (key: string) => string,
  intl: IntlShape
): S => {
  const {formDesigner} = getRegistryEntry(schema.type);
  const defaultLabel = intl.formatMessage(formDesigner.label);
  const hasLabel = hasOwnProperty(schema, 'label');
  const label = (hasLabel ? schema.label : '') || defaultLabel;
  // Define component with their editor default values, and some generic defaults.
  const updatedSchema: S = {
    ...schema,
    id: window.crypto.randomUUID(),
    key: uniquifyKey(camelCase(label)),
    ...(hasLabel ? {label} : {}),
  };
  return updatedSchema;
};

/**
 * Remove the placeholder from the components.
 */
export const removePlaceholder = (components: ComponentDefinition[]) => {
  for (const {index, component, collection} of iterComponents(components)) {
    if (isPlaceholder(component)) {
      collection.splice(index, 1);
      return;
    }
  }
};

/**
 * Remove a component from the components collection, using the component key as an
 * identifier.
 */
export const removeComponent = (components: ComponentDefinition[], componentKey: string) => {
  for (const {index, component, collection} of iterComponents(components)) {
    if (!isPlaceholder(component) && component.key === componentKey) {
      collection.splice(index, 1);
      return;
    }
  }
};

/**
 * Search for the placeholder in the components and replace it with the given component.
 */
export const replacePlaceholderWithComponent = (
  componentDefinitions: ComponentDefinition[],
  component: AnyComponentSchema
) => {
  for (const {index, component: componentDefinition, collection} of iterComponents(
    componentDefinitions
  )) {
    if (isPlaceholder(componentDefinition)) {
      collection[index] = component;
      return;
    }
  }
};

/**
 * Replace a component in the components with the given component.
 */
export const replaceComponent = (
  componentDefinitions: ComponentDefinition[],
  componentToReplaceKey: string,
  component: AnyComponentSchema
) => {
  for (const {index, component: componentDefinition, collection} of iterComponents(
    componentDefinitions
  )) {
    if (!isPlaceholder(componentDefinition) && componentDefinition.key === componentToReplaceKey) {
      collection[index] = component;
      return;
    }
  }
};

/**
 * Insert a component definition (a placeholder or component) at the given index in the
 * given dropzone.
 */
export const insertComponentDefinition = (
  index: number,
  componentDefinitions: ComponentDefinition[],
  dropzoneId: string,
  componentDefinition: ComponentDefinition
) => {
  const dropzoneComponents = getDropzoneComponents(componentDefinitions, dropzoneId);
  if (dropzoneComponents === undefined) return;

  dropzoneComponents.splice(index, 0, componentDefinition);
};

export function assertNoPlaceholders(
  components: ComponentDefinition[]
): asserts components is AnyComponentSchema[] {
  for (const {component} of iterComponents(components)) {
    if (isPlaceholder(component)) {
      throw new Error('Components must not contain a placeholder');
    }
  }
}
