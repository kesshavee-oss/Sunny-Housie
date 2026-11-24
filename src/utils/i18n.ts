import { LanguageId, PatternId, ThemeId } from '../types/housie';

export interface Translations {
  appName: string;
  appSubtitle: string;
  settings: string;
  close: string;
  themeLabel: string;
  languageLabel: string;
  kidsModeLabel: string;
  highContrastLabel: string;
  largeTextLabel: string;
  themes: Record<ThemeId, string>;
  languages: Record<LanguageId, string>;
  hostGame: string;
  hostGameKids: string;
  playGame: string;
  playGameKids: string;
  callNumbersSub: string;
  getTicketsSub: string;
  calledTodayCount: (n: number) => string;
  ticketsTodayCount: (n: number) => string;
  savedOnDevice: string;
  home: string;
  lockScreen: string;
  screenLocked: string;
  unlock: string;
  unlocking: string;
  voice: string;
  sound: string;
  music: string;
  callNextNumber: string;
  callNextNumberKids: string;
  allCalled: string;
  last5Numbers: string;
  called: string;
  remaining: string;
  startOver: string;
  startOverTitle: string;
  startOverMessage: string;
  yesStartOver: string;
  keepNumbers: string;
  tabBoard: string;
  tabMyTickets: string;
  tabPrizes: string;
  tabHistory: string;
  howManyTickets: string;
  howManyTicketsKids: string;
  choose1to10: string;
  generateTickets: string;
  generateTicketsKids: string;
  ticketPrefix: string;
  claim: string;
  notYet: string;
  prizes: string;
  prizePlaceholder: string;
  openStatus: string;
  wonStatus: string;
  history: string;
  clearHistory: string;
  clearHistoryTitle: string;
  clearHistoryMessage: string;
  keepHistory: string;
  resetTodaysTickets: string;
  resetTodaysTicketsTitle: string;
  resetTodaysTicketsMessage: string;
  yesResetTickets: string;
  keepTickets: string;
  resetMyTickets: string;
  resetMyTicketsTitle: string;
  resetMyTicketsMessage: string;
  yesResetMyTickets: string;
  patterns: Record<PatternId, string>;
  srCalled: string;
  srNotCalled: string;
  srMarked: string;
  srUnmarked: string;
  srBlank: string;
  printTickets: string;
  saveTicketPicture: string;
  endTodaysGame: string;
  endTodaysGameTitle: string;
  endTodaysGameMessage: string;
  yesEndGame: string;
  keepPlaying: string;
  pastGames: string;
  numbersCalledLabel: string;
  patternsWonLabel: string;
  exportData: string;
  importData: string;
  importConfirmTitle: string;
  importConfirmMessage: string;
  yesImportData: string;
  cancel: string;
  invalidBackupError: string;
  installApp: string;
  installIOS: string;
  installIOSBody: string;
  addPrize: string;
  remove: string;
  removePrizeTitle: string;
  removePrizeMessage: string;
  yesRemove: string;
  keepPrize: string;
  prizeRuleLabel: string;
}

