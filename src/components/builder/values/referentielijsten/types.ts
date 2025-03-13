export interface ComponentWithReferentielijsten {
  openForms?: {
    dataSrc: 'referentielijsten';
    service: string;
    code: string;
  };
}

export interface ReferentielijstenServiceOption {
  url: string;
  slug: string;
  label: string;
  apiRoot: string;
  apiType: string;
}

export interface ReferentielijstenTabelOption {
  code: string;
  naam: string;
  isGeldig: boolean;
}

export interface ReferentielijstenTabelItem {
  code: string;
  naam: string;
  isGeldig: boolean;
}
