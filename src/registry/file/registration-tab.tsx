import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import useAsync from 'react-use/esm/useAsync';

import {Select, TextField} from '@/components/formio';
import {BuilderContext, DocumentTypeOption, SelectOption} from '@/context';

interface DocumentTypeOptionsGroup {
  label: string;
  options: Array<{
    value: string;
    label: string;
  }>;
}

const groupDocumentTypeOptions = (options: DocumentTypeOption[]): DocumentTypeOptionsGroup[] => {
  const optionsWithGroupLabel = options.map(item => {
    const groupLabel = [item.backendLabel, item.catalogueLabel].filter(Boolean).join(' > ');
    return {
      groupLabel,
      value: item.url,
      label: item.description,
    };
  });

  type OptGroupsMapping = Record<string, SelectOption[]>;
  const groups: OptGroupsMapping = optionsWithGroupLabel.reduce(
    (accumulator: OptGroupsMapping, optionWithGroupLabel) => {
      const {groupLabel, value, label} = optionWithGroupLabel;
      if (!accumulator[groupLabel]) {
        accumulator[groupLabel] = [];
      }
      accumulator[groupLabel].push({value, label});
      return accumulator;
    },
    {}
  );

  // now convert this mapping back to a list of opt groups
  const optGroups = Object.entries(groups).map(([groupLabel, options]) => ({
    label: groupLabel,
    options,
  }));
  return optGroups;
};

const DocumentTypeSelect: React.FC<{}> = () => {
  const intl = useIntl();
  const {getDocumentTypes} = useContext(BuilderContext);
  const {value: options, loading, error} = useAsync(async () => await getDocumentTypes(), []);
  if (error) {
    throw error;
  }

  const tooltip = intl.formatMessage({
    description: "Tooltip for 'registration.informatieobjecttype' builder field",
    defaultMessage: `Save the attachment in the Documents API with this InformatieObjectType. If
    unspecified, the registration plugin defaults are used.`,
  });

  return (
    <Select
      name="registration.informatieobjecttype"
      label={
        <FormattedMessage
          description="Label for 'registration.informatieobjecttype' builder field"
          defaultMessage="Information object type"
        />
      }
      tooltip={tooltip}
      isLoading={loading}
      isClearable
      options={groupDocumentTypeOptions(options || [])}
    />
  );
};

const SourceOrganisation = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'registration.bronorganisatie' builder field",
    defaultMessage: 'RSIN of the organization which creates the ENKELVOUDIGINFORMATIEOBJECT.',
  });

  return (
    <TextField
      name="registration.bronorganisatie"
      label={
        <FormattedMessage
          description="Label for 'registration.bronorganisatie' builder field"
          defaultMessage="Bronorganisatie"
        />
      }
      tooltip={tooltip}
      inputMode="numeric"
    />
  );
};

const ConfidentialityLevelSelect: React.FC<{}> = () => {
  const intl = useIntl();
  const {getConfidentialityLevels} = useContext(BuilderContext);
  const {
    value: options,
    loading,
    error,
  } = useAsync(async () => await getConfidentialityLevels(), []);
  if (error) {
    throw error;
  }

  const tooltip = intl.formatMessage({
    description: "Tooltip for 'registration.docVertrouwelijkheidaanduiding' builder field",
    defaultMessage:
      'Indication of the level to which extent the INFORMATIEOBJECT is meant to be public.',
  });

  return (
    <Select
      name="registration.docVertrouwelijkheidaanduiding"
      label={
        <FormattedMessage
          description="Label for 'registration.docVertrouwelijkheidaanduiding' builder field"
          defaultMessage="Confidentiality level"
        />
      }
      tooltip={tooltip}
      isLoading={loading}
      isClearable
      options={options}
      valueProperty="value"
    />
  );
};

const Title = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'registration.titel' builder field",
    defaultMessage: 'The name under which the INFORMATIEOBJECT is formally known.',
  });

  return (
    <TextField
      name="registration.titel"
      label={
        <FormattedMessage
          description="Label for 'registration.titel' builder field"
          defaultMessage="Title"
        />
      }
      tooltip={tooltip}
    />
  );
};

const RegistrationTabFields: React.FC<{}> = () => {
  return (
    <>
      <DocumentTypeSelect />
      <SourceOrganisation />
      <ConfidentialityLevelSelect />
      <Title />
    </>
  );
};

export default RegistrationTabFields;
