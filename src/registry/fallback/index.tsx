import {ComponentSchema} from 'formiojs';
import {z} from 'zod';

import JSONPreview from '@/components/JSONPreview';
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

const Fallback = {
  edit: EditForm,
  editSchema: () => z.object({}),
  preview: Preview,
  defaultValue: undefined,
} satisfies RegistryEntry<FallbackSchema>;

export default Fallback;
