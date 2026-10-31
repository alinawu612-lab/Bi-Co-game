import React, { useEffect, useRef } from 'react';
import {
  ActiveProjectile,
  CornPlotLevel2,
  FloatingCallout,
  GameMode,
  MISSIONS,
  MissionId,
  OwlEngineeringStepLevel4,
  Particle,
  PenicillinStepLevel3,
  SoilPlotLevel1,
} from '../types/game';
import { soundEngine } from '../audio/soundEngine';

interface WorldCanvasProps {
  gameMode: GameMode;
  activeMissionId: MissionId;
  mission1Completed: boolean;
  mission2Completed: boolean;
  mission3Completed: boolean;
  mission4Completed: boolean;
  onSelectMissionFromWorld: (missionId: MissionId) => void;
  onNearbyMissionChange: (missionId: MissionId | null) => void;
  level1Plots: SoilPlotLevel1[];
  selectedPlot1Id: number;
  onSelectPlot1: (id: number) => void;
  level2Plots: CornPlotLevel2[];
  selectedPlot2Id: number;
  onSelectPlot2: (id: number) => void;
  level3Steps: PenicillinStepLevel3[];
  selectedStep3Id: number;
  onSelectStep3: (id: number) => void;
  level4Steps: OwlEngineeringStepLevel4[];
  selectedStep4Id: number;
  onSelectStep4: (id: number) => void;
  onCornPlotHit: (plotId: number) => void;
  onProjectileMiss: (impactX: number, expectedX: number) => void;
  triggerRef: React.MutableRefObject<{
    sprayEffect: ((plotId: number, color: string, isSuccess: boolean, message: string) => void) | null;
    fireCannonWithVelocity: ((v0: number, plot: CornPlotLevel2) => void) | null;
    triggerLabBurst: ((xRatio: number, yRatio: number, color: string, text: string, subtext?: string) => void) | null;
    moveAvatarDir: ((dx: number, dy: number) => void) | null;
  }>;
}

const MAP_W = 1900;
const MAP_H = 1120;

