import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  RotateCcw, 
  ChevronLeft, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Clock, 
  FileText, 
  AlertTriangle, 
  Radio, 
  ShieldCheck, 
  Layers, 
  Globe2
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { Land, FarmerProfile } from '../types';
import { IVRLanguage, IVR_TRANSLATIONS, IVR_INITIAL_GREETING } from '../i18n/ivrPrompts';

export type IVRStep =
  | 'IDLE'
  | 'WELCOME'
  | 'LANG_SELECT'
  | 'CHECK_CALLER'
  // New Farmer Flow
  | 'NEW_NAME'
  | 'NEW_VILLAGE'
  | 'NEW_CROP'
  | 'NEW_LAND_AREA'
  | 'NEW_IRRIGATION'
  | 'NEW_CONSENT'
  | 'NEW_SAVING'
  | 'NEW_PROBLEM'
  | 'NEW_SHOW_PROBLEM'
  | 'NEW_REQUEST_RECEIVED'
  // Existing Farmer Flow
  | 'EXISTING_WELCOME'
  | 'EXISTING_LAND_SELECT'
  | 'EXISTING_PROBLEM'
  | 'EXISTING_CREATE_REQUEST'
  // End Call
  | 'CALL_ENDED';

interface IVRTicket {
  id: string;
  timestamp: string;
  callerType: 'New Farmer' | 'Existing Farmer';
  farmerName: string;
  phone: string;
  village: string;
  crop: string;
  landArea: string;
  irrigationType: string;
  landName?: string;
  language: string;
  problem: string;
  status: 'Received' | 'Assigned' | 'Resolved';
}

interface IVROption {
  key: number;
  label: string;
  native?: string;
  desc?: string;
}

interface IVRPrompt {
  title: string;
  subtitle: string;
  voiceText: string;
  screenText: string;
  transliteration?: string;
  options: IVROption[];
}

interface Props {
  onClose?: () => void;
}

// DTMF audio feedback using Web Audio API
function playDtmfTone(digit: string | number) {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    const dtmfFreqs: Record<string, [number, number]> = {
      '1': [697, 1209],
      '2': [697, 1336],
      '3': [697, 1477],
      '4': [770, 1209],
      '5': [770, 1336],
      '6': [770, 1477],
      '7': [852, 1209],
      '8': [852, 1336],
      '9': [852, 1477],
      '0': [941, 1336],
      '*': [941, 1209],
      '#': [941, 1477],
    };

    const freqs = dtmfFreqs[String(digit)] || [800, 1200];
    gain.gain.value = 0.06;
    osc1.frequency.value = freqs[0];
    osc2.frequency.value = freqs[1];

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();

    setTimeout(() => {
      osc1.stop();
      osc2.stop();
      ctx.close();
    }, 140);
  } catch {
    // Ignore audio context errors
  }
}

// Eagerly pre-load speech synthesis voices
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

