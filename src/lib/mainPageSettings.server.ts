import 'server-only';

import { connectDB } from '@/lib/mongodb';
import MainPageSettings from '@/models/MainPageSettings';
import { createMainPageSettingsDefaults, normalizeMainPageSettings, type MainPageSettingsSnapshot } from '@/lib/mainPageSettings';

export const getMainPageSettingsSnapshot = async (): Promise<MainPageSettingsSnapshot> => {
  try {
    await connectDB();
    const settings = await MainPageSettings.findOne().lean();

    if (!settings) {
      return createMainPageSettingsDefaults();
    }

    return normalizeMainPageSettings(settings);
  } catch (error) {
    console.error('Failed to load main page settings, falling back to defaults:', error);
    return createMainPageSettingsDefaults();
  }
};
