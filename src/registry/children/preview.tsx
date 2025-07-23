import {ChildrenComponentSchema} from '@open-formulieren/types';
import {FormattedMessage} from 'react-intl';

import {Description} from '@/components/formio';
import {FieldSet, TextField} from '@/components/formio';

import {ComponentPreviewProps} from '../types';

const Preview: React.FC<ComponentPreviewProps<ChildrenComponentSchema>> = ({component}) => {
  const {key, label, description, tooltip} = component;

  return (
    <FieldSet field={key} label={label} tooltip={tooltip}>
      <TextField
        name={`${key}.bsn`}
        label={<FormattedMessage description="Label for child's BSN" defaultMessage="BSN" />}
        value="123456788"
        disabled
      />
      <TextField
        name={`${key}.firstNames`}
        label={
          <FormattedMessage
            description="Label for child's first names"
            defaultMessage="Firstnames"
          />
        }
        value="Alan"
        disabled
      />
      <TextField
        name={`${key}.dateOfBirth`}
        label={
          <FormattedMessage
            description="Label for child's date of birth"
            defaultMessage="Date of birth"
          />
        }
        value="2000-08-09"
        disabled
      />
      {description && <Description text={description} />}
    </FieldSet>
  );
};

export default Preview;
