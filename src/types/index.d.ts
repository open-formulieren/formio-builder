import {ExtendedComponentSchema} from 'formiojs/types/components/schema';

export type JSONType =
  | string
  | number
  | boolean
  | null
  | JSONType[]
  | {
      [key: string]: JSONType;
    };

export interface EditFormComponentSchema extends ExtendedComponentSchema {
  id: string;
}