const EN: Translations = {
  appName: 'Sunny Housie',
  appSubtitle: 'Family Tambola & Bingo',
  settings: 'Settings',
  close: 'Done',
  themeLabel: 'Theme',
  languageLabel: 'Language',
  kidsModeLabel: 'Kids Mode',
  highContrastLabel: 'High Contrast',
  largeTextLabel: 'Large Text',
  themes: {
    classic: 'Classic',
    diwali: 'Diwali',
    christmas: 'Christmas',
    pongal: 'Pongal',
    summer: 'Summer Fun',
  },
  languages: {
    en: 'English',
    hi: 'हिन्दी',
    pa: 'ਪੰਜਾਬੀ',
  },
  hostGame: 'Host Game',
  hostGameKids: 'Host',
  playGame: 'Play Game',
  playGameKids: 'Play',
  callNumbersSub: 'Call numbers 1 to 90',
  getTicketsSub: 'Get tickets for today',
  calledTodayCount: (n) => `${n} of 90 called`,
  ticketsTodayCount: (n) => `${n} ${n === 1 ? 'ticket' : 'tickets'} today`,
  savedOnDevice: 'Saved automatically on this device for today',
  home: 'Home',
  lockScreen: 'Lock Screen',
  screenLocked: 'Screen Locked',
  unlock: 'Unlock',
  unlocking: 'Unlocking…',
  voice: 'Voice',
  sound: 'Sound',
  music: 'Music',
  callNextNumber: 'Call Next Number',
  callNextNumberKids: 'Next Number!',
  allCalled: 'All 90 Numbers Called',
  last5Numbers: 'Last 5 Numbers',
  called: 'Called',
  remaining: 'Remaining',
  startOver: 'Start Over',
  startOverTitle: 'Start Over?',
  startOverMessage: 'This will clear all numbers called today so you can begin a fresh game.',
  yesStartOver: 'Yes, Start Over',
  keepNumbers: 'Keep Numbers',
  tabBoard: 'Number Board',
  tabMyTickets: 'My Tickets',
  tabPrizes: 'Prizes',
  tabHistory: 'History',
  howManyTickets: 'How many tickets do you want?',
  howManyTicketsKids: 'Pick tickets!',
  choose1to10: 'Choose from 1 to 10 tickets for today',
  generateTickets: 'Generate Tickets',
  generateTicketsKids: 'Make Tickets!',
  ticketPrefix: 'Ticket',
  claim: 'Claim',
  notYet: 'Not yet',
  prizes: 'Prizes',
  prizePlaceholder: 'Prize',
  openStatus: 'Open',
  wonStatus: 'Won',
  history: 'History',
  clearHistory: 'Clear History',
  clearHistoryTitle: 'Clear History?',
  clearHistoryMessage: 'This clears the call history list without changing the called numbers on the board.',
  keepHistory: 'Keep History',
  resetTodaysTickets: "Reset Today's Tickets",
  resetTodaysTicketsTitle: "Reset Today's Tickets?",
  resetTodaysTicketsMessage: 'This will clear your current tickets and marks for today so you can pick a new set.',
  yesResetTickets: 'Yes, Reset Tickets',
  keepTickets: 'Keep Tickets',
  resetMyTickets: 'Reset My Tickets',
  resetMyTicketsTitle: 'Reset My Tickets?',
  resetMyTicketsMessage: 'This will clear only your host tickets and marks for today so you can pick a new set.',
  yesResetMyTickets: 'Yes, Reset My Tickets',
  patterns: {
    earlyFive: 'Early Five',
    topLine: 'Top Line',
    middleLine: 'Middle Line',
    bottomLine: 'Bottom Line',
    fullHouse: 'Full House',
  },
  srCalled: 'called',
  srNotCalled: 'not called',
  srMarked: 'marked',
  srUnmarked: 'not marked',
  srBlank: 'blank',
  printTickets: 'Print Tickets',
  saveTicketPicture: 'Save Ticket Picture',
  endTodaysGame: "End Today's Game",
  endTodaysGameTitle: "End Today's Game?",
  endTodaysGameMessage: "This saves today's summary to Past Games and clears the current game.",
  yesEndGame: "Yes, End Today's Game",
  keepPlaying: 'Keep Playing',
  pastGames: 'Past Games',
  numbersCalledLabel: 'Numbers Called',
  patternsWonLabel: 'Patterns Won',
  exportData: 'Export Data',
  importData: 'Import Data',
  importConfirmTitle: 'Import Data?',
  importConfirmMessage: 'This replaces all current saved games, tickets, and settings with the selected backup.',
  yesImportData: 'Yes, Import Data',
  cancel: 'Cancel',
  invalidBackupError: 'Invalid backup file.',
  installApp: 'Install App',
  installIOS: 'Install on iOS',
  installIOSBody: 'Tap Share, then Add to Home Screen.',
  addPrize: 'Add Prize',
  remove: 'Remove',
  removePrizeTitle: 'Remove Prize?',
  removePrizeMessage: 'This will remove this extra prize from today’s list.',
  yesRemove: 'Remove',
  keepPrize: 'Keep',
  prizeRuleLabel: 'Rule',
};

