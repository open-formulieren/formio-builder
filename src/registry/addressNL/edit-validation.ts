import {buildCommonSchema} from '@/registry/validation';

import {EditSchema} from '../types';

const schema: EditSchema = ({intl}) => buildCommonSchema(intl);

export default schema;
