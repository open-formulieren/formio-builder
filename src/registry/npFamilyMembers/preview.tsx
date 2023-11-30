import {NpFamilyMembersComponentSchema} from '@open-formulieren/types';
import {useIntl} from 'react-intl';

import {SelectBoxes} from '@/components/formio';

import {ComponentPreviewProps} from '../types';

/**
 * Show a formio npFamilyMembers component preview.
 *
 * NOTE: for the time being, this is rendered in the default Formio bootstrap style,
 * however at some point this should use the components of
 * @open-formulieren/formio-renderer instead for a more accurate preview.
 */
const Preview: React.FC<ComponentPreviewProps<NpFamilyMembersComponentSchema>> = ({component}) => {
  const intl = useIntl();
  const {
    key,
    label,
    description,
    tooltip,
    validate = {},
    includeChildren,
    includePartners,
  } = component;
  const {required = false} = validate;
  const options = [];
  if (includePartners) {
    options.push({
      value: 'partner1',
      label: intl.formatMessage({
        description: 'npFamilyMembers dummy option for partner',
        defaultMessage: 'Partner 1',
      }),
    });
  }
  if (includeChildren) {
    options.push({
      value: 'child1',
      label: intl.formatMessage({
        description: 'npFamilyMembers dummy option for child',
        defaultMessage: 'Child 1',
      }),
    });
  }
  return (
    <SelectBoxes
      name={key}
      options={options}
      label={label}
      tooltip={tooltip}
      required={required}
      description={description}
    />
  );
};

export default Preview;
