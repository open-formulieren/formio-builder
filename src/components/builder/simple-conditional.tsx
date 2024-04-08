import {FormattedMessage} from 'react-intl';

import {Panel, Select} from '../formio';
import ComparisonValueInput from './comparison-value-input';
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
      isClearable
    />
    <ComponentSelect
      name="conditional.when"
      label={
        <FormattedMessage
          description="Component property 'conditional.when' label"
          defaultMessage="When the form component"
        />
      }
      isClearable
    />
    <ComparisonValueInput />
  </Panel>
);

export default SimpleConditional;
