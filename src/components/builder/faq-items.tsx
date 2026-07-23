import type {FAQItem} from '@open-formulieren/types';
import {FieldArray, useFormikContext} from 'formik';
import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {MinimalEditor} from '@/components/CKEditor';
import {Panel, Tab, TabList, TabPanel, Tabs, TextField} from '@/components/formio';
import {BuilderContext} from '@/context';

import RichText from './rich-text';

const FAQItems = () => {
  const intl = useIntl();
  const fieldName = 'faqItems';
  const {getFieldProps, setFieldValue} = useFormikContext();
  const {value: faqItems = []} = getFieldProps<FAQItem[] | undefined>(fieldName);
  const {supportedLanguageCodes} = useContext(BuilderContext);
  const defaultValues = supportedLanguageCodes.reduce(
    (_, currentValue) => ({[currentValue]: {label: '', content: ''}}),
    {}
  );

  const panelTooltip = intl.formatMessage({
    description: 'FAQ items tooltip in the form builder',
    defaultMessage: 'FAQ items for this component',
  });

  const defaultLanguageCode = supportedLanguageCodes[0] ?? 'nl';

  return (
    <Panel
      title={
        <FormattedMessage description="Title of the FAQ items heading" defaultMessage="FAQ items" />
      }
      tooltip={panelTooltip}
      collapsible
      initialCollapsed
    >
      <FieldArray name="faqItems">
        {arrayHelpers => (
          <>
            {faqItems.map((_, index) => (
              <div style={{padding: '1em 0'}}>
                <Tabs>
                  <TabList>
                    {supportedLanguageCodes.map(code => (
                      <Tab key={code}>{code.toUpperCase()}</Tab>
                    ))}
                  </TabList>

                  {supportedLanguageCodes.map(code => (
                    <TabPanel key={code} style={{minBlockSize: 'unset'}}>
                      <TextField
                        name={`${arrayHelpers.name}[${index}].openForms.translations.${code}.label`}
                        label={
                          <FormattedMessage
                            description="Label for translation message for FAQ label"
                            defaultMessage="Label"
                          />
                        }
                        onChange={event => {
                          const {value: changedValue} = event.target;

                          if (code === defaultLanguageCode) {
                            setFieldValue(`${arrayHelpers.name}[${index}].label`, changedValue);
                          }
                        }}
                      />

                      <div className="form-group">
                        <label className="col-form-label">
                          <FormattedMessage
                            description="Label for translation message for FAQ content"
                            defaultMessage="Content"
                          />
                        </label>

                        <RichText
                          name={`${arrayHelpers.name}[${index}].openForms.translations.${code}.content`}
                          supportsBackendTemplating={false}
                          editor={MinimalEditor}
                          onChange={changedValue => {
                            if (code === defaultLanguageCode) {
                              setFieldValue(`${arrayHelpers.name}[${index}].content`, changedValue);
                            }
                          }}
                        />
                      </div>

                      <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={() => arrayHelpers.remove(index)}
                      >
                        <i className="fa fa-times-circle-o" aria-hidden="true" />{' '}
                        <FormattedMessage
                          description="'Remove item' screenreader button text"
                          defaultMessage="Remove FAQ item"
                        />
                      </button>
                    </TabPanel>
                  ))}
                </Tabs>
              </div>
            ))}

            <button
              type="button"
              className="btn btn-primary formio-button-add-another"
              onClick={() => {
                arrayHelpers.push({
                  label: '',
                  content: '',
                  openForms: {translations: defaultValues},
                });
              }}
            >
              <i className="fa fa-plus" aria-hidden="true" />{' '}
              <FormattedMessage
                description="'Add another' button text for 'multiple' components"
                defaultMessage="Add another"
              />
            </button>
          </>
        )}
      </FieldArray>
    </Panel>
  );
};

export default FAQItems;
