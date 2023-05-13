import {IntlShape} from 'react-intl';

import {buildCommonSchema} from '@/registry/validation';

const schema = (intl: IntlShape) => buildCommonSchema(intl);

export default schema;
