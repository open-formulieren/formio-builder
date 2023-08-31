import {SupportedLocales, TranslationsContainer} from '@open-formulieren/types';
import {Translation} from '@open-formulieren/types/lib/formio/i18n';
import {useFormikContext} from 'formik';
import get from 'lodash.get';
import {useContext, useEffect, useRef} from 'react';
import {FormattedMessage} from 'react-intl';

import {BuilderContext} from '@/context';
import {AnyComponentSchema} from '@/types/schemas';

import {DataGrid, DataGridRow, Tab, TabList, TabPanel, Tabs, TextField} from '..//formio';

export type SchemaKey<S> = keyof S & string;

// Typing this to get rid of the `undefined`'s is surprisingly hard. This basically
// says that an object will be returned having each `languageCodes` element as key,
// with the value set to an (empty) Translation array.

type EmptyTranslationsContainer<T extends SupportedLocales[]> = {
  [K in T[number]]: Translation[];
};

function getEmptyTranslationsObject<T extends SupportedLocales[]>(
  languageCodes: T
): EmptyTranslationsContainer<T> {
  const result: Partial<EmptyTranslationsContainer<T>> = {};
  for (const code of languageCodes) {
    result[code as keyof EmptyTranslationsContainer<T>] = [];
  }
  return result as EmptyTranslationsContainer<T>;
}

/**
 * Hook to observe literals and ensure the translations are correctly synchronized.
 *
 * Example usage:
 *
 *   useManageTranslations<TextFieldSchema>(['label', 'description', 'defaultValue']);
 *
 * @todo: only consider field names where the value is a string -> translating defaultValue
 *   number makes no sense
 *
 * @param forProperties Array of form field names to monitor for translation.
 */
export function useManageTranslations<S extends AnyComponentSchema = AnyComponentSchema>(
  forProperties: SchemaKey<S>[] = []
): void {
  const FIELD = 'openForms.translations';

  const {componentTranslationsRef, supportedLanguageCodes} = useContext(BuilderContext);
  const {values, setFieldValue} = useFormikContext<S>();

  const translationsStore = componentTranslationsRef.current;

  const prevLiteralsRef = useRef<Record<string, string>>(
    Object.fromEntries(
      forProperties.map(property => {
        const literal: string | undefined = get<S, string>(values, property);
        return [property, literal || ''];
      })
    )
  );

  // set initial translations as literal:translation key-value pairs
  useEffect(() => {
    const translations = getEmptyTranslationsObject(supportedLanguageCodes);
    supportedLanguageCodes.forEach(code => {
      forProperties.forEach(property => {
        const literal: string = get<S, string>(values, property);
        if (!literal) return;
        translations[code].push({
          literal,
          translation: translationsStore?.[code]?.[literal] || '',
        });
      });
    });
    setFieldValue(FIELD, translations);
  }, []);

  // track changed literals and update the translations accordingly
  const changed = forProperties.filter(property => {
    const prevValue = prevLiteralsRef.current[property];
    const currentValue: string = get<S, string>(values, property);
    return currentValue != prevValue;
  });

  useEffect(() => {
    if (!changed.length) return;
    const currentTranslations = get<S, typeof FIELD>(values, FIELD) as null | TranslationsContainer<
      Translation[]
    >;
    if (currentTranslations == null) return;

    const updatedTranslations = getEmptyTranslationsObject(supportedLanguageCodes);

    for (const code of supportedLanguageCodes) {
      const currentLanguageTranslations = currentTranslations[code] || [];
      for (const property of forProperties) {
        const currentLiteral: string | undefined = get<S, string>(values, property);
        if (!currentLiteral) continue; // drop the translation

        const previouslyAdded = updatedTranslations[code].find(t => t.literal === currentLiteral);
        if (previouslyAdded) continue;
        if (!changed.includes(property)) {
          const translation = currentLanguageTranslations.find(t => t.literal === currentLiteral);
          translation && updatedTranslations[code].push(translation);
          continue;
        }

        const prevLiteral = prevLiteralsRef.current[property];
        // find the old translation and update the literal
        const oldTranslation = currentLanguageTranslations.find(t => t.literal === prevLiteral) || {
          translation: '',
        };
        updatedTranslations[code].push({
          translation: translationsStore?.[code]?.[currentLiteral] || oldTranslation.translation,
          literal: currentLiteral,
        });
      }
    }

    for (const property of changed) {
      prevLiteralsRef.current[property] = get<S, string>(values, property);
    }
    setFieldValue(FIELD, updatedTranslations);
  });
}

interface SingleLanguageTranslationsProps {
  languageCode: SupportedLocales;
}

const SingleLanguageTranslations: React.FC<SingleLanguageTranslationsProps> = ({languageCode}) => {
  const {values} = useFormikContext<AnyComponentSchema>();
  const translations = values?.openForms?.translations?.[languageCode] || [];
  const nonEmptyTranslations = translations.filter(t => t.literal);
  return (
    <DataGrid
      name={`openForms.translations.${languageCode}`}
      label={
        <FormattedMessage description="Translations datagrid label" defaultMessage="Translations" />
      }
      tooltip="Translations for literals used in this component."
      columns={['Literal', 'Translation']}
    >
      {nonEmptyTranslations.map(({literal}, index) => (
        <DataGridRow key={literal} index={index}>
          <TextField name="literal" readOnly />
          <TextField name="translation" />
        </DataGridRow>
      ))}
    </DataGrid>
  );
};

export const ComponentTranslations = () => {
  const {supportedLanguageCodes} = useContext(BuilderContext);
  return (
    <Tabs>
      <TabList>
        {supportedLanguageCodes.map(code => (
          <Tab key={code}>{code.toUpperCase()}</Tab>
        ))}
      </TabList>

      {supportedLanguageCodes.map(code => (
        <TabPanel key={code}>
          <SingleLanguageTranslations languageCode={code} />
        </TabPanel>
      ))}
    </Tabs>
  );
};
