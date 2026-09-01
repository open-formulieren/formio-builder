import type {AnyComponentSchema} from '@open-formulieren/types';
import {clsx} from 'clsx';
import {useContext} from 'react';
import type {MessageDescriptor} from 'react-intl';
import {FormattedMessage, defineMessages, useIntl} from 'react-intl';

import {DesignerContext} from '@/context';

import './ComponentControls.scss';

interface ComponentControlsProps {
  component: AnyComponentSchema;
}

const COMPONENT_CONTROL_LABELS = defineMessages({
  editComponent: {
    description: 'Form designer preview edit component button title',
    defaultMessage: 'Edit component',
  },
  deleteComponent: {
    description: 'Form designer preview delete component button title',
    defaultMessage: 'Delete component',
  },
});

const ComponentControls: React.FC<ComponentControlsProps> = ({component}) => {
  const intl = useIntl();

  return (
    <div
      className="offb-component-controls btn-group"
      role="group"
      aria-label={intl.formatMessage({
        description: 'Form designer preview component controls accessible label',
        defaultMessage: 'Component controls',
      })}
    >
      <EditControl component={component} />
      <DeleteControl component={component} />
    </div>
  );
};

const EditControl: React.FC<ComponentControlsProps> = ({component}) => {
  const {editComponent} = useContext(DesignerContext);

  return (
    <ComponentControl
      className="btn-secondary"
      icon="cog"
      label={COMPONENT_CONTROL_LABELS.editComponent}
      onClick={() => editComponent(component)}
    />
  );
};

const DeleteControl: React.FC<ComponentControlsProps> = ({component}) => {
  const {deleteComponent} = useContext(DesignerContext);

  return (
    <ComponentControl
      className="btn-danger"
      icon="trash-can"
      label={COMPONENT_CONTROL_LABELS.deleteComponent}
      onClick={() => deleteComponent(component)}
    />
  );
};

interface ComponentControlProps {
  className: string;
  icon: string;
  label: MessageDescriptor;
  onClick: () => void;
}

const ComponentControl: React.FC<ComponentControlProps> = ({className, icon, label, onClick}) => {
  const intl = useIntl();
  return (
    <button
      className={clsx('btn btn-xxs', className)}
      title={intl.formatMessage(label)}
      onClick={event => {
        event.preventDefault();
        onClick();
      }}
    >
      <span className="sr-only">
        <FormattedMessage {...label} />
      </span>
      <i className={`fa fa-${icon}`} aria-hidden="true" />
    </button>
  );
};

export default ComponentControls;
