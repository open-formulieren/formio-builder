import {Meta, StoryObj} from '@storybook/react';
import {
  expect,
  fireEvent,
  userEvent,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@storybook/test';

import ComponentEditForm from '@/components/ComponentEditForm';
import {BuilderContextDecorator} from '@/sb-decorators';

export default {
  title: 'Builder components/Map/Configuration',
  component: ComponentEditForm,
  decorators: [BuilderContextDecorator],
  parameters: {
    builder: {enableContext: true},
  },
  args: {
    isNew: true,
    component: {
      id: 'wekruya',
      type: 'map',
      key: 'map',
      label: 'A map',
    },

    builderInfo: {
      title: 'Map',
      icon: 'map',
      group: 'advanced',
      weight: 10,
      schema: {},
    },
  },
} as Meta<typeof ComponentEditForm>;

type Story = StoryObj<typeof ComponentEditForm>;

export const NotUsingGlobalConfig: Story = {
  name: 'Use global configuration: false',
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    await step('Initial state', async () => {
      await userEvent.click(canvas.getByRole('link', {name: 'Map settings'}));
      expect(
        canvas.getByLabelText('Use globally configured map component settings')
      ).not.toBeChecked();
    });

    await step('Open configuration panel', async () => {
      const panelTitle = await canvas.findByText('Map configuration');
      await waitFor(async () => {
        expect(panelTitle).toBeVisible();
      });
      await userEvent.click(panelTitle);
    });

    await step('Zoom field', async () => {
      expect(canvas.getByLabelText('Zoom level')).toBeVisible();
      expect(canvas.getByLabelText('Zoom level')).toHaveDisplayValue('');
    });

    await step('Latitude field', async () => {
      expect(canvas.getByLabelText('Latitude')).toBeVisible();
      expect(canvas.getByLabelText('Latitude')).toHaveDisplayValue('');
    });

    await step('Longitude field', async () => {
      expect(canvas.getByLabelText('Longitude')).toBeVisible();
      expect(canvas.getByLabelText('Longitude')).toHaveDisplayValue('');
    });
  },
};

export const UsingGlobalConfig: Story = {
  name: 'Use global configuration: true',
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    await step('Initial state', async () => {
      await userEvent.click(canvas.getByRole('link', {name: 'Map settings'}));
      expect(
        canvas.getByLabelText('Use globally configured map component settings')
      ).not.toBeChecked();
    });

    await step('Toggle checkbox to enable global configuration', async () => {
      const panelTitle = await canvas.findByText('Map configuration');
      await waitFor(async () => {
        expect(panelTitle).toBeVisible();
      });
      await Promise.all([
        waitForElementToBeRemoved(panelTitle),
        fireEvent.click(canvas.getByLabelText('Use globally configured map component settings')),
      ]);
      expect(canvas.getByLabelText('Use globally configured map component settings')).toBeChecked();
    });

    await step('Configuration fields are not available', async () => {
      expect(canvas.queryByLabelText('Zoom level')).not.toBeInTheDocument();
      expect(canvas.queryByLabelText('Latitude')).not.toBeInTheDocument();
      expect(canvas.queryByLabelText('Longitude')).not.toBeInTheDocument();
    });
  },
};
