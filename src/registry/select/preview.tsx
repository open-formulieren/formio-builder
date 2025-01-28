import {SelectComponentSchema} from '@open-formulieren/types';
import {useIntl} from 'react-intl';

import {Select} from '@/components/formio';
import {Option} from '@/components/formio/select';

import {ComponentPreviewProps} from '../types';
import {
  checkIsManualOptions,
  checkIsReferentielijstenOptions,
  checkIsVariableOptions,
} from './helpers';

/**
 * Show a formio select component preview.
 *
 * NOTE: for the time being, this is rendered in the default Formio bootstrap style,
 * however at some point this should use the components of
 * @open-formulieren/formio-renderer instead for a more accurate preview.
 */
const Preview: React.FC<ComponentPreviewProps<SelectComponentSchema>> = ({component}) => {
  const intl = useIntl();
  const {key, label, description, tooltip, validate, multiple} = component;
  const {required = false} = validate || {};

  let options: Option[] = [];
  if (checkIsManualOptions(component)) {
    options = component?.data?.values || [];
  } else if (checkIsReferentielijstenOptions(component)) {
    options = [
      {
        value: 'option1',
        label: intl.formatMessage({
          description: 'Radio dummy option1 from referentielijsten',
          defaultMessage: 'Option from referentielijsten: option1',
        }),
      },
    ];
  } else if (checkIsVariableOptions(component)) {
    options = [
      {
        value: 'itemsExpression',
        label: intl.formatMessage(
          {
            description: 'Select dummy option for itemsExpression',
            defaultMessage: 'Options from expression: <code>{expression}</code>',
          },
          {
            expression: JSON.stringify(component.openForms.itemsExpression),
            code: chunks => <code>{chunks}</code>,
          }
        ),
      },
    ];
  }

  return (
    <Select
      name={key}
      options={options}
      label={label}
      tooltip={tooltip}
      required={required}
      description={description}
      isMulti={!!multiple}
      isClearable
    />
  );
};

export default Preview;
