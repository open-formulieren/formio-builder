import React from 'react';

import {PartialStoryFn, StoryContext} from '@storybook/csf';
import {ReactFramework} from '@storybook/react';

import {BuilderContext} from '../src/context';

export const ModalDecorator = (Story, {parameters}) => {
  if (parameters?.modal?.noModal) return <Story />;
  return (
    <div
      className="formio-dialog formio-dialog-theme-default component-settings"
      style={{position: 'relative'}}
    >
      <div className="formio-dialog-overlay" style={{position: 'relative'}}></div>
      <div className="formio-dialog-content">
        <div></div>
        <button
          aria-label="close"
          className="formio-dialog-close float-right btn btn-secondary btn-sm"
        ></button>
        <div className="component-edit-container">
          <Story />
        </div>
      </div>
    </div>
  );
};

const DEFAULT_COMPONENT_TREE = [
  {type: 'textfield', key: 'text1', label: 'Textfield 1'},
  {
    type: 'fieldset',
    key: 'fieldset1',
    label: 'Fieldset 1',
    components: [
      {type: 'textfield', key: 'text2', label: 'Textfield 2'},
      {type: 'number', key: 'nested.number1', label: 'Nested number'},
    ],
  },
];

export const BuilderContextDecorator = (
  Story: PartialStoryFn<ReactFramework>,
  context: StoryContext
) => {
  if (!context.parameters?.builder?.enableContext) return <Story />;
  const defaultComponentTree =
    context.parameters.builder?.defaultComponentTree || DEFAULT_COMPONENT_TREE;
  return (
    <BuilderContext.Provider
      value={{
        uniquifyKey: key => key,
        getFormComponents: () => context?.args?.componentTree || defaultComponentTree,
        componentTranslationsRef: {current: null},
      }}
    >
      <Story />
    </BuilderContext.Provider>
  );
};
