import 'src/global.css';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { useScrollToTop } from './hooks/use-scroll-to-top';
import { reduxStore } from './store';
import { ThemeProvider } from './theme/theme-provider';
import { Router } from './routes/sections';
import Toast from './components/toast/toast/toast';
import NotifyModal from './components/modal/notify-modal/notify-modal';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <Provider store={reduxStore.store}>
      <PersistGate loading={null} persistor={reduxStore.persistor}>
        <ThemeProvider>
          <Toast />
          {/* <ToastCaution /> */}
          <Router />
          <NotifyModal />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
