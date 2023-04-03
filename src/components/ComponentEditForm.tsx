import {Formik} from 'formik';

import {JSONType} from '@types';

import ComponentPreview from './ComponentPreview';

interface BuilderInfo {
  title: string;
  group: string;
  icon: string;
  documentation?: string;
  schema: string;
  weight: number;
}

interface ComponentEditFormProps {
  isNew: boolean;
  component: JSONType;
  builderInfo: BuilderInfo;
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onRemove: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const ComponentEditForm: React.FC<ComponentEditFormProps> = ({
  isNew,
  component,
  builderInfo,
  onCancel,
  onRemove,
}) => {
  return null;
};

export default ComponentEditForm;
