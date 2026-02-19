import {FormattedMessage, defineMessage, useIntl} from 'react-intl';

import Select from '@/components/formio/select';

const IDENTIFIER_ROLE_OPTIONS = [
  {
    label: defineMessage({
      description: 'Label identifier role main',
      defaultMessage: 'Main',
    }),
    value: 'main',
  },
  {
    label: defineMessage({
      description: 'Label identifier role authorised person',
      defaultMessage: 'Authorised person',
    }),
    value: 'authorised_person',
  },
];

const PrefillIdentifierRoleSelect: React.FC = () => {
  const intl = useIntl();

  const tooltip = intl.formatMessage({
    description: "Tooltip for 'prefill.identifierRole' builder field",
    defaultMessage:
      'In case that multiple identifiers are returned (in the case of eHerkenning bewindvoering and DigiD Machtigen), should the prefill data related to the main identifier be used, or that related to the authorised person?',
  });

  return (
    <Select
      name="prefill.identifierRole"
      label={
        <FormattedMessage
          description="Label for 'prefill.identifierRole' builder field"
          defaultMessage="Identifier role"
        />
      }
      tooltip={tooltip}
      options={IDENTIFIER_ROLE_OPTIONS.map(item => ({
        ...item,
        label: intl.formatMessage(item.label),
      }))}
    />
  );
};

export default PrefillIdentifierRoleSelect;
