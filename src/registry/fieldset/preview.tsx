import {css} from '@emotion/css';
import {FieldsetComponentSchema} from '@open-formulieren/types';
import {FormattedMessage} from 'react-intl';

import {FieldSet} from '@/components/formio';

import {ComponentPreviewProps} from '../types';

const PREVIEW_FIELDSET_BODY = css`
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
const Preview: React.FC<ComponentPreviewProps<FieldsetComponentSchema>> = ({component}) => {
  const {label, hideHeader, tooltip} = component;
  return (
    <FieldSet label={hideHeader ? undefined : label} tooltip={tooltip}>
      <div className={PREVIEW_FIELDSET_BODY}>
        <FormattedMessage
          description="Fieldset preview content description"
          defaultMessage="Fieldset content"
        />
      </div>
    </FieldSet>
  );
};

export default Preview;
