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
import {rsSelect} from '@/utils/storybookTestHelpers';

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
      const panelTitle = await canvas.findByRole('button', {name: 'Initial focus'});
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

export const AddOverlay: Story = {
  name: 'Add overlay',
  args: {
    component: {
      id: 'wekruya',
      type: 'map',
      key: 'map',
      label: 'A map',
    },
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);
    const componentPreview = within(canvas.getByTestId('componentPreview'));

    await userEvent.click(canvas.getByRole('link', {name: 'Layers'}));

    // Expect that the overlay button isn't show in the preview, as there aren't any
    // configured overlays.
    expect(componentPreview.queryByRole('button', {name: 'Layers'})).not.toBeInTheDocument();

    await step('Add WMS overlay layer', async () => {
      const addOverlayButton = await canvas.findByRole('button', {name: 'Add another overlay'});
      await userEvent.click(addOverlayButton);

      const labelInput = canvas.getByLabelText('Label');
      expect(labelInput).toHaveDisplayValue('');

      const wmsLayerSelect = canvas.getByLabelText('Tile layer');
      await rsSelect(canvas, wmsLayerSelect, 'PDOK BAG');
      // After selecting a layer, the label is automatically filled in with the layer name.
      expect(labelInput).toHaveDisplayValue('PDOK BAG');
      const subLayersSelect = canvas.getAllByLabelText('Layers')[1];
      await rsSelect(canvas, subLayersSelect, 'Pand');
    });

    await step('Expect new overlay to be active', async () => {
      const mapLayersButton = await componentPreview.findByRole('button', {name: 'Layers'});

      expect(mapLayersButton).toBeVisible();
      await userEvent.click(mapLayersButton);

      const layerCheckbox = await componentPreview.findByLabelText('PDOK BAG');
      expect(layerCheckbox).toBeVisible();
      expect(layerCheckbox).toBeChecked();
    });
  },
};

export const EditOverlay: Story = {
  name: 'Edit overlay',
  args: {
    component: {
      id: 'wekruya',
      type: 'map',
      key: 'map',
      label: 'A map',
      overlays: [
        {
          uuid: 'f57405dc-1796-4f5b-8ad4-c98eb8511110',
          label: 'BAG pand layer',
          type: 'wms',
          layers: ['pand'],
          // url is part of the schema, but doesn't exist in this scenario
          url: '',
        },
      ],
    },
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);
    const componentPreview = within(canvas.getByTestId('componentPreview'));

    await userEvent.click(canvas.getByRole('link', {name: 'Layers'}));

    // Open the overlay configuration menu
    const overlayConfigTrigger = await canvas.findByRole('button', {
      name: 'Overlay: BAG pand layer',
    });
    await userEvent.click(overlayConfigTrigger);

    await step('Validate initial values', async () => {
      // Validate tile layer value
      await waitFor(() => {
        expect(canvas.getByRole('combobox', {name: 'Tile layer'})).toBeVisible();
      });

      expect(canvas.getByText('PDOK BAG')).toBeVisible();
      // Validate label value
      expect(canvas.getByLabelText('Label')).toHaveDisplayValue('BAG pand layer');
      // Validate sub-layers
      expect(canvas.getByRole('combobox', {name: 'Layers'})).toBeVisible();
      expect(await canvas.findByText('Pand')).toBeVisible();

      // Validate overlay label in the preview
      const mapLayersButton = await componentPreview.findByRole('button', {name: 'Layers'});
      await userEvent.click(mapLayersButton);
      expect(componentPreview.getByLabelText('BAG pand layer')).toBeVisible();
      // Close the overlay menu in the preview
      await userEvent.unhover(mapLayersButton);
    });

    await step('Update values', async () => {
      // Change tile layer
      await rsSelect(
        canvas,
        canvas.getByRole('combobox', {name: 'Tile layer'}),
        'PDOK grondwaterspiegeldiepte'
      );
      const labelField = canvas.getByLabelText('Label');

      // Expect label to be changed to the layer name, and sub-layers to be empty
      expect(labelField).toHaveDisplayValue('PDOK grondwaterspiegeldiepte');
      // We cannot accurately check the value of the React-Select component.
      // Best we can do is check that the previous value is no longer present.
      expect(canvas.queryByText('Pand')).not.toBeInTheDocument();

      // Change label
      await userEvent.clear(labelField);
      await userEvent.type(labelField, 'grondwaterspiegeldiepte layer');
      expect(labelField).toHaveDisplayValue('grondwaterspiegeldiepte layer');

      // Select sub-layer
      const subLayersSelect = canvas.getAllByLabelText('Layers')[1];
      await rsSelect(canvas, subLayersSelect, 'BRO Grondwaterspiegeldiepte GHG');

      // Expect overlay label in preview to be changed
      const mapLayersButton = await componentPreview.findByRole('button', {name: 'Layers'});
      await userEvent.click(mapLayersButton);
      expect(componentPreview.getByLabelText('grondwaterspiegeldiepte layer')).toBeVisible();
    });
  },
};

