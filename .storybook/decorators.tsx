import React from 'react';

export const ModalDecorator = (Story, {parameters}) => {
  if (parameters?.modal?.noModal) return <Story />;
  return (
    <div className="formio-dialog formio-dialog-theme-default component-settings">
      <div className="formio-dialog-overlay"></div>
      <div className="formio-dialog-content">
        <div></div>
        <button
          aria-label="close"
          className="formio-dialog-close float-right btn btn-secondary btn-sm"
        ></button>
        <div className="component-edit-container">
          <Story />
        </div>
      </div>
    </div>
  );
};