export const WorldCanvas: React.FC<WorldCanvasProps> = ({
  gameMode,
  activeMissionId,
  mission1Completed,
  mission2Completed,
  mission3Completed,
  mission4Completed,
  onSelectMissionFromWorld,
  onNearbyMissionChange,
  level1Plots,
  selectedPlot1Id,
  onSelectPlot1,
  level2Plots,
  selectedPlot2Id,
  onSelectPlot2,
  level3Steps,
  selectedStep3Id,
  onSelectStep3,
  level4Steps,
  selectedStep4Id,
  onSelectStep4,
  onCornPlotHit,
  onProjectileMiss,
  triggerRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const stateRef = useRef({
    gameMode,
    activeMissionId,
    mission1Completed,
    mission2Completed,
    mission3Completed,
    mission4Completed,
    onSelectMissionFromWorld,
    onNearbyMissionChange,
    level1Plots,
    selectedPlot1Id,
    onSelectPlot1,
    level2Plots,
    selectedPlot2Id,
    onSelectPlot2,
    level3Steps,
    selectedStep3Id,
    onSelectStep3,
    level4Steps,
    selectedStep4Id,
    onSelectStep4,
    onCornPlotHit,
    onProjectileMiss,
  });

  useEffect(() => {
    stateRef.current = {
      gameMode,
      activeMissionId,
      mission1Completed,
      mission2Completed,
      mission3Completed,
      mission4Completed,
      onSelectMissionFromWorld,
      onNearbyMissionChange,
      level1Plots,
      selectedPlot1Id,
      onSelectPlot1,
      level2Plots,
      selectedPlot2Id,
      onSelectPlot2,
      level3Steps,
      selectedStep3Id,
      onSelectStep3,
      level4Steps,
      selectedStep4Id,
      onSelectStep4,
      onCornPlotHit,
      onProjectileMiss,
    };
  }, [
    gameMode,
    activeMissionId,
    mission1Completed,
    mission2Completed,
    mission3Completed,
    mission4Completed,
    onSelectMissionFromWorld,
    onNearbyMissionChange,
    level1Plots,
    selectedPlot1Id,
    onSelectPlot1,
    level2Plots,
    selectedPlot2Id,
    onSelectPlot2,
    level3Steps,
    selectedStep3Id,
    onSelectStep3,
    level4Steps,
    selectedStep4Id,
    onSelectStep4,
    onCornPlotHit,
    onProjectileMiss,
  ]);

  const simRef = useRef<{
    time: number;
    camX: number;
    camY: number;
    targetCamX: number;
    targetCamY: number;
    isDragging: boolean;
    dragStartX: number;
    dragStartY: number;
    dragStartCamX: number;
    dragStartCamY: number;
    pointerMovedDist: number;
    avatarX: number;
    avatarY: number;
    avatarTargetX: number;
    avatarTargetY: number;
    avatarFacing: 'DOWN' | 'UP' | 'LEFT' | 'RIGHT';
    walkCycle: number;
    pendingMissionClick: MissionId | null;
    lastNearbyMission: MissionId | null;
    openWorldGrassProgress: number;
    openWorldCornProgress: number;
    sprayTimer: number;
    sprayColor: string;
    sprayTargetPlotId: number;
    cannonRecoil: number;
    projectiles: ActiveProjectile[];
    particles: Particle[];
    callouts: FloatingCallout[];
    plot1Growth: Record<number, number>;
    plot2Growth: Record<number, number>;
    clouds: Array<{ x: number; y: number; scale: number; speed: number }>;
  }>({
    time: 0,
    camX: 160,
    camY: 140,
    targetCamX: 160,
    targetCamY: 140,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    dragStartCamX: 160,
    dragStartCamY: 140,
    pointerMovedDist: 0,
    avatarX: 420,
    avatarY: 560,
    avatarTargetX: 420,
    avatarTargetY: 560,
    avatarFacing: 'DOWN',
    walkCycle: 0,
    pendingMissionClick: null,
    lastNearbyMission: null,
    openWorldGrassProgress: 0,
    openWorldCornProgress: 0,
    sprayTimer: 0,
    sprayColor: '#38bdf8',
    sprayTargetPlotId: 1,
    cannonRecoil: 0,
    projectiles: [],
    particles: [],
    callouts: [],
    plot1Growth: { 1: 0, 2: 0, 3: 0 },
    plot2Growth: { 1: 0, 2: 0, 3: 0 },
    clouds: [
      { x: 0.12, y: 0.12, scale: 1.1, speed: 0.007 },
      { x: 0.42, y: 0.09, scale: 0.9, speed: 0.011 },
      { x: 0.72, y: 0.14, scale: 1.2, speed: 0.006 },
    ],
  });

  useEffect(() => {
    triggerRef.current = {
      sprayEffect: (plotId: number, color: string, isSuccess: boolean, message: string) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const sim = simRef.current;
        sim.sprayTimer = 0.75;
        sim.sprayColor = color;
        sim.sprayTargetPlotId = plotId;

        const plot = stateRef.current.level1Plots.find((p) => p.id === plotId);
        if (plot) {
          const px = plot.xPercent * canvas.width;
          const py = plot.elevationRatio * canvas.height;
          for (let i = 0; i < 28; i++) {
            const angle = -Math.PI * Math.random();
            const speed = 35 + Math.random() * 100;
            sim.particles.push({
              x: px + (Math.random() - 0.5) * 70,
              y: py - 8,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed - 25,
              size: 4 + Math.random() * 5,
              color: isSuccess && i % 2 === 0 ? '#10b981' : color,
              alpha: 1,
              life: 0,
              maxLife: 0.6 + Math.random() * 0.4,
              gravity: 130,
            });
          }

          sim.callouts.push({
            id: Date.now() + Math.random(),
            x: px,
            y: py - 48,
            text: isSuccess ? '✓ Exact Match! Grass Sprouting!' : message,
            subtext: isSuccess ? `Target pH ${plot.targetPh.toFixed(1)} achieved!` : 'Check your ΔpH calculation',
            color: isSuccess ? '#059669' : '#d97706',
            life: 0,
            maxLife: 2.1,
          });
        }
      },

      fireCannonWithVelocity: (v0: number, plot: CornPlotLevel2) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const sim = simRef.current;
        sim.cannonRecoil = 1.0;

        const vx = v0 * plot.cosTheta;
        const vy = plot.initialVy;

        sim.projectiles.push({
          id: Date.now() + Math.random(),
          x: 0,
          y: 0,
          vx,
          vy,
          windSpeed: plot.windSpeed,
          gravity: 10,
          trail: [{ x: 0, y: 0 }],
          active: true,
        });

        const originX = canvas.width * 0.08;
        const originY = canvas.height * 0.68 - 18;
        const rad = (plot.angleDegrees * Math.PI) / 180;
        for (let i = 0; i < 18; i++) {
          const spread = (Math.random() - 0.5) * 0.5;
          const speed = 50 + Math.random() * 90;
          sim.particles.push({
            x: originX + Math.cos(rad) * 28,
            y: originY - Math.sin(rad) * 28,
            vx: Math.cos(rad + spread) * speed,
            vy: -Math.sin(rad + spread) * speed,
            size: 4 + Math.random() * 4,
            color: i % 2 === 0 ? '#facc15' : '#ffffff',
            alpha: 0.9,
            life: 0,
            maxLife: 0.35 + Math.random() * 0.25,
            gravity: 50,
          });
        }
      },

      triggerLabBurst: (
        xRatio: number,
        yRatio: number,
        color: string,
        text: string,
        subtext?: string
      ) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const sim = simRef.current;
        const px = xRatio * canvas.width;
        const py = yRatio * canvas.height;
        for (let i = 0; i < 28; i++) {
          const angle = Math.PI * 2 * Math.random();
          const speed = 30 + Math.random() * 110;
          sim.particles.push({
            x: px,
            y: py,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 35,
            size: 4 + Math.random() * 5,
            color,
            alpha: 1,
            life: 0,
            maxLife: 0.65 + Math.random() * 0.35,
            gravity: 110,
          });
        }
        sim.callouts.push({
          id: Date.now() + Math.random(),
          x: px,
          y: py - 42,
          text,
          subtext,
          color,
          life: 0,
          maxLife: 2.3,
        });
      },

      moveAvatarDir: (dx: number, dy: number) => {
        const sim = simRef.current;
        sim.pendingMissionClick = null;
        sim.avatarTargetX = Math.max(160, Math.min(MAP_W - 160, sim.avatarX + dx * 65));
        sim.avatarTargetY = Math.max(180, Math.min(MAP_H - 160, sim.avatarY + dy * 65));
      },
    };
  }, [triggerRef]);

  const metersToCanvas = (xMeters: number, yMeters: number, width: number, height: number) => {
    const originX = width * 0.08;
    const baseGroundY = height * 0.68;
    const scaleX = (width * 0.50) / 100;
    const scaleY = scaleX * 0.95;
    return {
      cx: originX + xMeters * scaleX,
      cy: baseGroundY - yMeters * scaleY,
      scaleX,
      scaleY,
    };
  };

  const getLevel2TerrainHeightMeters = (xMeters: number, plots: CornPlotLevel2[]): number => {
    if (xMeters <= 10) return 0;
    const points = [
      { x: 0, y: 0 },
      { x: 20, y: 0 },
      ...plots.map((p) => ({ x: p.distanceMeters, y: p.elevationMeters })),
      { x: 112, y: 20 },
    ];
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      if (xMeters >= p0.x && xMeters <= p1.x) {
        const t = (xMeters - p0.x) / Math.max(0.001, p1.x - p0.x);
        const smoothT = (1 - Math.cos(t * Math.PI)) * 0.5;
        return p0.y + (p1.y - p0.y) * smoothT;
      }
    }
    return 20;
  };

  // Undertale-style 4-Directional WASD / Arrow Keys Movement in Open World
  useEffect(() => {
    const heldKeys = new Set<string>();
    const onKeyDown = (e: KeyboardEvent) => {
      if (stateRef.current.gameMode !== 'OPEN_WORLD') return;
      if (
        [
          'ArrowUp',
          'ArrowDown',
          'ArrowLeft',
          'ArrowRight',
          'w',
          'W',
          'a',
          'A',
          's',
          'S',
          'd',
          'D',
        ].includes(e.key)
      ) {
        heldKeys.add(e.key);
      } else if (
        (e.key === 'Enter' || e.key === ' ' || e.key === 'z' || e.key === 'Z') &&
        simRef.current.lastNearbyMission
      ) {
        e.preventDefault();
        soundEngine.playSelect();
        stateRef.current.onSelectMissionFromWorld(simRef.current.lastNearbyMission);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      heldKeys.delete(e.key);
    };
    const onBlur = () => heldKeys.clear();

    const moveInterval = window.setInterval(() => {
      if (stateRef.current.gameMode !== 'OPEN_WORLD') return;
      const sim = simRef.current;
      let dx = 0;
      let dy = 0;
      if (heldKeys.has('ArrowLeft') || heldKeys.has('a') || heldKeys.has('A')) dx -= 1;
      if (heldKeys.has('ArrowRight') || heldKeys.has('d') || heldKeys.has('D')) dx += 1;
      if (heldKeys.has('ArrowUp') || heldKeys.has('w') || heldKeys.has('W')) dy -= 1;
      if (heldKeys.has('ArrowDown') || heldKeys.has('s') || heldKeys.has('S')) dy += 1;

      if (dx !== 0 || dy !== 0) {
        sim.pendingMissionClick = null;
        const len = Math.hypot(dx, dy);
        sim.avatarTargetX = Math.max(160, Math.min(MAP_W - 160, sim.avatarX + (dx / len) * 38));
        sim.avatarTargetY = Math.max(180, Math.min(MAP_H - 160, sim.avatarY + (dy / len) * 38));
      }
    }, 40);

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      clearInterval(moveInterval);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  // Main 60fps Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTimestamp = performance.now();

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const renderLoop = (timestamp: number) => {
      const rawDt = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;
      const dt = Math.min(Math.max(rawDt, 0.001), 0.05);

      const sim = simRef.current;
      const st = stateRef.current;
      sim.time += dt;

      const W = canvas.width;
      const H = canvas.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const viewW = W / dpr;
      const viewH = H / dpr;

      // Update 2D Avatar Walking & Camera
      const dx = sim.avatarTargetX - sim.avatarX;
      const dy = sim.avatarTargetY - sim.avatarY;
      const dist = Math.hypot(dx, dy);

      if (dist > 2.5) {
        if (Math.abs(dx) > Math.abs(dy)) {
          sim.avatarFacing = dx > 0 ? 'RIGHT' : 'LEFT';
        } else {
          sim.avatarFacing = dy > 0 ? 'DOWN' : 'UP';
        }
        const speed = 250;
        const step = Math.min(dist, speed * dt);
        sim.avatarX += (dx / dist) * step;
        sim.avatarY += (dy / dist) * step;
        sim.walkCycle += dt * 13;

        if (!sim.isDragging) {
          sim.targetCamX = sim.avatarX - viewW * 0.5;
          sim.targetCamY = sim.avatarY - viewH * 0.5;
        }
      } else if (sim.pendingMissionClick !== null) {
        const mId = sim.pendingMissionClick;
        sim.pendingMissionClick = null;
        st.onSelectMissionFromWorld(mId);
      }

      // Check proximity to any of the 4 Missions in Open World
      if (st.gameMode === 'OPEN_WORLD') {
        let closestM: MissionId | null = null;
        let minD = 125;
        ([1, 2, 3, 4] as MissionId[]).forEach((mId) => {
          const d = Math.hypot(
            sim.avatarX - MISSIONS[mId].worldX,
            sim.avatarY - MISSIONS[mId].worldY
          );
          if (d < minD) {
            minD = d;
            closestM = mId;
          }
        });
        if (closestM !== sim.lastNearbyMission) {
          sim.lastNearbyMission = closestM;
          st.onNearbyMissionChange(closestM);
        }
      }

      const maxCamX = Math.max(0, MAP_W - viewW);
      const maxCamY = Math.max(0, MAP_H - viewH);
      sim.targetCamX = Math.max(0, Math.min(maxCamX, sim.targetCamX));
      sim.targetCamY = Math.max(0, Math.min(maxCamY, sim.targetCamY));
      sim.camX += (sim.targetCamX - sim.camX) * Math.min(1, dt * 8);
      sim.camY += (sim.targetCamY - sim.camY) * Math.min(1, dt * 8);

      if (st.mission1Completed && sim.openWorldGrassProgress < 1) {
        sim.openWorldGrassProgress = Math.min(1, sim.openWorldGrassProgress + dt * 0.9);
      }
      if (st.mission2Completed && sim.openWorldCornProgress < 1) {
        sim.openWorldCornProgress = Math.min(1, sim.openWorldCornProgress + dt * 0.85);
      }

      st.level1Plots.forEach((p) => {
        const curr = sim.plot1Growth[p.id] || 0;
        if (p.isTerraformed && curr < 1) {
          sim.plot1Growth[p.id] = Math.min(1, curr + dt * 1.4);
        } else if (!p.isTerraformed) {
          sim.plot1Growth[p.id] = 0;
        }
      });

      st.level2Plots.forEach((p) => {
        const curr = sim.plot2Growth[p.id] || 0;
        if (p.isPlanted && curr < 1) {
          sim.plot2Growth[p.id] = Math.min(1, curr + dt * 1.25);
        } else if (!p.isPlanted) {
          sim.plot2Growth[p.id] = 0;
        }
      });

      if (sim.sprayTimer > 0) sim.sprayTimer = Math.max(0, sim.sprayTimer - dt);
      if (sim.cannonRecoil > 0) sim.cannonRecoil = Math.max(0, sim.cannonRecoil - dt * 4);

      sim.clouds.forEach((c) => {
        c.x += c.speed * dt;
        if (c.x > 1.15) c.x = -0.15;
      });

      // Update Mission 2 Projectiles
      if (st.gameMode === 'PLAYING_MISSION' && st.activeMissionId === 2) {
        const stepDt = dt * 2.2;
        const targetPlot =
          st.level2Plots.find((p) => p.id === st.selectedPlot2Id) || st.level2Plots[0];

        sim.projectiles.forEach((proj) => {
          if (!proj.active) return;
          const effectiveVx = proj.vx + proj.windSpeed;
          proj.x += effectiveVx * stepDt;
          proj.y += proj.vy * stepDt - 0.5 * proj.gravity * stepDt * stepDt;
          proj.vy -= proj.gravity * stepDt;

          proj.trail.push({ x: proj.x, y: proj.y });
          if (proj.trail.length > 50) proj.trail.shift();

          const groundY = getLevel2TerrainHeightMeters(proj.x, st.level2Plots);
          if ((proj.vy < 0 && proj.y <= groundY) || proj.x > 115 || proj.x < -10) {
            proj.active = false;
            proj.y = groundY;

            const isHit = Math.abs(proj.x - targetPlot.distanceMeters) <= 2.5;
            const { cx, cy } = metersToCanvas(proj.x, groundY, W, H);

            if (isHit) {
              soundEngine.playCornSprout();
              st.onCornPlotHit(targetPlot.id);

              for (let i = 0; i < 36; i++) {
                const a = -Math.PI * Math.random();
                const sp = 45 + Math.random() * 130;
                sim.particles.push({
                  x: cx + (Math.random() - 0.5) * 30 * dpr,
                  y: cy,
                  vx: Math.cos(a) * sp * dpr,
                  vy: Math.sin(a) * sp * dpr - 30 * dpr,
                  size: (4 + Math.random() * 5) * dpr,
                  color: i % 2 === 0 ? '#facc15' : '#34d399',
                  alpha: 1,
                  life: 0,
                  maxLife: 0.7 + Math.random() * 0.4,
                  gravity: 170 * dpr,
                });
              }

              sim.callouts.push({
                id: Date.now() + Math.random(),
                x: cx,
                y: cy - 45 * dpr,
                text: `Exact Hit at ${targetPlot.distanceMeters}m!`,
                subtext: 'Cute Wiggly Corn Sprouting!',
                color: '#059669',
                life: 0,
                maxLife: 2.2,
              });
            } else {
              soundEngine.playMissThud();
              st.onProjectileMiss(proj.x, targetPlot.distanceMeters);
              sim.callouts.push({
                id: Date.now() + Math.random(),
                x: cx,
                y: cy - 32 * dpr,
                text: `Landed at x = ${proj.x.toFixed(1)}m`,
                subtext: `Target Plot ${targetPlot.id} is at ${targetPlot.distanceMeters}m`,
                color: '#dc2626',
                life: 0,
                maxLife: 2.2,
              });
            }
          }
        });

        if (sim.projectiles.length > 4) {
          sim.projectiles = sim.projectiles.slice(-4);
        }
      }

      // Particles & Callouts
      for (let i = sim.particles.length - 1; i >= 0; i--) {
        const pt = sim.particles[i];
        pt.life += dt;
        if (pt.life >= pt.maxLife) {
          sim.particles.splice(i, 1);
          continue;
        }
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.vy += pt.gravity * dt;
        pt.alpha = 1 - pt.life / pt.maxLife;
      }

      for (let i = sim.callouts.length - 1; i >= 0; i--) {
        const c = sim.callouts[i];
        c.life += dt;
        c.y -= 20 * dpr * dt;
        if (c.life >= c.maxLife) {
          sim.callouts.splice(i, 1);
        }
      }

      // ==================== RENDERING ====================
      ctx.save();

      if (st.gameMode === 'PLAYING_MISSION') {
        const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.75);
        skyGrad.addColorStop(0, '#c4b5fd');
        skyGrad.addColorStop(0.4, '#bae6fd');
        skyGrad.addColorStop(0.8, '#fef3c7');
        skyGrad.addColorStop(1, '#fde68a');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, W, H);

        sim.clouds.forEach((c) => {
          const cx = c.x * W * 0.68;
          const cy = c.y * H;
          const sc = c.scale * dpr;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.beginPath();
          ctx.arc(cx, cy, 26 * sc, 0, Math.PI * 2);
          ctx.arc(cx + 22 * sc, cy - 5 * sc, 20 * sc, 0, Math.PI * 2);
          ctx.arc(cx - 22 * sc, cy + 4 * sc, 18 * sc, 0, Math.PI * 2);
          ctx.fill();
        });

        if (st.activeMissionId === 1) {
          renderMission1Scene(ctx, W, H, dpr, sim, st);
        } else if (st.activeMissionId === 2) {
          renderMission2Scene(ctx, W, H, dpr, sim, st);
        } else if (st.activeMissionId === 3) {
          renderMission3SquirrelScene(ctx, W, H, dpr, sim, st);
        } else {
          renderMission4OwlScene(ctx, W, H, dpr, sim, st);
        }
      } else {
        renderTopDownUndertaleWorld(ctx, W, H, dpr, sim, st);
      }

      // Particles
      sim.particles.forEach((pt) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Callouts
      sim.callouts.forEach((c) => {
        const alpha = Math.min(1, (1 - c.life / c.maxLife) * 1.5);
        ctx.save();
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.font = `700 ${15 * dpr}px 'Outfit', sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(c.text, c.x + 1.5 * dpr, c.y + 1.5 * dpr);
        ctx.fillStyle = c.color;
        ctx.fillText(c.text, c.x, c.y);

        if (c.subtext) {
          ctx.font = `600 ${11.5 * dpr}px 'Plus Jakarta Sans', sans-serif`;
          ctx.fillStyle = '#451a03';
          ctx.fillText(c.subtext, c.x, c.y + 17 * dpr);
        }
        ctx.restore();
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // ==================== CHARACTER & NPC RENDERERS ====================

  /** Player Avatar */
  const renderCuteAvatar = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    dpr: number,
    facing: 'DOWN' | 'UP' | 'LEFT' | 'RIGHT',
    walkCycle: number,
    isWalking: boolean
  ) => {
    const bounceY = isWalking
      ? Math.abs(Math.sin(walkCycle)) * 5.5 * dpr
      : Math.sin(simRef.current.time * 2.5) * 2 * dpr;

    ctx.save();
    ctx.translate(x, y);

    ctx.fillStyle = 'rgba(69, 26, 3, 0.24)';
    ctx.beginPath();
    ctx.ellipse(0, 2 * dpr, 17 * dpr, 6 * dpr, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.translate(0, -bounceY);

    const lFoot = isWalking ? Math.sin(walkCycle) * 4 * dpr : 0;
    const rFoot = isWalking ? -Math.sin(walkCycle) * 4 * dpr : 0;
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.roundRect(-10 * dpr, -10 * dpr + lFoot, 8 * dpr, 10 * dpr, 4 * dpr);
    ctx.roundRect(2 * dpr, -10 * dpr + rFoot, 8 * dpr, 10 * dpr, 4 * dpr);
    ctx.fill();

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.roundRect(-14 * dpr, -34 * dpr, 28 * dpr, 25 * dpr, 10 * dpr);
    ctx.fill();
    ctx.fillStyle = '#fde047';
    ctx.fillRect(-13 * dpr, -24 * dpr, 26 * dpr, 5 * dpr);
    ctx.strokeStyle = '#065f46';
    ctx.lineWidth = 2 * dpr;
    ctx.stroke();

    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.arc(0, -48 * dpr, 14.5 * dpr, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 1.8 * dpr;
    ctx.stroke();

    if (facing !== 'UP') {
      const eyeShift = facing === 'LEFT' ? -4 * dpr : facing === 'RIGHT' ? 4 * dpr : 0;
      ctx.fillStyle = '#fb7185';
      ctx.beginPath();
      ctx.arc(-8 * dpr + eyeShift, -46 * dpr, 3 * dpr, 0, Math.PI * 2);
      ctx.arc(8 * dpr + eyeShift, -46 * dpr, 3 * dpr, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#292524';
      ctx.beginPath();
      ctx.arc(-5 * dpr + eyeShift, -50 * dpr, 2.2 * dpr, 0, Math.PI * 2);
      ctx.arc(5 * dpr + eyeShift, -50 * dpr, 2.2 * dpr, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.8 * dpr;
      ctx.beginPath();
      ctx.arc(eyeShift, -46 * dpr, 3 * dpr, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
    }

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.ellipse(0, -60 * dpr, 21 * dpr, 5.5 * dpr, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, -61 * dpr, 11.5 * dpr, Math.PI, 0);
    ctx.fill();

    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 2.2 * dpr;
    ctx.beginPath();
    ctx.moveTo(0, -72 * dpr);
    ctx.quadraticCurveTo(4 * dpr, -80 * dpr, 8 * dpr, -78 * dpr);
    ctx.stroke();
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.ellipse(8 * dpr, -78 * dpr, 5 * dpr, 3 * dpr, -0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  /**
   * Mission 3 NPC: Black Squirrel wearing a Red Haverford College Hoodie!
   * When healed === true, bounces happily and displays "okay, time bryndin ; D"
   */
  const renderHaverfordBlackSquirrel = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    dpr: number,
    scale: number,
    isHealed: boolean,
    time: number
  ) => {
    const s = dpr * scale;
    const happyBounce = isHealed ? Math.abs(Math.sin(time * 5.5)) * 7 * s : 0;

    ctx.save();
    ctx.translate(x, y);

    // Ground shadow
    ctx.fillStyle = 'rgba(20, 20, 20, 0.25)';
    ctx.beginPath();
    ctx.ellipse(0, 3 * s, 20 * s, 6.5 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.translate(0, -happyBounce);

    // Big Fluffy Curved Black Squirrel Tail
    const tailWag = Math.sin(time * (isHealed ? 6 : 2)) * 4 * s;
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.moveTo(-10 * s, -8 * s);
    ctx.bezierCurveTo(
      -38 * s + tailWag,
      -12 * s,
      -42 * s + tailWag,
      -54 * s,
      -18 * s + tailWag,
      -50 * s
    );
    ctx.bezierCurveTo(-6 * s, -46 * s, -6 * s, -22 * s, -10 * s, -8 * s);
    ctx.fill();
    ctx.strokeStyle = '#3f3f46';
    ctx.lineWidth = 1.5 * s;
    ctx.stroke();

    // Black Squirrel Hind Paws
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.roundRect(-11 * s, -7 * s, 9 * s, 7 * s, 3 * s);
    ctx.roundRect(2 * s, -7 * s, 9 * s, 7 * s, 3 * s);
    ctx.fill();

    // Red Haverford College Hoodie Body (#b91c1c scarlet red with white 'H')
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.roundRect(-14 * s, -32 * s, 28 * s, 26 * s, 10 * s);
    ctx.fill();
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 2 * s;
    ctx.stroke();

    // Hoodie Collar & White Drawstrings
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.6 * s;
    ctx.beginPath();
    ctx.moveTo(-4 * s, -30 * s);
    ctx.lineTo(-4 * s, -22 * s);
    ctx.moveTo(4 * s, -30 * s);
    ctx.lineTo(4 * s, -22 * s);
    ctx.stroke();

    // "H" Haverford Lettermark on Chest
    ctx.font = `800 ${11 * s}px 'Outfit', sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('H', 0, -14 * s);

    // If injured (!isHealed), show cute white paw bandage with red cross on right arm
    if (!isHealed) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(10 * s, -23 * s, 9 * s, 9 * s, 3 * s);
      ctx.fill();
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 1.8 * s;
      ctx.beginPath();
      ctx.moveTo(14.5 * s, -21 * s);
      ctx.lineTo(14.5 * s, -16 * s);
      ctx.moveTo(12 * s, -18.5 * s);
      ctx.lineTo(17 * s, -18.5 * s);
      ctx.stroke();
    }

    // Black Squirrel Ears
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.ellipse(-9 * s, -54 * s, 4.5 * s, 8 * s, -0.2, 0, Math.PI * 2);
    ctx.ellipse(9 * s, -54 * s, 4.5 * s, 8 * s, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Black Squirrel Head
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.arc(0, -42 * s, 13.5 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#3f3f46';
    ctx.lineWidth = 1.5 * s;
    ctx.stroke();

    // Eyes & Expression
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-5 * s, -44 * s, 2.8 * s, 0, Math.PI * 2);
    ctx.arc(5 * s, -44 * s, 2.8 * s, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.arc(-4.5 * s, -44 * s, 1.5 * s, 0, Math.PI * 2);
    ctx.arc(5.5 * s, -44 * s, 1.5 * s, 0, Math.PI * 2);
    ctx.fill();

    // Cute pink nose & buck tooth
    ctx.fillStyle = '#fb7185';
    ctx.beginPath();
    ctx.arc(0, -40 * s, 2.2 * s, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.6 * s;
    ctx.beginPath();
    if (isHealed) {
      // Big happy wink/smile
      ctx.arc(0, -39 * s, 4 * s, 0.1 * Math.PI, 0.9 * Math.PI);
    } else {
      // Sad little frown when injured
      ctx.arc(0, -34 * s, 3.5 * s, 1.15 * Math.PI, 1.85 * Math.PI);
    }
    ctx.stroke();

    ctx.restore();
  };

  /**
   * Mission 4 NPC: Owl wearing a Blue & Yellow Bryn Mawr College Hoodie!
   */
  const renderBrynMawrOwl = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    dpr: number,
    scale: number,
    hasHome: boolean,
    time: number
  ) => {
    const s = dpr * scale;
    const hopY = hasHome ? Math.abs(Math.sin(time * 5)) * 6 * s : 0;

    ctx.save();
    ctx.translate(x, y);

    ctx.fillStyle = 'rgba(20, 20, 20, 0.22)';
    ctx.beginPath();
    ctx.ellipse(0, 3 * s, 19 * s, 6 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.translate(0, -hopY);

    // Yellow Owl Talons
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.ellipse(-6 * s, -2 * s, 5 * s, 3 * s, 0, 0, Math.PI * 2);
    ctx.ellipse(6 * s, -2 * s, 5 * s, 3 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    // Blue & Yellow Bryn Mawr College Hoodie (#1d4ed8 Blue with #facc15 Yellow trim & 'BMC')
    ctx.fillStyle = '#1d4ed8';
    ctx.beginPath();
    ctx.roundRect(-16 * s, -34 * s, 32 * s, 29 * s, 12 * s);
    ctx.fill();
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2.5 * s;
    ctx.stroke();

    // Yellow Pocket & Hood Rim
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.roundRect(-10 * s, -14 * s, 20 * s, 6 * s, 3 * s);
    ctx.fill();

    // "BMC" in Yellow on Blue Hoodie Chest
    ctx.font = `800 ${8.5 * s}px 'Outfit', sans-serif`;
    ctx.fillStyle = '#fef08a';
    ctx.textAlign = 'center';
    ctx.fillText('BMC', 0, -21 * s);

    // Plump Feathered Owl Head & Ear Tufts
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(0, -46 * s, 15 * s, 0, Math.PI * 2);
    ctx.fill();

    // Owl Ear Tufts
    ctx.beginPath();
    ctx.moveTo(-14 * s, -54 * s);
    ctx.lineTo(-8 * s, -63 * s);
    ctx.lineTo(-3 * s, -57 * s);
    ctx.moveTo(14 * s, -54 * s);
    ctx.lineTo(8 * s, -63 * s);
    ctx.lineTo(3 * s, -57 * s);
    ctx.fill();

    // Big Owl Facial Discs (Glasses-like circles)
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.arc(-6 * s, -46 * s, 6.5 * s, 0, Math.PI * 2);
    ctx.arc(6 * s, -46 * s, 6.5 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.5 * s;
    ctx.stroke();

    // Owl Pupils
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(-6 * s, -46 * s, 3.2 * s, 0, Math.PI * 2);
    ctx.arc(6 * s, -46 * s, 3.2 * s, 0, Math.PI * 2);
    ctx.fill();

    // Sad Eyebrows if homeless, Happy Sparkle Eyes if home is built!
    if (!hasHome) {
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 2 * s;
      ctx.beginPath();
      ctx.moveTo(-11 * s, -50 * s);
      ctx.lineTo(-2 * s, -53 * s);
      ctx.moveTo(11 * s, -50 * s);
      ctx.lineTo(2 * s, -53 * s);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-7 * s, -47.5 * s, 1.3 * s, 0, Math.PI * 2);
      ctx.arc(5 * s, -47.5 * s, 1.3 * s, 0, Math.PI * 2);
      ctx.fill();
    }

    // Golden Owl Beak
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(-3 * s, -43 * s);
    ctx.lineTo(3 * s, -43 * s);
    ctx.lineTo(0, -38 * s);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  };

  /** Engineered Wooden Owl Home / Nest Box (Constructs across 3 stages) */
  const renderEngineeredOwlHome = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    baseY: number,
    dpr: number,
    scale: number,
    hasBrackets: boolean,
    hasRoofAndWalls: boolean,
    hasPulleyHoist: boolean
  ) => {
    const s = dpr * scale;
    ctx.save();

    // Stage 1: Support Brackets & Platform (ΣF_y = 0, 75 N each)
    if (hasBrackets) {
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 4 * s;
      ctx.beginPath();
      ctx.moveTo(cx - 28 * s, baseY);
      ctx.lineTo(cx - 28 * s, baseY + 26 * s);
      ctx.lineTo(cx - 46 * s, baseY + 12 * s);
      ctx.moveTo(cx + 28 * s, baseY);
      ctx.lineTo(cx + 28 * s, baseY + 26 * s);
      ctx.lineTo(cx + 46 * s, baseY + 12 * s);
      ctx.stroke();

      // Sturdy Timber Deck
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.roundRect(cx - 48 * s, baseY - 8 * s, 96 * s, 10 * s, 4 * s);
      ctx.fill();
      ctx.strokeStyle = '#fde68a';
      ctx.lineWidth = 1.5 * s;
      ctx.stroke();
    }

    // Stage 2: Cozy Timber Walls, Woven Nest & Pythagorean Gable Roof Truss (a=4, b=3, c=5)
    if (hasRoofAndWalls) {
      // Cabin Walls
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.roundRect(cx - 38 * s, baseY - 62 * s, 76 * s, 54 * s, 6 * s);
      ctx.fill();
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2.5 * s;
      ctx.stroke();

      // Cozy Round Owl Entrance Hole & Straw Nest Rim
      ctx.fillStyle = '#292524';
      ctx.beginPath();
      ctx.arc(cx, baseY - 34 * s, 15 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3 * s;
      ctx.stroke();

      // Golden Straw Nest inside Entrance
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.5 * s;
      ctx.beginPath();
      ctx.arc(cx, baseY - 30 * s, 13 * s, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();

      // Pythagorean Triangular Gable Roof (a=4, b=3, c=5) in Bryn Mawr Blue & Gold trim!
      ctx.fillStyle = '#1e3a8a';
      ctx.beginPath();
      ctx.moveTo(cx - 48 * s, baseY - 60 * s);
      ctx.lineTo(cx, baseY - 98 * s);
      ctx.lineTo(cx + 48 * s, baseY - 60 * s);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3 * s;
      ctx.stroke();
    }

    // Stage 3: Hoist Pulley & Lantern (MA = 3)
    if (hasPulleyHoist) {
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2 * s;
      ctx.beginPath();
      ctx.moveTo(cx, baseY - 98 * s);
      ctx.lineTo(cx, baseY - 126 * s);
      ctx.stroke();

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(cx, baseY - 126 * s, 7 * s, 0, Math.PI * 2);
      ctx.fill();

      // Warm Glowing Lantern hanging by the porch
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(cx + 34 * s, baseY - 48 * s, 6 * s, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  /** Speech Bubble Helper */
  const renderSpeechBubble = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    text: string,
    dpr: number,
    borderColor: string = '#f59e0b'
  ) => {
    ctx.save();
    ctx.font = `700 ${12 * dpr}px 'Plus Jakarta Sans', sans-serif`;
    const padX = 14 * dpr;
    const w = ctx.measureText(text).width + padX * 2;
    const h = 28 * dpr;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y - h, w, h, 12 * dpr);
    ctx.fill();
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2.5 * dpr;
    ctx.stroke();

    ctx.fillStyle = '#09090b';
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y - 9.5 * dpr);
    ctx.restore();
  };

  /** Wiggly Corn Patch */
  const renderWigglyCornPatch = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    groundY: number,
    widthPx: number,
    dpr: number,
    stalkCount: number,
    growth: number,
    time: number
  ) => {
    if (growth <= 0.01) return;

    const isGrowing = growth < 1;
    const wiggleSpeed = isGrowing ? 18 : 5;
    const wiggleAmount = isGrowing
      ? (6.5 + Math.sin(growth * Math.PI) * 7.5) * dpr
      : 3.5 * dpr;

    ctx.save();
    for (let i = 0; i < stalkCount; i++) {
      const sx =
        centerX - widthPx * 0.38 + (i * widthPx * 0.76) / Math.max(1, stalkCount - 1);
      const maxH = (52 + (i % 2) * 12) * dpr;
      const curH = maxH * growth;

      const segments = 8;
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 4 * dpr;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(sx, groundY);

      let topX = sx;
      let topY = groundY;

      for (let s = 1; s <= segments; s++) {
        const frac = s / segments;
        const segY = groundY - curH * frac;
        const wigOffset =
          Math.sin(frac * 4.8 - time * wiggleSpeed + i * 1.3) *
          wiggleAmount *
          frac;
        const segX = sx + wigOffset;
        ctx.lineTo(segX, segY);
        if (s === segments) {
          topX = segX;
          topY = segY;
        }
      }
      ctx.stroke();

      if (growth > 0.25) {
        const leafScale = Math.min(1, (growth - 0.25) / 0.5);
        const midY1 = groundY - curH * 0.45;
        const midX1 =
          sx + Math.sin(0.45 * 4.8 - time * wiggleSpeed + i * 1.3) * wiggleAmount * 0.45;
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.ellipse(
          midX1 - 9 * dpr * leafScale,
          midY1,
          9 * dpr * leafScale,
          3.8 * dpr * leafScale,
          -0.35,
          0,
          Math.PI * 2
        );
        ctx.ellipse(
          midX1 + 9 * dpr * leafScale,
          midY1 - curH * 0.2,
          9 * dpr * leafScale,
          3.8 * dpr * leafScale,
          0.35,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      if (growth > 0.5) {
        const cobPop = Math.min(1, (growth - 0.5) * 2.2);
        const cobY = groundY - curH * 0.62;
        const cobX =
          sx + Math.sin(0.62 * 4.8 - time * wiggleSpeed + i * 1.3) * wiggleAmount * 0.62;

        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.ellipse(
          cobX + 5 * dpr,
          cobY,
          4.8 * dpr * cobPop,
          10.5 * dpr * cobPop,
          0.28,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.strokeStyle = '#ca8a04';
        ctx.lineWidth = 1.3 * dpr;
        ctx.stroke();

        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(topX, topY - 3 * dpr, 3.2 * dpr * cobPop, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  };

  // ==================== 2D TOP-DOWN OVERWORLD RENDERER ====================
  const renderTopDownUndertaleWorld = (
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    dpr: number,
    sim: typeof simRef.current,
    st: typeof stateRef.current
  ) => {
    const camX = sim.camX;
    const camY = sim.camY;
    const grassRatio = sim.openWorldGrassProgress;
    const cornRatio = sim.openWorldCornProgress;

    // 1. Dreamlike Ocean Backdrop
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, H);
    oceanGrad.addColorStop(0, '#a5b4fc');
    oceanGrad.addColorStop(0.5, '#93c5fd');
    oceanGrad.addColorStop(1, '#bae6fd');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.translate(-camX * dpr, -camY * dpr);

    // 2. Island Plateau
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.roundRect(100 * dpr, 140 * dpr, (MAP_W - 200) * dpr, (MAP_H - 220) * dpr, 120 * dpr);
    ctx.fill();

    ctx.fillStyle = grassRatio > 0.35 ? '#6ee7b7' : '#fde68a';
    ctx.beginPath();
    ctx.roundRect(100 * dpr, 125 * dpr, (MAP_W - 200) * dpr, (MAP_H - 230) * dpr, 120 * dpr);
    ctx.fill();
    ctx.strokeStyle = grassRatio > 0.35 ? '#10b981' : '#f59e0b';
    ctx.lineWidth = 5 * dpr;
    ctx.stroke();

    // 3. Overworld Stone Pathways connecting all 4 Missions
    ctx.strokeStyle = '#fcd34d';
    ctx.lineWidth = 58 * dpr;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    // Upper path (Mission 1 -> Bridge -> Mission 2)
    ctx.moveTo(300 * dpr, 440 * dpr);
    ctx.lineTo(1480 * dpr, 420 * dpr);
    // Lower path (Mission 3 Squirrel -> Bridge -> Mission 4 Owl)
    ctx.moveTo(420 * dpr, 790 * dpr);
    ctx.lineTo(1500 * dpr, 790 * dpr);
    // Vertical connectors
    ctx.moveTo(580 * dpr, 440 * dpr);
    ctx.lineTo(620 * dpr, 790 * dpr);
    ctx.moveTo(1320 * dpr, 420 * dpr);
    ctx.lineTo(1360 * dpr, 790 * dpr);
    ctx.stroke();

    // Sparkling Pastel River & 2 Wooden Bridges
    ctx.strokeStyle = '#7dd3fc';
    ctx.lineWidth = 68 * dpr;
    ctx.beginPath();
    ctx.moveTo(950 * dpr, 128 * dpr);
    ctx.quadraticCurveTo(920 * dpr, 560 * dpr, 970 * dpr, (MAP_H - 105) * dpr);
    ctx.stroke();

    // North & South Wooden Bridges
    [390, 745].forEach((by) => {
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.roundRect(890 * dpr, by * dpr, 110 * dpr, 82 * dpr, 10 * dpr);
      ctx.fill();
      ctx.strokeStyle = '#fef3c7';
      ctx.lineWidth = 2.5 * dpr;
      for (let bx = 905; bx <= 985; bx += 20) {
        ctx.beginPath();
        ctx.moveTo(bx * dpr, (by + 3) * dpr);
        ctx.lineTo(bx * dpr, (by + 79) * dpr);
        ctx.stroke();
      }
    });

    // 4. Sprouting Meadow Grass & Flowers across Overworld (after Mission 1)
    for (let gx = 180; gx < MAP_W - 180; gx += 105) {
      for (let gy = 200; gy < MAP_H - 180; gy += 105) {
        if (Math.abs(gx - 950) < 65) continue;
        if (grassRatio > 0.02) {
          ctx.fillStyle = 'rgba(16, 185, 129, 0.35)';
          ctx.beginPath();
          ctx.moveTo(gx * dpr, (gy - 8 * grassRatio) * dpr);
          ctx.lineTo((gx - 8) * dpr, (gy + 6) * dpr);
          ctx.lineTo((gx + 8) * dpr, (gy + 6) * dpr);
          ctx.closePath();
          ctx.fill();

          const bladeH = 13 * dpr * grassRatio;
          const sway = Math.sin(sim.time * 2.5 + gx * 0.03) * 3 * dpr * grassRatio;
          ctx.strokeStyle = '#059669';
          ctx.lineWidth = 2.4 * dpr;
          ctx.beginPath();
          ctx.moveTo((gx + 20) * dpr, gy * dpr);
          ctx.lineTo((gx + 20) * dpr + sway, gy * dpr - bladeH);
          ctx.stroke();
        }
      }
    }

    // 5. Fenced Corn Farm at Mission 2 (with Wiggly Corn after Mission 2)
    const farmX = 1160 * dpr;
    const farmY = 210 * dpr;
    const farmW = 300 * dpr;
    const farmH = 155 * dpr;
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.roundRect(farmX, farmY, farmW, farmH, 16 * dpr);
    ctx.fill();
    ctx.strokeStyle = '#fde68a';
    ctx.lineWidth = 3.5 * dpr;
    ctx.stroke();

    if (cornRatio > 0.01) {
      renderWigglyCornPatch(
        ctx,
        farmX + farmW * 0.5,
        farmY + 68 * dpr,
        farmW * 0.82,
        dpr,
        6,
        cornRatio,
        sim.time
      );
      renderWigglyCornPatch(
        ctx,
        farmX + farmW * 0.5,
        farmY + 135 * dpr,
        farmW * 0.82,
        dpr,
        6,
        cornRatio,
        sim.time + 0.5
      );
    } else {
      ctx.font = `700 ${11.5 * dpr}px 'Outfit', sans-serif`;
      ctx.fillStyle = '#fde68a';
      ctx.textAlign = 'center';
      ctx.fillText('Corn Field (Mission 2)', farmX + farmW * 0.5, farmY + farmH * 0.5);
    }

    // 6. Render Mission 1 & Mission 2 Golden Star Shrines
    ([1, 2] as MissionId[]).forEach((mId) => {
      const m = MISSIONS[mId];
      const mx = m.worldX * dpr;
      const my = m.worldY * dpr;
      const isDone = mId === 1 ? st.mission1Completed : st.mission2Completed;

      ctx.fillStyle = 'rgba(69, 26, 3, 0.2)';
      ctx.beginPath();
      ctx.ellipse(mx, my + 8 * dpr, 30 * dpr, 12 * dpr, 0, 0, Math.PI * 2);
      ctx.fill();

      const bobY = my - 28 * dpr + Math.sin(sim.time * 3.2 + mId) * 5 * dpr;
      const starR = (20 + Math.sin(sim.time * 5 + mId) * 2) * dpr;

      ctx.fillStyle = isDone ? '#10b981' : '#facc15';
      ctx.beginPath();
      ctx.moveTo(mx, bobY - starR);
      ctx.quadraticCurveTo(mx, bobY, mx + starR, bobY);
      ctx.quadraticCurveTo(mx, bobY, mx, bobY + starR);
      ctx.quadraticCurveTo(mx, bobY, mx - starR, bobY);
      ctx.quadraticCurveTo(mx, bobY, mx, bobY - starR);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.2 * dpr;
      ctx.stroke();

      const label = isDone ? `✓ ${m.title}` : `★ ${m.title}`;
      ctx.font = `700 ${11.5 * dpr}px 'Outfit', sans-serif`;
      const tw = ctx.measureText(label).width + 18 * dpr;
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.roundRect(mx - tw / 2, bobY - starR - 28 * dpr, tw, 22 * dpr, 8 * dpr);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.textAlign = 'center';
      ctx.fillText(label, mx, bobY - starR - 13 * dpr);
    });

    // 7. Render Mission 3 NPC in Overworld: Haverford Black Squirrel in Red Hoodie!
    const m3x = MISSIONS[3].worldX * dpr;
    const m3y = MISSIONS[3].worldY * dpr;
    renderHaverfordBlackSquirrel(ctx, m3x, m3y, dpr, 1.15, st.mission3Completed, sim.time);
    renderSpeechBubble(
      ctx,
      m3x,
      m3y - 76 * dpr,
      st.mission3Completed
        ? 'okay, time bryndin ; D'
        : '★ Mission 3: Injured Haverford Squirrel (Click)',
      dpr,
      '#dc2626'
    );

    // 8. Render Mission 4 NPC in Overworld: Bryn Mawr Owl in Blue & Yellow Hoodie + Engineered Home!
    const m4x = MISSIONS[4].worldX * dpr;
    const m4y = MISSIONS[4].worldY * dpr;

    // Ancient Oak Tree behind Owl
    ctx.fillStyle = '#78350f';
    ctx.fillRect(m4x + 55 * dpr, m4y - 110 * dpr, 32 * dpr, 115 * dpr);
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(m4x + 71 * dpr, m4y - 125 * dpr, 62 * dpr, 0, Math.PI * 2);
    ctx.fill();

    if (st.mission4Completed) {
      renderEngineeredOwlHome(
        ctx,
        m4x + 71 * dpr,
        m4y - 45 * dpr,
        dpr,
        0.75,
        true,
        true,
        true
      );
    }

    renderBrynMawrOwl(ctx, m4x, m4y, dpr, 1.15, st.mission4Completed, sim.time);
    renderSpeechBubble(
      ctx,
      m4x,
      m4y - 76 * dpr,
      st.mission4Completed
        ? "I have to go so the black squirrel doesn't eat all my food, bye!"
        : "I'm homeless, build me a home (Mission 4)",
      dpr,
      '#1d4ed8'
    );

    // 9. Render Player Avatar
    const isWalking =
      Math.hypot(sim.avatarTargetX - sim.avatarX, sim.avatarTargetY - sim.avatarY) > 2.5;
    renderCuteAvatar(
      ctx,
      sim.avatarX * dpr,
      sim.avatarY * dpr,
      dpr,
      sim.avatarFacing,
      sim.walkCycle,
      isWalking
    );

    ctx.restore();
  };

  // ==================== MISSION 1 SCENE (LEFT 62% OF SCREEN) ====================
  const renderMission1Scene = (
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    dpr: number,
    sim: typeof simRef.current,
    st: typeof stateRef.current
  ) => {
    const plots = st.level1Plots;
    const completedCount = plots.filter((p) => p.isTerraformed).length;
    const grassRatio = completedCount / plots.length;

    ctx.beginPath();
    ctx.moveTo(0, H);
    ctx.lineTo(0, H * 0.65);
    ctx.quadraticCurveTo(W * 0.35, H * 0.61, W, H * 0.66);
    ctx.lineTo(W, H);
    ctx.closePath();

    const groundGrad = ctx.createLinearGradient(0, H * 0.6, 0, H);
    groundGrad.addColorStop(0, grassRatio > 0.5 ? '#6ee7b7' : '#fcd34d');
    groundGrad.addColorStop(0.3, grassRatio > 0.5 ? '#10b981' : '#d97706');
    groundGrad.addColorStop(1, '#78350f');
    ctx.fillStyle = groundGrad;
    ctx.fill();

    plots.forEach((p) => {
      const px = p.xPercent * W;
      const py = p.elevationRatio * H;
      const bedW = Math.min(148 * dpr, W * 0.16);
      const bedH = 54 * dpr;
      const isSelected = st.selectedPlot1Id === p.id;
      const growth = sim.plot1Growth[p.id] || 0;

      if (isSelected) {
        ctx.save();
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 3.5 * dpr;
        ctx.setLineDash([7 * dpr, 5 * dpr]);
        ctx.beginPath();
        ctx.roundRect(
          px - bedW / 2 - 7 * dpr,
          py - 10 * dpr,
          bedW + 14 * dpr,
          bedH + 20 * dpr,
          16 * dpr
        );
        ctx.stroke();
        ctx.restore();
      }

      ctx.fillStyle = p.isTerraformed ? '#573b26' : p.currentPh < 6.5 ? '#b45309' : '#64748b';
      ctx.beginPath();
      ctx.roundRect(px - bedW / 2, py, bedW, bedH, 14 * dpr);
      ctx.fill();
      ctx.strokeStyle = p.isTerraformed ? '#10b981' : '#78350f';
      ctx.lineWidth = 3 * dpr;
      ctx.stroke();

      if (growth > 0.01) {
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.roundRect(px - bedW / 2, py - 5 * dpr, bedW * growth, 12 * dpr, 6 * dpr);
        ctx.fill();

        const bladeCount = 8;
        for (let i = 0; i < bladeCount; i++) {
          const bx = px - bedW * 0.38 + (i * bedW * 0.76) / (bladeCount - 1);
          const bh = (24 + (i % 3) * 8) * dpr * growth;
          const sway = Math.sin(sim.time * 3 + i) * 4 * dpr * growth;
          ctx.strokeStyle = '#059669';
          ctx.lineWidth = 3 * dpr;
          ctx.beginPath();
          ctx.moveTo(bx, py);
          ctx.quadraticCurveTo(bx + sway * 0.5, py - bh * 0.5, bx + sway, py - bh);
          ctx.stroke();
        }
      }

      ctx.font = `700 ${12 * dpr}px 'Outfit', sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fffbeb';
      const phDisplay =
        p.givenHPlusExponent && !p.isTerraformed
          ? `[H⁺] = 10⁻⁵ M`
          : `pH ${p.currentPh.toFixed(1)}`;
      ctx.fillText(`Bed ${p.id}: ${phDisplay}`, px, py + 24 * dpr);

      ctx.font = `600 ${11 * dpr}px 'Plus Jakarta Sans', sans-serif`;
      ctx.fillStyle = '#fde68a';
      ctx.fillText(
        p.isTerraformed ? '✓ Grass Sprouted!' : `Target: pH ${p.targetPh.toFixed(1)}`,
        px,
        py + 42 * dpr
      );
    });

    const activePlot = plots.find((p) => p.id === st.selectedPlot1Id) || plots[0];
    renderCuteAvatar(
      ctx,
      activePlot.xPercent * W,
      activePlot.elevationRatio * H - 12 * dpr,
      dpr,
      'DOWN',
      0,
      false
    );
  };

  // ==================== MISSION 2 SCENE (LEFT 62% OF SCREEN) ====================
  const renderMission2Scene = (
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    dpr: number,
    sim: typeof simRef.current,
    st: typeof stateRef.current
  ) => {
    const plots = st.level2Plots;

    ctx.save();
    ctx.strokeStyle = 'rgba(69, 26, 3, 0.15)';
    ctx.lineWidth = 1.5 * dpr;
    ctx.setLineDash([5 * dpr, 5 * dpr]);
    ctx.font = `700 ${11 * dpr}px 'IBM Plex Mono', monospace`;
    ctx.fillStyle = '#78350f';
    ctx.textAlign = 'center';

    plots.forEach((p) => {
      const { cx } = metersToCanvas(p.distanceMeters, 0, W, H);
      ctx.beginPath();
      ctx.moveTo(cx, H * 0.22);
      ctx.lineTo(cx, H * 0.74);
      ctx.stroke();
      ctx.fillText(`x = ${p.distanceMeters}m`, cx, H * 0.2);
    });
    ctx.restore();

    ctx.beginPath();
    ctx.moveTo(0, H);
    const steps = 80;
    for (let i = 0; i <= steps; i++) {
      const xm = -15 + (i / steps) * 195;
      const ym = getLevel2TerrainHeightMeters(xm, plots);
      const { cx, cy } = metersToCanvas(xm, ym, W, H);
      ctx.lineTo(cx, cy);
    }
    ctx.lineTo(W, H);
    ctx.closePath();

    const landGrad = ctx.createLinearGradient(0, H * 0.5, 0, H);
    landGrad.addColorStop(0, '#34d399');
    landGrad.addColorStop(0.3, '#10b981');
    landGrad.addColorStop(1, '#065f46');
    ctx.fillStyle = landGrad;
    ctx.fill();

    plots.forEach((p) => {
      const { cx, cy, scaleX } = metersToCanvas(p.distanceMeters, p.elevationMeters, W, H);
      const plotPixelW = p.widthMeters * scaleX;
      const isSelected = st.selectedPlot2Id === p.id;
      const growth = sim.plot2Growth[p.id] || 0;

      if (isSelected) {
        ctx.save();
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 3 * dpr;
        ctx.setLineDash([6 * dpr, 4 * dpr]);
        ctx.strokeRect(
          cx - plotPixelW / 2 - 5 * dpr,
          cy - 10 * dpr,
          plotPixelW + 10 * dpr,
          32 * dpr
        );
        ctx.restore();
      }

      ctx.fillStyle = '#573b26';
      ctx.beginPath();
      ctx.roundRect(cx - plotPixelW / 2, cy - 4 * dpr, plotPixelW, 20 * dpr, 8 * dpr);
      ctx.fill();
      ctx.strokeStyle = p.isPlanted ? '#facc15' : '#78350f';
      ctx.lineWidth = 2.5 * dpr;
      ctx.stroke();

      ctx.font = `700 ${11 * dpr}px 'Outfit', sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fffbeb';
      ctx.fillText(
        p.isPlanted
          ? `✓ ${p.distanceMeters}m Corn Grown!`
          : `Plot ${p.id} (x=${p.distanceMeters}m, y=${p.elevationMeters}m)`,
        cx,
        cy + 28 * dpr
      );

      if (growth > 0.01) {
        renderWigglyCornPatch(
          ctx,
          cx,
          cy - 2 * dpr,
          plotPixelW * 1.15,
          dpr,
          p.stalkCount,
          growth,
          sim.time
        );
      }
    });

    const { cx: originX, cy: originY } = metersToCanvas(0, 0, W, H);
    renderCuteAvatar(ctx, originX - 32 * dpr, originY, dpr, 'RIGHT', 0, false);

    const activePlot2 =
      plots.find((p) => p.id === st.selectedPlot2Id) || plots[0];
    const rad = (activePlot2.angleDegrees * Math.PI) / 180;
    const recoilOffset = sim.cannonRecoil * 8 * dpr;

    ctx.save();
    ctx.translate(originX, originY - 14 * dpr);
    ctx.rotate(-rad);
    ctx.translate(-recoilOffset, 0);

    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.roundRect(-6 * dpr, -9 * dpr, 40 * dpr, 18 * dpr, 7 * dpr);
    ctx.fill();
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2.5 * dpr;
    ctx.stroke();

    ctx.fillStyle = '#facc15';
    ctx.fillRect(30 * dpr, -10 * dpr, 5 * dpr, 20 * dpr);
    ctx.restore();

    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(originX, originY - 10 * dpr, 12 * dpr, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fde68a';
    ctx.lineWidth = 2.5 * dpr;
    ctx.stroke();

    sim.projectiles.forEach((proj) => {
      if (proj.trail.length > 1) {
        ctx.save();
        ctx.strokeStyle = 'rgba(217, 119, 6, 0.6)';
        ctx.lineWidth = 2.5 * dpr;
        ctx.beginPath();
        proj.trail.forEach((pt, idx) => {
          const { cx, cy } = metersToCanvas(pt.x, pt.y, W, H);
          if (idx === 0) ctx.moveTo(cx, cy);
          else ctx.lineTo(cx, cy);
        });
        ctx.stroke();
        ctx.restore();
      }

      if (proj.active) {
        const { cx, cy } = metersToCanvas(proj.x, proj.y, W, H);
        ctx.save();
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(cx, cy, 6 * dpr, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 2 * dpr;
        ctx.stroke();
        ctx.restore();
      }
    });
  };

  // ==================== MISSION 3 SCENE: HAVERFORD BLACK SQUIRREL & PENICILLIN LAB ====================
  const renderMission3SquirrelScene = (
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    dpr: number,
    sim: typeof simRef.current,
    st: typeof stateRef.current
  ) => {
    const steps = st.level3Steps;
    const allHealed = steps.every((s) => s.isCompleted);

    // Forest Meadow Floor
    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.moveTo(0, H);
    ctx.lineTo(0, H * 0.66);
    ctx.quadraticCurveTo(W * 0.35, H * 0.62, W, H * 0.67);
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fill();

    // Render Player Avatar on Left
    renderCuteAvatar(ctx, W * 0.12, H * 0.68, dpr, 'RIGHT', 0, false);

    // Render Wooden Bio-Lab Table in Center-Left with 3 Penicillin Synthesis Stations
    const tableX = W * 0.20;
    const tableY = H * 0.58;
    const tableW = W * 0.25;
    const tableH = 58 * dpr;
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.roundRect(tableX, tableY, tableW, tableH, 10 * dpr);
    ctx.fill();
    ctx.strokeStyle = '#fde68a';
    ctx.lineWidth = 2.5 * dpr;
    ctx.stroke();

    // Draw the 3 Lab Vessels on the Table (1: Petri Dish, 2: Bioreactor Flask, 3: Penicillin Syringe Vial)
    steps.forEach((step, idx) => {
      const vx = tableX + ((idx + 0.5) / 3) * tableW;
      const vy = tableY - 14 * dpr;
      const isSelected = st.selectedStep3Id === step.id;

      if (isSelected) {
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 2.5 * dpr;
        ctx.strokeRect(vx - 26 * dpr, vy - 26 * dpr, 52 * dpr, 44 * dpr);
      }

      ctx.fillStyle = step.isCompleted ? '#10b981' : '#e0f2fe';
      ctx.beginPath();
      ctx.arc(vx, vy, 16 * dpr, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = step.isCompleted ? '#047857' : '#0284c7';
      ctx.lineWidth = 2.5 * dpr;
      ctx.stroke();

      ctx.font = `700 ${10.5 * dpr}px 'Outfit', sans-serif`;
      ctx.fillStyle = '#09090b';
      ctx.textAlign = 'center';
      ctx.fillText(step.isCompleted ? '✓' : `S${step.id}`, vx, vy + 4 * dpr);

      ctx.fillStyle = '#fffbeb';
      ctx.fillText(step.name.split('·')[1] || step.name, vx, tableY + 32 * dpr);
    });

    // Render Haverford Black Squirrel in Red Hoodie on Cozy Tree Stump at x = 0.53 * W
    const sqX = W * 0.53;
    const sqY = H * 0.66;

    // Tree Stump
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.roundRect(sqX - 36 * dpr, sqY - 12 * dpr, 72 * dpr, 32 * dpr, 8 * dpr);
    ctx.fill();

    renderHaverfordBlackSquirrel(ctx, sqX, sqY - 10 * dpr, dpr, 1.45, allHealed, sim.time);

    // Speech Bubble above Haverford Black Squirrel
    renderSpeechBubble(
      ctx,
      sqX,
      sqY - 105 * dpr,
      allHealed
        ? 'okay, time bryndin ; D'
        : 'My paw hurts... Please make Penicillin!',
      dpr,
      '#dc2626'
    );
  };

  // ==================== MISSION 4 SCENE: BRYN MAWR OWL & NEST ENGINEERING ====================
  const renderMission4OwlScene = (
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    dpr: number,
    sim: typeof simRef.current,
    st: typeof stateRef.current
  ) => {
    const steps = st.level4Steps;
    const s1Done = steps[0]?.isCompleted || false;
    const s2Done = steps[1]?.isCompleted || false;
    const s3Done = steps[2]?.isCompleted || false;
    const allBuilt = s1Done && s2Done && s3Done;

    // Meadow Ground
    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.moveTo(0, H);
    ctx.lineTo(0, H * 0.68);
    ctx.quadraticCurveTo(W * 0.35, H * 0.64, W, H * 0.69);
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fill();

    // Giant Sturdy Oak Tree on Left-Center (x = 0.34 * W)
    const treeX = W * 0.34;
    const groundY = H * 0.68;

    // Trunk & Horizontal Support Branch
    ctx.fillStyle = '#78350f';
    ctx.fillRect(treeX - 28 * dpr, H * 0.25, 56 * dpr, groundY - H * 0.25);

    // Thick Engineering Branch extending left/right
    ctx.beginPath();
    ctx.roundRect(treeX - 110 * dpr, H * 0.45, 220 * dpr, 22 * dpr, 10 * dpr);
    ctx.fill();

    // Lush Canopy
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(treeX, H * 0.23, 95 * dpr, 0, Math.PI * 2);
    ctx.arc(treeX - 75 * dpr, H * 0.28, 65 * dpr, 0, Math.PI * 2);
    ctx.arc(treeX + 75 * dpr, H * 0.28, 65 * dpr, 0, Math.PI * 2);
    ctx.fill();

    // Render Engineered Owl Home on the Branch as Stages 1, 2, 3 complete!
    renderEngineeredOwlHome(
      ctx,
      treeX,
      H * 0.45,
      dpr,
      1.15,
      s1Done,
      s2Done,
      s3Done
    );

    // Blueprint outline if not yet built
    if (!s2Done) {
      ctx.save();
      ctx.strokeStyle = 'rgba(29, 78, 216, 0.55)';
      ctx.lineWidth = 2.5 * dpr;
      ctx.setLineDash([6 * dpr, 5 * dpr]);
      ctx.strokeRect(treeX - 45 * dpr, H * 0.45 - 70 * dpr, 90 * dpr, 65 * dpr);
      ctx.restore();
    }

    // Player Avatar on Left
    renderCuteAvatar(ctx, W * 0.12, groundY, dpr, 'RIGHT', 0, false);

    // Bryn Mawr Owl in Blue & Yellow Hoodie at x = 0.52 * W
    const owlX = W * 0.52;
    renderBrynMawrOwl(ctx, owlX, groundY, dpr, 1.45, allBuilt, sim.time);

    // Owl Speech Bubble
    renderSpeechBubble(
      ctx,
      owlX,
      groundY - 96 * dpr,
      allBuilt
        ? "I have to go so the black squirrel doesn't eat all my food, bye!"
        : "I'm homeless, build me a home",
      dpr,
      '#1d4ed8'
    );
  };

  // ==================== POINTER DRAG & CLICK HANDLERS ====================
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.currentTarget.setPointerCapture(e.pointerId);

    const sim = simRef.current;
    sim.isDragging = true;
    sim.dragStartX = e.clientX;
    sim.dragStartY = e.clientY;
    sim.dragStartCamX = sim.targetCamX;
    sim.dragStartCamY = sim.targetCamY;
    sim.pointerMovedDist = 0;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const sim = simRef.current;
    if (!sim.isDragging) return;
    const dx = e.clientX - sim.dragStartX;
    const dy = e.clientY - sim.dragStartY;
    sim.pointerMovedDist = Math.max(sim.pointerMovedDist, Math.hypot(dx, dy));

    if (stateRef.current.gameMode === 'OPEN_WORLD') {
      sim.targetCamX = sim.dragStartCamX - dx * 1.1;
      sim.targetCamY = sim.dragStartCamY - dy * 1.1;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const sim = simRef.current;
    const wasTap = sim.pointerMovedDist < 10;
    sim.isDragging = false;

    if (!wasTap) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const clickXRatio = clickX / rect.width;
    const clickYRatio = clickY / rect.height;

    const st = stateRef.current;

    if (st.gameMode === 'OPEN_WORLD') {
      const worldX = clickX + sim.camX;
      const worldY = clickY + sim.camY;

      for (const mId of [1, 2, 3, 4] as MissionId[]) {
        const d = Math.hypot(
          worldX - MISSIONS[mId].worldX,
          worldY - MISSIONS[mId].worldY
        );
        if (d < 95) {
          soundEngine.playSelect();
          sim.avatarTargetX = MISSIONS[mId].worldX - 48;
          sim.avatarTargetY = MISSIONS[mId].worldY + 18;
          sim.pendingMissionClick = mId;
          return;
        }
      }

      soundEngine.playSelect();
      sim.pendingMissionClick = null;
      sim.avatarTargetX = Math.max(160, Math.min(MAP_W - 160, worldX));
      sim.avatarTargetY = Math.max(180, Math.min(MAP_H - 160, worldY));
    } else if (st.gameMode === 'PLAYING_MISSION') {
      if (clickXRatio > 0.66 || clickYRatio < 0.14) return;
      if (st.activeMissionId === 1) {
        let closestId = st.selectedPlot1Id;
        let minDist = 0.14;
        st.level1Plots.forEach((p) => {
          const d = Math.abs(clickXRatio - p.xPercent);
          if (d < minDist) {
            minDist = d;
            closestId = p.id;
          }
        });
        soundEngine.playSelect();
        st.onSelectPlot1(closestId);
      } else if (st.activeMissionId === 2) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const clickXCanvas = clickXRatio * canvas.width;
        let closestId = st.selectedPlot2Id;
        let minPxDist = 80 * dpr;
        st.level2Plots.forEach((p) => {
          const { cx } = metersToCanvas(
            p.distanceMeters,
            p.elevationMeters,
            canvas.width,
            canvas.height
          );
          const d = Math.abs(clickXCanvas - cx);
          if (d < minPxDist) {
            minPxDist = d;
            closestId = p.id;
          }
        });
        soundEngine.playSelect();
        st.onSelectPlot2(closestId);
      }
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`block w-full h-full ${
          gameMode === 'OPEN_WORLD' ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
        }`}
      />
    </div>
  );
};
