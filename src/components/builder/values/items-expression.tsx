import {JSONObject} from '@open-formulieren/types/lib/types';
import {useFormikContext} from 'formik';
import {FormattedMessage} from 'react-intl';

import JSONEdit from '@/components/JSONEdit';
import {Component, Description} from '@/components/formio';

const NAME = 'openForms.itemsExpression';

/**
 * The `ItemsExpression` component is used to specify the JsonLogic expression to
 * calculate the values/options for a component.
 *
 * @todo: this would really benefit from a nice, context-aware JsonLogic editor.
 */
export const ItemsExpression: React.FC = () => {
  const {getFieldProps} = useFormikContext();
  const {value = ''} = getFieldProps<JSONObject | string | undefined>(NAME);

  const htmlId = `editform-${NAME}`;
  return (
    <Component
      type="textarea"
      field={NAME}
      required
      htmlId={htmlId}
      label={
        <FormattedMessage
          description="Label for 'openForms.itemsExpression' builder field"
          defaultMessage="Items expression"
        />
      }
    >
      <div>
        <JSONEdit name={NAME} data={value} rows={3} id={htmlId} />
      </div>

      <Description
        text={
          <FormattedMessage
            description="Description for the 'openForms.itemsExpression' builder field"
            defaultMessage={`A JSON logic expression returning a variable (of array type)
            whose items should be used as the options for this component.`}
          />
        }
      />
    </Component>
  );
};

export default ItemsExpression;
