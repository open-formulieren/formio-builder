import {FormattedMessage, useIntl} from 'react-intl';

import {Select, TextField} from '@/components/formio';

import {DateConstraintKey} from './types';

export interface OperatorSelectProps {
  name: `openForms.${DateConstraintKey}.operator`;
}

const OperatorSelect: React.FC<OperatorSelectProps> = ({name}) => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'operator' in relative delta date constraint validation",
    defaultMessage: 'Specify whether to add or subtract a time delta to/from the variable.',
  });
  return (
    <Select
      name={name}
      label={
        <FormattedMessage
          description="Label for 'operator' in relative delta date constraint validation"
          defaultMessage="Add/subtract duration"
        />
      }
      tooltip={tooltip}
      options={[
        {
          value: 'add',
          label: intl.formatMessage({
            description: "Operator 'add' option label",
            defaultMessage: 'Add',
          }),
        },
        {
          value: 'subtract',
          label: intl.formatMessage({
            description: "Operator 'subtract' option label",
            defaultMessage: 'Subtract',
          }),
        },
      ]}
    />
  );
};

export interface VariableProps {
  name: `openForms.${DateConstraintKey}.variable`;
}

// XXX: at some point we should provide all available variables in the context so that
// you can select the variable from a dropdown rather than having to type the key
// yourself.
const Variable: React.FC<VariableProps> = ({name}) => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'variable' in relative delta date constraint validation",
    defaultMessage: 'Provide the key of a static, component, or user defined variable.',
  });
  return (
    <TextField
      name={name}
      label={
        <FormattedMessage
          description="Label for 'variable' in relative delta date constraint validation"
          defaultMessage="Variable"
        />
      }
      tooltip={tooltip}
      spellCheck={false}
    />
  );
};

export interface RelativeDeltaProps {
  constraint: DateConstraintKey;
}

const RelativeDelta: React.FC<RelativeDeltaProps> = ({constraint}) => {
  return (
    <div className="row">
      <div className="col-md-6 col-xs-12">
        <OperatorSelect name={`openForms.${constraint}.operator`} />
      </div>
      <div className="col-md-6 col-xs-12">
        <Variable name={`openForms.${constraint}.variable`} />
      </div>
    </div>
  );
};

export default RelativeDelta;
