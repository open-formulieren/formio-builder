import {ComponentMeta, ComponentStory} from '@storybook/react';

import {Tab, TabList, TabPanel, Tabs} from './tabs';

export default {
  title: 'Formio/Tabs',
  parameters: {
    controls: {hideNoControlsWarning: true},
  },
} as ComponentMeta<typeof Tabs>;

export const Default: ComponentStory<typeof Tabs> = () => (
  <Tabs>
    <TabList>
      <Tab>Tab 1</Tab>
      <Tab>Tab 2</Tab>
    </TabList>

    <TabPanel>Panel 1</TabPanel>
    <TabPanel>Panel 2</TabPanel>
  </Tabs>
);

Default.parameters = {
  modal: {noModal: true},
};
