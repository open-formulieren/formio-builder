import {FileComponentSchema} from '@open-formulieren/types';
import {useFormikContext} from 'formik';
import {FormattedMessage, useIntl} from 'react-intl';

import {
  BuilderTabs,
  ClearOnHide,
  Description,
  Hidden,
  IsSensitiveData,
  Key,
  Label,
  Multiple,
  PresentationConfig,
  SimpleConditional,
  Tooltip,
  Translations,
  Validate,
  useDeriveComponentKey,
} from '@/components/builder';
import {LABELS} from '@/components/builder/messages';
import {Tab, TabList, TabPanel, Tabs} from '@/components/formio';
import {getErrorNames} from '@/utils/errors';

import {EditFormDefinition} from '../types';
import FileTabFields from './file-tab';

/**
 * Form to configure a Formio 'file' type component.
 */
const EditForm: EditFormDefinition<FileComponentSchema> = () => {
  const intl = useIntl();
  const [isKeyManuallySetRef, generatedKey] = useDeriveComponentKey();
  const {errors} = useFormikContext<FileComponentSchema>();

  const erroredFields = Object.keys(errors).length
    ? getErrorNames<FileComponentSchema>(errors)
    : [];
  // TODO: pattern match instead of just string inclusion?
  // TODO: move into more generically usuable utility when we implement other component
  // types
  const hasAnyError = (...fieldNames: string[]): boolean => {
    if (!erroredFields.length) return false;
    return fieldNames.some(name => erroredFields.includes(name));
  };

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
            'multiple',
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
            'useConfigFiletypes',
            'of',
            'fileMaxSize',
            'maxNumberOfFiles'
          )}
        >
          <FormattedMessage
            description="Component edit form tab title for 'File' tab"
            defaultMessage="File"
          />
        </Tab>
        <BuilderTabs.Registration hasErrors={hasAnyError('registration')} />
        <BuilderTabs.Translations hasErrors={hasAnyError('openForms.translations')} />
      </TabList>

      {/* Basic tab */}
      <TabPanel>
        <Label />
        <Key isManuallySetRef={isKeyManuallySetRef} generatedValue={generatedKey} />
        <Description />
        <Tooltip />
        <PresentationConfig />
        <Multiple<FileComponentSchema> />
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
        <Validate.ValidationErrorTranslations />
      </TabPanel>

      {/* File tab */}
      <TabPanel>
        <FileTabFields />
      </TabPanel>

      {/* Registration tab */}
      <TabPanel>TODO</TabPanel>

      {/* Translations */}
      <TabPanel>
        <Translations.ComponentTranslations<FileComponentSchema>
          propertyLabels={{
            label: intl.formatMessage(LABELS.label),
            description: intl.formatMessage(LABELS.description),
            tooltip: intl.formatMessage(LABELS.tooltip),
          }}
        />
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
  storage: 'url',
  url: '',
  // TODO -> add to type definition!
  // options: '{"withCredentials": true}',
  // webcam: false,

  // basic tab
  label: '',
  key: '',
  description: '',
  tooltip: '',
  showInSummary: true,
  showInEmail: false,
  showInPDF: true,
  multiple: false,
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
  },
  translatedErrors: {},
  // file tab
  file: {
    name: '',
    type: [],
    allowedTypesLabels: [],
  },
  filePattern: '*',
  useConfigFiletypes: false,
  of: {
    image: {
      resize: {
        apply: false,
        width: 2000,
        height: 2000,
      },
    },
  },
  fileMaxSize: '10MB',
  maxNumberOfFiles: null,
  // registration tab
  registration: {
    informatieobjecttype: '',
    bronorganisatie: '',
    docVertrouwelijkheidaanduiding: '',
    titel: '',
  },
};

export default EditForm;
