import {SelectboxesComponentSchema} from '@open-formulieren/types';

import {Paths} from './paths';

// type F = Paths<SelectboxesComponentSchema>;
// type G = PathsForValueType<SelectboxesComponentSchema, Option[]>;

interface SomeProps<T> {
  name: Paths<T>;
}

export function Component<T>({name}: SomeProps<T>) {
  return <>{name}</>;
}

export const Foo: React.FC = () => (
  <Component<{
    a: string;
    b: {
      c: string;
    };
    d: string[];
  }> name="a" />
);

export const Bar: React.FC = () => <Component<SelectboxesComponentSchema> name="values" />;
