import {SelectboxesComponentSchema} from '@open-formulieren/types';
import {useIntl} from 'react-intl';

import {SelectBoxes} from '@/components/formio';
import {Option} from '@/components/formio/selectboxes';

import {ComponentPreviewProps} from '../types';
import {
  checkIsManualOptions,
  checkIsReferentielijstenOptions,
  checkIsVariableOptions,
} from './helpers';

/**
 * Show a formio selectboxes component preview.
 *
 * NOTE: for the time being, this is rendered in the default Formio bootstrap style,
 * however at some point this should use the components of
 * @open-formulieren/formio-renderer instead for a more accurate preview.
 */
const Preview: React.FC<ComponentPreviewProps<SelectboxesComponentSchema>> = ({component}) => {
  const intl = useIntl();
  const {key, label, description, tooltip, validate} = component;
  const {required = false} = validate || {};

  let options: Option[] = [];
  if (checkIsManualOptions(component)) {
    options = component?.values || [];
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
            description: 'Selectboxes dummy option for itemsExpression',
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
