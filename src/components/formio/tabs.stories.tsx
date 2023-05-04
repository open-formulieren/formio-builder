import {ComponentMeta, ComponentStory} from '@storybook/react';

import {Tab, TabList, TabPanel, Tabs} from './tabs';

export default {
  title: 'Formio/Containers/Tabs',
  parameters: {
    controls: {hideNoControlsWarning: true},
    modal: {noModal: true},
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

export const WithErrors: ComponentStory<typeof Tabs> = () => (
  <Tabs>
    <TabList>
      <Tab>Tab 1</Tab>
      <Tab hasErrors>Tab 2</Tab>
    </TabList>

    <TabPanel>This is fine</TabPanel>
    <TabPanel>I have issues</TabPanel>
  </Tabs>
);
