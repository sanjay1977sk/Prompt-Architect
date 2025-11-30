import React, { useState } from 'react';
import { PromptData, ExampleTemplate, PromptCriteria } from '../types';
import { History, Trash2, ChevronRight, BookOpen, Lightbulb, Zap, ArrowUpRight, GraduationCap, Target, User, FileText, Layout, MessageSquare, Video, PenTool, Image as ImageIcon, Clapperboard, Pencil, Check, X } from 'lucide-react';

interface SidebarProps {
  history: PromptData[];
  onSelectHistory: (item: PromptData) => void;
  onClearHistory: () => void;
  selectedHistoryId?: string;
  onSelectTemplate: (template: ExampleTemplate) => void;
  onDeleteHistoryItem: (id: string) => void;
  onRenameHistoryItem: (id: string, newName: string) => void;
}

// Pre-defined Templates Data
const TEMPLATES: ExampleTemplate[] = [
  {
    id: 't1',
    name: 'Simple: Explain Complexity',
    description: 'Perfect for learning new topics. Asks AI to simplify complex ideas.',
    mode: 'simple',
    data: 'Explain Quantum Computing to a 5-year-old using analogies about toys.'
  },
  {
    id: 't2',
    name: 'Simple: Code Debugger',
    description: 'Paste your error and get a fix.',
    mode: 'simple',
    data: 'I have a React useEffect infinite loop. Here is the code: [PASTE CODE]. How do I fix it?'
  },
  {
    id: 'adv-story-ind',
    name: 'Story: Indian Traditional',
    description: 'Culturally rich Indian storytelling.',
    mode: 'advanced',
    data: {
      role: 'Master Indian Storyteller (Katha Vachak) & Cultural Historian',
      task: 'Write a heartwarming story set in a traditional Indian village about a potter and his daughter during Diwali.',
      context: 'Incorporate sensory details (smell of rain/mitti, sound of temple bells), cultural values (respect for elders, community), and authentic atmosphere.',
      tone: 'Nostalgic, Evocative, Heartwarming, Wisdom-filled',
      format: 'Narrative structure with Introduction, Conflict, Climax, and Moral Conclusion (Seekh).'
    } as PromptCriteria
  },
  {
    id: 'adv-vid-split',
    name: 'Video: Story Scene Splitter',
    description: 'Break narratives into AI video prompts.',
    mode: 'advanced',
    data: {
      role: 'Expert AI Video Director & Screenwriter',
      task: 'Split the provided story summary into 5 distinct, visually detailed scenes for AI video generation (Runway/Pika/Sora).',
      context: 'Each scene must be self-contained visually. Focus on movement, lighting, and subject action. Avoid abstract concepts.',
      tone: 'Visual, Technical, Concise, Direct',
      format: 'Scene # | Subject Description | Action/Movement | Environment/Lighting | Camera Angle'
    } as PromptCriteria
  },
  {
    id: 'adv-img-ind',
    name: 'Image: Indian Traditional',
    description: 'Authentic cultural image prompts.',
    mode: 'advanced',
    data: {
      role: 'Visual Director & Indian Art Curator',
      task: 'Create a detailed image prompt for a "Royal Rajasthan Court" scene.',
      context: 'Historically accurate architecture (Jharokhas), attire (Sherwanis, Lehengas), and vibrant colors. Oil painting style.',
      tone: 'Vivid, Artistic, Detailed, Culturally Accurate',
      format: 'Subject + Art Style (e.g., Miniature Painting) + Lighting + Color Palette + Composition'
    } as PromptCriteria
  },
  {
    id: 'adv-vid-cine',
    name: 'Video: Smooth Cinematic',
    description: 'High-end cinematic video shots.',
    mode: 'advanced',
    data: {
      role: 'Director of Photography (DoP) & Cinematographer',
      task: 'Write a prompt for a smooth, cinematic establishing shot of a futuristic cyberpunk city in rain.',
      context: 'Focus on "smooth motion" (gimbal, drone, dolly zoom). Lighting should be volumetric and moody. 4k resolution.',
      tone: 'Atmospheric, Cinematic, Professional',
      format: 'Camera Movement + Subject Action + Lighting + Atmosphere + Tech Specs (4k, 60fps)'
    } as PromptCriteria
  },
  {
    id: 'adv-story-myth',
    name: 'Story: Mythological Epic',
    description: 'Scripting for mythological epics.',
    mode: 'advanced',
    data: {
      role: 'Mythological Scriptwriter & Scholar',
      task: 'Retell the scene of "The Churning of the Ocean" (Samudra Manthan).',
      context: 'Focus on the grandeur, the struggle between Devas and Asuras, and the cosmic significance.',
      tone: 'Epic, Grand, Reverent, Dramatic',
      format: 'Script format with Scene Description and Dialogue.'
    } as PromptCriteria
  },
  {
    id: 'adv-vid-char',
    name: 'Video: Character Consistency',
    description: 'Define consistent characters for video.',
    mode: 'advanced',
    data: {
      role: 'Character Designer',
      task: 'Create a detailed character sheet for a protagonist named "Aarav", a futuristic space explorer.',
      context: 'To ensure consistency across multiple AI generated images/videos.',
      tone: 'Precise, Descriptive, Objective',
      format: 'Name, Age, Physical Appearance (Hair, Eyes, Build), Clothing (Outfit 1, Outfit 2), Accessories, Personality Traits.'
    } as PromptCriteria
  },
  {
    id: 't3',
    name: 'Pro: SEO Blog Post',
    description: 'Generate a high-ranking article.',
    mode: 'advanced',
    data: {
      role: 'Expert SEO Content Writer',
      task: 'Write a comprehensive blog post about "The Future of Remote Work"',
      context: 'Target audience is digital nomads and tech startups. Keywords: async work, digital nomad tools.',
      tone: 'Informative, Optimistic, Professional',
      format: 'Markdown with H1, H2, H3 headers. Include a FAQ section.'
    } as PromptCriteria
  },
  {
    id: 't4',
    name: 'Pro: Job Application',
    description: 'Custom cover letter generation.',
    mode: 'advanced',
    data: {
      role: 'Career Coach & Professional Writer',
      task: 'Draft a compelling cover letter for a Senior Frontend Engineer role',
      context: 'Applying to Google. My key skills are React, TypeScript, and 5 years of experience leading teams.',
      tone: 'Confident, Professional, Enthusiastic',
      format: 'Standard Business Letter format'
    } as PromptCriteria
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  history, 
  onSelectHistory, 
  onClearHistory, 
  selectedHistoryId,
  onSelectTemplate,
  onDeleteHistoryItem,
  onRenameHistoryItem
}) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'templates' | 'history'>('guide');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEditing = (e: React.MouseEvent, item: PromptData) => {
    e.stopPropagation();
    setEditingId(item.id);
    setEditValue(item.topic);
  };

  const saveEditing = (e: React.MouseEvent | React.KeyboardEvent, id: string) => {
    e.stopPropagation();
    if (editValue.trim()) {
      onRenameHistoryItem(id, editValue.trim());
    }
    setEditingId(null);
  };

  const cancelEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  return (
    <div className="hidden lg:flex flex-col w-80 h-[calc(100vh-8rem)] sticky top-32 bg-slate-900/50 rounded-2xl border border-slate-800 backdrop-blur-md overflow-hidden shadow-xl">
      
      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('guide')}
          className={`flex-1 py-3 text-xs font-medium flex flex-col items-center justify-center space-y-1 transition-colors
            ${activeTab === 'guide' ? 'text-primary-400 bg-slate-800/50 border-b-2 border-primary-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Guide</span>
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 py-3 text-xs font-medium flex flex-col items-center justify-center space-y-1 transition-colors
            ${activeTab === 'templates' ? 'text-primary-400 bg-slate-800/50 border-b-2 border-primary-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Templates</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 text-xs font-medium flex flex-col items-center justify-center space-y-1 transition-colors
            ${activeTab === 'history' ? 'text-primary-400 bg-slate-800/50 border-b-2 border-primary-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <History className="w-4 h-4" />
          <span>History</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-900/30">
        
        {/* GUIDE TAB */}
        {activeTab === 'guide' && (
            <div className="p-4 space-y-6">
                <div className="text-center mb-4">
                    <h3 className="text-sm font-bold text-white mb-1">Master the 5 Pillars</h3>
                    <p className="text-xs text-slate-400">Fill these 5 windows to create the perfect prompt.</p>
                </div>

                {/* 1. Task */}
                <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-primary-400">
                        <Target className="w-4 h-4" />
                        <span className="text-sm font-bold uppercase tracking-wide">1. Task / Objective</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-300 border border-slate-700/50">
                        <p className="mb-2 font-medium text-white">The main command. What do you want?</p>
                        <div className="space-y-2 pl-2 border-l-2 border-slate-700">
                            <div>
                                <span className="text-slate-500 block text-[10px] uppercase">Beginner</span>
                                <span className="text-slate-400">"Write an email."</span>
                            </div>
                            <div>
                                <span className="text-primary-500 block text-[10px] uppercase font-bold">Expert</span>
                                <span className="text-primary-100">"Draft a persuasive cold outreach email focusing on value proposition."</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Role */}
                <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-primary-400">
                        <User className="w-4 h-4" />
                        <span className="text-sm font-bold uppercase tracking-wide">2. Role / Persona</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-300 border border-slate-700/50">
                        <p className="mb-2 font-medium text-white">Who is the AI? (Gives it expertise)</p>
                        <div className="space-y-2 pl-2 border-l-2 border-slate-700">
                            <div>
                                <span className="text-slate-500 block text-[10px] uppercase">Beginner</span>
                                <span className="text-slate-400">"Helper."</span>
                            </div>
                            <div>
                                <span className="text-primary-500 block text-[10px] uppercase font-bold">Expert</span>
                                <span className="text-primary-100">"Senior SaaS Copywriter with 10 years of experience in B2B sales."</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Tone */}
                <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-primary-400">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm font-bold uppercase tracking-wide">3. Tone & Style</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-300 border border-slate-700/50">
                        <p className="mb-2 font-medium text-white">The "Vibe" or personality.</p>
                        <div className="space-y-2 pl-2 border-l-2 border-slate-700">
                            <div>
                                <span className="text-slate-500 block text-[10px] uppercase">Beginner</span>
                                <span className="text-slate-400">"Professional."</span>
                            </div>
                            <div>
                                <span className="text-primary-500 block text-[10px] uppercase font-bold">Expert</span>
                                <span className="text-primary-100">"Assertive yet empathetic, using corporate jargon sparingly."</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Context */}
                <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-primary-400">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm font-bold uppercase tracking-wide">4. Context</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-300 border border-slate-700/50">
                        <p className="mb-2 font-medium text-white">Background info & constraints.</p>
                        <div className="space-y-2 pl-2 border-l-2 border-slate-700">
                            <div>
                                <span className="text-slate-500 block text-[10px] uppercase">Beginner</span>
                                <span className="text-slate-400">"For my boss."</span>
                            </div>
                            <div>
                                <span className="text-primary-500 block text-[10px] uppercase font-bold">Expert</span>
                                <span className="text-primary-100">"Target audience is CTOs. Limit to 150 words. Focus on ROI."</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Output Format */}
                <div className="space-y-2 pb-6">
                    <div className="flex items-center space-x-2 text-primary-400">
                        <Layout className="w-4 h-4" />
                        <span className="text-sm font-bold uppercase tracking-wide">5. Output Format</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-300 border border-slate-700/50">
                        <p className="mb-2 font-medium text-white">How the result should look.</p>
                        <div className="space-y-2 pl-2 border-l-2 border-slate-700">
                            <div>
                                <span className="text-slate-500 block text-[10px] uppercase">Beginner</span>
                                <span className="text-slate-400">"A list."</span>
                            </div>
                            <div>
                                <span className="text-primary-500 block text-[10px] uppercase font-bold">Expert</span>
                                <span className="text-primary-100">"Markdown table with columns for Feature, Benefit, and Use-Case."</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* TEMPLATES TAB */}
        {activeTab === 'templates' && (
          <div className="p-4 space-y-4">
            <div className="p-3 bg-primary-900/20 border border-primary-500/20 rounded-xl mb-4">
                <div className="flex items-start space-x-3">
                    <Lightbulb className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-semibold text-primary-300 mb-1">Template Library</h4>
                        <p className="text-xs text-primary-200/70 leading-relaxed">
                            Select a template to auto-fill the builder with a "Recipe".
                        </p>
                    </div>
                </div>
            </div>

            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Quick Start Examples</h3>
            {TEMPLATES.filter(t => t.mode === 'simple').map(template => (
                <button
                    key={template.id}
                    onClick={() => onSelectTemplate(template)}
                    className="w-full text-left p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-primary-500/50 hover:bg-slate-800 transition-all group"
                >
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-slate-200 group-hover:text-primary-300">{template.name}</span>
                        <Zap className="w-3 h-3 text-yellow-500/70" />
                    </div>
                    <p className="text-xs text-slate-500 leading-snug">{template.description}</p>
                </button>
            ))}

            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 pt-2">Advanced / Pro</h3>
            {TEMPLATES.filter(t => t.mode === 'advanced').map(template => (
                <button
                    key={template.id}
                    onClick={() => onSelectTemplate(template)}
                    className="w-full text-left p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-primary-500/50 hover:bg-slate-800 transition-all group relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary-500/10 to-transparent -mr-8 -mt-8 rounded-full blur-xl group-hover:from-primary-500/20"></div>
                    <div className="flex justify-between items-center mb-1 relative z-10">
                        <div className="flex items-center space-x-2">
                           {template.name.includes('Video') ? <Clapperboard className="w-3.5 h-3.5 text-purple-400"/> : 
                            template.name.includes('Image') ? <ImageIcon className="w-3.5 h-3.5 text-pink-400"/> :
                            template.name.includes('Story') ? <PenTool className="w-3.5 h-3.5 text-blue-400"/> :
                            <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-primary-400" />
                           }
                           <span className="text-sm font-medium text-slate-200 group-hover:text-primary-300">{template.name}</span>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-snug relative z-10 pl-5">{template.description}</p>
                </button>
            ))}
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="p-2 space-y-2">
            {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-500 px-4 text-center">
                    <History className="w-8 h-8 mb-3 opacity-20" />
                    <p className="text-sm">No recent history</p>
                    <p className="text-xs mt-1 opacity-50">Generated prompts will appear here.</p>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center px-2 py-2">
                        <span className="text-xs font-medium text-slate-500">Recent generations</span>
                        <button 
                            onClick={onClearHistory} 
                            className="text-xs text-red-400 hover:text-red-300 flex items-center space-x-1 px-2 py-1 rounded hover:bg-red-500/10 transition-colors"
                        >
                            <Trash2 className="w-3 h-3" />
                            <span>Clear</span>
                        </button>
                    </div>
                    {history.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => onSelectHistory(item)}
                        role="button"
                        className={`relative w-full text-left p-3 rounded-xl transition-all duration-200 group border cursor-pointer
                        ${selectedHistoryId === item.id 
                            ? 'bg-primary-900/20 border-primary-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                            : 'bg-transparent border-transparent hover:bg-slate-800/50 hover:border-slate-700'
                        }`}
                    >
                        {editingId === item.id ? (
                            <div className="flex items-center space-x-1" onClick={e => e.stopPropagation()}>
                                <input
                                    type="text"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="flex-1 bg-slate-950 border border-primary-500/50 rounded px-2 py-1 text-xs text-white focus:outline-none"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if(e.key === 'Enter') saveEditing(e, item.id);
                                        if(e.key === 'Escape') setEditingId(null);
                                    }}
                                />
                                <button onClick={(e) => saveEditing(e, item.id)} className="p-1 hover:text-green-400 text-slate-400"><Check className="w-3 h-3" /></button>
                                <button onClick={cancelEditing} className="p-1 hover:text-red-400 text-slate-400"><X className="w-3 h-3" /></button>
                            </div>
                        ) : (
                            <div className="flex justify-between items-start pr-14">
                                <h4 className={`text-sm font-medium line-clamp-2 leading-snug mb-1 ${selectedHistoryId === item.id ? 'text-primary-300' : 'text-slate-300 group-hover:text-white'}`}>
                                    {item.topic}
                                </h4>
                            </div>
                        )}

                        <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-slate-500 font-mono">
                                {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                            {selectedHistoryId === item.id && !editingId && <ChevronRight className="w-3 h-3 text-primary-400" />}
                        </div>
                        
                        {!editingId && (
                            <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-all z-10">
                                <button
                                    onClick={(e) => startEditing(e, item)}
                                    className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-slate-900/80 rounded-lg"
                                    title="Rename"
                                >
                                    <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteHistoryItem(item.id);
                                    }}
                                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-900/80 rounded-lg"
                                    title="Delete"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}
                    </div>
                    ))}
                </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};