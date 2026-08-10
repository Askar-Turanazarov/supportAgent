import type { Locale } from '../types/chat.types';

export interface Translations {
  headerTitle: string;
  status: { online: string; typing: string; offline: string };
  newChat: string;
  empty: { title: string; subtitle: string; quickReplies: string[] };
  input: { placeholder: string; ariaLabel: string; sendAriaLabel: string; sending: string };
  message: { retry: string; newMessages: string; typingAria: string; rate: string; rateThanks: string };
  offlineBanner: string;
  theme: { light: string; dark: string; toggleAriaToLight: string; toggleAriaToDark: string };
  language: { toggleAria: string };
  faq: { buttonAria: string; title: string; subtitle: string; closeAria: string; loading: string; error: string };
}

export const translations: Record<Locale, Translations> = {
  ru: {
    headerTitle: 'Агент поддержки',
    status: { online: 'В сети', typing: 'Печатает…', offline: 'Нет соединения' },
    newChat: 'Новый диалог',
    empty: {
      title: 'Здравствуйте! Чем можем помочь?',
      subtitle: 'Задайте вопрос в чате ниже, или выберите один из вариантов',
      quickReplies: [
        'Как оформить возврат?',
        'У меня не работает вход в аккаунт',
        'Расскажите о тарифах',
      ],
    },
    input: {
      placeholder: 'Напишите сообщение…',
      ariaLabel: 'Сообщение агенту поддержки',
      sendAriaLabel: 'Отправить сообщение',
      sending: 'Отправка…',
    },
    message: {
      retry: 'Повторить',
      newMessages: 'Новые сообщения',
      typingAria: 'Агент печатает сообщение',
      rate: 'Оцените ответ',
      rateThanks: 'Спасибо за оценку!',
    },
    offlineBanner: 'Нет подключения к интернету',
    theme: {
      light: 'Светлая',
      dark: 'Тёмная',
      toggleAriaToLight: 'Включить светлую тему',
      toggleAriaToDark: 'Включить тёмную тему',
    },
    language: { toggleAria: 'Переключить язык' },
    faq: {
      buttonAria: 'Часто задаваемые вопросы',
      title: 'Частые вопросы',
      subtitle: 'Нажмите на вопрос, чтобы отправить его в чат',
      closeAria: 'Закрыть',
      loading: 'Загрузка вопросов…',
      error: 'Не удалось загрузить вопросы',
    },
  },
  uz: {
    headerTitle: 'Qo‘llab-quvvatlash agenti',
    status: { online: 'Onlayn', typing: 'Yozmoqda…', offline: 'Aloqa yo‘q' },
    newChat: 'Yangi suhbat',
    empty: {
      title: 'Assalomu alaykum! Sizga qanday yordam bera olamiz?',
      subtitle: 'Quyida savolingizni yozing yoki variantlardan birini tanlang',
      quickReplies: [
        'Pulni qaytarish mumkinmi?',
        'Hisobga kira olmayapman',
        'Tariflar haqida ayting',
      ],
    },
    input: {
      placeholder: 'Xabar yozing…',
      ariaLabel: 'Qo‘llab-quvvatlash agentiga xabar',
      sendAriaLabel: 'Xabarni yuborish',
      sending: 'Yuborilmoqda…',
    },
    message: {
      retry: 'Qayta urinish',
      newMessages: 'Yangi xabarlar',
      typingAria: 'Agent xabar yozmoqda',
      rate: 'Javobni baholang',
      rateThanks: 'Baholaganingiz uchun rahmat!',
    },
    offlineBanner: 'Internetga ulanish yo‘q',
    theme: {
      light: 'Yorug‘',
      dark: 'Qorong‘i',
      toggleAriaToLight: 'Yorug‘ mavzuni yoqish',
      toggleAriaToDark: 'Qorong‘i mavzuni yoqish',
    },
    language: { toggleAria: 'Tilni almashtirish' },
    faq: {
      buttonAria: 'Tez-tez so‘raladigan savollar',
      title: 'Tez-tez so‘raladigan savollar',
      subtitle: 'Savolni bosing — u chatga yuboriladi',
      closeAria: 'Yopish',
      loading: 'Savollar yuklanmoqda…',
      error: 'Savollarni yuklab bo‘lmadi',
    },
  },
};

export function getTranslations(locale: Locale): Translations {
  return translations[locale];
}
