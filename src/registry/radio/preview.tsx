import {RadioComponentSchema} from '@open-formulieren/types';
import {useIntl} from 'react-intl';

import {Radio} from '@/components/formio';

import {ComponentPreviewProps} from '../types';
import {checkIsManualOptions} from './helpers';

/**
 * Show a formio radio component preview.
 *
 * NOTE: for the time being, this is rendered in the default Formio bootstrap style,
 * however at some point this should use the components of
 * @open-formulieren/formio-renderer instead for a more accurate preview.
 */
const Preview: React.FC<ComponentPreviewProps<RadioComponentSchema>> = ({component}) => {
  const intl = useIntl();
  const {key, label, description, tooltip, validate} = component;
  const {required = false} = validate || {};
  const isManualOptions = checkIsManualOptions(component);
  const options = isManualOptions
    ? component.values || []
    : [
        {
          value: 'itemsExpression',
          label: intl.formatMessage(
            {
              description: 'Radio dummy option for itemsExpression',
              defaultMessage: 'Options from expression: <code>{expression}</code>',
            },
            {
              expression: JSON.stringify(component.openForms.itemsExpression),
              code: chunks => <code>{chunks}</code>,
            }
          ),
        },
      ];
  return (
    <Radio
      name={key}
      options={options}
      label={label}
      tooltip={tooltip}
      required={required}
      isClearable={false}
      description={description}
    />
  );
};

export default Preview;
