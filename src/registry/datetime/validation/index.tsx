import {DateComponentSchema} from '@open-formulieren/types';
import {useFormikContext} from 'formik';
import {useContext} from 'react';
import {MessageDescriptor, defineMessages, useIntl} from 'react-intl';

import {Panel} from '@/components/formio';
import {BuilderContext} from '@/context';
import {ErrorList, useValidationErrors} from '@/utils/errors';

import ModeSelect from './constraint-mode';
import FixedValueDateTimeField from './fixed-value-datetimefield';
import RelativeDelta from './relative-delta';
import {DateConstraintKey} from './types';

const PANEL_TITLES: Record<DateConstraintKey, MessageDescriptor> = defineMessages({
  minDate: {
    description: "Date field 'minDate' validation panel title",
    defaultMessage: 'Minimum date {configured, select, false {(not set)} other {}}',
  },
  maxDate: {
    description: "Date field 'maxDate' validation panel title",
    defaultMessage: 'Maximum date {configured, select, false {(not set)} other {}}',
  },
});

export interface DateConstraintProps {
  constraint: DateConstraintKey;
}

const DateTimeConstraintValidation: React.FC<DateConstraintProps> = ({constraint}) => {
  const intl = useIntl();
  const {values} = useFormikContext<DateComponentSchema>();
  const {formMode} = useContext(BuilderContext);
  const mode = values?.openForms?.[constraint]?.mode || '';
  const {errors, hasErrors} = useValidationErrors(`openForms.${constraint}`);

  return formMode === 'appointment' ? null : (
    <Panel
      title={intl.formatMessage(PANEL_TITLES[constraint], {configured: String(mode !== '')})}
      collapsible
      initialCollapsed
    >
      <ModeSelect constraint={constraint} />
      {mode === 'fixedValue' && <FixedValueDateTimeField constraint={constraint} />}
      {mode === 'relativeToVariable' && <RelativeDelta constraint={constraint} />}
      {hasErrors && (
        <div className="formio-component has-error">
          <ErrorList errors={errors} />
        </div>
      )}
    </Panel>
  );
};

export default DateTimeConstraintValidation;
