import {JSONEditor} from '@open-formulieren/monaco-json-editor';
import {FallbackSchema} from '@open-formulieren/types';
import {FormattedMessage} from 'react-intl';

import {BuilderContext, BuilderContextType} from '@/context';
import {isKnownComponentType} from '@/registry';

import ComponentEditForm, {ComponentEditFormProps} from './ComponentEditForm';

type MergedProps = BuilderContextType & ComponentEditFormProps;
export type ComponentConfigurationProps = Omit<MergedProps, 'component'> & {
  component: MergedProps['component'] | FallbackSchema;
};

/**
 * The main entrypoint to edit a component in the builder modal.
 *
 * This component wraps around the context provider to expose Formio builder helper
 * functions and utilities down to the low-level components used to render the
 * configuration form.
 *
 * @param options.uniquifyKey              Function to make component key unique in the context of all existing components.
 * @param options.getFormComponents        Function returning all other Formio components in the builder context.
 * @param options.isNew                    Whether the Formio component is a new component being added or an existing being edited.
 * @param options.component                The (starter) schema of the Formio component being edited.
 * @param options.builderInfo              Meta information from the builder configuration for the Formio component.
 * @param options.onCancel                 Callback to invoke when the 'cancel' button is clicked.
 * @param options.onRemove                 Callback to invoke when the 'remove' button is clicked.
 * @param options.onSubmit                 Callback to invoke when the form is saved. Receives the component
 *                                         configuration JSON object.
 */
const ComponentConfiguration: React.FC<ComponentConfigurationProps> = ({
  uniquifyKey,
  supportedLanguageCodes = ['nl', 'en'],
  richTextColors,
  getMapTileLayers,
  theme,
  getFormComponents,
  getValidatorPlugins,
  getRegistrationAttributes,
  getServices,
  getReferentielijstenTabellen,
  getReferentielijstenTabelItems,
  getPrefillPlugins,
  getPrefillAttributes,
  getFileTypes,
  serverUploadLimit,
  getDocumentTypes,
  getConfidentialityLevels,
  getAuthPlugins,
  isNew,
  component,
  builderInfo,
  onCancel,
  onRemove,
  onSubmit,
}) => {
  if (!isKnownComponentType(component)) {
    return <Fallback theme={theme} component={component} />;
  }
  return (
    <BuilderContext.Provider
      value={{
        uniquifyKey,
        supportedLanguageCodes,
        richTextColors,
        getMapTileLayers,
        theme,
        getFormComponents,
        getValidatorPlugins,
        getRegistrationAttributes,
        getServices,
        getReferentielijstenTabellen,
        getReferentielijstenTabelItems,
        getPrefillPlugins,
        getPrefillAttributes,
        getFileTypes,
        serverUploadLimit,
        getDocumentTypes,
        getConfidentialityLevels,
        getAuthPlugins,
      }}
    >
      <ComponentEditForm
        isNew={isNew}
        component={component}
        builderInfo={builderInfo}
        onCancel={onCancel}
        onRemove={onRemove}
        onSubmit={onSubmit}
      />
    </BuilderContext.Provider>
  );
};

interface FallbackProps {
  component: FallbackSchema;
  theme: BuilderContextType['theme'];
}

const Fallback: React.FC<FallbackProps> = ({component, theme}) => (
  <>
    <FormattedMessage
      tagName="p"
      description="Informational message about unsupported component"
      defaultMessage="The component type <code>{type}</code> is unknown. We can only display the JSON definition."
      values={{
        type: component.type ?? '-',
        code: chunks => <code>{chunks}</code>,
      }}
    />
    <JSONEditor
      wrapperProps={{className: 'json-editor'}}
      value={component}
      onChange={() => alert('Editing is not possible in unknown components.')}
      theme={theme}
      readOnly
    />
  </>
);

export default ComponentConfiguration;
