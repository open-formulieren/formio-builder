import clsx from 'clsx';

export interface Mode<T extends string> {
  value: T;
  label: React.ReactNode;
}

export interface ModeToggleProps<T extends string> {
  /**
   * Name attribute for the HTML radio inputs.
   */
  name: string;
  /**
   * Array of possible modes - a list of objects with keys `value` and `label`.
   */
  modes: Mode<T>[];
  /**
   * Value of the currently active mode.
   */
  currentMode: T;
  /**
   * Callback invoked when a particular mode is selected.
   */
  onToggle: (mode: T) => void;
  /**
   * Any additional classnames to apply to the container element.
   */
  className?: string;
  /**
   * Toggle button classname(s).
   */
  btnClassName?: string;
}

/**
 * Render a button group with the available and active modes.
 *
 * This component is generic - pass a union of the possible mode values for strict type
 * checking: `<ModeToggle<'mode1' | 'mode2'>>`
 */
function ModeToggle<T extends string>({
  name,
  modes,
  currentMode,
  onToggle,
  className,
  btnClassName = 'btn-secondary',
}: ModeToggleProps<T>) {
  return (
    <div className={clsx('btn-group', 'btn-group-toggle', className)}>
      {modes.map(({value, label}) => (
        <label className={clsx('btn', 'btn-sm', btnClassName, {active: value === currentMode})}>
          <input
            type="radio"
            name={name}
            value={value}
            autoComplete="off"
            checked={value === currentMode}
            onChange={event => onToggle(event.target.value as T)}
          />
          {label}
        </label>
      ))}
    </div>
  );
}

export default ModeToggle;
