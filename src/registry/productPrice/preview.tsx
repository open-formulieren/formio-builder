import {ProductPriceComponentSchema} from '@open-formulieren/types';
import {useIntl} from 'react-intl';

import {Radio} from '@/components/formio';

import {ComponentPreviewProps} from '../types';

/**
 * Show a formio productPrice component preview.
 *
 * NOTE: for the time being, this is rendered in the default Formio bootstrap style,
 * however at some point this should use the components of
 * @open-formulieren/formio-renderer instead for a more accurate preview.
 */
const Preview: React.FC<ComponentPreviewProps<ProductPriceComponentSchema>> = ({component}) => {
  const intl = useIntl();
  const {key, label, description, tooltip, validate = {}} = component;
  const {required = false} = validate;
  const options = [
    {
      value: 'option 1',
      label: intl.formatMessage({
        description: 'productPrice dummy option',
        defaultMessage: 'option 1: € 10,99',
      }),
    },
    {
      value: 'option 2',
      label: intl.formatMessage({
        description: 'productPrice dummy option',
        defaultMessage: 'option 2: € 15,99',
      }),
    },
  ];
  return (
    <Radio
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
