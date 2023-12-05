/**
 * JsonLogic type checking utility functions
 */
import {infer} from '@open-formulieren/infernologic';
import {type JSONObject, type JSONValue} from '@open-formulieren/types/lib/types';

import {type AnyComponentSchema} from '@/types';

/**
 * @param {object | array | number | string} logic - JsonLogic expression
 * @param {object | array | number | string} expected - example value from expected result type e.g. [["label", "value"]]
 * @returns {string} - error message or '' if type checks
 */
export type JsonLogicTypeChecker = (logic: JSONValue, expected?: JSONValue) => string;

type DataType =
  | 'string'
  | 'int'
  | 'float'
  | 'array'
  | 'object'
  | 'date'
  | 'datetime'
  | 'time'
  | 'boolean';

interface ServiceFetchConfiguration {
  id: number;
  name: string;
  service: string;
  path: string;
  method: 'GET' | 'POST';
  headers: Record<string, string>;
  query_params: Record<string, string>;
  body: string | null;
  data_mapping_type: 'JsonLogic' | 'jq';
  mapping_expression: unknown;
  cache_timeout: number | null;
}

/*
  Description of static, user defined and component variables
 */
export interface VariableDefinition {
  form: string | null;
  formDefinition: string | null;
  name: string;
  key: string;
  source:
    | '' // static
    | 'component'
    | 'user_defined';
  serviceFetchConfiguration: ServiceFetchConfiguration | null;
  prefillPlugin: string;
  prefillAttribute: string;
  prefillIdentifierRole: 'authorised_person' | 'main';
  dataType: DataType; // (incomplete) type annotation
  dataFormat: string;
  isSensitiveData: boolean;
  initialValue: JSONValue;
}

interface FormContext {
  formVariables?: VariableDefinition[];
  staticVariables?: VariableDefinition[];
  components?: AnyComponentSchema[];
}

/**
 * Return a function that can type check whether
 */
export const createTypeCheck = ({
  formVariables = [],
  staticVariables = [],
  components = [],
}: FormContext = {}): JsonLogicTypeChecker => {
  const variableContext = staticVariables.concat(formVariables);
  let data: JSONObject = Object.fromEntries(
    variableContext.map(variable => [variable.key, dataTypeForVariableDefinition(variable)])
  );
  // formVariables contain user defined and component variables
  // but dataType `array` and `object` are incomplete
  // overwrite the component variables
  Object.entries(components).map(
    ([key, component]) => (data[key] = dataTypeForComponent(component))
  );

  return (logic, expected = undefined) => {
    // We don't evaluate logic, we just look at types.
    // "===" forces the logic expression align with the expectancy if defined
    const result = infer(expected !== undefined ? {'===': [logic, expected]} : logic, data);
    return result.startsWith('result type:') ? '' : result;
  };
};

// TODO use infer if serviceFetchConfiguration.data_mapping_type == 'JsonLogic'
const dataTypeForVariableDefinition = ({initialValue, dataType}: VariableDefinition): JSONValue =>
  initialValue !== null
    ? initialValue // may be something more complete than [] or {} ... TODO prefillAttribute too?
    : {
        string: '',
        int: 1,
        float: 1.1,
        array: [],
        object: {},
        date: '',
        datetime: '',
        time: '',
        boolean: true,
      }[dataType];

const dataTypeForComponent = (
  component:
    | AnyComponentSchema
    | {
        type: 'map' | 'editgrid' | 'password' | 'signature'; // Not yet implemented in this builder
        multiple?: boolean;
        defaultValue: JSONValue;
      }
): JSONValue => {
  // For now return example values as accepted by InferNoLogic
  // But example values cannot distinguish arrays from tuples!
  const value = {
    address: {
      postcode: '',
      houseNumber: '',
      houseLetter: '',
      houseNumberAddition: '',
    },
    currency: 1,
    number: 1,
    checkbox: true,
    //@ts-ignore selectboxes always have component.defaultValue (this does work when rewritten as a lengthy switch/case)
    selectboxes: component.defaultValue,
    npFamilyMembers: {}, // TODO record type
    map: [1, 1], // TODO tuple type
    bsn: 'string',
    columns: null, // layout component
    content: null, // layout component
    date: 'date', // TODO string for now
    datetime: 'datetime', // TODO string for now
    editgrid: [{}], // TODO inspect the component
    fieldset: null, // layout component
    email: 'string',
    file: [
      {
        data: {baseUrl: '', form: '', name: '', project: '', size: 0, url: ''},
        name: '',
        originalName: '',
        size: 0,
        storage: '',
        type: '', // mime
        url: '',
      },
    ],
    iban: 'string',
    licenseplate: 'string',
    password: 'string',
    phoneNumber: 'string',
    postcode: 'string',
    radio: 'string',
    select: 'string',
    signature: 'string', // data-url
    textarea: 'string',
    textfield: 'string',
    time: 'time', // TODO string for now
  }[component.type];
  return 'multiple' in component && component.multiple ? [value] : value;
};
