import {getRegistryEntry} from '@open-formulieren/formio-renderer';
import {extractInitialValues} from '@open-formulieren/formio-renderer/values.js';
import type {AnyComponentSchema} from '@open-formulieren/types';
import {Formik} from 'formik';

import type {BuilderContextType} from '@/context';
import {BuilderContext} from '@/context';

import FormioDefinitionDesigner from './designer/FormioDefinitionDesigner';

export interface FormBuilderProps {
  /**
   * The components that are edited in the form builder.
   */
  components: AnyComponentSchema[];
  /**
   * A collection of all components in the form, created by flattening the form
   * definitions. Used when creating component keys to validate complete uniqueness.
   */
  componentNamespace: AnyComponentSchema[];
  onChange: (components: AnyComponentSchema[]) => void;
}

export type MergedFormBuilderProps = FormBuilderProps & BuilderContextType;

const FormBuilder: React.FC<MergedFormBuilderProps> = ({
  components,
  componentNamespace,
  onChange,
  uniquifyKey,
  supportedLanguageCodes = ['nl', 'en'],
  richTextColors,
  theme,
  formType,
  getFormComponents,
  getValidatorPlugins,
  getRegistrationAttributes,
  getServices,
  getReferenceListsTables,
  getReferenceListsTableItems,
  getPrefillPlugins,
  getPrefillAttributes,
  getFileTypes,
  serverUploadLimit,
  getAuthPlugins,
  getMapTileLayers,
  getMapOverlayTileLayers,
}) => {
  const initialValues = extractInitialValues(components, getRegistryEntry);

  return (
    <BuilderContext.Provider
      value={{
        uniquifyKey,
        supportedLanguageCodes,
        richTextColors,
        formType,
        getMapTileLayers,
        getMapOverlayTileLayers,
        theme,
        getFormComponents,
        getValidatorPlugins,
        getRegistrationAttributes,
        getServices,
        getReferenceListsTables,
        getReferenceListsTableItems,
        getPrefillPlugins,
        getPrefillAttributes,
        getFileTypes,
        serverUploadLimit,
        getAuthPlugins,
      }}
    >
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={() => {
          throw new Error("Can't submit preview form");
        }}
      >
        <FormioDefinitionDesigner
          components={components}
          componentNamespace={componentNamespace}
          onChange={onChange}
        />
      </Formik>
    </BuilderContext.Provider>
  );
};

export default FormBuilder;
