// These can cause infinite recursions, and since we're dealing with JSON-serializable
// data only, the keys of the objects must be strings.
type ExcludeBareObject<T> = T extends Record<string, unknown>
  ? T extends Function
    ? never
    : T
  : never;

/**
 * Constructs a union of possible paths (as dotted strings) into a given object type.
 *
 * This is intended to take any of the `AnyComponentSchema` members and use it to
 * perform prop validation in React components, for example.
 *
 * Okay, so how does it work?
 *
 *  - the first T extends T seems to be excessive, but the [keyof T] indexed access
 *    types operate differently on unions - they only access the keys common to all the
 *    members in the union. Some of our schema types are unions, so to capture all
 *    possible access paths, we need to force distribution over each member in the union,
 *    which is done through a conditional type
 *
 *  - once inside of that, we know that T is an object (or that's the expectation at
 *    least) and we apply a mapped type - the keys are all possible keys in T, and each
 *    optional key is made required (that's the `-?` modifier).
 *
 *  - the values in the mapped type are checked first with a conditional type - we only
 *    care about string keys (because JSON serializable data is expected), so this does
 *    not return array indices either (by design - we handle an array of values as a
 *    single value in Formik), that's the `K extends string`.
 *
 *    When we have a string key, we check if we need to recurse by looking at the value
 *    type. The value type is looked up via `T[K]`. If it's not a (nested) object, the
 *    value returns just the key `K`. So for a type `{a: string}`, this mapped type
 *    results in `{a: 'a'}`
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
 *
 *  - The `ExcludeBareObject` helper type is required because potentially the recursion
 *    steps into a generic/bare `Object` type which recurses infintely, and TS can't deal
 *    with that. Formio type definitions happen to use those in some places in their
 *    source code and unfortunately those aren't easily patched/fixed.
 */
export type Paths<T> = T extends T
  ? {
      [K in keyof T]-?: K extends string
        ? ExcludeBareObject<T[K]> extends object
          ? K | `${K}.${Paths<ExcludeBareObject<T[K]>>}`
          : K
        : never;
    }[keyof T]
  : never;

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
