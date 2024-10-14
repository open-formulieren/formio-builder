import {z} from 'zod';

import {buildKeySchema} from '@/registry/validation';

import {EditSchema} from '../types';

const schema: EditSchema = ({intl}) => z.object({key: buildKeySchema(intl)});

export default schema;
