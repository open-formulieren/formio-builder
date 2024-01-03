/**
 * Implements a tooltip using float-ui.
 *
 * Guide from https://floating-ui.com/docs/tooltip.
 */
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import {useState} from 'react';

export interface TooltipProps {
  text: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({text}) => {
  const [isOpen, setIsOpen] = useState(false);

  const {refs, floatingStyles, context} = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
    placement: 'right',
  });

  const hover = useHover(context, {
    move: false,
    delay: {
      open: 0,
      close: 100,
    },
  });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, {role: 'label'});

  const {getReferenceProps, getFloatingProps} = useInteractions([hover, focus, dismiss, role]);

  if (!text) return null;

  return (
    <>
      <i
        ref={refs.setReference}
        className="fa fa-question-circle text-muted"
        tabIndex={0}
        {...getReferenceProps()}
      />
      {isOpen && (
        <div
          ref={refs.setFloating}
          style={{
            maxInlineSize: 'var(--of-builder-tooltip-max-inline-size, 200px)',
            padding: 'var(--of-builder-tooltip-padding, 0.25rem 0.5rem)',
            color: 'var(--of-builder-tooltip-color, #fff)',
            textAlign: 'center',
            backgroundColor: 'var(--of-builder-tooltip-background-color, #000)',
            borderRadius: 'var(--of-builder-tooltip-border-radius, 0.25rem)',
            zIndex: 1,
            ...floatingStyles,
          }}
          {...getFloatingProps()}
        >
          {text}
        </div>
      )}
    </>
  );
};

export default Tooltip;
