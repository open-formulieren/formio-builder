export type JSONType =
  | string
  | number
  | boolean
  | null
  | JSONType[]
  | {
      [key: string]: JSONType;
    };
