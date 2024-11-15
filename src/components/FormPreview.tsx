import {AnyComponentSchema} from '@open-formulieren/types';
import clsx from 'clsx';
import {Formik} from 'formik';
import {set} from 'lodash';
import {useState} from 'react';
import {FormattedMessage} from 'react-intl';

import ModeToggle from '@/components/ModeToggle';
import {getRegistryEntry} from '@/registry';
import {hasOwnProperty} from '@/types';

import {NestedComponents, PreviewMode} from './previews';

export interface FormPreviewProps {
  components: AnyComponentSchema[];
}

/**
 * Renders a preview of a Formio form definition.
 *
 * Pass the formio form configuration as an array of component definitions, and they
 * will be rendered in order (and recursively). Preview components get controls for
 * editing and some visual feedback about state (such as hidden/visible).
 *
 * The preview renders in one of two modes: structure or webform:
 *
 * - structure mode shows the hierarchy and allows you to re-arrange/modify the
 *   individual components
 * - webform mode gives an impression of the resulting form, without any distracting
 *   controls
 */
const FormPreview: React.FC<FormPreviewProps> = ({components}) => {
  const [previewMode, setPreviewMode] = useState<PreviewMode>('structure');

  const initialValues: Record<string, unknown> = {};

  // TODO: delegate this to the registry so that we can get default values for nested
  // components too (basically the equivalent of iter_components)
  for (const component of components) {
    const entry = getRegistryEntry(component);
    const defaultValue = hasOwnProperty(component, 'defaultValue')
      ? component.defaultValue
      : entry.defaultValue ?? '';
    set(initialValues, component.key, defaultValue);
  }

  return (
    <div className={clsx('offb-form-preview', `offb-form-preview--${previewMode}`)}>
      <ModeToggle<PreviewMode>
        name="previewMode"
        currentMode={previewMode}
        onToggle={mode => setPreviewMode(mode)}
        modes={[
          {
            value: 'structure',
            label: (
              <FormattedMessage
                description="Form 'structure' preview mode"
                defaultMessage="Structure"
              />
            ),
          },
          {
            value: 'webform',
            label: (
              <FormattedMessage description="Form 'Form' preview mode" defaultMessage="Form" />
            ),
          },
        ]}
        className="offb-form-preview__mode-toggle"
      />

      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={() => {
          window.alert("Can't submit a preview form.");
        }}
      >
        <NestedComponents components={components} previewMode={previewMode} />
      </Formik>
    </div>
  );
};

export default FormPreview;
