import clsx from 'clsx';
import React, {useRef, useState} from 'react';

interface JSONEditorProps {
  value: unknown;
  onChange: (value: any) => void;
  wrapperProps?: any;
  height?: any;
}

export const JSONEditor = ({value, onChange, wrapperProps = {}, height = ''}: JSONEditorProps) => {
  const dataAsJSON = JSON.stringify(value, null, 2);
  const [data, setData] = useState(dataAsJSON);
  const [JSONValid, setJSONValid] = useState(true);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  // synchronize external state changes
  const isFocused = inputRef.current == document.activeElement;
  if (data != dataAsJSON && !isFocused) {
    setData(dataAsJSON);
  }

  const editorOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const rawValue = event.target.value;
    setData(rawValue);

    let updatedData;
    try {
      updatedData = JSON.parse(rawValue);
      setJSONValid(true);
    } catch {
      setJSONValid(false);
      return;
    }

    onChange(updatedData);
  };

  // pop the extra className if provided, to avoid overwriting the ones
  // we hardcode:
  const {className = undefined, ...otherProps} = wrapperProps;

  return (
    <>
      <textarea
        ref={inputRef}
        value={data}
        className={clsx(className, 'form-control', {'is-invalid': !JSONValid})}
        data-testid="jsonEdit"
        onChange={editorOnChange}
        spellCheck={false}
        style={{height}}
        {...otherProps}
      />
    </>
  );
};
