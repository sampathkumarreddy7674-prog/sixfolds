export type IVRLanguage = 'Tamil' | 'Telugu' | 'Hindi' | 'English';

export interface IVROptionDef {
  key: number;
  label: string;
  native?: string;
  desc?: string;
}

export interface IVRPromptContent {
  title: string;
  subtitle: string;
  text: string;
  speechText: string;
  phoneticSpeech?: string;
  options: IVROptionDef[];
}

export const IVR_INITIAL_GREETING = {
  text: 'Welcome to AgriResolve. தமிழுக்கு 1ஐ அழுத்தவும். తెలుగు కోసం 2 నొక్కండి. हिन्दी के लिए 3 दबाएं. For English press 4.',
  speechText: 'Welcome to AgriResolve. தமிழுக்கு ஒன்று அழுத்தவும். తెలుగు కోసం రెండు నొక్కండి. हिन्दी के लिए तीन दबाएं. For English press four.'
};

export const IVR_TRANSLATIONS: Record<IVRLanguage, Record<string, (params?: any) => IVRPromptContent>> = {
  Tamil: {
    CHECK_CALLER: () => ({
      title: 'அழைப்பாளர் சரிபார்ப்பு',
      subtitle: 'படி 2: விவசாயி வகை',
      text: 'அக்ரி ரிசால்வுக்கு வரவேற்கிறோம். நீங்கள் புதிய விவசாயியா அல்லது ஏற்கனவே பதிவு செய்த விவசாயியா? புதிய விவசாயி பதிவுக்கு 1ஐ அழுத்தவும். பதிவு செய்த விவசாயிக்கு 2ஐ அழுத்தவும்.',
      speechText: 'அக்ரி ரிசால்வுக்கு வரவேற்கிறோம். நீங்கள் புதிய விவசாயியா அல்லது ஏற்கனவே பதிவு செய்த விவசாயியா? புதிய விவசாயி பதிவுக்கு ஒன்று அழுத்தவும். பதிவு செய்த விவசாயிக்கு இரண்டு அழுத்தவும்.',
      options: [
        { key: 1, label: 'புதிய விவசாயி', desc: 'முதல் முறை அழைப்பு / பதிவு செய்ய' },
        { key: 2, label: 'பதிவு செய்த விவசாயி', desc: 'ஏற்கனவே உள்ள பயனர் (ரமேஷ் குமார்)' },
      ]
    }),
    NEW_NAME: () => ({
      title: 'புதிய விவசாயி பதிவு',
      subtitle: 'கேள்வி 1: பெயர்',
      text: 'உங்கள் பெயரை தேர்ந்தெடுக்கவும்: 1 - முருகன் செல்வம், 2 - லட்சுமி தேவி, 3 - ரத்தன் சிங், 4 - ராஜேஷ் படேல்.',
      speechText: 'தயவுசெய்து உங்கள் பெயரை தேர்ந்தெடுக்கவும். முருகன் செல்வம் என்பதற்கு ஒன்று, லட்சுமி தேவி என்பதற்கு இரண்டு, ரத்தன் சிங் என்பதற்கு மூன்று, ராஜேஷ் படேல் என்பதற்கு நான்கு அழுத்தவும்.',
      options: [
        { key: 1, label: 'முருகன் செல்வம்', desc: 'விவசாயி மாதிரி 1' },
        { key: 2, label: 'லட்சுமி தேவி', desc: 'விவசாயி மாதிரி 2' },
        { key: 3, label: 'ரத்தன் சிங்', desc: 'விவசாயி மாதிரி 3' },
        { key: 4, label: 'ராஜேஷ் படேல்', desc: 'விவசாயி மாதிரி 4' },
      ]
    }),
    NEW_VILLAGE: (p) => ({
      title: 'புதிய விவசாயி பதிவு',
      subtitle: 'கேள்வி 2: கிராமம் / மாவட்டம்',
      text: `விவசாயி: ${p?.name || 'விவசாயி'}. உங்கள் கிராமத்தை தேர்ந்தெடுக்கவும்: 1 - காவேரிப்பட்டினம், 2 - பாபநாசம், 3 - அலையர், 4 - ராம்பூர்.`,
      speechText: 'உங்கள் கிராமத்தை தேர்ந்தெடுக்கவும். காவேரிப்பட்டினம் என்பதற்கு ஒன்று, பாபநாசம் என்பதற்கு இரண்டு, அலையர் என்பதற்கு மூன்று, ராம்பூர் என்பதற்கு நான்கு அழுத்தவும்.',
      options: [
        { key: 1, label: 'காவேரிப்பட்டினம்', desc: 'கிருஷ்ணகிரி மாவட்டம்' },
        { key: 2, label: 'பாபநாசம்', desc: 'தஞ்சாவூர் மாவட்டம்' },
        { key: 3, label: 'அலையர்', desc: 'ஜங்கான் மாவட்டம்' },
        { key: 4, label: 'ராம்பூர்', desc: 'உத்தர பிரதேசம்' },
      ]
    }),
    NEW_CROP: () => ({
      title: 'புதிய விவசாயி பதிவு',
      subtitle: 'கேள்வி 3: சாகுபடி பயிர்',
      text: 'நீங்கள் பயிரிடும் முக்கிய பயிர் எது? 1 - நெல், 2 - பருத்தி, 3 - தர்பூசணி, 4 - மக்காச்சோளம்.',
      speechText: 'உங்கள் முக்கிய பயிரை தேர்ந்தெடுக்கவும். நெல் சாகுபடிக்கு ஒன்று, பருத்திக்கு இரண்டு, தர்பூசணிக்கு மூன்று, மக்காச்சோளத்திற்கு நான்கு அழுத்தவும்.',
      options: [
        { key: 1, label: 'நெல் (அரிசி)', desc: 'தானிய பயிர்' },
        { key: 2, label: 'பருத்தி', desc: 'வணிக பணப்பயிர்' },
        { key: 3, label: 'தர்பூசணி', desc: 'தோட்டக்கலை பழப்பயிர்' },
        { key: 4, label: 'மக்காச்சோளம்', desc: 'தீவன / தானிய பயிர்' },
      ]
    }),
    NEW_LAND_AREA: () => ({
      title: 'புதிய விவசாயி பதிவு',
      subtitle: 'கேள்வி 4: நில பரப்பளவு',
      text: 'உங்கள் நிலத்தின் மொத்த பரப்பளவு எவ்வளவு? 1 - 1 ஏக்கர், 2 - 2.5 ஏக்கர், 3 - 5 ஏக்கர், 4 - 10 ஏக்கர்.',
      speechText: 'உங்கள் நில பரப்பளவை தேர்ந்தெடுக்கவும். ஒரு ஏக்கருக்கு ஒன்று, இரண்டரை ஏக்கருக்கு இரண்டு, ஐந்து ஏக்கருக்கு மூன்று, பத்து ஏக்கருக்கு நான்கு அழுத்தவும்.',
      options: [
        { key: 1, label: '1.0 ஏக்கர்', desc: 'குறு விவசாயி' },
        { key: 2, label: '2.5 ஏக்கர்', desc: 'சிறு விவசாயி' },
        { key: 3, label: '5.0 ஏக்கர்', desc: 'நடுத்தர நிலம்' },
        { key: 4, label: '10.0 ஏக்கர்', desc: 'பெரிய நிலம்' },
      ]
    }),
    NEW_IRRIGATION: () => ({
      title: 'புதிய விவசாயி பதிவு',
      subtitle: 'கேள்வி 5: பாசன முறை',
      text: 'உங்கள் பயிருக்கு என்ன பாசன முறையை பயன்படுத்துகிறீர்கள்? 1 - சொட்டு நீர் பாசனம், 2 - கால்வாய் பாசனம், 3 - ஆழ்துளை கிணறு, 4 - மானாவாரி.',
      speechText: 'பாசன முறையை தேர்ந்தெடுக்கவும். சொட்டு நீர் பாசனத்திற்கு ஒன்று, கால்வாய் பாசனத்திற்கு இரண்டு, ஆழ்துளை கிணற்றுக்கு மூன்று, மானாவாரி மழைக்கு நான்கு அழுத்தவும்.',
      options: [
        { key: 1, label: 'சொட்டு நீர் பாசனம்', desc: 'துல்லிய பாசனம்' },
        { key: 2, label: 'கால்வாய் / வெள்ள பாசனம்', desc: 'தரைவழி பாசனம்' },
        { key: 3, label: 'ஆழ்துளை கிணறு / பம்ப்', desc: 'நிலத்தடி நீர்' },
        { key: 4, label: 'மானாவாரி', desc: 'மழை சார்ந்த விவசாயம்' },
      ]
    }),
    NEW_CONSENT: () => ({
      title: 'புதிய விவசாயி பதிவு',
      subtitle: 'கேள்வி 6: ஒப்புதல்',
      text: 'வேளாண் ஆலோசனை மற்றும் சந்தை ஆதரவு பெற உங்கள் விவரங்களை அக்ரி ரிசால்வில் சேமிக்க சம்மதிக்கிறீர்களா? ஆம் என்பதற்கு 1ஐ அழுத்தவும், இல்லை என்பதற்கு 2ஐ அழுத்தவும்.',
      speechText: 'விவசாய ஆலோசனை பெற உங்கள் விவரங்களை சேமிக்க ஒப்புக்கொள்கிறீர்களா? ஆம் என்பதற்கு ஒன்று, இல்லை என்பதற்கு இரண்டு அழுத்தவும்.',
      options: [
        { key: 1, label: 'ஆம், ஒப்புதல் அளிக்கிறேன்', desc: 'விவரங்களை சேமிக்க அனுமதி' },
        { key: 2, label: 'இல்லை, சேமிக்க வேண்டாம்', desc: 'தற்காலிக ஒருமுறை அழைப்பு' },
      ]
    }),
    NEW_SAVING: () => ({
      title: 'விவரங்கள் சேமிக்கப்படுகின்றன...',
      subtitle: 'அக்ரி ரிசால்வ் பதிவுத்தளம்',
      text: 'உங்கள் விவசாய விவரங்கள் அக்ரி ரிசால்வில் வெற்றிகரமாக சேமிக்கப்படுகின்றன. காத்திருக்கவும்...',
      speechText: 'உங்கள் விவரங்கள் அக்ரி ரிசால்வில் சேமிக்கப்படுகின்றன. தயவுசெய்து காத்திருக்கவும்.',
      options: [
        { key: 1, label: 'பிரச்சனை பதிவுக்கு தொடரவும்', desc: 'அடுத்த படிக்கு செல்ல' }
      ]
    }),
    NEW_PROBLEM: () => ({
      title: 'விவசாய பிரச்சனை விபரம்',
      subtitle: 'கேள்வி 7: உங்கள் பிரச்சனை',
      text: 'இன்று நீங்கள் என்ன விவசாய பிரச்சனையை எதிர்கொள்கிறீர்கள்? 1 - பூச்சி மற்றும் நோய் தாக்குதல், 2 - இலைகள் மஞ்சள் நிறமாதல், 3 - நீர் பற்றாக்குறை பாசன ஆலோசனை, 4 - உர பரிந்துரை முரண்பாடு.',
      speechText: 'இன்று நீங்கள் என்ன விவசாய பிரச்சனையை எதிர்கொள்கிறீர்கள்? பூச்சி தாக்குதலுக்கு ஒன்று, இலை மஞ்சள் நிறத்திற்கு இரண்டு, நீர் பற்றாக்குறைக்கு மூன்று, உர பரிந்துரை முரண்பாட்டிற்கு நான்கு அழுத்தவும்.',
      options: [
        { key: 1, label: 'பூச்சி மற்றும் நோய் தாக்குதல்', desc: 'இலை புழு, தண்டு துளைப்பான்' },
        { key: 2, label: 'இலைகள் மஞ்சள் நிறமாதல்', desc: 'நுண்ணூட்டச்சத்து குறைபாடு' },
        { key: 3, label: 'நீர் பற்றாக்குறை & பாசன ஆலோசனை', desc: 'ஈரப்பத அழுத்தம்' },
        { key: 4, label: 'உர பரிந்துரை முரண்பாடு', desc: 'முரண்பட்ட உர அளவுகள்' },
      ]
    }),
    NEW_SHOW_PROBLEM: (p) => ({
      title: 'விவசாயியின் பிரச்சனை பதிவு',
      subtitle: 'சரிபார்ப்பு',
      text: `பதிவு செய்யப்பட்ட பிரச்சனை: "${p?.problem || ''}". உங்கள் கோரிக்கையை உறுதி செய்ய 1ஐ அழுத்தவும்.`,
      speechText: `உங்கள் பிரச்சனை பதிவு செய்யப்பட்டது. கோரிக்கையை உறுதி செய்ய ஒன்று அழுத்தவும்.`,
      options: [
        { key: 1, label: 'கோரிக்கையை உறுதி செய்க', desc: 'டோக்கன் எண் உருவாக்க' },
        { key: 2, label: 'பிரச்சனையை மாற்றுக', desc: 'வேறு பிரச்சனையை தேர்வு செய்ய' }
      ]
    }),
    NEW_REQUEST_RECEIVED: (p) => ({
      title: 'உங்கள் கோரிக்கை பெறப்பட்டது.',
      subtitle: 'குறிப்பு எண் உருவாக்கப்பட்டது',
      text: `உங்கள் கோரிக்கை வெற்றிகரமாக பெறப்பட்டது. டோக்கன் எண் #${p?.ticketId || 'AR-IVR'}. எங்கள் வேளாண்மை அலுவலர் உங்களை தொடர்புகொள்வார். அழைப்பை முடிக்க 1ஐ அல்லது End Call அழுத்தவும்.`,
      speechText: `உங்கள் கோரிக்கை பெறப்பட்டது. எங்கள் வேளாண்மை அலுவலர் விரைவில் உங்களை தொடர்புகொள்வார். நன்றி.`,
      options: [
        { key: 1, label: 'அழைப்பை முடிக்கவும்', desc: 'கால் முடிந்தது' }
      ]
    }),
    EXISTING_WELCOME: (p) => ({
      title: 'அக்ரி ரிசால்வுக்கு மீண்டும் வரவேற்கிறோம்.',
      subtitle: `அழைப்பாளர்: ${p?.name || 'ரமேஷ் குமார்'} (${p?.phone || '+91 98450 12345'})`,
      text: 'அக்ரி ரிசால்வுக்கு மீண்டும் வரவேற்கிறோம். உங்கள் சுயவிவரம் கண்டறியப்பட்டது. நில விபரங்களை ஏற்ற 1ஐ அழுத்தவும்.',
      speechText: 'அக்ரி ரிசால்வுக்கு மீண்டும் வரவேற்கிறோம் திரு ரமேஷ் குமார். உங்கள் நில விபரங்களை பெற ஒன்று அழுத்தவும்.',
      options: [
        { key: 1, label: 'நில தேர்வுக்கு தொடரவும்', desc: 'பதிவு செய்த நிலங்கள்' }
      ]
    }),
    EXISTING_LAND_SELECT: (p) => ({
      title: 'பல நிலங்கள் பதிவு செய்யப்பட்டுள்ளன',
      subtitle: 'நிலத்தை தேர்ந்தெடுக்கவும்',
      text: `உங்கள் பெயரில் 2 நிலங்கள் உள்ளன. எந்த நிலத்திற்கான ஆலோசனை தேவை? 1 - ${p?.land1Name || 'நிலம் 1: தர்பூசணி'}, 2 - ${p?.land2Name || 'நிலம் 2: மக்காச்சோளம்'}.`,
      speechText: `உங்கள் கணக்கில் இரண்டு நிலங்கள் உள்ளன. நிலம் ஒன்றுக்கு ஒன்று அழுத்தவும். நிலம் இரண்டுக்கு இரண்டு அழுத்தவும்.`,
      options: [
        { key: 1, label: p?.land1Name || 'நிலம் 1: தர்பூசணி தோட்டம்', desc: 'தர்பூசணி • 2 ஏக்கர்' },
        { key: 2, label: p?.land2Name || 'நிலம் 2: மேட்டு நிலம்', desc: 'மக்காச்சோளம் • 3 ஏக்கர்' }
      ]
    }),
    EXISTING_PROBLEM: (p) => ({
      title: 'விவசாய பிரச்சனை விபரம்',
      subtitle: `நிலம்: ${p?.selectedLandName || 'நிலம் 1'} (${p?.crop || 'தர்பூசணி'})`,
      text: 'தேர்ந்தெடுக்கப்பட்ட நிலத்தில் என்ன விவசாய பிரச்சனையை எதிர்கொள்கிறீர்கள்? 1 - காய் புழு தாக்குதல், 2 - மழை எச்சரிக்கையுடன் பாசன முரண்பாடு, 3 - உர பரிந்துரை முரண்பாடு, 4 - இலை கருகல் நோய்.',
      speechText: 'தேர்ந்தெடுக்கப்பட்ட பயிரில் என்ன பிரச்சனையை எதிர்கொள்கிறீர்கள்? காய் புழுவிற்கு ஒன்று, பாசன முரண்பாட்டிற்கு இரண்டு, உர முரண்பாட்டிற்கு மூன்று, இலை கருகலுக்கு நான்கு அழுத்தவும்.',
      options: [
        { key: 1, label: 'காய் புழு தாக்குதல்', desc: 'வளரும் காய்களில் புழு' },
        { key: 2, label: 'பாசன நேர முரண்பாடு', desc: 'மழை முன்னறிவிப்பு vs உலர் மண்' },
        { key: 3, label: 'உர பரிந்துரை முரண்பாடு', desc: 'யூரியா மற்றும் டிஏபி அளவு' },
        { key: 4, label: 'இலை கருகல் நோய்', desc: 'ஈரப்பதத்தால் பூஞ்சான புள்ளிகள்' }
      ]
    }),
    EXISTING_CREATE_REQUEST: (p) => ({
      title: 'ஆதரவு கோரிக்கை உருவாக்கப்பட்டது',
      subtitle: `டிக்கெட் எண்: #${p?.ticketId || 'AR-SUP'}`,
      text: `உங்கள் ஆதரவு கோரிக்கை #${p?.ticketId || 'AR-SUP'} வெற்றிகரமாக உருவாக்கப்பட்டது. வேளாண் வல்லுநர் நியமிக்கப்பட்டுள்ளார். அழைப்பை முடிக்க 1ஐ அழுத்தவும்.`,
      speechText: `ஆதரவு கோரிக்கை பதிவு செய்யப்பட்டு வேளாண் நிபுணர் நியமிக்கப்பட்டுள்ளார். அழைத்ததற்கு நன்றி.`,
      options: [
        { key: 1, label: 'அழைப்பை முடிக்கவும்', desc: 'முடிந்தது' }
      ]
    }),
    CALL_ENDED: () => ({
      title: 'அழைப்பு முடிந்தது',
      subtitle: 'அழைப்பு துண்டிக்கப்பட்டது',
      text: 'அக்ரி ரிசால்வ் உதவி மையத்தை அழைத்ததற்கு நன்றி. அழைப்பு முடிந்தது.',
      speechText: 'அக்ரி ரிசால்வ் உதவி மையத்தை அழைத்ததற்கு நன்றி. வணக்கம்.',
      options: []
    })
  },

  Telugu: {
    CHECK_CALLER: () => ({
      title: 'కాలర్ ధృవీకరణ',
      subtitle: 'దశ 2: రైతు రకం',
      text: 'అగ్రిరిసాల్వ్‌కి స్వాగతం. మీరు కొత్త రైతులా లేదా ఇప్పటికే నమోదైన రైతులా? కొత్త రైతు నమోదు కోసం 1 నొక్కండి. నమోదైన రైతు కోసం 2 నొక్కండి.',
      speechText: 'అగ్రిరిసాల్వ్‌కి స్వాగతం. మీరు కొత్త రైతులా లేదా నమోదైన రైతులా? కొత్త రైతు నమోదు కోసం ఒకటి నొక్కండి. నమోదైన రైతు కోసం రెండు నొక్కండి.',
      options: [
        { key: 1, label: 'కొత్త రైతు', desc: 'మొదటిసారి కాల్ / నమోదు' },
        { key: 2, label: 'నమోదైన రైతు', desc: 'ఇప్పటికే ఉన్న వినియోగదారు (రమేష్ కుమార్)' },
      ]
    }),
    NEW_NAME: () => ({
      title: 'కొత్త రైతు నమోదు',
      subtitle: 'ప్రశ్న 1: పేరు',
      text: 'దయచేసి మీ పేరును ఎంచుకోండి: 1 - మురుగన్ సెల్వం, 2 - లక్ష్మీ దేవి, 3 - రతన్ సింగ్, 4 - రాజేష్ పటేల్.',
      speechText: 'దయచేసి మీ పేరును ఎంచుకోండి. మురుగన్ సెల్వం కోసం ఒకటి, లక్ష్మీ దేవి కోసం రెండు, రతన్ సింగ్ కోసం మూడు, రాజేష్ పటేల్ కోసం నాలుగు నొక్కండి.',
      options: [
        { key: 1, label: 'మురుగన్ సెల్వం', desc: 'రైతు నమూనా 1' },
        { key: 2, label: 'లక్ష్మీ దేవి', desc: 'రైతు నమూనా 2' },
        { key: 3, label: 'రతన్ సింగ్', desc: 'రైతు నమూనా 3' },
        { key: 4, label: 'రాజేష్ పటేల్', desc: 'రైతు నమూనా 4' },
      ]
    }),
    NEW_VILLAGE: (p) => ({
      title: 'కొత్త రైతు నమోదు',
      subtitle: 'ప్రశ్న 2: గ్రామం / జిల్లా',
      text: `రైతు: ${p?.name || 'రైతు'}. మీ గ్రామాన్ని ఎంచుకోండి: 1 - కావేరిపట్టణం, 2 - పాపనాశం, 3 - ఆలేరు, 4 - రాంపూర్.`,
      speechText: 'మీ గ్రామాన్ని ఎంచుకోండి. కావేరిపట్టణం కోసం ఒకటి, పాపనాశం కోసం రెండు, ఆలేరు కోసం మూడు, రాంపూర్ కోసం నాలుగు నొక్కండి.',
      options: [
        { key: 1, label: 'కావేరిపట్టణం', desc: 'కృష్ణగిరి జిల్లా' },
        { key: 2, label: 'పాపనాశం', desc: 'తంజావూరు జిల్లా' },
        { key: 3, label: 'ఆలేరు', desc: 'జనగామ జిల్లా' },
        { key: 4, label: 'రాంపూర్', desc: 'ఉత్తరప్రదేశ్' },
      ]
    }),
    NEW_CROP: () => ({
      title: 'కొత్త రైతు నమోదు',
      subtitle: 'ప్రశ్న 3: ప్రధాన పంట',
      text: 'మీరు సాగు చేస్తున్న ప్రధాన పంట ఏది? 1 - వరి, 2 - పత్తి, 3 - పుచ్చకాయ, 4 - మొక్కజొన్న.',
      speechText: 'మీరు సాగు చేస్తున్న పంటను ఎంచుకోండి. వరి కోసం ఒకటి, పత్తి కోసం రెండు, పుచ్చకాయ కోసం మూడు, మొక్కజొన్న కోసం నాలుగు నొక్కండి.',
      options: [
        { key: 1, label: 'వరి (ధాన్యం)', desc: 'ఖరీఫ్ / రబీ పంట' },
        { key: 2, label: 'పత్తి', desc: 'వాణిజ్య పంట' },
        { key: 3, label: 'పుచ్చకాయ', desc: 'ఉద్యానవన పంట' },
        { key: 4, label: 'మొక్కజొన్న', desc: 'ధాన్యపు పంట' },
      ]
    }),
    NEW_LAND_AREA: () => ({
      title: 'కొత్త రైతు నమోదు',
      subtitle: 'ప్రశ్న 4: భూమి విస్తీర్ణం',
      text: 'మీ భూమి విస్తీర్ణం ఎంత? 1 - 1 ఎకరం, 2 - 2.5 ఎకరాలు, 3 - 5 ఎకరాలు, 4 - 10 ఎకరాలు.',
      speechText: 'మీ భూమి విస్తీర్ణాన్ని ఎంచుకోండి. ఒక ఎకరం కోసం ఒకటి, రెండున్నర ఎకరాల కోసం రెండు, ఐదు ఎకరాల కోసం మూడు, పది ఎకరాల కోసం నాలుగు నొక్కండి.',
      options: [
        { key: 1, label: '1.0 ఎకరం', desc: 'చిన్న కమతం' },
        { key: 2, label: '2.5 ఎకరాలు', desc: 'మధ్యస్థ కమతం' },
        { key: 3, label: '5.0 ఎకరాలు', desc: 'సాధారణ కమతం' },
        { key: 4, label: '10.0 ఎకరాలు', desc: 'పెద్ద కమతం' },
      ]
    }),
    NEW_IRRIGATION: () => ({
      title: 'కొత్త రైతు నమోదు',
      subtitle: 'ప్రశ్న 5: నీటిపారుదల విధానం',
      text: 'మీ పంటకు ఏ నీటిపారుదల విధానం వాడుతున్నారు? 1 - బిందు సేద్యం (డ్రిప్), 2 - కాలువ పారుదల, 3 - బోరుబావి, 4 - వర్షాధారం.',
      speechText: 'నీటిపారుదల విధానాన్ని ఎంచుకోండి. బిందు సేద్యం కోసం ఒకటి, కాలువ పారుదల కోసం రెండు, బోరుబావి కోసం మూడు, వర్షాధారం కోసం నాలుగు నొక్కండి.',
      options: [
        { key: 1, label: 'బిందు సేద్యం (డ్రిప్)', desc: 'సూక్ష్మ సేద్యం' },
        { key: 2, label: 'కాలువ / వరద పారుదల', desc: 'భూతల పారుదల' },
        { key: 3, label: 'బోరుబావి / బావి', desc: 'భూగర్భ జలాలు' },
        { key: 4, label: 'వర్షాధారం', desc: 'వర్షంపై ఆధారపడిన పంట' },
      ]
    }),
    NEW_CONSENT: () => ({
      title: 'కొత్త రైతు నమోదు',
      subtitle: 'ప్రశ్న 6: సమ్మతి',
      text: 'వ్యవసాయ సలహాలు పొందడానికి మీ వివరాలను భద్రపరచడానికి సమ్మతిస్తున్నారా? అవును కోసం 1 నొక్కండి, కాదు కోసం 2 నొక్కండి.',
      speechText: 'వ్యవసాయ సలహాల కోసం మీ వివరాలను భద్రపరచడానికి అంగీకరిస్తున్నారా? అవును కోసం ఒకటి, కాదు కోసం రెండు నొక్కండి.',
      options: [
        { key: 1, label: 'అవును, అంగీకరిస్తున్నాను', desc: 'వివరాలు భద్రపరచడానికి అనుమతి' },
        { key: 2, label: 'కాదు, వద్దనుకుంటున్నాను', desc: 'ఒకసారి మాత్రమే' },
      ]
    }),
    NEW_SAVING: () => ({
      title: 'వివరాలు భద్రపరచబడుతున్నాయి...',
      subtitle: 'డేటాబేస్ అప్‌డేట్',
      text: 'మీ రైతు వివరాలు అగ్రిరిసాల్వ్‌లో భద్రపరచబడుతున్నాయి. దయచేసి వేచి ఉండండి...',
      speechText: 'మీ వివరాలు అగ్రిరిసాల్వ్‌లో నమోదు చేయబడుతున్నాయి. వేచి ఉండండి.',
      options: [
        { key: 1, label: 'సమస్య వివరణకు కొనసాగించండి', desc: 'తదుపరి దశ' }
      ]
    }),
    NEW_PROBLEM: () => ({
      title: 'వ్యవసాయ సమస్య వివరణ',
      subtitle: 'ప్రశ్న 7: మీ సమస్య',
      text: 'ఈరోజు మీరు ఎలాంటి వ్యవసాయ సమస్యను ఎదుర్కొంటున్నారు? 1 - పురుగులు మరియు తెగుళ్ళ దాడి, 2 - ఆకులు పసుపుబారడం, 3 - నీటి కొరత మరియు నీటిపారుదల సలహా, 4 - ఎరువుల మోతాదు వివాదం.',
      speechText: 'ఈరోజు మీరు ఎలాంటి సమస్యను ఎదుర్కొంటున్నారు? పురుగుల దాడి కోసం ఒకటి, ఆకులు పసుపుబారడానికి రెండు, నీటి కొరత కోసం మూడు, ఎరువుల వివాదం కోసం నాలుగు నొక్కండి.',
      options: [
        { key: 1, label: 'పురుగులు మరియు తెగుళ్ళ దాడి', desc: 'కాండం తొలుచు పురుగు, గొంగళి పురుగు' },
        { key: 2, label: 'ఆకులు పసుపుబారడం', desc: 'సూక్ష్మ పోషకాల లోపం' },
        { key: 3, label: 'నీటి కొరత & నీటిపారుదల సలహా', desc: 'తేమ ఒత్తిడి' },
        { key: 4, label: 'ఎరువుల మోతాదు వివాదం', desc: 'సిఫార్సులలో వ్యత్యాసం' },
      ]
    }),
    NEW_SHOW_PROBLEM: (p) => ({
      title: 'రైతు సమస్య నమోదు',
      subtitle: 'ధృవీకరణ',
      text: `నమోదైన సమస్య: "${p?.problem || ''}". మీ అభ్యర్థనను సమర్పించడానికి 1 నొక్కండి.`,
      speechText: 'మీ సమస్య నమోదు చేయబడింది. అభ్యర్థనను సమర్పించడానికి ఒకటి నొక్కండి.',
      options: [
        { key: 1, label: 'ధృవీకరించి సమర్పించండి', desc: 'టోకెన్ పొందడానికి' },
        { key: 2, label: 'సమస్యను మార్చండి', desc: 'మరొక సమస్య ఎంచుకోవడానికి' }
      ]
    }),
    NEW_REQUEST_RECEIVED: (p) => ({
      title: 'మీ అభ్యర్థన స్వీకరించబడింది.',
      subtitle: 'రిఫరెన్స్ నంబర్ కేటాయించబడింది',
      text: `మీ అభ్యర్థన స్వీకరించబడింది. టికెట్ నంబర్ #${p?.ticketId || 'AR-IVR'}. మా వ్యవసాయ నిపుణుడు మిమ్మల్ని సంప్రదిస్తారు. ముగించడానికి 1 లేదా End Call నొక్కండి.`,
      speechText: 'మీ అభ్యర్థన స్వీకరించబడింది. మా నిపుణుడు మిమ్మల్ని త్వరలో సంప్రదిస్తారు. ధన్యవాదాలు.',
      options: [
        { key: 1, label: 'కాల్ ముగించండి', desc: 'సెషన్ పూర్తి' }
      ]
    }),
    EXISTING_WELCOME: (p) => ({
      title: 'అగ్రిరిసాల్వ్‌కి తిరిగి స్వాగతం.',
      subtitle: `కాలర్: ${p?.name || 'రమేష్ కుమార్'} (${p?.phone || '+91 98450 12345'})`,
      text: 'అగ్రిరిసాల్వ్‌కి తిరిగి స్వాగతం. మీ ప్రొఫైల్ వివరాలు లోడ్ చేయబడ్డాయి. భూమి వివరాల కోసం 1 నొక్కండి.',
      speechText: 'అగ్రిరిసాల్వ్‌కి తిరిగి స్వాగతం రమేష్ కుమార్ గారు. మీ భూమి వివరాలను చూడటానికి ఒకటి నొక్కండి.',
      options: [
        { key: 1, label: 'భూమి ఎంపికకు కొనసాగించండి', desc: 'నమోదైన భూములు' }
      ]
    }),
    EXISTING_LAND_SELECT: (p) => ({
      title: 'రెండు భూములు నమోదై ఉన్నాయి',
      subtitle: 'భూమిని ఎంచుకోండి',
      text: `మీ ప్రొఫైల్‌లో 2 భూములు ఉన్నాయి. ఏ భూమి కోసం సలహా కావాలి? 1 - ${p?.land1Name || 'పొలం 1: పుచ్చకాయ'}, 2 - ${p?.land2Name || 'పొలం 2: మొక్కజొన్న'}.`,
      speechText: 'మీ ఖాతాలో రెండు భూములు ఉన్నాయి. పొలం ఒకటి కోసం ఒకటి నొక్కండి. పొలం రెండు కోసం రెండు నొక్కండి.',
      options: [
        { key: 1, label: p?.land1Name || 'పొలం 1: పుచ్చకాయ తోట', desc: 'పుచ్చకాయ • 2 ఎకరాలు' },
        { key: 2, label: p?.land2Name || 'పొలం 2: ఎత్తైన నేల', desc: 'మొక్కజొన్న • 3 ఎకరాలు' }
      ]
    }),
    EXISTING_PROBLEM: (p) => ({
      title: 'వ్యవసాయ సమస్య వివరణ',
      subtitle: `భూమి: ${p?.selectedLandName || 'పొలం 1'} (${p?.crop || 'పుచ్చకాయ'})`,
      text: 'ఎంచుకున్న భూమిలో ఎలాంటి సమస్యను ఎదుర్కొంటున్నారు? 1 - కాయ తొలుచు పురుగు, 2 - వర్షం సూచనతో నీటిపారుదల వివాదం, 3 - ఎరువుల మోతాదు వివాదం, 4 - ఆకు ముడత తెగులు.',
      speechText: 'ఎంచుకున్న పంటలో ఎలాంటి సమస్యను ఎదుర్కొంటున్నారు? కాయ తొలుచు పురుగు కోసం ఒకటి, నీటిపారుదల వివాదం కోసం రెండు, ఎరువుల వివాదం కోసం మూడు, ఆకు ముడత కోసం నాలుగు నొక్కండి.',
      options: [
        { key: 1, label: 'కాయ తొలుచు పురుగు', desc: 'కాయలపై పురుగుల దాడి' },
        { key: 2, label: 'నీటిపారుదల సమయ వివాదం', desc: 'వర్షం సూచన vs పొడి నేల' },
        { key: 3, label: 'ఎరువుల మోతాదు వివాదం', desc: 'డిఎపి మరియు యూరియా మోతాదు' },
        { key: 4, label: 'ఆకు ముడత తెగులు', desc: 'తేమ వల్ల మచ్చలు' }
      ]
    }),
    EXISTING_CREATE_REQUEST: (p) => ({
      title: 'మద్దతు అభ్యర్థన సృష్టించబడింది',
      subtitle: `టికెట్ నంబర్: #${p?.ticketId || 'AR-SUP'}`,
      text: `మీ మద్దతు అభ్యర్థన #${p?.ticketId || 'AR-SUP'} విజయవంతంగా నమోదైంది. వ్యవసాయ నిపుణుడు కేటాయించబడ్డారు. కాల్ ముగించడానికి 1 నొక్కండి.`,
      speechText: 'మద్దతు అభ్యర్థన నమోదైంది మరియు వ్యవసాయ నిపుణుడు కేటాయించబడ్డారు. ధన్యవాదాలు.',
      options: [
        { key: 1, label: 'కాల్ ముగించండి', desc: 'పూర్తయింది' }
      ]
    }),
    CALL_ENDED: () => ({
      title: 'కాల్ ముగిసింది',
      subtitle: 'కాల్ డిస్‌కనెక్ట్ చేయబడింది',
      text: 'అగ్రిరిసాల్వ్ హెల్ప్‌లైన్‌కి కాల్ చేసినందుకు ధన్యవాదాలు. కాల్ ముగిసింది.',
      speechText: 'అగ్రిరిసాల్వ్‌కి కాల్ చేసినందుకు ధన్యవాదాలు. నమస్కారం.',
      options: []
    })
  },

  Hindi: {
    CHECK_CALLER: () => ({
      title: 'कॉलर सत्यापन',
      subtitle: 'चरण 2: किसान का प्रकार',
      text: 'एग्रीरिसॉल्व में आपका स्वागत है। क्या आप नए किसान हैं या पहले से पंजीकृत किसान? नए किसान पंजीकरण के लिए 1 दबाएं। पंजीकृत किसान के लिए 2 दबाएं।',
      speechText: 'एग्रीरिसॉल्व में आपका स्वागत है। क्या आप नए किसान हैं या पंजीकृत किसान? नए किसान पंजीकरण के लिए एक दबाएं। पंजीकृत किसान के लिए दो दबाएं।',
      options: [
        { key: 1, label: 'नए किसान', desc: 'पहली बार कॉल / पंजीकरण' },
        { key: 2, label: 'पंजीकृत किसान', desc: 'मौजूदा उपयोगकर्ता (रमेश कुमार)' },
      ]
    }),
    NEW_NAME: () => ({
      title: 'नया किसान पंजीकरण',
      subtitle: 'प्रश्न 1: नाम',
      text: 'कृपया अपना नाम चुनें: 1 - मुरुगन सेल्वम, 2 - लक्ष्मी देवी, 3 - रतन सिंह, 4 - राजेश पटेल।',
      speechText: 'कृपया अपना नाम चुनें। मुरुगन सेल्वम के लिए एक, लक्ष्मी देवी के लिए दो, रतन सिंह के लिए तीन, राजेश पटेल के लिए चार दबाएं।',
      options: [
        { key: 1, label: 'मुरुगन सेल्वम', desc: 'किसान नमूना 1' },
        { key: 2, label: 'लक्ष्मी देवी', desc: 'किसान नमूना 2' },
        { key: 3, label: 'रतन सिंह', desc: 'किसान नमूना 3' },
        { key: 4, label: 'राजेश पटेल', desc: 'किसान नमूना 4' },
      ]
    }),
    NEW_VILLAGE: (p) => ({
      title: 'नया किसान पंजीकरण',
      subtitle: 'प्रश्न 2: गांव / जिला',
      text: `किसान: ${p?.name || 'किसान'}. अपना गांव चुनें: 1 - कावेरीपट्टिनम, 2 - पापनासम, 3 - अलेर, 4 - रामपुर।`,
      speechText: 'अपना गांव चुनें। कावेरीपट्टिनम के लिए एक, पापनासम के लिए दो, अलेर के लिए तीन, रामपुर के लिए चार दबाएं।',
      options: [
        { key: 1, label: 'कावेरीपट्टिनम', desc: 'कृष्णागिरि जिला' },
        { key: 2, label: 'पापनासम', desc: 'तंजावुर जिला' },
        { key: 3, label: 'अलेर', desc: 'जनगांव जिला' },
        { key: 4, label: 'रामपुर', desc: 'उत्तर प्रदेश' },
      ]
    }),
    NEW_CROP: () => ({
      title: 'नया किसान पंजीकरण',
      subtitle: 'प्रश्न 3: मुख्य फसल',
      text: 'आप कौन सी फसल उगा रहे हैं? 1 - धान (चावल), 2 - कपास, 3 - तरबूज, 4 - मक्का।',
      speechText: 'अपनी मुख्य फसल चुनें। धान के लिए एक, कपास के लिए दो, तरबूज के लिए तीन, मक्का के लिए चार दबाएं।',
      options: [
        { key: 1, label: 'धान (चावल)', desc: 'खरीफ / रबी अनाज' },
        { key: 2, label: 'कपास', desc: 'वाणिज्यिक नकदी फसल' },
        { key: 3, label: 'तरबूज', desc: 'बागवानी फल' },
        { key: 4, label: 'मक्का', desc: 'अनाज / चारा' },
      ]
    }),
    NEW_LAND_AREA: () => ({
      title: 'नया किसान पंजीकरण',
      subtitle: 'प्रश्न 4: खेत का क्षेत्रफल',
      text: 'आपके खेत का कुल क्षेत्रफल कितना है? 1 - 1 एकड़, 2 - 2.5 एकड़, 3 - 5 एकड़, 4 - 10 एकड़।',
      speechText: 'अपने खेत का क्षेत्रफल चुनें। एक एकड़ के लिए एक, ढाई एकड़ के लिए दो, पांच एकड़ के लिए तीन, दस एकड़ के लिए चार दबाएं।',
      options: [
        { key: 1, label: '1.0 एकड़', desc: 'सीमांत खेत' },
        { key: 2, label: '2.5 एकड़', desc: 'छोटा खेत' },
        { key: 3, label: '5.0 एकड़', desc: 'मध्यम खेत' },
        { key: 4, label: '10.0 एकड़', desc: 'बड़ा खेत' },
      ]
    }),
    NEW_IRRIGATION: () => ({
      title: 'नया किसान पंजीकरण',
      subtitle: 'प्रश्न 5: सिंचाई का प्रकार',
      text: 'आप कौन सी सिंचाई प्रणाली का उपयोग करते हैं? 1 - ड्रिप सिंचाई, 2 - नहर / बाढ़ सिंचाई, 3 - बोरवेल, 4 - वर्षा आधारित।',
      speechText: 'सिंचाई का प्रकार चुनें। ड्रिप सिंचाई के लिए एक, नहर सिंचाई के लिए दो, बोरवेल के लिए तीन, वर्षा आधारित के लिए चार दबाएं।',
      options: [
        { key: 1, label: 'ड्रिप सिंचाई', desc: 'सूक्ष्म सिंचाई' },
        { key: 2, label: 'नहर / बाढ़ सिंचाई', desc: 'सतही सिंचाई' },
        { key: 3, label: 'बोरवेल / ट्यूबवेल', desc: 'भूजल पंप' },
        { key: 4, label: 'वर्षा आधारित', desc: 'बारिश पर निर्भर' },
      ]
    }),
    NEW_CONSENT: () => ({
      title: 'नया किसान पंजीकरण',
      subtitle: 'प्रश्न 6: सहमति',
      text: 'कृषि सलाह और बाजार सहायता प्राप्त करने के लिए क्या आप अपनी जानकारी सहेजने की सहमति देते हैं? हाँ के लिए 1, नहीं के लिए 2 दबाएं।',
      speechText: 'कृषि सलाह प्राप्त करने के लिए अपनी जानकारी सहेजने की सहमति के लिए, हाँ के लिए एक, नहीं के लिए दो दबाएं।',
      options: [
        { key: 1, label: 'हाँ, सहमति देता हूँ', desc: 'जानकारी सहेजने की अनुमति' },
        { key: 2, label: 'नहीं, न सहेजें', desc: 'केवल एक बार के लिए' },
      ]
    }),
    NEW_SAVING: () => ({
      title: 'जानकारी सहेजी जा रही है...',
      subtitle: 'सिस्टम अपडेट',
      text: 'आपकी किसान जानकारी एग्रीरिसॉल्व में सुरक्षित रूप से सहेजी जा रही है। कृपया प्रतीक्षा करें...',
      speechText: 'आपकी जानकारी एग्रीरिसॉल्व में सहेजी जा रही है। कृपया प्रतीक्षा करें।',
      options: [
        { key: 1, label: 'समस्या विवरण जारी रखें', desc: 'अगले चरण पर जाएं' }
      ]
    }),
    NEW_PROBLEM: () => ({
      title: 'कृषि समस्या का विवरण',
      subtitle: 'प्रश्न 7: आपकी समस्या',
      text: 'आज आप किस कृषि समस्या का सामना कर रहे हैं? 1 - कीट या बीमारी का प्रकोप, 2 - पत्तियों का पीला पड़ना, 3 - पानी की कमी और सिंचाई सलाह, 4 - खाद की मात्रा में मतभेद।',
      speechText: 'आज आप किस समस्या का सामना कर रहे हैं? कीट प्रकोप के लिए एक, पीली पत्तियों के लिए दो, पानी की कमी के लिए तीन, खाद की सिफारिश में मतभेद के लिए चार दबाएं।',
      options: [
        { key: 1, label: 'कीट या बीमारी का प्रकोप', desc: 'इल्ली, तना छेदक कीट' },
        { key: 2, label: 'पत्तियों का पीला पड़ना', desc: 'पोषक तत्वों की कमी' },
        { key: 3, label: 'पानी की कमी और सिंचाई सलाह', desc: 'नमी का तनाव' },
        { key: 4, label: 'खाद की मात्रा में मतभेद', desc: 'सिफारिशों में अंतर' },
      ]
    }),
    NEW_SHOW_PROBLEM: (p) => ({
      title: 'किसान की समस्या दर्ज',
      subtitle: 'पुष्टि एवं सत्यापन',
      text: `दर्ज की गई समस्या: "${p?.problem || ''}". अपना अनुरोध सबमिट करने के लिए 1 दबाएं।`,
      speechText: 'आपकी समस्या दर्ज कर ली गई है। अनुरोध सबमिट करने के लिए एक दबाएं।',
      options: [
        { key: 1, label: 'पुष्टि करें और सबमिट करें', desc: 'टोकन संख्या प्राप्त करें' },
        { key: 2, label: 'समस्या बदलें', desc: 'अन्य समस्या चुनें' }
      ]
    }),
    NEW_REQUEST_RECEIVED: (p) => ({
      title: 'आपका अनुरोध प्राप्त हो गया है।',
      subtitle: 'संदर्भ संख्या जारी',
      text: `आपका अनुरोध सफलतापूर्वक प्राप्त हो गया है। संदर्भ टिकट #${p?.ticketId || 'AR-IVR'}. हमारे कृषि विशेषज्ञ जल्द ही आपसे संपर्क करेंगे। कॉल समाप्त करने के लिए 1 या End Call दबाएं।`,
      speechText: 'आपका अनुरोध प्राप्त हो गया है। हमारे कृषि विशेषज्ञ जल्द ही आपसे संपर्क करेंगे। धन्यवाद।',
      options: [
        { key: 1, label: 'कॉल समाप्त करें', desc: 'सत्र पूरा हुआ' }
      ]
    }),
    EXISTING_WELCOME: (p) => ({
      title: 'एग्रीरिसॉल्व में पुनः स्वागत है।',
      subtitle: `कॉलर: ${p?.name || 'रमेश कुमार'} (${p?.phone || '+91 98450 12345'})`,
      text: 'एग्रीरिसॉल्व में पुनः स्वागत है। आपका पंजीकृत प्रोफाइल मिल गया है। खेत की जानकारी लोड करने के लिए 1 दबाएं।',
      speechText: 'एग्रीरिसॉल्व में पुनः स्वागत है रमेश कुमार जी। अपने पंजीकृत खेतों की जानकारी देखने के लिए एक दबाएं।',
      options: [
        { key: 1, label: 'खेत चयन जारी रखें', desc: 'पंजीकृत खेत' }
      ]
    }),
    EXISTING_LAND_SELECT: (p) => ({
      title: 'दो खेत पंजीकृत हैं',
      subtitle: 'खेत का चयन करें',
      text: `आपके प्रोफाइल में 2 खेत पंजीकृत हैं। किस खेत के लिए सहायता चाहिए? 1 - ${p?.land1Name || 'खेत 1: तरबूज'}, 2 - ${p?.land2Name || 'खेत 2: मक्का'}।`,
      speechText: 'आपके खाते में दो खेत पंजीकृत हैं। खेत एक के लिए एक दबाएं। खेत दो के लिए दो दबाएं।',
      options: [
        { key: 1, label: p?.land1Name || 'खेत 1: तरबूज का खेत', desc: 'तरबूज • 2 एकड़' },
        { key: 2, label: p?.land2Name || 'खेत 2: ऊपरी भूमि', desc: 'मक्का • 3 एकड़' }
      ]
    }),
    EXISTING_PROBLEM: (p) => ({
      title: 'कृषि समस्या का विवरण',
      subtitle: `खेत: ${p?.selectedLandName || 'खेत 1'} (${p?.crop || 'तरबूज'})`,
      text: 'चयनित खेत में आज आप किस समस्या का सामना कर रहे हैं? 1 - फल छेदक कीट, 2 - बारिश के पूर्वानुमान के साथ सिंचाई मतभेद, 3 - खाद की सिफारिश में मतभेद, 4 - पत्तियों पर धब्बे और झुलसा रोग।',
      speechText: 'चयनित फसल में आप किस समस्या का सामना कर रहे हैं? फल छेदक कीट के लिए एक, सिंचाई मतभेद के लिए दो, खाद मतभेद के लिए तीन, पत्ती झुलसा के लिए चार दबाएं।',
      options: [
        { key: 1, label: 'फल छेदक कीट का प्रकोप', desc: 'बढ़ते फलों को नुकसान' },
        { key: 2, label: 'सिंचाई समय मतभेद', desc: 'बारिश की संभावना vs सूखी मिट्टी' },
        { key: 3, label: 'खाद सिफारिश में मतभेद', desc: 'डीएपी और यूरिया की मात्रा' },
        { key: 4, label: 'पत्तियों पर धब्बे और झुलसा', desc: 'नमी से फफूंद' }
      ]
    }),
    EXISTING_CREATE_REQUEST: (p) => ({
      title: 'सहायता अनुरोध दर्ज कर लिया गया',
      subtitle: `टिकट संख्या: #${p?.ticketId || 'AR-SUP'}`,
      text: `आपका सहायता अनुरोध #${p?.ticketId || 'AR-SUP'} दर्ज कर लिया गया है। कृषि विशेषज्ञ नियुक्त कर दिया गया है। कॉल समाप्त करने के लिए 1 दबाएं।`,
      speechText: 'सहायता अनुरोध दर्ज कर लिया गया है और कृषि विशेषज्ञ नियुक्त कर दिया गया है। कॉल करने के लिए धन्यवाद।',
      options: [
        { key: 1, label: 'कॉल समाप्त करें', desc: 'पूरा हुआ' }
      ]
    }),
    CALL_ENDED: () => ({
      title: 'कॉल समाप्त हो गई',
      subtitle: 'कॉल डिस्कनेक्ट',
      text: 'एग्रीरिसॉल्व किसान हेल्पलाइन पर कॉल करने के लिए धन्यवाद। कॉल समाप्त हो गई है।',
      speechText: 'एग्रीरिसॉल्व में कॉल करने के लिए धन्यवाद। नमस्कार।',
      options: []
    })
  },

  English: {
    CHECK_CALLER: () => ({
      title: 'Caller Verification',
      subtitle: 'Step 2: Farmer Type',
      text: 'Welcome to AgriResolve. Are you calling as a New Farmer or an Existing Registered Farmer? Press 1 for New Farmer. Press 2 for Existing Farmer.',
      speechText: 'Welcome to AgriResolve. Are you calling as a New Farmer or an Existing Registered Farmer? Press one for New Farmer. Press two for Existing Farmer.',
      options: [
        { key: 1, label: 'New Farmer', desc: 'First time calling / Unregistered' },
        { key: 2, label: 'Existing Farmer', desc: 'Registered user (Ramesh Kumar)' },
      ]
    }),
    NEW_NAME: () => ({
      title: 'New Farmer Registration',
      subtitle: 'Question 1: Full Name',
      text: 'Please select or state your name: Press 1 for Murugan Selvam, Press 2 for Lakshmi Devi, Press 3 for Ratan Singh, Press 4 for Rajesh Patel.',
      speechText: 'Please select your name. Press one for Murugan Selvam, Press two for Lakshmi Devi, Press three for Ratan Singh, Press four for Rajesh Patel.',
      options: [
        { key: 1, label: 'Murugan Selvam', desc: 'Sample Farmer 1' },
        { key: 2, label: 'Lakshmi Devi', desc: 'Sample Farmer 2' },
        { key: 3, label: 'Ratan Singh', desc: 'Sample Farmer 3' },
        { key: 4, label: 'Rajesh Patel', desc: 'Sample Farmer 4' },
      ]
    }),
    NEW_VILLAGE: (p) => ({
      title: 'New Farmer Registration',
      subtitle: 'Question 2: Village / District',
      text: `Farmer: ${p?.name || 'Farmer'}. Please select your village location: Press 1 for Kaveripattinam, Press 2 for Papanasam, Press 3 for Alair, Press 4 for Rampur.`,
      speechText: 'Please select your village location. Press one for Kaveripattinam, Press two for Papanasam, Press three for Alair, Press four for Rampur.',
      options: [
        { key: 1, label: 'Kaveripattinam', desc: 'Krishnagiri District' },
        { key: 2, label: 'Papanasam', desc: 'Thanjavur District' },
        { key: 3, label: 'Alair', desc: 'Jangaon District' },
        { key: 4, label: 'Rampur', desc: 'Uttar Pradesh' },
      ]
    }),
    NEW_CROP: () => ({
      title: 'New Farmer Registration',
      subtitle: 'Question 3: Main Crop',
      text: 'What major crop are you cultivating in your field? Press 1 for Paddy Rice, Press 2 for Cotton, Press 3 for Watermelon, Press 4 for Maize Corn.',
      speechText: 'What major crop are you cultivating? Press one for Paddy Rice, Press two for Cotton, Press three for Watermelon, Press four for Maize Corn.',
      options: [
        { key: 1, label: 'Paddy (Rice)', desc: 'Kharif / Rabi crop' },
        { key: 2, label: 'Cotton', desc: 'Commercial Cash crop' },
        { key: 3, label: 'Watermelon', desc: 'Horticulture / Fruit' },
        { key: 4, label: 'Maize', desc: 'Cereal / Grain' },
      ]
    }),
    NEW_LAND_AREA: () => ({
      title: 'New Farmer Registration',
      subtitle: 'Question 4: Land Area',
      text: 'What is the total acreage of your farm plot? Press 1 for 1 Acre, Press 2 for 2.5 Acres, Press 3 for 5 Acres, Press 4 for 10 Acres.',
      speechText: 'What is your farm land area? Press one for one Acre, Press two for two point five Acres, Press three for five Acres, Press four for ten Acres.',
      options: [
        { key: 1, label: '1.0 Acre', desc: 'Marginal Farm' },
        { key: 2, label: '2.5 Acres', desc: 'Small Farm' },
        { key: 3, label: '5.0 Acres', desc: 'Medium Farm' },
        { key: 4, label: '10.0 Acres', desc: 'Large Farm' },
      ]
    }),
    NEW_IRRIGATION: () => ({
      title: 'New Farmer Registration',
      subtitle: 'Question 5: Irrigation Type',
      text: 'Which irrigation system do you use? Press 1 for Drip Irrigation, Press 2 for Canal or Flood, Press 3 for Borewell, Press 4 for Rainfed.',
      speechText: 'Which irrigation system do you use? Press one for Drip Irrigation, Press two for Canal or Flood, Press three for Borewell, Press four for Rainfed.',
      options: [
        { key: 1, label: 'Drip Irrigation', desc: 'Micro-irrigation' },
        { key: 2, label: 'Canal / Flood', desc: 'Surface flooding' },
        { key: 3, label: 'Borewell / Tube Well', desc: 'Groundwater pump' },
        { key: 4, label: 'Rainfed', desc: 'Monsoon dependent' },
      ]
    }),
    NEW_CONSENT: () => ({
      title: 'New Farmer Registration',
      subtitle: 'Question 6: Data Consent',
      text: 'Do you give consent to store your farm details to receive advisory & market support from AgriResolve? Press 1 for Yes, Press 2 for No.',
      speechText: 'Do you give consent to store your farm details to receive advisory support? Press one for Yes, Press two for No.',
      options: [
        { key: 1, label: 'Yes, I Give Consent', desc: 'Allow data storage for advisory' },
        { key: 2, label: 'No, Do Not Store', desc: 'Anonymous one-time call' },
      ]
    }),
    NEW_SAVING: () => ({
      title: 'Saving Information...',
      subtitle: 'System Database Update',
      text: 'Saving your details into the AgriResolve secure registry... Please hold on.',
      speechText: 'Saving your farmer details into AgriResolve. Please hold on.',
      options: [
        { key: 1, label: 'Continue to Problem Description', desc: 'Proceed to next step' }
      ]
    }),
    NEW_PROBLEM: () => ({
      title: 'Farming Problem Description',
      subtitle: 'Question 7: Stated Issue',
      text: 'What farming problem are you facing today? Press 1 for Pest or Disease attack, Press 2 for Yellowing leaves, Press 3 for Water shortage, Press 4 for Fertilizer dosage conflict.',
      speechText: 'What farming problem are you facing today? Press one for Pest attack, Press two for Yellowing leaves, Press three for Water shortage, Press four for Fertilizer dosage conflict.',
      options: [
        { key: 1, label: 'Pest / Disease Attack', desc: 'Insects, stem borer, caterpillars' },
        { key: 2, label: 'Yellowing Leaves / Deficiency', desc: 'Nutrient imbalance, chlorosis' },
        { key: 3, label: 'Water Shortage / Irrigation', desc: 'Moisture stress, pump advisory' },
        { key: 4, label: 'Fertilizer Recommendation Conflict', desc: 'Conflicting advice on dose' },
      ]
    }),
    NEW_SHOW_PROBLEM: (p) => ({
      title: "Farmer's Problem Recorded",
      subtitle: 'Confirmation & Verification',
      text: `Problem recorded: "${p?.problem || ''}". Press 1 to submit your request.`,
      speechText: 'Your problem has been recorded. Press one to confirm and submit your request.',
      options: [
        { key: 1, label: 'Confirm & Submit Request', desc: 'Generate ticket' },
        { key: 2, label: 'Change Problem Stated', desc: 'Pick different issue' }
      ]
    }),
    NEW_REQUEST_RECEIVED: (p) => ({
      title: 'Your request has been received.',
      subtitle: 'Reference Ticket Generated',
      text: `Your request has been received under ticket #${p?.ticketId || 'AR-IVR'}. An expert agronomist will review your crop conditions. Press 1 or End Call to finish.`,
      speechText: `Your request has been received. Our agronomist will review your crop conditions. Thank you for calling.`,
      options: [
        { key: 1, label: 'Conclude & End Call', desc: 'Finish IVR session' }
      ]
    }),
    EXISTING_WELCOME: (p) => ({
      title: 'Welcome back to AgriResolve.',
      subtitle: `Caller ID: ${p?.name || 'Ramesh Kumar'} (${p?.phone || '+91 98450 12345'})`,
      text: 'Welcome back to AgriResolve. We retrieved your profile. Checking your registered plots... Press 1 to continue.',
      speechText: 'Welcome back to AgriResolve, Ramesh Kumar. Press one to view your registered plots.',
      options: [
        { key: 1, label: 'Continue to Land Selection', desc: 'Load plots' }
      ]
    }),
    EXISTING_LAND_SELECT: (p) => ({
      title: 'Multiple Lands Registered',
      subtitle: 'Select Target Farm Land',
      text: `We found 2 plots registered under your profile. Which land are you calling about? Press 1 for ${p?.land1Name || 'Land 1: Watermelon'}, Press 2 for ${p?.land2Name || 'Land 2: Maize'}.`,
      speechText: 'We found two plots registered under your profile. Press one for Land one, Watermelon. Press two for Land two, Maize.',
      options: [
        { key: 1, label: p?.land1Name || 'Land 1: Riverbed Alluvial Plot', desc: 'Watermelon • 2 Acres' },
        { key: 2, label: p?.land2Name || 'Land 2: Upland Loam Plot', desc: 'Maize • 3 Acres' }
      ]
    }),
    EXISTING_PROBLEM: (p) => ({
      title: 'Farming Problem Description',
      subtitle: `Plot: ${p?.selectedLandName || 'Land 1'} (${p?.crop || 'Watermelon'})`,
      text: 'What farming problem are you facing today? Press 1 for Fruit Fly attack, Press 2 for Irrigation conflict vs rain forecast, Press 3 for Fertilizer recommendation conflict, Press 4 for Leaf curling and fungal blight.',
      speechText: 'What farming problem are you facing today on your selected land? Press one for Fruit fly attack, Press two for Irrigation conflict, Press three for Fertilizer conflict, Press four for Leaf blight.',
      options: [
        { key: 1, label: 'Fruit Fly / Pest Attack', desc: 'Severe borer on developing fruit' },
        { key: 2, label: 'Irrigation Timing vs Rain Forecast', desc: 'Dry soil with forecasted 50mm rain' },
        { key: 3, label: 'Fertilizer Recommendation Conflict', desc: 'DAP vs Urea dosage dispute' },
        { key: 4, label: 'Leaf Curling & Fungal Blight', desc: 'Humidity induced spotting' }
      ]
    }),
    EXISTING_CREATE_REQUEST: (p) => ({
      title: 'Support Request Created',
      subtitle: `Ticket #${p?.ticketId || 'AR-SUP'} Logged`,
      text: `Support request #${p?.ticketId || 'AR-SUP'} has been logged. Assigned to Senior Agronomist. Press 1 to finish or press End Call.`,
      speechText: 'A support request has been created and assigned to our agronomist. Thank you for calling.',
      options: [
        { key: 1, label: 'Finish Call', desc: 'End session' }
      ]
    }),
    CALL_ENDED: () => ({
      title: 'Call Disconnected',
      subtitle: 'Session Ended',
      text: 'The IVR call has ended. Thank you for contacting AgriResolve Kisan Helpline.',
      speechText: 'Thank you for contacting AgriResolve. Goodbye.',
      options: []
    })
  }
};
