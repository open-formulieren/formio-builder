import {JSONObject} from '@open-formulieren/types/lib/types';
import clsx from 'clsx';
import {useFormikContext} from 'formik';
import {TextareaHTMLAttributes, useRef, useState} from 'react';

interface JSONEditProps {
  data: unknown; // JSON.stringify first argument has the 'any' type in TS itself...
  className?: string;
  name?: string;
}

const JSONEdit: React.FC<JSONEditProps & TextareaHTMLAttributes<HTMLTextAreaElement>> = ({
  data,
  className = 'form-control',
  name = '',
  ...props
}) => {
  const dataAsJSON = JSON.stringify(data, null, 2);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [value, setValue] = useState(dataAsJSON);
  const [JSONValid, setJSONValid] = useState(true);
  const {setValues, setFieldValue} = useFormikContext();

  // if no name is provided, replace the entire form state, otherwise only set a
  // specific value
  const updateValue = name ? (v: JSONObject) => setFieldValue(name, v) : setValues;

  // synchronize external state changes
  const isFocused = inputRef.current == document.activeElement;
  if (value != dataAsJSON && !isFocused) {
    setValue(dataAsJSON);
  }

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const rawValue = event.target.value;
    setValue(rawValue);

    let updatedData: any;
    try {
      updatedData = JSON.parse(rawValue);
      setJSONValid(true);
    } catch {
      setJSONValid(false);
      return;
    }

    updateValue(updatedData);
  };
  return (
    <>
      <textarea
        ref={inputRef}
        value={value}
        className={clsx(className, {'is-invalid': !JSONValid})}
        data-testid="jsonEdit"
        onChange={onChange}
        spellCheck={false}
        {...props}
      />
      {!JSONValid && <div className="invalid-feedback">Could not parse the JSON.</div>}
    </>
  );
};

export default JSONEdit;
