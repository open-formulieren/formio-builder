/**
 * Open Forms specific Formio component schema extensions.
 */
import {ComponentSchema, ValidateOptions} from 'formiojs';

export interface DisplayConfig {
  showInSummary?: boolean;
  showInEmail?: boolean;
  showInPDF?: boolean;
}

export interface PrefillConfig {
  plugin: string | null;
  attribute: string | null;
  identifierRole: string;
}

export interface ExtendedValidateOptions extends ValidateOptions {
  plugins?: string[];
}

interface Translation {
  literal: string;
  translation: string;
}

export interface TranslationsContainer {
  [key: string]: Translation[];
}

export type OpenFormsComponentSchemaBase<T = any> = ComponentSchema<T> &
  DisplayConfig & {
    validate?: ExtendedValidateOptions;
    isSensitiveData?: boolean;
    translatedErrors?: Record<string, Record<string, string>>;
    prefill?: PrefillConfig;
    registration?: {
      attribute: string;
    };
    openForms?: {
      translations: TranslationsContainer;
    };
  };
