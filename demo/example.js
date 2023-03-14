/**
 * Desired public interface.
 */
import React from 'react';

import {
  FormBuilder,
  ComponentGroup,
  ComponentLibrary,
  FormPreview,
} from '@open-formulieren/formio-builder';
import {
  TextField,
  Select,
  Radio,
  SelectBoxes,
  TextArea,
  Content,
  Fieldset,
  EditGrid,
  FileUpload,
  Password,
  Signature,
} from '@open-formulieren/formio-builder/components';

import {
  CoSign,
  PostCode,
} from './components';

const Builder = ({ configuration, onChange }) => (
  <FormioBuilder configuration={configuration} onChange={onChange}>
    {/* children with some meta information or perhaps slots on the component. */}
    <ComponentLibrary>
      <StandardComponents />
      <AdvancedComponents />
      <LayoutComponents />
      <Presets />
      <DeprecatedComponents />
    </ComponentLibrary>
    {/* The preview is then responsible for managing the drop zones */}
    <Preview>
      <DropZone />
    </Preview>
  </FormioBuilder>
);

const StandardComponents = () => (
  <ComponentGroup>
    <TextField />
    <Select />
    <Radio />
    <SelectBoxes />
    <TextArea />
    <FileUpload />
  </ComponentGroup>
);

const AdvancedComponents = () => (
  <ComponentGroup>
    <EditGrid />
    <Signature />
    <CoSign />
  </ComponentGroup>
);

const LayoutComponents = () => (
  <ComponentGroup>
    <FieldSet />
    <Content />
  </ComponentGroup>
);

const Presets = () => (
  <ComponentGroup>
    <TextField title="Full name" icon="terminal" key="fullName" schema={{autocomplete: 'name'}} />
    <TextField title="Postcode" icon="home" key="postalcode" schema={{
      inputMask: '9999 AA',
      autocomplete: 'postal-code',
      validateOn: 'blur',
      validate: {
        customMessage: 'Invalid postcode',
        // Dutch postcode has 4 numbers and 2 letters (case insensitive). Letter combinations SS, SD and SA
        // are not used due to the Nazi-association.
        // See https://stackoverflow.com/a/17898538/7146757 and https://nl.wikipedia.org/wiki/Postcodes_in_Nederland
        pattern: '^[1-9][0-9]{3} ?(?!sa|sd|ss|SA|SD|SS)[a-zA-Z]{2}$',
      }
    }} />
  </ComponentGroup>
);

const DeprecatedComponents = () => (
  <ComponentGroup>
    <PostCode />
    <Password />
  </ComponentGroup>
);
