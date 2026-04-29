import {AnyComponentSchema} from '@open-formulieren/types';
import clsx from 'clsx';
import {Formik} from 'formik';
import {useIntl} from 'react-intl';

import ErrorBoundary from '@/components/error/ErrorBoundary';
import {getRegistryEntry} from '@/registry';
import {hasOwnProperty} from '@/types';

import './Preview.scss';
import {DragContainer, DraggableComponent} from './drag-n-drop';

export interface ComponentsPreviewProps {
  components: AnyComponentSchema[];
}

export const ComponentsPreview: React.FC<ComponentsPreviewProps> = ({components}) => {
  const initialValues = components.reduce<Record<string, any>>((carry, component) => {
    const entry = getRegistryEntry(component);
    const {key} = component;
    const {defaultValue = ''} = entry;

    const isMultiple = hasOwnProperty(component, 'multiple') ? component.multiple : false;
    const componentDefaultValue = hasOwnProperty(component, 'defaultValue')
      ? component.defaultValue
      : defaultValue;

    const previewDefaultValue = isMultiple
      ? componentDefaultValue ?? []
      : componentDefaultValue ?? defaultValue;

    carry[key] = previewDefaultValue;
    return carry;
  }, {});

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={() => {
        throw new Error("Can't submit preview form");
      }}
    >
      <div className="designer-preview-container">
        <ErrorBoundary>
          <DragContainer>
            {components.map(component => (
              <DraggableComponent key={component.key}>
                <ComponentPreview component={component} />
              </DraggableComponent>
            ))}
          </DragContainer>
        </ErrorBoundary>
      </div>
    </Formik>
  );
};

interface ComponentPreviewProps {
  component: AnyComponentSchema;
}

export const ComponentPreview: React.FC<ComponentPreviewProps> = ({component}) => {
  const intl = useIntl();
  const entry = getRegistryEntry(component);
  const {
    preview: {designer: PreviewComponent},
  } = entry;
  // @TODO Remove the undefined check when all components have a designer preview.
  if (PreviewComponent === undefined || PreviewComponent === null) {
    return null;
  }

  const isHidden = hasOwnProperty(component, 'hidden') ? component.hidden : false;

  return (
    <div
      className={clsx('designer-preview', `designer-preview--component-type-${component.type}`, {
        'designer-preview--hidden': isHidden,
      })}
      data-testid="designerPreview"
      title={
        isHidden
          ? intl.formatMessage({
              description: 'Form designer preview hidden component title',
              defaultMessage: 'Hidden component',
            })
          : undefined
      }
    >
      <PreviewComponent component={component} />
    </div>
  );
};

export default ComponentsPreview;
