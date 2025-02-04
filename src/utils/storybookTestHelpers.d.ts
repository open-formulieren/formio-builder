declare module '@/utils/storybookTestHelpers' {
  import {within} from '@storybook/test';

  /**
   * Wrapper around selectEvent.select to ensure the portal option is used.
   *
   * @param canvas - The canvas where the input is present.
   * @param input - The input element associated with the react-select component.
   * @param optionOrOptions - The option or options to select.
   * @returns A promise that resolves when the select event is triggered.
   */
  export function rsSelect(
    canvas: ReturnType<typeof within>,
    input: HTMLElement,
    optionOrOptions: string | string[]
  ): Promise<void>;
}
