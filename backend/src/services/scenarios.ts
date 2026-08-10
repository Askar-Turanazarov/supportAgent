import type { Locale } from '../types.js';

export type ScenarioCategory = 'account' | 'billing' | 'technical' | 'team' | 'other' | 'conversational';

export interface ScenarioTexts {
  keywords: string[];
  responses: string[];
  /** Естественная формулировка вопроса — используется в разделе FAQ. */
  question: string;
}

export interface Scenario {
  id: string;
  category: ScenarioCategory;
  ru: ScenarioTexts;
  uz: ScenarioTexts;
}

export const CATEGORY_ORDER: Exclude<ScenarioCategory, 'conversational'>[] = [
  'account',
  'billing',
  'technical',
  'team',
  'other',
];

export const CATEGORY_LABELS: Record<Locale, Record<Exclude<ScenarioCategory, 'conversational'>, string>> = {
  ru: {
    account: 'Аккаунт и безопасность',
    billing: 'Оплата и подписка',
    technical: 'Технические вопросы',
    team: 'Команда и доступ',
    other: 'Разное',
  },
  uz: {
    account: 'Hisob va xavfsizlik',
    billing: 'To‘lov va obuna',
    technical: 'Texnik savollar',
    team: 'Jamoa va kirish huquqlari',
    other: 'Boshqa',
  },
};

/**
 * Банк типичных сценариев поддержки для mock-режима. Каждый сценарий
 * сопоставляется с сообщением пользователя по вхождению ключевых слов —
 * побеждает сценарий с наибольшим числом совпадений. Сценарии с category
 * !== 'conversational' также показываются в разделе FAQ.
 */
