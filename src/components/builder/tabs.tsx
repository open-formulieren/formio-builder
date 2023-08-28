import {FormattedMessage} from 'react-intl';

import {Tab} from '@/components/formio';

export interface TabProps {
  hasErrors: boolean;
}

export const Basic: React.FC<TabProps> = props => (
  <Tab {...props}>
    <FormattedMessage
      description="Component edit form tab title for 'Basic' tab"
      defaultMessage="Basic"
    />
  </Tab>
);

export const Advanced: React.FC<TabProps> = props => (
  <Tab {...props}>
    <FormattedMessage
      description="Component edit form tab title for 'Advanced' tab"
      defaultMessage="Advanced"
    />
  </Tab>
);
export const Validation: React.FC<TabProps> = props => (
  <Tab {...props}>
    <FormattedMessage
      description="Component edit form tab title for 'Validation' tab"
      defaultMessage="Validation"
    />
  </Tab>
);
export const Registration: React.FC<TabProps> = props => (
  <Tab {...props}>
    <FormattedMessage
      description="Component edit form tab title for 'Registration' tab"
      defaultMessage="Registration"
    />
  </Tab>
);
export const Prefill: React.FC<TabProps> = props => (
  <Tab {...props}>
    <FormattedMessage
      description="Component edit form tab title for 'Prefill' tab"
      defaultMessage="Prefill"
    />
  </Tab>
);
export const Translations: React.FC<TabProps> = props => (
  <Tab {...props}>
    <FormattedMessage
      description="Component edit form tab title for 'Translations' tab"
      defaultMessage="Translations"
    />
  </Tab>
);
