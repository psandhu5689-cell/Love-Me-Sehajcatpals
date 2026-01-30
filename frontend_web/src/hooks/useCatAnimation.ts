import { useState, useEffect, useRef, useCallback } from 'react';

// STRICT FLOOR BOUNDS (prevents wall climbing)
const FLOOR_BOUNDS = {
  left: 15,    // percentage
  right: 85,   // percentage
  top: 55,     // percentage (floor starts here, above is wall)
  bottom: 85,  // percentage (just above control zone)
};

// 12 floor spots with different idle animations (ALL ON FLOOR ONLY)
const FLOOR_SPOTS_PRABH = [
  // Right side preference for Prabh
  { x: 60, y: 58, idle: 'sitIdle', weight: 2 },
  { x: 70, y: 62, idle: 'layIdle', weight: 3 },
  { x: 65, y: 68, idle: 'lickPawSitFront', weight: 2 },
  { x: 75, y: 72, idle: 'tailWagSitFront', weight: 2 },
  { x: 55, y: 75, idle: 'sitIdle', weight: 1 },
  { x: 70, y: 78, idle: 'yarnSitFront', weight: 2 },
  // Some center spots
  { x: 45, y: 65, idle: 'layIdle', weight: 1 },
  { x: 50, y: 72, idle: 'meowSitFront', weight: 1 },
  { x: 40, y: 78, idle: 'sitIdle', weight: 1 },
  // Right back row (near window but still floor)
  { x: 65, y: 58, idle: 'tailWagLieFront', weight: 3 },
  { x: 75, y: 60, idle: 'sitIdle', weight: 2 },
  { x: 70, y: 65, idle: 'curlBallLie', weight: 2 },
];

const FLOOR_SPOTS_SEHAJ = [
  // Left side preference for Sehaj
  { x: 20, y: 65, idle: 'sitIdle', weight: 3 },
  { x: 30, y: 70, idle: 'layIdle', weight: 2 },
  { x: 25, y: 75, idle: 'lickPawSitFront', weight: 2 },
  { x: 35, y: 78, idle: 'tailWagSitFront', weight: 2 },
  { x: 20, y: 80, idle: 'yarnSitFront', weight: 2 },
  { x: 30, y: 82, idle: 'layIdle', weight: 2 },
  // Some center spots
  { x: 45, y: 70, idle: 'sitIdle', weight: 1 },
  { x: 50, y: 75, idle: 'meowSitFront', weight: 1 },
  { x: 40, y: 80, idle: 'curlBallLie', weight: 1 },
  // Left front row (close to viewer)
  { x: 25, y: 68, idle: 'tailWagLieFront', weight: 3 },
  { x: 35, y: 72, idle: 'sitIdle', weight: 2 },
  { x: 30, y: 65, idle: 'meowSitFront', weight: 2 },
];

export interface CatAnimationState {
  x: number;
  y: number;
  animation: string;
  isMoving: boolean;
  targetSpot: number | null;
}

// Clamp position to floor bounds (HARD RULE)
function clampToFloor(x: number, y: number): { x: number; y: number } {
  return {
    x: Math.max(FLOOR_BOUNDS.left, Math.min(FLOOR_BOUNDS.right, x)),
    y: Math.max(FLOOR_BOUNDS.top, Math.min(FLOOR_BOUNDS.bottom, y)),
  };
}

// Weighted random spot selection
function selectWeightedSpot(spots: typeof FLOOR_SPOTS_PRABH): typeof FLOOR_SPOTS_PRABH[0] {
  const totalWeight = spots.reduce((sum, spot) => sum + spot.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const spot of spots) {
    random -= spot.weight;
    if (random <= 0) return spot;
  }
  
  return spots[0];
}

