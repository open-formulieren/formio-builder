import {HasValidation, SupportedLocales} from '@open-formulieren/types';
import {CuratedValidatorNames} from '@open-formulieren/types/lib/formio/validation';
import {useField} from 'formik';
import isEqual from 'lodash.isequal';
import {useContext, useEffect} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {BuilderContext} from '@/context';

import {DataMap, Panel, Tab, TabList, TabPanel, Tabs, TextField} from '../../formio';

type TranslatedErrors = {
  [K in SupportedLocales]: Record<string, string>;
};

type SchemaWithValidation = HasValidation<CuratedValidatorNames>;
type ValidatorErrorKeys<S extends SchemaWithValidation> = keyof Required<S>['errors'];

export function useManageValidatorsTranslations<S extends SchemaWithValidation>(
  keys: ValidatorErrorKeys<S>[] = []
): void {
  const {supportedLanguageCodes} = useContext(BuilderContext);
  const [{value}, , {setValue}] = useField<TranslatedErrors>('translatedErrors');

  // set any missing translations
  useEffect(() => {
    const newValue = {...value};
    for (const code of supportedLanguageCodes) {
      if (!newValue[code]) newValue[code] = {};
      for (let key of keys) {
        if (newValue[code][key as string] == null) {
          newValue[code][key as string] = '';
        }
      }
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
