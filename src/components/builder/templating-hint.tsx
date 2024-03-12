import {FormattedMessage} from 'react-intl';

const DOCUMENTATION_LINK =
  'https://open-forms.readthedocs.io/en/stable/manual/templates.html#hoe-het-werkt';

const TemplatingHint: React.FC = () => (
  <FormattedMessage
    description="Description pointing to template documentation/capabilities"
    defaultMessage="This field supports templating. See the <link>manual</link> for documentation and examples."
    values={{
      link: chunks => <a href={DOCUMENTATION_LINK}>{chunks}</a>,
    }}
  />
);

export default TemplatingHint;
