import {FieldsetComponentSchema} from '@open-formulieren/types';
import {useFormikContext} from 'formik';
import {FormattedMessage, useIntl} from 'react-intl';

import {
  BuilderTabs,
  ClearOnHide,
  Hidden,
  Key,
  Label,
  SimpleConditional,
  Tooltip,
  Translations,
  useDeriveComponentKey,
} from '@/components/builder';
import {LABELS} from '@/components/builder/messages';
import {Checkbox, TabList, TabPanel, Tabs} from '@/components/formio';
import {getErrorNames} from '@/utils/errors';

import {EditFormDefinition} from '../types';

/**
 * Form to configure a Formio 'fieldset' type component.
 */
const EditForm: EditFormDefinition<FieldsetComponentSchema> = () => {
  const intl = useIntl();
  const [isKeyManuallySetRef, generatedKey] = useDeriveComponentKey();
  const {errors} = useFormikContext<FieldsetComponentSchema>();

  const erroredFields = Object.keys(errors).length
    ? getErrorNames<FieldsetComponentSchema>(errors)
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
          hasErrors={hasAnyError('label', 'key', 'tooltip', 'hidden', 'clearOnHide', 'hideHeader')}
        />
        <BuilderTabs.Advanced hasErrors={hasAnyError('conditional')} />
        <BuilderTabs.Translations hasErrors={hasAnyError('openForms.translations')} />
      </TabList>

      {/* Basic tab */}
      <TabPanel>
        <Label />
        <Key isManuallySetRef={isKeyManuallySetRef} generatedValue={generatedKey} />
        <Tooltip />
        <Hidden />
        <ClearOnHide />
        <HideHeader />
      </TabPanel>

      {/* Advanced tab */}
      <TabPanel>
        <SimpleConditional />
      </TabPanel>

      {/* Translations */}
      <TabPanel>
        <Translations.ComponentTranslations<FieldsetComponentSchema>
          propertyLabels={{
            label: intl.formatMessage(LABELS.label),
            // FIXME: should be translatable in the type
            // tooltip: intl.formatMessage(LABELS.tooltip),
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
  tooltip: '',
  hidden: false,
  clearOnHide: true,
  hideHeader: false,
  // Advanced tab
  conditional: {
    show: undefined,
    when: '',
    eq: '',
  },
};

const HideHeader: React.FC = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'hideHeader' builder field",
    defaultMessage:
      'Do not display the configured label and top line as the header in the fieldset.',
  });
  return (
    <Checkbox
      name="hideHeader"
      label={
        <FormattedMessage
          description="Label for 'hideHeader' builder field"
          defaultMessage="Hide fieldset header"
        />
      }
      tooltip={tooltip}
    />
  );
};

export default EditForm;
