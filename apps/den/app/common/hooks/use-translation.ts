import { useLanguage } from "../contexts/language-context.tsx";

export function useTranslation() {
  const { t, language, setLanguage } = useLanguage();
  return { t, language, setLanguage };
}
