import type {CollisionDetector} from '@dnd-kit/abstract';
import {defaultCollisionDetection} from '@dnd-kit/collision';

export const collisionDetection: CollisionDetector = input => {
  const {dragOperation, droppable} = input;
  const {position} = dragOperation;

  if (!droppable.shape) {
    return null;
  }

  const pointerY = position.current.y;
  const {top, bottom} = droppable.shape.boundingRectangle;
  const threshold = 4;

  const distanceTop = pointerY - top;
  const distanceBottom = bottom - pointerY;
  const isOverThreshold = [distanceTop, distanceBottom].some(d => d <= threshold);

  if (isOverThreshold) {
    return null;
  }

  return defaultCollisionDetection(input);
};
