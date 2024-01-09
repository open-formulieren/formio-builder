import type {AnyComponentSchema} from '@open-formulieren/types';
import {FormikErrors, useFormikContext} from 'formik';

import type {Paths} from '@/types';

/**
 * Provides tools to introspect validation errors for Formik-based forms.
 */
export function useErrorChecker<Values = unknown>() {
  type ErrorPath = Paths<Values>;
  const {errors} = useFormikContext<Values>();
  const pathsWithErrors: ErrorPath[] = getErrorNames<Values>(errors);

  /**
   * Check if there currently are any validation errors for the provided (partial) paths.
   *
   * Example usage:
   *
   *   hasAnyError(errors, 'key', 'defaultValue', 'validate.maxLength')
   *
   * @param errors - The Formik validation errors structure.
   */
  function hasAnyError(...paths: ErrorPath[]): boolean {
    // if no paths are provided, there is no filter, so return if there is *any*
    // validation error.
    if (!paths.length) {
      return pathsWithErrors.length > 0;
    }
    // otherwise, check if there is overlap between the array of errored paths and
    // specified paths.
    // In the future, we should be able to use Set.prototype.intersection for this.
    return paths.some(p => pathsWithErrors.includes(p));
  }

  return {
    hasAnyError,
  };
}

/**
 * Recursively look up the names of fields that have errors, and join them using
 * path-syntax.
 *
 * Example:
 *
 *   getErrorNames({foo: {bar: 'an error!'}})
 *   // ['foo', ['foo.bar']]
 *
 * @private
 */
export function getErrorNames<T>(errors: FormikErrors<T>): Paths<T>[] {
  const names: string[] = [];

  // Iterating over objects is surprisingly hard/annoying in TS due to JS' quirks, see
  // https://effectivetypescript.com/2020/05/26/iterate-objects/
  let k: keyof T & string;
  for (k in errors) {
    const error = errors[k];
    // if there is nothing to display (error is undefined or empty string), then the
    // field may not be marked as having errors. This function is primarily used when
    // determining which edit form tabs/groups of fields have errors to draw the
    // attention of users.
    if (!error) continue;

    switch (typeof error) {
      case 'string': {
        names.push(k);
        break;
      }

      case 'object': {
        let nestedNames: string[] = [];

        if (Array.isArray(error)) {
          // if the error is an array, the values must also be an array. However, typescript
          // cannot infer this by itself.
          type Item = T[typeof k] extends Array<infer I> ? I : never;

          error.forEach((item, index) => {
            // same condition as earlier
            if (!item) return;

            switch (typeof item) {
              // a single error, for the entire object in the array. Could be because of
              // validation after each field was individually validated.
              case 'string': {
                nestedNames.push(index.toString());
                break;
              }
              case 'object': {
                const deepNested = getErrorNames<Item>(item).map(n => `${index}.${n}`);
                if (deepNested.length) {
                  nestedNames.push(index.toString(), ...deepNested);
                }
                break;
              }
              default:
                throw new Error('Unexpected item type');
            }
          });
        } else {
          nestedNames = getErrorNames<T[typeof k]>(error);
        }
        if (nestedNames.length) {
          // include the parent to get all nodes from root -> error leaf node in the
          // list of errored fields
          const prefixed = nestedNames.map(n => `${k}.${n}`);
          names.push(k, ...prefixed);
        }
        break;
      }
      default:
        throw new Error('Unexpected error type');
    }
  }

  // Satisfying typescript seems to be quite a challenge here. There's definitely some
  // blame to JS quirks (see https://effectivetypescript.com/2020/05/26/iterate-objects/
  // for more background), but the combination of our Paths enum with (inferred)
  // string keys (from keyof Object + FormikErrors) doesn't place nice together either.
  //
  // There is also an aspect on our side - the Paths<> generic currently is *not* able
  // to figure out a naming pattern for arrays/lists (e.g. something like `foo[].bar`),
  // while we *do* return error names like `foo.1.bar` in this implementation.
  return names as Paths<T>[];
}

interface ValidationErrors {
  hasErrors: boolean;
  errors: string[];
}

export const useValidationErrors = (name: string): ValidationErrors => {
  const {getFieldMeta} = useFormikContext<AnyComponentSchema>();
  // FIXME: inferred type says string, but for nested objects this can be an object itself!
  const {error} = name ? getFieldMeta(name) : {error: ''};
  const errors = name && error && typeof error === 'string' ? [error] : [];
  return {
    hasErrors: errors.length > 0,
    errors,
  };
};

export interface ErrorListProps {
  errors: string[];
}

export const ErrorList: React.FC<ErrorListProps> = ({errors}) => (
  <div className="formio-errors invalid-feedback">
    {errors.map((error, index) => (
      <div key={index} className="form-text error">
        {error}
      </div>
    ))}
  </div>
);
