import {FormattedMessage} from 'react-intl';

import {Tab, TabList, TabPanel, Tabs} from '@components/formio';

import {EditFormDefinition, EditFormProps} from '.';

/**
 * Form to configure a Formio 'textfield' type component.
 */
const TextField: EditFormDefinition<EditFormProps> = () => {
  return (
    <Tabs>
      <TabList>
        <Tab>
          <FormattedMessage
            description="Component edit form tab title for 'Basic' tab"
            defaultMessage="Basic"
          />
        </Tab>
        <Tab>
          <FormattedMessage
            description="Component edit form tab title for 'Location' tab"
            defaultMessage="Location"
          />
        </Tab>
        <Tab>
          <FormattedMessage
            description="Component edit form tab title for 'Advanced' tab"
            defaultMessage="Advanced"
          />
        </Tab>
        <Tab>
          <FormattedMessage
            description="Component edit form tab title for 'Validation' tab"
            defaultMessage="Validation"
          />
        </Tab>
        <Tab>
          <FormattedMessage
            description="Component edit form tab title for 'Registration' tab"
            defaultMessage="Registration"
          />
        </Tab>
        <Tab>
          <FormattedMessage
            description="Component edit form tab title for 'Prefill' tab"
            defaultMessage="Prefill"
          />
        </Tab>
        <Tab>
          <FormattedMessage
            description="Component edit form tab title for 'Translations' tab"
            defaultMessage="Translations"
          />
        </Tab>
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
