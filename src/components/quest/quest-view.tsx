'use client';

import { useState } from 'react';
import type { DiaryEntry } from '@/app/lib/types';

import Step0 from './step0-weather-check';
import Step1 from './step1-get-dressed';
import Step2 from './step2-music-data';
import Step3 from './step3-at-door';
import Step4 from './step4-outside';
import Step6 from './step7-write-diary';
import Step7 from './step8-share';

type QuestViewProps = {
  onQuestComplete: (newEntry: Omit<DiaryEntry, 'id' | 'date'>) => void;
  onShowGallery: () => void;
};

export default function QuestView({ onQuestComplete, onShowGallery }: QuestViewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [newEntry, setNewEntry] = useState<Omit<DiaryEntry, 'id' | 'date'> | null>(null);
  
  const nextStep = () => setCurrentStep(prev => prev + 1);
  
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
      case 0:
        return <Step0 onNext={nextStep} onShowGallery={onShowGallery}/>;
      case 1:
        return <Step1 onNext={nextStep} onShowGallery={onShowGallery} />;
      case 2:
        return <Step2 onNext={nextStep} />;
      case 3:
        return <Step3 onNext={nextStep} />;
      case 4:
        return <Step4 onNext={nextStep} />;
      case 5:
        return <Step6 onSave={handleDiarySave} />;
      case 6:
        return <Step7 onNext={handleQuestFinished} />;
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
