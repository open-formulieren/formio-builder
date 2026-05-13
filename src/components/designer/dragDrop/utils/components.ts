import type {AnyComponentSchema} from '@open-formulieren/types';
import type {Draft} from 'immer';

import type {ComponentPlaceholder} from '@/components/designer/types';
import {COMPONENT_PLACEHOLDER_TYPE} from '@/components/designer/types';
import {getChildComponents, getRegistryEntry, isNestedChildren} from '@/registry';

type ComponentDefinition = AnyComponentSchema | ComponentPlaceholder;
type DraftComponentDefinitions = Draft<{components: ComponentDefinition[]}>;

/**
 * Recursively (and depth-first) iterate over all components in the component definition.
 */
function* iterComponents(
  componentDefinitions: ComponentDefinition[]
): Generator<ComponentDefinition> {
  for (const component of componentDefinitions) {
    yield component;
    if (component.type === COMPONENT_PLACEHOLDER_TYPE) continue;

    const children = getChildComponents(component);
    if (!children.length) continue;

    if (isNestedChildren(children)) {
      for (const child of children) {
        yield* iterComponents(child);
      }
    } else {
      yield* iterComponents(children);
    }
  }
}

/**
 * Recursively find all component keys that start with the given string.
 */
const findComponentKeysStartingWith = (
  startsWith: string,
  componentDefinitions: ComponentDefinition[]
): string[] => {
  const similarKeys: string[] = [];

  for (const component of iterComponents(componentDefinitions)) {
    if (component.type !== COMPONENT_PLACEHOLDER_TYPE && component.key.startsWith(startsWith)) {
      similarKeys.push(component.key);
    }
  }

  return similarKeys;
};

/**
 * Create a unique component key for the given component type.
 *
 * It looks through the existing componentDefinitions and searches for component keys
 * that start with the component type. If there are components with similar keys, it will
 * append a number to the end of the key to make it unique.
 * This is similar to the current Formio form builder implementation.
 */
const createComponentKey = (
  componentType: AnyComponentSchema['type'],
  componentDefinitions: ComponentDefinition[]
): string => {
  const componentsWithSimilarKeys = findComponentKeysStartingWith(
    componentType,
    componentDefinitions
  );

  let componentKey: string = componentType;
  let index = 0;

  while (componentsWithSimilarKeys.includes(componentKey)) {
    index++;
    componentKey = `${componentType}${index}`;
  }
  return componentKey;
};

/**
 * Create a new component with a unique key for the given component type.
 *
 * The componentDefinitions are used to create a truly unique key.
 */
export const createComponent = <S extends AnyComponentSchema>(
  componentType: S['type'],
  componentDefinitions: ComponentDefinition[]
): S => {
  const {edit, builderInfo} = getRegistryEntry(componentType);

  // Define component with their editor default values, and some generic defaults.
  return {
    ...edit.defaultValues,
    id: window.crypto.randomUUID(),
    type: componentType,
    key: createComponentKey(componentType, componentDefinitions),
    ...(edit.defaultValues.hasOwnProperty('label') ? {label: builderInfo.title} : {}),
  } as S;
};

/**
 * Recursively remove the placeholder from the components.
 */
const removePlaceholderFromComponents = (componentDefinitions: ComponentDefinition[]) => {
  const index = componentDefinitions.findIndex(
    component => component.type === COMPONENT_PLACEHOLDER_TYPE
  );

  // If the placeholder is found, remove it.
  if (index >= 0) {
    componentDefinitions.splice(index, 1);
    return;
  }

  // Implement recursive search into nested dropzones
};

/**
 * Remove the placeholder from the draft.
 */
export const removePlaceholderFromDraft = (draft: DraftComponentDefinitions) => {
  removePlaceholderFromComponents(draft.components);
};

/**
 * Recursively remove a component from the componentDefinitions, using the component key
 * as an identifier.
 */
const removeComponentFromComponents = (
  componentDefinitions: ComponentDefinition[],
  key: string
) => {
  const index = componentDefinitions.findIndex(
    component => component.type !== COMPONENT_PLACEHOLDER_TYPE && component.key === key
  );

  // If the placeholder is found, remove it.
  if (index >= 0) {
    componentDefinitions.splice(index, 1);
    return;
  }

  // Implement recursive search into nested dropzones
};

/**
 * Remove a component from the draft, using the component key as an identifier, and
 * return the removed component.
 */
export const removeComponentFromDraft = (draft: DraftComponentDefinitions, key: string) => {
  removeComponentFromComponents(draft.components, key);
};

/**
 * Recursively search for the placeholder in the components and replace it with the given
 * component.
 */
export const replacePlaceholderWithComponent = (
  componentDefinitions: ComponentDefinition[],
  component: AnyComponentSchema
) => {
  const index = componentDefinitions.findIndex(
    componentDefinition => componentDefinition.type === COMPONENT_PLACEHOLDER_TYPE
  );

  if (index >= 0) {
    componentDefinitions[index] = component;
    return;
  }

  // Implement recursive search into nested dropzones
};
