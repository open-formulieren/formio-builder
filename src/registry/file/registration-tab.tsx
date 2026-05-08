import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useAsync} from 'react-use';

import {Panel, Select, TextField} from '@/components/formio';
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

/**
 * @deprecated
 */
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

/**
 * 'Modern' document type configuration.
 *
 * @todo Would be nice if the component configuration can be validated on the backend
 * for 11-proef on RSIN.
 * @todo Move this configuration out of the file component and into the plugin options,
 * as its correctness often depends on the selected case types as well, and the Catalogi
 * API to use is important context that we don't have here.
 */
const DocumentTypeConfiguration: React.FC = () => {
  const intl = useIntl();
  return (
    <Panel
      title={
        <FormattedMessage
          description="File component registration: document type configuration"
          defaultMessage="Document type"
        />
      }
      tooltip={intl.formatMessage({
        description: 'Tooltip file component registration: document type configuration',
        defaultMessage: `Specify the document type to use for the file uploads when
        sending them to the Documents API. The direct URL references are replaced with
        references to the catalogue and document type description.`,
      })}
    >
      <div className="alert alert-info">
        <FormattedMessage
          description="Description for 'registration.documentType' configuration"
          defaultMessage="Specify either none or all three of the fields below to configure the document type to use."
        />
      </div>

      <TextField
        name="registration.documentType.catalogue.domain"
        label={
          <FormattedMessage
            description="Label for 'registration.documentType.catalogue.domain' builder field"
            defaultMessage="Catalogus domain"
          />
        }
        tooltip={
          <FormattedMessage
            description="Tooltip for 'registration.documentType.catalogue.domain' builder field"
            defaultMessage="The 'domein' attribute for the Catalogus resource in the Catalogi API."
          />
        }
      />
      <TextField
        name="registration.documentType.catalogue.rsin"
        label={
          <FormattedMessage
            description="Label for 'registration.documentType.catalogue.rsin' builder field"
            defaultMessage="Catalogus RSIN"
          />
        }
        tooltip={
          <FormattedMessage
            description="Tooltip for 'registration.documentType.catalogue.rsin' builder field"
            defaultMessage="The 'rsin' attribute for the Catalogus resource in the Catalogi API."
          />
        }
      />
      <TextField
        name="registration.documentType.description"
        label={
          <FormattedMessage
            description="Label for 'registration.documentType.description' builder field"
            defaultMessage="Document type description"
          />
        }
        tooltip={
          <FormattedMessage
            description="Tooltip for 'registration.documentType.description' builder field"
            defaultMessage={`The document type will be retrieved in the specified catalogue.
            The version will automatically be selected based on the submission completion
            timestamp. When used with ZGW APIs, ensure that the document type belongs to
            the specified case type!`}
          />
        }
      />
      <Panel
        title={
          <FormattedMessage
            description="File component registration: legacy configuration"
            defaultMessage="Legacy"
          />
        }
        tooltip={intl.formatMessage({
          description: 'Tooltip file component registration: legacy document type configuration',
          defaultMessage: `The direct URL configuration is scheduled for removal. If both
          the URL and the fields above are configured, the new configuration is used.`,
        })}
        collapsible
        initialCollapsed
      >
        <DocumentTypeSelect />
      </Panel>
    </Panel>
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
    defaultMessage: 'The title for the document that is related to the case.',
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
      <DocumentTypeConfiguration />
      <SourceOrganisation />
      <ConfidentialityLevelSelect />
      <Title />
    </>
  );
};

export default RegistrationTabFields;
