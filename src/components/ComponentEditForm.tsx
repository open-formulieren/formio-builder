import {Form, Formik} from 'formik';
import {ExtendedComponentSchema} from 'formiojs/types/components/schema';
import cloneDeep from 'lodash.clonedeep';
import set from 'lodash.set';
import {FormattedMessage, useIntl} from 'react-intl';
import {object} from 'zod';
import {toFormikValidationSchema} from 'zod-formik-adapter';

import REGISTRY, {Fallback} from '@/registry';
import {ExtendedEditFormComponentSchema} from '@/types';

import ComponentPreview from './ComponentPreview';

export interface BuilderInfo {
  title: string;
  group: string;
  icon: string;
  documentation?: string;
  schema: ExtendedComponentSchema;
  weight: number;
}

type ObjecEntry<T, K extends keyof T = keyof T> = [K, T[K]];

export interface ComponentEditFormProps {
  isNew: boolean;
  component: ExtendedEditFormComponentSchema;
  builderInfo: BuilderInfo;
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onRemove: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onSubmit: (component: ExtendedEditFormComponentSchema) => void;
}

const ComponentEditForm: React.FC<ComponentEditFormProps> = ({
  isNew,
  component,
  builderInfo,
  onCancel,
  onRemove,
  onSubmit,
}) => {
  const intl = useIntl();

  const componentType = component.type || 'OF_MISSING_TYPE';
  const registryEntry = REGISTRY?.[componentType] || {edit: Fallback, editSchema: object({})};
  const {edit: EditForm, editSchema: zodSchema} = registryEntry;

  // FIXME: recipes may have non-default values that would be overwritten here with default
  // values - we need a deep merge & some logic to detect this.
  const initialValues = cloneDeep(component);
  if (isNew) {
    Object.entries(EditForm.defaultValues).forEach(
      ([key, value]: ObjecEntry<ExtendedEditFormComponentSchema>) => {
        const val = component?.[key] || value;
        set(initialValues, key, val);
      }
    );
  }

  // Markup (mostly) taken from formio's default templates - there's room for improvement here
  // to de-bootstrapify it.
  return (
    <Formik
      validateOnChange={false}
      validateOnBlur
      initialValues={initialValues}
      initialStatus={{isNew}}
      onSubmit={(values, {setSubmitting}) => {
        onSubmit(values);
        setSubmitting(false);
      }}
      validationSchema={toFormikValidationSchema(zodSchema(intl))}
    >
      {formik => (
        <>
          <div className="row">
            <div className="col col-sm-6">
              <p className="lead">
                <FormattedMessage
                  description="Formio builder: component configuration form title"
                  defaultMessage="{componentType} component"
                  values={{componentType: builderInfo.title}}
                />
              </p>
            </div>

            <div className="col col-sm-6">
              <div style={{marginRight: '20px', marginTop: '10px'}} className="float-right">
                <a
                  target="_blank"
                  href="https://open-forms.readthedocs.io/en/stable/manual/forms/form_fields.html"
                  rel="nofollower noopener"
                >
                  <i className="fa fa-window-restore"></i>&nbsp;
                  <FormattedMessage description="Link to manual title" defaultMessage="Manual" />
                </a>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col col-sm-6">
              <Form>
                <div className="formio-component formio-component-label-hidden">
                  <div className="formio-form">
                    <div className="formio-component-tabs">
                      <EditForm component={formik.values} />
                    </div>
                  </div>
                </div>
                {/*
                  Required to be able to submit the form with Enter, as the actual submit buttons
                  are in a different column. Moving the form element to the common ancestor
                  breaks the ability to isolate the edit and preview forms from each other.
                 */}
                <button type="submit" style={{display: 'none'}} />
              </Form>
            </div>

            <div className="col col-sm-6">
              <ComponentPreview component={formik.values} />

              <div style={{marginTop: '10px'}}>
                <button
                  type="submit"
                  className="btn btn-success"
                  style={{marginRight: '10px'}}
                  onClick={event => {
                    event.preventDefault();
                    formik.submitForm();
                  }}
                >
                  <FormattedMessage
                    description="Save component configuration button"
                    defaultMessage="Save"
                  />
                </button>
                <button
                  className="btn btn-secondary"
                  style={{marginRight: '10px'}}
                  onClick={onCancel}
                >
                  <FormattedMessage
                    description="Cancel component configuration button"
                    defaultMessage="Cancel"
                  />
                </button>
                <button className="btn btn-danger" onClick={onRemove}>
                  <FormattedMessage description="Remove component button" defaultMessage="Remove" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </Formik>
  );
};

export default ComponentEditForm;