export const ChangeOverlaysOrder: Story = {
  name: 'Change overlays order',
  args: {
    component: {
      id: 'wekruya',
      type: 'map',
      key: 'map',
      label: 'A map',
      overlays: [
        {
          uuid: 'f57405dc-1796-4f5b-8ad4-c98eb8511110',
          label: 'BAG pand layer',
          type: 'wms',
          layers: ['pand'],
          // url is part of the schema, but doesn't exist in this scenario
          url: '',
        },
        {
          uuid: '71c73427-c792-43ec-b25e-7f4f3e043fbd',
          label: 'grondwaterspiegeldiepte layer',
          type: 'wms',
          layers: ['BRO Grondwaterspiegeldiepte GHG'],
          // url is part of the schema, but doesn't exist in this scenario
          url: '',
        },
      ],
    },
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('link', {name: 'Layers'}));

    const wmsLayersMenuButton = canvas.getByRole('button', {name: 'Layers'});
    const wmsLayersMenuElement = canvasElement.querySelector<HTMLElement>(
      '.leaflet-control-layers.leaflet-control'
    );
    const wmsLayersMenu = within(wmsLayersMenuElement!);

    await waitFor(() => {
      expect(wmsLayersMenuButton).toBeVisible();
      expect(wmsLayersMenuElement).toBeVisible();
    });

    await step('Initial state', async () => {
      // Open the layers menu
      await userEvent.click(wmsLayersMenuButton);

      const layerCheckboxes = wmsLayersMenu.getAllByRole('checkbox');
      const pandLayer = wmsLayersMenu.getByRole('checkbox', {
        name: 'BAG pand layer',
      });
      const grondwaterLayer = wmsLayersMenu.getByRole('checkbox', {
        name: 'grondwaterspiegeldiepte layer',
      });

      // The layer menu has exactly 2 checkboxes
      expect(layerCheckboxes).toHaveLength(2);

      // Expect both checkboxes to be checked
      expect(pandLayer).toBeChecked();
      expect(grondwaterLayer).toBeChecked();

      // Expect the pand layer to be the first layer
      expect(layerCheckboxes[0]).toBe(pandLayer);
      expect(layerCheckboxes[1]).toBe(grondwaterLayer);

      // Check config fields
      const overlayCards = canvas.queryAllByText(/Overlay: .*?/);

      expect(overlayCards).toHaveLength(2);

      // Expect the first overlay config to be for 'BAG pand layer'
      expect(overlayCards[0]).toHaveTextContent('Overlay: BAG pand layer');
      expect(overlayCards[1]).toHaveTextContent('Overlay: grondwaterspiegeldiepte layer');
    });

    await step('Change order', async () => {
      // Click the 'move down' button of the first overlay card
      const moveDownButton = canvas.getAllByRole('button', {name: 'Move down'})[0];
      await userEvent.click(moveDownButton);
    });

    await step('Make sure the order has changed', async () => {
      // Check the order of the config panels
      const overlayCards = canvas.queryAllByText(/Overlay: .*?/);

      // Expect the first overlay config to be for 'grondwaterspiegeldiepte layer'
      expect(overlayCards[0]).toHaveTextContent('Overlay: grondwaterspiegeldiepte layer');
      expect(overlayCards[1]).toHaveTextContent('Overlay: BAG pand layer');

      const layerCheckboxes = wmsLayersMenu.getAllByRole('checkbox');
      const pandLayer = wmsLayersMenu.getByRole('checkbox', {
        name: 'BAG pand layer',
      });
      const grondwaterLayer = wmsLayersMenu.getByRole('checkbox', {
        name: 'grondwaterspiegeldiepte layer',
      });

      // Expect grondwaterspiegeldiepte layer to be the first layer
      expect(layerCheckboxes[0]).toBe(grondwaterLayer);
      expect(layerCheckboxes[1]).toBe(pandLayer);
    });
  },
};

