import {OpenFormsComponentSchemaBase} from './schemas';

export * from './schemas';

export type JSONPrimitive = string | number | boolean | null;

export type JSONType =
  | JSONPrimitive
  | JSONType[]
  | {
      [key: string]: JSONType;
    };

export interface EditFormComponentSchema extends OpenFormsComponentSchemaBase {
  id: string;
}

export type ExtendedEditFormComponentSchema = EditFormComponentSchema & {
  [key: string]: JSONType;
};
