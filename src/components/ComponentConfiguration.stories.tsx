import {ExtendedComponentSchema} from 'formiojs/types/components/schema';
import React from 'react';

import {ComponentMeta, ComponentStory} from '@storybook/react';
import {EditFormComponentSchema} from '@types';

import ComponentConfiguration from './ComponentConfiguration';
import {BuilderInfo} from './ComponentEditForm';
import {ValidatorOption} from './builder/validate/validator-select';

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
  args: {
    isNew: true,
    otherComponents: [{type: 'select', label: 'A select', key: 'aSelect'}],
    validatorPlugins: [
      {id: 'phone-intl', label: 'Phone (international)'},
      {id: 'phone-nl', label: 'Phone (Dutch)'},
      {id: 'license-plate', label: 'License plate'},
    ],
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
  },
} as ComponentMeta<typeof ComponentConfiguration>;

interface TemplateArgs {
  component: EditFormComponentSchema;
  translationsStore: {
    [key: string]: {
      [key: string]: string;
    };
  };
  otherComponents: ExtendedComponentSchema[];
  validatorPlugins: ValidatorOption[];
  isNew: boolean;
  builderInfo: BuilderInfo;
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onRemove: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Template = ({
  component,
  otherComponents,
  validatorPlugins,
  translationsStore,
  isNew,
  builderInfo,
  onCancel,
  onRemove,
}: TemplateArgs) => {
  return (
    <ComponentConfiguration
      uniquifyKey={(key: string) => key}
      componentTranslationsRef={{current: translationsStore}}
      getFormComponents={() => otherComponents}
      getValidatorPlugins={async () => validatorPlugins}
      component={component}
      isNew={isNew}
      builderInfo={builderInfo}
      onCancel={onCancel}
      onRemove={onRemove}
    />
  );
};

export const Default: ComponentStory<typeof Template> = Template.bind({});
Default.storyName = 'generic';

Default.args = {
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
  component: {
    id: 'wekruya',
    type: 'textfield',
    label: 'A text field',
    validate: {
      required: false,
    },
  },
};
