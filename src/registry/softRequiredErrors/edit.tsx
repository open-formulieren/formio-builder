import {JSONEditor} from '@open-formulieren/monaco-json-editor';
import {SoftRequiredErrorsComponentSchema} from '@open-formulieren/types';
import {useFormikContext} from 'formik';
import React, {useContext, useEffect, useRef, useState} from 'react';

import PreviewModeToggle, {PreviewState} from '@/components/PreviewModeToggle';
import {Key, RichText} from '@/components/builder';
import {Tab, TabList, TabPanel, Tabs} from '@/components/formio';
import {BuilderContext} from '@/context';
import {useErrorChecker} from '@/utils/errors';

import {EditFormDefinition} from '../types';

/**
 * Form to configure a Formio 'content' type component.
 *
 * W/r to translations, the 'NL' language is considered the default, and the main html
 * value is populated from that field (TODO: implement this).
 */
const EditForm: EditFormDefinition<SoftRequiredErrorsComponentSchema> = () => {
  const {uniquifyKey, supportedLanguageCodes, theme} = useContext(BuilderContext);
  const isKeyManuallySetRef = useRef(false);
  const {values, setFieldValue, setValues} = useFormikContext<SoftRequiredErrorsComponentSchema>();
  const generatedKey = uniquifyKey(values.key);

  const [previewMode, setPreviewMode] = useState<PreviewState>('rich');

  const defaultLanguageCode = supportedLanguageCodes[0] ?? 'nl';

  // Synchronize the default/first language tab value to the main `html` field.
  useEffect(() => {
    const currentValue = values.openForms?.translations?.[defaultLanguageCode]?.html;
    if (currentValue === undefined && values.html) {
      // if we have a 'html' value, but no default translation -> store the default translation
      setFieldValue(`openForms.translations.${defaultLanguageCode}.html`, values.html);
    } else if (values.html !== currentValue) {
      // otherwise sync the value of the translation field to the main field.
      setFieldValue('html', currentValue);
    }
  });

  // the `html` property edits in the JSON edit don't behave as expected, you need to
  // edit the language specific values, so remove it.
  const {html, ...jsonEditValues} = values;

  return (
    <>
      <div className="card panel preview-panel">
        <div className="card-header d-flex justify-content-end">
          <PreviewModeToggle previewMode={previewMode} setPreviewMode={setPreviewMode} />
        </div>
        <div className="card-body">
          {previewMode === 'JSON' ? (
            <JSONEditor height="45vh" value={jsonEditValues} onChange={setValues} theme={theme} />
          ) : (
            <>
              <RichTextTranslations />
              <Key isManuallySetRef={isKeyManuallySetRef} generatedValue={generatedKey} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

const DEFAULT_CONTENT_NL: string = `
  <p>
    <strong>Je hebt niet alle velden ingevuld</strong>
    <br>
    Het lijkt erop dat niet alle verplichte velden ingevuld zijn. Als je deze velden
    niet van een antwoord voorziet, dan kan je aanvraag mogelijk niet worden behandeld.
    En, als gevolg daarvan, krijg je ook de eventuele kosten die je hebt betaald voor
    de aanvraag niet terug. Zorg er dus voor dat je alle verplichte velden invult.
  </p>
  <p>Dit zijn de velden die nog geen antwoord hebben:</p>

  {{ missingFields }}

  <p>Wil je doorgaan met de aanvraag?</p>
`;

EditForm.defaultValues = {
  // Display tab
  html: DEFAULT_CONTENT_NL,
  key: '',
  openForms: {
    translations: {
      nl: {
        html: DEFAULT_CONTENT_NL,
      },
      en: {
        html: '',
      },
    },
  },
};

const RichTextTranslations: React.FC = () => {
  const {supportedLanguageCodes} = useContext(BuilderContext);
  const {hasAnyError} = useErrorChecker<SoftRequiredErrorsComponentSchema>();
  return (
    <Tabs>
      <TabList>
        {supportedLanguageCodes.map(code => (
          <Tab key={code} hasErrors={hasAnyError(`openForms.translations.${code}`)}>
            {code.toUpperCase()}
          </Tab>
        ))}
      </TabList>

      {supportedLanguageCodes.map((code, index) => (
        <TabPanel key={code}>
          <RichText name={`openForms.translations.${code}.html`} required={index === 0} />
        </TabPanel>
      ))}
    </Tabs>
  );
};

export default EditForm;
