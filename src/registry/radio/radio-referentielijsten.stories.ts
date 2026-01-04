import {RadioComponentSchema} from '@open-formulieren/types';
import {Meta, StoryObj} from '@storybook/react';
import {expect, fn, userEvent, waitFor, within} from '@storybook/test';

import ComponentEditForm from '@/components/ComponentEditForm';
import {rsSelect} from '@/utils/storybookTestHelpers';

export default {
  title: 'Builder components/Radio/Reference lists',
  component: ComponentEditForm,
  parameters: {
    builder: {enableContext: true},
  },
  args: {
    isNew: true,
    component: {
      id: 'wqimsadk',
      type: 'radio',
      key: 'radio',
      label: 'A radio field',
      openForms: {
        dataSrc: 'manual',
        translations: {},
      },
      values: [{value: '', label: ''}],
      defaultValue: '',
    } satisfies RadioComponentSchema,
    onCancel: fn(),
    onRemove: fn(),
    onSubmit: fn(),
    builderInfo: {
      title: 'Radio',
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
        type: 'radio',
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
        type: 'radio',
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
        type: 'radio',
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

export const AutoSelectIfOnlyOneReferenceListsService: Story = {
  name: 'If there is only one reference lists service: automatically select it',
  parameters: {
    builder: {
      enableContext: true,
      defaultServices: [
        {
          url: 'http://localhost:8000/api/v2/services/70',
          slug: 'reference-lists',
          label: 'Reference lists',
          apiRoot: 'http://localhost:8004/api/v1/',
          apiType: 'orc',
        },
      ],
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const dataSourceInput = canvas.getByLabelText('Data source');
    await rsSelect(canvas, dataSourceInput, 'Reference lists API');

    const serviceInput = canvas.getByLabelText('Reference lists service');

    await waitFor(() => {
      expect(serviceInput.parentElement?.parentElement).toHaveTextContent('Reference lists');
    });
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
        type: 'radio',
      })
    );
  },
};

export const ServiceAndTableRequired: Story = {
  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    const dataSourceInput = canvas.getByLabelText('Data source');
    await rsSelect(canvas, dataSourceInput, 'Reference lists API');

    await userEvent.click(canvas.getByRole('button', {name: 'Save'}));

    expect(await canvas.findByText('You must select a table.')).toBeVisible();
    expect(args.onSubmit).not.toHaveBeenCalled();
  },
};
