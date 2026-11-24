import { LanguageId } from '../types/housie';

const ONES = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
];

const TENS = [
  '',
  '',
  'Twenty',
  'Thirty',
  'Forty',
  'Fifty',
  'Sixty',
  'Seventy',
  'Eighty',
  'Ninety',
];

const HINDI_WORDS: string[] = [
  '',
  'एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ', 'दस',
  'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह', 'अठारह', 'उन्नीस', 'बीस',
  'इक्कीस', 'बाईस', 'तेईस', 'चौबीस', 'पच्चीस', 'छब्बीस', 'सत्ताईस', 'अट्ठाईस', 'उनतीस', 'तीस',
  'इकतीस', 'बत्तीस', 'तैंतीस', 'चौंतीस', 'पैंतीस', 'छत्तीस', 'सैंतीस', 'अड़तीस', 'उनतालीस', 'चालीस',
  'इकतालीस', 'बयालीस', 'तैंतालीस', 'चवालीस', 'पैंतालीस', 'छियालीस', 'सैंतालीस', 'अड़तालीस', 'उनचास', 'पचास',
  'इक्यावन', 'बावन', 'तिरेपन', 'चौवन', 'पचपन', 'छप्पन', 'सत्तावन', 'अट्ठावन', 'उनसठ', 'साठ',
  'इकसठ', 'बासठ', 'तिरेसठ', 'चौंसठ', 'पैंसठ', 'छियासठ', 'सड़सठ', 'अड़सठ', 'उनहत्तर', 'सत्तर',
  'इकहत्तर', 'बहत्तर', 'तिहत्तर', 'चौहत्तर', 'पचहत्तर', 'छिहत्तर', 'सतहत्तर', 'अठहत्तर', 'उनासी', 'अस्सी',
  'इक्यासी', 'बयासी', 'तिरासी', 'चौरासी', 'पचासी', 'छियासी', 'सत्तासी', 'अट्ठासी', 'नवासी', 'नब्बे',
];

const PUNJABI_WORDS: string[] = [
  '',
  'ਇੱਕ', 'ਦੋ', 'ਤਿੰਨ', 'ਚਾਰ', 'ਪੰਜ', 'ਛੇ', 'ਸੱਤ', 'ਅੱਠ', 'ਨੌਂ', 'ਦਸ',
  'ਗਿਆਰਾਂ', 'ਬਾਰਾਂ', 'ਤੇਰਾਂ', 'ਚੌਦਾਂ', 'ਪੰਦਰਾਂ', 'ਸੋਲਾਂ', 'ਸਤਾਰਾਂ', 'ਅਠਾਰਾਂ', 'ਉੱਨੀ', 'ਵੀਹ',
  'ਇੱਕੀ', 'ਬਾਈ', 'ਤੇਈ', 'ਚੌਵੀ', 'ਪੱਚੀ', 'ਛੱਬੀ', 'ਸਤਾਈ', 'ਅਠਾਈ', 'ਉਨੱਤੀ', 'ਤੀਹ',
  'ਇਕੱਤੀ', 'ਬੱਤੀ', 'ਤੇਤੀ', 'ਚੌਂਤੀ', 'ਪੈਂਤੀ', 'ਛੱਤੀ', 'ਸੈਂਤੀ', 'ਅਠੱਤੀ', 'ਉਨਤਾਲੀ', 'ਚਾਲੀ',
  'ਇਕਤਾਲੀ', 'ਬਿਆਲੀ', 'ਤਰਤਾਲੀ', 'ਚੁਤਾਲੀ', 'ਪੰਜਤਾਲੀ', 'ਛਿਆਲੀ', 'ਸੰਤਾਲੀ', 'ਅਠਤਾਲੀ', 'ਉਨੰਜਾ', 'ਪੰਜਾਹ',
  'ਇਕਵੰਜਾ', 'ਬਵੰਜਾ', 'ਤਰਵੰਜਾ', 'ਚੁਰੰਜਾ', 'ਪਚਵੰਜਾ', 'ਛਪੰਜਾ', 'ਸਤਵੰਜਾ', 'ਅਠਵੰਜਾ', 'ਉਨਾਹਠ', 'ਸੱਠ',
  'ਇਕਾਹਠ', 'ਬਾਹਠ', 'ਤਰੇਹਠ', 'ਚੌਂਹਠ', 'ਪੈਂਹਠ', 'ਛਿਆਹਠ', 'ਸਤਾਹਠ', 'ਅਠਾਹਠ', 'ਉਨੱਤਰ', 'ਸੱਤਰ',
  'ਇਕਹੱਤਰ', 'ਬਹੱਤਰ', 'ਤਿਹੱਤਰ', 'ਚੁਹੱਤਰ', 'ਪਚੱਤਰ', 'ਛਿਹੱਤਰ', 'ਸਤੱਤਰ', 'ਅਠੱਤਰ', 'ਉਨਾਸੀ', 'ਅੱਸੀ',
  'ਇਕਿਆਸੀ', 'ਬਿਆਸੀ', 'ਤਿਰਾਸੀ', 'ਚੁਰਾਸੀ', 'ਪਚਾਸੀ', 'ਛਿਆਸੀ', 'ਸਤਾਸੀ', 'ਅਠਾਸੀ', 'ਉਨਾਨਵੇਂ', 'ਨੱਬੇ',
];

