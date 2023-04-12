import {FormikContextType, useFormikContext} from 'formik';
import {ExtendedComponentSchema} from 'formiojs/types/components/schema';
import camelCase from 'lodash.camelcase';
import debounce from 'lodash.debounce';
import {useContext, useEffect, useRef} from 'react';
import {FormattedMessage} from 'react-intl';

import {BuilderContext} from 'context';

import {TextField} from '../formio';

const useGenerateUniqueKey = (component: ExtendedComponentSchema): string => {
  const {uniquifyKey} = useContext(BuilderContext);
  const seed = component.title || component.label || component.placeholder || component.type;
  return uniquifyKey(camelCase(seed));
};

interface BuilderFormStatus {
  isNew?: boolean;
}

interface KeyFormikContextType<T> extends FormikContextType<T> {
  status?: BuilderFormStatus | undefined;
}

const Key = () => {
  const {
    values,
    status = {},
    setFieldValue,
    getFieldProps,
  }: KeyFormikContextType<ExtendedComponentSchema> = useFormikContext<ExtendedComponentSchema>();
  const isManuallySetRef = useRef(false);

  const debouncedSetFieldValue = debounce(setFieldValue, 50);

  const name = 'key';
  const fieldProps = getFieldProps(name);

  const {isNew = false} = status;
  const currentKey = values.key;
  const generatedKey = useGenerateUniqueKey(values);

  useEffect(() => {
    if (!isNew || generatedKey === currentKey) return;
    if (!isManuallySetRef.current) {
      debouncedSetFieldValue.cancel();
      debouncedSetFieldValue('key', generatedKey);
    }
    return () => {
      debouncedSetFieldValue.cancel();
    };
  }, [setFieldValue, isNew, isManuallySetRef, generatedKey, currentKey]);

  const onChange = (event: React.ChangeEvent<any>) => {
    const {value} = event.target;
    if (!value) {
      setFieldValue('key', generatedKey);
      isManuallySetRef.current = false;
    } else {
      isManuallySetRef.current = true;
      fieldProps.onChange(event);
    }
  };

  return (
    <TextField
      name={name}
      label={
        <FormattedMessage
          description="Component property 'Property Name' label"
          defaultMessage="Property Name"
        />
      }
      onChange={onChange}
      required
    />
  );
};

export default Key;
