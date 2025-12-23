import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import ColorEditorView from './color-palette-view';

// ----------------------------------------------------------------------

export default function ColorPalettePage() {
  return (
    <>
      <Helmet>
        <title> {`Color Palette - ${CONFIG.appName}`}</title>
      </Helmet>

      <ColorEditorView />
    </>
  );
}
