import {userEvent, within} from '@storybook/test';

/**
 * Wrapper to select an option in a react-select component
 *
 * @param canvas - The canvas where the input is present.
 * @param input - The input element associated with the react-select component.
 * @param optionOrOptions - The option or options to select.
 */
const rsSelect = async (
  canvas: ReturnType<typeof within>,
  input: HTMLElement,
  optionOrOptions: string | string[]
): Promise<void> => {
  await userEvent.click(input);
  await userEvent.click(await canvas.findByText(optionOrOptions));
};

export {rsSelect};
