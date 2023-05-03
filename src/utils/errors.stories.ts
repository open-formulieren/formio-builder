import {expect} from '@storybook/jest';

import {getErrorNames} from './errors';

export default {
  title: 'Utils / Validation errors',
  parameters: {
    controls: {disable: true},
    modal: {noModal: true},
  },
};

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

  const names = getErrorNames(errors);

  expect(names).toEqual(['toplevel', 'parent', 'parent.nested', 'array.1', 'nestedArray.0.child']);
};
