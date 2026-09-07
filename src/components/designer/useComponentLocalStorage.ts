import type {AnyComponentSchema} from '@open-formulieren/types';
import useLocalStorageState from 'use-local-storage-state';

export const useComponentLocalStorage = () => {
  return useLocalStorageState<AnyComponentSchema | undefined>(
    'OFFB-form-designer-copy-paste-content'
  );
};
