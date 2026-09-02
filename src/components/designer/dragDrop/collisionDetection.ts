import type {CollisionDetector} from '@dnd-kit/abstract';
import {CollisionType} from '@dnd-kit/abstract';
import type {BoundingRectangle, Coordinates} from '@dnd-kit/geometry';

/**
 * A custom collision detection that calculates the strength of the bounding rectangle
 * with the pointer.
 *
 * Because we deal with complex structures (dropzones inside dropzones) we cannot rely on
 * the standard dnd-kit collision detection.
 *
 * The strength of the target bounding rectangle helps us determine which target
 * (textfield, e-mail, fieldset, etc.) is the closest to the pointer. This in turn
 * determines where the dragged item will be placed.
 * (There is some additional logic in the `dragTarget.ts` util functions that determine
 * whether the dragged item is placed above or below the target).
 *
 * @param dragOperation - The current drag operation, containing the current pointer
 *                        position.
 * @param droppable - The target element (either a dropzone or a sortable item).
 */
export const collisionDetection: CollisionDetector = ({dragOperation, droppable}) => {
  if (!droppable.shape) {
    return null;
  }

  const pointer = dragOperation.position.current;
  const targetStrength = getBoundingStrength(pointer, droppable.shape.boundingRectangle);

  // If the pointer is outside the droppable area, don't detect collision.
  if (targetStrength === 0) {
    return null;
  }

  const priority = droppable.collisionPriority ?? 0;
  const priorityBoost = priority * 0.01;

  return {
    id: droppable.id,
    value: targetStrength + priorityBoost,
    type: CollisionType.Collision,
    priority,
  };
};

/**
 * Get the collision strength of the bounding rectangle in regard to the pointer.
 *
 * When the pointer is close to the edge of the bounding rectangle, the strength score is
 * lowered. This results in a smoother transition between the collision targets.
 *
 * With these scores, dnd-kit can determine which target is the most relevant.
 *
 * @param pointer - The current pointer position.
 * @param boundingRectangle - The bounding rectangle of the target.
 *
 * @returns The collision strength of the closest bounding rectangle edge.
 */
const getBoundingStrength = (
  pointer: Coordinates,
  boundingRectangle: BoundingRectangle
): number => {
  const threshold = 20;
  const {x: pointerX, y: pointerY} = pointer;
  const {top, left, right, bottom} = boundingRectangle;

  // Get the distance from the pointer to each edge of the bounding rectangle.
  const distanceTop = pointerY - top;
  const distanceLeft = pointerX - left;
  const distanceRight = right - pointerX;
  const distanceBottom = bottom - pointerY;

  // Determine the closest edge to the pointer.
  const distanceClosestEdge = Math.max(
    0,
    Math.min(distanceTop, distanceLeft, distanceRight, distanceBottom)
  );

  // Calculate the collision strength of the closest edge.
  return distanceClosestEdge < threshold ? distanceClosestEdge / threshold : 1;
};
