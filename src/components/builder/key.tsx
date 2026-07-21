import type {AnyComponentSchema} from '@open-formulieren/types';
import type {FormikContextType} from 'formik';
import {useFormikContext} from 'formik';
import {camelCase, debounce} from 'lodash';
import {useContext, useEffect, useRef} from 'react';
import {FormattedMessage} from 'react-intl';

import {BuilderContext} from '@/context';
import {hasOwnProperty} from '@/types';

import {TextField} from '../formio';

const getKeySeed = (component: AnyComponentSchema): string => {
  for (const key of ['title', 'label', 'placeholder']) {
    if (hasOwnProperty(component, key) && !!component[key]) {
      return component[key] as string;
    }
  }
  return component.type;
};

const useGenerateUniqueKey = (component: AnyComponentSchema): string => {
  const {uniquifyKey} = useContext(BuilderContext);
  const seed = getKeySeed(component);
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
  }: KeyFormikContextType<AnyComponentSchema> = useFormikContext<AnyComponentSchema>();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setFieldValue, isNew, isManuallySetRef, generatedKey, currentKey]);

  return [isManuallySetRef, generatedKey];
};

const Key: React.FC<KeyProps> = ({isManuallySetRef, generatedValue}) => {
  const {setFieldValue, getFieldProps}: KeyFormikContextType<AnyComponentSchema> =
    useFormikContext<AnyComponentSchema>();
  const {formType} = useContext(BuilderContext);

  const name = 'key';
  const fieldProps = getFieldProps(name);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      readOnly={formType === 'appointment'}
    />
  );
};

export default Key;
