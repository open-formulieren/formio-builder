import type {AnyComponentSchema} from '@open-formulieren/types';
import {useContext} from 'react';
import {FormattedMessage, defineMessage, useIntl} from 'react-intl';

import {DesignerContext} from '@/context';

import './ComponentControls.scss';

interface ComponentControlsProps {
  component: AnyComponentSchema;
}

const ComponentControls: React.FC<ComponentControlsProps> = ({component}) => {
  const intl = useIntl();
  const {editComponent, deleteComponent} = useContext(DesignerContext);

  const editComponentTitle = defineMessage({
    description: 'Form designer preview edit component button title',
    defaultMessage: 'Edit component',
  });
  const deleteComponentTitle = defineMessage({
    description: 'Form designer preview delete component button title',
    defaultMessage: 'Delete component',
  });

  return (
    <div className="offb-component-controls btn-group">
      <button
        className="btn btn-xxs btn-secondary"
        title={intl.formatMessage(editComponentTitle)}
        onClick={event => {
          event.preventDefault();
          editComponent(component);
        }}
      >
        <span className="sr-only">
          <FormattedMessage {...editComponentTitle} />
        </span>
        <i className="fa fa-cog" aria-hidden="true" />
      </button>
      <button
        className="btn btn-xxs btn-danger"
        title={intl.formatMessage(deleteComponentTitle)}
        onClick={event => {
          event.preventDefault();
          deleteComponent(component);
        }}
      >
        <span className="sr-only">
          <FormattedMessage {...deleteComponentTitle} />
        </span>
        <i className="fa fa-trash" aria-hidden="true" />
      </button>
    </div>
  );
};

export default ComponentControls;