export const DeleteOverlay: Story = {
  name: 'Delete overlay',
  args: {
    component: {
      id: 'wekruya',
      type: 'map',
      key: 'map',
      label: 'A map',
      overlays: [
        {
          uuid: 'f57405dc-1796-4f5b-8ad4-c98eb8511110',
          label: 'BAG pand layer',
          type: 'wms',
          layers: ['pand'],
          // url is part of the schema, but doesn't exist in this scenario
          url: '',
        },
      ],
    },
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('link', {name: 'Layers'}));

    await step('Initial state', async () => {
      // Check preview checkboxes
      const wmsLayerButtonsContainer = canvas.getByRole('button', {name: 'Layers'});

      await waitFor(() => {
        expect(wmsLayerButtonsContainer).toBeVisible();
      });
      await userEvent.click(wmsLayerButtonsContainer);

      const layerCheckbox = canvas.getByLabelText('BAG pand layer');

      expect(layerCheckbox).toBeChecked();
    });

    await step('Delete overlay layer', async () => {
      const header = canvas.getByText('Overlay: BAG pand layer');
      await userEvent.click(header);

      const deleteButton = canvas.getByRole('button', {name: 'Remove overlay'});
      await userEvent.click(deleteButton);
    });

    await step('Check if overlay layer is deleted', async () => {
      const header = canvas.queryByText('Overlay: BAG pand layer');
      expect(header).not.toBeInTheDocument();

      // With no layers, the layers menu button in the preview should be gone
      const wmsLayerButtonsContainer = canvas.queryByRole('button', {name: 'Layers'});
      expect(wmsLayerButtonsContainer).not.toBeInTheDocument();
    });
  },
};

export const InvalidConfiguration: Story = {
  name: 'Invalid configuration',
  args: {
    component: {
      id: 'wekruya',
      type: 'map',
      key: 'map',
      label: 'A map',
    },
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('link', {name: 'Map settings'}));

    const errorMessageText =
      "The map configuration is not valid, so we can't show a preview. Fix the validation errors in the component configuration.";

    await step('Initial state without error', async () => {
      const errorMessage = await canvas.queryByText(errorMessageText);
      expect(errorMessage).toBeNull();
    });

    await step('Open configuration panel', async () => {
      const panelTitle = await canvas.findByText('Initial focus');
      await waitFor(async () => {
        expect(panelTitle).toBeVisible();
      });
      await userEvent.click(panelTitle);
    });

    await step('Enter an invalid latitude value', async () => {
      const latitudeField = await canvas.getByLabelText('Latitude');
      await userEvent.type(latitudeField, '9999');
      await userEvent.tab();
    });

    await step('Error message is shown', async () => {
      const errorMessage = await canvas.findByText(errorMessageText);
      await waitFor(async () => {
        expect(errorMessage).toBeVisible();
      });
    });
  },
};
