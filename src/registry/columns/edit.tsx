import {ColumnsComponentSchema} from '@open-formulieren/types';
import {useFormikContext} from 'formik';
import {useContext, useRef} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {ClearOnHide, Hidden, Key} from '@/components/builder';
import {BuilderContext} from '@/context';

import {EditFormDefinition} from '../types';

/**
 * Form to configure a Formio 'columns' type component.
 */
const EditForm: EditFormDefinition<ColumnsComponentSchema> = () => {
  const {uniquifyKey} = useContext(BuilderContext);
  const isKeyManuallySetRef = useRef(false);
  const {values} = useFormikContext<ColumnsComponentSchema>();
  const generatedKey = uniquifyKey(values.key);
  return (
    <div className="card">
      <div className="card-body">
        <Key isManuallySetRef={isKeyManuallySetRef} generatedValue={generatedKey} />
        <Hidden />
        <ClearOnHide />
        <Columns />
      </div>
    </div>
  );
};

EditForm.defaultValues = {
  key: '',
  hidden: false,
  clearOnHide: true,
  columns: [
    {
      size: 6,
      sizeMobile: 4,
      components: [],
    },
    {
      size: 6,
      sizeMobile: 4,
      components: [],
    },
  ],
};

const Columns: React.FC = () => {
  return <>COLUMNS CONFIG</>;
};

export default EditForm;
