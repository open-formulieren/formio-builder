import {CosignV1ComponentSchema} from '@open-formulieren/types';
import {useFormikContext} from 'formik';
import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import useAsync from 'react-use/esm/useAsync';

import {
  BuilderTabs,
  Description,
  Hidden,
  Label,
  Translations,
  useDeriveComponentKey,
} from '@/components/builder';
import {LABELS} from '@/components/builder/messages';
import {Select, TabList, TabPanel, Tabs} from '@/components/formio';
import {BuilderContext} from '@/context';
import {getErrorNames} from '@/utils/errors';

import {EditFormDefinition} from '../types';

/**
 * Form to configure a Formio 'coSign' (cosign v1) type component.
 */
const EditForm: EditFormDefinition<CosignV1ComponentSchema> = () => {
  const intl = useIntl();
  useDeriveComponentKey();
  const {errors} = useFormikContext<CosignV1ComponentSchema>();

  const erroredFields = Object.keys(errors).length
    ? getErrorNames<CosignV1ComponentSchema>(errors)
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
          hasErrors={hasAnyError('label', 'description', 'authPlugin', 'hidden')}
        />
        <BuilderTabs.Translations hasErrors={hasAnyError('openForms.translations')} />
      </TabList>

      {/* Basic tab */}
      <TabPanel>
        <Label />
        <Description />
        <AuthPlugin />
        <Hidden />
      </TabPanel>

      {/* Translations */}
      <TabPanel>
        <Translations.ComponentTranslations<CosignV1ComponentSchema>
          propertyLabels={{
            label: intl.formatMessage(LABELS.label),
            description: intl.formatMessage(LABELS.description),
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
  // basic tab
  label: '',
  key: '',
  description: '',
  hidden: false,
  authPlugin: '',
};

export interface AuthPluginOption {
  id: string;
  label: string;
}

function isAuthPluginOptions(
  options: AuthPluginOption[] | undefined
): options is AuthPluginOption[] {
  return options !== undefined;
}

export const AuthPlugin: React.FC = () => {
  const {getAuthPlugins} = useContext(BuilderContext);
  const {value: options, loading, error} = useAsync(async () => await getAuthPlugins(), []);
  if (error) {
    throw error;
  }
  const _options = isAuthPluginOptions(options) ? options : [];
  return (
    <Select
      name="authPlugin"
      label={
        <FormattedMessage
          description="Label for 'authPlugin' builder field"
          defaultMessage="Authentication method"
        />
      }
      description={
        <FormattedMessage
          description="Description for 'authPlugin' builder field"
          defaultMessage={`Which authentication method the co-signer must use. Note that
          this must be an authentication method available on the form.`}
        />
      }
      isLoading={loading}
      options={_options}
      valueProperty="id"
    />
  );
};

export default EditForm;
