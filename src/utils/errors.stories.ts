import {expect} from '@storybook/jest';

import {getErrorNames} from './errors';

export default {
  title: 'Utils / Validation errors',
  parameters: {
    controls: {disable: true},
    modal: {noModal: true},
  },
};

// TODO: convert to jest tests

interface Values {
  toplevel: any;
  parent: {
    nested: any;
  };
  array: any[];
  nestedArray: {
    child: any;
  }[];
}

export const GetErrorNames = () => 'no visual aspect, tests only';
GetErrorNames.play = async () => {
  const errors = {
    toplevel: 'someError',
    parent: {
      nested: 'someError,',
    },
    array: ['', 'someError'],
    nestedArray: [{child: 'someError'}],
  };

  const names = getErrorNames<Values>(errors);

  expect(names).toEqual(['toplevel', 'parent', 'parent.nested', 'array.1', 'nestedArray.0.child']);
};
