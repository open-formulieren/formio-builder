import {PossibleValidatorErrorKeys, SchemaWithValidation} from '@open-formulieren/types';
import {useField} from 'formik';
import isEqual from 'lodash.isequal';
import {useContext, useEffect} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {BuilderContext} from '@/context';

import {DataMap, Panel, Tab, TabList, TabPanel, Tabs, TextField} from '../../formio';

export function useManageValidatorsTranslations<S extends SchemaWithValidation>(
  keys: PossibleValidatorErrorKeys<S>[]
): void {
  const {supportedLanguageCodes} = useContext(BuilderContext);
  const [{value}, , {setValue}] = useField<S['translatedErrors']>('translatedErrors');

  // set any missing translations
  useEffect(() => {
    const newValue = value
      ? {...value}
      : (Object.fromEntries(supportedLanguageCodes.map(code => [code, {}])) as NonNullable<
          S['translatedErrors']
        >);
    const emptyDefaults = Object.fromEntries(keys.map(k => [k, '']));
    for (const code of supportedLanguageCodes) {
      newValue[code] = {...emptyDefaults, ...newValue[code]};
    }
    if (isEqual(newValue, value)) return;
    setValue(newValue);
  }, [keys, value]);
}

const ValidationErrorTranslations = () => {
  const intl = useIntl();
  const {supportedLanguageCodes} = useContext(BuilderContext);

  const panelTooltip = intl.formatMessage({
    description: 'Tooltip validation error translations panel',
    defaultMessage: 'Custom error messages for this component and their translations',
  });

  return (
    <Panel
      title={
        <FormattedMessage
          description="Title of validation error translations panel"
          defaultMessage="Custom error messages"
        />
      }
      tooltip={panelTooltip}
      collapsible
      initialCollapsed
    >
      <Tabs>
        <TabList>
          {supportedLanguageCodes.map(code => (
            <Tab key={code}>{code.toUpperCase()}</Tab>
          ))}
        </TabList>

        {supportedLanguageCodes.map(code => (
          <TabPanel key={code}>
            <DataMap
              name={`translatedErrors.${code}`}
              keyLabel={
                <FormattedMessage
                  description="Label for translation of validation error code"
                  defaultMessage="Error code"
                />
              }
              valueComponent={
                <TextField
                  name="message"
                  label={
                    <FormattedMessage
                      description="Label for translation message for validation error code"
                      defaultMessage="Error message"
                    />
                  }
                />
              }
            />
          </TabPanel>
        ))}
      </Tabs>
    </Panel>
  );
};

export default ValidationErrorTranslations;
