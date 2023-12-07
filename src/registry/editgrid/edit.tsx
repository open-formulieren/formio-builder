import {EditGridComponentSchema} from '@open-formulieren/types';
import {useFormikContext} from 'formik';
import {FormattedMessage, defineMessage, useIntl} from 'react-intl';

import {
  BuilderTabs,
  ClearOnHide,
  Description,
  Hidden,
  IsSensitiveData,
  Key,
  Label,
  Tooltip,
  Translations,
  Validate,
  useDeriveComponentKey,
} from '@/components/builder';
import {LABELS} from '@/components/builder/messages';
import {Checkbox, Panel, Tab, TabList, TabPanel, Tabs, TextField} from '@/components/formio';
import {getErrorNames} from '@/utils/errors';

import {EditFormDefinition} from '../types';

const GROUP_LABEL = defineMessage({
  description: "Label for 'groupLabel' builder field",
  defaultMessage: 'Group label',
});

const ADD_ANOTHER_LABEL = defineMessage({
  description: "Label for 'addAnother' builder field",
  defaultMessage: "'Add another' text",
});

const SAVE_ROW_LABEL = defineMessage({
  description: "Label for 'saveRow' builder field",
  defaultMessage: "'Save row' text",
});

const REMOVE_ROW_LABEL = defineMessage({
  description: "Label for 'removeRow' builder field",
  defaultMessage: "'Remove row' text",
});

/**
 * Form to configure a Formio 'fieldset' type component.
 */
const EditForm: EditFormDefinition<EditGridComponentSchema> = () => {
  const intl = useIntl();
  const [isKeyManuallySetRef, generatedKey] = useDeriveComponentKey();
  const {errors} = useFormikContext<EditGridComponentSchema>();

  const erroredFields = Object.keys(errors).length
    ? getErrorNames<EditGridComponentSchema>(errors)
    : [];
  // TODO: pattern match instead of just string inclusion?
  // TODO: move into more generically usuable utility when we implement other component
  // types
  const hasAnyError = (...fieldNames: string[]): boolean => {
    if (!erroredFields.length) return false;
    return fieldNames.some(name => erroredFields.includes(name));
  };

  return (
    <Tabs>
      <TabList>
        <BuilderTabs.Basic
          hasErrors={hasAnyError(
            'label',
            'key',
            'groupLabel',
            'description',
            'tooltip',
            'hidden',
            'clearOnHide',
            'isSensitiveData',
            'hideLabel'
          )}
        />
        <Tab
          hasErrors={hasAnyError('disableAddingRemovingRows', 'addAnother', 'saveRow', 'removeRow')}
        >
          <FormattedMessage
            description="Component edit form tab title for 'Display' tab"
            defaultMessage="Display"
          />
        </Tab>
        <BuilderTabs.Validation hasErrors={hasAnyError('validate')} />
        <BuilderTabs.Translations hasErrors={hasAnyError('openForms.translations')} />
      </TabList>

      {/* Basic tab */}
      <TabPanel>
        <Label />
        <Key isManuallySetRef={isKeyManuallySetRef} generatedValue={generatedKey} />
        <Description />
        <Tooltip />
        <GroupLabel />
        <Hidden />
        <ClearOnHide />
        <IsSensitiveData />
        <HideLabel />
      </TabPanel>

      {/* Display tab */}
      <TabPanel>
        <DisableAddingRemovingRows />
        <Panel
          collapsible
          initialCollapsed
          title={
            <FormattedMessage
              description="Edit grid button texts panel title"
              defaultMessage="Button labels"
            />
          }
        >
          <AddAnother />
          <SaveRow />
          <RemoveRow />
        </Panel>
      </TabPanel>

      {/* Validation tab */}
      <TabPanel>
        <Validate.Required />
        <Validate.MaxLength />
      </TabPanel>

      {/* Translations */}
      <TabPanel>
        <Translations.ComponentTranslations<EditGridComponentSchema>
          propertyLabels={{
            label: intl.formatMessage(LABELS.label),
            description: intl.formatMessage(LABELS.description),
            tooltip: intl.formatMessage(LABELS.tooltip),
            groupLabel: intl.formatMessage(GROUP_LABEL),
            addAnother: intl.formatMessage(ADD_ANOTHER_LABEL),
            saveRow: intl.formatMessage(SAVE_ROW_LABEL),
            removeRow: intl.formatMessage(REMOVE_ROW_LABEL),
          }}
        />
      </TabPanel>
    </Tabs>
  );
};

/*
  Making this introspected or declarative doesn't seem advisable, as React is calling
  React.Children and related API's legacy API - this may get removed in future
  versions.

  Explicitly specifying the schema and default values is therefore probbaly best, at
  the cost of some repetition.
 */
EditForm.defaultValues = {
  components: [],
  // basic tab
  label: '',
  key: '',
  groupLabel: 'Item',
  description: '',
  tooltip: '',
  hidden: false,
  clearOnHide: true,
  isSensitiveData: false,
  hideLabel: false,
  // display tab
  disableAddingRemovingRows: false,
  addAnother: '',
  saveRow: '',
  removeRow: 'Cancel',
};

const GroupLabel: React.FC = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'groupLabel' builder field",
    defaultMessage: `The label that will be shown above each repeating group in the
    summary page, the submission report and the confirmation email.
    The index of the item will be added next to it, i.e. if you enter
    'Item' it will be displayed as 'Item 1', 'Item 2', ...
    `,
  });
  return (
    <TextField name="groupLabel" label={<FormattedMessage {...GROUP_LABEL} />} tooltip={tooltip} />
  );
};

const HideLabel: React.FC = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'hideLabel' builder field",
    defaultMessage: 'Hide the title/label of this component in the form.',
  });
  return (
    <Checkbox
      name="hideLabel"
      label={
        <FormattedMessage
          description="Label for 'hideLabel' builder field"
          defaultMessage="Hide label"
        />
      }
      tooltip={tooltip}
    />
  );
};

const DisableAddingRemovingRows: React.FC = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'disableAddingRemovingRows' builder field",
    defaultMessage: "Check if you want to hide/disable the 'Add Another' and 'Remove row' buttons.",
  });
  return (
    <Checkbox
      name="disableAddingRemovingRows"
      label={
        <FormattedMessage
          description="Label for 'disableAddingRemovingRows' builder field"
          defaultMessage="Disable adding or removing groups"
        />
      }
      tooltip={tooltip}
    />
  );
};

const AddAnother: React.FC = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'addAnother' builder field",
    defaultMessage: "Set the text of the 'Add Another' button.",
  });
  return (
    <TextField
      name="addAnother"
      label={<FormattedMessage {...ADD_ANOTHER_LABEL} />}
      tooltip={tooltip}
    />
  );
};

const SaveRow: React.FC = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'saveRow' builder field",
    defaultMessage: "Set the text of the 'Save row' button.",
  });
  return (
    <TextField
      name="saveRow"
      label={<FormattedMessage {...ADD_ANOTHER_LABEL} />}
      tooltip={tooltip}
    />
  );
};

const RemoveRow: React.FC = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'removeRow' builder field",
    defaultMessage: "Set the text of the 'Remove row' button.",
  });
  return (
    <TextField
      name="removeRow"
      label={<FormattedMessage {...ADD_ANOTHER_LABEL} />}
      tooltip={tooltip}
    />
  );
};

export default EditForm;
