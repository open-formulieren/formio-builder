import {EditGridComponentSchema} from '@open-formulieren/types';
import {FormattedMessage} from 'react-intl';

import ContentPlaceholder from '@/components/ContentPlaceholder';
import {Component, Description} from '@/components/formio';

import {ComponentPreviewProps} from '../types';

/**
 * Show a formio fieldset component preview.
 */
const Preview: React.FC<ComponentPreviewProps<EditGridComponentSchema>> = ({component}) => {
  const {label, key, description, validate = {}, tooltip, groupLabel, hideLabel} = component;
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
      <div style={{display: 'flex', flexDirection: 'column', gap: '1em'}}>
        <ContentPlaceholder>
          <FormattedMessage
            description="Edit grid preview content description"
            defaultMessage="{groupLabel} 1"
            values={{groupLabel}}
          />
        </ContentPlaceholder>
        <ContentPlaceholder>
          <FormattedMessage
            description="Edit grid preview content description"
            defaultMessage="{groupLabel} 2"
            values={{groupLabel}}
          />
        </ContentPlaceholder>
        <ContentPlaceholder>
          <FormattedMessage
            description="Edit grid preview content description"
            defaultMessage="{groupLabel} 3"
            values={{groupLabel}}
          />
        </ContentPlaceholder>
      </div>

      {description && <Description text={description} />}
    </Component>
  );
};

export default Preview;
