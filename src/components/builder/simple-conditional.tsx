import {FormattedMessage} from 'react-intl';

import {Panel, Select, TextField} from '../formio';
import ComponentSelect from './component-select';

const SimpleConditional: React.FC = () => (
  <Panel
    title={
      <FormattedMessage
        description="Simple conditional panel title"
        defaultMessage="Simple conditional"
      />
    }
  >
    <Select
      name="conditional.show"
      label={
        <FormattedMessage
          description="Component property 'conditional.show' label"
          defaultMessage="This component should display"
        />
      }
      options={[
        {value: true, label: 'True'},
        {value: false, label: 'False'},
      ]}
    />
    <ComponentSelect
      name="conditional.when"
      label={
        <FormattedMessage
          description="Component property 'conditional.when' label"
          defaultMessage="When the form component"
        />
      }
    />
    <TextField
      name="conditional.eq"
      label={
        <FormattedMessage
          description="Component property 'conditional.eq' label"
          defaultMessage="Has the value"
        />
      }
    />
  </Panel>
);

export default SimpleConditional;
