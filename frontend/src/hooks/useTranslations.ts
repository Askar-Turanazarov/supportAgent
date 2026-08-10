import { useSettingsStore } from '../store/settingsStore';
import { getTranslations } from '../i18n/translations';

export function useTranslations() {
  const locale = useSettingsStore((s) => s.locale);
  return { t: getTranslations(locale), locale };
}
