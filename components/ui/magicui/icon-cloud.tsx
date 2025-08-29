"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { renderToString } from "react-dom/server";

interface Icon {
  x: number;
  y: number;
  z: number;
  scale: number;
  opacity: number;
  id: number;
}

interface IconCloudProps {
  icons?: React.ReactNode[];
  images?: string[];
  className?: string;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function IconCloud({ icons, images, className }: IconCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [iconPositions, setIconPositions] = useState<Icon[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const targetRotationRef = useRef<{
    x: number;
    y: number;
    startX: number;
    startY: number;
    distance: number;
    startTime: number;
    duration: number;
  } | null>(null);
  const rotationRef = useRef({ x: 0, y: 0 });
  const iconCanvasesRef = useRef<(HTMLCanvasElement | null)[]>([]);
  const imagesLoadedRef = useRef<boolean[]>([]);
  const rafIdRef = useRef<number>(0);
  const darkModeRef = useRef(false);

  // Check for dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      darkModeRef.current = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
    };
    checkDarkMode();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", checkDarkMode);

    return () => mediaQuery.removeEventListener("change", checkDarkMode);
  }, []);

  // Generate Fibonacci sphere positions
  const generateSpherePositions = useCallback((numIcons: number) => {
    const newIcons: Icon[] = [];
    const offset = 2 / numIcons;
    const increment = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < numIcons; i++) {
      const y = i * offset - 1 + offset / 2;
      const r = Math.sqrt(1 - y * y);
      const phi = i * increment;

      const x = Math.cos(phi) * r;
      const z = Math.sin(phi) * r;

      newIcons.push({
        x: x * 100,
        y: y * 100,
        z: z * 100,
        scale: 1,
        opacity: 1,
        id: i,
      });
    }
    return newIcons;
  }, []);

  // Create icon canvases with dark mode consideration
  useEffect(() => {
    if (!icons && !images) return;

    const items = icons || images || [];
    imagesLoadedRef.current = new Array(items.length).fill(false);

    const newIconCanvases = items.map((item, index) => {
      const offscreen = document.createElement("canvas");
      offscreen.width = 40;
      offscreen.height = 40;
      const offCtx = offscreen.getContext("2d");

      if (offCtx) {
        if (images) {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = items[index] as string;
          img.onload = () => {
            offCtx.clearRect(0, 0, offscreen.width, offscreen.height);

            // For white icons (like Next.js), add background in light mode
            if (
              !darkModeRef.current &&
              (img.src.includes("Next.js") || img.src.includes("turbopack"))
            ) {
              offCtx.fillStyle = "rgba(0,0,0,0.1)";
              offCtx.fillRect(0, 0, offscreen.width, offscreen.height);
            }

            offCtx.beginPath();
            offCtx.arc(20, 20, 20, 0, Math.PI * 2);
            offCtx.closePath();
            offCtx.clip();
            offCtx.drawImage(img, 0, 0, 40, 40);
            imagesLoadedRef.current[index] = true;
          };
        } else {
          offCtx.scale(0.4, 0.4);
          const svgString = renderToString(item as React.ReactElement);
          const img = new Image();
          img.src = "data:image/svg+xml;base64," + btoa(svgString);
          img.onload = () => {
            offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
            offCtx.drawImage(img, 0, 0);
            imagesLoadedRef.current[index] = true;
          };
        }
      }
      return offscreen;
    });

    iconCanvasesRef.current = newIconCanvases;
    setIconPositions(generateSpherePositions(items.length));
  }, [icons, images, generateSpherePositions]);

  // Mouse event handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect || !canvasRef.current) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (const icon of iconPositions) {
        const cosX = Math.cos(rotationRef.current.x);
        const sinX = Math.sin(rotationRef.current.x);
        const cosY = Math.cos(rotationRef.current.y);
        const sinY = Math.sin(rotationRef.current.y);

        const rotatedX = icon.x * cosY - icon.z * sinY;
        const rotatedZ = icon.x * sinY + icon.z * cosY;
        const rotatedY = icon.y * cosX + rotatedZ * sinX;

        const screenX = canvasRef.current.width / 2 + rotatedX;
        const screenY = canvasRef.current.height / 2 + rotatedY;

        const scale = (rotatedZ + 200) / 300;
        const radius = 20 * scale;
        const dx = x - screenX;
        const dy = y - screenY;

        if (dx * dx + dy * dy < radius * radius) {
          const targetX = -Math.atan2(
            icon.y,
            Math.sqrt(icon.x * icon.x + icon.z * icon.z)
          );
          const targetY = Math.atan2(icon.x, icon.z);

          const currentX = rotationRef.current.x;
          const currentY = rotationRef.current.y;
          const distance = Math.sqrt(
            Math.pow(targetX - currentX, 2) + Math.pow(targetY - currentY, 2)
          );

          targetRotationRef.current = {
            x: targetX,
            y: targetY,
            startX: currentX,
            startY: currentY,
            distance,
            startTime: performance.now(),
            duration: Math.min(2000, Math.max(800, distance * 1000)),
          };
          break;
        }
      }

      setIsDragging(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    },
    [iconPositions]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }

      if (isDragging) {
        const deltaX = e.clientX - lastMousePos.x;
        const deltaY = e.clientY - lastMousePos.y;

        rotationRef.current = {
          x: rotationRef.current.x + deltaY * 0.002,
          y: rotationRef.current.y + deltaX * 0.002,
        };

        setLastMousePos({ x: e.clientX, y: e.clientY });
      }
    },
    [isDragging, lastMousePos.x, lastMousePos.y]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Render function
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let animationRunning = true;

    const render = () => {
      if (!animationRunning) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw blurred sphere background
      ctx.save();
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 120, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      // Apply backdrop blur only to the sphere area
      ctx.filter = "blur(20000px)";
      ctx.fillStyle = darkModeRef.current
        ? "rgba(0, 0, 0, 0.3)"
        : "rgba(255, 255, 255, 0.3)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
      const dx = mousePos.x - centerX;
      const dy = mousePos.y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const speed = 0.003 + (distance / maxDistance) * 0.01;

      // Handle rotation animation
      if (targetRotationRef.current) {
        const elapsed = performance.now() - targetRotationRef.current.startTime;
        const progress = Math.min(
          1,
          elapsed / targetRotationRef.current.duration
        );
        const easedProgress = easeOutCubic(progress);

        rotationRef.current = {
          x:
            targetRotationRef.current.startX +
            (targetRotationRef.current.x - targetRotationRef.current.startX) *
              easedProgress,
          y:
            targetRotationRef.current.startY +
            (targetRotationRef.current.y - targetRotationRef.current.startY) *
              easedProgress,
        };

        if (progress >= 1) {
          targetRotationRef.current = null;
        }
      } else if (!isDragging) {
        rotationRef.current = {
          x: rotationRef.current.x + (dy / canvas.height) * speed,
          y: rotationRef.current.y + (dx / canvas.width) * speed,
        };
      }

      // Sort and render icons
      const sortedIcons = [...iconPositions].sort((a, b) => {
        const aZ =
          a.x * Math.sin(rotationRef.current.y) +
          a.z * Math.cos(rotationRef.current.y);
        const bZ =
          b.x * Math.sin(rotationRef.current.y) +
          b.z * Math.cos(rotationRef.current.y);
        return aZ - bZ;
      });

      for (const icon of sortedIcons) {
        const cosX = Math.cos(rotationRef.current.x);
        const sinX = Math.sin(rotationRef.current.x);
        const cosY = Math.cos(rotationRef.current.y);
        const sinY = Math.sin(rotationRef.current.y);

        const rotatedX = icon.x * cosY - icon.z * sinY;
        const rotatedZ = icon.x * sinY + icon.z * cosY;
        const rotatedY = icon.y * cosX + rotatedZ * sinX;

        const scale = (rotatedZ + 200) / 300;
        const opacity = Math.max(0.2, Math.min(1, (rotatedZ + 150) / 200));

        ctx.save();
        ctx.translate(centerX + rotatedX, centerY + rotatedY);
        ctx.scale(scale, scale);
        ctx.globalAlpha = opacity;

        if (icons || images) {
          const iconCanvas = iconCanvasesRef.current[icon.id];
          if (iconCanvas && imagesLoadedRef.current[icon.id]) {
            ctx.drawImage(iconCanvas, -20, -20, 40, 40);
          }
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, 20, 0, Math.PI * 2);
          ctx.fillStyle = darkModeRef.current ? "#6366f1" : "#4f46e5";
          ctx.fill();
          ctx.fillStyle = darkModeRef.current ? "white" : "black";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = "16px Arial";
          ctx.fillText(`${icon.id + 1}`, 0, 0);
        }

        ctx.restore();
      }

      rafIdRef.current = requestAnimationFrame(render);
    };

    rafIdRef.current = requestAnimationFrame(render);

    return () => {
      animationRunning = false;
      cancelAnimationFrame(rafIdRef.current);
    };
  }, [iconPositions, isDragging, mousePos.x, mousePos.y, icons, images]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={300}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`rounded-lg ${className}`}
      aria-label="Interactive 3D Icon Cloud"
      role="img"
    />
  );
}
