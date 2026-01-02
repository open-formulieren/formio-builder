import {JSONEditor} from '@open-formulieren/monaco-json-editor';
import {JsonLogicExpression} from '@open-formulieren/types/dist/options';
import {useFormikContext} from 'formik';
import {useContext} from 'react';
import {FormattedMessage} from 'react-intl';

import {Component, Description} from '@/components/formio';
import {BuilderContext} from '@/context';

const NAME = 'openForms.itemsExpression';

/**
 * The `ItemsExpression` component is used to specify the JsonLogic expression to
 * calculate the values/options for a component.
 *
 * @todo: this would really benefit from a nice, context-aware JsonLogic editor.
 */
export const ItemsExpression: React.FC = () => {
  const {getFieldProps, setFieldValue} = useFormikContext();
  const {value = {var: 'var'}} = getFieldProps<JsonLogicExpression | undefined>(NAME);
  const builderContext = useContext(BuilderContext);

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
        <JSONEditor
          wrapperProps={{className: 'json-editor json-editor--compact'}}
          value={value}
          onChange={value => setFieldValue(NAME, value)}
          showLines={false}
          theme={builderContext.theme}
        />
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
