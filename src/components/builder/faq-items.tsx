import type {FAQItem} from '@open-formulieren/types/dist/common';
import {FieldArray, useFormikContext} from 'formik';
import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {BuilderContext} from '@/context';

import {Panel, Tab, TabList, TabPanel, Tabs, TextField} from '../formio';
import RichText from './rich-text';

const FAQItems = () => {
  const intl = useIntl();
  const {getFieldProps} = useFormikContext();
  const {value: faqItems = []} = getFieldProps<FAQItem[] | undefined>('faqItems');
  const {supportedLanguageCodes} = useContext(BuilderContext);
  const defaultValues = supportedLanguageCodes.reduce(
    (_, currentValue) => ({[currentValue]: {label: '', content: ''}}),
    {}
  );

  const panelTooltip = intl.formatMessage({
    description: 'FAQ items tooltip in the form builder',
    defaultMessage: 'FAQ items for this component',
  });

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
                    <TabPanel key={code}>
                      <TextField
                        name={`${arrayHelpers.name}[${index}].openforms.translations.${code}.label`}
                        label={
                          <FormattedMessage
                            description="Label for translation message for FAQ label"
                            defaultMessage="Label"
                          />
                        }
                      />

                      <div className="form-group">
                        <label className="col-form-label">
                          <FormattedMessage
                            description="Label for translation message for FAQ content"
                            defaultMessage="Content"
                          />
                        </label>

                        <RichText
                          name={`${arrayHelpers.name}[${index}].openforms.translations.${code}.content`}
                          supportsBackendTemplating={false}
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
                  openforms: {translations: defaultValues},
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