// Browser speech synthesis helper in the user's selected language
function speakMessage(
  nativeText: string, 
  phoneticFallback: string | undefined, 
  langKey: IVRLanguage, 
  enabled: boolean = true
) {
  if (!enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();

    const langCodeMap: Record<IVRLanguage, string> = {
      'Tamil': 'ta-IN',
      'Telugu': 'te-IN',
      'Hindi': 'hi-IN',
      'English': 'en-IN'
    };

    const targetLangCode = langCodeMap[langKey] || 'en-US';
    const prefix = targetLangCode.split('-')[0].toLowerCase();
    const voices = window.speechSynthesis.getVoices();

    // Pick best matching native voice if available in browser
    let matchingVoice: SpeechSynthesisVoice | undefined;
    if (voices && voices.length > 0) {
      // 1. Exact match e.g. 'ta-IN', 'ta_IN'
      matchingVoice = voices.find(v => 
        v.lang === targetLangCode || 
        v.lang.replace('_', '-').toLowerCase() === targetLangCode.toLowerCase()
      );
      // 2. Prefix match e.g. starts with 'ta', 'te', 'hi'
      if (!matchingVoice) {
        matchingVoice = voices.find(v => v.lang.toLowerCase().startsWith(prefix));
      }
      // 3. Name match containing language name
      if (!matchingVoice) {
        matchingVoice = voices.find(v => v.name.toLowerCase().includes(langKey.toLowerCase()));
      }
    }

    // If native voice found for Tamil/Telugu/Hindi, speak native script text.
    // If no native voice exists in browser, speak phonetic pronunciation so user hears their language!
    const textToSpeak = (matchingVoice || langKey === 'English' || !phoneticFallback)
      ? nativeText
      : phoneticFallback;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.90; // Natural pace for regional Indian languages
    utterance.pitch = 1.0;

    if (matchingVoice) {
      utterance.voice = matchingVoice;
      utterance.lang = matchingVoice.lang;
    } else {
      utterance.lang = (langKey === 'English' || matchingVoice) ? targetLangCode : 'en-IN';
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
}

export const IVRDemoView: React.FC<Props> = ({ onClose }) => {
  // Call Session State
  const [step, setStep] = useState<IVRStep>('IDLE');
  const [stepHistory, setStepHistory] = useState<IVRStep[]>([]);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true);
  const [transcript, setTranscript] = useState<Array<{ sender: 'IVR' | 'User'; text: string; time: string; lang?: string }>>([]);

  // Caller & Input Data
  const [selectedLanguage, setSelectedLanguage] = useState<IVRLanguage>('English');
  const selectedLanguageRef = useRef<IVRLanguage>('English');
  const [callerType, setCallerType] = useState<'New Farmer' | 'Existing Farmer'>('New Farmer');

  // New Farmer Collected Fields
  const [newFarmer, setNewFarmer] = useState({
    name: 'Murugan Selvam',
    village: 'Kaveripattinam, Krishnagiri',
    crop: 'Paddy (Rice)',
    landArea: '2.5 Acres',
    irrigationType: 'Drip Irrigation',
    consent: true,
  });

  // Existing Farmer Loaded Profile
  const [existingProfile, setExistingProfile] = useState<FarmerProfile | null>(null);
  const [existingLands, setExistingLands] = useState<Land[]>([]);
  const [selectedLand, setSelectedLand] = useState<Land | null>(null);

  // Problem & Created Ticket
  const [statedProblem, setStatedProblem] = useState<string>('');
  const [createdTicket, setCreatedTicket] = useState<IVRTicket | null>(null);

  // Persisted Support Tickets list
  const [recentTickets, setRecentTickets] = useState<IVRTicket[]>(() => {
    try {
      const stored = localStorage.getItem('agri_ivr_support_requests');
      if (stored) return JSON.parse(stored);
    } catch {}
    return [
      {
        id: 'REQ-IVR-1042',
        timestamp: 'Today, 08:30 AM',
        callerType: 'Existing Farmer',
        farmerName: 'Ramesh Kumar',
        phone: '+91 98450 12345',
        village: 'Papanasam Taluk',
        crop: 'Watermelon',
        landArea: '2.0 Acres',
        irrigationType: 'Drip Irrigation',
        landName: 'Land 1: Riverbed Alluvial Plot',
        language: 'Tamil',
        problem: 'Fruit fly attack observed on developing watermelon fruit.',
        status: 'Assigned',
      }
    ];
  });

  // Load existing farmer data on mount
  useEffect(() => {
    const demoFarmer = StorageService.getFarmerProfile('farmer-demo-01');
    const demoLands = StorageService.getLands('farmer-demo-01');
    setExistingProfile(demoFarmer);
    setExistingLands(demoLands);
    if (demoLands.length > 0) {
      setSelectedLand(demoLands[0]);
    }
  }, []);

  // Timer for active call duration
  useEffect(() => {
    let timer: any;
    if (step !== 'IDLE' && step !== 'CALL_ENDED') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step]);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Helper to append message to transcript
  const addTranscript = (sender: 'IVR' | 'User', text: string, lang?: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setTranscript(prev => [...prev, { sender, text, time, lang }]);
  };

  // Multilingual Dialogue Engine that returns voice and screen text in the selected language
  const getPromptForStep = (
    targetStep: IVRStep, 
    lang: IVRLanguage,
    customData?: { farmerName?: string; crop?: string; village?: string; problem?: string; land?: Land | null; ticketId?: string }
  ): IVRPrompt => {
    if (targetStep === 'IDLE') {
      return {
        title: 'AgriResolve IVR Helpline',
        subtitle: 'Toll-Free Voice Support Simulator (1800-419-AGRI)',
        voiceText: 'Welcome to AgriResolve Kisan Helpline. Press Start Call to begin.',
        screenText: 'Press "Start Call" to begin the simulated automated voice response session.',
        options: []
      };
    }

    if (targetStep === 'WELCOME' || targetStep === 'LANG_SELECT') {
      return {
        title: 'Language Selection • மொழி தேர்வு • భాష ఎంపిక • भाषा चयन',
        subtitle: 'Step 1: Choose Your Language',
        voiceText: IVR_INITIAL_GREETING.speechText,
        screenText: IVR_INITIAL_GREETING.text,
        transliteration: 'Welcome to AgriResolve. Tamilukku ondru azhuthavum. Telugu kosam rendu nokkandi. Hindi ke liye teen dabayein. For English press four.',
        options: [
          { key: 1, label: 'Tamil', native: 'தமிழ்', desc: 'தமிழுக்கு 1 அழுத்தவும்' },
          { key: 2, label: 'Telugu', native: 'తెలుగు', desc: 'తెలుగు కోసం 2 నొక్కండి' },
          { key: 3, label: 'Hindi', native: 'हिन्दी', desc: 'हिन्दी के लिए 3 दबाएं' },
          { key: 4, label: 'English', native: 'English', desc: 'For English press 4' },
        ]
      };
    }

    const farmerName = customData?.farmerName || newFarmer.name;
    const village = customData?.village || newFarmer.village;
    const crop = customData?.crop || newFarmer.crop;
    const problem = customData?.problem || statedProblem;
    const targetLand = customData?.land || selectedLand;
    const ticketId = customData?.ticketId || createdTicket?.id || 'REQ-IVR-1050';

    const promptFn = IVR_TRANSLATIONS[lang]?.[targetStep] || IVR_TRANSLATIONS['English']?.[targetStep];
    if (promptFn) {
      const content = promptFn({
        name: farmerName,
        village,
        crop,
        problem,
        selectedLandName: targetLand?.name,
        land1Name: existingLands[0]?.name,
        land2Name: existingLands[1]?.name,
        ticketId
      });
      return {
        title: content.title,
        subtitle: content.subtitle,
        voiceText: content.speechText,
        screenText: content.text,
        transliteration: content.phoneticSpeech || content.speechText,
        options: content.options
      };
    }

    return {
      title: 'AgriResolve IVR',
      subtitle: '',
      voiceText: '',
      screenText: '',
      options: []
    };
  };

  // Transition to next step with history tracking and voice announcement in selected language
  const navigateToStep = (
    nextStep: IVRStep, 
    langOverride?: IVRLanguage,
    customData?: { farmerName?: string; crop?: string; village?: string; problem?: string; land?: Land | null; ticketId?: string }
  ) => {
    setStepHistory(prev => [...prev, step]);
    setStep(nextStep);

    const activeLang = langOverride || selectedLanguageRef.current;
    const prompt = getPromptForStep(nextStep, activeLang, customData);

    addTranscript('IVR', prompt.screenText, activeLang);
    speakMessage(prompt.voiceText, prompt.transliteration, activeLang, isVoiceEnabled);
  };

  // START CALL action
  const handleStartCall = () => {
    playDtmfTone('1');
    setCallDuration(0);
    setTranscript([]);
    setStepHistory([]);
    setStatedProblem('');
    setCreatedTicket(null);

    const initialLang: IVRLanguage = 'English';
    const welcomePrompt = getPromptForStep('LANG_SELECT', initialLang);

    setStep('LANG_SELECT');
    addTranscript('IVR', welcomePrompt.screenText, 'Multilingual');
    // Speaks the multilingual greeting (Tamil, Telugu, Hindi, English)
    speakMessage(welcomePrompt.voiceText, welcomePrompt.transliteration, initialLang, isVoiceEnabled);
  };

  // REPEAT action
  const handleRepeat = () => {
    playDtmfTone('*');
    const activeLang = selectedLanguageRef.current;
    const prompt = getPromptForStep(step, activeLang, {
      farmerName: newFarmer.name,
      village: newFarmer.village,
      crop: newFarmer.crop,
      problem: statedProblem,
      land: selectedLand,
      ticketId: createdTicket?.id
    });
    if (prompt) {
      addTranscript('IVR', `[Repeated]: ${prompt.screenText}`, activeLang);
      speakMessage(prompt.voiceText, prompt.transliteration, activeLang, isVoiceEnabled);
    }
  };

  // BACK action
  const handleBack = () => {
    if (stepHistory.length === 0 || step === 'IDLE') return;
    playDtmfTone('#');
    const prevHistory = [...stepHistory];
    const prevStep = prevHistory.pop() || 'IDLE';
    setStepHistory(prevHistory);
    setStep(prevStep);
    addTranscript('User', 'Pressed [Back]');

    const activeLang = selectedLanguageRef.current;
    const prompt = getPromptForStep(prevStep, activeLang, {
      farmerName: newFarmer.name,
      village: newFarmer.village,
      crop: newFarmer.crop,
      problem: statedProblem,
      land: selectedLand,
      ticketId: createdTicket?.id
    });
    speakMessage(prompt.voiceText, prompt.transliteration, activeLang, isVoiceEnabled);
  };

  // END CALL action
  const handleEndCall = () => {
    playDtmfTone('0');
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    const activeLang = selectedLanguageRef.current;
    const endPrompt = getPromptForStep('CALL_ENDED', activeLang);
    setStep('CALL_ENDED');
    addTranscript('IVR', endPrompt.screenText, activeLang);
    speakMessage(endPrompt.voiceText, endPrompt.transliteration, activeLang, isVoiceEnabled);
  };

  // PRESS 1, 2, 3, 4 handler
  const handlePressKey = (key: 1 | 2 | 3 | 4) => {
    if (step === 'IDLE' || step === 'CALL_ENDED') return;
    playDtmfTone(key);
    addTranscript('User', `Pressed [${key}]`);

    switch (step) {
      case 'WELCOME':
      case 'LANG_SELECT': {
        const langs: Record<number, IVRLanguage> = {
          1: 'Tamil',
          2: 'Telugu',
          3: 'Hindi',
          4: 'English'
        };
        const chosenLang = langs[key];
        selectedLanguageRef.current = chosenLang;
        setSelectedLanguage(chosenLang);
        // Immediately navigate to CHECK_CALLER speaking in the CHOSEN language!
        navigateToStep('CHECK_CALLER', chosenLang);
        break;
      }

      case 'CHECK_CALLER': {
        if (key === 1) {
          // NEW FARMER branch
          setCallerType('New Farmer');
          navigateToStep('NEW_NAME');
        } else {
          // EXISTING FARMER branch
          setCallerType('Existing Farmer');
          navigateToStep('EXISTING_WELCOME');
        }
        break;
      }

      // --- NEW FARMER SUB-FLOW ---
      case 'NEW_NAME': {
        const names = {
          1: 'Murugan Selvam',
          2: 'Lakshmi Devi',
          3: 'Ratan Singh',
          4: 'Rajesh Patel'
        };
        const chosenName = names[key];
        setNewFarmer(prev => ({ ...prev, name: chosenName }));
        navigateToStep('NEW_VILLAGE', selectedLanguage, { farmerName: chosenName });
        break;
      }

      case 'NEW_VILLAGE': {
        const villages = {
          1: 'Kaveripattinam, Krishnagiri',
          2: 'Papanasam, Thanjavur',
          3: 'Alair, Jangaon',
          4: 'Rampur, Uttar Pradesh'
        };
        const chosenVillage = villages[key];
        setNewFarmer(prev => ({ ...prev, village: chosenVillage }));
        navigateToStep('NEW_CROP', selectedLanguage, { village: chosenVillage });
        break;
      }

      case 'NEW_CROP': {
        const crops = {
          1: 'Paddy (Rice)',
          2: 'Cotton',
          3: 'Watermelon',
          4: 'Maize'
        };
        const chosenCrop = crops[key];
        setNewFarmer(prev => ({ ...prev, crop: chosenCrop }));
        navigateToStep('NEW_LAND_AREA', selectedLanguage, { crop: chosenCrop });
        break;
      }

      case 'NEW_LAND_AREA': {
        const areas = {
          1: '1.0 Acre',
          2: '2.5 Acres',
          3: '5.0 Acres',
          4: '10.0 Acres'
        };
        const chosenArea = areas[key];
        setNewFarmer(prev => ({ ...prev, landArea: chosenArea }));
        navigateToStep('NEW_IRRIGATION', selectedLanguage);
        break;
      }

      case 'NEW_IRRIGATION': {
        const irrigations = {
          1: 'Drip Irrigation',
          2: 'Canal / Flood',
          3: 'Borewell / Tube Well',
          4: 'Rainfed'
        };
        const chosenIrrigation = irrigations[key];
        setNewFarmer(prev => ({ ...prev, irrigationType: chosenIrrigation }));
        navigateToStep('NEW_CONSENT', selectedLanguage);
        break;
      }

      case 'NEW_CONSENT': {
        const consentGranted = key === 1;
        setNewFarmer(prev => ({ ...prev, consent: consentGranted }));
        
        // Save information simulation
        navigateToStep('NEW_SAVING', selectedLanguage);

        setTimeout(() => {
          navigateToStep('NEW_PROBLEM', selectedLanguage);
        }, 1400);
        break;
      }

      case 'NEW_SAVING': {
        navigateToStep('NEW_PROBLEM', selectedLanguage);
        break;
      }

      case 'NEW_PROBLEM': {
        const problems = {
          1: 'Severe pest infestation and leaf eating caterpillar attack on crops.',
          2: 'Yellowing leaves and micro-nutrient deficiency symptoms.',
          3: 'Soil moisture stress and irrigation timing advisory needed.',
          4: 'Conflicting fertilizer recommendations between soil report and local dealer.'
        };
        const chosenProblem = problems[key];
        setStatedProblem(chosenProblem);

        // Show the farmer's problem
        navigateToStep('NEW_SHOW_PROBLEM', selectedLanguage, { problem: chosenProblem });
        break;
      }

      case 'NEW_SHOW_PROBLEM': {
        // Show: "Your request has been received."
        const ticketId = `REQ-IVR-${Math.floor(1000 + Math.random() * 9000)}`;
        const newTicket: IVRTicket = {
          id: ticketId,
          timestamp: 'Just now',
          callerType: 'New Farmer',
          farmerName: newFarmer.name,
          phone: '+91 94441 55210',
          village: newFarmer.village,
          crop: newFarmer.crop,
          landArea: newFarmer.landArea,
          irrigationType: newFarmer.irrigationType,
          language: selectedLanguage,
          problem: statedProblem || 'General crop query',
          status: 'Received',
        };

        setCreatedTicket(newTicket);
        const updatedTickets = [newTicket, ...recentTickets];
        setRecentTickets(updatedTickets);
        try {
          localStorage.setItem('agri_ivr_support_requests', JSON.stringify(updatedTickets));
        } catch {}

        navigateToStep('NEW_REQUEST_RECEIVED', selectedLanguage, { ticketId });
        break;
      }

      case 'NEW_REQUEST_RECEIVED': {
        handleEndCall();
        break;
      }

      // --- EXISTING FARMER SUB-FLOW ---
      case 'EXISTING_WELCOME': {
        // Check if multiple lands exist
        if (existingLands.length > 1) {
          navigateToStep('EXISTING_LAND_SELECT', selectedLanguage);
        } else {
          if (existingLands[0]) setSelectedLand(existingLands[0]);
          navigateToStep('EXISTING_PROBLEM', selectedLanguage, { land: existingLands[0] });
        }
        break;
      }

      case 'EXISTING_LAND_SELECT': {
        const chosenLand = key === 1 ? existingLands[0] : (existingLands[1] || existingLands[0]);
        setSelectedLand(chosenLand);
        navigateToStep('EXISTING_PROBLEM', selectedLanguage, { land: chosenLand });
        break;
      }

      case 'EXISTING_PROBLEM': {
        const existingProblems = {
          1: 'Pest attack and fruit borer damage on standing crop.',
          2: 'Smart irrigation conflict: Weather forecast predicts rain but soil moisture is dry.',
          3: 'Conflicting fertilizer dosage recommendation between Soil Health Card and Agronomist.',
          4: 'Sudden leaf curling and fungal blight spotted after recent humidity.'
        };
        const chosenProblem = existingProblems[key];
        setStatedProblem(chosenProblem);

        // Create support request
        const ticketId = `REQ-IVR-${Math.floor(1000 + Math.random() * 9000)}`;
        const newTicket: IVRTicket = {
          id: ticketId,
          timestamp: 'Just now',
          callerType: 'Existing Farmer',
          farmerName: existingProfile?.name || 'Ramesh Kumar',
          phone: existingProfile?.phone || '+91 98450 12345',
          village: existingProfile?.district || 'Thanjavur',
          crop: selectedLand?.currentCrop || 'Watermelon',
          landArea: `${selectedLand?.area || 2} ${selectedLand?.areaUnit || 'Acres'}`,
          irrigationType: selectedLand?.irrigationType || 'Drip Irrigation',
          landName: selectedLand?.name || 'Land 1: Riverbed Alluvial Plot',
          language: selectedLanguage,
          problem: chosenProblem,
          status: 'Assigned',
        };

        setCreatedTicket(newTicket);
        const updated = [newTicket, ...recentTickets];
        setRecentTickets(updated);
        try {
          localStorage.setItem('agri_ivr_support_requests', JSON.stringify(updated));
        } catch {}

        navigateToStep('EXISTING_CREATE_REQUEST', selectedLanguage, { ticketId });
        break;
      }

      case 'EXISTING_CREATE_REQUEST': {
        handleEndCall();
        break;
      }

      default:
        break;
    }
  };

  // Keyboard shortcut listener for 1, 2, 3, 4
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4'].includes(e.key)) {
        handlePressKey(Number(e.key) as 1 | 2 | 3 | 4);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, selectedLanguage, newFarmer, existingLands, existingProfile, selectedLand, statedProblem, recentTickets]);

  const currentPrompt = getPromptForStep(step, selectedLanguage, {
    farmerName: newFarmer.name,
    village: newFarmer.village,
    crop: newFarmer.crop,
    problem: statedProblem,
    land: selectedLand,
    ticketId: createdTicket?.id
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
      {/* Header bar of IVR Demo page */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <PhoneCall className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
                <span>IVR Demo (Interactive Voice Response)</span>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Multilingual Voice
                </span>
              </h1>
              <p className="text-xs text-stone-500 font-medium">
                Toll-Free Kisan Helpline Simulator • 1800-419-AGRI
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          {/* Active Language Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold border border-stone-200">
            <Globe2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Voice Language: <strong className="text-emerald-800 font-black">{selectedLanguage}</strong></span>
          </div>

          {/* Voice Speech Toggle */}
          <button
            type="button"
            onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
            className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              isVoiceEnabled 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                : 'bg-stone-100 text-stone-600 border-stone-200'
            }`}
            title="Toggle synthetic voice audio"
          >
            {isVoiceEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
            <span>Voice: {isVoiceEnabled ? 'ON' : 'MUTE'}</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to App</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Dual-Column Layout: Phone Handset on left, Call State/Logs on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Phone Interface (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-stone-900 rounded-[2.5rem] p-4 sm:p-6 text-white shadow-2xl border-4 border-stone-800 relative overflow-hidden">
            {/* Phone Screen Notch / Top Bar */}
            <div className="flex items-center justify-between text-[11px] text-stone-400 font-bold px-3 pb-3 border-b border-stone-800">
              <span className="flex items-center gap-1.5">
                <Radio className={`w-3.5 h-3.5 ${step !== 'IDLE' && step !== 'CALL_ENDED' ? 'text-emerald-400 animate-pulse' : 'text-stone-500'}`} />
                <span>Kisan Helpline 1800-419-AGRI</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span className="font-mono text-xs text-emerald-400">
                  {step !== 'IDLE' ? formatTime(callDuration) : '00:00'}
                </span>
              </span>
            </div>

            {/* Screen Content Box */}
            <div className="my-4 bg-stone-950/80 rounded-3xl p-4 sm:p-5 border border-stone-800/80 min-h-[270px] flex flex-col justify-between">
              <div>
                {/* Header status in call */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-800 text-stone-300">
                    {step === 'IDLE' ? 'READY TO CALL' : step === 'CALL_ENDED' ? 'CALL DISCONNECTED' : 'CALL IN PROGRESS'}
                  </span>
                  {selectedLanguage && step !== 'IDLE' && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/60 flex items-center gap-1">
                      <Globe2 className="w-3 h-3" />
                      <span>{selectedLanguage}</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                  {currentPrompt.title}
                </h3>
                <p className="text-xs text-stone-400 font-medium mt-0.5">
                  {currentPrompt.subtitle}
                </p>

                {/* Voice Readout Bubble in Selected Language */}
                <div className="mt-3.5 p-3.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-200 text-xs sm:text-sm font-medium leading-relaxed flex items-start gap-2.5">
                  <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                    step !== 'IDLE' && step !== 'CALL_ENDED' ? 'bg-emerald-500/20 text-emerald-400 animate-pulse' : 'bg-stone-800 text-stone-500'
                  }`}>
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block">
                        🔊 Spoken Voice ({selectedLanguage}):
                      </span>
                    </div>
                    {/* Native Script Voice Prompt */}
                    <p className="text-sm font-bold text-white font-serif tracking-wide leading-relaxed">
                      "{currentPrompt.voiceText}"
                    </p>
                    {/* Subtitle / Meaning in English if native language selected */}
                    {currentPrompt.transliteration && selectedLanguage !== 'English' && (
                      <p className="text-[11px] text-stone-400 italic">
                        ↳ Subtitle: {currentPrompt.transliteration}
                      </p>
                    )}
                  </div>
                </div>

                {/* Step specific cards */}
                {step === 'NEW_SAVING' && (
                  <div className="mt-3 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 space-y-1.5 animate-in fade-in">
                    <p className="text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Farmer Profile Created in AgriResolve:
                    </p>
                    <div className="grid grid-cols-2 gap-1 text-[11px] text-stone-300">
                      <div>Name: <strong className="text-white">{newFarmer.name}</strong></div>
                      <div>Village: <strong className="text-white">{newFarmer.village}</strong></div>
                      <div>Crop: <strong className="text-white">{newFarmer.crop}</strong></div>
                      <div>Area: <strong className="text-white">{newFarmer.landArea}</strong></div>
                      <div>Irrigation: <strong className="text-white">{newFarmer.irrigationType}</strong></div>
                      <div>Language: <strong className="text-emerald-400">{selectedLanguage}</strong></div>
                    </div>
                  </div>
                )}

                {step === 'EXISTING_WELCOME' && existingProfile && (
                  <div className="mt-3 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 space-y-1.5 animate-in fade-in">
                    <p className="text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Loaded Existing Farmer Profile:
                    </p>
                    <div className="grid grid-cols-2 gap-1 text-[11px] text-stone-300">
                      <div>Name: <strong className="text-white">{existingProfile.name}</strong></div>
                      <div>Phone: <strong className="text-white">{existingProfile.phone}</strong></div>
                      <div>Location: <strong className="text-white">{existingProfile.district}, {existingProfile.state}</strong></div>
                      <div>Registered Lands: <strong className="text-emerald-400">{existingLands.length} Plots</strong></div>
                    </div>
                  </div>
                )}

                {step === 'NEW_SHOW_PROBLEM' && (
                  <div className="mt-3 p-3 rounded-2xl bg-amber-950/40 border border-amber-800/60 space-y-1 animate-in fade-in">
                    <p className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      Problem Stated by Farmer:
                    </p>
                    <p className="text-xs font-semibold text-white bg-stone-900/90 p-2 rounded-xl">
                      "{statedProblem}"
                    </p>
                    <p className="text-[10px] text-stone-400">
                      Crop: {newFarmer.crop} ({newFarmer.landArea}) • Farmer: {newFarmer.name}
                    </p>
                  </div>
                )}

                {(step === 'NEW_REQUEST_RECEIVED' || step === 'EXISTING_CREATE_REQUEST') && createdTicket && (
                  <div className="mt-3 p-3 rounded-2xl bg-emerald-950/50 border border-emerald-700/80 space-y-1.5 animate-in zoom-in-95">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        “Your request has been received.”
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-800/60 text-white font-bold">
                        {createdTicket.id}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-300 bg-stone-900/80 p-2 rounded-xl space-y-0.5">
                      <div>Farmer: <strong className="text-white">{createdTicket.farmerName}</strong></div>
                      <div>Target: <strong className="text-white">{createdTicket.landName || createdTicket.crop}</strong></div>
                      <div>Language: <strong className="text-emerald-400">{createdTicket.language}</strong></div>
                      <div>Problem: <span className="text-stone-300 italic">"{createdTicket.problem}"</span></div>
                      <div className="text-emerald-400 font-bold mt-1">Status: Logged into Advisory Queue (Agronomist Assigned)</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Display Current Available Options for Press 1..4 in Selected Language */}
              {currentPrompt.options.length > 0 && (
                <div className="mt-3 pt-3 border-t border-stone-800/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
                      Dial Key Options ({selectedLanguage}):
                    </span>
                    <span className="text-[9px] text-stone-500">Tap or Press Keypad</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {currentPrompt.options.map(opt => (
                      <div 
                        key={opt.key}
                        onClick={() => handlePressKey(opt.key as 1 | 2 | 3 | 4)}
                        className="flex items-center gap-2 p-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 cursor-pointer transition-all hover:border-emerald-500/50"
                      >
                        <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center shrink-0">
                          {opt.key}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-stone-100 truncate">
                            {opt.label} {opt.native && opt.native !== opt.label && <span className="text-emerald-400 font-normal">({opt.native})</span>}
                          </p>
                          {opt.desc && (
                            <p className="text-[10px] text-stone-400 truncate">{opt.desc}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* REQUIRED BUTTONS BAR (As specified in prompt) */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-[11px] font-black text-stone-400 px-1">
                <span>TELEPHONE CONTROLS</span>
                <span className="text-stone-500 text-[10px]">DTMF Tone Touchpad</span>
              </div>

              {/* If IDLE: Big Start Call button */}
              {step === 'IDLE' || step === 'CALL_ENDED' ? (
                <button
                  type="button"
                  onClick={handleStartCall}
                  className="w-full min-h-[56px] py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white text-base font-black flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-900/50 transition-all cursor-pointer"
                >
                  <Phone className="w-5 h-5 text-emerald-200 animate-bounce" />
                  <span>Start Call</span>
                </button>
              ) : null}

              {/* Four Primary Press Key Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map(num => {
                  const isAvailable = currentPrompt.options.some(opt => opt.key === num);
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handlePressKey(num as 1 | 2 | 3 | 4)}
                      disabled={step === 'IDLE' || step === 'CALL_ENDED'}
                      className={`min-h-[52px] rounded-2xl font-black flex flex-col items-center justify-center transition-all cursor-pointer ${
                        step === 'IDLE' || step === 'CALL_ENDED'
                          ? 'bg-stone-800 text-stone-600 border border-stone-800 opacity-50 cursor-not-allowed'
                          : isAvailable
                          ? 'bg-stone-800 hover:bg-emerald-700 active:bg-emerald-800 text-white border-2 border-emerald-500/60 shadow-md shadow-emerald-950 hover:scale-105'
                          : 'bg-stone-800/60 hover:bg-stone-700 text-stone-300 border border-stone-700'
                      }`}
                    >
                      <span className="text-xs font-bold text-stone-400">Press</span>
                      <span className="text-lg font-black leading-none text-emerald-400">{num}</span>
                    </button>
                  );
                })}
              </div>

              {/* Control Action Buttons: Repeat, Back, End Call */}
              <div className="grid grid-cols-3 gap-2">
                {/* Repeat Button */}
                <button
                  type="button"
                  onClick={handleRepeat}
                  disabled={step === 'IDLE' || step === 'CALL_ENDED'}
                  className={`min-h-[48px] py-2 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    step === 'IDLE' || step === 'CALL_ENDED'
                      ? 'bg-stone-800 text-stone-600 border border-stone-800 opacity-50 cursor-not-allowed'
                      : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 active:scale-95'
                  }`}
                  title="Repeat the current voice message in the selected language"
                >
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  <span>Repeat</span>
                </button>

                {/* Back Button */}
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={stepHistory.length === 0 || step === 'IDLE' || step === 'CALL_ENDED'}
                  className={`min-h-[48px] py-2 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    stepHistory.length === 0 || step === 'IDLE' || step === 'CALL_ENDED'
                      ? 'bg-stone-800 text-stone-600 border border-stone-800 opacity-50 cursor-not-allowed'
                      : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 active:scale-95'
                  }`}
                  title="Go back to previous step"
                >
                  <ChevronLeft className="w-4 h-4 text-sky-400" />
                  <span>Back</span>
                </button>

                {/* End Call Button */}
                <button
                  type="button"
                  onClick={handleEndCall}
                  disabled={step === 'IDLE' || step === 'CALL_ENDED'}
                  className={`min-h-[48px] py-2 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    step === 'IDLE' || step === 'CALL_ENDED'
                      ? 'bg-stone-800 text-stone-600 border border-stone-800 opacity-50 cursor-not-allowed'
                      : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-950 active:scale-95'
                  }`}
                  title="Hang up and end call"
                >
                  <PhoneOff className="w-4 h-4 text-white" />
                  <span>End Call</span>
                </button>
              </div>

              {/* Tips & Shortcuts */}
              {step !== 'IDLE' && step !== 'CALL_ENDED' && (
                <div className="pt-1 flex items-center justify-between text-[11px] text-stone-400">
                  <span className="italic">💡 Tip: Press 1, 2, 3, 4 on keyboard • Voice speaks in {selectedLanguage}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Transcript & Support Tickets (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Flow Legend / Guide */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-xs">
            <h3 className="text-xs font-black text-stone-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Simulated IVR Flow Architecture</span>
            </h3>

            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-100">
                <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                <span><strong>CALL STARTS</strong> → “Welcome to AgriResolve”</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium">
                <span className="w-5 h-5 rounded-md bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                <span><strong>Language Selection:</strong> 1-Tamil, 2-Telugu, 3-Hindi, 4-English</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-100">
                <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                <span><strong>Check Caller:</strong> New Farmer vs Existing Farmer</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-[11px] space-y-1 text-emerald-900 font-medium">
                <span className="font-bold block text-emerald-800">Branch A: New Farmer (Speaks in {selectedLanguage})</span>
                <p>Collects Name, Village, Crop, Land area, Irrigation type, Consent → Saves info → Asks problem → Shows problem → “Your request has been received.” → End Call</p>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-[11px] space-y-1 text-amber-900 font-medium">
                <span className="font-bold block text-amber-800">Branch B: Existing Farmer (Speaks in {selectedLanguage})</span>
                <p>“Welcome back to AgriResolve.” → Loads details → Land 1 vs Land 2 → Asks problem → Creates support request → End Call</p>
              </div>
            </div>
          </div>

          {/* Live Call Transcript Log with language tags */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-xs flex flex-col h-[300px]">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-2">
              <h3 className="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-stone-600" />
                <span>Call Session Transcript</span>
              </h3>
              <span className="text-[10px] font-bold text-stone-400">
                {transcript.length} Events
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
              {transcript.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-stone-400 text-center p-4">
                  <Phone className="w-8 h-8 text-stone-300 mb-2" />
                  <p className="font-bold">No active transcript</p>
                  <p className="text-[11px] mt-0.5">Click "Start Call" to begin the conversation in your language.</p>
                </div>
              ) : (
                transcript.map((item, idx) => (
                  <div 
                    key={idx}
                    className={`p-2.5 rounded-2xl ${
                      item.sender === 'IVR' 
                        ? 'bg-stone-50 border border-stone-200 text-stone-800' 
                        : 'bg-emerald-50 border border-emerald-200 text-emerald-900 ml-4 font-semibold'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold mb-0.5 text-stone-400">
                      <span>{item.sender === 'IVR' ? `🤖 AgriResolve Voice (${item.lang || selectedLanguage})` : '👤 Caller DTMF'}</span>
                      <span>{item.time}</span>
                    </div>
                    <p className="leading-snug">{item.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Support Requests Created via IVR */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-2.5">
              <h3 className="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>IVR Support Requests ({recentTickets.length})</span>
              </h3>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {recentTickets.map((tkt) => (
                <div key={tkt.id} className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-emerald-800 font-mono">{tkt.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-extrabold">
                      {tkt.status}
                    </span>
                  </div>
                  <p className="text-stone-900 font-bold mt-0.5">
                    {tkt.farmerName} • <span className="text-stone-500 font-normal">{tkt.callerType}</span> • <span className="text-emerald-700 font-bold">{tkt.language}</span>
                  </p>
                  <p className="text-[11px] text-stone-500">
                    {tkt.landName || tkt.crop} ({tkt.landArea}) • {tkt.village}
                  </p>
                  <p className="text-[11px] font-medium text-stone-700 italic mt-1 bg-white p-1.5 rounded-lg border border-stone-200/60">
                    "{tkt.problem}"
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
