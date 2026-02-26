import {
  RadioComponentSchema,
  SelectComponentSchema,
  SelectboxesComponentSchema,
} from '@open-formulieren/types';
import {Meta, StoryObj} from '@storybook/react-vite';
import {Form, Formik} from 'formik';
import {expect, fireEvent, fn, userEvent, waitFor, within} from 'storybook/test';

import {withFormik} from '@/sb-decorators';

import ValuesConfig from './values-config';

export default {
  title: 'Formio/Builder/Values/ValuesConfig',
  component: ValuesConfig,
  parameters: {
    controls: {hideNoControlsWarning: true},
    modal: {noModal: true},
    formik: {
      initialValues: {
        openForms: {
          dataSrc: '',
        },
      },
    },
  },
  args: {
    name: 'values',
  },
  argTypes: {
    name: {control: {disable: true}},
  },
  tags: ['autodocs'],
} as Meta<typeof ValuesConfig>;

type SelectboxesStory = StoryObj<typeof ValuesConfig<SelectboxesComponentSchema>>;
type RadioStory = StoryObj<typeof ValuesConfig<RadioComponentSchema>>;
type SelectStory = StoryObj<typeof ValuesConfig<SelectComponentSchema>>;

/**
 * Variant pinned to the `SelectboxesComponentSchema` component type.
 */
export const SelectBoxes: SelectboxesStory = {
  decorators: [withFormik],
};

export const SelectBoxesManual: SelectboxesStory = {
  decorators: [withFormik],
  parameters: {
    formik: {
      initialValues: {
        openForms: {
          dataSrc: 'manual',
        },
        values: [
          {
            value: 'a',
            label: 'A',
          },
          {
            value: 'b',
            label: 'B',
          },
        ],
      },
    },
  },
};

export const SelectBoxesVariable: SelectboxesStory = {
  decorators: [withFormik],
  parameters: {
    formik: {
      initialValues: {
        openForms: {
          dataSrc: 'variable',
          itemsExpression: {var: 'someVariable'},
        },
      },
    },
  },
};

