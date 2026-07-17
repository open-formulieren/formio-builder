import type {Validation, ValidatorNames} from '@open-formulieren/types/dist/validation';

export type SchemaWithValidation = Validation<ValidatorNames>;

// Ternary to force distribution over the schemas union
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PossibleValidatorErrorKeys<S extends SchemaWithValidation> = S extends any
  ? keyof Required<S>['errors']
  : never;
