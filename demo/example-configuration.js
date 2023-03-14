import React from 'react';

import {
  FormBuilder,
  ComponentGroup,
  ComponentLibrary,
  FormPreview,
} from '@open-formulieren/formio-builder';


const ComponentConfiguration = () => (
  <div>
    <EditTabs />
    <div>
      <ComponentPreview />
      <SubmitRow />
    </div>
  </div>
);

const EditTabs = ({tabs}) => (
  <>
    {
      tabs.map(tab => (
        <Tab title={tab.title} />
      ))
    }
    {
      tabs.map(tab => (
        <TabContent>
          {tab.fields.map(Field => (
            <Field />
          ))}
        </TabContent>
      ))
    }
  </>
);


// Fields
const Label = ({ component }) => (
  <div className="of-builder-field">
    <label for="label">Label</label>
    <input id="label" type="text" name="label" value={component.label || ''} />
    <p className="of-builder-field__description">Human readable field label</p>
  </div>
);
