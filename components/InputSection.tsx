import React, { useState, KeyboardEvent, useEffect } from 'react';
import { Sparkles, ArrowRight, Layers, User, Target, FileText, Layout, MessageSquare, Zap } from 'lucide-react';
import { ModelType, PromptCriteria, ExampleTemplate } from '../types';

interface InputSectionProps {
  onGenerate: (input: string | PromptCriteria, model: ModelType) => void;
  isGenerating: boolean;
  selectedTemplate: ExampleTemplate | null;
}

export const InputSection: React.FC<InputSectionProps> = ({ onGenerate, isGenerating, selectedTemplate }) => {
  const [mode, setMode] = useState<'simple' | 'advanced'>('simple');
  const [model, setModel] = useState<ModelType>(ModelType.FAST);
  
  // Simple Mode State
  const [topic, setTopic] = useState('');

  // Advanced Mode State
  const [criteria, setCriteria] = useState<PromptCriteria>({
    role: '',
    task: '',
    context: '',
    format: '',
    tone: ''
  });

  // Watch for template selection
  useEffect(() => {
    if (selectedTemplate) {
      setMode(selectedTemplate.mode);
      if (selectedTemplate.mode === 'simple') {
        setTopic(selectedTemplate.data as string);
      } else {
        setCriteria(selectedTemplate.data as PromptCriteria);
      }
    }
  }, [selectedTemplate]);

  const handleSimpleSubmit = () => {
    if (!topic.trim()) return;
    onGenerate(topic, model);
  };

  const handleAdvancedSubmit = () => {
    if (!criteria.task.trim()) return;
    onGenerate(criteria, model);
  };

  const handleKeyDownSimple = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSimpleSubmit();
    }
  };

  const updateCriteria = (field: keyof PromptCriteria, value: string) => {
    setCriteria(prev => ({ ...prev, [field]: value }));
  };

  const isAdvancedValid = criteria.task.trim().length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      {/* Mode Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex space-x-1">
            <button
                onClick={() => setMode('simple')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2
                ${mode === 'simple' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
                <Zap className="w-4 h-4" />
                <span>Quick Start</span>
            </button>
            <button
                onClick={() => setMode('advanced')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2
                ${mode === 'advanced' ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
                <Layers className="w-4 h-4" />
                <span>Criteria Builder</span>
            </button>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-1 shadow-2xl transition-all duration-300">
        
        {mode === 'simple' ? (
            <div className="relative">
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={handleKeyDownSimple}
                  placeholder="Describe what you want the AI to do (e.g., 'Write a cover letter for a software engineer job')..."
                  className="w-full bg-transparent text-slate-100 placeholder-slate-400 p-6 text-lg focus:outline-none resize-none min-h-[120px] rounded-xl"
                  disabled={isGenerating}
                />
            </div>
        ) : (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                 {/* Task - Main Focus */}
                 <div className="md:col-span-2 bg-slate-900/50 rounded-xl border border-slate-700/50 p-3 focus-within:border-primary-500/50 transition-colors">
                    <label className="flex items-center text-xs font-bold text-primary-400 mb-2 uppercase tracking-wider">
                        <Target className="w-3.5 h-3.5 mr-1.5" /> 
                        <span>Task / Objective</span>
                        <span className="ml-1.5 text-slate-500 font-medium normal-case">(कार्य / उद्देश्य)</span>
                        <span className="text-red-400 ml-1">*</span>
                    </label>
                    <textarea
                        value={criteria.task}
                        onChange={(e) => updateCriteria('task', e.target.value)}
                        placeholder="What is the main goal? (e.g., Write a blog post about coffee)"
                        className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none resize-none min-h-[60px]"
                    />
                 </div>

                 {/* Role */}
                 <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-3 focus-within:border-primary-500/50 transition-colors">
                    <label className="flex items-center text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                        <User className="w-3.5 h-3.5 mr-1.5" /> 
                        <span>Role / Persona</span>
                        <span className="ml-1.5 text-slate-600 font-medium normal-case">(भूमिका / पात्र)</span>
                    </label>
                    <input
                        type="text"
                        value={criteria.role}
                        onChange={(e) => updateCriteria('role', e.target.value)}
                        placeholder="Who is the AI? (e.g., Senior Marketer)"
                        className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
                    />
                 </div>

                 {/* Tone */}
                 <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-3 focus-within:border-primary-500/50 transition-colors">
                    <label className="flex items-center text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                        <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> 
                        <span>Tone & Style</span>
                        <span className="ml-1.5 text-slate-600 font-medium normal-case">(लहजा / शैली)</span>
                    </label>
                    <input
                        type="text"
                        value={criteria.tone}
                        onChange={(e) => updateCriteria('tone', e.target.value)}
                        placeholder="How should it sound? (e.g., Witty, Professional)"
                        className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
                    />
                 </div>

                 {/* Context */}
                 <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-3 focus-within:border-primary-500/50 transition-colors">
                    <label className="flex items-center text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                        <FileText className="w-3.5 h-3.5 mr-1.5" /> 
                        <span>Context</span>
                        <span className="ml-1.5 text-slate-600 font-medium normal-case">(संदर्भ)</span>
                    </label>
                    <textarea
                        value={criteria.context}
                        onChange={(e) => updateCriteria('context', e.target.value)}
                        placeholder="Background info... (e.g., Target audience is beginners)"
                        className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none resize-none min-h-[60px]"
                    />
                 </div>

                 {/* Format */}
                 <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-3 focus-within:border-primary-500/50 transition-colors">
                    <label className="flex items-center text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                        <Layout className="w-3.5 h-3.5 mr-1.5" /> 
                        <span>Output Format</span>
                        <span className="ml-1.5 text-slate-600 font-medium normal-case">(आउटपुट प्रारूप)</span>
                    </label>
                    <textarea
                        value={criteria.format}
                        onChange={(e) => updateCriteria('format', e.target.value)}
                        placeholder="Structure... (e.g., JSON, Markdown table, Bullet points)"
                        className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none resize-none min-h-[60px]"
                    />
                 </div>
            </div>
        )}
        
        <div className="flex justify-between items-center px-6 pb-3 pt-3 border-t border-slate-700/50">
          <div className="flex items-center space-x-4">
             <label className="flex items-center space-x-2 cursor-pointer group">
                <input 
                  type="radio" 
                  checked={model === ModelType.FAST}
                  onChange={() => setModel(ModelType.FAST)}
                  className="hidden" 
                />
                <span className={`w-3 h-3 rounded-full ${model === ModelType.FAST ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]' : 'bg-slate-600 group-hover:bg-slate-500'}`}></span>
                <span className={`text-sm ${model === ModelType.FAST ? 'text-green-400 font-medium' : 'text-slate-400 group-hover:text-slate-300'}`}>Fast</span>
             </label>

             <label className="flex items-center space-x-2 cursor-pointer group">
                <input 
                  type="radio" 
                  checked={model === ModelType.POWERFUL}
                  onChange={() => setModel(ModelType.POWERFUL)}
                  className="hidden" 
                />
                <span className={`w-3 h-3 rounded-full ${model === ModelType.POWERFUL ? 'bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.5)]' : 'bg-slate-600 group-hover:bg-slate-500'}`}></span>
                <span className={`text-sm ${model === ModelType.POWERFUL ? 'text-purple-400 font-medium' : 'text-slate-400 group-hover:text-slate-300'}`}>Reasoning</span>
             </label>
          </div>

          <button
            onClick={mode === 'simple' ? handleSimpleSubmit : handleAdvancedSubmit}
            disabled={(mode === 'simple' ? !topic.trim() : !isAdvancedValid) || isGenerating}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 
              ${(mode === 'simple' ? !topic.trim() : !isAdvancedValid) || isGenerating 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/25 active:scale-95'
              }`}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                <span>Architecting...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Prompt</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};