type Primitive = string | number | boolean | undefined | null;

/**
 * Constructs a union of possible paths (as dotted strings) into a given object type.
 *
 * This is intended to take any of the `AnyComponentSchema` members and use it to
 * perform prop validation in React components, for example.
 *
 * Okay, so how does it work?
 *
 *  - First, we check if the type var is a primitive - mapping over those doesn't make
 *    any sense as there is nothing to dive into. If it is primitive, we hit the 'never'
 *    branch and evaluation stops.
 *
 *  - Additionally, this conditional type causes schemas that are a union to be mapped
 *    over, rather than the [keyof T] indexed access being limited to the *intersection*
 *    of common keys in all union members. So, this ensures that all the discriminated
 *    union members are processed individually.
 *
 *  - Once inside the first conditional, we now know T is an object and apply a mapped
 *    type over its keys. If a key is optional, it's made required (that's the `-?`
 *    modifier), to ensure we loop over all possible keys, required or optional.
 *
 *  - the values in the mapped type are checked first with a conditional type - we only
 *    care about string keys (because JSON serializable data is expected), so this does
 *    not return array indices either (by design - we handle an array of values as a
 *    single value in Formik), that's the `K extends string`. Possibly in the future we
 *    can extend this to return a `foo[${number}].bar` type to allow specific indices,
 *    but that's currently out of scope.
 *
 *    When we have a string key, we check if we need to recurse by looking at the value
 *    type. The value type is looked up via `T[K]`. If it's not a (nested) object, the
 *    value returns just the key `K`. So for a type `{a: string}`, this mapped type
 *    results in `{a: 'a'}`. We ignore functions, since those are not values that can
 *    be set or managed through HTML forms.
 *
 *    If the value type is an object though, then we recurse and we prefix the current
 *    key. A type `{a: {b: string}}` then becomes (in steps):
 *
 *    1. `{a: 'a' | a.Paths<{b: string}>}`
 *    2. `{a: 'a' | 'a.b'}` (because b only has a leaf node and returns `'b'``)
 *
 *  - 'finally', we grab all the values of the mapped type as a union via `[keyof T]`,
 *    so this turns the mapped type `{a: 'a', b: 'b'}` into the union `'a' | 'b'`
 *
 *    When dealing with recursion/nested objects, the progression sort of looks like
 *    the following for the example type `{a: {b: string, c: string}}`
 *
 *    1. `{a: 'a' | <prefix-and-recurse for key a>}`
 *    2. recurse for a: `{b: 'b', c: 'c'}
 *    3. grab the values (end of recursion reached): `{b: 'b', c: 'c'}['b' | 'c']` -> `'b' | 'c'`
 *    4. exit recursion, apply the prefix on the recursion result: `'a.b' | 'a.c'`
 *    5. join the access paths for a and from a: `{a: 'a' | ('a.b' | 'a.c')}`
 *    6. grab the values via the indexed access: `{a: 'a' | ('a.b' | 'a.c')}['a']`
 *    7. final result: `'a' | 'a.b' | 'a.c'`
 */
export type Paths<T> = T extends Primitive | Primitive[]
  ? never
  : {
      [K in keyof T]-?: K extends string
        ? T[K] extends Primitive | Primitive[]
          ? K
          : T[K] extends Function
          ? never
          : K | `${K}.${Paths<T[K]>}`
        : never;
    }[keyof T];

export type GetValueAtPath<T, Path extends string> = T extends T
  ? Path extends `${infer P}.${infer Rest}`
    ? P extends keyof T
      ? GetValueAtPath<T[P], Rest>
      : never
    : Path extends keyof T
    ? T[Path]
    : never
  : never;

export type PathsForValueType<T, V> = keyof {
  [P in Paths<T> as GetValueAtPath<T, P> extends V ? P : never]: true;
};
