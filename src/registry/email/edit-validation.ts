import {IntlShape} from 'react-intl';
import {
  ErrorMapCtx,
  ZodErrorMap,
  ZodInvalidStringIssue,
  ZodIssueOptionalMessage,
  literal,
  object,
  string,
} from 'zod';

const isInvalidStringIssue = (issue: ZodIssueOptionalMessage): issue is ZodInvalidStringIssue => {
  return issue.code === 'invalid_string';
};

type ErrorBuilder = (issue: ZodIssueOptionalMessage, ctx: ErrorMapCtx) => string | void;

const getErrorMap = (builder: ErrorBuilder): ZodErrorMap => {
  const errorMap = (issue: ZodIssueOptionalMessage, ctx: ErrorMapCtx) => {
    const message = builder(issue, ctx);
    if (message) {
      return {message};
    }
    return {message: ctx.defaultError};
  };
  return errorMap;
};

const Email = string().email();
const SingleEmail = object({
  multiple: literal(false),
}).and(object({defaultValue: Email}));
const MultipleEmail = object({
  multiple: literal(true),
}).and(object({defaultValue: Email.array()}));

const DefaultValue = SingleEmail.or(MultipleEmail);

const schema = (intl: IntlShape) =>
  object({
    label: string({
      errorMap: getErrorMap((issue, ctx) => {
        const isRequiredError = issue.code === 'invalid_type' && ctx.data === undefined;
        if (isRequiredError) {
          return intl.formatMessage({
            description: "Form builder label field 'required' validation error",
            defaultMessage: 'Label is a required field.',
          });
        }
        return;
      }),
    }),
    key: string({
      errorMap: getErrorMap(issue => {
        if (isInvalidStringIssue(issue) && issue.validation === 'regex') {
          return intl.formatMessage({
            description: "Form builder 'key' pattern validation error",
            defaultMessage:
              'The property name must only contain alphanumeric characters, underscores, dots and dashes and should not be ended by dash or dot.',
          });
        }
        return;
      }),
    }).regex(new RegExp('^(\\w|\\w[\\w-.]*\\w)$')),
  }).and(DefaultValue);

export default schema;
