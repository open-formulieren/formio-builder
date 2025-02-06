import {Meta, StoryObj} from '@storybook/react';
import {expect, fn, userEvent, waitFor, within} from '@storybook/test';

import ComponentEditForm from '@/components/ComponentEditForm';
import {BuilderContextDecorator} from '@/sb-decorators';
import {rsSelect} from '@/utils/storybookTestHelpers';

export default {
  title: 'Builder components/Radio/Referentielijsten',
  component: ComponentEditForm,
  decorators: [BuilderContextDecorator],
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
      dataSrc: 'values',
      dataType: 'string',
      openForms: {
        dataSrc: 'manual',
        translations: {},
      },
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
  play: async ({canvasElement, step, args}) => {
    const canvas = within(canvasElement);

    const dataSourceInput = canvas.getByLabelText('Data source');
    await rsSelect(canvas, dataSourceInput, 'Referentielijsten API');

    const serviceInput = canvas.getByLabelText('Referentielijsten service');
    await rsSelect(canvas, serviceInput, 'Referentielijsten');

    const codeInput = canvas.getByLabelText('Referentielijsten table code');
    await rsSelect(canvas, codeInput, 'Tabel 2 (niet meer geldig)');

    await userEvent.click(canvas.getByRole('button', {name: 'Save'}));

    expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        openForms: {
          code: 'tabel2',
          dataSrc: 'referentielijsten',
          service: 'referentielijsten',
          translations: {},
        },
        type: 'radio',
      })
    );
  },
};

export const SwitchToVariableResetOptions: Story = {
  name: 'On switch from referentielijsten to variable: reset the options',
  play: async ({canvasElement, step, args}) => {
    const canvas = within(canvasElement);

    const dataSourceInput = canvas.getByLabelText('Data source');
    await rsSelect(canvas, dataSourceInput, 'Referentielijsten API');

    const serviceInput = canvas.getByLabelText('Referentielijsten service');
    await rsSelect(canvas, serviceInput, 'Referentielijsten');

    const codeInput = canvas.getByLabelText('Referentielijsten table code');
    await rsSelect(canvas, codeInput, 'Tabel 2 (niet meer geldig)');

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
  name: 'On switch from referentielijsten to manual: reset the options',
  play: async ({canvasElement, step, args}) => {
    const canvas = within(canvasElement);

    const dataSourceInput = canvas.getByLabelText('Data source');
    await rsSelect(canvas, dataSourceInput, 'Referentielijsten API');

    const serviceInput = canvas.getByLabelText('Referentielijsten service');
    await rsSelect(canvas, serviceInput, 'Referentielijsten');

    const codeInput = canvas.getByLabelText('Referentielijsten table code');
    await rsSelect(canvas, codeInput, 'Tabel 2 (niet meer geldig)');

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

export const AutoSelectIfOnlyOneReferentielijstenService: Story = {
  name: 'If there is only one Referentielijsten service: automatically select it',
  parameters: {
    builder: {
      enableContext: true,
      defaultServices: [
        {
          url: 'http://localhost:8000/api/v2/services/70',
          slug: 'referentielijsten',
          label: 'Referentielijsten',
          apiRoot: 'http://localhost:8004/api/v1/',
          apiType: 'orc',
        },
      ],
    },
  },
  play: async ({canvasElement, step, args}) => {
    const canvas = within(canvasElement);

    const dataSourceInput = canvas.getByLabelText('Data source');
    await rsSelect(canvas, dataSourceInput, 'Referentielijsten API');

    const serviceInput = canvas.getByLabelText('Referentielijsten service');

    await waitFor(() => {
      expect(serviceInput.parentElement?.parentElement).toHaveTextContent('Referentielijsten');
    });
  },
};