export const scenarios: Scenario[] = [
  {
    id: 'greeting',
    category: 'conversational',
    ru: {
      keywords: ['привет', 'здравствуйте', 'добрый день', 'добрый вечер', 'доброе утро', 'хай', 'приветствую'],
      responses: [
        'Здравствуйте! Я агент поддержки. Расскажите, пожалуйста, что случилось — постараюсь помочь.',
        'Добрый день! Чем могу быть полезен?',
      ],
      question: 'Поздороваться',
    },
    uz: {
      keywords: ['salom', 'assalomu alaykum', 'xayrli kun', 'xayrli tong', 'xayrli kech'],
      responses: [
        'Assalomu alaykum! Men qo‘llab-quvvatlash agentiman. Nima bo‘lganini ayting, yordam berishga harakat qilaman.',
        'Xayrli kun! Sizga qanday yordam bera olaman?',
      ],
      question: 'Salomlashish',
    },
  },
  {
    id: 'farewell_thanks',
    category: 'conversational',
    ru: {
      keywords: ['спасибо', 'благодарю', 'спс', 'пока', 'до свидания', 'всё понятно', 'все понятно'],
      responses: [
        'Пожалуйста! Если появятся ещё вопросы — я на связи.',
        'Рад был помочь. Хорошего дня!',
        'Всегда пожалуйста. Обращайтесь, если понадобится ещё что-то.',
      ],
      question: 'Поблагодарить агента',
    },
    uz: {
      keywords: ['rahmat', 'tashakkur', 'xayr', 'ko‘rishguncha', 'tushunarli'],
      responses: [
        'Arzimaydi! Yana savollar bo‘lsa, men shu yerdaman.',
        'Yordam bera olganimdan xursandman. Kuningiz yaxshi o‘tsin!',
        'Doim marhamat. Yana biror narsa kerak bo‘lsa, murojaat qiling.',
      ],
      question: 'Agentga rahmat aytish',
    },
  },
  {
    id: 'password_reset',
    category: 'account',
    ru: {
      keywords: ['забыл пароль', 'сбросить пароль', 'восстановить пароль', 'не помню пароль', 'reset password'],
      responses: [
        'Чтобы сбросить пароль, нажмите «Забыли пароль?» на странице входа и укажите email, привязанный к аккаунту — мы вышлем ссылку для сброса. Ссылка действует 30 минут.',
      ],
      question: 'Как сбросить забытый пароль?',
    },
    uz: {
      keywords: ['parolni unutdim', 'parolni tiklash', 'parolni eslay olmayapman', 'parolni qayta tiklash'],
      responses: [
        'Parolni tiklash uchun kirish sahifasida "Parolni unutdingizmi?" tugmasini bosing va hisobingizga bog‘langan email manzilni kiriting — sizga tiklash havolasi yuboriladi. Havola 30 daqiqa amal qiladi.',
      ],
      question: 'Unutilgan parolni qanday tiklash mumkin?',
    },
  },
  {
    id: 'password_change_loggedin',
    category: 'account',
    ru: {
      keywords: ['изменить пароль', 'сменить пароль', 'поменять пароль'],
      responses: [
        'Пароль можно поменять в разделе «Настройки» → «Безопасность» → «Изменить пароль». Потребуется ввести текущий пароль и новый дважды.',
      ],
      question: 'Как изменить пароль в аккаунте?',
    },
    uz: {
      keywords: ['parolni o‘zgartirish', 'parolni almashtirish'],
      responses: [
        'Parolni "Sozlamalar" → "Xavfsizlik" → "Parolni o‘zgartirish" bo‘limida almashtirishingiz mumkin. Joriy parol va yangi parolni ikki marta kiritish talab qilinadi.',
      ],
      question: 'Hisobdagi parolni qanday o‘zgartirish mumkin?',
    },
  },
  {
    id: 'login_issues',
    category: 'account',
    ru: {
      keywords: ['не работает вход', 'не могу войти', 'вход в аккаунт', 'не получается зайти', 'проблема со входом', 'не входит'],
      responses: [
        'Уточните, пожалуйста: какое сообщение об ошибке вы видите при входе? Также проверьте, не включён ли Caps Lock и правильно ли указан email. Если ошибка повторяется — попробуйте очистить кеш браузера или зайти через приложение.',
      ],
      question: 'Не работает вход в аккаунт, что делать?',
    },
    uz: {
      keywords: ['hisobga kira olmayapman', 'kirish ishlamayapti', 'tizimga kira olmayapman', 'kirishda muammo'],
      responses: [
        'Iltimos, aniqlashtiring: kirishda qanday xatolik xabari chiqyapti? Shuningdek, Caps Lock yoqilmaganini va email to‘g‘ri kiritilganini tekshiring. Xatolik takrorlansa — brauzer keshini tozalab yoki ilova orqali kirib ko‘ring.',
      ],
      question: 'Hisobga kira olmayapman, nima qilish kerak?',
    },
  },
  {
    id: 'account_locked',
    category: 'account',
    ru: {
      keywords: ['аккаунт заблокирован', 'заблокировали аккаунт', 'учётная запись заблокирована', 'бан аккаунта'],
      responses: [
        'Аккаунт мог быть временно заблокирован из-за нескольких неудачных попыток входа — обычно блокировка снимается автоматически через 15 минут. Если доступ так и не восстановился, напишите email аккаунта, и я передам обращение специалисту по безопасности.',
      ],
      question: 'Почему заблокирован мой аккаунт?',
    },
    uz: {
      keywords: ['hisobim bloklangan', 'hisob bloklandi', 'akkount bloklangan'],
      responses: [
        'Hisob bir necha muvaffaqiyatsiz kirish urinishi tufayli vaqtincha bloklangan bo‘lishi mumkin — odatda blokirovka 15 daqiqadan so‘ng avtomatik olib tashlanadi. Agar kirish tiklanmasa, hisobingiz emailini yozing, men murojaatni xavfsizlik mutaxassisiga yuboraman.',
      ],
      question: 'Nega hisobim bloklangan?',
    },
  },
  {
    id: 'two_factor_auth',
    category: 'account',
    ru: {
      keywords: ['двухфакторн', '2fa', 'код подтверждения', 'смс код не приходит', 'аутентификатор'],
      responses: [
        'Если код двухфакторной аутентификации не приходит — проверьте раздел «Спам» в почте или задержку SMS у оператора. Также можно использовать резервные коды, которые выдавались при включении 2FA. Если коды утеряны — потребуется подтверждение личности для отключения 2FA.',
      ],
      question: 'Не приходит код двухфакторной аутентификации',
    },
    uz: {
      keywords: ['ikki bosqichli', '2fa', 'tasdiqlash kodi', 'sms kod kelmayapti', 'autentifikator'],
      responses: [
        'Agar ikki bosqichli autentifikatsiya kodi kelmasa — pochtangizdagi "Spam" bo‘limini yoki operatoringizdagi SMS kechikishini tekshiring. Shuningdek, 2FA yoqilganda berilgan zaxira kodlardan foydalanishingiz mumkin. Kodlar yo‘qolgan bo‘lsa — 2FA ni o‘chirish uchun shaxsni tasdiqlash talab qilinadi.',
      ],
      question: 'Ikki bosqichli autentifikatsiya kodi kelmayapti',
    },
  },
  {
    id: 'change_email',
    category: 'account',
    ru: {
      keywords: ['изменить email', 'сменить почту', 'поменять email', 'привязать другую почту'],
      responses: [
        'Email можно изменить в разделе «Настройки» → «Профиль» → «Email». После смены на новый адрес придёт письмо для подтверждения — без подтверждения адрес не обновится.',
      ],
      question: 'Как изменить email аккаунта?',
    },
    uz: {
      keywords: ['email o‘zgartirish', 'pochtani almashtirish', 'emailni almashtirish'],
      responses: [
        'Emailni "Sozlamalar" → "Profil" → "Email" bo‘limida o‘zgartirishingiz mumkin. Yangi manzilga tasdiqlash xati yuboriladi — tasdiqlanmaguncha manzil yangilanmaydi.',
      ],
      question: 'Hisob emailini qanday o‘zgartirish mumkin?',
    },
  },
  {
    id: 'change_phone',
    category: 'account',
    ru: {
      keywords: ['изменить номер телефона', 'сменить телефон', 'поменять номер'],
      responses: [
        'Номер телефона обновляется в «Настройки» → «Профиль» → «Телефон». На новый номер придёт SMS с кодом подтверждения.',
      ],
      question: 'Как изменить номер телефона?',
    },
    uz: {
      keywords: ['telefon raqamini o‘zgartirish', 'raqamni almashtirish'],
      responses: [
        'Telefon raqami "Sozlamalar" → "Profil" → "Telefon" bo‘limida yangilanadi. Yangi raqamga tasdiqlash kodi bilan SMS yuboriladi.',
      ],
      question: 'Telefon raqamini qanday o‘zgartirish mumkin?',
    },
  },
  {
    id: 'delete_account',
    category: 'account',
    ru: {
      keywords: ['удалить аккаунт', 'удаление аккаунта', 'закрыть аккаунт', 'деактивировать аккаунт'],
      responses: [
        'Удалить аккаунт можно в «Настройки» → «Конфиденциальность» → «Удалить аккаунт». Учтите: это действие необратимо, все данные будут удалены в течение 30 дней. Если хотите — можно временно деактивировать аккаунт вместо полного удаления.',
      ],
      question: 'Как удалить аккаунт?',
    },
    uz: {
      keywords: ['hisobni o‘chirish', 'akkountni o‘chirish', 'hisobni yopish', 'hisobni faolsizlantirish'],
      responses: [
        'Hisobni "Sozlamalar" → "Maxfiylik" → "Hisobni o‘chirish" bo‘limida o‘chirishingiz mumkin. E’tibor bering: bu amalni qaytarib bo‘lmaydi, barcha ma’lumotlar 30 kun ichida o‘chiriladi. Xohlasangiz, to‘liq o‘chirish o‘rniga hisobni vaqtincha faolsizlantirishingiz mumkin.',
      ],
      question: 'Hisobni qanday o‘chirish mumkin?',
    },
  },
  {
    id: 'data_privacy',
    category: 'account',
    ru: {
      keywords: ['мои данные', 'безопасность данных', 'конфиденциальность', 'данные передаются третьим лицам', 'gdpr'],
      responses: [
        'Мы храним данные в зашифрованном виде и не передаём их третьим лицам без вашего согласия. Полную выгрузку своих данных можно запросить в «Настройки» → «Конфиденциальность» → «Экспорт данных».',
      ],
      question: 'Насколько безопасно хранятся мои данные?',
    },
    uz: {
      keywords: ['mening ma‘lumotlarim', 'maʼlumotlar xavfsizligi', 'maxfiylik', 'gdpr'],
      responses: [
        'Ma’lumotlaringizni shifrlangan holda saqlaymiz va sizning roziligingizsiz uchinchi shaxslarga bermaymiz. Barcha ma’lumotlaringiz nusxasini "Sozlamalar" → "Maxfiylik" → "Ma’lumotlarni eksport qilish" bo‘limida so‘rashingiz mumkin.',
      ],
      question: 'Ma’lumotlarim qanchalik xavfsiz saqlanadi?',
    },
  },
  {
    id: 'refund_request',
    category: 'billing',
    ru: {
      keywords: ['возврат', 'вернуть деньги', 'возврат средств', 'верните деньги'],
      responses: [
        'Чтобы оформить возврат, укажите, пожалуйста, номер заказа или дату списания — проверю условия тарифа. Обычно возврат за неиспользованный период оформляется в течение 5–7 рабочих дней на исходный способ оплаты.',
      ],
      question: 'Как оформить возврат средств?',
    },
    uz: {
      keywords: ['pulni qaytarish', 'pul qaytarish', 'pulimni qaytaring', 'to‘lovni qaytarish'],
      responses: [
        'Pulni qaytarish uchun buyurtma raqami yoki yechib olingan sana kiriting — tarif shartlarini tekshiraman. Odatda ishlatilmagan davr uchun pul 5–7 ish kuni ichida to‘lov amalga oshirilgan usulga qaytariladi.',
      ],
      question: 'Pulni qaytarish mumkinmi?',
    },
  },
  {
    id: 'cancel_subscription',
    category: 'billing',
    ru: {
      keywords: ['отменить подписку', 'отписаться', 'отмена подписки', 'закрыть подписку'],
      responses: [
        'Отменить подписку можно в «Настройки» → «Подписка» → «Отменить автопродление». Доступ к оплаченным функциям сохранится до конца текущего периода, повторное списание больше не произойдёт.',
      ],
      question: 'Как отменить подписку?',
    },
    uz: {
      keywords: ['obunani bekor qilish', 'obunadan chiqish', 'obunani to‘xtatish'],
      responses: [
        'Obunani "Sozlamalar" → "Obuna" → "Avtomatik yangilashni bekor qilish" bo‘limida bekor qilishingiz mumkin. To‘langan funksiyalarga kirish joriy davr oxirigacha saqlanadi, keyingi yechib olish amalga oshmaydi.',
      ],
      question: 'Obunani qanday bekor qilish mumkin?',
    },
  },
  {
    id: 'upgrade_plan',
    category: 'billing',
    ru: {
      keywords: ['повысить тариф', 'перейти на старший тариф', 'апгрейд тарифа', 'увеличить тариф'],
      responses: [
        'Перейти на более высокий тариф можно в «Настройки» → «Подписка» → «Изменить план». Разница в стоимости за оставшийся период будет рассчитана пропорционально и списана сразу.',
      ],
      question: 'Как перейти на более высокий тариф?',
    },
    uz: {
      keywords: ['tarifni oshirish', 'yuqori tarifga o‘tish', 'tarifni yangilash'],
      responses: [
        'Yuqori tarifga "Sozlamalar" → "Obuna" → "Rejani o‘zgartirish" bo‘limidan o‘tishingiz mumkin. Qolgan davr uchun narx farqi proporsional hisoblanadi va darhol yechib olinadi.',
      ],
      question: 'Yuqori tarifga qanday o‘tish mumkin?',
    },
  },
  {
    id: 'downgrade_plan',
    category: 'billing',
    ru: {
      keywords: ['понизить тариф', 'перейти на младший тариф', 'даунгрейд', 'уменьшить тариф'],
      responses: [
        'Понизить тариф можно там же, в «Настройки» → «Подписка» → «Изменить план». Изменение вступит в силу с начала следующего платёжного периода, доплата не потребуется.',
      ],
      question: 'Как перейти на более низкий тариф?',
    },
    uz: {
      keywords: ['tarifni pasaytirish', 'pastroq tarifga o‘tish', 'tarifni tushirish'],
      responses: [
        'Tarifni "Sozlamalar" → "Obuna" → "Rejani o‘zgartirish" bo‘limida pasaytirishingiz mumkin. O‘zgarish keyingi to‘lov davri boshidan kuchga kiradi, qo‘shimcha to‘lov talab qilinmaydi.',
      ],
      question: 'Pastroq tarifga qanday o‘tish mumkin?',
    },
  },
  {
    id: 'payment_failed',
    category: 'billing',
    ru: {
      keywords: ['платёж не прошёл', 'платеж не прошел', 'карта отклонена', 'оплата не проходит', 'ошибка оплаты'],
      responses: [
        'Платёж мог не пройти из-за недостатка средств, ограничений банка на онлайн-платежи или истёкшего срока карты. Попробуйте другую карту или способ оплаты в разделе «Настройки» → «Способы оплаты».',
      ],
      question: 'Платёж не прошёл — что делать?',
    },
    uz: {
      keywords: ['to‘lov o‘tmadi', 'karta rad etildi', 'to‘lovda xatolik'],
      responses: [
        'To‘lov mablag‘ yetishmovchiligi, bankning onlayn to‘lovlarga cheklovi yoki karta muddati tugagani sababli o‘tmagan bo‘lishi mumkin. "Sozlamalar" → "To‘lov usullari" bo‘limida boshqa karta yoki usulni sinab ko‘ring.',
      ],
      question: 'To‘lov o‘tmadi — nima qilish kerak?',
    },
  },
  {
    id: 'invoice_request',
    category: 'billing',
    ru: {
      keywords: ['счёт', 'счет на оплату', 'квитанция', 'чек об оплате', 'нужен счёт'],
      responses: [
        'Все чеки и счета доступны в разделе «Настройки» → «Подписка» → «История платежей». Там же можно скачать PDF-версию для бухгалтерии.',
      ],
      question: 'Где найти счёт или чек об оплате?',
    },
    uz: {
      keywords: ['hisob-faktura', 'to‘lov kvitansiyasi', 'chek kerak'],
      responses: [
        'Barcha cheklar va hisob-fakturalar "Sozlamalar" → "Obuna" → "To‘lovlar tarixi" bo‘limida mavjud. U yerdan buxgalteriya uchun PDF versiyasini yuklab olishingiz mumkin.',
      ],
      question: 'Hisob-faktura yoki chekni qayerdan topsam bo‘ladi?',
    },
  },
  {
    id: 'pricing_question',
    category: 'billing',
    ru: {
      keywords: ['тариф', 'тарифы', 'стоимость подписки', 'сколько стоит', 'цена'],
      responses: [
        'У нас есть три тарифа: «Базовый» — для личного использования, «Про» — для небольших команд с расширенными лимитами, и «Бизнес» — с приоритетной поддержкой и SSO. Актуальные цены смотрите в разделе «Тарифы» в приложении — они зависят от региона и периода оплаты.',
      ],
      question: 'Какие у вас тарифы и сколько они стоят?',
    },
    uz: {
      keywords: ['tarif', 'tariflar', 'obuna narxi', 'narxi qancha', 'narx'],
      responses: [
        'Bizda uchta tarif mavjud: «Boshlang‘ich» — shaxsiy foydalanish uchun, «Pro» — kengaytirilgan limitli kichik jamoalar uchun, va «Biznes» — ustuvor qo‘llab-quvvatlash va SSO bilan. Joriy narxlarni ilovadagi «Tariflar» bo‘limidan ko‘rishingiz mumkin — ular hudud va to‘lov davriga bog‘liq.',
      ],
      question: 'Tariflaringiz qanday va narxi qancha?',
    },
  },
  {
    id: 'free_trial_question',
    category: 'billing',
    ru: {
      keywords: ['пробный период', 'бесплатный период', 'триал', 'trial'],
      responses: [
        'Пробный период длится 14 дней и даёт доступ ко всем функциям тарифа «Про». Карта на этапе регистрации не требуется — оплата понадобится только при переходе на платный тариф.',
      ],
      question: 'Как работает бесплатный пробный период?',
    },
    uz: {
      keywords: ['sinov muddati', 'bepul davr', 'trial'],
      responses: [
        'Sinov muddati 14 kun davom etadi va «Pro» tarifining barcha funksiyalariga kirish imkonini beradi. Ro‘yxatdan o‘tishda karta talab qilinmaydi — to‘lov faqat pullik tarifga o‘tganda kerak bo‘ladi.',
      ],
      question: 'Bepul sinov muddati qanday ishlaydi?',
    },
  },
  {
    id: 'cancel_trial',
    category: 'billing',
    ru: {
      keywords: ['отменить пробный период', 'отменить триал', 'не хочу платить после пробного'],
      responses: [
        'Чтобы пробный период не перешёл в платную подписку, отключите автопродление в «Настройки» → «Подписка» до окончания 14 дней — списание не произойдёт.',
      ],
      question: 'Как отменить пробный период, чтобы не списали деньги?',
    },
    uz: {
      keywords: ['sinov muddatini bekor qilish', 'trialdan voz kechish', 'pul yechib olinmasligi'],
      responses: [
        'Sinov muddati pullik obunaga o‘tib ketmasligi uchun 14 kun tugashidan oldin "Sozlamalar" → "Obuna" bo‘limida avtomatik yangilashni o‘chiring — hech qanday yechib olish bo‘lmaydi.',
      ],
      question: 'Pul yechib olinmasligi uchun sinov muddatini qanday bekor qilish mumkin?',
    },
  },
  {
    id: 'app_crash',
    category: 'technical',
    ru: {
      keywords: ['приложение вылетает', 'приложение крашится', 'вылетает приложение', 'закрывается само'],
      responses: [
        'Жаль это слышать. Попробуйте обновить приложение до последней версии и перезапустить устройство — это решает большинство подобных случаев. Если проблема останется, напишите модель устройства и версию ОС — передам в техническую команду.',
      ],
      question: 'Приложение постоянно вылетает',
    },
    uz: {
      keywords: ['ilova o‘chib qolyapti', 'ilova ishlamay qolyapti', 'ilova yopilib qolyapti'],
      responses: [
        'Buni eshitish achinarli. Ilovani so‘nggi versiyaga yangilab, qurilmani qayta ishga tushirib ko‘ring — bu ko‘pchilik shunga o‘xshash holatlarni hal qiladi. Muammo qolsa, qurilma modeli va OS versiyasini yozing — texnik jamoaga uzataman.',
      ],
      question: 'Ilova doim o‘chib qolyapti',
    },
  },
  {
    id: 'app_slow',
    category: 'technical',
    ru: {
      keywords: ['приложение тормозит', 'медленно работает', 'зависает', 'долго грузится'],
      responses: [
        'Скорость может снижаться из-за нестабильного интернета или большого объёма кэша. Попробуйте очистить кэш приложения в настройках устройства и проверить соединение. Если тормозит именно веб-версия — попробуйте другой браузер.',
      ],
      question: 'Приложение работает медленно',
    },
    uz: {
      keywords: ['ilova sekin ishlayapti', 'sekin yuklanmoqda', 'osilib qolyapti'],
      responses: [
        'Tezlik beqaror internet yoki keshning katta hajmi tufayli pasayishi mumkin. Qurilma sozlamalarida ilova keshini tozalab, ulanishni tekshirib ko‘ring. Agar aynan veb-versiya sekin ishlasa — boshqa brauzerda sinab ko‘ring.',
      ],
      question: 'Ilova sekin ishlayapti',
    },
  },
  {
    id: 'sync_issues',
    category: 'technical',
    ru: {
      keywords: ['не синхронизируется', 'синхронизация не работает', 'данные не обновляются на другом устройстве'],
      responses: [
        'Проверьте, что на всех устройствах включена синхронизация в «Настройки» → «Синхронизация» и используется один и тот же аккаунт. Если данные всё равно расходятся, попробуйте выйти и снова войти в аккаунт на проблемном устройстве.',
      ],
      question: 'Данные не синхронизируются между устройствами',
    },
    uz: {
      keywords: ['sinxronlanmayapti', 'sinxronizatsiya ishlamayapti', 'boshqa qurilmada yangilanmayapti'],
      responses: [
        'Barcha qurilmalarda "Sozlamalar" → "Sinxronizatsiya" yoqilganini va bir xil hisob ishlatilayotganini tekshiring. Ma’lumotlar baribir mos kelmasa, muammoli qurilmada hisobdan chiqib, qayta kiring.',
      ],
      question: 'Ma’lumotlar qurilmalar orasida sinxronlanmayapti',
    },
  },
  {
    id: 'feature_request',
    category: 'other',
    ru: {
      keywords: ['предложение по функции', 'добавьте функцию', 'не хватает функции', 'фича', 'предложить идею'],
      responses: [
        'Спасибо за идею! Передам её команде продукта — мы регулярно собираем такие предложения и учитываем их при планировании обновлений. Если хотите, распишите чуть подробнее, как именно вы бы использовали эту функцию.',
      ],
      question: 'Хочу предложить новую функцию',
    },
    uz: {
      keywords: ['funksiya taklifi', 'funksiya qo‘shing', 'funksiya yetishmayapti', 'g‘oya taklif qilish'],
      responses: [
        'G‘oyangiz uchun rahmat! Buni mahsulot jamoasiga yetkazaman — biz bunday takliflarni muntazam yig‘amiz va yangilanishlarni rejalashtirishda hisobga olamiz. Xohlasangiz, bu funksiyadan qanday foydalanishingizni batafsilroq yozing.',
      ],
      question: 'Yangi funksiya taklif qilmoqchiman',
    },
  },
  {
    id: 'export_data',
    category: 'technical',
    ru: {
      keywords: ['экспорт данных', 'выгрузить данные', 'скачать мои данные', 'экспортировать'],
      responses: [
        'Экспортировать данные можно в «Настройки» → «Конфиденциальность» → «Экспорт данных». Архив в формате CSV/JSON придёт на почту в течение нескольких часов.',
      ],
      question: 'Как экспортировать свои данные?',
    },
    uz: {
      keywords: ['ma‘lumotlarni eksport qilish', 'ma‘lumotlarni yuklab olish', 'eksport qilish'],
      responses: [
        'Ma’lumotlarni "Sozlamalar" → "Maxfiylik" → "Ma’lumotlarni eksport qilish" bo‘limida eksport qilishingiz mumkin. CSV/JSON formatidagi arxiv bir necha soat ichida pochtangizga keladi.',
      ],
      question: 'O‘z ma’lumotlarimni qanday eksport qilsam bo‘ladi?',
    },
  },
  {
    id: 'import_data',
    category: 'technical',
    ru: {
      keywords: ['импорт данных', 'загрузить данные', 'перенести данные из другого сервиса'],
      responses: [
        'Импорт доступен в «Настройки» → «Импорт данных» — поддерживаются файлы CSV и форматы основных конкурентов. Перед загрузкой рекомендуем сверить структуру колонок с шаблоном на странице импорта.',
      ],
      question: 'Как импортировать данные из другого сервиса?',
    },
    uz: {
      keywords: ['ma‘lumotlarni import qilish', 'ma‘lumot yuklash', 'boshqa xizmatdan ko‘chirish'],
      responses: [
        'Import "Sozlamalar" → "Ma’lumotlarni import qilish" bo‘limida mavjud — CSV fayllar va asosiy raqobatchilarning formatlari qo‘llab-quvvatlanadi. Yuklashdan oldin ustunlar tuzilishini import sahifasidagi shablon bilan solishtirib ko‘rishni tavsiya qilamiz.',
      ],
      question: 'Boshqa xizmatdan ma’lumotlarni qanday import qilsam bo‘ladi?',
    },
  },
  {
    id: 'mobile_web_diff',
    category: 'technical',
    ru: {
      keywords: ['разница между приложением и сайтом', 'мобильная версия отличается', 'в приложении нет функции'],
      responses: [
        'Мобильное приложение и веб-версия синхронизированы по основным функциям, но некоторые расширенные инструменты (например, массовое редактирование) пока доступны только в веб-версии — мы постепенно добавляем их и в приложение.',
      ],
      question: 'Чем отличается мобильное приложение от веб-версии?',
    },
    uz: {
      keywords: ['ilova va sayt farqi', 'mobil versiya boshqacha', 'ilovada funksiya yo‘q'],
      responses: [
        'Mobil ilova va veb-versiya asosiy funksiyalar bo‘yicha sinxronlangan, ammo ba’zi kengaytirilgan vositalar (masalan, ommaviy tahrirlash) hozircha faqat veb-versiyada mavjud — biz ularni asta-sekin ilovaga ham qo‘shib boryapmiz.',
      ],
      question: 'Mobil ilova veb-versiyadan nimasi bilan farq qiladi?',
    },
  },
  {
    id: 'api_integration',
    category: 'technical',
    ru: {
      keywords: ['api ключ', 'интеграция', 'webhook', 'документация api'],
      responses: [
        'API-ключ можно создать в «Настройки» → «Разработчикам» → «API-ключи». Полная документация с примерами запросов доступна по ссылке в том же разделе. Для вебхуков лимит — до 10 эндпоинтов на аккаунт.',
      ],
      question: 'Как получить API-ключ для интеграции?',
    },
    uz: {
      keywords: ['api kalit', 'integratsiya', 'webhook', 'api hujjatlari'],
      responses: [
        'API kalitni "Sozlamalar" → "Dasturchilar uchun" → "API kalitlar" bo‘limida yaratishingiz mumkin. So‘rov namunalari bilan to‘liq hujjat shu bo‘limdagi havolada mavjud. Webhooklar uchun limit — bir hisobga 10 tagacha endpoint.',
      ],
      question: 'Integratsiya uchun API kalitni qanday olsam bo‘ladi?',
    },
  },
  {
    id: 'notification_settings',
    category: 'other',
    ru: {
      keywords: ['отключить уведомления', 'настроить уведомления', 'много уведомлений', 'push-уведомления'],
      responses: [
        'Уведомления настраиваются в «Настройки» → «Уведомления» — там можно отдельно отключить email, push и SMS-оповещения по категориям.',
      ],
      question: 'Как настроить или отключить уведомления?',
    },
    uz: {
      keywords: ['bildirishnomalarni o‘chirish', 'bildirishnomalarni sozlash', 'push xabarnoma'],
      responses: [
        'Bildirishnomalar "Sozlamalar" → "Bildirishnomalar" bo‘limida sozlanadi — u yerda email, push va SMS xabarnomalarini kategoriyalar bo‘yicha alohida o‘chirishingiz mumkin.',
      ],
      question: 'Bildirishnomalarni qanday sozlash yoki o‘chirish mumkin?',
    },
  },
  {
    id: 'language_settings',
    category: 'other',
    ru: {
      keywords: ['сменить язык интерфейса', 'изменить язык приложения', 'язык интерфейса'],
      responses: [
        'Язык интерфейса можно поменять в «Настройки» → «Язык», либо переключателем RU/UZ в шапке этого чата — изменения применяются мгновенно.',
      ],
      question: 'Как поменять язык интерфейса?',
    },
    uz: {
      keywords: ['interfeys tilini o‘zgartirish', 'ilova tilini almashtirish', 'interfeys tili'],
      responses: [
        'Interfeys tilini "Sozlamalar" → "Til" bo‘limida yoki ushbu chat sarlavhasidagi RU/UZ tugmasi orqali almashtirishingiz mumkin — o‘zgarishlar darhol qo‘llaniladi.',
      ],
      question: 'Interfeys tilini qanday almashtirish mumkin?',
    },
  },
  {
    id: 'security_question',
    category: 'account',
    ru: {
      keywords: ['безопасно ли', 'защищены ли данные', 'шифрование', 'взломали аккаунт', 'подозрительный вход'],
      responses: [
        'Все данные передаются по защищённому соединению (TLS) и хранятся в зашифрованном виде. Если вы заметили подозрительную активность — рекомендуем сразу сменить пароль и включить двухфакторную аутентификацию в «Настройки» → «Безопасность».',
      ],
      question: 'Насколько безопасен мой аккаунт?',
    },
    uz: {
      keywords: ['xavfsizmi', 'ma‘lumotlar himoyalanganmi', 'shifrlash', 'hisobim buzildi', 'shubhali kirish'],
      responses: [
        'Barcha ma’lumotlar himoyalangan ulanish (TLS) orqali uzatiladi va shifrlangan holda saqlanadi. Shubhali faollikni sezsangiz — darhol parolni almashtirish va "Sozlamalar" → "Xavfsizlik" bo‘limida ikki bosqichli autentifikatsiyani yoqishni tavsiya qilamiz.',
      ],
      question: 'Hisobim qanchalik xavfsiz?',
    },
  },
  {
    id: 'merge_accounts',
    category: 'account',
    ru: {
      keywords: ['объединить аккаунты', 'слияние аккаунтов', 'два аккаунта', 'дубликат аккаунта'],
      responses: [
        'Автоматического объединения аккаунтов сейчас нет — эта операция требует ручной проверки, чтобы не потерять данные. Напишите email обоих аккаунтов, и я передам заявку специалисту.',
      ],
      question: 'Можно ли объединить два аккаунта?',
    },
    uz: {
      keywords: ['hisoblarni birlashtirish', 'ikki hisob', 'hisob dublikati'],
      responses: [
        'Hozircha hisoblarni avtomatik birlashtirish mavjud emas — bu amal ma’lumotlar yo‘qolmasligi uchun qo‘lda tekshirishni talab qiladi. Ikkala hisobning emailini yozing, men so‘rovni mutaxassisga uzataman.',
      ],
      question: 'Ikki hisobni birlashtirish mumkinmi?',
    },
  },
  {
    id: 'team_invite',
    category: 'team',
    ru: {
      keywords: ['пригласить в команду', 'добавить участника', 'invite', 'пригласить коллегу'],
      responses: [
        'Пригласить участника можно в «Настройки» → «Команда» → «Пригласить» — укажите email, и человек получит приглашение со ссылкой для присоединения. Количество мест зависит от вашего тарифа.',
      ],
      question: 'Как пригласить коллегу в команду?',
    },
    uz: {
      keywords: ['jamoaga taklif qilish', 'a’zo qo‘shish', 'hamkasbni taklif qilish'],
      responses: [
        'Jamoaga a’zo "Sozlamalar" → "Jamoa" → "Taklif qilish" bo‘limida qo‘shiladi — email kiriting, u shaxs qo‘shilish havolasi bilan taklif oladi. O‘rinlar soni tarifingizga bog‘liq.',
      ],
      question: 'Hamkasbni jamoaga qanday taklif qilish mumkin?',
    },
  },
  {
    id: 'permissions_roles',
    category: 'team',
    ru: {
      keywords: ['роли участников', 'права доступа', 'права администратора', 'настроить роли'],
      responses: [
        'Ролями и правами доступа управляет администратор в «Настройки» → «Команда» → «Роли». Доступны роли: «Просмотр», «Редактирование» и «Администратор» — можно назначать индивидуально для каждого участника.',
      ],
      question: 'Как настроить роли и права участников?',
    },
    uz: {
      keywords: ['a’zolar rollari', 'kirish huquqlari', 'administrator huquqlari', 'rollarni sozlash'],
      responses: [
        'Rollar va kirish huquqlarini administrator "Sozlamalar" → "Jamoa" → "Rollar" bo‘limida boshqaradi. Mavjud rollar: «Ko‘rish», «Tahrirlash» va «Administrator» — har bir a’zo uchun alohida belgilash mumkin.',
      ],
      question: 'A’zolarning rollari va huquqlarini qanday sozlash mumkin?',
    },
  },
  {
    id: 'service_status',
    category: 'technical',
    ru: {
      keywords: ['сервис не работает', 'сайт недоступен', 'у всех не работает', 'авария на сервере', 'downtime'],
      responses: [
        'Проверьте, пожалуйста, страницу статуса сервиса — там отражаются текущие инциденты в реальном времени. Если сбоя в системе не зафиксировано, но у вас всё равно не работает — уточните, какое именно действие вызывает ошибку.',
      ],
      question: 'Сервис не работает — авария на сервере?',
    },
    uz: {
      keywords: ['xizmat ishlamayapti', 'sayt ishlamayapti', 'hammada ishlamayapti', 'serverda uzilish'],
      responses: [
        'Iltimos, xizmat holati sahifasini tekshiring — u yerda joriy hodisalar real vaqtda ko‘rsatiladi. Agar tizimda nosozlik qayd etilmagan bo‘lsa-yu, sizda baribir ishlamasa — qaysi amal xatolikka olib kelayotganini aniqlashtiring.',
      ],
      question: 'Xizmat ishlamayapti — serverda uzilishmi?',
    },
  },
  {
    id: 'escalate_human',
    category: 'conversational',
    ru: {
      keywords: ['живой оператор', 'позвать человека', 'реальный человек', 'связаться с оператором', 'поговорить с человеком'],
      responses: [
        'Конечно, я могу передать диалог специалисту поддержки. Уточните, пожалуйста, суть вопроса и удобный email или время для связи — коллега подключится в ближайшее рабочее время.',
      ],
      question: 'Позвать живого оператора',
    },
    uz: {
      keywords: ['jonli operator', 'odam bilan gaplashish', 'operatorga ulanish', 'mutaxassis bilan bog‘lanish'],
      responses: [
        'Albatta, suhbatni qo‘llab-quvvatlash mutaxassisiga uzatishim mumkin. Iltimos, savolingiz mohiyatini va bog‘lanish uchun qulay email yoki vaqtni yozing — hamkasbimiz yaqin ish vaqtida bog‘lanadi.',
      ],
      question: 'Jonli operatorni chaqirish',
    },
  },
  {
    id: 'complaint',
    category: 'conversational',
    ru: {
      keywords: ['недоволен', 'плохо работает поддержка', 'жалоба', 'ужасный сервис', 'очень плохо'],
      responses: [
        'Мне жаль, что у вас остался негативный опыт — это ценная обратная связь, и я передам её команде. Расскажите, пожалуйста, подробнее, что именно пошло не так, чтобы мы могли это исправить.',
      ],
      question: 'Оставить жалобу',
    },
    uz: {
      keywords: ['norozi', 'yordam yomon ishlayapti', 'shikoyat', 'juda yomon xizmat'],
      responses: [
        'Salbiy tajriba qoldirganingizdan afsusdaman — bu qimmatli fikr-mulohaza, va uni jamoaga yetkazaman. Iltimos, aniq nima noto‘g‘ri ketganini batafsil yozing, shunda buni tuzatishimiz mumkin bo‘ladi.',
      ],
      question: 'Shikoyat qoldirish',
    },
  },
  {
    id: 'compliment',
    category: 'conversational',
    ru: {
      keywords: ['отличный сервис', 'вы молодцы', 'классное приложение', 'нравится продукт', 'спасибо за помощь'],
      responses: [
        'Очень приятно это слышать, спасибо! Обязательно передам вашу оценку команде — это отличная мотивация для нас.',
      ],
      question: 'Оставить положительный отзыв',
    },
    uz: {
      keywords: ['ajoyib xizmat', 'zo‘rsiz', 'yaxshi ilova', 'mahsulot yoqdi'],
      responses: [
        'Buni eshitish juda yoqimli, rahmat! Fikringizni albatta jamoaga yetkazaman — bu biz uchun ajoyib motivatsiya.',
      ],
      question: 'Ijobiy fikr qoldirish',
    },
  },
  {
    id: 'forgot_username',
    category: 'account',
    ru: {
      keywords: ['забыл логин', 'не помню логин', 'какой у меня логин', 'забыл имя пользователя'],
      responses: [
        'Логином обычно служит email, указанный при регистрации. Если не помните, какой email использовали — попробуйте восстановить доступ через привязанный номер телефона на странице входа.',
      ],
      question: 'Забыл логин от аккаунта, что делать?',
    },
    uz: {
      keywords: ['login unutdim', 'loginni eslay olmayapman', 'foydalanuvchi nomini unutdim'],
      responses: [
        'Login odatda ro‘yxatdan o‘tishda ko‘rsatilgan email hisoblanadi. Qaysi emaildan foydalanganingizni eslay olmasangiz — kirish sahifasida bog‘langan telefon raqami orqali kirishga urinib ko‘ring.',
      ],
      question: 'Hisobim loginini unutdim, nima qilish kerak?',
    },
  },
  {
    id: 'browser_compatibility',
    category: 'technical',
    ru: {
      keywords: ['не открывается в браузере', 'не работает в chrome', 'не работает в safari', 'ошибка в браузере'],
      responses: [
        'Сервис поддерживает последние версии Chrome, Safari, Firefox и Edge. Попробуйте обновить браузер и отключить блокировщики рекламы/скриптов для нашего домена — они иногда мешают загрузке интерфейса.',
      ],
      question: 'Сайт не открывается в браузере',
    },
    uz: {
      keywords: ['brauzerda ochilmayapti', 'chrome da ishlamayapti', 'safari da ishlamayapti', 'brauzer xatosi'],
      responses: [
        'Xizmat Chrome, Safari, Firefox va Edge brauzerlarining so‘nggi versiyalarini qo‘llab-quvvatlaydi. Brauzerni yangilab, domenimiz uchun reklama/skript blokirovkalarini o‘chirib ko‘ring — ular ba’zan interfeys yuklanishiga xalaqit beradi.',
      ],
      question: 'Sayt brauzerda ochilmayapti',
    },
  },
  {
    id: 'file_upload_issue',
    category: 'technical',
    ru: {
      keywords: ['файл не загружается', 'ошибка загрузки файла', 'не могу загрузить файл', 'загрузка зависает'],
      responses: [
        'Проверьте, пожалуйста, размер файла — лимит на загрузку составляет 50 МБ на файл. Также убедитесь, что формат файла поддерживается (PDF, DOCX, XLSX, PNG, JPG). Если файл в пределах лимита, но всё равно не грузится — попробуйте другой браузер.',
      ],
      question: 'Не могу загрузить файл',
    },
    uz: {
      keywords: ['fayl yuklanmayapti', 'fayl yuklashda xatolik', 'faylni yuklay olmayapman', 'yuklash osilib qolyapti'],
      responses: [
        'Iltimos, fayl hajmini tekshiring — yuklash limiti bitta fayl uchun 50 MB. Shuningdek, fayl formati qo‘llab-quvvatlanishiga ishonch hosil qiling (PDF, DOCX, XLSX, PNG, JPG). Fayl limitdan oshmasa-yu, baribir yuklanmasa — boshqa brauzerda sinab ko‘ring.',
      ],
      question: 'Faylni yuklay olmayapman',
    },
  },
  {
    id: 'storage_limit',
    category: 'technical',
    ru: {
      keywords: ['закончилось место', 'превышен лимит хранилища', 'нет свободного места', 'хранилище заполнено'],
      responses: [
        'Похоже, вы достигли лимита хранилища на вашем тарифе. Освободить место можно, удалив неиспользуемые файлы в разделе «Хранилище», либо перейти на тариф с большим лимитом в «Настройки» → «Подписка».',
      ],
      question: 'Закончилось место в хранилище',
    },
    uz: {
      keywords: ['joy tugadi', 'saqlash limiti oshib ketdi', 'bo‘sh joy yo‘q', 'xotira to‘lgan'],
      responses: [
        'Ko‘rinishidan, tarifingizdagi saqlash limitiga yetdingiz. Joy bo‘shatish uchun "Xotira" bo‘limida foydalanilmayotgan fayllarni o‘chiring, yoki "Sozlamalar" → "Obuna" bo‘limida kattaroq limitli tarifga o‘ting.',
      ],
      question: 'Xotirada joy tugadi',
    },
  },
  {
    id: 'referral_program',
    category: 'other',
    ru: {
      keywords: ['реферальная программа', 'пригласить друга', 'бонус за приглашение', 'реферальная ссылка'],
      responses: [
        'Реферальную ссылку можно найти в «Настройки» → «Пригласить друзей». За каждого приглашённого, оформившего платную подписку, вы получаете бонусный месяц.',
      ],
      question: 'Как работает реферальная программа?',
    },
    uz: {
      keywords: ['referal dastur', 'do‘stni taklif qilish', 'taklif uchun bonus', 'referal havola'],
      responses: [
        'Referal havolani "Sozlamalar" → "Do‘stlarni taklif qilish" bo‘limidan topishingiz mumkin. Taklif qilingan har bir kishi pullik obuna rasmiylashtirsa, sizga bonus oy beriladi.',
      ],
      question: 'Referal dastur qanday ishlaydi?',
    },
  },
  {
    id: 'general_help',
    category: 'conversational',
    ru: {
      keywords: ['что вы умеете', 'чем можете помочь', 'какие у вас функции', 'помощь по приложению'],
      responses: [
        'Я могу помочь с вопросами по аккаунту, оплате и подпискам, техническим проблемам, настройкам и работе с командой. Опишите, пожалуйста, вашу ситуацию — подскажу конкретные шаги.',
      ],
      question: 'Что вы умеете?',
    },
    uz: {
      keywords: ['nima qila olasiz', 'nimada yordam bera olasiz', 'qanday funksiyalar bor', 'ilova bo‘yicha yordam'],
      responses: [
        'Men hisob, to‘lov va obunalar, texnik muammolar, sozlamalar va jamoa bilan ishlash bo‘yicha savollaringizga yordam bera olaman. Iltimos, vaziyatingizni tasvirlab bering — aniq qadamlarni aytib beraman.',
      ],
      question: 'Nima qila olasiz?',
    },
  },
];

