import type {DragOverEvent, Droppable} from '@dnd-kit/dom';
import type {SortableDroppable} from '@dnd-kit/dom/sortable';
import {Point} from '@dnd-kit/geometry';
import {isSortable} from '@dnd-kit/react/sortable';

import type {ComponentDefinition} from '@/components/designer/types';
import {isPlaceholder} from '@/formio';

import {isDropzoneId} from './dropzone';

export const getTargetDropzoneId = (target: Droppable | null | undefined): string | undefined => {
  if (!target) return undefined;

  if (isSortable(target)) {
    return String(target.group);
  }

  const id = String(target.id);
  if (isDropzoneId(id)) {
    return id;
  }

  return undefined;
};

export const getTargetIndex = (
  operation: DragOverEvent['operation'],
  dropzoneComponents: ComponentDefinition[]
): number | undefined => {
  const {target, source, position} = operation;

  if (!target) return undefined;
  // The source is either a placeholder or a sortable item.
  const sourceIndex = isSortable(source)
    ? source.index
    : dropzoneComponents.findIndex(isPlaceholder);
  const sourceIsPlaceholderInDropzone = !isSortable(source) && sourceIndex !== -1;

  if (isSortable(target)) {
    const targetIndex = getSortableInsertionIndex(position.current.y, target);

    // We need to normalize the target index if the source is a placeholder or if the
    // target and source are in the same dropzone.
    return sourceIsPlaceholderInDropzone || (isSortable(source) && source.group === target.group)
      ? normalizeMoveIndex(sourceIndex, targetIndex)
      : targetIndex;
  }

  const id = String(target.id);
  if (isDropzoneId(id)) {
    // If there are no components in the dropzone, just add it to the start.
    if (dropzoneComponents.length === 0) return 0;

    const targetIndex = getDropzoneInsertionIndex(position.current.y, dropzoneComponents);
    if (targetIndex === null) {
      return dropzoneComponents.length;
    }

    // We need to normalize the target index if the source is a placeholder or if the
    // source is already inside the target dropzone.
    return sourceIsPlaceholderInDropzone || (isSortable(source) && source.group === id)
      ? normalizeMoveIndex(sourceIndex, targetIndex)
      : targetIndex;
  }

  return undefined;
};

const normalizeMoveIndex = (sourceIndex: number, targetIndex: number): number => {
  // target.index refers to position of the target element the rendered list, including
  // the source.
  // When moving the source, we remove it from its initial position and insert it at the
  // new position. So the new position should account for the shift in the rendered list.
  return sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
};

/**
 * Get the insertion index for a sortable target.
 *
 * Using the current pointer position, determine the insertion index for the target. When
 * the pointer is at the bottom of the target, place the new element below the target,
 * otherwise above it.
 */
const getSortableInsertionIndex = (pointerY: number, target: SortableDroppable<object>): number => {
  const targetCenter = target.shape?.center;
  const isBelow = targetCenter !== undefined && pointerY > targetCenter.y;

  return target.index + (isBelow ? 1 : 0);
};

/**
 * Get the insertion index for a dropzone target.
 *
 * Using the current pointer position and the list of dropzone components, determine the
 * insertion index for the target. Search the DOM for the dropzone elements, calculate
 * the distance to the pointer, and choose the closest element as target.
 *
 * When the pointer is at the bottom of the target, place the new element below the
 * target, otherwise above it.
 */
const getDropzoneInsertionIndex = (
  pointerY: number,
  dropzoneComponents: ComponentDefinition[]
): number | null => {
  const insertion = dropzoneComponents.reduce(
    (carry, component, index) => {
      if (isPlaceholder(component)) return carry;

      const element = window.document.getElementById(`sortable-item-${component.id}`);
      if (!element) return carry;

      const rect = element.getBoundingClientRect();

      // Calculate the distance from the center of the element to the pointer.
      const centerY = rect.top + rect.height / 2;
      const distance = Point.distance({x: 0, y: centerY}, {x: 0, y: pointerY});

      // Get the element which is the closest to the pointer.
      if (carry.distance === null || distance < carry.distance) {
        return {
          distance,
          centerY,
          index,
        };
      }

      return carry;
    },
    {distance: null, centerY: null, index: null}
  );

  // Realistically, the insertion index should never be null.
  if (insertion.index === null) {
    return null;
  }

  const isBelow = pointerY > insertion.centerY;
  return insertion.index + (isBelow ? 1 : 0);
};
