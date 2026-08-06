// Enn's own strings, English and Tamil. Band names use the source chart's own
// Tamil wording (see numerology.js) rather than a machine translation of the
// English gloss. Everything else here is a best-effort UI translation — not
// professionally reviewed Tamil, but real script and grammar, not placeholder text.
export const STRINGS = {
  en: {
    toggleDark: 'Toggle dark mode',
    viewHistory: 'View search history',
    backToTop: 'Back to plate & range',
    plate: 'Plate',
    plateFormatHint: 'AA99AA or AA99A — last box is optional',
    range: 'Range',
    recent: 'Recent',
    calculate: 'Calculate',
    calculating: 'Calculating…',
    calculatingCount: (n) => `Still calculating — ${n} so far…`,
    searchPlaceholder: 'Search number…',
    tiles: 'Tiles',
    ledger: 'Ledger',
    scan: 'Scan',
    scanAxisNote: 'Row = last digit (0–9) · Column = decade · click any cell to open its breakdown',
    scanScrollNote: 'Ranges wider than 100 numbers scroll horizontally here — one column per ten numbers.',
    scanMobileFallback: 'Scan needs a wider screen to stay readable — switch to Tiles or Ledger, or view on a tablet or larger.',
    migaBadge: (n, first) => `${n} highly auspicious (Miga Miga Adhishtam) number${n === 1 ? '' : 's'} in this range — first at ${first}`,
    enterPrompt: 'Enter a plate and range on the left, then Calculate.',
    noMatch: 'No results match this filter.',
    selectPrompt: 'Select a result to see its arithmetic breakdown.',
    seriesTotal: 'Series total',
    finalTotal: 'Final total',
    digitSumOf: (n) => `Digit sum of ${n}`,
    reducesVia: (path) => `Reduces: ${path.join(' → ')}`,
    resultDetail: 'Result detail',
    close: 'Close',
    compare: 'Compare',
    pinnedOf: (n) => `${n} of 4 pinned`,
    pin: (n) => `Pin ${n} to comparison`,
    unpin: (n) => `Unpin ${n} from comparison`,
    noHistory: 'No searches yet — run a calculation to build history.',
    historyLine: (from, to, count) => `${from}–${to} · ${count} results`,
    justNow: 'just now',
    minutesAgo: (n) => `${n}m ago`,
    hoursAgo: (n) => `${n}h ago`,
    daysAgo: (n) => `${n}d ago`,
    tableSeries: 'Series',
    tableNumber: 'Number',
    tableTotal: 'Total',
    tableBand: 'Band',
    tableCaption: 'Numerology results, one row per candidate registration number',
    errors: {
      INVALID_SERIES: 'Series must be in format AA99AA (two letters, two digits, two letters).',
      INVALID_RANGE: 'From and To must be 4-digit numbers (1000–9999).',
      TO_BEFORE_FROM: 'To must be greater than or equal to From.',
    },
    seo: {
      eyebrow: 'About',
      whatIsHeading: 'What is vehicle numerology?',
      whatIsBody:
        "எண் கணிதம் (vehicle-plate numerology) is a Tamil tradition of scoring a registration number by converting its letters and digits to numeric values and summing them. Enn is a vehicle numerology calculator that automates this scoring — instead of checking one number by hand, it scans a whole range of candidates at once and ranks them by the resulting luck band.",
      howHeading: 'How this vehicle numerology calculator works',
      howSteps: [
        'Enter your plate series — the two letters, two digits, and one or two trailing letters shared by every number you’re choosing between.',
        'Set the range of candidate numbers, from a 4-digit low to a 4-digit high.',
        'Press Calculate — Enn scores every number in the range in your browser, with no server round trip.',
        'Scan the results by band, or click any number to see its full arithmetic breakdown.',
      ],
      bandsHeading: 'Luck bands, best to worst',
      bandMeanings: {
        miga: 'Highly auspicious',
        adhishtam: 'Auspicious',
        sumar: 'Moderate',
        dhuradhishtam: 'Weak luck',
        sodhanai: 'Testing / trials',
        abathu: 'Inauspicious',
      },
      faqHeading: 'Frequently asked questions',
      faq: [
        {
          q: 'What is vehicle numerology (எண் கணிதம்)?',
          a: 'எண் கணிதம் is a Tamil tradition of scoring a vehicle’s registration number by converting its letters and digits to numeric values, summing them, and classifying the total into a named luck band. Enn automates that scoring for a whole range of candidate numbers at once.',
        },
        {
          q: 'How do I calculate the numerology of my vehicle number?',
          a: 'Type your plate series (e.g. TN 09 AB) into the boxes on the left, set the number range you’re choosing between, and press Calculate — Enn scores every number in that range instantly.',
        },
        {
          q: 'What is the best number for my vehicle?',
          a: 'There’s no single "best" number — it depends on your plate series, since the same digits total differently once the series letters are added in. Run your series through Enn’s range scan to see which specific numbers land in the Miga Miga Adhishtam (highly auspicious) band.',
        },
        {
          q: 'Is vehicle numerology the same as astrology?',
          a: 'No — this is a numeric chart tradition (எண் கணிதம்), not astrology. Enn presents results neutrally as a traditional reference rather than advice, since how much weight to give them is a personal choice.',
        },
        {
          q: 'Does Enn save or send my data anywhere?',
          a: 'No. Every calculation runs in your browser — there’s no server and no account. Your recent searches are kept only in that browser’s local storage.',
        },
      ],
    },
  },
  ta: {
    toggleDark: 'இருள் பயன்முறை',
    viewHistory: 'தேடல் வரலாறு',
    backToTop: 'வாகன எண் மற்றும் வரம்புக்குத் திரும்பு',
    plate: 'வாகன எண்',
    plateFormatHint: 'AA99AA அல்லது AA99A — கடைசி பெட்டி விருப்பத்தேர்வு',
    range: 'வரம்பு',
    recent: 'சமீபத்தியவை',
    calculate: 'கணக்கிடு',
    calculating: 'கணக்கிடுகிறது…',
    calculatingCount: (n) => `இன்னும் கணக்கிடுகிறது — இதுவரை ${n}…`,
    searchPlaceholder: 'எண்ணைத் தேடு…',
    tiles: 'அட்டைகள்',
    ledger: 'பட்டியல்',
    scan: 'வருடல்',
    scanAxisNote: 'வரிசை = கடைசி இலக்கம் (0–9) · நிரல் = பத்தாண்டு · விவரங்களைக் காண எந்த கட்டத்தையும் அழுத்தவும்',
    scanScrollNote: '100-க்கும் அதிகமான எண்கள் கொண்ட வரம்புகள் இங்கு கிடைமட்டமாக உருளும் — ஒவ்வொரு பத்திற்கும் ஒரு நிரல்.',
    scanMobileFallback: 'வருடல் காட்சிக்கு அகன்ற திரை தேவை — அட்டைகள் அல்லது பட்டியலுக்கு மாறவும், அல்லது இதைப் பெரிய திரையில் காணவும்.',
    migaBadge: (n, first) => `இந்த வரம்பில் ${n} மிக மிக அதிர்ஷ்டமான எண்கள் உள்ளன — முதலாவது ${first}`,
    enterPrompt: 'இடதுபுறம் வாகன எண்ணையும் வரம்பையும் உள்ளிட்டு, கணக்கிடு-வை அழுத்தவும்.',
    noMatch: 'இந்த வடிகட்டலுக்குப் பொருந்தும் முடிவுகள் இல்லை.',
    selectPrompt: 'கணக்கீட்டு விவரங்களைக் காண ஒரு முடிவைத் தேர்ந்தெடுக்கவும்.',
    seriesTotal: 'வாகன எண் கூட்டுத்தொகை',
    finalTotal: 'இறுதி எண்',
    digitSumOf: (n) => `${n}-ன் இலக்க கூட்டுத்தொகை`,
    reducesVia: (path) => `குறைப்பு: ${path.join(' → ')}`,
    resultDetail: 'முடிவு விவரம்',
    close: 'மூடு',
    compare: 'ஒப்பிடு',
    pinnedOf: (n) => `4-இல் ${n} பொருத்தப்பட்டவை`,
    pin: (n) => `${n}-ஐ ஒப்பீட்டில் பொருத்து`,
    unpin: (n) => `${n}-ஐ ஒப்பீட்டிலிருந்து அகற்று`,
    noHistory: 'இதுவரை தேடல்கள் இல்லை — கணக்கிட்டு வரலாற்றை உருவாக்கவும்.',
    historyLine: (from, to, count) => `${from}–${to} · ${count} முடிவுகள்`,
    justNow: 'இப்போதுதான்',
    minutesAgo: (n) => `${n} நிமிடங்களுக்கு முன்`,
    hoursAgo: (n) => `${n} மணி நேரத்திற்கு முன்`,
    daysAgo: (n) => `${n} நாட்களுக்கு முன்`,
    tableSeries: 'வாகன எண்',
    tableNumber: 'எண்',
    tableTotal: 'மொத்தம்',
    tableBand: 'விளைவு',
    tableCaption: 'எண் கணித முடிவுகள், ஒவ்வொரு வரிசையும் ஒரு வேட்பு பதிவு எண்ணுக்கானது',
    errors: {
      INVALID_SERIES: 'வாகன எண் AA99AA வடிவத்தில் இருக்க வேண்டும் (இரண்டு எழுத்துகள், இரண்டு இலக்கங்கள், இரண்டு எழுத்துகள்).',
      INVALID_RANGE: 'From மற்றும் To ஆகியவை 4-இலக்க எண்களாக இருக்க வேண்டும் (1000–9999).',
      TO_BEFORE_FROM: 'To, From-ஐ விடப் பெரிதாகவோ சமமாகவோ இருக்க வேண்டும்.',
    },
    seo: {
      eyebrow: 'அறிமுகம்',
      whatIsHeading: 'வாகன எண் கணிதம் என்றால் என்ன?',
      whatIsBody:
        'எண் கணிதம் (வாகன எண் தொடர் எண் கணிதம்) என்பது ஒரு வாகனத்தின் பதிவு எண்ணை, அதன் எழுத்துகள் மற்றும் இலக்கங்களை எண் மதிப்புகளாக மாற்றி, கூட்டி, இறுதி எண்ணை ஒரு பெயரிடப்பட்ட அதிர்ஷ்ட வரிசைக்குள் வகைப்படுத்தும் தமிழ் மரபு ஆகும். Enn இந்த கணக்கீட்டை ஒரே நேரத்தில் பல வேட்பு எண்களுக்கும் தானாகச் செய்கிறது.',
      howHeading: 'இந்த வாகன எண் கணிதக் கருவி எப்படி வேலை செய்கிறது',
      howSteps: [
        'இடதுபுறம் உங்கள் வாகன எண் தொடரை உள்ளிடவும் — நீங்கள் தேர்ந்தெடுக்கும் ஒவ்வொரு எண்ணுக்கும் பொதுவான இரண்டு எழுத்துகள், இரண்டு இலக்கங்கள், மற்றும் ஒன்று அல்லது இரண்டு கடைசி எழுத்துகள்.',
        '4-இலக்க குறைந்த மற்றும் அதிக எண்களுடன் வேட்பு எண்களின் வரம்பை அமைக்கவும்.',
        'கணக்கிடு-வை அழுத்தவும் — வரம்பில் உள்ள ஒவ்வொரு எண்ணையும் Enn உங்கள் உலாவியிலேயே மதிப்பிடும், சேவையகத்திற்குச் செல்லாமல்.',
        'வரிசை வாரியாக முடிவுகளை பாருங்கள், அல்லது எந்த எண்ணையும் அழுத்தி அதன் முழு கணக்கீட்டு விவரத்தையும் காணவும்.',
      ],
      bandsHeading: 'அதிர்ஷ்ட வரிசைகள், சிறந்ததில் இருந்து குறைந்ததற்கு',
      bandMeanings: {
        miga: 'மிகவும் சிறப்பானது',
        adhishtam: 'சிறப்பானது',
        sumar: 'மிதமானது',
        dhuradhishtam: 'பலவீனமான அதிர்ஷ்டம்',
        sodhanai: 'சோதனைக்குரியது',
        abathu: 'அசுபமானது',
      },
      faqHeading: 'அடிக்கடி கேட்கப்படும் கேள்விகள்',
      faq: [
        {
          q: 'வாகன எண் கணிதம் (எண் கணிதம்) என்றால் என்ன?',
          a: 'எண் கணிதம் என்பது ஒரு வாகனத்தின் பதிவு எண்ணை, அதன் எழுத்துகள் மற்றும் இலக்கங்களை எண் மதிப்புகளாக மாற்றி, கூட்டி, இறுதி எண்ணை ஒரு பெயரிடப்பட்ட அதிர்ஷ்ட வரிசைக்குள் வகைப்படுத்தும் தமிழ் மரபு ஆகும். Enn இந்த கணக்கீட்டை ஒரே நேரத்தில் பல வேட்பு எண்களுக்கும் தானாகச் செய்கிறது.',
        },
        {
          q: 'எனது வாகன எண்ணின் எண் கணிதத்தை எப்படி கணக்கிடுவது?',
          a: 'இடதுபுறம் உள்ள பெட்டிகளில் உங்கள் வாகன எண் தொடரை (எ.கா. TN 09 AB) உள்ளிட்டு, நீங்கள் தேர்ந்தெடுக்கும் எண் வரம்பை அமைத்து, கணக்கிடு-வை அழுத்தவும் — அந்த வரம்பில் உள்ள ஒவ்வொரு எண்ணையும் Enn உடனடியாக மதிப்பிடும்.',
        },
        {
          q: 'எனது வாகனத்திற்கு சிறந்த எண் எது?',
          a: 'ஒரே ஒரு "சிறந்த" எண் என்று இல்லை — இது உங்கள் வாகன எண் தொடரைப் பொறுத்தது, ஏனெனில் தொடர் எழுத்துகள் சேர்க்கப்படும்போது ஒரே இலக்கங்கள் வேறு கூட்டுத்தொகையைத் தரும். உங்கள் தொடரை Enn-இல் இயக்கி, எந்த எண்கள் மிக மிக அதிர்ஷ்டம் வரிசையில் விழுகின்றன என்று பாருங்கள்.',
        },
        {
          q: 'வாகன எண் கணிதம் ஜோதிடத்தைப் போன்றதா?',
          a: 'இல்லை — இது ஒரு எண் விளக்கப்பட மரபு (எண் கணிதம்), ஜோதிடம் அல்ல. Enn முடிவுகளை அறிவுரையாக அல்லாமல் ஒரு பாரம்பரிய குறிப்பாக நடுநிலையாக வழங்குகிறது.',
        },
        {
          q: 'Enn எனது தரவை சேமிக்கிறதா அல்லது எங்காவது அனுப்புகிறதா?',
          a: 'இல்லை. ஒவ்வொரு கணக்கீடும் உங்கள் உலாவியில் மட்டுமே நடைபெறுகிறது — சேவையகமோ கணக்கோ இல்லை. உங்கள் சமீபத்திய தேடல்கள் அந்த உலாவியின் local storage-இல் மட்டுமே சேமிக்கப்படுகின்றன.',
        },
      ],
    },
  },
}

export function translate(lang, key, ...args) {
  const dict = STRINGS[lang] ?? STRINGS.en
  const entry = dict[key] ?? STRINGS.en[key]
  return typeof entry === 'function' ? entry(...args) : entry
}

export function translateError(lang, code) {
  const dict = STRINGS[lang] ?? STRINGS.en
  return dict.errors[code] ?? STRINGS.en.errors[code] ?? code
}
