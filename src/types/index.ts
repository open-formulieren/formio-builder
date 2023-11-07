export * from './schemas';
export * from './paths';

// https://fettblog.eu/typescript-hasownproperty/
export function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop);
}

/**
 * Filter a given type by a given expected value type.
 *
 * E.g. with a type:
 *
 * interface Test {
 *   foo: string;
 *   bar: string;
 *   baz: number;
 * };
 *
 * FilterByValueType<Test, string> == {foo: string, bar: string}
 *
 * See https://stackoverflow.com/a/63990350
 */
export type FilterByValueType<T, VT> = {
  [P in keyof T as T[P] extends VT ? P : never]: T[P];
};
