import { useState, useCallback } from 'react';
import axios from 'axios';
import { Languages, Copy, Volume2, RotateCcw, History } from 'lucide-react';

const LANGUAGES = [
  { code: 'ar', name: 'Arabic' },
  { code: 'bn', name: 'Bengali' },
  { code: 'zh', name: 'Chinese' },
  { code: 'cs', name: 'Czech' },
  { code: 'nl', name: 'Dutch' },
  { code: 'es', name: 'Spanish' },
  { code: 'fi', name: 'Finnish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'el', name: 'Greek' },
  { code: 'hi', name: 'Hindi' },
  { code: 'id', name: 'Indonesian' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'pl', name: 'Polish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'sv', name: 'Swedish' },
  { code: 'th', name: 'Thai' },
  { code: 'tr', name: 'Turkish' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'ur', name: 'Urdu' },
  { code: 'vi', name: 'Vietnamese' },
];

export default function Translator() {
  const [inputText, setInputText] = useState('');
  const [targetLang, setTargetLang] = useState('es');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [history, setHistory] = useState<{ input: string; output: string; lang: string }[]>([]);

  const translateText = useCallback(async () => {
    if (!inputText) return;
    
    setLoading(true);
    try {
      const options = {
        method: 'POST',
        url: 'https://free-google-translator.p.rapidapi.com/external-api/free-google-translator',
        headers: {
          'content-type': 'application/json',
          'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
          'x-rapidapi-host': 'free-google-translator.p.rapidapi.com'
        },
        params: {
          from: 'en',
          to: targetLang,
          query: inputText
        },
        data: JSON.stringify({
          translate: 'rapidapi'
        })
      };

      const response = await axios.request(options);
      const translation = response.data.translation || 'Translation failed. Please try again.';
      setTranslatedText(translation);
      
      // Add to history
      setHistory(prev => [{
        input: inputText,
        output: translation,
        lang: LANGUAGES.find(l => l.code === targetLang)?.name || targetLang
      }, ...prev.slice(0, 4)]);
    } catch (error) {
      console.error(error);
      setTranslatedText('Translation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [inputText, targetLang]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const clearText = () => {
    setInputText('');
    setTranslatedText('');
    setCharCount(0);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-8">
          <Languages className="h-10 w-10 text-blue-400" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Professional Translator
          </h1>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-lg font-medium text-gray-200">
                English Text
              </label>
              <span className="text-sm text-gray-400">{charCount}/1000 characters</span>
            </div>
            <div className="relative">
              <textarea
                className="w-full h-48 p-4 bg-slate-700/50 border border-slate-600 rounded-lg 
                          focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white
                          placeholder-gray-400 transition-all duration-200"
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setCharCount(e.target.value.length);
                }}
                placeholder="Enter text to translate..."
                maxLength={1000}
              />
              <button
                onClick={() => clearText()}
                className="absolute bottom-3 right-3 p-2 text-gray-400 hover:text-white
                         transition-colors duration-200"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-lg font-medium text-gray-200">
                Translation
              </label>
              <select
                className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg
                         text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <textarea
                className="w-full h-48 p-4 bg-slate-700/50 border border-slate-600 rounded-lg
                          text-white placeholder-gray-400"
                value={translatedText}
                readOnly
                placeholder="Translation will appear here..."
              />
              <div className="absolute bottom-3 right-3 flex gap-2">
                <button
                  onClick={() => speakText(translatedText)}
                  className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
                  disabled={!translatedText}
                >
                  <Volume2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => copyToClipboard(translatedText)}
                  className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
                  disabled={!translatedText}
                >
                  <Copy className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <button
          className="mt-8 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 
                    text-white rounded-lg hover:from-blue-600 hover:to-purple-600 
                    transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed 
                    flex items-center justify-center gap-2 w-full md:w-auto"
          onClick={translateText}
          disabled={!inputText || loading}
        >
          {loading ? (
            <span className="animate-pulse">Translating...</span>
          ) : (
            <>
              <Languages className="h-5 w-5" />
              Translate Now
            </>
          )}
        </button>

        {history.length > 0 && (
          <div className="mt-8 border-t border-slate-700 pt-6">
            <div className="flex items-center gap-2 mb-4 text-gray-200">
              <History className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Recent Translations</h2>
            </div>
            <div className="space-y-3">
              {history.map((item, index) => (
                <div key={index} className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>English</span>
                    <span>{item.lang}</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <p className="text-gray-300">{item.input}</p>
                    <p className="text-gray-300">{item.output}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}