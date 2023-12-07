import {css} from '@emotion/css';
import {EditGridComponentSchema} from '@open-formulieren/types';
import {FormattedMessage} from 'react-intl';

import {Component, Description} from '@/components/formio';

import {ComponentPreviewProps} from '../types';

const PREVIEW_EDITGRID_BODY = css`
  padding-inline: 10px;
  padding-block: 20px;
  text-align: center;
  font-style: italic;
  border: solid 1px var(--fieldset-preview-border-color, #ccc);
  border-radius: 2px;
  background-size: 50px 50px;
  background-color: var(--fieldset-preview-background-color, #eee);
  background-image: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.04) 25%,
    transparent 25%,
    transparent 50%,
    rgba(0, 0, 0, 0.04) 50%,
    rgba(0, 0, 0, 0.04) 75%,
    transparent 75%,
    transparent
  );
`;

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
        <div className={PREVIEW_EDITGRID_BODY}>
          <FormattedMessage
            description="Edit grid preview content description"
            defaultMessage="{groupLabel} 1"
            values={{groupLabel}}
          />
        </div>
        <div className={PREVIEW_EDITGRID_BODY}>
          <FormattedMessage
            description="Edit grid preview content description"
            defaultMessage="{groupLabel} 2"
            values={{groupLabel}}
          />
        </div>
        <div className={PREVIEW_EDITGRID_BODY}>
          <FormattedMessage
            description="Edit grid preview content description"
            defaultMessage="{groupLabel} 3"
            values={{groupLabel}}
          />
        </div>
      </div>

      {description && <Description text={description} />}
    </Component>
  );
};

export default Preview;
