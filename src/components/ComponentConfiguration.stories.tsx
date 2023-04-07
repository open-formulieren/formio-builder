import {ExtendedComponentSchema} from 'formiojs/types/components/schema';
import React from 'react';

import {ComponentMeta, ComponentStory} from '@storybook/react';
import {EditFormComponentSchema} from '@types';

import ComponentConfiguration from './ComponentConfiguration';
import {BuilderInfo} from './ComponentEditForm';

export default {
  title: 'Public API/ComponentConfiguration',
  component: ComponentConfiguration,
  argTypes: {
    componentTranslationsRef: {
      table: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof ComponentConfiguration>;

interface TemplateArgs {
  component: EditFormComponentSchema;
  otherComponents: ExtendedComponentSchema[];
  translationsStore: {
    [key: string]: {
      [key: string]: string;
    };
  };
  isNew: boolean;
  builderInfo: BuilderInfo;
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onRemove: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Template = ({
  component,
  otherComponents,
  translationsStore,
  isNew,
  builderInfo,
  onCancel,
  onRemove,
}: TemplateArgs) => {
  return (
    <ComponentConfiguration
      uniquifyKey={(key: string) => key}
      getFormComponents={() => otherComponents}
      componentTranslationsRef={{current: translationsStore}}
      component={component}
      isNew={isNew}
      builderInfo={builderInfo}
      onCancel={onCancel}
      onRemove={onRemove}
    />
  );
};

const defaultArgs = {
  isNew: true,
  otherComponents: [{type: 'select', label: 'A select', key: 'aSelect'}],
  translationsStore: {
    nl: {
      'A select': 'Een dropdown',
      'A text field': 'Een tekstveld',
    },
  },
  builderInfo: {
    title: 'Text field',
    group: 'basic',
    icon: 'terminal',
    schema: {placeholder: ''},
    weight: 0,
  },
};

export const Default: ComponentStory<typeof Template> = Template.bind({});
Default.storyName = 'generic';

Default.args = {
  ...defaultArgs,
  component: {
    id: 'wekruya',
    type: 'textfield',
    label: 'A text field',
    validate: {
      required: false,
    },
  },
};

export const TextField: ComponentStory<typeof Template> = Template.bind({});
TextField.storyName = 'type: textfield';

TextField.args = {
  ...defaultArgs,
  component: {
    id: 'wekruya',
    type: 'textfield',
    label: 'A text field',
    validate: {
      required: false,
    },
  },
};
