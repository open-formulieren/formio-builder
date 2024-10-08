import {OFExtensions, SupportedLocales} from '@open-formulieren/types';
import clsx from 'clsx';
import {useFormikContext} from 'formik';
import React from 'react';
import {useContext, useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {BuilderContext} from '@/context';
import {FilterByValueType} from '@/types';
import {AnyComponentSchema} from '@/types/schemas';

import {Component, TextField} from '../formio';
import ComponentLabel from '../formio/component-label';
import './i18n.scss';

type ExtractTranslatableProperties<T> = T extends OFExtensions<infer TK> ? TK : never;
type StringValueProperties<S> = S extends AnyComponentSchema
  ? keyof FilterByValueType<S, string | undefined>
  : never;

export interface ComponentTranslationsProps<S extends AnyComponentSchema> {
  propertyLabels: {
    [key in ExtractTranslatableProperties<S>]: string;
  };
  children?: React.ReactNode;
}

export interface ComponentTranslationsContextType {
  activeLanguage: SupportedLocales;
}

export const ComponentTranslationsContext = React.createContext<ComponentTranslationsContextType>({
  activeLanguage: 'nl',
});
ComponentTranslationsContext.displayName = 'ComponentTranslationsContext';

export function ComponentTranslations<S extends AnyComponentSchema>({
  propertyLabels,
  children,
}: ComponentTranslationsProps<S>) {
  const intl = useIntl();
  const {supportedLanguageCodes} = useContext(BuilderContext);
  const {values} = useFormikContext<S>();
  const [activeLanguage, setActiveLanguage] = useState(supportedLanguageCodes[0]);

  // Object.keys has string[] type, by design. See https://stackoverflow.com/a/52856805
  // We can narrow this down - because of the propertyLabels type, we know that each key
  // is a translatable property, and each key must also be a property of the particular
  // component schema.
  const properties = Object.keys(propertyLabels) as (ExtractTranslatableProperties<S> &
    StringValueProperties<S>)[];
  const nameBase = `openForms.translations.${activeLanguage}`;

  return (
    <Component type="datagrid">
      <table className="table table-bordered offb-table">
        <thead>
          <tr className="offb-i18n-header">
            <td
              colSpan={2}
              className="offb-i18n-header__label offb-table__col offb-table__col--width-50"
            >
              <ComponentLabel
                label={
                  <FormattedMessage
                    description="Translations datagrid label"
                    defaultMessage="Translations"
                  />
                }
                tooltip={intl.formatMessage({
                  description: 'Tooltip for component translations.',
                  defaultMessage: 'Translations for literals used in this component.',
                })}
              />
            </td>
            <td className="offb-i18n-header__tab-container offb-table__col offb-table__col--width-50">
              <ul className={`nav nav-tabs offb-i18n-header__tabs`}>
                {supportedLanguageCodes.map(code => (
                  <li key={code} className={clsx('nav-item', {active: code === activeLanguage})}>
                    <a
                      key={code}
                      href="#"
                      className={clsx('nav-link', {active: code === activeLanguage})}
                      onClick={e => {
                        e.preventDefault();
                        setActiveLanguage(code);
                      }}
                    >
                      {code.toUpperCase()}
                    </a>
                  </li>
                ))}
              </ul>
            </td>
          </tr>

          <tr>
            <th className="offb-table__col offb-table__col--width-25">
              <FormattedMessage
                description="Translations: location column header"
                defaultMessage="Location"
              />
            </th>
            <th className="offb-table__col offb-table__col--width-25">
              <FormattedMessage
                description="Translations: property column header"
                defaultMessage="Value"
              />
            </th>
            <th className="offb-table__col offb-table__col--width-50">
              <FormattedMessage
                description="Translations: translation column header"
                defaultMessage="Translations"
              />
            </th>
          </tr>
        </thead>

        <tbody>
          {properties.map(property => (
            <tr key={property}>
              <td>
                <span id={`component-translation-property-${property}`}>
                  {propertyLabels[property] || property}
                </span>
              </td>
              <td>
                <div
                  aria-describedby={`component-translation-property-${property}`}
                  className="offb-table__content offb-table__content--allow-break"
                >
                  {(values?.[property] || '-') as string}
                </div>
              </td>
              <td>
                <TextField
                  name={`${nameBase}.${property}`}
                  aria-label={intl.formatMessage(
                    {
                      description: 'Accessible label for component property translation field',
                      defaultMessage: 'Translation for "{field}"',
                    },
                    {field: property}
                  )}
                />
              </td>
            </tr>
          ))}
        </tbody>
        {children && (
          <ComponentTranslationsContext.Provider value={{activeLanguage}}>
            {children}
          </ComponentTranslationsContext.Provider>
        )}
      </table>
    </Component>
  );
}