export const SelectBoxesResetState: StoryObj<{
  onSubmit: (values: any) => void;
}> = {
  render: ({onSubmit}) => {
    return (
      <Formik
        initialValues={{openForms: {dataSrc: ''}}}
        onSubmit={(values, helpers) => {
          onSubmit(values);
          helpers.setSubmitting(false);
        }}
      >
        {({isSubmitting}) => (
          <Form noValidate>
            <ValuesConfig<SelectboxesComponentSchema> name="values" />
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            {isSubmitting && 'Submitting...'}
          </Form>
        )}
      </Formik>
    );
  },
  args: {
    onSubmit: fn(),
  },
  play: async ({canvasElement, step, args}) => {
    const canvas = within(canvasElement);

    const doSubmit = async () => {
      const btn = canvas.getByRole('button', {name: 'Submit'});
      // https://github.com/testing-library/user-event/issues/1075
      // apparently userEvent.click(submitButton) doesn't do anything in Firefox :/
      fireEvent.click(btn);
      await waitFor(async () => {
        await expect(canvas.queryByText('Submitting...')).toBeNull();
      });
    };

    await step('Nothing selected', async () => {
      await doSubmit();

      await waitFor(() => {
        expect(args.onSubmit).toHaveBeenCalledWith({openForms: {dataSrc: ''}});
      });

      // @ts-expect-error jest mocks + TS doesn't play nice together
      args.onSubmit.mockClear();
    });

    await step('Manual values', async () => {
      // Open the dropdown
      const dataSrcSelect = canvas.getByLabelText('Data source');
      await userEvent.click(dataSrcSelect);
      await userEvent.keyboard('[ArrowDown]');

      await userEvent.click(await canvas.findByText('Manually fill in'));
      const addBtn = await canvas.findByRole('button', {name: 'Add another'});
      await expect(addBtn).toBeVisible();

      await doSubmit();
      await waitFor(() => {
        expect(args.onSubmit).toHaveBeenCalledWith({
          openForms: {dataSrc: 'manual'},
          values: [{value: '', label: '', openForms: {translations: {}}}],
        });
      });
      // @ts-expect-error jest mocks + TS doesn't play nice together
      args.onSubmit.mockClear();
    });

    await step('Set variable source', async () => {
      // Open the dropdown
      const dataSrcSelect = canvas.getByLabelText('Data source');
      await userEvent.click(dataSrcSelect);
      await userEvent.keyboard('[ArrowDown]');

      await userEvent.click(await canvas.findByText('From variable'));

      const expressionInput = await canvas.findByTestId('jsonEdit');

      await userEvent.clear(expressionInput);
      // { needs to be escaped: https://github.com/testing-library/user-event/issues/584
      const expression = '{"var": "someVar"}'.replace(/[{[]/g, '$&$&');
      await userEvent.type(expressionInput, expression);

      await doSubmit();
      await waitFor(() => {
        expect(args.onSubmit).toHaveBeenCalledWith({
          openForms: {
            dataSrc: 'variable',
            itemsExpression: {var: 'someVar'},
          },
          values: [],
        });
      });
      // @ts-expect-error jest mocks + TS doesn't play nice together
      args.onSubmit.mockClear();
    });

    await step('Reset back to manual values', async () => {
      // Open the dropdown
      const dataSrcSelect = canvas.getByLabelText('Data source');
      await userEvent.click(dataSrcSelect);
      await userEvent.keyboard('[ArrowDown]');

      await userEvent.click(await canvas.findByText('Manually fill in'));
      await expect(await canvas.findByText('Manually fill in')).toBeVisible();

      await doSubmit();
      await waitFor(() => {
        expect(args.onSubmit).toHaveBeenCalledWith({
          openForms: {dataSrc: 'manual'},
          // all pre-existing items have been cleared and we ensure there's at least 1 item
          values: [{value: '', label: '', openForms: {translations: {}}}],
        });
      });
      // @ts-expect-error jest mocks + TS doesn't play nice together
      args.onSubmit.mockClear();
    });
  },
};

export const SelectboxesReferenceLists: SelectboxesStory = {
  ...SelectBoxes,

  decorators: [withFormik],
  parameters: {
    formik: {
      initialValues: {
        openForms: {
          dataSrc: 'referenceLists',
          code: 'table1',
          service: 'reference-lists2',
        },
        data: {},
      },
    },
    builder: {enableContext: true},
  },
};

/**
 * Variant pinned to the `RadioComponentSchema` component type.
 */
export const Radio: RadioStory = {
  decorators: [withFormik],
};

export const RadioManual: RadioStory = {
  decorators: [withFormik],
  parameters: {
    formik: {
      initialValues: {
        openForms: {
          dataSrc: 'manual',
        },
        values: [
          {
            value: 'a',
            label: 'A',
          },
          {
            value: 'b',
            label: 'B',
          },
        ],
      },
    },
  },
};

export const RadioVariable: RadioStory = {
  decorators: [withFormik],
  parameters: {
    formik: {
      initialValues: {
        openForms: {
          dataSrc: 'variable',
          itemsExpression: {var: 'someVariable'},
        },
      },
    },
  },
};

export const RadioReferenceLists: RadioStory = {
  ...Radio,

  decorators: [withFormik],
  parameters: {
    formik: {
      initialValues: {
        openForms: {
          dataSrc: 'referenceLists',
          code: 'table1',
          service: 'reference-lists2',
        },
        data: {},
      },
    },
    builder: {enableContext: true},
  },
};

/**
 * Variant pinned to the `SelectComponentSchema` component type.
 */
export const Select: SelectStory = {
  decorators: [withFormik],
  args: {
    name: 'data.values',
  },
};

export const SelectManual: SelectStory = {
  ...Select,

  parameters: {
    formik: {
      initialValues: {
        openForms: {
          dataSrc: 'manual',
        },
        data: {
          values: [
            {
              value: 'a',
              label: 'A',
            },
            {
              value: 'b',
              label: 'B',
            },
          ],
        },
      },
    },
  },
};

export const SelectVariable: SelectStory = {
  ...Select,

  parameters: {
    formik: {
      initialValues: {
        openForms: {
          dataSrc: 'variable',
          itemsExpression: {var: 'someVariable'},
        },
        data: {},
      },
    },
  },
};

export const SelectReferenceLists: SelectStory = {
  ...Select,

  decorators: [withFormik],
  parameters: {
    formik: {
      initialValues: {
        openForms: {
          dataSrc: 'referenceLists',
          code: 'table1',
          service: 'reference-lists2',
        },
        data: {},
      },
    },
    builder: {enableContext: true},
  },
};
