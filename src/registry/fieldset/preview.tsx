import {FieldsetComponentSchema} from '@open-formulieren/types';
import {FormattedMessage} from 'react-intl';

import ContentPlaceholder from '@/components/ContentPlaceholder';
import {FieldSet} from '@/components/formio';

import {ComponentPreviewProps} from '../types';

/**
 * Show a formio fieldset component preview.
 */
const Preview: React.FC<ComponentPreviewProps<FieldsetComponentSchema>> = ({component}) => {
  const {label, hideHeader, tooltip} = component;
  return (
    <FieldSet label={hideHeader ? undefined : label} tooltip={tooltip}>
      <ContentPlaceholder>
        <FormattedMessage
          description="Fieldset preview content description"
          defaultMessage="Fieldset content"
        />
      </ContentPlaceholder>
    </FieldSet>
  );
};

export default Preview;
