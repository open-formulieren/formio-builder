export * from './schemas';
export * from './paths';

/**
 * PropertyType extracts the type of a property given as `P` from the (union) type `T`.
 *
 * It helps narrowing down the property check on an object once it's established that
 * a property exists.
 */
type PropertyType<T, P extends PropertyKey> = T extends unknown
  ? P extends keyof T
    ? T[P]
    : never
  : never;

// https://fettblog.eu/typescript-hasownproperty/
export function hasOwnProperty<X extends object, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, PropertyType<X, Y>> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
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
