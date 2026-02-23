import {Meta, StoryFn} from '@storybook/react-webpack5';

import {Tab, TabList, TabPanel, Tabs} from './tabs';

export default {
  title: 'Formio/Containers/Tabs',
  parameters: {
    controls: {hideNoControlsWarning: true},
    modal: {noModal: true},
  },
} as Meta<typeof Tabs>;

export const Default: StoryFn<typeof Tabs> = () => (
  <Tabs>
    <TabList>
      <Tab>Tab 1</Tab>
      <Tab>Tab 2</Tab>
    </TabList>

    <TabPanel>Panel 1</TabPanel>
    <TabPanel>Panel 2</TabPanel>
  </Tabs>
);

export const WithErrors: StoryFn<typeof Tabs> = () => (
  <Tabs>
    <TabList>
      <Tab>Tab 1</Tab>
      <Tab hasErrors>Tab 2</Tab>
    </TabList>

    <TabPanel>This is fine</TabPanel>
    <TabPanel>I have issues</TabPanel>
  </Tabs>
);
