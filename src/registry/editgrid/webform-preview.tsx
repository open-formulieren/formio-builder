import type {EditGridComponentSchema} from '@open-formulieren/types';
import {FormattedMessage} from 'react-intl';

import {Component, Description} from '@/components/formio';
import type {WebformPreviewProps} from '@/registry/types';

/**
 * Show a formio fieldset component preview.
 */
const WebformPreview: React.FC<WebformPreviewProps<EditGridComponentSchema>> = ({
  component,
  renderSubtree,
}) => {
  const {
    label,
    key,
    description,
    validate = {},
    tooltip,
    groupLabel,
    hideLabel,
    components,
  } = component;
  const {required = false} = validate;
  return (
    <Component
      type="editgrid"
      field={key}
      required={required}
      htmlId={`editform-${key}`}
      label={hideLabel ? undefined : label}
      tooltip={tooltip}
    >
      {/* TODO: properly use formik arrayhelper here */}
      <div>
        <FormattedMessage
          description="Edit grid preview content description"
          defaultMessage="{groupLabel} 1"
          values={{groupLabel}}
        />
      </div>
      {renderSubtree(components)}
      {description && <Description text={description} />}
    </Component>
  );
};

export default WebformPreview;