const HI: Translations = {
  appName: 'सनी हाउज़ी',
  appSubtitle: 'पारिवारिक तंबोला और बिंगो',
  settings: 'सेटिंग्स',
  close: 'हो गया',
  themeLabel: 'थीम',
  languageLabel: 'भाषा',
  kidsModeLabel: 'बच्चों का मोड',
  highContrastLabel: 'हाई कॉन्ट्रास्ट',
  largeTextLabel: 'बड़ा टेक्स्ट',
  themes: {
    classic: 'क्लासिक',
    diwali: 'दिवाली',
    christmas: 'क्रिसमस',
    pongal: 'पोंगल',
    summer: 'गर्मी मस्ती',
  },
  languages: {
    en: 'English',
    hi: 'हिन्दी',
    pa: 'ਪੰਜਾਬੀ',
  },
  hostGame: 'खेल होस्ट करें',
  hostGameKids: 'होस्ट',
  playGame: 'खेल खेलें',
  playGameKids: 'खेलें',
  callNumbersSub: '1 से 90 तक नंबर बोलें',
  getTicketsSub: 'आज के टिकट लें',
  calledTodayCount: (n) => `90 में से ${n} बोले गए`,
  ticketsTodayCount: (n) => `आज ${n} टिकट तैयार`,
  savedOnDevice: 'आज के लिए इस डिवाइस पर सुरक्षित',
  home: 'होम',
  lockScreen: 'स्क्रीन लॉक',
  screenLocked: 'स्क्रीन लॉक है',
  unlock: 'अनलॉक',
  unlocking: 'खुल रहा है…',
  voice: 'आवाज़',
  sound: 'ध्वनि',
  music: 'संगीत',
  callNextNumber: 'अगला नंबर बोलें',
  callNextNumberKids: 'अगला नंबर!',
  allCalled: 'सभी 90 नंबर बोले गए',
  last5Numbers: 'पिछले 5 नंबर',
  called: 'बोले गए',
  remaining: 'बाकी',
  startOver: 'फिर से शुरू करें',
  startOverTitle: 'फिर से शुरू करें?',
  startOverMessage: 'इससे आज के सभी बोले गए नंबर साफ़ हो जाएंगे।',
  yesStartOver: 'हाँ, फिर से शुरू करें',
  keepNumbers: 'नंबर रखें',
  tabBoard: 'नंबर बोर्ड',
  tabMyTickets: 'मेरे टिकट',
  tabPrizes: 'इनाम',
  tabHistory: 'इतिहास',
  howManyTickets: 'आपको कितने टिकट चाहिए?',
  howManyTicketsKids: 'टिकट चुनें!',
  choose1to10: 'आज के लिए 1 से 10 टिकट चुनें',
  generateTickets: 'टिकट बनाएं',
  generateTicketsKids: 'टिकट बनाओ!',
  ticketPrefix: 'टिकट',
  claim: 'क्लेम',
  notYet: 'अभी नहीं',
  prizes: 'इनाम',
  prizePlaceholder: 'इनाम',
  openStatus: 'बाकी',
  wonStatus: 'जीता',
  history: 'इतिहास',
  clearHistory: 'इतिहास साफ़ करें',
  clearHistoryTitle: 'इतिहास साफ़ करें?',
  clearHistoryMessage: 'इससे बोर्ड के नंबर बदले बिना केवल कॉल इतिहास साफ़ होगा।',
  keepHistory: 'इतिहास रखें',
  resetTodaysTickets: 'आज के टिकट रीसेट करें',
  resetTodaysTicketsTitle: 'आज के टिकट रीसेट करें?',
  resetTodaysTicketsMessage: 'इससे आज के आपके टिकट और निशान साफ़ हो जाएंगे।',
  yesResetTickets: 'हाँ, रीसेट करें',
  keepTickets: 'टिकट रखें',
  resetMyTickets: 'मेरे टिकट रीसेट करें',
  resetMyTicketsTitle: 'मेरे टिकट रीसेट करें?',
  resetMyTicketsMessage: 'इससे आज के केवल होस्ट टिकट और निशान साफ़ होंगे।',
  yesResetMyTickets: 'हाँ, रीसेट करें',
  patterns: {
    earlyFive: 'अर्ली फाइव',
    topLine: 'ऊपरी लाइन',
    middleLine: 'बीच की लाइन',
    bottomLine: 'नीचे की लाइन',
    fullHouse: 'फुल हाउस',
  },
  srCalled: 'बोला गया',
  srNotCalled: 'नहीं बोला गया',
  srMarked: 'निशान लगा है',
  srUnmarked: 'निशान नहीं है',
  srBlank: 'खाली',
  printTickets: 'टिकट प्रिंट करें',
  saveTicketPicture: 'टिकट तस्वीर सहेजें',
  endTodaysGame: 'आज का खेल समाप्त करें',
  endTodaysGameTitle: 'आज का खेल समाप्त करें?',
  endTodaysGameMessage: 'इससे आज का सारांश पिछले खेलों में सहेजा जाएगा और वर्तमान बोर्ड साफ़ होगा।',
  yesEndGame: 'हाँ, समाप्त करें',
  keepPlaying: 'खेल जारी रखें',
  pastGames: 'पिछले खेल',
  numbersCalledLabel: 'बोले गए नंबर',
  patternsWonLabel: 'जीते गए पैटर्न',
  exportData: 'डेटा एक्सपोर्ट करें',
  importData: 'डेटा इम्पोर्ट करें',
  importConfirmTitle: 'डेटा इम्पोर्ट करें?',
  importConfirmMessage: 'इससे वर्तमान खेल, टिकट और सेटिंग्स चयनित बैकअप से बदल जाएंगे।',
  yesImportData: 'हाँ, इम्पोर्ट करें',
  cancel: 'रद्द करें',
  invalidBackupError: 'अमान्य बैकअप फ़ाइल।',
  installApp: 'ऐप इंस्टॉल करें',
  installIOS: 'iOS पर इंस्टॉल करें',
  installIOSBody: 'शेयर पर टैप करें, फिर होम स्क्रीन पर जोड़ें।',
  addPrize: 'इनाम जोड़ें',
  remove: 'हटाएं',
  removePrizeTitle: 'इनाम हटाएं?',
  removePrizeMessage: 'इससे यह अतिरिक्त इनाम आज की सूची से हट जाएगा।',
  yesRemove: 'हटाएं',
  keepPrize: 'रखें',
  prizeRuleLabel: 'नियम',
};

