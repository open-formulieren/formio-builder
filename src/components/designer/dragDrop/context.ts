import {createContext, useContext} from 'react';

interface DropzoneContextType {
  collisionPriority: number;
}

export const DropzoneContext = createContext<DropzoneContextType>({
  collisionPriority: 0,
});

export const useDropzoneContext = () => useContext(DropzoneContext);

interface SortableItemContextType {
  isDragging: boolean;
}

export const SortableItemContext = createContext<SortableItemContextType>({
  isDragging: false,
});

export const useSortableItemContext = () => useContext(SortableItemContext);
