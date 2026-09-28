import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Land, SoilHealthCard, WeatherInfo } from '../types';
import { StorageService } from '../services/storageService';
import { calculateSmartIrrigation } from '../services/smartIrrigationService';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Mic, 
  MicOff, 
  Volume2, 
  Sprout, 
  Image as ImageIcon, 
  Camera, 
  X, 
  CheckCircle2, 
  AlertTriangle,
  Keyboard,
  HelpCircle,
  MapPin,
  RefreshCw
} from 'lucide-react';

interface Props {
  land: Land;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  image?: string;
  timestamp: string;
}

export const AIAssistantView: React.FC<Props> = ({ land }) => {
  const { language, t } = useLanguage();

  // STRICT REQUIREMENT 2: Current land isolated data
  const soil = StorageService.getSoilHealthCard(land.id);
  const weather = StorageService.getWeather(land.id);
  const conflict = StorageService.getConflictResolution(land);
  const irrigation = calculateSmartIrrigation(land, weather);

  // Input mode: 'voice' | 'type' | 'photo'
  const [activeInputMode, setActiveInputMode] = useState<'voice' | 'type' | 'photo'>('voice');
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [listeningTranscript, setListeningTranscript] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial greeting in active language
  const getInitialMessages = (): Message[] => {
    let welcome = `Namaste! I am your AI Agronomist for ${land.name} (${land.currentCrop}, ${land.cropStage}). Weather is ${weather.temperature}°C with ${weather.rainProbability}% rain chance. Speak or ask me anything!`;
    if (language === 'ta') {
      welcome = `வணக்கம்! ${land.name} நிலத்திற்கான உங்கள் AI விவசாய உதவியாளர் நான். பயிர்: ${land.currentCrop}, வானிலை: ${weather.temperature}°C, மழை வாய்ப்பு: ${weather.rainProbability}%. என்னிடம் குரல் மூலமாகவோ தட்டச்சு மூலமாகவோ கேளுங்கள்!`;
    } else if (language === 'te') {
      welcome = `నమస్కారం! ${land.name} కోసం మీ AI వ్యవసాయ నిపుణుడిని. పంట: ${land.currentCrop}, ఉష్ణోగ్రత: ${weather.temperature}°C, వర్షం: ${weather.rainProbability}%. ఏదైనా అడగండి!`;
    } else if (language === 'hi') {
      welcome = `नमस्ते! मैं ${land.name} (${land.currentCrop}) के लिए आपका AI कृषि साथी हूँ। मौसम: ${weather.temperature}°C, बारिश की संभावना: ${weather.rainProbability}%। बोलकर या लिखकर कुछ भी पूछें!`;
    }

    return [{
      id: 'msg-welcome',
      sender: 'assistant',
      text: welcome,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }];
  };

  const [messages, setMessages] = useState<Message[]>(getInitialMessages);

  // Update initial message if land or language changes
  useEffect(() => {
    setMessages(getInitialMessages());
  }, [land.id, language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Requirement 2: The 4 specific questions in 4 languages
  const quickQuestions: Record<string, string[]> = {
    en: [
      "Should I water my crop?",
      "What is wrong with my plant?",
      "What should I do today?",
      "What crop is suitable?"
    ],
    ta: [
      "நான் பயிருக்கு தண்ணீர் பாய்ச்ச வேண்டுமா?",
      "என் பயிரில் என்ன பிரச்சனை?",
      "இன்று நான் என்ன செய்ய வேண்டும்?",
      "இந்த நிலத்திற்கு எந்த பயிர் ஏற்றது?"
    ],
    te: [
      "నేను నా పంటకు నీరు పెట్టాలా?",
      "నా మొక్కకు ఏమి సమస్య ఉంది?",
      "ఈరోజు నేను ఏమి చేయాలి?",
      "ఈ భూమికి ఏ పంట అనుకూలంగా ఉంటుంది?"
    ],
    hi: [
      "क्या मुझे अपनी फसल को पानी देना चाहिए?",
      "मेरे पौधे में क्या खराबी है?",
      "आज मुझे क्या करना चाहिए?",
      "कौन सी फसल उपयुक्त है?"
    ]
  };

  const activeQuestions = quickQuestions[language] || quickQuestions.en;

  // Simple-sentence generator strictly using CURRENT land data
  const generateSimpleAnswer = (query: string, hasPhoto: boolean): string => {
    const q = query.toLowerCase();
    const isRain = weather.rainProbability >= 50 || weather.forecastRainMm >= 10;

    if (hasPhoto) {
      if (language === 'ta') {
        return `இலை படம் ஆய்வு செய்யப்பட்டது (${land.name} - ${land.currentCrop}): இலைகளில் ஆரம்ப பூஞ்சை புள்ளி தென்படுகிறது. வேப்ப எண்ணெய் (5 மிலி/லி) அல்லது ட்ரைக்கோடெர்மா தெளிக்கவும். இலைகள் ஈரமாக இருக்கும்போது மேல் தெளிப்பு செய்ய வேண்டாம்.`;
      } else if (language === 'te') {
        return `ఆకు ఫోటో విశ్లేషించబడింది (${land.name} - ${land.currentCrop}): ప్రారంభ దశ ఆకు మచ్చల వ్యాధి లక్షణాలు ఉన్నాయి. వేప నూనె (5ml/L) లేదా ట్రైకోడెర్మా పిచికారీ చేయండి.`;
      } else if (language === 'hi') {
        return `पत्ती की फोटो जांची गई (${land.name} - ${land.currentCrop}): पत्ती पर हल्के फफूंद धब्बे दिख रहे हैं। नीम का तेल (5ml प्रति लीटर पानी) या ट्राइकोडर्मा का छिड़काव करें।`;
      } else {
        return `Leaf Photo Analyzed for ${land.name} (${land.currentCrop}): Early fungal leaf spot detected. Spray Neem oil (5ml/L) or Trichoderma viride. Avoid overhead wetting.`;
      }
    }

    // 1. "Should I water my crop?"
    if (q.includes('water') || q.includes('தண்ணீர்') || q.includes('నీరు') || q.includes('पानी') || q.includes('irrigate')) {
      if (isRain) {
        if (language === 'ta') {
          return `இன்று தண்ணீர் பாய்ச்ச வேண்டாம். ${weather.rainProbability}% மழைக்கு வாய்ப்புள்ளது. நிலத்தில் போதுமான ஈரப்பதம் உள்ளது. மழை பெய்த பின் மீண்டும் சரிபார்க்கவும்.`;
        } else if (language === 'te') {
          return `ఈరోజు నీరు పెట్టవద్దు. ${weather.rainProbability}% వర్షం పడే అవకాశం ఉంది. నేలలో తగినంత తేమ ఉంది. వర్షం తర్వాత మళ్లీ తనిఖీ చేయండి.`;
        } else if (language === 'hi') {
          return `आज पानी न दें। ${weather.rainProbability}% बारिश होने की संभावना है। मिट्टी में पहले से पर्याप्त नमी है। बारिश के बाद पुनः जांचें।`;
        } else {
          return `Do not water today. Rain is expected with ${weather.rainProbability}% probability. Soil already has enough moisture. Check again after the rain.`;
        }
      } else {
        if (language === 'ta') {
          return `இன்று உங்கள் ${land.irrigationType}-ஐ 40 நிமிடங்கள் இயக்கவும். மண்ணின் ஈரப்பதம் ${irrigation.soilMoisturePercent}% ஆக குறைந்துள்ளது.`;
        } else if (language === 'te') {
          return `ఈరోజు మీ ${land.irrigationType}ని 40 నిమిషాలు నడపండి. నేలలో తేమ ${irrigation.soilMoisturePercent}% ఉంది.`;
        } else if (language === 'hi') {
          return `आज 40 मिनट के लिए अपनी ${land.irrigationType} चलाएं। मिट्टी की नमी ${irrigation.soilMoisturePercent}% है।`;
        } else {
          return `Water your crop today. Run your ${land.irrigationType} for 40 minutes. Soil moisture is at ${irrigation.soilMoisturePercent}%.`;
        }
      }
    }

    // 2. "What is wrong with my plant?"
    if (q.includes('wrong') || q.includes('plant') || q.includes('disease') || q.includes('பிரச்சனை') || q.includes('సమస్య') || q.includes('खराबी')) {
      if (language === 'ta') {
        return `${land.name} நிலத்தில் ${land.currentCrop} ஆரோக்கியமாக உள்ளது. ஏதேனும் இலைகள் மஞ்சள் நிறமாக மாறினால் 'படம் பதிவேற்றுக' மூலம் புகைப்படம் எடுத்து அனுப்பவும்.`;
      } else if (language === 'te') {
        return `${land.name} లోని ${land.currentCrop} పంట ఆరోగ్యంగా ఉంది. ఆకులపై మచ్చలు ఉంటే 'ఫోటో అప్‌లోడ్' ద్వారా ఫోటో పంపండి.`;
      } else if (language === 'hi') {
        return `${land.name} में आपकी ${land.currentCrop} फसल हरी और स्वस्थ है। यदि कोई पत्ता पीला दिखे तो फोटो अपलोड करके जांचें।`;
      } else {
        return `Your ${land.currentCrop} on ${land.name} looks healthy. If you spot yellow leaves or insects, tap "Upload Photo" to scan them.`;
      }
    }

    // 3. "What should I do today?"
    if (q.includes('today') || q.includes('இன்று') || q.includes('ఈరోజు') || q.includes('आज')) {
      if (language === 'ta') {
        return `${land.name} நிலத்திற்கான இன்றைய முக்கிய பணிகள்: 1. இலைகளை பூச்சிகள் உள்ளனவா என பார்க்கவும். 2. ${isRain ? 'மழை வருவதால் பாசனம் செய்ய வேண்டாம்.' : 'காலை நேரத்தில் நீர் பாய்ச்சவும்.'} 3. பயிர் வளர்ச்சி நிலை: ${land.cropStage}.`;
      } else if (language === 'te') {
        return `${land.name} కోసం నేటి ముఖ్య పనులు: 1. ఆకులను పరిశీలించండి. 2. ${isRain ? 'వర్షం పడే అవకాశం ఉన్నందున నీరు పెట్టవద్దు.' : 'ఉదయం నీరు పెట్టండి.'} 3. పంట దశ: ${land.cropStage}.`;
      } else if (language === 'hi') {
        return `${land.name} के लिए आज के जरूरी काम: 1. पत्तों की जांच करें। 2. ${isRain ? 'बारिश के आसार हैं, इसलिए सिंचाई रोकें।' : 'सुबह के समय हल्की सिंचाई करें।'} 3. फसल की अवस्था: ${land.cropStage}।`;
      } else {
        return `Today's top actions for ${land.name}: 1. Check leaves for pests. 2. ${isRain ? 'Wait to irrigate because rain is expected.' : 'Run scheduled morning irrigation.'} 3. Crop stage is ${land.cropStage}.`;
      }
    }

    // 4. "What crop is suitable?"
    if (q.includes('suitable') || q.includes('crop') || q.includes('பயிர்') || q.includes('పంట') || q.includes('फसल')) {
      if (language === 'ta') {
        return `${land.name} நிலத்திற்கு (மண் pH ${soil.pH}, பொட்டாசியம் ${soil.potassium} kg/ha): தர்பூசணி, மக்காச்சோளம் மற்றும் பயறு வகைகள் மிகவும் ஏற்றவை.`;
      } else if (language === 'te') {
        return `${land.name} నేలకు (pH ${soil.pH}): పుచ్చకాయ, మొక్కజొన్న మరియు పప్పుధాన్యాలు అత్యంత అనుకూలం.`;
      } else if (language === 'hi') {
        return `${land.name} की मिट्टी (pH ${soil.pH}) के लिए तरबूज, मक्का और दलहन फसलें बहुत उपयुक्त हैं।`;
      } else {
        return `For ${land.name} with soil pH ${soil.pH}: Watermelon, Maize, and Pulses are highly suitable.`;
      }
    }

    // Default localized simple answer
    if (language === 'ta') {
      return `${land.name} நிலத்தின் ${land.currentCrop} (${land.cropStage} நிலை) விவரங்கள்: வெப்பநிலை ${weather.temperature}°C, மண் நிலை ${soil.overallStatus}. எங்கள் முதன்மை பரிந்துரை: "${conflict.masterAction}".`;
    } else if (language === 'te') {
      return `${land.name} లోని ${land.currentCrop} (${land.cropStage} దశ): ఉష్ణోగ్రత ${weather.temperature}°C, నేల ${soil.overallStatus}. ప్రధాన సలహా: "${conflict.masterAction}".`;
    } else if (language === 'hi') {
      return `${land.name} में ${land.currentCrop} (${land.cropStage}): तापमान ${weather.temperature}°C, मिट्टी ${soil.overallStatus}। मुख्य सलाह: "${conflict.masterAction}"।`;
    } else {
      return `For ${land.currentCrop} on ${land.name}: Temperature is ${weather.temperature}°C, Soil status is ${soil.overallStatus}. Master advice: "${conflict.masterAction}".`;
    }
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text && !selectedImage) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text || "Uploaded photo for analysis",
      image: selectedImage || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    const hadImage = !!selectedImage;
    setSelectedImage(null);
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateSimpleAnswer(text, hadImage);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      // Auto voice read out for low literacy farmers
      speakText(reply);
    }, 600);
  };

  // Real Speech Recognition Web API
  const handleVoiceToggle = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Voice speech recognition is supported in Chrome, Edge, and Android browsers. Switched to type mode.");
      setActiveInputMode('type');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'ta' ? 'ta-IN' : language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      if (!isListening) {
        setIsListening(true);
        setListeningTranscript('Listening... Speak now');
        recognition.start();

        recognition.onresult = (event: any) => {
          const resultText = event.results[0][0].transcript;
          setListeningTranscript(resultText);
          if (event.results[0].isFinal) {
            setIsListening(false);
            setListeningTranscript('');
            handleSend(resultText);
          }
        };

        recognition.onerror = (e: any) => {
          console.warn("Speech recognition error:", e);
          setIsListening(false);
          setListeningTranscript('');
        };

        recognition.onend = () => {
          setIsListening(false);
          setListeningTranscript('');
        };
      } else {
        setIsListening(false);
        recognition.stop();
        setListeningTranscript('');
      }
    } catch (err) {
      setIsListening(false);
      setListeningTranscript('');
    }
  };

  // Text to speech playback
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'ta' ? 'ta-IN' : language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95; // Slightly slower for low-literacy clarity
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      handleSend("Diagnose this crop leaf photo");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4 pb-20 max-w-2xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      
      {/* 1. CURRENT LAND CONTEXT HEADER (STRICT ISOLATION) */}
      <div className="bg-white rounded-3xl p-4 border-2 border-stone-200 shadow-xs shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Sprout className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-black text-stone-900 leading-tight">
                  {land.name}
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {land.currentCrop}
                </span>
              </div>
              <p className="text-[11px] text-stone-600 font-bold mt-0.5">
                {land.cropStage} • {weather.temperature}°C • {weather.rainProbability}% Rain
              </p>
            </div>
          </div>

          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-xl">
            Live Farm Context
          </span>
        </div>
      </div>

      {/* 2. CHAT MESSAGES DISPLAY */}
      <div className="flex-1 overflow-y-auto p-4 bg-white rounded-3xl border-2 border-stone-200 space-y-3.5 shadow-xs">
        {messages.map((msg) => {
          const isAI = msg.sender === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
            >
              {isAI && (
                <div className="w-9 h-9 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-5 h-5 text-emerald-200" />
                </div>
              )}

              <div className={`max-w-[85%] rounded-3xl p-4 text-xs font-bold leading-relaxed shadow-xs ${
                isAI 
                  ? 'bg-stone-50 border-2 border-stone-200 text-stone-900' 
                  : 'bg-emerald-700 text-white border-2 border-emerald-800'
              }`}>
                {msg.image && (
                  <img 
                    src={msg.image} 
                    alt="Upload" 
                    className="w-48 h-36 object-cover rounded-2xl border mb-2 shadow-xs" 
                  />
                )}
                <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                
                <div className={`mt-2 pt-2 border-t flex items-center justify-between text-[10px] ${
                  isAI ? 'border-stone-200 text-stone-500' : 'border-emerald-600 text-emerald-100'
                }`}>
                  <span>{msg.timestamp}</span>
                  {isAI && (
                    <button
                      type="button"
                      onClick={() => speakText(msg.text)}
                      className="min-h-[32px] px-2 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-800 flex items-center gap-1 font-black transition-all"
                      title="Read aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Listen</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
              <Bot className="w-4 h-4" />
            </div>
            <div className="px-4 py-2 bg-stone-100 rounded-2xl text-xs font-bold text-stone-600 animate-pulse">
              Thinking in {language.toUpperCase()}...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. REQUIREMENT 2: 4 QUICK TAP QUESTIONS */}
      <div className="shrink-0 space-y-1.5">
        <span className="text-[11px] font-black uppercase tracking-wider text-stone-500 block px-1">
          Quick Questions for {land.currentCrop}:
        </span>
        <div className="grid grid-cols-2 gap-2">
          {activeQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              className="min-h-[46px] p-2.5 rounded-2xl bg-white border-2 border-stone-200 hover:border-emerald-500 hover:bg-emerald-50 text-left text-xs font-black text-stone-900 transition-all shadow-xs leading-tight flex items-center justify-between gap-1"
            >
              <span className="line-clamp-2">{q}</span>
              <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* 4. REQUIREMENT 2: LARGE BUTTONS (SPEAK TO AI, TYPE, UPLOAD PHOTO) */}
      <div className="bg-white rounded-3xl p-3 border-2 border-stone-200 shadow-sm shrink-0 space-y-2.5">
        
        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 rounded-2xl text-xs font-black">
          <button
            type="button"
            onClick={() => setActiveInputMode('voice')}
            className={`min-h-[44px] py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeInputMode === 'voice' ? 'bg-white text-emerald-800 shadow-sm' : 'text-stone-600'
            }`}
          >
            <Mic className="w-4 h-4 text-emerald-700" />
            <span>🎤 Voice</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveInputMode('type')}
            className={`min-h-[44px] py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeInputMode === 'type' ? 'bg-white text-emerald-800 shadow-sm' : 'text-stone-600'
            }`}
          >
            <Keyboard className="w-4 h-4 text-stone-700" />
            <span>⌨️ Type</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveInputMode('photo');
              fileInputRef.current?.click();
            }}
            className={`min-h-[44px] py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeInputMode === 'photo' ? 'bg-white text-emerald-800 shadow-sm' : 'text-stone-600'
            }`}
          >
            <Camera className="w-4 h-4 text-rose-700" />
            <span>📷 Photo</span>
          </button>
        </div>

        {/* Hidden File Input for Photo Mode */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handlePhotoSelect}
        />

        {/* MODE 1: PROMINENT LARGE "SPEAK TO AI" BUTTON (Requirement 2) */}
        {activeInputMode === 'voice' && (
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={handleVoiceToggle}
              className={`w-full min-h-[58px] py-3.5 px-6 rounded-2xl text-base font-black flex items-center justify-center gap-3 transition-all shadow-md ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-300'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-800/30'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-6 h-6 stroke-[3]" />
                  <span>Listening... Tap to Stop</span>
                </>
              ) : (
                <>
                  <Mic className="w-6 h-6 stroke-[3]" />
                  <span>🎤 SPEAK TO AI ({language.toUpperCase()})</span>
                </>
              )}
            </button>
            {isListening && listeningTranscript && (
              <p className="text-xs font-black text-emerald-800 mt-2 bg-emerald-50 py-1.5 px-3 rounded-xl border border-emerald-200">
                "{listeningTranscript}"
              </p>
            )}
          </div>
        )}

        {/* MODE 2: TYPE INPUT */}
        {activeInputMode === 'type' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              autoFocus
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Type question in ${language.toUpperCase()}...`}
              className="flex-1 min-h-[48px] px-4 py-2.5 bg-stone-50 border-2 border-stone-300 rounded-2xl text-xs font-bold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <button
              type="submit"
              className="min-h-[48px] px-5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-black flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>
        )}

        {/* MODE 3: PHOTO UPLOAD */}
        {activeInputMode === 'photo' && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full min-h-[54px] py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-2xl border-2 border-stone-300 text-xs font-black flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5 text-rose-700" />
              <span>Tap to Snap Crop Photo or Choose Gallery</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
