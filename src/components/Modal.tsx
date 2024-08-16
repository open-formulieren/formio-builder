import clsx from 'clsx';
import {createContext, useContext} from 'react';
import {FormattedMessage} from 'react-intl';
import ReactModal from 'react-modal';

export interface ModalContextType {
  parentSelector?: () => HTMLElement;
  ariaHideApp?: boolean;
}

export const ModalContext = createContext<ModalContextType>({});
ModalContext.displayName = 'ModalContext';

export interface ModalProps {
  /**
   * Modal open/close state, typically the state from `useState` in your component.
   */
  isOpen: boolean;
  /**
   * Callback to invoke when closing of the modal is requested.
   *
   * Example modal close requests:
   * - Clicking the close button
   * - Hitting `ESC` on the keyboard
   * - Clicking outside of the modal
   */
  closeModal: () => void;
  /**
   * Additional class name(s) to pass to the modal root DOM node. Optional.
   */
  className?: string;
  /**
   * Modal content.
   */
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({isOpen, closeModal, className, children}: ModalProps) => {
  const {parentSelector, ariaHideApp} = useContext(ModalContext);
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={closeModal}
      parentSelector={parentSelector}
      ariaHideApp={ariaHideApp}
      portalClassName={
        isOpen ? clsx('formio-dialog', 'formio-dialog-theme-default', className) : undefined
      }
      overlayClassName="formio-dialog-overlay"
      className="formio-dialog-content"
      overlayElement={(props, contentElement) => (
        <>
          <div {...props}></div>
          {contentElement}
        </>
      )}
    >
      <button
        type="button"
        className="formio-dialog-close float-right btn btn-secondary btn-sm"
        onClick={closeModal}
      >
        <span className="sr-only">
          <FormattedMessage description="Modal close button label" defaultMessage="Close" />
        </span>
      </button>
      {children}
    </ReactModal>
  );
};

export default Modal;
