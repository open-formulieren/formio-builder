import {FileComponentSchema} from '@open-formulieren/types';
import {FormattedMessage} from 'react-intl';

import {Component, Description} from '@/components/formio';

import {ComponentPreviewProps} from '../types';

/**
 * Show a formio file component preview.
 *
 * NOTE: for the time being, this is rendered in the default Formio bootstrap style,
 * however at some point this should use the components of
 * @open-formulieren/formio-renderer instead for a more accurate preview.
 */
const Preview: React.FC<ComponentPreviewProps<FileComponentSchema>> = ({component}) => {
  const {key, label, description, tooltip, validate = {}} = component;
  const {required = false} = validate;

  return (
    <Component
      type="file"
      field={key}
      required={required}
      htmlId={`editform-${key}`}
      label={label}
      tooltip={tooltip}
    >
      <ul className="list-group list-group-striped">
        <li className="list-group-item list-group-header hidden-xs hidden-sm">
          <div className="row">
            <div className="col-md-1"></div>

            <div className="col-md-9">
              <strong>
                <FormattedMessage
                  description="file component preview: file name column header"
                  defaultMessage="File name"
                />
              </strong>
            </div>
            <div className="col-md-2">
              <strong>
                <FormattedMessage
                  description="file component preview: file size column header"
                  defaultMessage="Size"
                />
              </strong>
            </div>
          </div>
        </li>
      </ul>

      <div className="fileSelector">
        <i className="fa fa-cloud-upload"></i>
        <FormattedMessage
          description="file component: drag/select files to upload text"
          defaultMessage="Drag or <browse>select</browse> files to upload."
          values={{
            browse: nodes => (
              <a
                href="#"
                className="browser"
                onClick={e => {
                  e.preventDefault();
                  alert('Uploading is disabled in preview mode.');
                }}
              >
                {nodes}
              </a>
            ),
          }}
        />
        <div className="loader-wrapper">
          <div className="loader text-center" />
        </div>
      </div>
      {description && <Description text={description} />}
    </Component>
  );
};

export default Preview;
