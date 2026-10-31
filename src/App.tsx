import React, { useCallback, useRef, useState } from 'react';
import {
  Lightbulb,
  Music,
  VolumeX,
  Play,
  Sparkles,
  Check,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Calculator,
  Disc3,
} from 'lucide-react';
import {
  CornPlotLevel2,
  GameMode,
  INITIAL_LEVEL_1_PLOTS,
  INITIAL_LEVEL_2_PLOTS,
  INITIAL_LEVEL_3_STEPS,
  INITIAL_LEVEL_4_STEPS,
  MISSIONS,
  MissionId,
  OwlEngineeringStepLevel4,
  PenicillinStepLevel3,
  REAGENTS,
  SoilPlotLevel1,
} from './types/game';
import { WorldCanvas } from './components/WorldCanvas';
import { StemNotebookModal } from './components/StemNotebookModal';
import { LOFI_TRACKS, soundEngine } from './audio/soundEngine';

export default function App() {
  const [gameMode, setGameMode] = useState<GameMode>('OPEN_WORLD');
  const [activeMissionId, setActiveMissionId] = useState<MissionId>(1);
  const [nearbyMissionId, setNearbyMissionId] = useState<MissionId | null>(null);
  const [mission1Completed, setMission1Completed] = useState<boolean>(false);
  const [mission2Completed, setMission2Completed] = useState<boolean>(false);
  const [mission3Completed, setMission3Completed] = useState<boolean>(false);
  const [mission4Completed, setMission4Completed] = useState<boolean>(false);

  // Audio & Lofi Girl Track State
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [lofiStarted, setLofiStarted] = useState<boolean>(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isHintModalOpen, setIsHintModalOpen] = useState<boolean>(false);
  const [showBriefingHints, setShowBriefingHints] = useState<boolean>(false);

  // Mission 1 Quiz State
  const [level1Plots, setLevel1Plots] = useState<SoilPlotLevel1[]>(() =>
    INITIAL_LEVEL_1_PLOTS.map((p) => ({ ...p }))
  );
  const [selectedPlot1Id, setSelectedPlot1Id] = useState<number>(1);
  const [quizReagentId, setQuizReagentId] = useState<'sweet_lime' | 'berry_compost'>('sweet_lime');
  const [quizInitialPhInput, setQuizInitialPhInput] = useState<string>('');
  const [quizGramsInput, setQuizGramsInput] = useState<string>('');
  const [quiz1Feedback, setQuiz1Feedback] = useState<{ text: string; isError: boolean } | null>(
    null
  );

  // Mission 2 Quiz State
  const [level2Plots, setLevel2Plots] = useState<CornPlotLevel2[]>(() =>
    INITIAL_LEVEL_2_PLOTS.map((p) => ({ ...p }))
  );
  const [selectedPlot2Id, setSelectedPlot2Id] = useState<number>(1);
  const [quizFlightTimeInput, setQuizFlightTimeInput] = useState<string>('');
  const [quizVelocityInput, setQuizVelocityInput] = useState<string>('');
  const [quiz2Feedback, setQuiz2Feedback] = useState<{ text: string; isError: boolean } | null>(
    null
  );

  // Mission 3 Quiz State (Haverford Black Squirrel · Penicillin)
  const [level3Steps, setLevel3Steps] = useState<PenicillinStepLevel3[]>(() =>
    INITIAL_LEVEL_3_STEPS.map((s) => ({ ...s }))
  );
  const [selectedStep3Id, setSelectedStep3Id] = useState<number>(1);
  const [quizStep3Input, setQuizStep3Input] = useState<string>('');
  const [quiz3Feedback, setQuiz3Feedback] = useState<{ text: string; isError: boolean } | null>(
    null
  );

  // Mission 4 Quiz State (Bryn Mawr Owl · Nest Engineering)
  const [level4Steps, setLevel4Steps] = useState<OwlEngineeringStepLevel4[]>(() =>
    INITIAL_LEVEL_4_STEPS.map((s) => ({ ...s }))
  );
  const [selectedStep4Id, setSelectedStep4Id] = useState<number>(1);
  const [quizStep4Input, setQuizStep4Input] = useState<string>('');
  const [quiz4Feedback, setQuiz4Feedback] = useState<{ text: string; isError: boolean } | null>(
    null
  );

  const canvasTriggerRef = useRef<{
    sprayEffect: ((plotId: number, color: string, isSuccess: boolean, message: string) => void) | null;
    fireCannonWithVelocity: ((v0: number, plot: CornPlotLevel2) => void) | null;
    triggerLabBurst: ((xRatio: number, yRatio: number, color: string, text: string, subtext?: string) => void) | null;
    moveAvatarDir: ((dx: number, dy: number) => void) | null;
  }>({
    sprayEffect: null,
    fireCannonWithVelocity: null,
    triggerLabBurst: null,
    moveAvatarDir: null,
  });

  const activeMission = MISSIONS[activeMissionId];
  const activePlot1 =
    level1Plots.find((p) => p.id === selectedPlot1Id) || level1Plots[0];
  const activePlot2 =
    level2Plots.find((p) => p.id === selectedPlot2Id) || level2Plots[0];
  const activeStep3 =
    level3Steps.find((s) => s.id === selectedStep3Id) || level3Steps[0];
  const activeStep4 =
    level4Steps.find((s) => s.id === selectedStep4Id) || level4Steps[0];

  const ensureLofiMusic = () => {
    if (!isMuted && !lofiStarted) {
      soundEngine.startLofiMusic();
      setLofiStarted(true);
    }
  };

  const handleToggleAudio = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    soundEngine.setMuted(nextMute);
    if (!nextMute) {
      setLofiStarted(true);
    }
  };

  const advanceLofiBeatOnMissionComplete = useCallback((completedMissionId: MissionId) => {
    // Switch to a distinct Lofi Girl hip-hop beat after each mission completion!
    const nextTrackIdx = completedMissionId % LOFI_TRACKS.length;
    soundEngine.setTrack(nextTrackIdx);
    setCurrentTrackIndex(nextTrackIdx);
  }, []);

  const handleSelectPlot1 = useCallback((id: number) => {
    setSelectedPlot1Id(id);
    setQuizInitialPhInput('');
    setQuizGramsInput('');
    setQuiz1Feedback(null);
  }, []);

  const handleSelectPlot2 = useCallback((id: number) => {
    setSelectedPlot2Id(id);
    setQuizFlightTimeInput('');
    setQuizVelocityInput('');
    setQuiz2Feedback(null);
  }, []);

  const handleSelectStep3 = useCallback((id: number) => {
    setSelectedStep3Id(id);
    setQuizStep3Input('');
    setQuiz3Feedback(null);
  }, []);

  const handleSelectStep4 = useCallback((id: number) => {
    setSelectedStep4Id(id);
    setQuizStep4Input('');
    setQuiz4Feedback(null);
  }, []);

  const handleSelectMissionFromWorld = useCallback((mId: MissionId) => {
    if (!soundEngine.isMuted()) {
      soundEngine.startLofiMusic();
      setLofiStarted(true);
    }
    setActiveMissionId(mId);
    setShowBriefingHints(false);
    setGameMode('MISSION_BRIEFING');
  }, []);

  const handleBeginMissionPlay = () => {
    ensureLofiMusic();
    soundEngine.playSelect();
    setQuiz1Feedback(null);
    setQuiz2Feedback(null);
    setQuiz3Feedback(null);
    setQuiz4Feedback(null);
    setQuizGramsInput('');
    setQuizInitialPhInput('');
    setQuizFlightTimeInput('');
    setQuizVelocityInput('');
    setQuizStep3Input('');
    setQuizStep4Input('');

    if (activeMissionId === 1) {
      if (mission1Completed) setLevel1Plots(INITIAL_LEVEL_1_PLOTS.map((p) => ({ ...p })));
      setSelectedPlot1Id(1);
    } else if (activeMissionId === 2) {
      if (mission2Completed) setLevel2Plots(INITIAL_LEVEL_2_PLOTS.map((p) => ({ ...p })));
      setSelectedPlot2Id(1);
    } else if (activeMissionId === 3) {
      if (mission3Completed) setLevel3Steps(INITIAL_LEVEL_3_STEPS.map((s) => ({ ...s })));
      setSelectedStep3Id(1);
    } else if (activeMissionId === 4) {
      if (mission4Completed) setLevel4Steps(INITIAL_LEVEL_4_STEPS.map((s) => ({ ...s })));
      setSelectedStep4Id(1);
    }
    setGameMode('PLAYING_MISSION');
  };

  // ==================== MISSION 1 SUBMIT (SOIL pH) ====================
  const handleSubmitSoilQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameMode !== 'PLAYING_MISSION' || activeMissionId !== 1) return;
    ensureLofiMusic();

    if (activePlot1.givenHPlusExponent !== undefined) {
      const parsedInitPh = parseFloat(quizInitialPhInput.trim());
      if (isNaN(parsedInitPh) || Math.abs(parsedInitPh - activePlot1.initialPh) > 0.05) {
        soundEngine.playMissThud();
        setQuiz1Feedback({
          text: 'Check Step 1: Use pH = -log₁₀[H⁺] for [H⁺] = 10⁻⁵ M.',
          isError: true,
        });
        return;
      }
    }

    const grams = parseFloat(quizGramsInput.trim());
    if (isNaN(grams) || grams <= 0) {
      soundEngine.playMissThud();
      setQuiz1Feedback({
        text: 'Enter a positive number of grams.',
        isError: true,
      });
      return;
    }

    const chosenReagent =
      REAGENTS.find((r) => r.id === quizReagentId) || REAGENTS[0];
    const resultingPh = Number(
      (activePlot1.initialPh + chosenReagent.phShiftPerGram * grams).toFixed(2)
    );
    const isCorrect =
      quizReagentId === activePlot1.expectedReagentId &&
      Math.abs(grams - activePlot1.expectedGrams) < 0.05;

    soundEngine.playChemicalFizz(isCorrect);

    if (canvasTriggerRef.current.sprayEffect) {
      canvasTriggerRef.current.sprayEffect(
        activePlot1.id,
        chosenReagent.color,
        isCorrect,
        `Resulting pH: ${resultingPh}`
      );
    }

    if (!isCorrect) {
      if (quizReagentId !== activePlot1.expectedReagentId) {
        setQuiz1Feedback({
          text: `${chosenReagent.name} shifted pH to ${resultingPh}. Check if you need Acid or Base!`,
          isError: true,
        });
      } else {
        setQuiz1Feedback({
          text: `${grams}g shifted pH to ${resultingPh} (Target: ${activePlot1.targetPh.toFixed(1)}). Recalculate |ΔpH| ÷ 0.5!`,
          isError: true,
        });
      }
      return;
    }

    setQuiz1Feedback({
      text: `Correct! ${grams}g brought Bed ${activePlot1.id} to pH ${activePlot1.targetPh.toFixed(1)}!`,
      isError: false,
    });

    setLevel1Plots((prev) => {
      const updated = prev.map((p) =>
        p.id === activePlot1.id
          ? { ...p, currentPh: p.targetPh, isTerraformed: true }
          : p
      );

      const nextUnfinished = updated.find((p) => !p.isTerraformed);
      if (nextUnfinished) {
        setTimeout(() => handleSelectPlot1(nextUnfinished.id), 850);
      } else {
        setTimeout(() => {
          soundEngine.playSuccessChord();
          advanceLofiBeatOnMissionComplete(1);
          setMission1Completed(true);
          setGameMode('MISSION_COMPLETE');
        }, 1200);
      }
      return updated;
    });
  };

  // ==================== MISSION 2 SUBMIT (PROJECTILE MOTION) ====================
  const handleSubmitProjectileQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameMode !== 'PLAYING_MISSION' || activeMissionId !== 2) return;
    ensureLofiMusic();

    if (activePlot2.id === 2) {
      const parsedT = parseFloat(quizFlightTimeInput.trim());
      if (isNaN(parsedT) || Math.abs(parsedT - activePlot2.flightTimeSeconds) > 0.05) {
        soundEngine.playMissThud();
        setQuiz2Feedback({
          text: 'Check Step 1: Use t = (2 · v₀ᵧ) ÷ g with v₀ᵧ = 15 m/s and g = 10 m/s².',
          isError: true,
        });
        return;
      }
    }

    const v0 = parseFloat(quizVelocityInput.trim());
    if (isNaN(v0) || v0 <= 0) {
      soundEngine.playMissThud();
      setQuiz2Feedback({
        text: 'Enter your calculated launch speed v₀ in m/s.',
        isError: true,
      });
      return;
    }

    soundEngine.playCannonFire();
    setQuiz2Feedback({
      text: `Launching seed at v₀ = ${v0} m/s...`,
      isError: false,
    });

    if (canvasTriggerRef.current.fireCannonWithVelocity) {
      canvasTriggerRef.current.fireCannonWithVelocity(v0, activePlot2);
    }
  };

  const handleCornPlotHit = useCallback(
    (plotId: number) => {
      setQuiz2Feedback({
        text: 'Exact Hit! Look at the cute wiggly corn grow!',
        isError: false,
      });

      setLevel2Plots((prev) => {
        const updated = prev.map((p) =>
          p.id === plotId ? { ...p, isPlanted: true } : p
        );

        const nextUnplanted = updated.find((p) => !p.isPlanted);
        if (nextUnplanted) {
          setTimeout(() => handleSelectPlot2(nextUnplanted.id), 900);
        } else {
          setTimeout(() => {
            soundEngine.playSuccessChord();
            advanceLofiBeatOnMissionComplete(2);
            setMission2Completed(true);
            setGameMode('MISSION_COMPLETE');
          }, 1450);
        }

        return updated;
      });
    },
    [handleSelectPlot2, advanceLofiBeatOnMissionComplete]
  );

  const handleProjectileMiss = useCallback((impactX: number, expectedX: number) => {
    setQuiz2Feedback({
      text: `Seed landed at x = ${impactX.toFixed(1)} m (Target is ${expectedX} m). Check x = (v₀·cos θ + v_wind)·t!`,
      isError: true,
    });
  }, []);

  // ==================== MISSION 3 SUBMIT (HAVERFORD SQUIRREL PENICILLIN) ====================
  const handleSubmitPenicillinQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameMode !== 'PLAYING_MISSION' || activeMissionId !== 3) return;
    ensureLofiMusic();

    const val = parseFloat(quizStep3Input.trim());
    if (isNaN(val) || val <= 0) {
      soundEngine.playMissThud();
      setQuiz3Feedback({
        text: `Please enter a valid number (${activeStep3.unitLabel}).`,
        isError: true,
      });
      return;
    }

    const isCorrect = Math.abs(val - activeStep3.expectedAnswer) < 0.05;
    soundEngine.playChemicalFizz(isCorrect);

    if (!isCorrect) {
      setQuiz3Feedback({
        text: `${val} ${activeStep3.unitLabel} is not exact. Check the formula ${activeStep3.formulaDisplay} or click Pointer!`,
        isError: true,
      });
      return;
    }

    setQuiz3Feedback({
      text: `Correct! ${val} ${activeStep3.unitLabel} verified!`,
      isError: false,
    });

    canvasTriggerRef.current.triggerLabBurst?.(
      0.34,
      0.55,
      '#10b981',
      `✓ ${activeStep3.name} Complete!`,
      `${val} ${activeStep3.unitLabel}`
    );

    setLevel3Steps((prev) => {
      const updated = prev.map((s) =>
        s.id === activeStep3.id ? { ...s, isCompleted: true } : s
      );

      const nextStep = updated.find((s) => !s.isCompleted);
      if (nextStep) {
        setTimeout(() => handleSelectStep3(nextStep.id), 800);
      } else {
        // All 3 penicillin steps done! Squirrel is healed and says "okay, time bryndin ; D"
        canvasTriggerRef.current.triggerLabBurst?.(
          0.53,
          0.52,
          '#facc15',
          'okay, time bryndin ; D',
          'Haverford Squirrel Healed!'
        );
        setTimeout(() => {
          soundEngine.playSuccessChord();
          advanceLofiBeatOnMissionComplete(3);
          setMission3Completed(true);
          setGameMode('MISSION_COMPLETE');
        }, 1450);
      }
      return updated;
    });
  };

  // ==================== MISSION 4 SUBMIT (BRYN MAWR OWL ENGINEERING) ====================
  const handleSubmitOwlEngineeringQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameMode !== 'PLAYING_MISSION' || activeMissionId !== 4) return;
    ensureLofiMusic();

    const val = parseFloat(quizStep4Input.trim());
    if (isNaN(val) || val <= 0) {
      soundEngine.playMissThud();
      setQuiz4Feedback({
        text: `Please enter a valid number (${activeStep4.unitLabel}).`,
        isError: true,
      });
      return;
    }

    const isCorrect = Math.abs(val - activeStep4.expectedAnswer) < 0.05;
    soundEngine.playWoodBuild(isCorrect);

    if (!isCorrect) {
      setQuiz4Feedback({
        text: `${val} ${activeStep4.unitLabel} is not exact. Review ${activeStep4.formulaDisplay} or click Pointer!`,
        isError: true,
      });
      return;
    }

    setQuiz4Feedback({
      text: `Correct! ${activeStep4.partLabel} constructed (${val} ${activeStep4.unitLabel})!`,
      isError: false,
    });

    canvasTriggerRef.current.triggerLabBurst?.(
      0.34,
      0.42,
      '#f59e0b',
      `✓ ${activeStep4.partLabel} Built!`,
      `${val} ${activeStep4.unitLabel}`
    );

    setLevel4Steps((prev) => {
      const updated = prev.map((s) =>
        s.id === activeStep4.id ? { ...s, isCompleted: true } : s
      );

      const nextStep = updated.find((s) => !s.isCompleted);
      if (nextStep) {
        setTimeout(() => handleSelectStep4(nextStep.id), 800);
      } else {
        canvasTriggerRef.current.triggerLabBurst?.(
          0.52,
          0.52,
          '#38bdf8',
          "I have to go so the black squirrel doesn't eat all my food, bye!",
          'Bryn Mawr Owl Home Complete!'
        );
        setTimeout(() => {
          soundEngine.playSuccessChord();
          advanceLofiBeatOnMissionComplete(4);
          setMission4Completed(true);
          setGameMode('MISSION_COMPLETE');
        }, 1550);
      }
      return updated;
    });
  };

  const activeTrack = LOFI_TRACKS[currentTrackIndex] || LOFI_TRACKS[0];

  return (
    <div
      className="relative w-screen h-screen overflow-hidden select-none"
      onPointerDown={ensureLofiMusic}
    >
      {/* 1. 60fps 2D Undertale Overworld & Left-Aligned Mission Canvas */}
      <WorldCanvas
        gameMode={gameMode}
        activeMissionId={activeMissionId}
        mission1Completed={mission1Completed}
        mission2Completed={mission2Completed}
        mission3Completed={mission3Completed}
        mission4Completed={mission4Completed}
        onSelectMissionFromWorld={handleSelectMissionFromWorld}
        onNearbyMissionChange={setNearbyMissionId}
        level1Plots={level1Plots}
        selectedPlot1Id={selectedPlot1Id}
        onSelectPlot1={handleSelectPlot1}
        level2Plots={level2Plots}
        selectedPlot2Id={selectedPlot2Id}
        onSelectPlot2={handleSelectPlot2}
        level3Steps={level3Steps}
        selectedStep3Id={selectedStep3Id}
        onSelectStep3={handleSelectStep3}
        level4Steps={level4Steps}
        selectedStep4Id={selectedStep4Id}
        onSelectStep4={handleSelectStep4}
        onCornPlotHit={handleCornPlotHit}
        onProjectileMiss={handleProjectileMiss}
        triggerRef={canvasTriggerRef}
      />

      {/* 2. COMPACT TOP BAR */}
      <header className="fixed top-0 inset-x-0 z-20 p-3 flex items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          {gameMode === 'PLAYING_MISSION' ? (
            <button
              onClick={() => {
                soundEngine.playSelect();
                setGameMode('OPEN_WORLD');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-amber-950 bg-amber-50/95 hover:bg-white border-2 border-amber-300 rounded-2xl shadow-md transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Overworld</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-2 bg-amber-50/95 border-2 border-amber-300 rounded-2xl shadow-md">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="font-display font-bold text-xs sm:text-sm text-amber-950">
                Terra Bi-Co
              </span>
            </div>
          )}
        </div>

        {/* Center Brief Instruction Pill */}
        <div className="hidden lg:flex items-center px-4 py-1.5 bg-amber-50/95 border-2 border-amber-300 rounded-2xl shadow-sm text-xs font-semibold text-amber-950 pointer-events-auto">
          {gameMode === 'OPEN_WORLD' ? (
            <span>
              Walk with <strong>WASD / Arrows</strong> or <strong>Tap / Drag</strong> · Click any
              Mission Shrine, the <strong className="text-red-700">Haverford Squirrel</strong>, or{' '}
              <strong className="text-blue-700">Bryn Mawr Owl</strong>!
            </span>
          ) : (
            <span>
              Objective: <strong className="text-emerald-800">{activeMission.objective}</strong>
            </span>
          )}
        </div>

        {/* Right: Lightbulb Pointer Icon & Lofi Girl Hip-Hop Track Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {gameMode === 'PLAYING_MISSION' && (
            <button
              onClick={() => {
                soundEngine.playHintChime();
                setIsHintModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-950 bg-yellow-300 hover:bg-yellow-200 border-2 border-amber-500 rounded-2xl shadow-md transition-transform active:scale-95 cursor-pointer"
              title="View Helpful Pointers (No Full Answers)"
            >
              <Lightbulb className="w-4 h-4 text-amber-900 fill-yellow-400" />
              <span>Pointers</span>
            </button>
          )}

          {/* Next Lofi Beat Button */}
          <button
            onClick={() => {
              const next = soundEngine.nextTrack();
              setCurrentTrackIndex(next.id);
              setLofiStarted(true);
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-950 bg-amber-50/95 hover:bg-white border-2 border-amber-300 rounded-2xl shadow-md transition-colors cursor-pointer"
            title="Switch Lofi Girl Hip-Hop Beat"
          >
            <Disc3 className="w-4 h-4 text-amber-700" />
            <span>{activeTrack.name}</span>
          </button>

          <button
            onClick={handleToggleAudio}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-950 bg-amber-50/95 hover:bg-white border-2 border-amber-300 rounded-2xl shadow-md transition-colors cursor-pointer"
            aria-label={isMuted ? 'Turn on Lofi Hip-Hop' : 'Mute Lofi Hip-Hop'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-rose-600" />
                <span className="hidden md:inline">Muted</span>
              </>
            ) : (
              <>
                <Music className="w-4 h-4 text-emerald-600" />
                <span className="hidden md:inline">Lofi On</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* 3. OPEN WORLD: UNDERTALE-STYLE DIALOGUE BOX & COMPACT 4-WAY D-PAD */}
      {gameMode === 'OPEN_WORLD' && (
        <>
          <div className="fixed bottom-4 right-4 z-20 grid grid-cols-3 gap-1 w-28 h-28 p-1.5 bg-amber-50/90 border-2 border-amber-300 rounded-2xl shadow-lg pointer-events-auto">
            <div />
            <button
              onClick={() => canvasTriggerRef.current.moveAvatarDir?.(0, -1)}
              className="flex items-center justify-center bg-amber-200 hover:bg-amber-300 active:scale-95 rounded-lg text-amber-950 cursor-pointer"
              aria-label="Walk Up"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <div />
            <button
              onClick={() => canvasTriggerRef.current.moveAvatarDir?.(-1, 0)}
              className="flex items-center justify-center bg-amber-200 hover:bg-amber-300 active:scale-95 rounded-lg text-amber-950 cursor-pointer"
              aria-label="Walk Left"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center justify-center text-[10px] font-bold text-amber-800">
              WALK
            </div>
            <button
              onClick={() => canvasTriggerRef.current.moveAvatarDir?.(1, 0)}
              className="flex items-center justify-center bg-amber-200 hover:bg-amber-300 active:scale-95 rounded-lg text-amber-950 cursor-pointer"
              aria-label="Walk Right"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <div />
            <button
              onClick={() => canvasTriggerRef.current.moveAvatarDir?.(0, 1)}
              className="flex items-center justify-center bg-amber-200 hover:bg-amber-300 active:scale-95 rounded-lg text-amber-950 cursor-pointer"
              aria-label="Walk Down"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <div />
          </div>

          {/* Undertale-Style Overworld Dialogue Box */}
          <div className="fixed bottom-4 left-4 right-36 sm:inset-x-0 sm:mx-auto z-20 max-w-2xl pointer-events-none">
            <div className="bg-slate-950/95 border-4 border-white rounded-xl p-3.5 text-white shadow-2xl pointer-events-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="font-mono text-xs leading-relaxed">
                {nearbyMissionId ? (
                  <>
                    <span className="text-yellow-300 font-bold">
                      * ({MISSIONS[nearbyMissionId].title})
                    </span>
                    <div className="text-slate-200 text-xs mt-0.5">
                      *{' '}
                      {MISSIONS[nearbyMissionId].introQuote
                        ? `"${MISSIONS[nearbyMissionId].introQuote}"`
                        : MISSIONS[nearbyMissionId].objective}
                    </div>
                  </>
                ) : (
                  <span>
                    * Explore the 2D overworld! Click a mission button or walk to the{' '}
                    <strong className="text-red-400">Haverford Squirrel</strong> or{' '}
                    <strong className="text-sky-300">Bryn Mawr Owl</strong>.
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                {nearbyMissionId ? (
                  <button
                    onClick={() => handleSelectMissionFromWorld(nearbyMissionId)}
                    className="px-3.5 py-2 text-xs font-mono font-bold text-slate-950 bg-yellow-300 hover:bg-yellow-200 border-2 border-white rounded-lg cursor-pointer whitespace-nowrap"
                  >
                    [ENTER] Start Mission {nearbyMissionId}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleSelectMissionFromWorld(1)}
                      className="px-2.5 py-1.5 text-[11px] font-mono font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg cursor-pointer whitespace-nowrap"
                    >
                      {mission1Completed ? '✓ M1: Soil' : '★ M1: Soil'}
                    </button>
                    <button
                      onClick={() => handleSelectMissionFromWorld(2)}
                      className="px-2.5 py-1.5 text-[11px] font-mono font-bold text-slate-950 bg-amber-300 hover:bg-amber-200 rounded-lg cursor-pointer whitespace-nowrap"
                    >
                      {mission2Completed ? '✓ M2: Corn' : '★ M2: Corn'}
                    </button>
                    <button
                      onClick={() => handleSelectMissionFromWorld(3)}
                      className="px-2.5 py-1.5 text-[11px] font-mono font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg cursor-pointer whitespace-nowrap"
                    >
                      {mission3Completed ? '✓ M3: Squirrel' : '★ M3: Squirrel'}
                    </button>
                    <button
                      onClick={() => handleSelectMissionFromWorld(4)}
                      className="px-2.5 py-1.5 text-[11px] font-mono font-bold text-yellow-300 bg-blue-700 hover:bg-blue-600 rounded-lg cursor-pointer whitespace-nowrap"
                    >
                      {mission4Completed ? '✓ M4: Owl' : '★ M4: Owl'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* 4. CONCISE PRE-MISSION EDUCATIONAL BRIEFING MODAL */}
      {gameMode === 'MISSION_BRIEFING' && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-amber-950/45 pointer-events-auto">
          <div className="w-full max-w-lg max-h-[88vh] overflow-y-auto bg-amber-50 border-4 border-amber-300 rounded-3xl p-5 sm:p-6 text-amber-950 shadow-2xl space-y-3.5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-emerald-700">
                  {activeMission.subtitle}
                </div>
                <h2 className="text-xl font-bold text-amber-950 mt-0.5">
                  {activeMission.title}
                </h2>
              </div>

              <button
                onClick={() => {
                  soundEngine.playHintChime();
                  setShowBriefingHints((h) => !h);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-2xl border-2 transition-colors shrink-0 cursor-pointer ${
                  showBriefingHints
                    ? 'bg-yellow-300 border-amber-500 text-amber-950'
                    : 'bg-white border-amber-300 text-amber-800 hover:bg-amber-100'
                }`}
              >
                <Lightbulb className="w-4 h-4 text-amber-700 fill-yellow-400" />
                <span>{showBriefingHints ? 'Hide Pointers' : 'Pointers'}</span>
              </button>
            </div>

            {activeMission.introQuote && (
              <div className="p-3 bg-white border-2 border-amber-300 rounded-2xl font-mono text-xs font-bold text-slate-900">
                "{activeMission.introQuote}"
              </div>
            )}

            {/* Concise Objective */}
            <div className="p-3 bg-emerald-100/90 border-2 border-emerald-300 rounded-2xl">
              <div className="text-[11px] font-bold text-emerald-800">
                Mission Objective
              </div>
              <p className="text-xs sm:text-sm font-semibold text-emerald-950">
                {activeMission.objective}
              </p>
            </div>

            {/* Concise STEM Background */}
            <div className="space-y-1.5 bg-white/95 border-2 border-amber-200 rounded-2xl p-3.5">
              <h3 className="text-xs font-bold text-amber-900">
                {activeMission.backgroundTitle}
              </h3>
              {activeMission.backgroundParagraphs.map((para, idx) => (
                <p key={idx} className="text-xs text-amber-900 leading-relaxed">
                  {para}
                </p>
              ))}
              <div className="pt-2 mt-1.5 border-t border-amber-200">
                <div className="font-mono text-xs font-bold text-sky-800">
                  {activeMission.keyFormula}
                </div>
                <div className="text-[11px] text-amber-700 mt-0.5">
                  {activeMission.formulaExplanation}
                </div>
              </div>
            </div>

            {showBriefingHints && (
              <div className="p-3.5 bg-yellow-100 border-2 border-amber-400 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Lightbulb className="w-4 h-4 text-amber-700 fill-yellow-400" />
                  <span>Helpful Study Pointers</span>
                </div>
                <ul className="space-y-1 text-xs text-amber-950 list-disc list-inside leading-relaxed">
                  {activeMission.lightbulbPointers.map((ptr, idx) => (
                    <li key={idx}>{ptr}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                onClick={() => {
                  soundEngine.playSelect();
                  setGameMode('OPEN_WORLD');
                }}
                className="px-4 py-2 text-xs font-bold text-amber-800 hover:bg-amber-200/70 rounded-2xl transition-colors cursor-pointer"
              >
                Back to Overworld
              </button>
              <button
                onClick={handleBeginMissionPlay}
                className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-2xl shadow-lg transition-transform active:scale-95 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Mission Quiz</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. COMPACT RIGHT-SIDE QUIZ BOX FOR ALL 4 MISSIONS (Inputs explicitly use text-black) */}
      {gameMode === 'PLAYING_MISSION' && (
        <aside className="fixed right-3 sm:right-5 top-16 bottom-4 z-20 flex items-center pointer-events-none">
          <div className="w-76 sm:w-84 max-h-full overflow-y-auto bg-amber-50/95 border-3 border-amber-300 rounded-3xl p-4 shadow-2xl pointer-events-auto space-y-3">
            {activeMissionId === 1 && (
              /* ==================== MISSION 1 QUIZ (SOIL pH) ==================== */
              <form onSubmit={handleSubmitSoilQuiz} className="space-y-3">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-sm font-bold text-amber-950">
                      Soil pH Lab Quiz
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playHintChime();
                      setIsHintModalOpen(true);
                    }}
                    className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold bg-yellow-200 hover:bg-yellow-300 text-amber-950 rounded-lg cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5 fill-yellow-400" />
                    <span>Pointer</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1">
                  {level1Plots.map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => {
                        soundEngine.playSelect();
                        handleSelectPlot1(p.id);
                      }}
                      className={`py-1.5 px-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                        selectedPlot1Id === p.id
                          ? 'bg-sky-500 border-sky-600 text-white'
                          : p.isTerraformed
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                          : 'bg-white border-amber-300 text-amber-900'
                      }`}
                    >
                      Bed {p.id} {p.isTerraformed ? '✓' : ''}
                    </button>
                  ))}
                </div>

                <div className="p-2.5 bg-white border border-amber-200 rounded-xl space-y-1.5">
                  <div className="text-xs font-bold text-emerald-800">
                    {activePlot1.name}
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    {activePlot1.quizQuestionText}
                  </p>
                  <div className="p-1.5 bg-amber-100/70 rounded-lg font-mono text-[11px] font-bold text-sky-900">
                    Grams = |pH_target - pH_initial| ÷ 0.5
                  </div>
                </div>

                {activePlot1.givenHPlusExponent !== undefined && (
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-amber-900">
                      Step 1: Starting pH (for [H⁺] = 10⁻⁵ M)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={quizInitialPhInput}
                      onChange={(e) => setQuizInitialPhInput(e.target.value)}
                      placeholder="Enter starting pH..."
                      className="w-full px-3 py-1.5 text-xs font-mono font-bold text-black bg-white border-2 border-amber-400 rounded-xl focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-amber-900">
                    Select Reagent:
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {REAGENTS.map((r) => (
                      <button
                        type="button"
                        key={r.id}
                        onClick={() => {
                          soundEngine.playSelect();
                          setQuizReagentId(r.id);
                        }}
                        className={`p-2 rounded-xl border-2 text-left text-xs transition-colors cursor-pointer ${
                          quizReagentId === r.id
                            ? 'bg-amber-200 border-amber-500 font-bold text-amber-950'
                            : 'bg-white border-amber-200 text-amber-800'
                        }`}
                      >
                        <div className="font-bold">{r.name}</div>
                        <div className="font-mono text-[10px] text-sky-800">
                          {r.phShiftPerGram > 0 ? `+${r.phShiftPerGram}` : r.phShiftPerGram} pH/g
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-amber-900">
                    Exact Mass Required (grams):
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={quizGramsInput}
                    onChange={(e) => setQuizGramsInput(e.target.value)}
                    placeholder="Type exact grams (g)..."
                    className="w-full px-3 py-2 text-xs font-mono font-bold text-black bg-white border-2 border-amber-400 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>

                {quiz1Feedback && (
                  <div
                    className={`p-2.5 rounded-xl text-xs font-medium ${
                      quiz1Feedback.isError
                        ? 'bg-rose-100 border border-rose-300 text-rose-900'
                        : 'bg-emerald-100 border border-emerald-300 text-emerald-900'
                    }`}
                  >
                    {quiz1Feedback.text}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-2xl shadow-md transition-transform active:scale-95 cursor-pointer"
                >
                  Submit Calculation & Mix
                </button>
              </form>
            )}

            {activeMissionId === 2 && (
              /* ==================== MISSION 2 QUIZ (PROJECTILE TRAJECTORY) ==================== */
              <form onSubmit={handleSubmitProjectileQuiz} className="space-y-3">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-amber-700" />
                    <h3 className="text-sm font-bold text-amber-950">
                      Trajectory Formula Quiz
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playHintChime();
                      setIsHintModalOpen(true);
                    }}
                    className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold bg-yellow-200 hover:bg-yellow-300 text-amber-950 rounded-lg cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5 fill-yellow-400" />
                    <span>Pointer</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1">
                  {level2Plots.map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => {
                        soundEngine.playSelect();
                        handleSelectPlot2(p.id);
                      }}
                      className={`py-1.5 px-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                        selectedPlot2Id === p.id
                          ? 'bg-amber-400 border-amber-600 text-amber-950'
                          : p.isPlanted
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                          : 'bg-white border-amber-300 text-amber-900'
                      }`}
                    >
                      {p.distanceMeters}m {p.isPlanted ? '✓' : ''}
                    </button>
                  ))}
                </div>

                <div className="p-2.5 bg-white border border-amber-200 rounded-xl space-y-1.5">
                  <div className="text-xs font-bold text-amber-900">
                    {activePlot2.name}
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    {activePlot2.quizPrompt}
                  </p>
                  <div className="p-1.5 bg-amber-100/80 rounded-lg font-mono text-[11px] font-bold text-sky-900">
                    x = (v₀ · cos θ + v_wind) · t
                  </div>
                </div>

                {activePlot2.id === 2 && (
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-amber-900">
                      Step 1: Flight Time t = (2·v₀ᵧ) ÷ g (s):
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={quizFlightTimeInput}
                      onChange={(e) => setQuizFlightTimeInput(e.target.value)}
                      placeholder="Calculate time t (s)..."
                      className="w-full px-3 py-1.5 text-xs font-mono font-bold text-black bg-white border-2 border-amber-400 rounded-xl focus:outline-none focus:border-amber-600"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-amber-900">
                    Exact Launch Speed v₀ (m/s):
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={quizVelocityInput}
                    onChange={(e) => setQuizVelocityInput(e.target.value)}
                    placeholder="Type calculated v₀ (m/s)..."
                    className="w-full px-3 py-2 text-xs font-mono font-bold text-black bg-white border-2 border-amber-400 rounded-xl focus:outline-none focus:border-amber-600"
                  />
                </div>

                {quiz2Feedback && (
                  <div
                    className={`p-2.5 rounded-xl text-xs font-medium ${
                      quiz2Feedback.isError
                        ? 'bg-rose-100 border border-rose-300 text-rose-900'
                        : 'bg-emerald-100 border border-emerald-300 text-emerald-900'
                    }`}
                  >
                    {quiz2Feedback.text}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-xs sm:text-sm font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 border-2 border-amber-500 rounded-2xl shadow-md transition-transform active:scale-95 cursor-pointer"
                >
                  Calculate & Launch Corn Seed
                </button>
              </form>
            )}

            {activeMissionId === 3 && (
              /* ==================== MISSION 3 QUIZ (HAVERFORD SQUIRREL PENICILLIN) ==================== */
              <form onSubmit={handleSubmitPenicillinQuiz} className="space-y-3">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-red-700" />
                    <h3 className="text-sm font-bold text-amber-950">
                      Penicillin Bio-Lab Quiz
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playHintChime();
                      setIsHintModalOpen(true);
                    }}
                    className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold bg-yellow-200 hover:bg-yellow-300 text-amber-950 rounded-lg cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5 fill-yellow-400" />
                    <span>Pointer</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1">
                  {level3Steps.map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => {
                        soundEngine.playSelect();
                        handleSelectStep3(s.id);
                      }}
                      className={`py-1.5 px-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                        selectedStep3Id === s.id
                          ? 'bg-red-600 border-red-700 text-white'
                          : s.isCompleted
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                          : 'bg-white border-amber-300 text-amber-900'
                      }`}
                    >
                      Step {s.id} {s.isCompleted ? '✓' : ''}
                    </button>
                  ))}
                </div>

                <div className="p-2.5 bg-white border border-amber-200 rounded-xl space-y-1.5">
                  <div className="text-xs font-bold text-red-700">
                    {activeStep3.stepTitle}
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    {activeStep3.questionPrompt}
                  </p>
                  <div className="p-1.5 bg-amber-100/80 rounded-lg font-mono text-[11px] font-bold text-sky-900">
                    Formula: {activeStep3.formulaDisplay}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-amber-900">
                    Exact Answer ({activeStep3.unitLabel}):
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={quizStep3Input}
                    onChange={(e) => setQuizStep3Input(e.target.value)}
                    placeholder={`Enter ${activeStep3.unitLabel}...`}
                    className="w-full px-3 py-2 text-xs font-mono font-bold text-black bg-white border-2 border-amber-400 rounded-xl focus:outline-none focus:border-red-600"
                  />
                </div>

                {quiz3Feedback && (
                  <div
                    className={`p-2.5 rounded-xl text-xs font-medium ${
                      quiz3Feedback.isError
                        ? 'bg-rose-100 border border-rose-300 text-rose-900'
                        : 'bg-emerald-100 border border-emerald-300 text-emerald-900'
                    }`}
                  >
                    {quiz3Feedback.text}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-xs sm:text-sm font-bold text-white bg-red-600 hover:bg-red-500 rounded-2xl shadow-md transition-transform active:scale-95 cursor-pointer"
                >
                  Synthesize Penicillin Step
                </button>
              </form>
            )}

            {activeMissionId === 4 && (
              /* ==================== MISSION 4 QUIZ (BRYN MAWR OWL ENGINEERING) ==================== */
              <form onSubmit={handleSubmitOwlEngineeringQuiz} className="space-y-3">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-blue-700" />
                    <h3 className="text-sm font-bold text-amber-950">
                      Owl Nest Engineering Quiz
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playHintChime();
                      setIsHintModalOpen(true);
                    }}
                    className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold bg-yellow-200 hover:bg-yellow-300 text-amber-950 rounded-lg cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5 fill-yellow-400" />
                    <span>Pointer</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1">
                  {level4Steps.map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => {
                        soundEngine.playSelect();
                        handleSelectStep4(s.id);
                      }}
                      className={`py-1.5 px-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                        selectedStep4Id === s.id
                          ? 'bg-blue-700 border-blue-800 text-yellow-300'
                          : s.isCompleted
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                          : 'bg-white border-amber-300 text-amber-900'
                      }`}
                    >
                      Stage {s.id} {s.isCompleted ? '✓' : ''}
                    </button>
                  ))}
                </div>

                <div className="p-2.5 bg-white border border-amber-200 rounded-xl space-y-1.5">
                  <div className="text-xs font-bold text-blue-800">
                    {activeStep4.partLabel}
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    {activeStep4.questionPrompt}
                  </p>
                  <div className="p-1.5 bg-amber-100/80 rounded-lg font-mono text-[11px] font-bold text-sky-900">
                    Formula: {activeStep4.formulaDisplay}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-amber-900">
                    Exact Answer ({activeStep4.unitLabel}):
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={quizStep4Input}
                    onChange={(e) => setQuizStep4Input(e.target.value)}
                    placeholder={`Enter ${activeStep4.unitLabel}...`}
                    className="w-full px-3 py-2 text-xs font-mono font-bold text-black bg-white border-2 border-amber-400 rounded-xl focus:outline-none focus:border-blue-700"
                  />
                </div>

                {quiz4Feedback && (
                  <div
                    className={`p-2.5 rounded-xl text-xs font-medium ${
                      quiz4Feedback.isError
                        ? 'bg-rose-100 border border-rose-300 text-rose-900'
                        : 'bg-emerald-100 border border-emerald-300 text-emerald-900'
                    }`}
                  >
                    {quiz4Feedback.text}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-xs sm:text-sm font-bold text-yellow-300 bg-blue-700 hover:bg-blue-600 rounded-2xl shadow-md transition-transform active:scale-95 cursor-pointer"
                >
                  Build Owl Home Stage
                </button>
              </form>
            )}
          </div>
        </aside>
      )}

      {/* 6. MISSION COMPLETE CELEBRATION MODAL (WITH CHARACTER QUOTES & NEW LOFI BEAT NOTICE) */}
      {gameMode === 'MISSION_COMPLETE' && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-amber-950/45 pointer-events-auto">
          <div className="w-full max-w-md bg-amber-50 border-4 border-emerald-400 rounded-3xl p-6 text-center text-amber-950 shadow-2xl space-y-4">
            <div className="inline-flex p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
              <Check className="w-7 h-7" />
            </div>

            <h2 className="text-2xl font-bold text-amber-950">
              {activeMissionId === 1 && 'Meadow Grass Has Sprouted!'}
              {activeMissionId === 2 && 'Wiggly Corn Farm Complete!'}
              {activeMissionId === 3 && 'Haverford Squirrel Healed!'}
              {activeMissionId === 4 && 'Bryn Mawr Owl Home Built!'}
            </h2>

            {activeMission.completionQuote && (
              <div className="p-3.5 bg-white border-2 border-amber-400 rounded-2xl font-mono text-sm font-bold text-black shadow-inner">
                "{activeMission.completionQuote}"
              </div>
            )}

            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
              {activeMissionId === 1 &&
                'You balanced the soil pH across all 3 beds! Lush green grass now covers the island.'}
              {activeMissionId === 2 &&
                'Your projectile motion calculations were exact! Cute wiggly corn stalks are now dancing in your farm.'}
              {activeMissionId === 3 &&
                'You calculated bacterial binary fission, fermentation molarity, and veterinary dosage to synthesize penicillin for the Haverford Black Squirrel!'}
              {activeMissionId === 4 &&
                'You used static equilibrium, Pythagorean roof trusses, and pulley mechanical advantage to build a cozy nest home for the Bryn Mawr Owl!'}
            </p>

            {/* New Lofi Girl Beat Unlocked Notice */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-200/80 rounded-xl text-xs font-bold text-amber-950">
              <Disc3 className="w-4 h-4 text-emerald-700" />
              <span>Now Playing New Lofi Beat: {activeTrack.name}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <button
                onClick={() => {
                  soundEngine.playSelect();
                  setGameMode('OPEN_WORLD');
                }}
                className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-2xl shadow-md transition-transform active:scale-95 cursor-pointer"
              >
                Explore 2D Overworld
              </button>

              {activeMissionId < 4 && (
                <button
                  onClick={() => {
                    soundEngine.playSelect();
                    handleSelectMissionFromWorld((activeMissionId + 1) as MissionId);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-bold text-amber-950 bg-amber-300 hover:bg-amber-200 rounded-2xl transition-colors cursor-pointer"
                >
                  Next: Mission {activeMissionId + 1} →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. POINTER-ONLY LIGHTBULB MODAL */}
      <StemNotebookModal
        isOpen={isHintModalOpen}
        onClose={() => setIsHintModalOpen(false)}
        missionId={activeMissionId}
        activePlot1={activePlot1}
        activePlot2={activePlot2}
        activeStep3={activeStep3}
        activeStep4={activeStep4}
      />
    </div>
  );
}
