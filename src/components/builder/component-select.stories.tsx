import type {Meta, StoryObj} from '@storybook/react-vite';
import {expect, userEvent, within} from 'storybook/test';

import {withFormik} from '@/sb-decorators';

import ComponentSelect from './component-select';

const COMPONENT_TREE = [
  {type: 'textfield', key: 'text1', label: 'Textfield 1'},
  {
    type: 'fieldset',
    key: 'fieldset1',
    label: 'Fieldset 1',
    components: [
      {type: 'textfield', key: 'text2', label: 'Textfield 2'},
      {type: 'number', key: 'nested.number1', label: 'Nested number'},
    ],
  },
  {
    type: 'columns',
    key: 'columns',
    label: 'Columns',
    columns: [
      {
        size: 6,
        sizeMobile: 4,
        components: [{type: 'textfield', key: 'text3', label: 'Textfield 3'}],
      },
      {
        size: 6,
        sizeMobile: 4,
        components: [],
      },
    ],
  },
  {
    type: 'editgrid',
    key: 'editgrid',
    label: 'Repeating group',
    hideLabel: false,
    groupLabel: 'Group',
    disableAddingRemovingRows: false,
    components: [{type: 'textfield', key: 'text4', label: 'Textfield 4'}],
  },
];

type Story = StoryObj<typeof ComponentSelect>;

export default {
  title: 'Formio/Builder/ComponentSelect',
  component: ComponentSelect,
  decorators: [withFormik],
  parameters: {
    controls: {hideNoControlsWarning: true},
    docs: {
      source: {
        type: 'dynamic',
        excludeDecorators: true,
      },
      // https://github.com/bbbtech/storybook-formik/issues/51#issuecomment-1136668271
      inlineStories: false,
      iframeHeight: 200,
    },
    modal: {noModal: true},
    builder: {enableContext: true},
    formik: {
      initialValues: {aComponent: ''},
    },
  },
  args: {
    name: 'aComponent',
    label: 'Select component',
    required: false,
    tooltip: '',
    isClearable: true,
    componentTree: COMPONENT_TREE,
  },
} as Meta<typeof ComponentSelect>;

export const Default: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByLabelText('Select component'));
    const componentSelectMenu = await canvas.getByRole('listbox');

    // Validate that fieldset and column components are not present
    expect(within(componentSelectMenu).queryByText('Columns (columns)')).not.toBeInTheDocument();
    expect(
      within(componentSelectMenu).queryByText('Fieldset 1 (fieldset1)')
    ).not.toBeInTheDocument();

    // The editgrid component should be an option
    expect(within(componentSelectMenu).getByText('Repeating group (editgrid)')).toBeVisible();

    // Validate that the path of editgrid children is correct
    expect(within(componentSelectMenu).getByText('Textfield 4 (editgrid.text4)')).toBeVisible();
  },
};
