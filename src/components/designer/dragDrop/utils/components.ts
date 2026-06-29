import type {AnyComponentSchema} from '@open-formulieren/types';
import type {Draft} from 'immer';
import {IntlShape} from 'react-intl';

import type {ComponentPlaceholder} from '@/components/designer/types';
import {COMPONENT_PLACEHOLDER_TYPE} from '@/components/designer/types';
import {getRegistryEntry} from '@/registry';
import {hasOwnProperty} from '@/types';

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

    const {getChildComponents} = getRegistryEntry(component.type);

    const children = getChildComponents ? getChildComponents(component) : [];
    if (!children.length) continue;

    yield* iterComponents(children);
  }
}

/**
 * Recursively find all component keys that start with the given string.
 */
const findComponentKeysStartingWith = (
  startsWith: string,
  componentNamespace: AnyComponentSchema[]
): string[] => {
  const similarKeys: string[] = [];

  for (const component of iterComponents(componentNamespace)) {
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
