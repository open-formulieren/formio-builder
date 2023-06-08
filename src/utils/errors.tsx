import {FormikErrors, useFormikContext} from 'formik';

import {OpenFormsComponentSchemaBase} from '@/types';

export function getErrorNames<Values = unknown>(errors: FormikErrors<Values>): string[] {
  const names: string[] = [];
  Object.entries(errors).forEach(([key, nested]) => {
    // TODO: finish implementation
    if (Array.isArray(nested)) {
      const nestedNames = nested.map((item, index) => {
        if (typeof item === 'string') {
          if (item) {
            return [`${key}.${index}`];
          } else {
            return [];
          }
        } else {
          const nested = getErrorNames(item);
          return nested.map(name => `${key}.${index}.${name}`);
        }
      });
      names.push(...nestedNames.flat(1));
    } else if (typeof nested === 'string') {
      names.push(key);
    } else if (typeof nested === 'object' && nested !== null) {
      const nestedNames = getErrorNames(nested);
      if (nestedNames.length) {
        names.push(key);
      }
      names.push(...nestedNames.map(n => `${key}.${n}`));
    }
  });
  return names;
}

interface ValidationErrors {
  hasErrors: boolean;
  errors: string[];
}

export const useValidationErrors = (name: string): ValidationErrors => {
  const {getFieldMeta} = useFormikContext<OpenFormsComponentSchemaBase>();
  const {error} = name ? getFieldMeta(name) : {error: ''};
  const errors = name && error ? [error] : [];
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
