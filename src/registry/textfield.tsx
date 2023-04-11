import {FormattedMessage, useIntl} from 'react-intl';

import {AutoComplete, Description, Key, Label, Placeholder} from '@components/builder';
import {Tab, TabList, TabPanel, Tabs} from '@components/formio';
import {TextField as BuilderTextField} from '@components/formio';

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
      <TabPanel>
        <Label />
        <Key />
        <Description />
        <DefaultValue />
        <AutoComplete />
        <Placeholder />
      </TabPanel>

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

const DefaultValue = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'Default Value' builder field",
    defaultMessage: 'This will be the initial value for this field, before user interaction.',
  });
  return (
    <BuilderTextField
      name="defaultValue"
      label={
        <FormattedMessage
          description="Component property 'Default value' label"
          defaultMessage="Default Value"
        />
      }
      tooltip={tooltip}
    />
  );
};

export default TextField;
