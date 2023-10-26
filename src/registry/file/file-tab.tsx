import {FileComponentSchema} from '@open-formulieren/types';
import {useFormikContext} from 'formik';
import isEqual from 'lodash.isequal';
import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import useAsync from 'react-use/esm/useAsync';

import {Checkbox, Component, NumberField, Select, TextField} from '@/components/formio';
import {BuilderContext} from '@/context';

// // lifted from formio's file component in 4.13.x
// const translateScalars(str) {
//   if (typeof str === 'string') {
//     if (str.search(/kb/i) === str.length - 2) {
//       return parseFloat(str.substring(0, str.length - 2) * 1024);
//     }
//     if (str.search(/mb/i) === str.length - 2) {
//       return parseFloat(str.substring(0, str.length - 2) * 1024 * 1024);
//     }
//     if (str.search(/gb/i) === str.length - 2) {
//       return parseFloat(str.substring(0, str.length - 2) * 1024 * 1024 * 1024);
//     }
//     if (str.search(/b/i) === str.length - 1) {
//       return parseFloat(str.substring(0, str.length - 1));
//     }
//   }
//   return str;
// }

const hasImageMimeType = (mimetypes: string[]): boolean =>
  mimetypes.some(mimeType => mimeType.startsWith('image/') || mimeType === '*');

const FileName: React.FC<{}> = () => {
  const intl = useIntl();

  const tooltip = intl.formatMessage(
    {
      description: "Tooltip for 'file.name' builder field",
      defaultMessage:
        "Specify template for name of uploaded file(s). <code>'{{ fileName }}'</code> contains the original filename.",
    },
    {
      code: chunks => <code>{chunks}</code>,
    }
  ) as string; // library doesn't narrow the type when using template fns :(

  return (
    <TextField
      name="file.name"
      label={
        <FormattedMessage
          description="Label for 'file.name' builder field"
          defaultMessage="File name template"
        />
      }
      tooltip={tooltip}
      placeholder={intl.formatMessage({
        description: "placeholder for 'file.name' builder field",
        defaultMessage: '(optional)',
      })}
    />
  );
};

const FileTypesSelect: React.FC<{}> = () => {
  const {getFileTypes} = useContext(BuilderContext);
  const {values, initialValues, setFieldValue} = useFormikContext<FileComponentSchema>();
  const initialImageConfiguration = initialValues.of?.image;
  const {value: options, loading, error} = useAsync(async () => await getFileTypes(), []);

  if (error) {
    throw error;
  }

  const onChange = (event: {target: {name: string; value: string[]}}) => {
    const {value: fileTypes} = event.target;
    // set the filePattern 'hidden field' value - this drives the browser file picker
    // filter
    setFieldValue('filePattern', fileTypes.join(','));

    // set the human-readable labels, used in error messages
    const labels = (options || [])
      .filter(option => fileTypes.includes(option.value))
      .map(option => option.label);
    setFieldValue('file.allowedTypesLabels', labels);

    // reset the image resizing options if no image file types are allowed
    const hasImages = hasImageMimeType(fileTypes);
    if (!hasImages && !isEqual(values.of?.image, initialImageConfiguration)) {
      setFieldValue('of.image', initialImageConfiguration);
    }
  };

  return (
    <Select
      name="file.type"
      label={
        <FormattedMessage
          description="Label for 'file.type' builder field"
          defaultMessage="File types"
        />
      }
      isLoading={loading}
      isClearable
      isMulti
      options={options}
      valueProperty="value"
      onChange={onChange}
    />
  );
};

const UseConfigFiletypes = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'useConfigFiletypes' builder field",
    defaultMessage:
      'When this is checked, the filetypes configured in the global settings will be used.',
  });
  return (
    <Checkbox
      name="useConfigFiletypes"
      label={
        <FormattedMessage
          description="Label for 'useConfigFiletypes' builder field"
          defaultMessage="Use globally configured filetypes"
        />
      }
      tooltip={tooltip}
    />
  );
};

const FileMaxSize = () => {
  const intl = useIntl();
  const {serverUploadLimit} = useContext(BuilderContext);
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'fileMaxSize' builder field",
    defaultMessage: 'The maximum size of a single file to upload.',
  });

  return (
    <TextField
      name="fileMaxSize"
      label={
        <FormattedMessage
          description="Label for 'fileMaxSize' builder field"
          defaultMessage="Maximum file size"
        />
      }
      tooltip={tooltip}
      description={
        <FormattedMessage
          description="Description for 'fileMaxSize' builder field"
          defaultMessage="Note that the server upload limit is {serverUploadLimit}."
          values={{serverUploadLimit}}
        />
      }
    />
  );
};

const MaxNumberOfFiles = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'maxNumberOfFiles' builder field",
    defaultMessage: 'The maximum number of files that can be uploaded.',
  });
  return (
    <NumberField
      name="maxNumberOfFiles"
      label={
        <FormattedMessage
          description="Label for 'maxNumberOfFiles' builder field"
          defaultMessage="Maximum number of files"
        />
      }
      tooltip={tooltip}
      min={1}
      step={1}
    />
  );
};

const ImageResizeApply = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'of.image.resize.apply' builder field",
    defaultMessage: 'When this is checked, any uploaded image(s) will be resized.',
  });
  return (
    <Checkbox
      name="of.image.resize.apply"
      label={
        <FormattedMessage
          description="Label for 'of.image.resize.apply' builder field"
          defaultMessage="Resize image"
        />
      }
      tooltip={tooltip}
    />
  );
};

const ImageResizingOptions = () => {
  const {values} = useFormikContext<FileComponentSchema>();
  const applyResize = values?.of?.image?.resize?.apply ?? false;

  return (
    <>
      <ImageResizeApply />
      {applyResize && (
        <Component type="columns">
          <div className="columns">
            <div className="column column--span-md">
              <NumberField
                name="of.image.resize.width"
                label={
                  <FormattedMessage
                    description="Label for 'of.image.resize.width' builder field"
                    defaultMessage="Maximum width"
                  />
                }
                min={0}
                step={100}
              />
            </div>
            <div className="column column--span-md">
              <NumberField
                name="of.image.resize.height"
                label={
                  <FormattedMessage
                    description="Label for 'of.image.resize.height' builder field"
                    defaultMessage="Maximum height"
                  />
                }
                min={0}
                step={100}
              />
            </div>
          </div>
        </Component>
      )}
    </>
  );
};

const FileTabFields = () => {
  const {values} = useFormikContext<FileComponentSchema>();
  const hasImages = hasImageMimeType(values.file.type);
  return (
    <>
      <FileName />
      <FileTypesSelect />
      <UseConfigFiletypes />
      {hasImages && <ImageResizingOptions />}
      <FileMaxSize />
      <MaxNumberOfFiles />
    </>
  );
};

export default FileTabFields;
