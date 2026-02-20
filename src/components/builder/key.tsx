import {FormikContextType, useFormikContext} from 'formik';
import {ExtendedComponentSchema} from 'formiojs/types/components/schema';
import {camelCase, debounce} from 'lodash';
import {useContext, useEffect, useRef} from 'react';
import {FormattedMessage} from 'react-intl';

import {BuilderContext} from '@/context';

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

export interface KeyProps {
  isManuallySetRef: React.MutableRefObject<boolean>;
  generatedValue: string;
}

export const useDeriveComponentKey = (): [KeyProps['isManuallySetRef'], string] => {
  const {
    values,
    status = {},
    setFieldValue,
  }: KeyFormikContextType<ExtendedComponentSchema> = useFormikContext<ExtendedComponentSchema>();
  const isManuallySetRef = useRef(false);
  const debouncedSetFieldValue = debounce(setFieldValue, 50);

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

  return [isManuallySetRef, generatedKey];
};

const Key: React.FC<KeyProps> = ({isManuallySetRef, generatedValue}) => {
  const {setFieldValue, getFieldProps}: KeyFormikContextType<ExtendedComponentSchema> =
    useFormikContext<ExtendedComponentSchema>();
  const {formMode} = useContext(BuilderContext);

  const name = 'key';
  const fieldProps = getFieldProps(name);

  const onChange = (event: React.ChangeEvent<any>) => {
    const {value} = event.target;
    if (!value) {
      setFieldValue('key', generatedValue);
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
      readOnly={formMode === 'appointment'}
    />
  );
};

export default Key;
