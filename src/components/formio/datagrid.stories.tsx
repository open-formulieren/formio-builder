import withFormik from '@bbbtech/storybook-formik';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import React from 'react';

import {NumberField, TextField} from '.';
import DataGrid, {DataGridProps, DataGridRow} from './datagrid';

export default {
  title: 'Formio/Components/DataGrid',
  component: DataGrid,
  decorators: [withFormik],
  parameters: {
    modal: {noModal: true},
    docs: {
      source: {
        type: 'dynamic',
        excludeDecorators: true,
      },
      // https://github.com/bbbtech/storybook-formik/issues/51#issuecomment-1136668271
      inlineStories: false,
      iframeHeight: 400,
    },
  },
  args: {
    name: 'f1Drivers',
    label: 'F1 Drivers',
    columns: ['Number', 'Driver', 'Team'],
    tooltip: '',
    f1Drivers: [
      {id: 33, driver: 'VER', team: 'Red Bull'},
      {id: 11, driver: 'PER', team: 'Red Bull'},
      {id: 44, driver: 'HAM', team: 'Mercedes'},
      {id: 63, driver: 'RUS', team: 'Mercedes'},
    ],
  },
} as ComponentMeta<typeof DataGrid>;

interface Driver {
  id: number;
  driver: string;
  team: string;
}

interface StoryArgs extends DataGridProps {
  f1Drivers: Driver[];
}

const Template: ComponentStory<React.FC<StoryArgs>> = ({f1Drivers, ...args}) => (
  <DataGrid {...args}>
    {f1Drivers.map((driver, index) => (
      <DataGridRow index={index} key={driver.id}>
        <NumberField name="id" />
        <TextField name="driver" />
        <TextField name="team" />
      </DataGridRow>
    ))}
  </DataGrid>
);

export const Default = Template.bind({});

export const WithoutLabel = Template.bind({});
WithoutLabel.args = {
  label: '',
};

export const WithToolTip = Template.bind({});
WithToolTip.args = {
  label: 'With tooltip',
  tooltip: 'Hiya!',
};
