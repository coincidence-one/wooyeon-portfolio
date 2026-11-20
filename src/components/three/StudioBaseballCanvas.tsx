import { useEffect, useRef } from 'react';

export interface StudioBaseballCanvasProps {
  rpmSpeed?: number;
  isPaused?: boolean;
  pitchLabel?: string;
  className?: string;
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

const rotatePoint3D = (
  p: Vec3,
  rotX: number,
  rotY: number,
  rotZ: number
): Vec3 => {
  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);
  const y1 = p.y * cosX - p.z * sinX;
  const z1 = p.y * sinX + p.z * cosX;

  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const x2 = p.x * cosY + z1 * sinY;
  const z2 = -p.x * sinY + z1 * cosY;

  const cosZ = Math.cos(rotZ);
  const sinZ = Math.sin(rotZ);
  const x3 = x2 * cosZ - y1 * sinZ;
  const y3 = x2 * sinZ + y1 * cosZ;

  return { x: x3, y: y3, z: z2 };
};

export const StudioBaseballCanvas = ({
  rpmSpeed = 1.4,
  isPaused = false,
  pitchLabel = '4-SEAM 160 KM/H',
  className,
}: StudioBaseballCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rpmRef = useRef<number>(rpmSpeed);
  const pausedRef = useRef<boolean>(isPaused);

  useEffect(() => {
    rpmRef.current = rpmSpeed;
  }, [rpmSpeed]);

  useEffect(() => {
    pausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const seamSamples = 180;
    const a = 0.42;
    const b = 0.58;
    const basePoints: Vec3[] = [];
    for (let i = 0; i <= seamSamples; i++) {
      const t = (i / seamSamples) * Math.PI * 2;
      const x = a * Math.cos(t) - b * Math.cos(3 * t);
      const y = a * Math.sin(t) + b * Math.sin(3 * t);
      const z = 2 * Math.sqrt(a * b) * Math.sin(2 * t);
      const len = Math.hypot(x, y, z) || 1;
      basePoints.push({ x: x / len, y: y / len, z: z / len });
    }

    let angleY = 0.45;
    let angleX = 0.3;
    let frameId = 0;

    const renderFrame = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = 220;
      const height = 220;
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2 - 4;
      const r = 74;

      // Subtle grounded contact shadow (studio photography feel, no neon glow)
      const shadow = ctx.createRadialGradient(
        cx,
        cy + r + 10,
        4,
        cx,
        cy + r + 10,
        58
      );
      shadow.addColorStop(0, 'rgba(0, 0, 0, 0.22)');
      shadow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = shadow;
      ctx.beginPath();
      ctx.ellipse(cx, cy + r + 10, 58, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Rawhide leather sphere
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();

      const leather = ctx.createRadialGradient(
        cx - r * 0.34,
        cy - r * 0.36,
        r * 0.06,
        cx + r * 0.14,
        cy + r * 0.18,
        r * 1.15
      );
      leather.addColorStop(0, '#ffffff');
      leather.addColorStop(0.28, '#f6f3ec');
      leather.addColorStop(0.64, '#d9d3c7');
      leather.addColorStop(0.89, '#8b857b');
      leather.addColorStop(1, '#3d3a35');
      ctx.fillStyle = leather;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      const rotated = basePoints.map((pt) =>
        rotatePoint3D(pt, angleX, angleY, 0.22)
      );

      // Subtle seam crease
      ctx.strokeStyle = 'rgba(42, 30, 26, 0.42)';
      ctx.lineWidth = 2.8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      let drawing = false;
      for (let i = 0; i < rotated.length; i++) {
        const pt = rotated[i];
        if (pt.z > -0.05) {
          const sx = cx + pt.x * r;
          const sy = cy + pt.y * r;
          if (!drawing) {
            ctx.moveTo(sx, sy);
            drawing = true;
          } else {
            ctx.lineTo(sx, sy);
          }
        } else {
          drawing = false;
        }
      }
      ctx.stroke();

      // 108-style crimson V-stitches
      const stitchCount = 108;
      for (let i = 0; i < stitchCount; i++) {
        const idx = Math.floor((i / stitchCount) * (rotated.length - 2));
        const curr = rotated[idx];
        const next = rotated[idx + 1];
        if (curr.z <= 0.02) continue;

        const sx = cx + curr.x * r;
        const sy = cy + curr.y * r;
        const tx = next.x - curr.x;
        const ty = next.y - curr.y;
        const tLen = Math.hypot(tx, ty) || 1;
        const ux = tx / tLen;
        const uy = ty / tLen;
        const nx = -uy;
        const ny = ux;

        const depthScale = 0.55 + 0.45 * curr.z;
        const wing = 4.2 * depthScale;
        const forward = 2.3 * depthScale;

        ctx.strokeStyle = `rgba(196, 46, 46, ${0.48 + 0.52 * curr.z})`;
        ctx.lineWidth = 1.6 * depthScale;
        ctx.beginPath();
        ctx.moveTo(
          sx + nx * wing - ux * forward,
          sy + ny * wing - uy * forward
        );
        ctx.lineTo(sx + ux * forward, sy + uy * forward);
        ctx.lineTo(
          sx - nx * wing - ux * forward,
          sy - ny * wing - uy * forward
        );
        ctx.stroke();
      }

      ctx.restore();

      // Subtle edge definition
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();

      if (!pausedRef.current) {
        angleY += 0.014 * rpmRef.current;
        angleX += 0.005 * rpmRef.current;
      }

      frameId = window.requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={`Canvas에 수식으로 그린 회전하는 야구공 (${pitchLabel})`}
      className={className ?? 'h-[210px] w-[210px]'}
    />
  );
};
