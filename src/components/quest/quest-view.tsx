'use client';

import { useState } from 'react';
import type { DiaryEntry } from '@/app/lib/types';

import Step1 from './step1-get-dressed';
import Step2 from './step2-at-door';
import Step3 from './step3-outside';
import Step4 from './step4-take-photo';
import Step5 from './step5-share';
import Step6 from './step6-write-diary';

type QuestViewProps = {
  onQuestComplete: (newEntry: Omit<DiaryEntry, 'id' | 'date'>) => void;
  onShowGallery: () => void;
};

export default function QuestView({ onQuestComplete, onShowGallery }: QuestViewProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [photoDataUri, setPhotoDataUri] = useState<string>('');
  const [prompts, setPrompts] = useState<string[]>([]);
  const [newEntry, setNewEntry] = useState<Omit<DiaryEntry, 'id' | 'date'> | null>(null);
  
  const nextStep = () => setCurrentStep(prev => prev + 1);

  const handlePhotoTaken = (uri: string, suggestedPrompts: string[]) => {
    setPhotoDataUri(uri);
    setPrompts(suggestedPrompts);
    nextStep();
  };

  const handleSkipPhoto = () => {
    setPhotoDataUri('');
    setPrompts([]);
    nextStep();
  }
  
  const handleDiarySave = (entry: Omit<DiaryEntry, 'id' | 'date'>) => {
    setNewEntry(entry);
    nextStep();
  }

  const handleQuestFinished = () => {
    if (newEntry) {
      onQuestComplete(newEntry);
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 onNext={nextStep} onShowGallery={onShowGallery} />;
      case 2:
        return <Step2 onNext={nextStep} />;
      case 3:
        return <Step3 onNext={nextStep} />;
      case 4:
        return <Step4 onPhotoTaken={handlePhotoTaken} onSkip={handleSkipPhoto} />;
      case 5:
        return <Step6 photoDataUri={photoDataUri} prompts={prompts} onSave={handleDiarySave} />;
      case 6:
        return <Step5 onNext={handleQuestFinished} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background font-body p-4">
      {renderStep()}
    </div>
  );
}
