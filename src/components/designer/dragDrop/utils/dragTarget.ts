import type {Droppable} from '@dnd-kit/dom';
import {isSortable} from '@dnd-kit/react/sortable';

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
  target: Droppable | null,
  dropzoneFieldsLength: number
): number | undefined => {
  if (!target) return undefined;

  if (isSortable(target)) {
    return target.index;
  }

  const id = String(target.id);
  if (isDropzoneId(id)) {
    return dropzoneFieldsLength;
  }

  return undefined;
};
