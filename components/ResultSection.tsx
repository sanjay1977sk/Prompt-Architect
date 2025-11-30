import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, Terminal } from 'lucide-react';

interface ResultSectionProps {
  generatedPrompt: string;
}

export const ResultSection: React.FC<ResultSectionProps> = ({ generatedPrompt }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!generatedPrompt) return null;

  return (
    <div className="w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-slate-950/50 border-b border-slate-800 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-primary-500">
            <Terminal className="w-5 h-5" />
            <span className="font-mono text-sm font-semibold tracking-wide uppercase">Engineered Prompt</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center space-x-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors border border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <div className="p-6 md:p-8 bg-slate-900 overflow-x-auto">
          <div className="prose prose-invert prose-slate max-w-none font-sans leading-relaxed">
            <ReactMarkdown
               components={{
                h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-slate-800" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-primary-400 mt-6 mb-3" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg font-medium text-slate-200 mt-4 mb-2" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-1 text-slate-300" {...props} />,
                li: ({node, ...props}) => <li className="pl-1" {...props} />,
                p: ({node, ...props}) => <p className="text-slate-300 mb-4" {...props} />,
                code: ({node, ...props}) => (
                    <code className="bg-slate-800 text-orange-300 px-1 py-0.5 rounded text-sm font-mono" {...props} />
                ),
                pre: ({node, ...props}) => (
                    <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto border border-slate-800 my-4" {...props} />
                )
              }}
            >
              {generatedPrompt}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};