import type {AnyComponentSchema} from '@open-formulieren/types';
import type {Draft} from 'immer';
import type {IntlShape} from 'react-intl';

import {
  MAIN_DROPZONE_ID,
  getComponentKeyFromDropzoneId,
} from '@/components/designer/dragDrop/utils/dropzone';
import type {ComponentPlaceholder} from '@/components/designer/types';
import {COMPONENT_PLACEHOLDER_TYPE} from '@/components/designer/types';
import {getRegistryEntry} from '@/registry';
import {hasOwnProperty} from '@/types';

type ComponentDefinition = AnyComponentSchema | ComponentPlaceholder;
type DraftComponentDefinitions = Draft<{components: ComponentDefinition[]}>;

const hasNestedChildren = (
  children: AnyComponentSchema[] | AnyComponentSchema[][]
): children is AnyComponentSchema[][] => children.length > 0 && Array.isArray(children[0]);

interface IterComponentsReturn {
  /**
   * The index of the current item.
   */
  index: number;
  /**
   * The current item.
   */
  component: ComponentDefinition;
  /**
   * The collection of items that the current item belongs to.
   */
  collection: ComponentDefinition[];
}

/**
 * Recursively (and depth-first) iterate over all components in the component definition.
 */
function* iterComponents(
  componentDefinitions: ComponentDefinition[]
): Generator<IterComponentsReturn> {
  for (const [index, component] of componentDefinitions.entries()) {
    yield {index, component, collection: componentDefinitions};
    if (component.type === COMPONENT_PLACEHOLDER_TYPE) continue;

    const {getChildComponents} = getRegistryEntry(component.type);

    const children = getChildComponents ? getChildComponents(component) : [];
    if (!children.length) continue;

    if (hasNestedChildren(children)) {
      for (const child of children) {
        yield* iterComponents(child);
      }
    } else {
      yield* iterComponents(children);
    }
  }
}

/**
 * Get the components for a given dropzone.
 */
export const getDropzoneComponents = (
  draft: DraftComponentDefinitions,
  dropzoneId: string
): ComponentDefinition[] | undefined => {
  if (dropzoneId === MAIN_DROPZONE_ID) {
    return draft.components;
  }

  const parentKey = getComponentKeyFromDropzoneId(dropzoneId);
  return findDropzoneComponentsByKey(draft.components, parentKey);
};

/**
 * Search for a layout component that belongs to the given dropzone key and return its
 * children components.
 *
 * In the case of the columns component, the dropzone key contains the column index, and
 * we must return the children of that column.
 */
const findDropzoneComponentsByKey = (
  componentDefinitions: ComponentDefinition[],
  key: string
): ComponentDefinition[] | undefined => {
  for (const {component} of iterComponents(componentDefinitions)) {
    if (component.type === COMPONENT_PLACEHOLDER_TYPE) continue;

    // Without the getChildComponents method, we cannot retrieve the component children.
    const {getChildComponents} = getRegistryEntry(component.type);
    if (!getChildComponents) continue;

    const children = getChildComponents(component);

    // If the children are an array of arrays, we are dealing with a columns component.
    // The column index is part of the dropzone key, so we have to find the correct
    // column.
    if (hasNestedChildren(children)) {
      for (const [index, child] of children.entries()) {
        if (`${component.key}.${index}` === key) return child;
      }
    } else if (component.key === key) {
      return children;
    }
  }

  return undefined;
};

/**
 * Find all component keys that start with the given string.
 */
const findComponentKeysStartingWith = (
  startsWith: string,
  componentNamespace: AnyComponentSchema[]
): string[] => {
  const similarKeys: string[] = [];

  for (const {component} of iterComponents(componentNamespace)) {
    if (component.type !== COMPONENT_PLACEHOLDER_TYPE && component.key.startsWith(startsWith)) {
      similarKeys.push(component.key);
    }
  }

  return similarKeys;
};

/**
 * Create a unique component key for the provided component label.
 *
 * The component label is turned into a key by removing all non-alphanumeric characters,
 * making every word after the first capitalized, and joining them together.
 *
 * The component key is validated against the componentNamespace to ensure it is unique,
 * adding additional numbering if necessary.
 * This is similar to the current Formio form builder implementation.
 */
const createComponentKey = (
  componentLabel: string,
  componentNamespace: AnyComponentSchema[]
): string => {
  // Remove all non-alphanumeric characters, make every word after the first capitalized,
  // and join them together.
  // @TODO handle special characters, like umlauts, etc.
  const componentKey = componentLabel
    .split(/[^a-zA-Z0-9]/g)
    .filter(Boolean) // Remove empty strings
    .map((str, index) => (index > 0 ? str[0].toUpperCase() + str.slice(1) : str))
    .join('');

  const componentsWithSimilarKeys = findComponentKeysStartingWith(componentKey, componentNamespace);
  let index = 0;
  let uniqueKey = componentKey;

  while (componentsWithSimilarKeys.includes(uniqueKey)) {
    index++;
    uniqueKey = `${componentKey}${index}`;
  }
  return uniqueKey;
};

/**
 * Create a new component with a unique key for the given component type.
 *
 * The componentDefinitions are used to create a truly unique key.
 */
export const createComponent = <S extends AnyComponentSchema>(
  componentType: S['type'],
  componentNamespace: AnyComponentSchema[],
  intl: IntlShape
): S => {
  const {edit, formDesigner} = getRegistryEntry(componentType);
  const label = intl.formatMessage(formDesigner.label);

  // Define component with their editor default values, and some generic defaults.
  return {
    ...edit.defaultValues,
    id: window.crypto.randomUUID(),
    type: componentType,
    key: createComponentKey(label, componentNamespace),
    ...(hasOwnProperty(edit.defaultValues, 'label') ? {label} : {}),
    // type cast necessary because the discriminated union doesn't narrow and
    // getRegistryEntry doesn't narrow either, essentially returning AnyComponentSchema
  } as S;
};

/**
 * Remove the placeholder from the draft components.
 */
export const removePlaceholderFromDraft = (draft: DraftComponentDefinitions) => {
  for (const {index, component, collection} of iterComponents(draft.components)) {
    if (component.type === COMPONENT_PLACEHOLDER_TYPE) {
      collection.splice(index, 1);
      return;
    }
  }
};

/**
 * Remove a component from the draft components, using the component key as an
 * identifier.
 */
export const removeComponentFromDraft = (draft: DraftComponentDefinitions, key: string) => {
  for (const {index, component, collection} of iterComponents(draft.components)) {
    if (component.type !== COMPONENT_PLACEHOLDER_TYPE && component.key === key) {
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