export function useCatAnimation(catName: string) {
  const spots = catName === 'prabh' ? FLOOR_SPOTS_PRABH : FLOOR_SPOTS_SEHAJ;
  const initialSpot = spots[0];
  
  const [state, setState] = useState<CatAnimationState>({
    x: initialSpot.x,
    y: initialSpot.y,
    animation: 'sitIdle',
    isMoving: false,
    targetSpot: null,
  });

  const roamTimer = useRef<NodeJS.Timeout | null>(null);
  const moveAnimFrame = useRef<number | null>(null);
  const safetyCheckInterval = useRef<NodeJS.Timeout | null>(null);

  const getWalkAnimation = useCallback((fromX: number, fromY: number, toX: number, toY: number) => {
    const dx = toX - fromX;
    const dy = toY - fromY;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'walkRight' : 'walkLeft';
    } else {
      return dy > 0 ? 'walkDown' : 'walkUp';
    }
  }, []);

  // SAFETY CHECK: Prevent wall climbing every 500ms
  useEffect(() => {
    safetyCheckInterval.current = setInterval(() => {
      setState(prev => {
        if (prev.y < FLOOR_BOUNDS.top) {
          console.warn(`${catName} tried to climb wall! Snapping back to floor.`);
          return {
            ...prev,
            y: FLOOR_BOUNDS.top,
            animation: 'sitIdle',
            isMoving: false,
          };
        }
        return prev;
      });
    }, 500);

    return () => {
      if (safetyCheckInterval.current) {
        clearInterval(safetyCheckInterval.current);
      }
    };
  }, [catName]);

  const moveTo = useCallback((targetX: number, targetY: number, onComplete?: () => void, arriveAnimation?: string) => {
    const startX = state.x;
    const startY = state.y;
    
    // CLAMP target to floor bounds
    const clamped = clampToFloor(targetX, targetY);
    const walkAnim = getWalkAnimation(startX, startY, clamped.x, clamped.y);
    
    setState(prev => ({
      ...prev,
      animation: walkAnim,
      isMoving: true,
    }));

    const distance = Math.sqrt(Math.pow(clamped.x - startX, 2) + Math.pow(clamped.y - startY, 2));
    const duration = Math.max(1200, Math.min(2500, distance * 40));
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const newX = startX + (clamped.x - startX) * progress;
      const newY = startY + (clamped.y - startY) * progress;
      
      // HARD CLAMP on every frame
      const safeClamped = clampToFloor(newX, newY);

      setState(prev => ({
        ...prev,
        x: safeClamped.x,
        y: safeClamped.y,
      }));

      if (progress < 1) {
        moveAnimFrame.current = requestAnimationFrame(animate);
      } else {
        setState(prev => ({
          ...prev,
          animation: arriveAnimation || 'sitIdle',
          isMoving: false,
          targetSpot: null,
        }));
        if (onComplete) onComplete();
      }
    };

    moveAnimFrame.current = requestAnimationFrame(animate);
  }, [state.x, state.y, getWalkAnimation]);

  const moveToSpot = useCallback((otherCatPos?: { x: number; y: number }) => {
    const spot = selectWeightedSpot(spots);
    
    // COLLISION AVOIDANCE: Don't pick spot too close to other cat
    if (otherCatPos) {
      const distance = Math.sqrt(Math.pow(spot.x - otherCatPos.x, 2) + Math.pow(spot.y - otherCatPos.y, 2));
      if (distance < 15) {
        // Pick another spot
        const alternateSpot = selectWeightedSpot(spots);
        moveTo(alternateSpot.x, alternateSpot.y, undefined, alternateSpot.idle);
        return;
      }
    }
    
    moveTo(spot.x, spot.y, undefined, spot.idle);
  }, [moveTo, spots]);

  const startRoaming = useCallback(() => {
    const roam = () => {
      moveToSpot();
      
      const nextInterval = 5000 + Math.random() * 5000;
      roamTimer.current = setTimeout(roam, nextInterval);
    };

    const initialDelay = 3000 + Math.random() * 2000;
    roamTimer.current = setTimeout(roam, initialDelay);
  }, [moveToSpot]);

  const stopRoaming = useCallback(() => {
    if (roamTimer.current) {
      clearTimeout(roamTimer.current);
      roamTimer.current = null;
    }
    if (moveAnimFrame.current) {
      cancelAnimationFrame(moveAnimFrame.current);
      moveAnimFrame.current = null;
    }
  }, []);

  const playAction = useCallback((action: string, duration: number = 2000) => {
    stopRoaming();
    setState(prev => ({ ...prev, animation: action, isMoving: false }));
    
    setTimeout(() => {
      setState(prev => ({ ...prev, animation: 'sitIdle' }));
      startRoaming();
    }, duration);
  }, [stopRoaming, startRoaming]);

  useEffect(() => {
    startRoaming();
    return () => {
      stopRoaming();
      if (safetyCheckInterval.current) {
        clearInterval(safetyCheckInterval.current);
      }
    };
  }, []);

  return {
    state,
    setState,
    moveTo,
    moveToSpot,
    playAction,
    stopRoaming,
    startRoaming,
  };
}