const PA: Translations = {
  appName: 'ਸਨੀ ਹਾਊਜ਼ੀ',
  appSubtitle: 'ਪਰਿਵਾਰਕ ਤੰਬੋਲਾ ਅਤੇ ਬਿੰਗੋ',
  settings: 'ਸੈਟਿੰਗਾਂ',
  close: 'ਹੋ ਗਿਆ',
  themeLabel: 'ਥੀਮ',
  languageLabel: 'ਭਾਸ਼ਾ',
  kidsModeLabel: 'ਬੱਚਿਆਂ ਦਾ ਮੋਡ',
  highContrastLabel: 'ਹਾਈ ਕੰਟ੍ਰਾਸਟ',
  largeTextLabel: 'ਵੱਡਾ ਟੈਕਸਟ',
  themes: {
    classic: 'ਕਲਾਸਿਕ',
    diwali: 'ਦੀਵਾਲੀ',
    christmas: 'ਕ੍ਰਿਸਮਸ',
    pongal: 'ਪੋਂਗਲ',
    summer: 'ਗਰਮੀ ਮਸਤੀ',
  },
  languages: {
    en: 'English',
    hi: 'हिन्दी',
    pa: 'ਪੰਜਾਬੀ',
  },
  hostGame: 'ਖੇਡ ਹੋਸਟ ਕਰੋ',
  hostGameKids: 'ਹੋਸਟ',
  playGame: 'ਖੇਡ ਖੇਡੋ',
  playGameKids: 'ਖੇਡੋ',
  callNumbersSub: '1 ਤੋਂ 90 ਤੱਕ ਨੰਬਰ ਬੋਲੋ',
  getTicketsSub: 'ਅੱਜ ਦੀਆਂ ਟਿਕਟਾਂ ਲਓ',
  calledTodayCount: (n) => `90 ਵਿੱਚੋਂ ${n} ਬੋਲੇ ਗਏ`,
  ticketsTodayCount: (n) => `ਅੱਜ ${n} ਟਿਕਟਾਂ ਤਿਆਰ`,
  savedOnDevice: 'ਅੱਜ ਲਈ ਇਸ ਡਿਵਾਈਸ ਤੇ ਸੁਰੱਖਿਅਤ',
  home: 'ਹੋਮ',
  lockScreen: 'ਸਕ੍ਰੀਨ ਲਾਕ',
  screenLocked: 'ਸਕ੍ਰੀਨ ਲਾਕ ਹੈ',
  unlock: 'ਅਨਲਾਕ',
  unlocking: 'ਖੁੱਲ੍ਹ ਰਿਹਾ ਹੈ…',
  voice: 'ਆਵਾਜ਼',
  sound: 'ਧੁਨੀ',
  music: 'ਸੰਗੀਤ',
  callNextNumber: 'ਅਗਲਾ ਨੰਬਰ ਬੋਲੋ',
  callNextNumberKids: 'ਅਗਲਾ ਨੰਬਰ!',
  allCalled: 'ਸਾਰੇ 90 ਨੰਬਰ ਬੋਲੇ ਗਏ',
  last5Numbers: 'ਪਿਛਲੇ 5 ਨੰਬਰ',
  called: 'ਬੋਲੇ ਗਏ',
  remaining: 'ਬਾਕੀ',
  startOver: 'ਦੁਬਾਰਾ ਸ਼ੁਰੂ ਕਰੋ',
  startOverTitle: 'ਦੁਬਾਰਾ ਸ਼ੁਰੂ ਕਰੀਏ?',
  startOverMessage: 'ਇਸ ਨਾਲ ਅੱਜ ਦੇ ਸਾਰੇ ਬੋਲੇ ਗਏ ਨੰਬਰ ਸਾਫ਼ ਹੋ ਜਾਣਗੇ।',
  yesStartOver: 'ਹਾਂ, ਦੁਬਾਰਾ ਸ਼ੁਰੂ ਕਰੋ',
  keepNumbers: 'ਨੰਬਰ ਰੱਖੋ',
  tabBoard: 'ਨੰਬਰ ਬੋਰਡ',
  tabMyTickets: 'ਮੇਰੀਆਂ ਟਿਕਟਾਂ',
  tabPrizes: 'ਇਨਾਮ',
  tabHistory: 'ਇਤਿਹਾਸ',
  howManyTickets: 'ਤੁਹਾਨੂੰ ਕਿੰਨੀਆਂ ਟਿਕਟਾਂ ਚਾਹੀਦੀਆਂ ਹਨ?',
  howManyTicketsKids: 'ਟਿਕਟਾਂ ਚੁਣੋ!',
  choose1to10: 'ਅੱਜ ਲਈ 1 ਤੋਂ 10 ਟਿਕਟਾਂ ਚੁਣੋ',
  generateTickets: 'ਟਿਕਟਾਂ ਬਣਾਓ',
  generateTicketsKids: 'ਟਿਕਟਾਂ ਬਣਾਓ!',
  ticketPrefix: 'ਟਿਕਟ',
  claim: 'ਕਲੇਮ',
  notYet: 'ਅਜੇ ਨਹੀਂ',
  prizes: 'ਇਨਾਮ',
  prizePlaceholder: 'ਇਨਾਮ',
  openStatus: 'ਬਾਕੀ',
  wonStatus: 'ਜਿੱਤਿਆ',
  history: 'ਇਤਿਹਾਸ',
  clearHistory: 'ਇਤਿਹਾਸ ਸਾਫ਼ ਕਰੋ',
  clearHistoryTitle: 'ਇਤਿਹਾਸ ਸਾਫ਼ ਕਰੀਏ?',
  clearHistoryMessage: 'ਇਸ ਨਾਲ ਬੋਰਡ ਦੇ ਨੰਬਰ ਬਦਲੇ ਬਿਨਾਂ ਸਿਰਫ਼ ਇਤਿਹਾਸ ਸਾਫ਼ ਹੋਵੇਗਾ।',
  keepHistory: 'ਇਤਿਹਾਸ ਰੱਖੋ',
  resetTodaysTickets: 'ਅੱਜ ਦੀਆਂ ਟਿਕਟਾਂ ਰੀਸੈੱਟ ਕਰੋ',
  resetTodaysTicketsTitle: 'ਅੱਜ ਦੀਆਂ ਟਿਕਟਾਂ ਰੀਸੈੱਟ ਕਰੀਏ?',
  resetTodaysTicketsMessage: 'ਇਸ ਨਾਲ ਅੱਜ ਦੀਆਂ ਤੁਹਾਡੀਆਂ ਟਿਕਟਾਂ ਅਤੇ ਨਿਸ਼ਾਨ ਸਾਫ਼ ਹੋ ਜਾਣਗੇ।',
  yesResetTickets: 'ਹਾਂ, ਰੀਸੈੱਟ ਕਰੋ',
  keepTickets: 'ਟਿਕਟਾਂ ਰੱਖੋ',
  resetMyTickets: 'ਮੇਰੀਆਂ ਟਿਕਟਾਂ ਰੀਸੈੱਟ ਕਰੋ',
  resetMyTicketsTitle: 'ਮੇਰੀਆਂ ਟਿਕਟਾਂ ਰੀਸੈੱਟ ਕਰੀਏ?',
  resetMyTicketsMessage: 'ਇਸ ਨਾਲ ਅੱਜ ਦੀਆਂ ਸਿਰਫ਼ ਹੋਸਟ ਟਿਕਟਾਂ ਅਤੇ ਨਿਸ਼ਾਨ ਸਾਫ਼ ਹੋਣਗੇ।',
  yesResetMyTickets: 'ਹਾਂ, ਰੀਸੈੱਟ ਕਰੋ',
  patterns: {
    earlyFive: 'ਅਰਲੀ ਫਾਈਵ',
    topLine: 'ਉੱਪਰਲੀ ਲਾਈਨ',
    middleLine: 'ਵਿਚਕਾਰਲੀ ਲਾਈਨ',
    bottomLine: 'ਹੇਠਲੀ ਲਾਈਨ',
    fullHouse: 'ਫੁੱਲ ਹਾਊਸ',
  },
  srCalled: 'ਬੋਲਿਆ ਗਿਆ',
  srNotCalled: 'ਨਹੀਂ ਬੋਲਿਆ ਗਿਆ',
  srMarked: 'ਨਿਸ਼ਾਨ ਲੱਗਾ ਹੈ',
  srUnmarked: 'ਨਿਸ਼ਾਨ ਨਹੀਂ ਹੈ',
  srBlank: 'ਖਾਲੀ',
  printTickets: 'ਟਿਕਟਾਂ ਪ੍ਰਿੰਟ ਕਰੋ',
  saveTicketPicture: 'ਟਿਕਟ ਤਸਵੀਰ ਸੰਭਾਲੋ',
  endTodaysGame: 'ਅੱਜ ਦੀ ਖੇਡ ਖਤਮ ਕਰੋ',
  endTodaysGameTitle: 'ਅੱਜ ਦੀ ਖੇਡ ਖਤਮ ਕਰੀਏ?',
  endTodaysGameMessage: 'ਇਸ ਨਾਲ ਅੱਜ ਦਾ ਸਾਰ ਪਿਛਲੀਆਂ ਖੇਡਾਂ ਵਿੱਚ ਸੰਭਾਲਿਆ ਜਾਵੇਗਾ ਅਤੇ ਬੋਰਡ ਸਾਫ਼ ਹੋ ਜਾਵੇਗਾ।',
  yesEndGame: 'ਹਾਂ, ਖਤਮ ਕਰੋ',
  keepPlaying: 'ਖੇਡ ਜਾਰੀ ਰੱਖੋ',
  pastGames: 'ਪਿਛਲੀਆਂ ਖੇਡਾਂ',
  numbersCalledLabel: 'ਬੋਲੇ ਗਏ ਨੰਬਰ',
  patternsWonLabel: 'ਜਿੱਤੇ ਗਏ ਪੈਟਰਨ',
  exportData: 'ਡੇਟਾ ਐਕਸਪੋਰਟ ਕਰੋ',
  importData: 'ਡੇਟਾ ਇਮਪੋਰਟ ਕਰੋ',
  importConfirmTitle: 'ਡੇਟਾ ਇਮਪੋਰਟ ਕਰੀਏ?',
  importConfirmMessage: 'ਇਸ ਨਾਲ ਮੌਜੂਦਾ ਖੇਡਾਂ, ਟਿਕਟਾਂ ਅਤੇ ਸੈਟਿੰਗਾਂ ਚੁਣੇ ਹੋਏ ਬੈਕਅੱਪ ਨਾਲ ਬਦਲ ਜਾਣਗੀਆਂ।',
  yesImportData: 'ਹਾਂ, ਇਮਪੋਰਟ ਕਰੋ',
  cancel: 'ਰੱਦ ਕਰੋ',
  invalidBackupError: 'ਗਲਤ ਬੈਕਅੱਪ ਫਾਈਲ।',
  installApp: 'ਐਪ ਇੰਸਟਾਲ ਕਰੋ',
  installIOS: 'iOS ਤੇ ਇੰਸਟਾਲ ਕਰੋ',
  installIOSBody: 'ਸ਼ੇਅਰ ਤੇ ਟੈਪ ਕਰੋ, ਫਿਰ ਹੋਮ ਸਕ੍ਰੀਨ ਤੇ ਜੋੜੋ।',
  addPrize: 'ਇਨਾਮ ਜੋੜੋ',
  remove: 'ਹਟਾਓ',
  removePrizeTitle: 'ਇਨਾਮ ਹਟਾਓ?',
  removePrizeMessage: 'ਇਸ ਨਾਲ ਇਹ ਵਾਧੂ ਇਨਾਮ ਅੱਜ ਦੀ ਸੂਚੀ ਵਿੱਚੋਂ ਹਟ ਜਾਵੇਗਾ।',
  yesRemove: 'ਹਟਾਓ',
  keepPrize: 'ਰੱਖੋ',
  prizeRuleLabel: 'ਨਿਯਮ',
};

export const I18N: Record<LanguageId, Translations> = {
  en: EN,
  hi: HI,
  pa: PA,
};
