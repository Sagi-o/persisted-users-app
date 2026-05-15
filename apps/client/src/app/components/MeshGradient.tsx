import { CSSProperties } from 'react';
import { MeshGradient as PaperMeshGradient } from '@paper-design/shaders-react';

interface MeshGradientProps {
  colors?: string[];
  distortion?: number;
  swirl?: number;
  speed?: number;
  style?: CSSProperties;
}

const DEFAULT_COLORS = [
  '#0b1020', // near-black blue — deep base for dark UI
  '#1e1b4b', // indigo-950   — moody mid
  '#5b21b6', // violet-800   — accent
  '#0f766e', // teal-700     — cool contrast
];

export function MeshGradient({
  colors = DEFAULT_COLORS,
  distortion = 1,
  swirl = 0.85,
  speed = 0.2,
  style,
}: MeshGradientProps) {
  return (
    <PaperMeshGradient
      colors={colors}
      distortion={distortion}
      swirl={swirl}
      speed={speed}
      style={{
        width: '100%',
        height: '100%',
        ...style,
      }}
    />
  );
}
