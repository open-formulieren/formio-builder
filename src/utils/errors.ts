import {FormikErrors} from 'formik';

export const getErrorNames = <Values = unknown>(errors: FormikErrors<Values>): string[] => {
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
};
