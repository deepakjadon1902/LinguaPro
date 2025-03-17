import { useState, useCallback, useEffect } from 'react';
import { Shuffle } from 'lucide-react';

export default function Generator() {
  const [length, setLength] = useState(12);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedString, setGeneratedString] = useState('');

  const generateString = useCallback(() => {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let chars = letters;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;
    
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    setGeneratedString(result);
  }, [length, includeNumbers, includeSymbols]);

  useEffect(() => {
    generateString();
  }, [generateString]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-6">
          <Shuffle className="h-8 w-8 text-blue-400" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Random String Generator
          </h1>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              String Length: {length}
            </label>
            <input
              type="range"
              min="4"
              max="1000"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-600 rounded bg-slate-700"
              />
              <span className="text-gray-200">Include Numbers</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-600 rounded bg-slate-700"
              />
              <span className="text-gray-200">Include Symbols</span>
            </label>
          </div>

          <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
            <p className="text-lg font-mono break-all text-gray-200">{generatedString}</p>
          </div>

          <button
            onClick={generateString}
            className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 
                     text-white rounded-lg hover:from-blue-600 hover:to-purple-600 
                     transition-colors flex items-center justify-center gap-2"
          >
            <Shuffle className="h-5 w-5" />
            Generate New String
          </button>
        </div>
      </div>
    </div>
  );
}