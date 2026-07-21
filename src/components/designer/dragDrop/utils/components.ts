import type {AnyComponentSchema} from '@open-formulieren/types';
import {camelCase} from 'lodash';
import type {IntlShape} from 'react-intl';

import {
  MAIN_DROPZONE_ID,
  getComponentKeyFromDropzoneId,
} from '@/components/designer/dragDrop/utils/dropzone';
import type {ComponentDefinition} from '@/components/designer/types';
import {COMPONENT_PLACEHOLDER_TYPE} from '@/components/designer/types';
import {getRegistryEntry} from '@/registry';
import {hasOwnProperty} from '@/types';

interface IterComponentsResult<
  S extends ComponentDefinition | AnyComponentSchema = ComponentDefinition,
> {
  /**
   * The index of the current item.
   */
  index: number;
  /**
   * The path to the current item.
   */
  path: string;
  /**
   * The current item.
   */
  component: S;
  /**
   * The collection of items that the current item belongs to.
   */
  collection: S[];
  /**
   * Whether the component itself holds data, or if it's simply used for presentation.
   */
  holdsData?: boolean;
}

/**
 * Recursively (and depth-first) iterate over all components in the component definition.
 */
export function* iterComponents<
  S extends ComponentDefinition | AnyComponentSchema = ComponentDefinition,
>(componentDefinitions: S[], parentPath: string = ''): Generator<IterComponentsResult<S>> {
  for (const [index, component] of componentDefinitions.entries()) {
    const path = [parentPath, hasOwnProperty(component, 'key') ? component.key : '']
      .filter(Boolean)
      .join('.');

    if (component.type === COMPONENT_PLACEHOLDER_TYPE) {
      yield {index, component, path, collection: componentDefinitions};
      continue;
    }

    const {getComponentSlots, holdsData} = getRegistryEntry(component.type);
    yield {index, component, path, collection: componentDefinitions, holdsData};

    if (!getComponentSlots) continue;

    for (const slot of getComponentSlots(component)) {
      yield* iterComponents<S>(
        slot.collection as S[],
        slot.useReferenceInComponentPath ? `${parentPath}.${slot.reference}` : parentPath
      );
    }
  }
}

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
    if (component.type === COMPONENT_PLACEHOLDER_TYPE) continue;

    const {getComponentSlots} = getRegistryEntry(component.type);
    if (!getComponentSlots) continue;

    for (const slot of getComponentSlots(component)) {
      if (slot.reference === parentReference) return slot.collection;
    }
  }

  return undefined;
};

/**
 * Create a new component with a unique key for the given component type.
 *
 * The componentDefinitions are used to create a truly unique key.
 */
export const createComponent = <S extends AnyComponentSchema>(
  componentType: S['type'],
  uniquifyKey: (key: string) => string,
  intl: IntlShape
): S => {
  const {edit, formDesigner} = getRegistryEntry(componentType);
  const label = intl.formatMessage(formDesigner.label);

  // Define component with their editor default values, and some generic defaults.
  return {
    ...edit.defaultValues,
    id: window.crypto.randomUUID(),
    type: componentType,
    key: uniquifyKey(camelCase(label)),
    ...(hasOwnProperty(edit.defaultValues, 'label') ? {label} : {}),
    // type cast necessary because the discriminated union doesn't narrow and
    // getRegistryEntry doesn't narrow either, essentially returning AnyComponentSchema
  } as S;
};

/**
 * Remove the placeholder from the components.
 */
export const removePlaceholder = (components: ComponentDefinition[]) => {
  for (const {index, component, collection} of iterComponents(components)) {
    if (component.type === COMPONENT_PLACEHOLDER_TYPE) {
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
    if (component.type !== COMPONENT_PLACEHOLDER_TYPE && component.key === componentKey) {
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
    if (componentDefinition.type === COMPONENT_PLACEHOLDER_TYPE) {
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
    if (
      componentDefinition.type !== COMPONENT_PLACEHOLDER_TYPE &&
      componentDefinition.key === componentToReplaceKey
    ) {
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

export const findComponent = <S extends ComponentDefinition | AnyComponentSchema>(
  componentDefinitions: S[],
  componentKey: string
): S | null => {
  for (const {component} of iterComponents(componentDefinitions)) {
    if (component.type !== COMPONENT_PLACEHOLDER_TYPE && component.key === componentKey) {
      return component;
    }
  }
  return null;
};

export function assertNoPlaceholders(
  components: ComponentDefinition[]
): asserts components is AnyComponentSchema[] {
  for (const {component} of iterComponents(components)) {
    if (component.type === COMPONENT_PLACEHOLDER_TYPE) {
      throw new Error('Components must not contain a placeholder');
    }
  }
}
