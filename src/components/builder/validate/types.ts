import {Validation, ValidatorNames} from '@open-formulieren/types/dist/validation';

export type SchemaWithValidation = Validation<ValidatorNames>;

// Ternary to force distribution over the schemas union
export type PossibleValidatorErrorKeys<S extends SchemaWithValidation> = S extends any
  ? keyof Required<S>['errors']
  : never;
