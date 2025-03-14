export interface ComponentWithReferenceLists {
  openForms?: {
    dataSrc: 'referentielijsten';
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
  naam: string;
  isGeldig: boolean;
}

export interface ReferenceListsTableItem {
  code: string;
  naam: string;
  isGeldig: boolean;
}
