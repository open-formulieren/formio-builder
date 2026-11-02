import type {FileComponentSchema} from '@open-formulieren/types';
import {FormattedMessage, useIntl} from 'react-intl';

import {
  BuilderTabs,
  ClearOnHide,
  Description,
  FAQItems,
  FAQItemsTranslations,
  Hidden,
  IsSensitiveData,
  Key,
  Label,
  PresentationConfig,
  SimpleConditional,
  Tooltip,
  Translations,
  Validate,
  useDeriveComponentKey,
} from '@/components/builder';
import {LABELS} from '@/components/builder/messages';
import {Tab, TabList, TabPanel, Tabs} from '@/components/formio';
import {useErrorChecker} from '@/utils/errors';

import type {EditFormDefinition} from '../types';
import FileTabFields from './file-tab';

/**
 * Form to configure a Formio 'file' type component.
 */
const EditForm: EditFormDefinition<FileComponentSchema> = () => {
  const intl = useIntl();
  const [isKeyManuallySetRef, generatedKey] = useDeriveComponentKey();

  const {hasAnyError} = useErrorChecker<FileComponentSchema>();

  Validate.useManageValidatorsTranslations<FileComponentSchema>(['required']);

  return (
    <Tabs>
      <TabList>
        <BuilderTabs.Basic
          hasErrors={hasAnyError(
            'label',
            'key',
            'description',
            'tooltip',
            'showInSummary',
            'showInEmail',
            'showInPDF',
            'hidden',
            'clearOnHide',
            'isSensitiveData'
          )}
        />
        <BuilderTabs.Advanced hasErrors={hasAnyError('conditional')} />
        <BuilderTabs.Validation hasErrors={hasAnyError('validate')} />
        <Tab
          hasErrors={hasAnyError(
            'file',
            'openForms.useConfigFiletypes',
            'openForms.image',
            'fileMaxSize',
            'validate.maxLength'
          )}
        >
          <FormattedMessage
            description="Component edit form tab title for 'File' tab"
            defaultMessage="File"
          />
        </Tab>
        <BuilderTabs.Registration hasErrors={hasAnyError('registration')} />
        <BuilderTabs.FAQItems hasErrors={hasAnyError('faqItems')} />
        <BuilderTabs.Translations hasErrors={hasAnyError('openForms.translations')} />
      </TabList>

      {/* Basic tab */}
      <TabPanel>
        <Label />
        <Key isManuallySetRef={isKeyManuallySetRef} generatedValue={generatedKey} />
        <Description />
        <Tooltip />
        <PresentationConfig />
        <Hidden />
        <ClearOnHide />
        <IsSensitiveData />
      </TabPanel>

      {/* Advanced tab */}
      <TabPanel>
        <SimpleConditional />
      </TabPanel>

      {/* Validation tab */}
      <TabPanel>
        <Validate.Required />
        <Validate.SoftRequired />
        <Validate.ValidationErrorTranslations />
      </TabPanel>

      {/* File tab */}
      <TabPanel>
        <FileTabFields />
      </TabPanel>

      {/* Registration tab */}
      <TabPanel>
        <FormattedMessage
          description="File component registration tab configuration moved notice"
          defaultMessage={`The file registration options have been moved to the 'variables'
          tab of the form edit page.`}
        />
      </TabPanel>

      {/* FAQItems tab */}
      <TabPanel>
        <FAQItems />
      </TabPanel>

      {/* Translations */}
      <TabPanel>
        <Translations.ComponentTranslations<FileComponentSchema>
          propertyLabels={{
            label: intl.formatMessage(LABELS.label),
            description: intl.formatMessage(LABELS.description),
            tooltip: intl.formatMessage(LABELS.tooltip),
          }}
        >
          <FAQItemsTranslations />
        </Translations.ComponentTranslations>
      </TabPanel>
    </Tabs>
  );
};

/**
 *
 * @todo options.withCredentials: true seems to be set somewhere -> session cookie
 *   needs to be sent by the SDK/client!
 */
EditForm.defaultValues = {
  // basic tab
  label: '',
  key: '',
  description: '',
  tooltip: '',
  showInSummary: true,
  showInEmail: false,
  showInPDF: true,
  hidden: false,
  clearOnHide: true,
  isSensitiveData: true,
  // Advanced tab
  conditional: {
    show: undefined,
    when: '',
    eq: '',
  },
  // Validation tab
  validate: {
    required: false,
    maxLength: 1, // equivalent of `multiple: false`
  },
  translatedErrors: {},
  openForms: {
    useConfigFiletypes: true,
    softRequired: false,
    translations: {},
    image: {
      resize: {
        apply: false,
        width: 2000,
        height: 2000,
      },
    },
  },
  // file tab
  file: {
    name: '',
    type: [],
    allowedTypesLabels: [],
  },
  fileMaxSize: '10MB',
};

export default EditForm;
