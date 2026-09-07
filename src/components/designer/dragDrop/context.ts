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
  index?: number;
  dropzoneId?: string;
}

export const SortableItemContext = createContext<SortableItemContextType>({
  isDragging: false,
  index: 0,
  dropzoneId: '',
});

export const useSortableItemContext = () => useContext(SortableItemContext);
