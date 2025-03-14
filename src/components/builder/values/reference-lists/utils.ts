import {IntlShape} from 'react-intl';

import {ReferenceListsTable, ReferenceListsTableItem} from './types';

// Transform options to the desired shape for the options of the Select component
export function transformItems(
  items: ReferenceListsTableItem[] | ReferenceListsTable[],
  intl: IntlShape
) {
  return items.map(item => {
    const {code, naam, isGeldig} = item;
    return {
      value: code,
      label: intl.formatMessage(
        {
          description: 'Label for reference lists table or item',
          defaultMessage: '{naam}{isValid, select, true {} other { (no longer valid)}}',
        },
        {naam: naam, isValid: isGeldig}
      ),
    };
  });
}
