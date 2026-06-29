import type {
  ColumnsComponentSchema,
  EditGridComponentSchema,
  FieldsetComponentSchema,
} from '@open-formulieren/types';

export const MAIN_DROPZONE_ID = 'main-dropzone';
const DROPZONE_SUFFIX = '-dropzone';

export const isDropzoneId = (id: string) => id.endsWith(DROPZONE_SUFFIX);

export const getDropzoneId = (component: EditGridComponentSchema | FieldsetComponentSchema) =>
  `${component.key}${DROPZONE_SUFFIX}`;

export const getColumnDropzoneId = (component: ColumnsComponentSchema, columnIndex: number) => {
  return `${component.key}.${columnIndex}${DROPZONE_SUFFIX}`;
};

export const getComponentKeyFromDropzoneId = (id: string) => id.replace(DROPZONE_SUFFIX, '');
