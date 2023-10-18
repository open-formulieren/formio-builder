import {css} from '@emotion/css';
import {OFExtensions} from '@open-formulieren/types';
import clsx from 'clsx';
import {useFormikContext} from 'formik';
import {useContext, useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {BuilderContext} from '@/context';
import {FilterByValueType} from '@/types';
import {AnyComponentSchema} from '@/types/schemas';

import {Component, TextField} from '../formio';
import ComponentLabel from '../formio/component-label';

type ExtractTranslatableProperties<T> = T extends OFExtensions<infer TK> ? TK : never;
type StringValueProperties<S> = S extends AnyComponentSchema
  ? keyof FilterByValueType<S, string | undefined>
  : never;

export interface ComponentTranslationsProps<S extends AnyComponentSchema> {
  propertyLabels: {
    [key in ExtractTranslatableProperties<S>]: string;
  };
}

// XXX: once we've moved away from bootstrap/formio 'component library', this fix and
// @emotion/css can be removed again.
const LABEL_CELL = css`
  padding: 0 !important;
  border-left-color: transparent !important;
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-width: 1px !important;
`;

const TABS_CELL = css`
  padding: 0 !important;
  border-left-color: transparent !important;
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom: none !important;
`;

const TABS_OFFSET = css`
  margin-left: -1px;
  margin-bottom: -1px;
  margin-right: -1px;
`;

export function ComponentTranslations<S extends AnyComponentSchema>({
  propertyLabels,
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
      <table className="table table-bordered">
        <thead>
          <tr>
            <td colSpan={2} className={LABEL_CELL}>
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
            <td className={TABS_CELL}>
              <ul className={`nav nav-tabs ${TABS_OFFSET}`}>
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
            <th style={{width: '20%'}}>
              <FormattedMessage
                description="Translations: location column header"
                defaultMessage="Location"
              />
            </th>
            <th style={{width: '35%'}}>
              <FormattedMessage
                description="Translations: property column header"
                defaultMessage="Value"
              />
            </th>
            <th style={{borderTop: 'none'}}>
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
                <div aria-describedby={`component-translation-property-${property}`}>
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
      </table>
    </Component>
  );
}
