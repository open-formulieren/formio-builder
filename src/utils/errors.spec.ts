import {getErrorNames} from './errors';

test.each([
  [{}, []],
  [{foo: 'bar'}, ['foo']],
  [{foo: undefined}, []],
  [{foo: ''}, []],
])(
  'Error names for simple objects (errors: %s)',
  (obj: Record<string, string | undefined>, expected: string[]) => {
    const names = getErrorNames(obj);

    expect(names).toEqual(expected);
  }
);

test.each([
  [{nested: ['error 1', 'error 2']}, ['nested', 'nested.0', 'nested.1']],
  [{nested: ['']}, []],
  [{nested: []}, []],
  [{nested: [undefined]}, []],
  [{nested: [undefined, 'error 2']}, ['nested', 'nested.1']],
])(
  'Error names for array fields (errors: %s)',
  (obj: Record<string, Array<string | undefined>>, expected) => {
    // The 'undefined' should not be there, but array helpers behave weirdly, see
    // https://github.com/jaredpalmer/formik/issues/1811#issuecomment-552029935.
    // @ts-expect-error
    const names = getErrorNames(obj);

    expect(names).toEqual(expected);
  }
);

test.each([
  [{foo: {bar: 'error!'}}, ['foo', 'foo.bar']],
  [{foo: {bar: ''}}, []],
  [{foo: {bar: undefined}}, []],
  [{foo: {bar: 'error!', baz: undefined}}, ['foo', 'foo.bar']],
])(
  'Error names for nested objects (errors: %s)',
  (obj: Record<string, Record<string, string | undefined> | undefined>, expected: string[]) => {
    // The 'undefined' should not be there, but array helpers behave weirdly, see
    // https://github.com/jaredpalmer/formik/issues/1811#issuecomment-552029935.
    // @ts-expect-error
    const names = getErrorNames(obj);

    expect(names).toEqual(expected);
  }
);

type ArrayWithNested = (string | Record<string, string | undefined | Record<string, string>>)[];

test.each([
  [{foo: [{bar: 'error!'}]}, ['foo', 'foo.0', 'foo.0.bar']],
  [{foo: [{bar: 'error!'}, 'error 2']}, ['foo', 'foo.0', 'foo.0.bar', 'foo.1']],
  [{foo: [{bar: undefined}]}, []],
  [{foo: [{bar: ''}]}, []],
  [{foo: [{bar: ''}, {baz: {quux: 'error!'}}]}, ['foo', 'foo.1', 'foo.1.baz', 'foo.1.baz.quux']],
])(
  'Error names for arrays with nested objects (errors: %s)',
  (obj: Record<string, ArrayWithNested | undefined>, expected: string[]) => {
    // The 'undefined' should not be there, but array helpers behave weirdly, see
    // https://github.com/jaredpalmer/formik/issues/1811#issuecomment-552029935.
    // @ts-expect-error
    const names = getErrorNames(obj);

    expect(names).toEqual(expected);
  }
);
