import uniqueId from 'lodash.uniqueid';
import React from 'react';
import {Tooltip as ReactToolTip} from 'react-tooltip';

export interface TooltipProps {
  text: string;
}

const Tooltip: React.FC<TooltipProps> = ({text}) => {
  if (!text) return null;
  const htmlId = uniqueId('editform_tooltip_');
  return (
    <>
      <i title={text} className="fa fa-question-circle text-muted" id={htmlId} />
      <ReactToolTip content={text} anchorSelect={`#${htmlId}`} place="right" clickable />
    </>
  );
};

export default Tooltip;
