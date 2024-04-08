import {ComponentSchema} from 'formiojs';
import {FormattedMessage} from 'react-intl';
import {z} from 'zod';

import JSONPreview from '@/components/JSONPreview';
import {TextField} from '@/components/formio/textfield';
import {FallbackSchema} from '@/types';

import {EditFormDefinition, RegistryEntry} from '../types';

const EditForm: EditFormDefinition<FallbackSchema> = ({component: {type = 'unknown'}}) => (
  <div>Unknown component type: {type}</div>
);
EditForm.defaultValues = {};

export interface ComponentPreviewProps {
  component: ComponentSchema;
}

const Preview: React.FC<ComponentPreviewProps> = ({component}) => <JSONPreview data={component} />;

const DefaultInputComponent = () => {
  return (
    <TextField
      name="conditional.eq"
      label={
        <FormattedMessage
          description="Component property 'conditional.eq' label"
          defaultMessage="Has the value"
        />
      }
    />
  );
};

const Fallback = {
  edit: EditForm,
  editSchema: () => z.object({}),
  preview: Preview,
  defaultValue: undefined,
  comparisonValueComponent: DefaultInputComponent,
} satisfies RegistryEntry<FallbackSchema>;

export default Fallback;
