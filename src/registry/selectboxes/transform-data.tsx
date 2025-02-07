import {FormattedMessage, useIntl} from 'react-intl';

import {Checkbox} from '@/components/formio';

const TransformData = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage(
    {
      description: "Tooltip for selectboxes 'Transform data' builder field",
      defaultMessage: `Transform the submitted data to a list with the selected choices, instead of an
      object that maps choices to <code>true</code> or <code>false</code> (dependent on whether they are selected).`,
    },
    {
      code: chunks => <code>{chunks}</code>,
    }
  ) as string; // library doesn't narrow the type when using template fns :(

  return (
    <Checkbox
      name="openForms.transformData"
      label={
        <FormattedMessage
          description="Label for selectboxes 'Transform data' builder field"
          defaultMessage="Transform submitted data to list of values"
        />
      }
      tooltip={tooltip}
    />
  );
};

export default TransformData;
