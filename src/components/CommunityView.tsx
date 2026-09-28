import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { FarmerProfile } from '../types';
import { 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  MapPin, 
  Sparkles,
  CheckCircle,
  Send,
  Mic,
  MicOff,
  HelpCircle,
  RotateCw,
  MessageCircle,
  Volume2
} from 'lucide-react';

interface Props {
  farmer: FarmerProfile;
}

interface CommunityQuestion {
  id: string;
  author: string;
  location: string;
  crop: string;
  question: string;
  voiceNote?: boolean;
  timeAgo: string;
  answers: {
    id: string;
    author: string;
    role: string;
    text: string;
    isVerifiedExpert?: boolean;
    timeAgo: string;
    likes: number;
  }[];
}

export const CommunityView: React.FC<Props> = ({ farmer }) => {
  const { language, t } = useLanguage();

  // Mode: 'ask' | 'answers'
  const [activeTab, setActiveTab] = useState<'ask' | 'answers'>('answers');
  
  // Voice recording state
  const [isListening, setIsListening] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [questionCrop, setQuestionCrop] = useState('Paddy (Rice)');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [communityData, setCommunityData] = useState<CommunityQuestion[]>([
    {
      id: 'q-1',
      author: 'Govindasamy K.',
      location: 'Kumbakonam, Thanjavur',
      crop: 'Paddy BPT 5204',
      question: 'Rain is expected tomorrow, but soil feels dry. Should I open irrigation canals today?',
      timeAgo: '2 hours ago',
      answers: [
        {
          id: 'a-1',
          author: 'Dr. S. Sundaram (KVK Agronomist)',
          role: 'Agricultural Scientist',
          text: 'Wait for the rain! Delta radar shows 35mm precipitation arriving by tonight. Opening canals now will cause root asphyxiation and nutrient runoff.',
          isVerifiedExpert: true,
          timeAgo: '1 hour ago',
          likes: 19
        },
        {
          id: 'a-2',
          author: 'Murugesan P. (Lead Farmer)',
          role: 'Progressive Farmer',
          text: 'Agreed! Check your bund drainage instead. Clearing the outlets saved our nursery last week.',
          timeAgo: '45 mins ago',
          likes: 8
        }
      ]
    },
    {
      id: 'q-2',
      author: 'Mallikarjun Rao',
      location: 'Warangal, Telangana',
      crop: 'Cotton Bt-2',
      question: 'Yellow spots appearing on bottom leaves after morning dew. What bio-spray is safest?',
      timeAgo: '4 hours ago',
      answers: [
        {
          id: 'a-3',
          author: 'Prof. Anitha Rao',
          role: 'Plant Pathologist',
          text: 'Spray Trichoderma viride (10g/L) or cold-pressed Neem oil (5ml/L) with soap nut water as surfactant. Do it between 4 PM and 6 PM.',
          isVerifiedExpert: true,
          timeAgo: '3 hours ago',
          likes: 27
        }
      ]
    },
    {
      id: 'q-3',
      author: 'Ramesh Patel',
      location: 'Anand, Gujarat',
      crop: 'Watermelon & Maize',
      question: 'Which organic fertilizer improves fruit sweetness before harvest?',
      timeAgo: 'Yesterday',
      answers: [
        {
          id: 'a-4',
          author: 'Kisan Call Center Advisor',
          role: 'Govt Agronomist',
          text: 'Apply potassium-rich wood ash or fermented banana peel liquid extract 15 days before harvest to boost natural brix sweetness.',
          isVerifiedExpert: true,
          timeAgo: 'Yesterday',
          likes: 34
        }
      ]
    }
  ]);

  // Voice recognition toggle
  const handleVoiceToggle = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setErrorMessage("Microphone recognition is supported in Chrome, Edge, and Android browsers. You can type your question directly below.");
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
        setErrorMessage(null);
        recognition.start();

        recognition.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          setQuestionText(text);
          if (event.results[0].isFinal) {
            setIsListening(false);
          }
        };

        recognition.onerror = (e: any) => {
          console.warn("Speech error in community:", e);
          setIsListening(false);
          setErrorMessage("Could not capture audio clearly. Please try speaking again or type your question.");
        };

        recognition.onend = () => {
          setIsListening(false);
        };
      } else {
        setIsListening(false);
        recognition.stop();
      }
    } catch {
      setIsListening(false);
      setErrorMessage("Microphone access unavailable. Please type your question.");
    }
  };

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      const newQ: CommunityQuestion = {
        id: `q-${Date.now()}`,
        author: farmer.name,
        location: `${farmer.district}, ${farmer.state}`,
        crop: questionCrop,
        question: questionText.trim(),
        timeAgo: 'Just now',
        answers: [
          {
            id: `a-${Date.now()}`,
            author: 'AgriResolve Community Bot',
            role: 'AI Assistant',
            text: `Namaste ${farmer.name}! Your question has been forwarded to agricultural officers and local progressive farmers in ${farmer.district}. Verified answers will arrive shortly.`,
            isVerifiedExpert: false,
            timeAgo: 'Just now',
            likes: 1
          }
        ]
      };

      setCommunityData([newQ, ...communityData]);
      setQuestionText('');
      setIsLoading(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setActiveTab('answers');
      }, 1200);
    }, 400);
  };

  const speakAnswer = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="space-y-4 pb-20 max-w-2xl mx-auto">
      
      {/* 1. RENAME HEADER TO: 👨‍🌾 FARMER COMMUNITY */}
      <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
            Kisan Discussion Hub
          </span>
          <h2 className="text-2xl font-black text-stone-900 leading-tight mt-0.5">
            👨‍🌾 FARMER COMMUNITY
          </h2>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
          <Users className="w-6 h-6 text-emerald-700" />
        </div>
      </div>

      {/* 2. REQUIREMENT 6: LARGE BUTTONS: ❓ Ask Question | 💬 See Answers */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setActiveTab('ask')}
          className={`min-h-[58px] p-4 rounded-2xl border-2 font-black text-base flex items-center justify-center gap-2.5 transition-all shadow-sm ${
            activeTab === 'ask'
              ? 'bg-emerald-700 text-white border-emerald-800 shadow-emerald-800/20 ring-2 ring-emerald-600/30'
              : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-300'
          }`}
        >
          <HelpCircle className={`w-5 h-5 ${activeTab === 'ask' ? 'text-white' : 'text-emerald-700'}`} />
          <span>❓ Ask Question</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('answers')}
          className={`min-h-[58px] p-4 rounded-2xl border-2 font-black text-base flex items-center justify-center gap-2.5 transition-all shadow-sm ${
            activeTab === 'answers'
              ? 'bg-emerald-700 text-white border-emerald-800 shadow-emerald-800/20 ring-2 ring-emerald-600/30'
              : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-300'
          }`}
        >
          <MessageCircle className={`w-5 h-5 ${activeTab === 'answers' ? 'text-white' : 'text-emerald-700'}`} />
          <span>💬 See Answers</span>
        </button>
      </div>

      {/* ERROR BANNER IF ANY */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-center justify-between gap-3 text-xs font-bold text-amber-950">
          <p>{errorMessage}</p>
          <button 
            type="button" 
            onClick={() => setErrorMessage(null)}
            className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 rounded-lg text-amber-900 font-black shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TAB 1: ❓ ASK QUESTION (Voice & Text) */}
      {activeTab === 'ask' && (
        <form onSubmit={handleAskSubmit} className="bg-white rounded-3xl p-6 border-2 border-stone-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-lg font-black text-stone-900">Ask Your Question</h3>
            <p className="text-xs text-stone-600 font-semibold mt-0.5">
              Speak into microphone or type. Other farmers and university scientists will answer.
            </p>
          </div>

          {/* Large Voice Recording Button */}
          <button
            type="button"
            onClick={handleVoiceToggle}
            className={`w-full min-h-[60px] py-4 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all border-2 ${
              isListening
                ? 'bg-rose-600 text-white border-rose-700 animate-pulse ring-4 ring-rose-300'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-400'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-6 h-6 stroke-[3]" />
                <span>Listening... Speak Now (Tap to Stop)</span>
              </>
            ) : (
              <>
                <Mic className="w-6 h-6 text-emerald-700 stroke-[3]" />
                <span>🎤 Tap to Speak Question</span>
              </>
            )}
          </button>

          {/* Crop Selector */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-stone-600 block mb-1.5">
              Related Crop:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Paddy (Rice)', 'Cotton', 'Watermelon', 'Maize', 'Vegetables', 'Soil Health'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setQuestionCrop(c)}
                  className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-black border transition-all ${
                    questionCrop === c
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-stone-600 block mb-1.5">
              Question Text:
            </label>
            <textarea
              rows={3}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="e.g. My paddy leaves are turning brown at the tips. Is it blast disease or potassium deficiency?"
              className="w-full p-4 bg-stone-50 border-2 border-stone-300 rounded-2xl text-xs font-bold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none leading-relaxed"
            />
          </div>

          {submitSuccess && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-black text-emerald-900 text-center animate-in fade-in">
              ✅ Question posted successfully! Opening answers...
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!questionText.trim() || isLoading}
            className="w-full min-h-[54px] py-3.5 px-6 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-md transition-all"
          >
            {isLoading ? (
              <>
                <RotateCw className="w-5 h-5 animate-spin" />
                <span>Posting Question...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Submit Question</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* TAB 2: 💬 SEE ANSWERS */}
      {activeTab === 'answers' && (
        <div className="space-y-4">
          {communityData.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border-2 border-stone-200 text-center space-y-2">
              <MessageCircle className="w-10 h-10 text-stone-400 mx-auto" />
              <h4 className="text-base font-black text-stone-900">No Questions Yet</h4>
              <p className="text-xs text-stone-600">Be the first farmer to ask a question to our agricultural experts!</p>
              <button
                type="button"
                onClick={() => setActiveTab('ask')}
                className="mt-2 min-h-[44px] px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-black"
              >
                Ask a Question Now
              </button>
            </div>
          ) : (
            communityData.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm space-y-3.5">
                
                {/* Question Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-stone-900">{item.author}</span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-md">
                        {item.crop}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 font-bold mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      <span>{item.location} • {item.timeAgo}</span>
                    </p>
                  </div>
                </div>

                {/* Question Body */}
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <p className="text-sm font-black text-stone-900 leading-snug">
                    ❓ "{item.question}"
                  </p>
                </div>

                {/* Answers Section */}
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between text-xs font-black text-stone-500 uppercase tracking-wider">
                    <span>Answers ({item.answers.length}):</span>
                  </div>

                  {item.answers.map((ans) => (
                    <div key={ans.id} className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-stone-900">{ans.author}</span>
                          {ans.isVerifiedExpert && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-sky-100 text-sky-900 border border-sky-300 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-sky-700" />
                              <span>Verified Expert</span>
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => speakAnswer(ans.text)}
                          className="min-h-[32px] px-2.5 py-1 bg-white hover:bg-stone-100 text-stone-800 rounded-lg text-[11px] font-bold border border-stone-200 flex items-center gap-1 transition-all"
                          title="Listen to answer"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Listen</span>
                        </button>
                      </div>

                      <p className="text-xs font-bold text-stone-800 leading-relaxed">
                        {ans.text}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-stone-500 font-semibold pt-1">
                        <span>{ans.role} • {ans.timeAgo}</span>
                        <span className="text-emerald-800 font-black">👍 {ans.likes} helpful</span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};