export const fallbackResponses: Record<Locale, string[]> = {
  ru: [
    'Уточните, пожалуйста, детали вашего вопроса — я постараюсь помочь как можно точнее.',
    'Не могли бы вы описать ситуацию чуть подробнее? Например, на каком шаге возникает проблема.',
    'Спасибо за обращение! Чтобы помочь быстрее, укажите, пожалуйста, дополнительные детали — например, раздел приложения, где это происходит.',
    'Понимаю ваш запрос. Расскажите, пожалуйста, немного подробнее, что именно нужно уточнить?',
  ],
  uz: [
    'Iltimos, savolingiz tafsilotlarini aniqlashtiring — imkon qadar aniqroq yordam berishga harakat qilaman.',
    'Vaziyatni birozroq batafsil tasvirlab bera olasizmi? Masalan, muammo qaysi bosqichda yuzaga kelayapti.',
    'Murojaatingiz uchun rahmat! Tezroq yordam berish uchun qo‘shimcha tafsilotlarni yozing — masalan, bu qaysi bo‘limda yuz beryapti.',
    'So‘rovingizni tushundim. Iltimos, aniq nimani bilishni xohlaganingizni birozroq batafsil ayting?',
  ],
};

export interface FaqItem {
  id: string;
  question: string;
}

export interface FaqCategory {
  category: Exclude<ScenarioCategory, 'conversational'>;
  label: string;
  items: FaqItem[];
}

/** Группированный список вопросов для раздела FAQ на фронтенде. */
export function getFaqCategories(locale: Locale): FaqCategory[] {
  return CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_LABELS[locale][category],
    items: scenarios
      .filter((s) => s.category === category)
      .map((s) => ({ id: s.id, question: s[locale].question })),
  })).filter((group) => group.items.length > 0);
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Подсказки-вопросы для продолжения диалога: сначала из той же категории,
 * что и только что отвеченный сценарий, затем из остальных FAQ-категорий.
 * Используются, чтобы показать реальную ширину банка сценариев прямо в чате.
 */
export function getSuggestions(currentScenarioId: string | null, locale: Locale, count = 3): string[] {
  const faqable = scenarios.filter((s) => s.category !== 'conversational' && s.id !== currentScenarioId);
  const current = scenarios.find((s) => s.id === currentScenarioId);

  let ordered = shuffle(faqable);
  if (current && current.category !== 'conversational') {
    const sameCategory = shuffle(faqable.filter((s) => s.category === current.category));
    const rest = shuffle(faqable.filter((s) => s.category !== current.category));
    ordered = [...sameCategory, ...rest];
  }

  return ordered.slice(0, count).map((s) => s[locale].question);
}
