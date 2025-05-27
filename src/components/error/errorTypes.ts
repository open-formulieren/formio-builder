import {APIError} from '@/components/error/error';

export type AnyError = Error | APIError | string | object;
