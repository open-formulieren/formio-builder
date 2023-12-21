import {ContentComponentSchema} from '@open-formulieren/types';
import {useFormikContext} from 'formik';
import {useContext, useEffect, useRef} from 'react';
import {FormattedMessage, defineMessage, useIntl} from 'react-intl';

import {
  BuilderTabs,
  Hidden,
  Key,
  PresentationConfig,
  SimpleConditional,
} from '@/components/builder';
import {Select, Tab, TabList, TabPanel, Tabs} from '@/components/formio';
import {BuilderContext} from '@/context';
import {getErrorNames} from '@/utils/errors';

import {EditFormDefinition} from '../types';
import RichText from './rich-text';

/**
 * Form to configure a Formio 'content' type component.
 *
 * W/r to translations, the 'NL' language is considered the default, and the main html
 * value is populated from that field (TODO: implement this).
 */
const EditForm: EditFormDefinition<ContentComponentSchema> = () => {
  const {uniquifyKey, supportedLanguageCodes} = useContext(BuilderContext);
  const isKeyManuallySetRef = useRef(false);
  const {values, errors, setFieldValue} = useFormikContext<ContentComponentSchema>();
  const generatedKey = uniquifyKey(values.key);
  const erroredFields = Object.keys(errors).length
    ? getErrorNames<ContentComponentSchema>(errors)
    : [];
  // TODO: pattern match instead of just string inclusion?
  // TODO: move into more generically usuable utility when we implement other component
  // types
  const hasAnyError = (...fieldNames: string[]): boolean => {
    if (!erroredFields.length) return false;
    return fieldNames.some(name => erroredFields.includes(name));
  };

  const defaultLanguageCode = supportedLanguageCodes[0] ?? 'nl';

  // Synchronize the default/first language tab value to the main `html` field.
  useEffect(() => {
    const currentValue = values.openForms?.translations?.[defaultLanguageCode]?.html;
    if (currentValue === undefined && values.html) {
      // if we have a 'html' value, but no default translation -> store the default translation
      setFieldValue(`openForms.translations.${defaultLanguageCode}.html`, values.html);
    } else if (values.html !== currentValue) {
      // otherwise sync the value of the translation field to the main field.
      setFieldValue('html', currentValue);
    }
  });

  return (
    <>
      <RichTextTranslations />
      <Tabs>
        <TabList>
          <Tab
            hasErrors={hasAnyError(
              'key',
              'hidden',
              'showInSummary',
              'showInEmail',
              'showInPDF',
              'customClass'
            )}
          >
            <FormattedMessage
              description="Component edit form tab title for 'Display' tab"
              defaultMessage="Display"
            />
          </Tab>
          <BuilderTabs.Advanced hasErrors={hasAnyError('conditional')} />
        </TabList>

        {/* Display tab */}
        <TabPanel>
          <Key isManuallySetRef={isKeyManuallySetRef} generatedValue={generatedKey} />
          <Hidden />
          <PresentationConfig />
          <CustomClass />
        </TabPanel>
        {/* Advanced tab */}
        <TabPanel>
          <SimpleConditional />
        </TabPanel>
      </Tabs>
    </>
  );
};

EditForm.defaultValues = {
  // Display tab
  html: '',
  label: '',
  key: '',
  hidden: false,
  showInSummary: false,
  showInEmail: false,
  showInPDF: true,
  customClass: '',
  // Advanced tab
  conditional: {
    show: undefined,
    when: '',
    eq: '',
  },
};

const CUSTOM_CLASS_OPTIONS = [
  {
    value: 'warning',
    label: defineMessage({
      description: "Label for content component CSS class 'warning' option",
      defaultMessage: 'Warning',
    }),
  },
  {
    value: 'info',
    label: defineMessage({
      description: "Label for content component CSS class 'info' option",
      defaultMessage: 'Info',
    }),
  },
  {
    value: 'error',
    label: defineMessage({
      description: "Label for content component CSS class 'error' option",
      defaultMessage: 'Error',
    }),
  },
  {
    value: 'success',
    label: defineMessage({
      description: "Label for content component CSS class 'success' option",
      defaultMessage: 'Success',
    }),
  },
];

const CustomClass: React.FC = () => {
  const intl = useIntl();
  const options = CUSTOM_CLASS_OPTIONS.map(option => ({
    value: option.value,
    label: intl.formatMessage(option.label),
  }));
  return (
    <Select
      name="customClass"
      label={
        <FormattedMessage
          description="Label for 'customClass' builder field"
          defaultMessage="CSS class"
        />
      }
      options={options}
      valueProperty="id"
    />
  );
};

const RichTextTranslations: React.FC = () => {
  const {supportedLanguageCodes} = useContext(BuilderContext);
  const {errors} = useFormikContext<ContentComponentSchema>();

  const erroredFields = Object.keys(errors).length
    ? getErrorNames<ContentComponentSchema>(errors)
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
        {supportedLanguageCodes.map(code => (
          <Tab hasErrors={hasAnyError(`openForms.translations.${code}`)}>{code.toUpperCase()}</Tab>
        ))}
      </TabList>

      {supportedLanguageCodes.map((code, index) => (
        <TabPanel>
          <RichText name={`openForms.translations.${code}.html`} required={index === 0} />
        </TabPanel>
      ))}
    </Tabs>
  );
};

export default EditForm;