const CALLOUTS_EN: Record<number, string> = {
  1: "Kelly's eye, One",
  2: 'One little duck, Two',
  3: 'Cup of tea, Three',
  5: 'Man alive, Five',
  7: 'Lucky seven',
  9: "Doctor's orders, Nine",
  10: 'Big fat hen, Ten',
  11: 'Legs eleven',
  12: 'One dozen, Twelve',
  13: "Baker's dozen, Thirteen",
  16: 'Sweet sixteen',
  21: 'Key of the door, Twenty-one',
  22: 'Two little ducks, Twenty-two',
  25: 'Duck and dive, Twenty-five',
  33: 'All the threes, Thirty-three',
  44: 'All the fours, Forty-four',
  50: 'Half a century, Fifty',
  55: 'Snakes alive, Fifty-five',
  66: 'Clickety click, Sixty-six',
  77: 'Sunset strip, Seventy-seven',
  88: 'Two snowmen, Eighty-eight',
  90: 'Top of the shop, Ninety',
};

const CALLOUTS_HI: Record<number, string> = {
  1: 'केली की आँख, एक',
  7: 'लकी सात',
  10: 'पूरे दस',
  11: 'ग्यारह खिलाड़ी, ग्यारह',
  12: 'एक दर्जन, बारह',
  22: 'दो प्यारी बत्तखें, बाईस',
  33: 'दोनों तीन, तैंतीस',
  50: 'अर्धशतक, पचास',
  66: 'क्लिकेटी क्लिक, छियासठ',
  77: 'सूरज की किरण, सतहत्तर',
  88: 'दो गोल मटोल, अट्ठासी',
  90: 'सबसे बड़ा नंबर, नब्बे',
};

const CALLOUTS_PA: Record<number, string> = {
  1: 'ਕੇਲੀ ਦੀ ਅੱਖ, ਇੱਕ',
  7: 'ਲੱਕੀ ਸੱਤ',
  10: 'ਪੂਰੇ ਦਸ',
  11: 'ਗਿਆਰਾਂ ਖਿਡਾਰੀ, ਗਿਆਰਾਂ',
  12: 'ਇੱਕ ਦਰਜਨ, ਬਾਰਾਂ',
  22: 'ਦੋ ਪਿਆਰੀਆਂ ਬੱਤਖਾਂ, ਬਾਈ',
  33: 'ਦੋਵੇਂ ਤਿੰਨ, ਤੇਤੀ',
  50: 'ਅੱਧੀ ਸੈਂਚਰੀ, ਪੰਜਾਹ',
  66: 'ਕਲਿਕਟੀ ਕਲਿਕ, ਛਿਆਹਠ',
  77: 'ਸੂਰਜ ਦੀ ਕਿਰਨ, ਸਤੱਤਰ',
  88: 'ਦੋ ਗੋਲ ਮਟੋਲ, ਅਠਾਸੀ',
  90: 'ਸਭ ਤੋਂ ਵੱਡਾ ਨੰਬਰ, ਨੱਬੇ',
};

const LANG_TAGS: Record<LanguageId, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  pa: 'pa-IN',
};

/**
 * Converts a number 1..90 into words in the selected language.
 */
export function numberToWords(num: number, language: LanguageId = 'en'): string {
  if (num < 1 || num > 90) return String(num);
  if (language === 'hi') return HINDI_WORDS[num] ?? String(num);
  if (language === 'pa') return PUNJABI_WORDS[num] ?? String(num);

  if (num < 20) return ONES[num];
  const ten = Math.floor(num / 10);
  const one = num % 10;
  if (one === 0) return TENS[ten];
  return `${TENS[ten]}-${ONES[one].toLowerCase()}`;
}

/**
 * Returns the family-friendly spoken phrase for a Housie number in the selected language.
 */
export function getCalloutPhrase(num: number, language: LanguageId = 'en'): string {
  if (language === 'hi') {
    return CALLOUTS_HI[num] ?? numberToWords(num, 'hi');
  }
  if (language === 'pa') {
    return CALLOUTS_PA[num] ?? numberToWords(num, 'pa');
  }
  return CALLOUTS_EN[num] ?? numberToWords(num, 'en');
}

/**
 * Speaks a called Housie number aloud using Web Speech API in the chosen language.
 */
export function speakCallout(num: number, language: LanguageId = 'en'): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    const synth = window.speechSynthesis;
    synth.cancel();
    const targetLang = LANG_TAGS[language];
    const utterance = new SpeechSynthesisUtterance(getCalloutPhrase(num, language));
    utterance.lang = targetLang;
    utterance.rate = 0.94;
    utterance.pitch = 1.04;
    utterance.volume = 1;

    const voices = synth.getVoices?.() ?? [];
    if (voices.length > 0) {
      const langPrefix = targetLang.split('-')[0].toLowerCase();
      const matchedVoice =
        voices.find((v) => v.lang.toLowerCase() === targetLang.toLowerCase()) ||
        voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
    }

    synth.speak(utterance);
  } catch {
    // Ignore speech synthesis failures
  }
}

export function stopSpeech(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // Ignore
  }
}
