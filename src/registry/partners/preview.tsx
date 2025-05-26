import {PartnersComponentSchema} from '@open-formulieren/types';
import {FormattedMessage} from 'react-intl';

import {Description} from '@/components/formio';
import {FieldSet, TextField} from '@/components/formio';

import {ComponentPreviewProps} from '../types';

const Preview: React.FC<ComponentPreviewProps<PartnersComponentSchema>> = ({component}) => {
  const {key, label, description, tooltip} = component;

  return (
    <FieldSet field={key} label={label} tooltip={tooltip}>
      <TextField
        name={`${key}.bsn`}
        label={<FormattedMessage description="Label for partner's BSN" defaultMessage="BSN" />}
        value="123456788"
        disabled
      />
      <TextField
        name={`${key}.initials`}
        label={
          <FormattedMessage description="Label for partner's initials" defaultMessage="Initials" />
        }
        value="J"
        disabled
      />
      <TextField
        name={`${key}.affixes`}
        label={
          <FormattedMessage description="Label for partner's affixes" defaultMessage="Affixes" />
        }
        value="Van"
        disabled
      />
      <TextField
        name={`${key}.lastname`}
        label={
          <FormattedMessage description="Label for partner's lastname" defaultMessage="Lastname" />
        }
        value="Deniston"
        disabled
      />
      <TextField
        name={`${key}.dateOfBirth`}
        label={
          <FormattedMessage
            description="Label for partner's date of birth"
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
