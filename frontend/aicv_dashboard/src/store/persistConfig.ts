import storage from 'redux-persist/lib/storage';
import { createMigrate, type PersistConfig } from 'redux-persist';

// Basic migration scaffold: increment version when making breaking state changes
const migrations = {
  1: (state: any) => state,
};

const persistConfig: PersistConfig<any> = {
  key: 'root',
  storage,
  whitelist: ['theme', 'auth'],
  version: 1,
  migrate: createMigrate(migrations, { debug: false }),
};

export default persistConfig;
