/**
 * This is Formio.js 4.13.x's input mask behaviour.
 *
 * It is known to have accessibility issues because the value is set, causing some
 * screenreaders to read out the placeholders. For more information, see
 * https://giovanicamara.com/blog/accessible-input-masking/
 *
 * This functionality only exists here to achieve feature parity with the native
 * form builder, for the actual SDK/formio renderer, a better solution needs to be
 * found.
 *
 * @deprecated Do not use this (anymore) for user-facing forms.
 *
 */
// @ts-ignore there are no type definitions
import {conformToMask} from '@formio/vanilla-text-mask';
import {Utils} from 'formiojs';

export const applyInputMask = (textValue: string, mask: string) => {
  const options = {placeholderChar: '_'};
  const result = conformToMask(textValue, Utils.getInputMask(mask), options);
  return result.conformedValue;
};
