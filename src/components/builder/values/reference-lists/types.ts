export interface ComponentWithReferenceLists {
  openForms?: {
    dataSrc: 'referenceLists';
    service: string;
    code: string;
  };
}

export interface ReferenceListsServiceOption {
  url: string;
  slug: string;
  label: string;
  apiRoot: string;
  apiType: string;
}

export interface ReferenceListsTable {
  code: string;
  name: string;
  isValid: boolean;
}

export interface ReferenceListsTableItem {
  code: string;
  name: string;
  isValid: boolean;
}
