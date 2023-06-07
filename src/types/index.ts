export * from './schemas';

export type JSONPrimitive = string | number | boolean | null;

export type JSONType =
  | JSONPrimitive
  | JSONType[]
  | {
      [key: string]: JSONType;
    };

// https://fettblog.eu/typescript-hasownproperty/
export function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop);
}
