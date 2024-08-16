import {FormattedMessage} from 'react-intl';

import ModeToggle from '@/components/ModeToggle';

export type PreviewState = 'rich' | 'JSON';

export interface PreviewModeToggleProps {
  previewMode: PreviewState;
  setPreviewMode: (mode: PreviewState) => void;
}

const PreviewModeToggle: React.FC<PreviewModeToggleProps> = ({previewMode, setPreviewMode}) => (
  <ModeToggle<PreviewState>
    name="previewMode"
    currentMode={previewMode}
    onToggle={mode => setPreviewMode(mode)}
    modes={[
      {
        value: 'rich',
        label: (
          <FormattedMessage description="Component 'Rich' preview mode" defaultMessage="Form" />
        ),
      },
      {
        value: 'JSON',
        label: (
          <FormattedMessage description="Component 'JSON' preview mode" defaultMessage="JSON" />
        ),
      },
    ]}
  />
);

export default PreviewModeToggle;
