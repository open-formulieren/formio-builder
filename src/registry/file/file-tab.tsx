import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import useAsync from 'react-use/esm/useAsync';

import {Checkbox, NumberField, Select, TextField} from '@/components/formio';
import {BuilderContext} from '@/context';

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

  const {value: options, loading, error} = useAsync(async () => await getFileTypes(), []);

  if (error) {
    throw error;
  }

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
      options={options}
      valueProperty="value"
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
    defaultMessage:
      'When this is checked, the filetypes configured in the global settings will be used.',
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
      min={0}
      step={1}
    />
  );
};

const FileTabFields = () => (
  <>
    <FileName />
    <FileTypesSelect />
    <UseConfigFiletypes />
    <FileMaxSize />
    <MaxNumberOfFiles />
  </>
);

export default FileTabFields;
