import React from 'react';
import { X, Lightbulb, BookOpen, Compass } from 'lucide-react';
import {
  CornPlotLevel2,
  MISSIONS,
  MissionId,
  OwlEngineeringStepLevel4,
  PenicillinStepLevel3,
  SoilPlotLevel1,
} from '../types/game';
import { soundEngine } from '../audio/soundEngine';

interface StemNotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  missionId: MissionId;
  activePlot1: SoilPlotLevel1;
  activePlot2: CornPlotLevel2;
  activeStep3: PenicillinStepLevel3;
  activeStep4: OwlEngineeringStepLevel4;
}

export const StemNotebookModal: React.FC<StemNotebookModalProps> = ({
  isOpen,
  onClose,
  missionId,
  activePlot1,
  activePlot2,
  activeStep3,
  activeStep4,
}) => {
  if (!isOpen) return null;

  const mission = MISSIONS[missionId];

  const currentItemName =
    missionId === 1
      ? activePlot1.name
      : missionId === 2
      ? activePlot2.name
      : missionId === 3
      ? activeStep3.name
      : activeStep4.name;

  const currentPointerHint =
    missionId === 1
      ? activePlot1.pointerHint
      : missionId === 2
      ? activePlot2.pointerHint
      : missionId === 3
      ? activeStep3.pointerHint
      : activeStep4.pointerHint;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/50 pointer-events-auto">
      <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-amber-50 border-4 border-amber-300 rounded-3xl p-5 sm:p-6 text-amber-950 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-amber-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-yellow-200 text-amber-900 rounded-2xl border border-amber-400">
              <Lightbulb className="w-5 h-5 fill-yellow-400" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-700">
                {mission.stemSubject} · Study Pointers
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-amber-950">
                {mission.backgroundTitle}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playSelect();
              onClose();
            }}
            className="p-2 text-amber-800 hover:bg-amber-200 rounded-xl transition-colors cursor-pointer"
            aria-label="Close Hint Guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Specific Pointer for Current Active Problem (No Full Answers!) */}
        <div className="p-4 bg-yellow-100/90 border-2 border-amber-400 rounded-2xl space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <Compass className="w-4 h-4 text-amber-700" />
            <span>Helpful Pointer for {currentItemName}</span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-amber-950 leading-relaxed">
            {currentPointerHint}
          </p>
        </div>

        {/* Key Formula Box */}
        <div className="p-3.5 bg-white border-2 border-amber-200 rounded-2xl space-y-1.5">
          <div className="text-xs font-bold text-amber-800">
            Formula Reference
          </div>
          <div className="font-mono text-xs sm:text-sm font-bold text-sky-800">
            {mission.keyFormula}
          </div>
          <div className="text-xs text-amber-800">
            {mission.formulaExplanation}
          </div>
        </div>

        {/* General Method Pointers */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
            <BookOpen className="w-4 h-4" />
            <span>How to Solve This Step-by-Step</span>
          </div>
          <ul className="space-y-1.5 text-xs sm:text-sm text-amber-900 list-disc list-inside leading-relaxed">
            {mission.lightbulbPointers.map((ptr, idx) => (
              <li key={idx}>{ptr}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
