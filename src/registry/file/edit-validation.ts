import {IntlShape} from 'react-intl';

import {buildCommonSchema} from '@/registry/validation';

/**
 * @todo implement validations:
 *
 * - fileMaxSize must be int (bytes) or int(K|M)B (?) -> check how fileMaxSize is
 *   handled in the backend, if at all.
 * - validate fileMaxSize <= serverUploadLimit from context, if set.
 * - maxNumberOfFiles must be positive integer
 */

const schema = (intl: IntlShape) => buildCommonSchema(intl);

export default schema;
