import {AnyComponentSchema} from '@open-formulieren/types';
import clsx from 'clsx';
import {useState} from 'react';
import {useIntl} from 'react-intl';

import ComponentEditForm from '@/components/ComponentEditForm';
import Modal from '@/components/Modal';
import {getRegistryEntry} from '@/registry';
import {hasOwnProperty} from '@/types';

import ActionIcon from './ActionIcon';
import NestedComponents from './NestedComponents';

const getDefaultSummary = (component: AnyComponentSchema): string => {
  if (hasOwnProperty(component, 'label')) {
    return String(component.label);
  }
  return component.id || '-';
};

export interface StructurePreviewProps {
  component: AnyComponentSchema;
}

const StructurePreview: React.FC<StructurePreviewProps> = ({component}) => {
  const intl = useIntl();
  const [editModalOpen, setEditModalOpen] = useState(false);

  const {
    getSummary = getDefaultSummary,
    preview: {structureSubtree: StructureSubtree},
  } = getRegistryEntry(component);

  const className = clsx(
    'offb-form-preview-component',
    `offb-form-preview-component--${component.type}`,
    {
      'offb-form-preview-component--hidden': component.hidden,
    }
  );

  const subtree = StructureSubtree ? (
    <StructureSubtree
      component={component}
      renderSubtree={components => (
        <NestedComponents components={components} previewMode="structure" />
      )}
    />
  ) : null;

  return (
    <div className={className}>
      <button className="offb-form-preview-component__drag-handle">
        <i
          className="fa fa-grip-vertical"
          aria-label={intl.formatMessage({
            description: 'Accessible label for drag-and-drop handle icon',
            defaultMessage: 'Hold to drag',
          })}
        />
      </button>
      <div className="offb-form-preview-component__representation">
        <span className="offb-form-preview-component__representation-text">
          {getSummary(component)}
        </span>
        <span className="offb-form-preview-component__component-type">
          {/* TODO: add translations for the type values -> grab this from the builderInfo */}
          {component.type}
        </span>
      </div>
      <div className="offb-form-preview-component__controls">
        <ActionIcon icon="pencil" label="Edit" onClick={() => setEditModalOpen(true)} />
        <ActionIcon icon="times" label="Delete" onClick={() => alert('TODO')} />
      </div>
      {subtree && <div className="offb-form-preview-component__children">{subtree}</div>}

      <Modal
        isOpen={editModalOpen}
        closeModal={() => setEditModalOpen(false)}
        className="component-settings"
      >
        <div className="component-edit-container">
          <ComponentEditForm
            isNew={false}
            component={component}
            builderInfo={{
              title: 'TODO',
              group: 'TODO',
              icon: 'todo',
              schema: component,
              weight: 10,
            }}
            onCancel={() => setEditModalOpen(false)}
            onRemove={() => {
              console.log('REMOVE component', component);
              setEditModalOpen(false);
            }}
            onSubmit={() => {
              console.log('ALTER component', component);
              setEditModalOpen(false);
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default StructurePreview;
