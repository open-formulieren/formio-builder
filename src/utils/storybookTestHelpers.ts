import {ByRoleOptions, Screen} from '@testing-library/react';
import selectEvent from 'react-select-event';

const SB_ROOT: HTMLElement | null = document.getElementById('storybook-root');

/**
 * Wrapper around selectEvent.select to ensure the portal option is used.
 *
 * @param input - The input element associated with the react-select component.
 * @param optionOrOptions - The option or options to select.
 */
const rsSelect = async (input: HTMLElement, optionOrOptions: string | string[]): Promise<void> => {
  if (!SB_ROOT) {
    throw new Error('storybook-root element not found in the DOM.');
  }
  await selectEvent.select(input, optionOrOptions, {container: SB_ROOT});
};

/**
 * From the input field (retrieved by accessible queries), find the react-select container.
 *
 * Usage:
 *
 * const dropdown = canvas.getByLabelText('My dropdown');
 * const container = getReactSelectContainer(dropdown);
 * const options = within(container).queryByRole('option');
 *
 * @param comboboxInput - The combobox input element.
 * @returns The react-select container element or null if not found.
 */
const getReactSelectContainer = (comboboxInput: HTMLElement): HTMLElement | null => {
  return comboboxInput.closest('.admin-react-select');
};

/**
 * Get the (portaled) opened react-select menu.
 *
 * @param canvas - The canvas object from Storybook's testing-library.
 * @param options - Optional options for querying the listbox.
 * @returns A promise that resolves to the listbox element.
 */
const findReactSelectMenu = async (
  canvas: Screen,
  options?: ByRoleOptions
): Promise<HTMLElement> => {
  return await canvas.findByRole('listbox', options);
};

export {rsSelect, getReactSelectContainer, findReactSelectMenu};
