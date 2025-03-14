import {Meta, StoryObj} from '@storybook/react';
import {expect, fn, userEvent, within} from '@storybook/test';

import ComponentEditForm from '@/components/ComponentEditForm';
import {rsSelect} from '@/utils/storybookTestHelpers';

export default {
  title: 'Builder components/Select/Reference lists',
  component: ComponentEditForm,
  parameters: {
    builder: {enableContext: true},
  },
  args: {
    isNew: true,
    component: {
      id: 'wqimsadk',
      type: 'select',
      key: 'select',
      label: 'A select field',
      dataSrc: 'values',
      dataType: 'string',
      openForms: {
        dataSrc: 'manual',
        translations: {},
      },
      data: {values: [{value: '', label: ''}]},
      values: [{value: '', label: ''}],
      defaultValue: '',
    },
    onCancel: fn(),
    onRemove: fn(),
    onSubmit: fn(),
    builderInfo: {
      title: 'Select',
      icon: 'plus-square',
      group: 'basic',
      weight: 60,
      schema: {},
    },
  },
} as Meta<typeof ComponentEditForm>;

type Story = StoryObj<typeof ComponentEditForm>;

export const StoreValuesInComponent: Story = {
  name: 'On save: store proper values in the component',
  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    const dataSourceInput = canvas.getByLabelText('Data source');
    await rsSelect(canvas, dataSourceInput, 'Reference lists API');

    const serviceInput = canvas.getByLabelText('Reference lists service');
    await rsSelect(canvas, serviceInput, 'Reference lists 1');

    const codeInput = canvas.getByLabelText('Reference lists table code');
    await rsSelect(canvas, codeInput, 'Table 2 (no longer valid)');

    await userEvent.click(canvas.getByRole('button', {name: 'Save'}));

    expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        openForms: {
          code: 'table2',
          dataSrc: 'referentielijsten',
          service: 'reference-lists',
          translations: {},
        },
        type: 'select',
      })
    );
  },
};

export const SwitchToVariableResetOptions: Story = {
  name: 'On switch from reference lists to variable: reset the options',
  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    const dataSourceInput = canvas.getByLabelText('Data source');
    await rsSelect(canvas, dataSourceInput, 'Reference lists API');

    const serviceInput = canvas.getByLabelText('Reference lists service');
    await rsSelect(canvas, serviceInput, 'Reference lists 1');

    const codeInput = canvas.getByLabelText('Reference lists table code');
    await rsSelect(canvas, codeInput, 'Table 2 (no longer valid)');

    await rsSelect(canvas, dataSourceInput, 'From variable');

    const itemsExpressionInput = canvas.getByTestId('jsonEdit');
    await userEvent.clear(itemsExpressionInput);
    await userEvent.type(itemsExpressionInput, '"foo"');

    await userEvent.click(canvas.getByRole('button', {name: 'Save'}));

    expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        openForms: {
          dataSrc: 'variable',
          itemsExpression: 'foo',
          translations: {},
        },
        type: 'select',
      })
    );
  },
};

export const WithReferenceListsOptions: Story = {
  name: 'With reference lists options',
  parameters: {
    builder: {
      defaultReferenceListsTables: [
        {
          code: 'countries',
          naam: 'Countries',
          isGeldig: true,
        },
      ],
    },
  },
  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    const dataSourceInput = canvas.getByLabelText('Data source');
    await rsSelect(canvas, dataSourceInput, 'Reference lists API');

    const serviceInput = canvas.getByLabelText('Reference lists service');
    await rsSelect(canvas, serviceInput, 'Reference lists 1');

    const codeInput = canvas.getByLabelText('Reference lists table code');
    await rsSelect(canvas, codeInput, 'Countries');

    await userEvent.click(canvas.getByRole('button', {name: 'Save'}));

    expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        openForms: {
          code: 'countries',
          dataSrc: 'referentielijsten',
          service: 'reference-lists',
          translations: {},
        },
        type: 'select',
      })
    );
  },
};
