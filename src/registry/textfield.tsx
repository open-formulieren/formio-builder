import {Tab, TabList, TabPanel, Tabs} from '@components/formio';

import {EditFormDefinition, EditFormProps} from '.';

/**
 * Form to configure a Formio 'textfield' type component.
 */
const TextField: EditFormDefinition<EditFormProps> = () => {
  return (
    <Tabs>
      <TabList>
        <Tab>Basis</Tab>
        <Tab>Locatie</Tab>
        <Tab>Geavanceerd</Tab>
        <Tab>Validatie</Tab>
        <Tab>Registratie</Tab>
        <Tab>Prefill</Tab>
        <Tab>Vertalingen</Tab>
      </TabList>

      {/* Basic tab */}
      <TabPanel>Basic</TabPanel>

      {/* Location tab */}
      <TabPanel>Location</TabPanel>

      {/* Advanced tab */}
      <TabPanel>Advanced</TabPanel>

      {/* Validation tab */}
      <TabPanel>Validation</TabPanel>

      {/* Registration tab */}
      <TabPanel>Registration</TabPanel>

      {/* Prefill tab */}
      <TabPanel>Prefill</TabPanel>

      {/* Translations */}
      <TabPanel>Translations</TabPanel>
    </Tabs>
  );
};

TextField.defaultValues = {
  defaultValue: '',
};

export default TextField;
