import { useCallback } from 'react';
import { Slider } from '@/components/ui/slider';
import { useFovStore } from '../store/useFovStore';

export default function FOVControls({ center, className = '' }) {
  const fovAngle = useFovStore((state) => state.fovAngle);
  const fovRadius = useFovStore((state) => state.fovRadius);
  const heading = useFovStore((state) => state.heading);
  const setFovAngle = useFovStore((state) => state.setFovAngle);
  const updateFovPolygon = useFovStore((state) => state.updateFovPolygon);

  const handleAngleChange = useCallback(
    (values) => {
      const nextAngle = Number(values?.[0]);
      if (!Number.isFinite(nextAngle)) return;
      setFovAngle(nextAngle);
      updateFovPolygon(center, heading, nextAngle, fovRadius);
    },
    [center, fovRadius, heading, setFovAngle, updateFovPolygon]
  );

  return (
    <div
      className={`bg-background/90 border-border rounded-lg border p-2 shadow-sm backdrop-blur-sm ${className}`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="typo-meta text-muted-foreground">FOV: {Math.round(fovAngle)}°</span>
      </div>

      <Slider
        min={30}
        max={120}
        step={1}
        value={[fovAngle]}
        onValueChange={handleAngleChange}
        aria-label="FOV angle"
      />
    </div>
  );
}
