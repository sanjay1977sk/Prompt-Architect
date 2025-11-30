export interface PromptData {
  id: string;
  topic: string;
  generatedPrompt: string;
  createdAt: number;
  type?: 'simple' | 'structured';
}

export interface PromptCriteria {
  role: string;
  task: string;
  context: string;
  format: string;
  tone: string;
}

export interface GenerationStatus {
  isGenerating: boolean;
  error: string | null;
}

export enum ModelType {
  FAST = 'gemini-2.5-flash',
  POWERFUL = 'gemini-3-pro-preview'
}

export interface ExampleTemplate {
  id: string;
  name: string;
  description: string;
  mode: 'simple' | 'advanced';
  data: string | PromptCriteria;
}