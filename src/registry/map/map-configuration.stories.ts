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

export default {
  title: 'Builder components/Map/Configuration',
  component: ComponentEditForm,
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
      const panelTitle = await canvas.findByText('Initial focus');
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
      const panelTitle = await canvas.findByText('Initial focus');
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

export const TogglingShapeOptions: Story = {
  name: 'Toggling shape options',
  args: {
    component: {
      id: 'wekruya',
      type: 'map',
      key: 'map',
      label: 'A map',
      interactions: {
        polygon: true,
        polyline: true,
        marker: true,
      },
    },
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('link', {name: 'Map settings'}));
    const drawingButtonsContainer = canvasElement.querySelector(
      '.leaflet-top.leaflet-right'
    ) as HTMLElement;

    step('Initial state', () => {
      expect(canvas.getByLabelText('Polygon')).toBeChecked();
      expect(drawingButtonsContainer).not.toBeNull();

      const drawingButtons = within(drawingButtonsContainer).getAllByRole('link');

      expect(drawingButtons).toHaveLength(4);
      expect(drawingButtons[0]).toHaveAccessibleName('Draw a polyline');
      expect(drawingButtons[1]).toHaveAccessibleName('Draw a polygon');
      expect(drawingButtons[2]).toHaveAccessibleName('Draw a marker');
      expect(drawingButtons[3]).toHaveAccessibleName('Delete layers');
    });

    await step('Disabling one of the shapes', async () => {
      await userEvent.click(canvas.getByLabelText('Polygon'));

      // The checkbox for 'Polygon' should be unchecked.
      expect(canvas.getByLabelText('Polygon')).not.toBeChecked();

      const drawingButtons = within(drawingButtonsContainer).getAllByRole('link');

      // The polygon button shouldn't be shown
      expect(drawingButtons).toHaveLength(3);
      expect(
        within(drawingButtonsContainer).queryByRole('link', {name: 'Draw a polygon'})
      ).toBeNull();

      // All other buttons should remain visible
      expect(drawingButtons[0]).toHaveAccessibleName('Draw a polyline');
      expect(drawingButtons[1]).toHaveAccessibleName('Draw a marker');
      expect(drawingButtons[2]).toHaveAccessibleName('Delete layers');
    });

    await step('Re-enabling the disabled shape', async () => {
      await userEvent.click(canvas.getByLabelText('Polygon'));

      // The 'Polygon' checkbox should be checked and all buttons should be visible.
      expect(canvas.getByLabelText('Polygon')).toBeChecked();

      const drawingButtons = within(drawingButtonsContainer).getAllByRole('link');

      expect(drawingButtons).toHaveLength(4);
      expect(drawingButtons[0]).toHaveAccessibleName('Draw a polyline');
      expect(drawingButtons[1]).toHaveAccessibleName('Draw a polygon');
      expect(drawingButtons[2]).toHaveAccessibleName('Draw a marker');
      expect(drawingButtons[3]).toHaveAccessibleName('Delete layers');
    });
  },
};
