import {SignatureComponentSchema} from '@open-formulieren/types';
import {SignatureValue} from '@open-formulieren/types/dist/components/signature';
import {useFormikContext} from 'formik';
import {debounce} from 'lodash';
import {useLayoutEffect, useRef} from 'react';
import SignatureCanvas from 'react-signature-canvas';

import {Component, Description} from '@/components/formio';

import {ComponentPreviewProps} from '../types';

const BG_COLOR = 'rgb(245,245,235)';

/**
 * Show a formio signature component preview.
 *
 * NOTE: for the time being, this is rendered in the default Formio bootstrap style,
 * however at some point this should use the components of
 * @open-formulieren/formio-renderer instead for a more accurate preview.
 */
const Preview: React.FC<ComponentPreviewProps<SignatureComponentSchema>> = ({component}) => {
  const {getFieldProps, getFieldHelpers} = useFormikContext();
  const {key, label, description, tooltip, validate = {}, footer = ''} = component;
  const {setValue} = getFieldHelpers<SignatureValue | ''>(key);
  const {required = false} = validate;
  const containerRef = useRef<HTMLDivElement>(null);
  const padRef = useRef<SignatureCanvas>(null);
  const {value: currentValue} = getFieldProps(key);

  useLayoutEffect(() => {
    const resizeHandler = () => {
      const containerDiv = containerRef.current;
      const instance = padRef.current;
      if (!containerDiv || !instance) return;
      const value = instance.toDataURL();
      const containerWidth = containerDiv.offsetWidth;
      const canvas = instance.getCanvas();
      canvas.width = containerWidth;
      // changing dimensions requires redrawing, which is done through the clear() method
      instance.clear();
      if (value) {
        instance.fromDataURL(value, {
          ratio: 1,
          width: canvas.width,
          height: canvas.height,
        });
      }
    };
    const onResize = debounce(resizeHandler, 100);
    window.addEventListener('resize', onResize);
    resizeHandler();

    // if there's a current value from form state, set it
    if (currentValue && padRef.current) {
      const canvas = padRef.current.getCanvas();
      padRef.current.fromDataURL(currentValue, {
        ratio: 1,
        width: canvas.width,
        height: canvas.height,
      });
    }

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const onEnd = () => {
    const instance = padRef.current;
    if (instance === null) return;
    const dataUrl = instance.toDataURL() as SignatureValue;
    setValue(dataUrl);
  };

  const onClear = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const instance = padRef.current;
    if (instance === null) return;
    instance.clear();
    setValue('');
  };

  return (
    <Component
      type={component.type}
      field={key}
      required={required}
      htmlId={`editform-${key}`}
      label={label}
      tooltip={tooltip}
    >
      <div ref={containerRef} className="signature-pad-body">
        <a className="btn btn-sm btn-light signature-pad-refresh" onClick={onClear}>
          <i className="fa fa-refresh" aria-label="Clear" />
        </a>
        <SignatureCanvas
          ref={padRef}
          onEnd={onEnd}
          minWidth={0.5}
          maxWidth={2.5}
          penColor="black"
          backgroundColor={BG_COLOR}
          clearOnResize={false}
        />
        <div className="signature-pad-footer">{footer}</div>
      </div>

      {description && <Description text={description} />}
    </Component>
  );
};

export default Preview;
