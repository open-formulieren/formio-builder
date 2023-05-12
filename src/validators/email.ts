import {z} from 'zod';

import {ValidatorBuilder} from '.';

const builder: ValidatorBuilder<z.ZodString> = (schema: z.ZodString) => {
  return schema.email();
};

export default builder;
