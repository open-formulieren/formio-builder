import {FormattedMessage, defineMessages, useIntl} from 'react-intl';

import {Select} from '@/components/formio';

import {OptionValue} from './types';

const OPTION_LABELS = defineMessages<OptionValue>({
  manual: {
    description: "Data source option label for value 'manual'",
    defaultMessage: 'Manually fill in',
  },
  variable: {
    description: "Data source option label for value 'variable'",
    defaultMessage: 'From variable',
  },
});

// define the values with the the desired correct order
const OPTION_VALUES = ['manual', 'variable'] as const;

/**
 * The `ValuesSrc` component is used to configure on the component where options/values
 * are sourced from.
 *
 * The available options can be specified manually, or they can be derived from another
 * existing 'variable' through a JsonLogic expression.
 *
 * This component requires a compatible schema like `SelectComponentSchema`,
 * `RadioComponentSchema` or `SelectboxesComponentSchema`.
 *
 * @todo: on change, the *other* configuration aspect needs to be cleared/reset.
 */
export const ValuesSrc: React.FC = () => {
  const intl = useIntl();
  const options = OPTION_VALUES.map(val => ({
    value: val,
    label: intl.formatMessage(OPTION_LABELS[val]),
  }));
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'openForms.dataSrc' builder field",
    defaultMessage: 'How to specify the available options.',
  });
  return (
    <Select
      name="openForms.dataSrc"
      label={
        <FormattedMessage
          description="Label for 'openForms.dataSrc' builder field"
          defaultMessage="Data source"
        />
      }
      required
      tooltip={tooltip}
      valueProperty="value"
      options={options}
    />
  );
};

export default ValuesSrc;
