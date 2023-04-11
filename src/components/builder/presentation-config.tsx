import {FormattedMessage, useIntl} from 'react-intl';

import {Checkbox, Panel} from '../formio';

const ShowInSummary: React.FC<{}> = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'showInSummary' builder field",
    defaultMessage: 'Whether to show this value in the submission summary',
  });
  return (
    <Checkbox
      name="showInSummary"
      label={
        <FormattedMessage
          description="Label for 'showInSummary' builder field"
          defaultMessage="Show in summary"
        />
      }
      tooltip={tooltip}
    />
  );
};

const ShowInEmail: React.FC<{}> = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'showInEmail' builder field",
    defaultMessage: 'Whether to show this value in the confirmation email',
  });
  return (
    <Checkbox
      name="showInEmail"
      label={
        <FormattedMessage
          description="Label for 'showInEmail' builder field"
          defaultMessage="Show in email"
        />
      }
      tooltip={tooltip}
    />
  );
};

const ShowInPDF: React.FC<{}> = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'showInPDF' builder field",
    defaultMessage: 'Whether to show this value in the confirmation PDF',
  });
  return (
    <Checkbox
      name="showInPDF"
      label={
        <FormattedMessage
          description="Label for 'showInPDF' builder field"
          defaultMessage="Show in PDF"
        />
      }
      tooltip={tooltip}
    />
  );
};

export interface PresentationConfigProps {
  exposeShowInSummary?: boolean;
  exposeShowInEmail?: boolean;
  exposeShowInPDF?: boolean;
}

const PresentationConfig: React.FC<PresentationConfigProps> = ({
  exposeShowInSummary = true,
  exposeShowInEmail = true,
  exposeShowInPDF = true,
}) => (
  <Panel
    title={
      <FormattedMessage
        description="Presentation configuration panel title"
        defaultMessage="Display in summaries and confirmations"
      />
    }
  >
    {exposeShowInSummary && <ShowInSummary />}
    {exposeShowInEmail && <ShowInEmail />}
    {exposeShowInPDF && <ShowInPDF />}
  </Panel>
);

export default PresentationConfig;
