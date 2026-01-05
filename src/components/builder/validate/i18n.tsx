import {useField} from 'formik';
import {isEqual} from 'lodash';
import {useContext, useEffect} from 'react';
import {FormattedMessage, defineMessage, useIntl} from 'react-intl';

import {BuilderContext} from '@/context';

import {DataMap, Panel, Tab, TabList, TabPanel, Tabs, TextField} from '../../formio';
import type {PossibleValidatorErrorKeys, SchemaWithValidation} from './types';

export function useManageValidatorsTranslations<S extends SchemaWithValidation>(
  keys: PossibleValidatorErrorKeys<S>[],
  prefix: string = ''
): void {
  type TranslatedErrors = S['translatedErrors'];
  const fieldName = `${prefix}${prefix ? '.' : ''}translatedErrors`;
  const {supportedLanguageCodes} = useContext(BuilderContext);
  const [{value}, , {setValue}] = useField<TranslatedErrors>(fieldName);

  useEffect(() => {
    const newValue = value
      ? {...value}
      : (Object.fromEntries(
          supportedLanguageCodes.map(code => [code, {}])
        ) as NonNullable<TranslatedErrors>);
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
              ariaLabelMessage={defineMessage({
                description: 'Accessible label for error message input field',
                defaultMessage: 'Error message for "{key}"',
              })}
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
