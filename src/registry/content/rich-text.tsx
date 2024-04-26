/**
 * Rich text editor.
 *
 * @todo
 *
 * Eventually replace this with something that is Slate.js based so that we can
 * incorporate our domain-specific variables/constructs for a better editing experience.
 */
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@open-formulieren/ckeditor5-build-classic';
import {useField} from 'formik';
import {useContext} from 'react';

import {TemplatingHint} from '@/components/builder';
import {Component, Description} from '@/components/formio';
import {BuilderContext} from '@/context';

import './richText.scss';

export type ColorOption = Required<
  Required<(typeof ClassicEditor)['defaultConfig']>['fontColor']
>['colors'] extends Array<infer C>
  ? C
  : never;

export interface RichTextProps {
  name: string;
  required?: boolean;
}

/**
 * A rich text editor based on CKEditor 5.
 *
 * The value is stored as an HTML string. This editor is a custom build based on CKEditor's
 * classic editor build, with some extra plugins enabled to match the features used/exposed
 * by Formio.js.
 */
const RichText: React.FC<RichTextProps> = ({name, required}) => {
  const {richTextColors} = useContext(BuilderContext);
  const [props, , helpers] = useField<string>(name);
  return (
    <Component type="content" field={name} required={required} className="offb-rich-text">
      <CKEditor
        editor={ClassicEditor}
        config={{
          link: {
            decorators: {
              openInNewTab: {
                mode: 'manual',
                label: 'Open in a new tab',
                defaultValue: true, // This option will be selected by default.
                attributes: {
                  target: '_blank',
                  rel: 'noopener noreferrer',
                },
              },
            },
          },
          fontColor: {
            colors: richTextColors,
          },
        }}
        data={props.value || ''}
        onChange={(_, editor) => {
          const html = editor.getData();
          helpers.setValue(html);
        }}
        onBlur={() => {
          helpers.setTouched(true);
        }}
      />
      <Description text={<TemplatingHint />} />
    </Component>
  );
};

export default RichText;
