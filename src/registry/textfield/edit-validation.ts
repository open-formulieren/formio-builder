import {buildCommonSchema, buildPrefillSchema} from '@/registry/validation';

import type {EditSchema} from '../types';

const schema: EditSchema = ({intl}) => buildCommonSchema(intl).and(buildPrefillSchema(intl));

export default schema;
