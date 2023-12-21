import {IntlShape} from 'react-intl';
import {z} from 'zod';

import {buildKeySchema} from '@/registry/validation';

const schema = (intl: IntlShape) => z.object({key: buildKeySchema(intl)});

export default schema;
