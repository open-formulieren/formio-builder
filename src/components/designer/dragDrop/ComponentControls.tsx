import type {AnyComponentSchema} from '@open-formulieren/types';
import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {DesignerContext} from '@/context';

import './ComponentControls.scss';

interface ComponentControlsProps {
  component: AnyComponentSchema;
}

const ComponentControls: React.FC<ComponentControlsProps> = ({component}) => {
  const intl = useIntl();
  const {editComponent, deleteComponent} = useContext(DesignerContext);

  return (
    <div className="offb-component-controls btn-group">
      <button
        className="btn btn-xxs btn-secondary"
        title={intl.formatMessage({
          description: 'Form designer preview edit component button title',
          defaultMessage: 'Edit component',
        })}
        onClick={event => {
          event.preventDefault();
          editComponent(component);
        }}
      >
        <span className="sr-only">
          <FormattedMessage
            description="Form designer preview edit component button label"
            defaultMessage="Edit component"
          />
        </span>
        <i className="fa fa-cog" aria-hidden="true" />
      </button>
      <button
        className="btn btn-xxs btn-danger"
        title={intl.formatMessage({
          description: 'Form designer preview delete component button title',
          defaultMessage: 'Delete component',
        })}
        onClick={event => {
          event.preventDefault();
          deleteComponent(component);
        }}
      >
        <span className="sr-only">
          <FormattedMessage
            description="Form designer preview delete component button label"
            defaultMessage="Delete component"
          />
        </span>
        <i className="fa fa-trash" aria-hidden="true" />
      </button>
    </div>
  );
};

export default ComponentControls;
