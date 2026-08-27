import type {AnyComponentSchema} from '@open-formulieren/types';

import {COMPONENT_PLACEHOLDER_TYPE} from '@/components/designer/types';
import type {ComponentDefinition, ComponentPlaceholder} from '@/components/designer/types';
import {getRegistryEntry} from '@/registry';
import {hasOwnProperty} from '@/types';

interface IterComponentsResult {
  /**
   * The index of the current item.
   */
  index: number;
  /**
   * The path to the current item.
   */
  dataPath: string;
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
export function* iterComponents(
  componentDefinitions: ComponentDefinition[],
  parentKeysPrefix: string = ''
): Generator<IterComponentsResult> {
  for (const [index, component] of componentDefinitions.entries()) {
    const dataPath = [parentKeysPrefix, hasOwnProperty(component, 'key') ? component.key : '']
      .filter(Boolean)
      .join('.');

    yield {index, component, dataPath, collection: componentDefinitions};
    if (isPlaceholder(component)) continue;

    const {getComponentSlots} = getRegistryEntry(component.type);
    if (!getComponentSlots) continue;

    for (const slot of getComponentSlots(component)) {
      yield* iterComponents(
        slot.collection,
        slot.useReferenceInComponentDataPath
          ? [parentKeysPrefix, slot.reference].filter(Boolean).join('.')
          : parentKeysPrefix
      );
    }
  }
}

export const findComponent = (
  componentDefinitions: AnyComponentSchema[],
  componentKey: string
): AnyComponentSchema | null => {
  for (const {component, dataPath} of iterComponents(componentDefinitions)) {
    if (!isPlaceholder(component) && dataPath === componentKey) {
      return component;
    }
  }
  return null;
};

export const isPlaceholder = (
  component: ComponentDefinition
): component is ComponentPlaceholder => {
  return component.type === COMPONENT_PLACEHOLDER_TYPE;
};
