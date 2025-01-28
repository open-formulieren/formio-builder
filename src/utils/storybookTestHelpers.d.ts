declare module '@/utils/storybookTestHelpers' {
  import {Screen} from '@testing-library/react';

  /**
   * Wrapper around selectEvent.select to ensure the portal option is used.
   *
   * @param input - The input element associated with the react-select component.
   * @param optionOrOptions - The option or options to select.
   * @returns A promise that resolves when the select event is triggered.
   */
  export function rsSelect(input: HTMLElement, optionOrOptions: string | string[]): Promise<void>;

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
  export function getReactSelectContainer(comboboxInput: HTMLElement): HTMLElement | null;

  /**
   * Get the (portaled) opened react-select menu.
   *
   * @param canvas - The canvas object from Storybook's testing-library.
   * @returns A promise that resolves to the listbox element.
   */
  export function findReactSelectMenu(canvas: Screen): Promise<HTMLElement>;
}
