import {buildCommonSchema} from '@/registry/validation';

import type {EditSchema} from '../types';

const schema: EditSchema = ({intl}) => buildCommonSchema(intl);

export default schema;
