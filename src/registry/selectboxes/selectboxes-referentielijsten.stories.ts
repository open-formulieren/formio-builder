import {Meta, StoryObj} from '@storybook/react';
import {expect, fn, userEvent, within} from '@storybook/test';

import ComponentEditForm from '@/components/ComponentEditForm';
import {rsSelect} from '@/utils/storybookTestHelpers';

export default {
  title: 'Builder components/Selectboxes/Reference lists',
  component: ComponentEditForm,
  parameters: {
    builder: {enableContext: true},
  },
  args: {
    isNew: true,
    component: {
      id: 'wqimsadk',
      type: 'selectboxes',
      key: 'selectboxes',
      label: 'A selectboxes field',
      openForms: {
        dataSrc: 'manual',
        translations: {},
      },
      values: [{value: '', label: ''}],
      defaultValue: {},
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
          dataSrc: 'referenceLists',
          service: 'reference-lists',
          translations: {},
        },
        type: 'selectboxes',
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
          name: 'Countries',
          isValid: true,
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
          dataSrc: 'referenceLists',
          service: 'reference-lists',
          translations: {},
        },
        type: 'selectboxes',
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
        type: 'selectboxes',
      })
    );
  },
};

export const SwitchToManualResetOptions: Story = {
  name: 'On switch from reference lists to manual: reset the options',
  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    const dataSourceInput = canvas.getByLabelText('Data source');
    await rsSelect(canvas, dataSourceInput, 'Reference lists API');

    const serviceInput = canvas.getByLabelText('Reference lists service');
    await rsSelect(canvas, serviceInput, 'Reference lists 1');

    const codeInput = canvas.getByLabelText('Reference lists table code');
    await rsSelect(canvas, codeInput, 'Table 2 (no longer valid)');

    await rsSelect(canvas, dataSourceInput, 'Manually fill in');

    const labelInput = canvas.getByTestId('input-values[0].label');
    await userEvent.type(labelInput, 'Foo');

    await userEvent.click(canvas.getByRole('button', {name: 'Save'}));

    expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        openForms: {
          dataSrc: 'manual',
          translations: {},
        },
        type: 'selectboxes',
        values: [
          {
            label: 'Foo',
            value: 'foo',
            openForms: {
              translations: {},
            },
          },
        ],
      })
    );
  },
};

export const ServiceAndTableRequired: Story = {
  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    const dataSourceInput = canvas.getByLabelText('Data source');
    await rsSelect(canvas, dataSourceInput, 'Reference lists API');
    await canvas.findByLabelText('Reference lists service');

    await userEvent.click(canvas.getByRole('button', {name: 'Save'}));

    expect(await canvas.findByText('You must select a table.')).toBeVisible();
    expect(args.onSubmit).not.toHaveBeenCalled();
  },
};
