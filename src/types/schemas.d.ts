/**
 * Open Forms specific Formio component schema extensions.
 */
import {ComponentSchema, ValidateOptions} from 'formiojs';

export interface DisplayConfig {
  showInSummary: boolean;
  showInEmail: boolean;
  showInPDF: boolean;
}

export interface PrefillConfig {
  plugin: string | null;
  attribute: string | null;
}

export interface ExtendedValidateOptions extends ValidateOptions {
  plugins?: string[];
}

export type OpenFormsComponentSchemaBase<T> = ComponentSchema<T> &
  DisplayConfig & {
    validate?: ExtendedValidateOptions;
    isSensitiveData?: boolean;
    translatedErrors?: Record<string, Record<string, string>>;
    prefill?: PrefillConfig;
    registration: {
      attribute: string;
    };
  };
