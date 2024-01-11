import {Form, Formik} from 'formik';
import {ExtendedComponentSchema} from 'formiojs/types/components/schema';
import cloneDeep from 'lodash.clonedeep';
import merge from 'lodash.merge';
import {PropsWithChildren, useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {toFormikValidationSchema} from 'zod-formik-adapter';

import {BuilderContext} from '@/context';
import {Fallback, getRegistryEntry, isKnownComponentType} from '@/registry';
import {AnyComponentSchema, FallbackSchema} from '@/types';

import GenericComponentPreview from './ComponentPreview';

export interface BuilderInfo {
  title: string;
  group: string;
  icon: string;
  documentation?: string;
  schema: ExtendedComponentSchema;
  weight: number;
}

export interface ComponentEditFormProps {
  isNew: boolean;
  // it is (currently) possible someone drags a component type into the canvas that we
  // don't know (yet), so we need to handle FallbackSchema.
  component: AnyComponentSchema | FallbackSchema;
  builderInfo: BuilderInfo;
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onRemove: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onSubmit: (component: AnyComponentSchema | FallbackSchema) => void;
}

type ButtonRowProps = Pick<ComponentEditFormProps, 'onCancel' | 'onRemove'> & {
  onSubmit: () => void;
};

const ButtonRow: React.FC<ButtonRowProps> = ({onSubmit, onCancel, onRemove}) => (
  <div style={{marginTop: '10px'}}>
    <button
      type="submit"
      className="btn btn-success"
      style={{marginRight: '10px'}}
      onClick={event => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <FormattedMessage description="Save component configuration button" defaultMessage="Save" />
    </button>
    <button className="btn btn-secondary" style={{marginRight: '10px'}} onClick={onCancel}>
      <FormattedMessage
        description="Cancel component configuration button"
        defaultMessage="Cancel"
      />
    </button>
    <button className="btn btn-danger" onClick={onRemove}>
      <FormattedMessage description="Remove component button" defaultMessage="Remove" />
    </button>
  </div>
);

const ComponentEditForm: React.FC<ComponentEditFormProps> = ({
  isNew,
  component,
  builderInfo,
  onCancel,
  onRemove,
  onSubmit,
}) => {
  const intl = useIntl();
  const builderContext = useContext(BuilderContext);

  const registryEntry = getRegistryEntry(component);
  const {edit: EditForm, editSchema: zodSchema} = registryEntry;
  const hasPreview = registryEntry.preview !== null;

  let initialValues = cloneDeep(component);
  if (isNew && isKnownComponentType(component)) {
    // Formio.js mutates components when adding children (like fieldset layout component),
    // which apparently goes all the way to our default value definition, which is
    // supposed to be static.
    // See https://github.com/open-formulieren/open-forms/issues/3761 for the problems
    // it causes.
    const defaultValues = cloneDeep(EditForm.defaultValues);
    initialValues = merge(defaultValues, initialValues);
  }

  // we infer the specific schema from the EditForm component obtained from the registry.
  // This gives a specific schema rather than AnyComponentSchema and allows us to type
  // check the values accordingly.
  type ComponentSchema = React.ComponentProps<typeof EditForm>['component'];

  const Wrapper = hasPreview ? LayoutWithPreview : LayoutWithoutPreview;

  // Markup (mostly) taken from formio's default templates - there's room for improvement here
  // to de-bootstrapify it.
  return (
    <Formik<ComponentSchema>
      validateOnChange={false}
      validateOnBlur
      initialValues={initialValues}
      initialStatus={{isNew}}
      onSubmit={(values, {setSubmitting}) => {
        onSubmit(values);
        setSubmitting(false);
      }}
      validationSchema={toFormikValidationSchema(zodSchema({intl, builderContext}))}
    >
      {formik => {
        const component = formik.values;
        return (
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
              <Wrapper
                onSubmit={formik.submitForm}
                onCancel={onCancel}
                onRemove={onRemove}
                component={component}
              >
                <Form data-testid="componentEditForm">
                  <div className="formio-component formio-component-label-hidden">
                    <div className="formio-form">
                      <div className="formio-component-tabs">
                        {isKnownComponentType(component) ? (
                          <EditForm component={component} />
                        ) : (
                          <Fallback.edit component={component} />
                        )}
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
              </Wrapper>
            </div>
          </>
        );
      }}
    </Formik>
  );
};

type EditFormLayoutProps = PropsWithChildren<
  Pick<ComponentEditFormProps, 'onCancel' | 'onRemove'> & {
    onSubmit: () => void;
    component: AnyComponentSchema | FallbackSchema;
  }
>;

const LayoutWithPreview: React.FC<EditFormLayoutProps> = ({
  children,
  onSubmit,
  onCancel,
  onRemove,
  component,
}) => (
  <>
    <div className="col col-sm-6">{children}</div>
    <div className="col col-sm-6">
      <GenericComponentPreview component={component} />
      <ButtonRow onSubmit={onSubmit} onCancel={onCancel} onRemove={onRemove} />
    </div>
  </>
);

const LayoutWithoutPreview: React.FC<EditFormLayoutProps> = ({
  children,
  onSubmit,
  onCancel,
  onRemove,
}) => (
  <>
    <div className="col col-sm-12">
      {children}
      <ButtonRow onSubmit={onSubmit} onCancel={onCancel} onRemove={onRemove} />
    </div>
  </>
);

export default ComponentEditForm;
