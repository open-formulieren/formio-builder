import {ComponentPreviewProps} from '@/components/ComponentPreview';
import {TextField} from '@/components/formio';

/**
 * Show a formio email component preview.
 *
 * NOTE: for the time being, this is rendered in the default Formio bootstrap style,
 * however at some point this should use the components of
 * @open-formulieren/formio-renderer instead for a more accurate preview.
 */
const Preview: React.FC<ComponentPreviewProps> = ({component}) => {
  const {key, label, description, validate = {}, autocomplete, multiple} = component;
  const {required = false} = validate;
  const name = key || 'OF_MISSING_KEY';
  return (
    <TextField
      name={name}
      multiple={!!multiple}
      label={label}
      description={description}
      required={required}
      autoComplete={(autocomplete as string) || ''}
      type="email"
    />
  );
};

export default Preview;
