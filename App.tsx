import React, { useState, useEffect } from 'react';
import { InputSection } from './components/InputSection';
import { ResultSection } from './components/ResultSection';
import { Sidebar } from './components/HistoryList'; // Updated import
import { generateOptimizedPrompt } from './services/gemini';
import { PromptData, GenerationStatus, ModelType, PromptCriteria, ExampleTemplate } from './types';
import { BrainCircuit, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [history, setHistory] = useState<PromptData[]>(() => {
    try {
      const saved = localStorage.getItem('prompt_architect_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentResult, setCurrentResult] = useState<PromptData | null>(null);
  const [status, setStatus] = useState<GenerationStatus>({ isGenerating: false, error: null });
  const [selectedTemplate, setSelectedTemplate] = useState<ExampleTemplate | null>(null);

  useEffect(() => {
    localStorage.setItem('prompt_architect_history', JSON.stringify(history));
  }, [history]);

  const handleGenerate = async (input: string | PromptCriteria, model: ModelType) => {
    setStatus({ isGenerating: true, error: null });
    
    try {
      const resultText = await generateOptimizedPrompt(input, model);
      
      // Determine a display topic
      let displayTopic = "";
      let type: 'simple' | 'structured' = 'simple';

      if (typeof input === 'string') {
        displayTopic = input;
        type = 'simple';
      } else {
        displayTopic = input.task; // Use the main task as the topic
        type = 'structured';
        if (input.role) displayTopic = `[${input.role}] ${displayTopic}`;
      }
      
      const newPrompt: PromptData = {
        id: crypto.randomUUID(),
        topic: displayTopic,
        generatedPrompt: resultText,
        createdAt: Date.now(),
        type: type
      };

      setHistory(prev => [newPrompt, ...prev]);
      setCurrentResult(newPrompt);
    } catch (error) {
      setStatus({ isGenerating: false, error: "Failed to engineer prompt. Please try again." });
    } finally {
      setStatus(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear your history?")) {
      setHistory([]);
      setCurrentResult(null);
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    if (currentResult?.id === id) {
      setCurrentResult(null);
    }
  };

  const handleRenameHistoryItem = (id: string, newName: string) => {
    setHistory(prev => prev.map(item => 
      item.id === id ? { ...item, topic: newName } : item
    ));
    if (currentResult?.id === id) {
      setCurrentResult(prev => prev ? { ...prev, topic: newName } : null);
    }
  };

  const handleSelectTemplate = (template: ExampleTemplate) => {
      setSelectedTemplate(template);
      // Reset after a short delay so the prop change triggers again if clicked multiple times
      setTimeout(() => setSelectedTemplate(null), 100);
      setCurrentResult(null); // Clear result to focus on input
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-primary-500/30 selection:text-primary-200">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px] mix-blend-screen opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen opacity-50"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="pt-8 pb-6 px-4 md:px-8 flex justify-center items-center">
            <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-primary-500 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-primary-500/20">
                    <BrainCircuit className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight">
                        Prompt Architect
                    </h1>
                    <p className="text-slate-400 text-sm font-medium tracking-wide">
                        AI-POWERED PROMPT ENGINEERING
                    </p>
                </div>
            </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6 gap-8 grid grid-cols-1 lg:grid-cols-[1fr_320px]">
          
          <div className="flex flex-col items-center">
            <div className="w-full max-w-3xl text-center mb-10">
                <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
                    Turn vague ideas into <span className="text-primary-400 font-semibold">world-class prompts</span>. 
                    Select an <span className="text-white font-medium">Example</span> from the sidebar or build your own.
                </p>
            </div>

            <InputSection 
                onGenerate={handleGenerate} 
                isGenerating={status.isGenerating} 
                selectedTemplate={selectedTemplate}
            />
            
            {status.error && (
              <div className="w-full max-w-3xl mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center animate-in fade-in slide-in-from-top-2">
                {status.error}
              </div>
            )}

            {currentResult ? (
              <ResultSection generatedPrompt={currentResult.generatedPrompt} />
            ) : (
                <div className="w-full max-w-3xl mt-8 border-t border-slate-800/50 pt-12 flex flex-col items-center justify-center text-slate-600 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 opacity-20" />
                    </div>
                    <p className="text-sm">Ready to engineer your next breakthrough.</p>
                </div>
            )}
          </div>

          <aside className="hidden lg:block relative">
             <Sidebar 
                history={history} 
                onSelectHistory={setCurrentResult} 
                onClearHistory={handleClearHistory}
                selectedHistoryId={currentResult?.id}
                onSelectTemplate={handleSelectTemplate}
                onDeleteHistoryItem={handleDeleteHistoryItem}
                onRenameHistoryItem={handleRenameHistoryItem}
             />
          </aside>

        </main>
        
        <footer className="py-6 text-center text-slate-600 text-sm">
            <p>&copy; {new Date().getFullYear()} Prompt Architect. Built with Gemini.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;