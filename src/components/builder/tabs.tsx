import {FormattedMessage} from 'react-intl';
import type {ReactTabsFunctionComponent, TabProps} from 'react-tabs';

import {Tab} from '@/components/formio';

type TabWithContent = ReactTabsFunctionComponent<TabProps & {hasErrors: boolean}>;

const Basic: TabWithContent = props => (
  <Tab {...props}>
    <FormattedMessage
      description="Component edit form tab title for 'Basic' tab"
      defaultMessage="Basic"
    />
  </Tab>
);
Basic.tabsRole = 'Tab';

const Advanced: TabWithContent = props => (
  <Tab {...props}>
    <FormattedMessage
      description="Component edit form tab title for 'Advanced' tab"
      defaultMessage="Advanced"
    />
  </Tab>
);
Advanced.tabsRole = 'Tab';

const Validation: TabWithContent = props => (
  <Tab {...props}>
    <FormattedMessage
      description="Component edit form tab title for 'Validation' tab"
      defaultMessage="Validation"
    />
  </Tab>
);
Validation.tabsRole = 'Tab';

const Registration: TabWithContent = props => (
  <Tab {...props}>
    <FormattedMessage
      description="Component edit form tab title for 'Registration' tab"
      defaultMessage="Registration"
    />
  </Tab>
);
Registration.tabsRole = 'Tab';

const Prefill: TabWithContent = props => (
  <Tab {...props}>
    <FormattedMessage
      description="Component edit form tab title for 'Prefill' tab"
      defaultMessage="Prefill"
    />
  </Tab>
);
Prefill.tabsRole = 'Tab';

const Translations: TabWithContent = props => (
  <Tab {...props}>
    <FormattedMessage
      description="Component edit form tab title for 'Translations' tab"
      defaultMessage="Translations"
    />
  </Tab>
);
Translations.tabsRole = 'Tab';

export {Basic, Advanced, Validation, Registration, Prefill, Translations};
