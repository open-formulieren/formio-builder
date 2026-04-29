import './DragContainer.scss';

/**
 * A drag-and-drop container for components.
 *
 * This is a placeholder for now. When implementing the actual drag-and-drop,
 * this component will serve as the drop-zone.
 */
const DragContainer: React.FC<React.PropsWithChildren> = ({children}) => (
  <div className="offb-drag-container">{children}</div>
);

export default DragContainer;
