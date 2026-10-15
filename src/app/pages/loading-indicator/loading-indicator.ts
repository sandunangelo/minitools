import { Component, OnDestroy, computed, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '../../core/shared/components/button/button';
import { PageHeader } from '../../core/shared/components/page-header/page-header';
import { escapeHtml } from '../../core/shared/escape-html';
import { highlightXml } from '../../core/shared/highlight-xml';

interface SpinnerDesign {
  id: string;
  label: string;
  /** `cls` is the CSS class name to generate markup/rules under — parameterized (rather than
   *  baked in) so the exact same generator can produce both the "real" export (class name
   *  `sap-spinner-{id}`) and an isolated thumbnail preview (a differently-named class) without
   *  the two ever colliding when both are live on the page simultaneously — see `thumbHtml`. */
  html: (cls: string) => string;
  css: (cls: string, size: number, color: string, track: string) => string;
}

function borderWidth(size: number): number {
  return Math.max(2, Math.round(size / 8));
}

const DESIGNS: SpinnerDesign[] = [
  {
    id: 'ring',
    label: 'Ring',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color, track) => `.${cls} {
  width: ${size}px;
  height: ${size}px;
  border: ${borderWidth(size)}px solid ${track};
  border-top-color: ${color};
  border-radius: 50%;
  animation: ${cls}-spin 0.8s linear infinite;
}

@keyframes ${cls}-spin {
  to { transform: rotate(360deg); }
}`,
  },
  {
    id: 'dual-ring',
    label: 'Dual Ring',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color, track) => `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
}

.${cls}::before,
.${cls}::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: ${borderWidth(size)}px solid transparent;
}

.${cls}::before {
  border-top-color: ${color};
  border-bottom-color: ${track};
  animation: ${cls}-spin 1s linear infinite;
}

.${cls}::after {
  inset: ${Math.round(size * 0.18)}px;
  border-left-color: ${color};
  border-right-color: ${track};
  animation: ${cls}-spin-reverse 0.8s linear infinite;
}

@keyframes ${cls}-spin {
  to { transform: rotate(360deg); }
}

@keyframes ${cls}-spin-reverse {
  to { transform: rotate(-360deg); }
}`,
  },
  {
    id: 'dots',
    label: 'Dots',
    html: (cls) => `<div class="${cls}"><span></span><span></span><span></span></div>`,
    css: (cls, size, color) => `.${cls} {
  display: flex;
  align-items: center;
  gap: ${Math.round(size * 0.18)}px;
  height: ${size}px;
}

.${cls} span {
  width: ${Math.round(size * 0.22)}px;
  height: ${Math.round(size * 0.22)}px;
  background: ${color};
  border-radius: 50%;
  animation: ${cls}-bounce 0.6s ease-in-out infinite;
}

.${cls} span:nth-child(2) { animation-delay: 0.15s; }
.${cls} span:nth-child(3) { animation-delay: 0.3s; }

@keyframes ${cls}-bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}`,
  },
  {
    id: 'bars',
    label: 'Bars',
    html: (cls) => `<div class="${cls}"><span></span><span></span><span></span><span></span></div>`,
    css: (cls, size, color) => `.${cls} {
  display: flex;
  align-items: center;
  gap: ${Math.round(size * 0.1)}px;
  height: ${size}px;
}

.${cls} span {
  width: ${Math.round(size * 0.15)}px;
  height: 100%;
  background: ${color};
  border-radius: 2px;
  animation: ${cls}-scale 1s ease-in-out infinite;
}

.${cls} span:nth-child(1) { animation-delay: 0s; }
.${cls} span:nth-child(2) { animation-delay: 0.15s; }
.${cls} span:nth-child(3) { animation-delay: 0.3s; }
.${cls} span:nth-child(4) { animation-delay: 0.45s; }

@keyframes ${cls}-scale {
  0%, 100% { transform: scaleY(0.3); }
  50% { transform: scaleY(1); }
}`,
  },
  {
    id: 'pulse',
    label: 'Pulse',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => `.${cls} {
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  background: ${color};
  animation: ${cls}-pulse 1.2s ease-out infinite;
}

@keyframes ${cls}-pulse {
  0% { transform: scale(0.25); opacity: 1; }
  100% { transform: scale(1); opacity: 0; }
}`,
  },
  {
    id: 'ball',
    label: 'Bouncing Ball',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
}

.${cls}::before {
  content: "";
  position: absolute;
  left: 30%;
  top: 0;
  width: 40%;
  height: 40%;
  background: ${color};
  border-radius: 50%;
  animation: ${cls}-bounce 0.6s cubic-bezier(0.5, 0, 1, 0.5) infinite alternate;
}

@keyframes ${cls}-bounce {
  from { transform: translateY(0); }
  to { transform: translateY(${Math.round(size * 0.75)}px); }
}`,
  },

  // --- Rings / arcs --------------------------------------------------------------------------

  {
    id: 'triple-ring',
    label: 'Triple Ring',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => {
      const bw = Math.max(2, Math.round(size / 16));
      return `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  border: ${bw}px solid transparent;
  border-top-color: ${color};
  animation: ${cls}-spin 1.5s linear infinite;
}

.${cls}::before,
.${cls}::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  border: ${bw}px solid transparent;
}

.${cls}::before {
  inset: ${Math.round(size * 0.14)}px;
  border-top-color: ${color};
  opacity: 0.7;
  animation: ${cls}-spin 1s linear infinite reverse;
}

.${cls}::after {
  inset: ${Math.round(size * 0.28)}px;
  border-top-color: ${color};
  opacity: 0.45;
  animation: ${cls}-spin 0.7s linear infinite;
}

@keyframes ${cls}-spin {
  to { transform: rotate(360deg); }
}`;
    },
  },
  {
    id: 'dashed-ring',
    label: 'Dashed Ring',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => `.${cls} {
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  border: ${borderWidth(size)}px dashed ${color};
  animation: ${cls}-spin 2s linear infinite;
}

@keyframes ${cls}-spin {
  to { transform: rotate(360deg); }
}`,
  },
  {
    id: 'comet',
    label: 'Comet',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => {
      const bw = borderWidth(size);
      return `.${cls} {
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, transparent, ${color});
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - ${bw}px - 1px), #000 calc(100% - ${bw}px));
  mask: radial-gradient(farthest-side, transparent calc(100% - ${bw}px - 1px), #000 calc(100% - ${bw}px));
  animation: ${cls}-spin 1s linear infinite;
}

@keyframes ${cls}-spin {
  to { transform: rotate(360deg); }
}`;
    },
  },
  {
    id: 'semi-circle',
    label: 'Semi Circle',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => `.${cls} {
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  border: ${borderWidth(size)}px solid transparent;
  border-top-color: ${color};
  border-right-color: ${color};
  animation: ${cls}-spin 0.9s linear infinite;
}

@keyframes ${cls}-spin {
  to { transform: rotate(360deg); }
}`,
  },
  {
    id: 'square-ring',
    label: 'Square Ring',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color, track) => `.${cls} {
  width: ${size}px;
  height: ${size}px;
  border: ${borderWidth(size)}px solid ${track};
  border-top-color: ${color};
  border-radius: 6px;
  animation: ${cls}-spin 1s linear infinite;
}

@keyframes ${cls}-spin {
  to { transform: rotate(360deg); }
}`,
  },
  {
    id: 'dotted-ring',
    label: 'Dotted Ring',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => `.${cls} {
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  border: ${Math.max(3, Math.round(size / 6))}px dotted ${color};
  animation: ${cls}-spin 2.5s linear infinite;
}

@keyframes ${cls}-spin {
  to { transform: rotate(360deg); }
}`,
  },
  {
    id: 'pie',
    label: 'Pie',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color, track) => `@property --${cls}-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.${cls} {
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  background: conic-gradient(${color} var(--${cls}-angle), ${track} var(--${cls}-angle));
  animation: ${cls}-grow 1.4s linear infinite;
}

@keyframes ${cls}-grow {
  to { --${cls}-angle: 360deg; }
}`,
  },
  {
    id: 'ring-dot',
    label: 'Ring & Dot',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color, track) => `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
}

.${cls}::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: ${borderWidth(size)}px solid ${track};
  border-top-color: ${color};
  animation: ${cls}-spin 0.9s linear infinite;
}

.${cls}::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: ${Math.round(size * 0.18)}px;
  height: ${Math.round(size * 0.18)}px;
  margin: ${Math.round(size * -0.09)}px;
  background: ${color};
  border-radius: 50%;
  animation: ${cls}-pulse 1.2s ease-in-out infinite;
}

@keyframes ${cls}-spin {
  to { transform: rotate(360deg); }
}

@keyframes ${cls}-pulse {
  0%, 100% { transform: scale(0.8); opacity: 0.6; }
  50% { transform: scale(1.2); opacity: 1; }
}`,
  },

  // --- Orbit -----------------------------------------------------------------------------------

  {
    id: 'orbit',
    label: 'Orbit',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => {
      const dotSize = Math.max(3, Math.round(size * 0.18));
      return `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
  animation: ${cls}-spin 1.2s linear infinite;
}

.${cls}::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  width: ${dotSize}px;
  height: ${dotSize}px;
  margin-left: ${Math.round(-dotSize / 2)}px;
  background: ${color};
  border-radius: 50%;
}

@keyframes ${cls}-spin {
  to { transform: rotate(360deg); }
}`;
    },
  },
  {
    id: 'dual-orbit',
    label: 'Dual Orbit',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color, track) => {
      const dotSize = Math.max(3, Math.round(size * 0.16));
      const pivot = Math.round(size / 2);
      return `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
}

.${cls}::before,
.${cls}::after {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  width: ${dotSize}px;
  height: ${dotSize}px;
  margin-left: ${Math.round(-dotSize / 2)}px;
  border-radius: 50%;
  transform-origin: 50% ${pivot}px;
}

.${cls}::before {
  background: ${color};
  animation: ${cls}-spin 1.3s linear infinite;
}

.${cls}::after {
  background: ${track};
  animation: ${cls}-spin-reverse 1.3s linear infinite;
}

@keyframes ${cls}-spin {
  to { transform: rotate(360deg); }
}

@keyframes ${cls}-spin-reverse {
  to { transform: rotate(-360deg); }
}`;
    },
  },
  {
    id: 'chase',
    label: 'Chase',
    html: (cls) => `<div class="${cls}">${Array.from({ length: 8 }, () => '<span></span>').join('')}</div>`,
    css: (cls, size, color) => {
      const dotSize = Math.max(2, Math.round(size * 0.12));
      const radius = Math.round((size - dotSize) / 2);
      const dur = 1.2;
      const count = 8;
      let rules = '';
      for (let i = 0; i < count; i++) {
        const angle = (360 / count) * i;
        const delay = ((dur / count) * i).toFixed(3);
        rules += `.${cls} span:nth-child(${i + 1}) {
  transform: rotate(${angle}deg) translate(0, -${radius}px);
  animation-delay: ${delay}s;
}
`;
      }
      return `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
}

.${cls} span {
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${dotSize}px;
  height: ${dotSize}px;
  margin: ${Math.round(-dotSize / 2)}px;
  background: ${color};
  border-radius: 50%;
  animation: ${cls}-fade ${dur}s linear infinite;
}

${rules}
@keyframes ${cls}-fade {
  0%, 100% { opacity: 0.15; }
  50% { opacity: 1; }
}`;
    },
  },
  {
    id: 'trio-orbit',
    label: 'Trio Orbit',
    html: (cls) => `<div class="${cls}"><span></span><span></span><span></span></div>`,
    css: (cls, size, color) => {
      const dotSize = Math.max(3, Math.round(size * 0.16));
      const pivot = Math.round(size / 2);
      const dur = 1.4;
      return `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
}

.${cls} span {
  position: absolute;
  top: 0;
  left: 50%;
  width: ${dotSize}px;
  height: ${dotSize}px;
  margin-left: ${Math.round(-dotSize / 2)}px;
  background: ${color};
  border-radius: 50%;
  transform-origin: 50% ${pivot}px;
  animation: ${cls}-spin ${dur}s linear infinite;
}

.${cls} span:nth-child(1) { animation-delay: 0s; }
.${cls} span:nth-child(2) { animation-delay: ${(-dur / 3).toFixed(3)}s; }
.${cls} span:nth-child(3) { animation-delay: ${((-dur * 2) / 3).toFixed(3)}s; }

@keyframes ${cls}-spin {
  to { transform: rotate(360deg); }
}`;
    },
  },

  // --- Dot sequences -----------------------------------------------------------------------

  {
    id: 'dots-pulse',
    label: 'Dots Pulse',
    html: (cls) => `<div class="${cls}"><span></span><span></span><span></span></div>`,
    css: (cls, size, color) => `.${cls} {
  display: flex;
  align-items: center;
  gap: ${Math.round(size * 0.18)}px;
  height: ${size}px;
}

.${cls} span {
  width: ${Math.round(size * 0.22)}px;
  height: ${Math.round(size * 0.22)}px;
  background: ${color};
  border-radius: 50%;
  animation: ${cls}-pulse 1s ease-in-out infinite;
}

.${cls} span:nth-child(2) { animation-delay: 0.2s; }
.${cls} span:nth-child(3) { animation-delay: 0.4s; }

@keyframes ${cls}-pulse {
  0%, 100% { transform: scale(0.4); }
  50% { transform: scale(1); }
}`,
  },
  {
    id: 'dots-fade',
    label: 'Dots Fade',
    html: (cls) => `<div class="${cls}"><span></span><span></span><span></span></div>`,
    css: (cls, size, color) => `.${cls} {
  display: flex;
  align-items: center;
  gap: ${Math.round(size * 0.18)}px;
  height: ${size}px;
}

.${cls} span {
  width: ${Math.round(size * 0.2)}px;
  height: ${Math.round(size * 0.2)}px;
  background: ${color};
  border-radius: 50%;
  animation: ${cls}-fade 1.2s ease-in-out infinite;
}

.${cls} span:nth-child(2) { animation-delay: 0.2s; }
.${cls} span:nth-child(3) { animation-delay: 0.4s; }

@keyframes ${cls}-fade {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
}`,
  },
  {
    id: 'dots-flip',
    label: 'Dots Flip',
    html: (cls) => `<div class="${cls}"><span></span><span></span><span></span></div>`,
    css: (cls, size, color) => `.${cls} {
  display: flex;
  align-items: center;
  gap: ${Math.round(size * 0.18)}px;
  height: ${size}px;
  perspective: ${size * 3}px;
}

.${cls} span {
  width: ${Math.round(size * 0.22)}px;
  height: ${Math.round(size * 0.22)}px;
  background: ${color};
  border-radius: 4px;
  animation: ${cls}-flip 1.2s ease-in-out infinite;
}

.${cls} span:nth-child(2) { animation-delay: 0.15s; }
.${cls} span:nth-child(3) { animation-delay: 0.3s; }

@keyframes ${cls}-flip {
  0%, 100% { transform: rotateY(0deg); }
  50% { transform: rotateY(180deg); }
}`,
  },
  {
    id: 'dots-wave',
    label: 'Dots Wave',
    html: (cls) => `<div class="${cls}"><span></span><span></span><span></span><span></span></div>`,
    css: (cls, size, color) => {
      const dotSize = Math.max(3, Math.round(size * 0.16));
      const travel = Math.round(size * 0.25);
      return `.${cls} {
  display: flex;
  align-items: center;
  gap: ${Math.round(size * 0.1)}px;
  height: ${size}px;
}

.${cls} span {
  width: ${dotSize}px;
  height: ${dotSize}px;
  background: ${color};
  border-radius: 50%;
  animation: ${cls}-wave 1s ease-in-out infinite;
}

.${cls} span:nth-child(1) { animation-delay: 0s; }
.${cls} span:nth-child(2) { animation-delay: 0.1s; }
.${cls} span:nth-child(3) { animation-delay: 0.2s; }
.${cls} span:nth-child(4) { animation-delay: 0.3s; }

@keyframes ${cls}-wave {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-${travel}px); }
}`;
    },
  },
  {
    id: 'dots-train',
    label: 'Dots Train',
    html: (cls) => `<div class="${cls}"><span></span><span></span><span></span><span></span><span></span></div>`,
    css: (cls, size, color) => {
      const dotSize = Math.max(3, Math.round(size * 0.14));
      const count = 5;
      const dur = 1.2;
      let rules = '';
      for (let i = 0; i < count; i++) {
        rules += `.${cls} span:nth-child(${i + 1}) { animation-delay: ${((dur / count) * i).toFixed(3)}s; }\n`;
      }
      return `.${cls} {
  display: flex;
  align-items: center;
  gap: ${Math.round(size * 0.08)}px;
  height: ${size}px;
}

.${cls} span {
  width: ${dotSize}px;
  height: ${dotSize}px;
  background: ${color};
  border-radius: 50%;
  opacity: 0.15;
  animation: ${cls}-train ${dur}s ease-in-out infinite;
}

${rules}
@keyframes ${cls}-train {
  0%, 80%, 100% { opacity: 0.15; }
  20% { opacity: 1; }
}`;
    },
  },
  {
    id: 'cradle',
    label: 'Cradle',
    html: (cls) => `<div class="${cls}"><span></span><span></span></div>`,
    css: (cls, size, color) => {
      const dotSize = Math.max(4, Math.round(size * 0.3));
      const travel = Math.round(size * 0.3);
      return `.${cls} {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${Math.round(size * 0.05)}px;
  height: ${size}px;
}

.${cls} span {
  width: ${dotSize}px;
  height: ${dotSize}px;
  background: ${color};
  border-radius: 50%;
}

.${cls} span:nth-child(1) {
  animation: ${cls}-left 1s ease-in-out infinite;
}

.${cls} span:nth-child(2) {
  animation: ${cls}-right 1s ease-in-out infinite;
}

@keyframes ${cls}-left {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(${travel}px); }
}

@keyframes ${cls}-right {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-${travel}px); }
}`;
    },
  },
  {
    id: 'wave-5',
    label: 'Wave',
    html: (cls) =>
      `<div class="${cls}"><span></span><span></span><span></span><span></span><span></span><span></span></div>`,
    css: (cls, size, color) => {
      const dotSize = Math.max(3, Math.round(size * 0.13));
      const count = 6;
      const dur = 1.6;
      let rules = '';
      for (let i = 0; i < count; i++) {
        rules += `.${cls} span:nth-child(${i + 1}) { animation-delay: ${((dur / count) * i * 0.6).toFixed(3)}s; }\n`;
      }
      return `.${cls} {
  display: flex;
  align-items: center;
  gap: ${Math.round(size * 0.06)}px;
  height: ${size}px;
}

.${cls} span {
  width: ${dotSize}px;
  height: ${dotSize}px;
  background: ${color};
  border-radius: 50%;
  animation: ${cls}-roll ${dur}s ease-in-out infinite;
}

${rules}
@keyframes ${cls}-roll {
  0%, 100% { transform: scale(0.5); opacity: 0.4; }
  50% { transform: scale(1.3); opacity: 1; }
}`;
    },
  },

  // --- Bars ----------------------------------------------------------------------------------

  {
    id: 'bars-slide',
    label: 'Bars Slide',
    html: (cls) => `<div class="${cls}"><span></span><span></span><span></span><span></span></div>`,
    css: (cls, size, color) => {
      const barW = Math.max(2, Math.round(size * 0.12));
      const travel = Math.round(size * 0.25);
      return `.${cls} {
  display: flex;
  align-items: center;
  gap: ${Math.round(size * 0.1)}px;
  height: ${size}px;
}

.${cls} span {
  width: ${barW}px;
  height: ${Math.round(size * 0.4)}px;
  background: ${color};
  border-radius: 2px;
  animation: ${cls}-slide 1s ease-in-out infinite;
}

.${cls} span:nth-child(1) { animation-delay: 0s; }
.${cls} span:nth-child(2) { animation-delay: 0.1s; }
.${cls} span:nth-child(3) { animation-delay: 0.2s; }
.${cls} span:nth-child(4) { animation-delay: 0.3s; }

@keyframes ${cls}-slide {
  0%, 100% { transform: translateY(${travel}px); }
  50% { transform: translateY(-${travel}px); }
}`;
    },
  },
  {
    id: 'bars-seesaw',
    label: 'Bars Seesaw',
    html: (cls) => `<div class="${cls}"><span></span><span></span><span></span></div>`,
    css: (cls, size, color) => {
      const barW = Math.max(2, Math.round(size * 0.1));
      return `.${cls} {
  display: flex;
  align-items: flex-end;
  gap: ${Math.round(size * 0.14)}px;
  height: ${size}px;
}

.${cls} span {
  width: ${barW}px;
  height: ${Math.round(size * 0.7)}px;
  background: ${color};
  border-radius: 2px;
  transform-origin: bottom center;
  animation: ${cls}-seesaw 1s ease-in-out infinite;
}

.${cls} span:nth-child(2) { animation-delay: 0.15s; }
.${cls} span:nth-child(3) { animation-delay: 0.3s; }

@keyframes ${cls}-seesaw {
  0%, 100% { transform: rotate(-18deg); }
  50% { transform: rotate(18deg); }
}`;
    },
  },
  {
    id: 'progress',
    label: 'Progress',
    html: (cls) => `<div class="${cls}"><span></span></div>`,
    css: (cls, size, color, track) => {
      const h = Math.max(4, Math.round(size * 0.14));
      const w = Math.round(size * 1.8);
      return `.${cls} {
  position: relative;
  width: ${w}px;
  height: ${h}px;
  background: ${track};
  border-radius: ${Math.round(h / 2)}px;
  overflow: hidden;
}

.${cls} span {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 40%;
  background: ${color};
  border-radius: ${Math.round(h / 2)}px;
  animation: ${cls}-slide 1.2s ease-in-out infinite;
}

@keyframes ${cls}-slide {
  0% { left: -40%; }
  100% { left: 100%; }
}`;
    },
  },
  {
    id: 'progress-split',
    label: 'Progress Split',
    html: (cls) => `<div class="${cls}"><span></span></div>`,
    css: (cls, size, color, track) => {
      const h = Math.max(4, Math.round(size * 0.14));
      const w = Math.round(size * 1.8);
      return `.${cls} {
  position: relative;
  width: ${w}px;
  height: ${h}px;
  background: ${track};
  border-radius: ${Math.round(h / 2)}px;
  overflow: hidden;
}

.${cls} span {
  position: absolute;
  top: 0;
  left: 50%;
  right: 50%;
  height: 100%;
  background: ${color};
  border-radius: ${Math.round(h / 2)}px;
  animation: ${cls}-split 1.3s ease-in infinite;
}

@keyframes ${cls}-split {
  0% { left: 50%; right: 50%; opacity: 1; }
  70% { left: 0%; right: 0%; opacity: 1; }
  100% { left: 0%; right: 0%; opacity: 0; }
}`;
    },
  },
  {
    id: 'progress-stripes',
    label: 'Striped Progress',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color, track) => {
      const h = Math.max(6, Math.round(size * 0.16));
      const w = Math.round(size * 1.8);
      const stripe = Math.max(6, Math.round(h * 0.8));
      const period = Math.round(stripe * 1.41);
      return `.${cls} {
  width: ${w}px;
  height: ${h}px;
  border-radius: ${Math.round(h / 4)}px;
  background-color: ${track};
  background-image: repeating-linear-gradient(
    45deg,
    ${color} 0,
    ${color} ${Math.round(stripe / 2)}px,
    transparent ${Math.round(stripe / 2)}px,
    transparent ${stripe}px
  );
  background-size: ${period}px ${period}px;
  animation: ${cls}-stripes 0.7s linear infinite;
}

@keyframes ${cls}-stripes {
  to { background-position: ${period}px 0; }
}`;
    },
  },
  {
    id: 'radial-bars',
    label: 'Radial Bars',
    html: (cls) => `<div class="${cls}">${Array.from({ length: 12 }, () => '<span></span>').join('')}</div>`,
    css: (cls, size, color) => {
      const barW = Math.max(2, Math.round(size * 0.06));
      const barH = Math.round(size * 0.22);
      const radius = Math.round(size / 2 - barH / 2 - 2);
      const dur = 1.2;
      const count = 12;
      let rules = '';
      for (let i = 0; i < count; i++) {
        const angle = (360 / count) * i;
        const delay = ((dur / count) * i - dur).toFixed(3);
        rules += `.${cls} span:nth-child(${i + 1}) {
  transform: rotate(${angle}deg) translate(0, -${radius}px);
  animation-delay: ${delay}s;
}
`;
      }
      return `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
}

.${cls} span {
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${barW}px;
  height: ${barH}px;
  margin: ${Math.round(-barH / 2)}px 0 0 ${Math.round(-barW / 2)}px;
  background: ${color};
  border-radius: ${barW}px;
  animation: ${cls}-tick ${dur}s linear infinite;
}

${rules}
@keyframes ${cls}-tick {
  0%, 100% { opacity: 0.2; }
  8% { opacity: 1; }
}`;
    },
  },

  // --- Shapes ----------------------------------------------------------------------------------

  {
    id: 'square-rotate',
    label: 'Square Rotate',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => `.${cls} {
  width: ${Math.round(size * 0.7)}px;
  height: ${Math.round(size * 0.7)}px;
  background: ${color};
  animation: ${cls}-spin 1.2s linear infinite;
}

@keyframes ${cls}-spin {
  to { transform: rotate(360deg); }
}`,
  },
  {
    id: 'square-morph',
    label: 'Square Morph',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => `.${cls} {
  width: ${Math.round(size * 0.7)}px;
  height: ${Math.round(size * 0.7)}px;
  background: ${color};
  animation: ${cls}-morph 1.5s ease-in-out infinite;
}

@keyframes ${cls}-morph {
  0%, 100% { border-radius: 10%; transform: rotate(0deg); }
  50% { border-radius: 50%; transform: rotate(180deg); }
}`,
  },
  {
    id: 'triangle-rotate',
    label: 'Triangle Rotate',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => {
      const half = Math.round(size * 0.5);
      return `.${cls} {
  width: 0;
  height: 0;
  border-left: ${half}px solid transparent;
  border-right: ${half}px solid transparent;
  border-bottom: ${Math.round(size * 0.87)}px solid ${color};
  animation: ${cls}-spin 1.2s linear infinite;
}

@keyframes ${cls}-spin {
  to { transform: rotate(360deg); }
}`;
    },
  },
  {
    id: 'diamond-pulse',
    label: 'Diamond Pulse',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => `.${cls} {
  width: ${Math.round(size * 0.55)}px;
  height: ${Math.round(size * 0.55)}px;
  background: ${color};
  animation: ${cls}-pulse 1s ease-in-out infinite;
}

@keyframes ${cls}-pulse {
  0%, 100% { transform: rotate(45deg) scale(0.6); opacity: 0.5; }
  50% { transform: rotate(45deg) scale(1); opacity: 1; }
}`,
  },
  {
    id: 'fold',
    label: 'Fold',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => `.${cls} {
  width: ${Math.round(size * 0.6)}px;
  height: ${Math.round(size * 0.6)}px;
  background: ${color};
  animation: ${cls}-fold 1.2s ease-in-out infinite;
}

@keyframes ${cls}-fold {
  0%, 100% { transform: scale(1, 1); }
  25% { transform: scale(1, 0.1); }
  50% { transform: scale(0.1, 0.1); }
  75% { transform: scale(0.1, 1); }
}`,
  },
  {
    id: 'windmill',
    label: 'Windmill',
    html: (cls) => `<div class="${cls}"><span></span><span></span><span></span><span></span></div>`,
    css: (cls, size, color) => {
      const bladeW = Math.max(3, Math.round(size * 0.14));
      const bladeH = Math.round(size * 0.42);
      return `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
  animation: ${cls}-spin 1s linear infinite;
}

.${cls} span {
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${bladeW}px;
  height: ${bladeH}px;
  margin: ${-bladeH}px 0 0 ${Math.round(-bladeW / 2)}px;
  background: ${color};
  border-radius: ${bladeW}px ${bladeW}px 0 0;
  transform-origin: 50% 100%;
}

.${cls} span:nth-child(1) { transform: rotate(0deg); }
.${cls} span:nth-child(2) { transform: rotate(90deg); }
.${cls} span:nth-child(3) { transform: rotate(180deg); }
.${cls} span:nth-child(4) { transform: rotate(270deg); }

@keyframes ${cls}-spin {
  to { transform: rotate(360deg); }
}`;
    },
  },
  {
    id: 'flower',
    label: 'Flower',
    html: (cls) => `<div class="${cls}">${Array.from({ length: 6 }, () => '<span></span>').join('')}</div>`,
    // Positioned via static left/top offsets (trig'd from angle+radius) rather than a static
    // `transform: rotate()+translate()`, specifically so the shared scale() animation below
    // (which DOES target `transform`) doesn't silently clobber each petal's placement — a static
    // and an animated value on the SAME property can't coexist; the animation always wins.
    css: (cls, size, color) => {
      const dotSize = Math.round(size * 0.32);
      const radius = size * 0.22;
      const dur = 1.4;
      const count = 6;
      let rules = '';
      for (let i = 0; i < count; i++) {
        const angleRad = ((360 / count) * i * Math.PI) / 180;
        const x = Math.round(radius * Math.sin(angleRad));
        const y = Math.round(-radius * Math.cos(angleRad));
        const delay = ((dur / count) * i).toFixed(3);
        rules += `.${cls} span:nth-child(${i + 1}) {
  margin-left: ${Math.round(-dotSize / 2 + x)}px;
  margin-top: ${Math.round(-dotSize / 2 + y)}px;
  animation-delay: ${delay}s;
}
`;
      }
      return `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
}

.${cls} span {
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${dotSize}px;
  height: ${dotSize}px;
  background: ${color};
  border-radius: 50%;
  animation: ${cls}-bloom ${dur}s ease-in-out infinite;
}

${rules}
@keyframes ${cls}-bloom {
  0%, 100% { transform: scale(0.3); opacity: 0.4; }
  50% { transform: scale(1); opacity: 1; }
}`;
    },
  },
  {
    id: 'hourglass',
    label: 'Hourglass',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => {
      const half = Math.round(size * 0.4);
      return `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
  animation: ${cls}-flip 1.4s ease-in-out infinite;
}

.${cls}::before,
.${cls}::after {
  content: "";
  position: absolute;
  left: 50%;
  width: 0;
  height: 0;
  margin-left: ${-half}px;
  border-left: ${half}px solid transparent;
  border-right: ${half}px solid transparent;
}

.${cls}::before {
  top: 0;
  border-top: ${Math.round(half * 0.8)}px solid ${color};
}

.${cls}::after {
  bottom: 0;
  border-bottom: ${Math.round(half * 0.8)}px solid ${color};
}

@keyframes ${cls}-flip {
  0%, 40% { transform: rotate(0deg); }
  50%, 90% { transform: rotate(180deg); }
  100% { transform: rotate(360deg); }
}`;
    },
  },

  // --- Ripple / pulse ------------------------------------------------------------------------

  {
    id: 'double-ripple',
    label: 'Double Ripple',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
}

.${cls}::before,
.${cls}::after {
  content: "";
  position: absolute;
  inset: 0;
  border: ${Math.max(2, Math.round(size / 16))}px solid ${color};
  border-radius: 50%;
  animation: ${cls}-ripple 1.4s ease-out infinite;
}

.${cls}::after {
  animation-delay: 0.7s;
}

@keyframes ${cls}-ripple {
  0% { transform: scale(0.2); opacity: 1; }
  100% { transform: scale(1); opacity: 0; }
}`,
  },
  {
    id: 'ripple-square',
    label: 'Ripple Square',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => `.${cls} {
  width: ${size}px;
  height: ${size}px;
  border-radius: 12%;
  background: ${color};
  animation: ${cls}-ripple 1.2s ease-out infinite;
}

@keyframes ${cls}-ripple {
  0% { transform: scale(0.25); opacity: 1; }
  100% { transform: scale(1); opacity: 0; }
}`,
  },
  {
    id: 'breathe',
    label: 'Breathe',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => `.${cls} {
  width: ${Math.round(size * 0.6)}px;
  height: ${Math.round(size * 0.6)}px;
  background: ${color};
  border-radius: 50%;
  animation: ${cls}-breathe 2.4s ease-in-out infinite;
}

@keyframes ${cls}-breathe {
  0%, 100% { transform: scale(0.75); opacity: 0.6; }
  50% { transform: scale(1); opacity: 1; }
}`,
  },
  {
    id: 'heartbeat',
    label: 'Heartbeat',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => `.${cls} {
  width: ${Math.round(size * 0.6)}px;
  height: ${Math.round(size * 0.6)}px;
  background: ${color};
  border-radius: 50%;
  animation: ${cls}-beat 1.4s ease-in-out infinite;
}

@keyframes ${cls}-beat {
  0%, 100% { transform: scale(1); }
  15% { transform: scale(1.3); }
  30% { transform: scale(1); }
  45% { transform: scale(1.3); }
  60% { transform: scale(1); }
}`,
  },

  // --- Bounce ----------------------------------------------------------------------------------

  {
    id: 'bouncing-bar',
    label: 'Bouncing Bar',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => {
      const h = Math.round(size * 0.18);
      const w = Math.round(size * 0.6);
      const travel = Math.round(size * 0.5);
      return `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
}

.${cls}::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 0;
  width: ${w}px;
  height: ${h}px;
  margin-left: ${Math.round(-w / 2)}px;
  background: ${color};
  border-radius: ${Math.round(h / 2)}px;
  animation: ${cls}-bounce 0.6s cubic-bezier(0.5, 0, 1, 0.5) infinite alternate;
}

@keyframes ${cls}-bounce {
  from { transform: translateY(0); }
  to { transform: translateY(${travel}px); }
}`;
    },
  },
  {
    id: 'leapfrog',
    label: 'Leapfrog',
    html: (cls) => `<div class="${cls}"><span></span><span></span><span></span></div>`,
    css: (cls, size, color) => {
      const dotSize = Math.round(size * 0.24);
      const travel = Math.round(size * 0.45);
      return `.${cls} {
  display: flex;
  align-items: flex-end;
  gap: ${Math.round(size * 0.12)}px;
  height: ${size}px;
}

.${cls} span {
  width: ${dotSize}px;
  height: ${dotSize}px;
  background: ${color};
  border-radius: 50%;
  animation: ${cls}-hop 0.9s ease-in-out infinite;
}

.${cls} span:nth-child(2) { animation-delay: 0.3s; }
.${cls} span:nth-child(3) { animation-delay: 0.6s; }

@keyframes ${cls}-hop {
  0%, 100% { transform: translateY(0); }
  30% { transform: translateY(-${travel}px); }
}`;
    },
  },
  {
    id: 'bounce-wave',
    label: 'Bounce Wave',
    html: (cls) =>
      `<div class="${cls}"><span></span><span></span><span></span><span></span><span></span></div>`,
    css: (cls, size, color) => {
      const dotSize = Math.round(size * 0.16);
      const travel = Math.round(size * 0.4);
      const count = 5;
      const dur = 0.9;
      let rules = '';
      for (let i = 0; i < count; i++) {
        rules += `.${cls} span:nth-child(${i + 1}) { animation-delay: ${((dur / count) * i).toFixed(3)}s; }\n`;
      }
      return `.${cls} {
  display: flex;
  align-items: flex-end;
  gap: ${Math.round(size * 0.08)}px;
  height: ${size}px;
}

.${cls} span {
  width: ${dotSize}px;
  height: ${dotSize}px;
  background: ${color};
  border-radius: 50%;
  animation: ${cls}-bounce ${dur}s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
}

${rules}
@keyframes ${cls}-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-${travel}px); }
}`;
    },
  },

  // --- 3D-ish / misc ---------------------------------------------------------------------------

  {
    id: 'flip-square',
    label: 'Flip Square',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => `.${cls} {
  width: ${Math.round(size * 0.65)}px;
  height: ${Math.round(size * 0.65)}px;
  background: ${color};
  border-radius: 8%;
  animation: ${cls}-flip 1.2s ease-in-out infinite;
}

@keyframes ${cls}-flip {
  0% { transform: perspective(${size * 3}px) rotateY(0deg); }
  50% { transform: perspective(${size * 3}px) rotateY(180deg); }
  100% { transform: perspective(${size * 3}px) rotateY(360deg); }
}`,
  },
  {
    id: 'cube',
    label: 'Cube',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color, track) => `.${cls} {
  width: ${Math.round(size * 0.6)}px;
  height: ${Math.round(size * 0.6)}px;
  background: ${color};
  border: ${Math.max(2, Math.round(size * 0.03))}px solid ${track};
  animation: ${cls}-tumble 1.6s linear infinite;
}

@keyframes ${cls}-tumble {
  0% { transform: perspective(${size * 3}px) rotateX(0deg) rotateY(0deg); }
  100% { transform: perspective(${size * 3}px) rotateX(360deg) rotateY(360deg); }
}`,
  },
  {
    id: 'radar',
    label: 'Radar',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color, track) => {
      const bw = Math.max(1, Math.round(size / 40));
      return `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  border: ${bw}px solid ${track};
  overflow: hidden;
}

.${cls}::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(from 0deg, ${color}, transparent 35%);
  animation: ${cls}-sweep 1.5s linear infinite;
}

@keyframes ${cls}-sweep {
  to { transform: rotate(360deg); }
}`;
    },
  },
  {
    id: 'infinity',
    label: 'Infinity',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => {
      const dotSize = Math.round(size * 0.18);
      const half = Math.round(size * 0.32);
      return `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${Math.round(size * 0.6)}px;
}

.${cls}::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${dotSize}px;
  height: ${dotSize}px;
  margin: ${Math.round(-dotSize / 2)}px;
  background: ${color};
  border-radius: 50%;
  animation: ${cls}-infinity 2s linear infinite;
}

@keyframes ${cls}-infinity {
  0%    { transform: translate(0, 0); }
  12.5% { transform: translate(${half}px, ${Math.round(-half * 0.6)}px); }
  25%   { transform: translate(${half * 2}px, 0); }
  37.5% { transform: translate(${half}px, ${Math.round(half * 0.6)}px); }
  50%   { transform: translate(0, 0); }
  62.5% { transform: translate(${-half}px, ${Math.round(-half * 0.6)}px); }
  75%   { transform: translate(${-half * 2}px, 0); }
  87.5% { transform: translate(${-half}px, ${Math.round(half * 0.6)}px); }
  100%  { transform: translate(0, 0); }
}`;
    },
  },
  {
    id: 'grid-flash',
    label: 'Grid Flash',
    html: (cls) => `<div class="${cls}">${Array.from({ length: 9 }, () => '<span></span>').join('')}</div>`,
    css: (cls, size, color) => {
      const cell = Math.round(size * 0.26);
      const gap = Math.round(size * 0.07);
      const dur = 1.3;
      const count = 9;
      let rules = '';
      for (let i = 0; i < count; i++) {
        rules += `.${cls} span:nth-child(${i + 1}) { animation-delay: ${((dur / count) * i).toFixed(3)}s; }\n`;
      }
      return `.${cls} {
  display: grid;
  grid-template-columns: repeat(3, ${cell}px);
  grid-template-rows: repeat(3, ${cell}px);
  gap: ${gap}px;
}

.${cls} span {
  background: ${color};
  border-radius: 2px;
  animation: ${cls}-flash ${dur}s ease-in-out infinite;
}

${rules}
@keyframes ${cls}-flash {
  0%, 100% { opacity: 0.15; }
  15% { opacity: 1; }
}`;
    },
  },

  // --- Skeleton / shimmer ----------------------------------------------------------------------

  {
    id: 'shimmer',
    label: 'Shimmer Bar',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color, track) => {
      const h = Math.max(8, Math.round(size * 0.22));
      const w = Math.round(size * 2.2);
      return `.${cls} {
  width: ${w}px;
  height: ${h}px;
  border-radius: ${Math.round(h / 3)}px;
  background-color: ${track};
  background-image: linear-gradient(90deg, transparent, ${color}, transparent);
  background-size: 60% 100%;
  background-repeat: no-repeat;
  background-position: -60% 0;
  animation: ${cls}-shimmer 1.3s ease-in-out infinite;
}

@keyframes ${cls}-shimmer {
  to { background-position: 160% 0; }
}`;
    },
  },
  {
    id: 'shimmer-circle',
    label: 'Shimmer Circle',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color, track) => `.${cls} {
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  background-color: ${track};
  background-image: linear-gradient(90deg, transparent, ${color}, transparent);
  background-size: 60% 100%;
  background-repeat: no-repeat;
  background-position: -60% 0;
  animation: ${cls}-shimmer 1.3s ease-in-out infinite;
}

@keyframes ${cls}-shimmer {
  to { background-position: 160% 0; }
}`,
  },
  {
    id: 'shimmer-lines',
    label: 'Shimmer Lines',
    html: (cls) => `<div class="${cls}"><span></span><span></span><span></span></div>`,
    css: (cls, size, color, track) => {
      const h = Math.max(6, Math.round(size * 0.14));
      const gap = Math.round(size * 0.12);
      return `.${cls} {
  display: flex;
  flex-direction: column;
  gap: ${gap}px;
  width: ${Math.round(size * 2)}px;
}

.${cls} span {
  display: block;
  height: ${h}px;
  border-radius: ${Math.round(h / 2)}px;
  background-color: ${track};
  background-image: linear-gradient(90deg, transparent, ${color}, transparent);
  background-size: 60% 100%;
  background-repeat: no-repeat;
  background-position: -60% 0;
  animation: ${cls}-shimmer 1.3s ease-in-out infinite;
}

.${cls} span:nth-child(1) { width: 100%; animation-delay: 0s; }
.${cls} span:nth-child(2) { width: 80%; animation-delay: 0.1s; }
.${cls} span:nth-child(3) { width: 60%; animation-delay: 0.2s; }

@keyframes ${cls}-shimmer {
  to { background-position: 160% 0; }
}`;
    },
  },

  // --- More rings --------------------------------------------------------------------------

  {
    id: 'soft-ring',
    label: 'Soft Ring',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color, track) => {
      const bw = Math.round(size * 0.14);
      return `.${cls} {
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, ${track}, ${color}, ${track});
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - ${bw}px), #000 calc(100% - ${bw}px));
  mask: radial-gradient(farthest-side, transparent calc(100% - ${bw}px), #000 calc(100% - ${bw}px));
  filter: blur(${Math.max(1, Math.round(size * 0.015))}px);
  animation: ${cls}-spin 1.1s linear infinite;
}

@keyframes ${cls}-spin {
  to { transform: rotate(360deg); }
}`;
    },
  },
  {
    id: 'gradient-ring',
    label: 'Gradient Ring',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color, track) => `.${cls} {
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, ${color}, ${track}, ${color});
  animation: ${cls}-spin 1.6s linear infinite;
}

@keyframes ${cls}-spin {
  to { transform: rotate(360deg); }
}`,
  },
  {
    id: 'ring-segments',
    label: 'Ring Segments',
    html: (cls) => `<div class="${cls}">${Array.from({ length: 8 }, () => '<span></span>').join('')}</div>`,
    css: (cls, size, color) => {
      const segW = Math.round(size * 0.22);
      const segH = Math.max(2, Math.round(size * 0.08));
      const radius = Math.round(size / 2 - segH / 2 - 1);
      const dur = 1.2;
      const count = 8;
      let rules = '';
      for (let i = 0; i < count; i++) {
        const angle = (360 / count) * i;
        const delay = ((dur / count) * i).toFixed(3);
        rules += `.${cls} span:nth-child(${i + 1}) {
  transform: rotate(${angle}deg) translate(0, -${radius}px) rotate(90deg);
  animation-delay: ${delay}s;
}
`;
      }
      return `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
}

.${cls} span {
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${segW}px;
  height: ${segH}px;
  margin: ${Math.round(-segH / 2)}px 0 0 ${Math.round(-segW / 2)}px;
  background: ${color};
  border-radius: ${segH}px;
  animation: ${cls}-tick ${dur}s steps(1, end) infinite;
}

${rules}
@keyframes ${cls}-tick {
  0%, 100% { opacity: 0.15; }
  12% { opacity: 1; }
}`;
    },
  },
  {
    id: 'eclipse',
    label: 'Eclipse',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color, track) => `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  background: ${color};
  overflow: hidden;
}

.${cls}::before {
  content: "";
  position: absolute;
  top: -10%;
  left: -100%;
  width: 100%;
  height: 120%;
  border-radius: 50%;
  background: ${track};
  animation: ${cls}-pass 1.8s ease-in-out infinite;
}

@keyframes ${cls}-pass {
  0% { left: -100%; }
  50% { left: 40%; }
  100% { left: 180%; }
}`,
  },

  // --- Spiral / pinwheel / kaleidoscope ---------------------------------------------------

  {
    id: 'spiral',
    label: 'Spiral',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => `.${cls} {
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, transparent 0deg, ${color} 300deg, transparent 360deg);
  -webkit-mask: radial-gradient(circle, transparent 15%, #000 15%);
  mask: radial-gradient(circle, transparent 15%, #000 15%);
  animation: ${cls}-spin 1s linear infinite;
}

@keyframes ${cls}-spin {
  to { transform: rotate(360deg); }
}`,
  },
  {
    id: 'pinwheel',
    label: 'Pinwheel',
    html: (cls) => `<div class="${cls}"><span></span><span></span><span></span><span></span></div>`,
    css: (cls, size, color) => {
      const bladeSize = Math.round(size * 0.44);
      return `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
  animation: ${cls}-spin 1.3s linear infinite;
}

.${cls} span {
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${bladeSize}px;
  height: ${bladeSize}px;
  margin: ${-bladeSize}px 0 0 0;
  background: ${color};
  border-radius: 100% 0 100% 100%;
  transform-origin: 0 100%;
}

.${cls} span:nth-child(1) { transform: rotate(0deg); }
.${cls} span:nth-child(2) { transform: rotate(90deg); }
.${cls} span:nth-child(3) { transform: rotate(180deg); }
.${cls} span:nth-child(4) { transform: rotate(270deg); }

@keyframes ${cls}-spin {
  to { transform: rotate(360deg); }
}`;
    },
  },
  {
    id: 'kaleidoscope',
    label: 'Kaleidoscope',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color, track) => `.${cls} {
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  background: conic-gradient(
    ${color} 0deg 45deg, ${track} 45deg 90deg,
    ${color} 90deg 135deg, ${track} 135deg 180deg,
    ${color} 180deg 225deg, ${track} 225deg 270deg,
    ${color} 270deg 315deg, ${track} 315deg 360deg
  );
  animation: ${cls}-spin 2.4s linear infinite;
}

@keyframes ${cls}-spin {
  to { transform: rotate(360deg); }
}`,
  },
  {
    id: 'spiral-dots',
    label: 'Spiral Dots',
    html: (cls) => `<div class="${cls}">${Array.from({ length: 6 }, () => '<span></span>').join('')}</div>`,
    css: (cls, size, color) => {
      const count = 6;
      const dur = 1.5;
      let rules = '';
      for (let i = 0; i < count; i++) {
        const angle = i * 70 * (Math.PI / 180);
        const radius = (size / 2) * ((i + 1) / count) * 0.85;
        const x = Math.round(radius * Math.cos(angle));
        const y = Math.round(radius * Math.sin(angle));
        const dotSize = Math.max(3, Math.round(size * 0.1 * (0.6 + (i / count) * 0.6)));
        const delay = ((dur / count) * i).toFixed(3);
        rules += `.${cls} span:nth-child(${i + 1}) {
  width: ${dotSize}px;
  height: ${dotSize}px;
  margin-left: ${Math.round(x - dotSize / 2)}px;
  margin-top: ${Math.round(y - dotSize / 2)}px;
  animation-delay: ${delay}s;
}
`;
      }
      return `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
}

.${cls} span {
  position: absolute;
  top: 50%;
  left: 50%;
  background: ${color};
  border-radius: 50%;
  animation: ${cls}-pulse ${dur}s ease-in-out infinite;
}

${rules}
@keyframes ${cls}-pulse {
  0%, 100% { transform: scale(0.4); opacity: 0.3; }
  50% { transform: scale(1); opacity: 1; }
}`;
    },
  },

  // --- DNA / barber pole / compass / pendulum / clock -------------------------------------

  {
    id: 'dna-helix',
    label: 'DNA Helix',
    html: (cls) =>
      `<div class="${cls}"><span></span><span></span><span></span><span></span><span></span><span></span></div>`,
    css: (cls, size, color, track) => {
      const dotSize = Math.max(3, Math.round(size * 0.12));
      const travel = Math.round(size * 0.3);
      const count = 6;
      const dur = 1.2;
      let rules = '';
      for (let i = 0; i < count; i++) {
        const delay = ((dur / count) * i * 0.5).toFixed(3);
        rules += `.${cls} span:nth-child(${i + 1}) { animation-delay: ${delay}s; background: ${i % 2 === 0 ? color : track}; }\n`;
      }
      return `.${cls} {
  display: flex;
  align-items: center;
  gap: ${Math.round(size * 0.04)}px;
  height: ${size}px;
}

.${cls} span {
  width: ${dotSize}px;
  height: ${dotSize}px;
  border-radius: 50%;
  background: ${color};
  animation: ${cls}-helix 1.2s ease-in-out infinite;
}

${rules}
@keyframes ${cls}-helix {
  0%, 100% { transform: translateY(-${travel}px); }
  50% { transform: translateY(${travel}px); }
}`;
    },
  },
  {
    id: 'barber-pole',
    label: 'Barber Pole',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color, track) => {
      const w = Math.round(size * 0.4);
      const h = size;
      const stripe = Math.max(6, Math.round(w * 0.5));
      const period = Math.round(stripe * 1.41);
      return `.${cls} {
  width: ${w}px;
  height: ${h}px;
  border-radius: ${Math.round(w / 2)}px;
  background-color: ${track};
  background-image: repeating-linear-gradient(
    -45deg,
    ${color} 0,
    ${color} ${Math.round(stripe / 2)}px,
    transparent ${Math.round(stripe / 2)}px,
    transparent ${stripe}px
  );
  background-size: ${period}px ${period}px;
  animation: ${cls}-scroll 0.6s linear infinite;
}

@keyframes ${cls}-scroll {
  to { background-position: 0 ${period}px; }
}`;
    },
  },
  {
    id: 'compass',
    label: 'Compass',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color, track) => {
      const needleH = Math.round(size * 0.38);
      const needleW = Math.max(2, Math.round(size * 0.05));
      return `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  border: ${Math.max(1, Math.round(size / 30))}px solid ${track};
}

.${cls}::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: ${needleW}px;
  height: ${needleH}px;
  margin: ${-needleH}px 0 0 ${Math.round(-needleW / 2)}px;
  background: ${color};
  border-radius: ${needleW}px;
  transform-origin: 50% 100%;
  animation: ${cls}-wobble 2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
}

@keyframes ${cls}-wobble {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(100deg); }
  50% { transform: rotate(180deg); }
  75% { transform: rotate(290deg); }
  100% { transform: rotate(360deg); }
}`;
    },
  },
  {
    id: 'pendulum',
    label: 'Pendulum',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color, track) => {
      const rodLen = Math.round(size * 0.42);
      const bobSize = Math.round(size * 0.22);
      const pivotFromBob = Math.round(-(rodLen - bobSize / 2));
      return `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
}

.${cls}::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 0;
  width: 2px;
  height: ${rodLen}px;
  background: ${track};
  transform-origin: top center;
  animation: ${cls}-swing 1.4s ease-in-out infinite;
}

.${cls}::after {
  content: "";
  position: absolute;
  left: 50%;
  top: ${rodLen - bobSize / 2}px;
  width: ${bobSize}px;
  height: ${bobSize}px;
  margin-left: ${Math.round(-bobSize / 2)}px;
  background: ${color};
  border-radius: 50%;
  transform-origin: 50% ${pivotFromBob}px;
  animation: ${cls}-swing 1.4s ease-in-out infinite;
}

@keyframes ${cls}-swing {
  0%, 100% { transform: rotate(-35deg); }
  50% { transform: rotate(35deg); }
}`;
    },
  },
  {
    id: 'clock-hands',
    label: 'Clock Hands',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color, track) => {
      const longLen = Math.round(size * 0.38);
      const shortLen = Math.round(size * 0.26);
      const w = Math.max(2, Math.round(size * 0.04));
      return `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  border: ${Math.max(1, Math.round(size / 30))}px solid ${track};
}

.${cls}::before,
.${cls}::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: ${w}px;
  background: ${color};
  border-radius: ${w}px;
  transform-origin: 50% 100%;
}

.${cls}::before {
  height: ${longLen}px;
  margin: ${-longLen}px 0 0 ${Math.round(-w / 2)}px;
  animation: ${cls}-spin 2s linear infinite;
}

.${cls}::after {
  height: ${shortLen}px;
  margin: ${-shortLen}px 0 0 ${Math.round(-w / 2)}px;
  opacity: 0.6;
  animation: ${cls}-spin 3s linear infinite reverse;
}

@keyframes ${cls}-spin {
  to { transform: rotate(360deg); }
}`;
    },
  },

  // --- Squares / shapes expanding ----------------------------------------------------------

  {
    id: 'concentric-squares',
    label: 'Concentric Squares',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
}

.${cls}::before,
.${cls}::after {
  content: "";
  position: absolute;
  inset: 0;
  border: ${Math.max(2, Math.round(size / 16))}px solid ${color};
  border-radius: 12%;
  animation: ${cls}-ripple 1.4s ease-out infinite;
}

.${cls}::after {
  animation-delay: 0.7s;
}

@keyframes ${cls}-ripple {
  0% { transform: scale(0.2); opacity: 1; }
  100% { transform: scale(1); opacity: 0; }
}`,
  },
  {
    id: 'corner-dots',
    label: 'Corner Dots',
    html: (cls) => `<div class="${cls}"><span></span><span></span><span></span><span></span></div>`,
    css: (cls, size, color) => {
      const dotSize = Math.round(size * 0.2);
      return `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
}

.${cls} span {
  position: absolute;
  width: ${dotSize}px;
  height: ${dotSize}px;
  background: ${color};
  border-radius: 50%;
  animation: ${cls}-blink 1.2s ease-in-out infinite;
}

.${cls} span:nth-child(1) { top: 0; left: 0; animation-delay: 0s; }
.${cls} span:nth-child(2) { top: 0; right: 0; animation-delay: 0.2s; }
.${cls} span:nth-child(3) { bottom: 0; right: 0; animation-delay: 0.4s; }
.${cls} span:nth-child(4) { bottom: 0; left: 0; animation-delay: 0.6s; }

@keyframes ${cls}-blink {
  0%, 100% { opacity: 0.2; transform: scale(0.7); }
  50% { opacity: 1; transform: scale(1); }
}`;
    },
  },
  {
    id: 'accordion-bars',
    label: 'Accordion Bars',
    html: (cls) => `<div class="${cls}"><span></span><span></span><span></span><span></span><span></span></div>`,
    css: (cls, size, color) => {
      const h = Math.round(size * 0.6);
      const count = 5;
      const dur = 1.2;
      let rules = '';
      for (let i = 0; i < count; i++) {
        rules += `.${cls} span:nth-child(${i + 1}) { animation-delay: ${((dur / count) * i).toFixed(3)}s; }\n`;
      }
      return `.${cls} {
  display: flex;
  align-items: center;
  height: ${size}px;
}

.${cls} span {
  width: ${Math.round(size * 0.14)}px;
  height: ${h}px;
  background: ${color};
  margin: 0 1px;
  animation: ${cls}-squeeze ${dur}s ease-in-out infinite;
  transform-origin: center;
}

${rules}
@keyframes ${cls}-squeeze {
  0%, 100% { transform: scaleX(1); }
  50% { transform: scaleX(0.3); }
}`;
    },
  },
  {
    id: 'heart-pulse',
    label: 'Heart Pulse',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => {
      const unit = Math.round(size * 0.3);
      return `.${cls} {
  position: relative;
  width: ${unit * 2}px;
  height: ${unit * 2}px;
  background: ${color};
  transform: rotate(-45deg);
  animation: ${cls}-beat 1.1s ease-in-out infinite;
}

.${cls}::before,
.${cls}::after {
  content: "";
  position: absolute;
  width: ${unit}px;
  height: ${unit}px;
  border-radius: 50%;
  background: ${color};
}

.${cls}::before {
  top: ${-unit / 2}px;
  left: 0;
}

.${cls}::after {
  top: 0;
  left: ${unit / 2}px;
}

@keyframes ${cls}-beat {
  0%, 100% { transform: rotate(-45deg) scale(1); }
  25% { transform: rotate(-45deg) scale(1.15); }
  50% { transform: rotate(-45deg) scale(1); }
}`;
    },
  },

  // --- More orbit / trails -------------------------------------------------------------------

  {
    id: 'orbit-trail',
    label: 'Orbit Trail',
    html: (cls) => `<div class="${cls}"><span></span><span></span><span></span><span></span></div>`,
    css: (cls, size, color) => {
      const dotSize = Math.max(3, Math.round(size * 0.2));
      const dur = 1.1;
      const count = 4;
      let rules = '';
      for (let i = 0; i < count; i++) {
        const scale = 1 - i * 0.2;
        const opacity = 1 - i * 0.22;
        rules += `.${cls} span:nth-child(${i + 1}) {
  width: ${Math.round(dotSize * scale)}px;
  height: ${Math.round(dotSize * scale)}px;
  margin-left: ${Math.round((-dotSize * scale) / 2)}px;
  opacity: ${opacity.toFixed(2)};
  animation-delay: ${(-(dur / count) * i).toFixed(3)}s;
}
`;
      }
      return `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
}

.${cls} span {
  position: absolute;
  top: 0;
  left: 50%;
  background: ${color};
  border-radius: 50%;
  transform-origin: 50% ${Math.round(size / 2)}px;
  animation: ${cls}-spin ${dur}s linear infinite;
}

${rules}
@keyframes ${cls}-spin {
  to { transform: rotate(360deg); }
}`;
    },
  },
  {
    id: 'figure-eight-dots',
    label: 'Figure Eight Dots',
    html: (cls) => `<div class="${cls}"><span></span><span></span><span></span></div>`,
    css: (cls, size, color) => {
      const dotSize = Math.round(size * 0.14);
      const half = Math.round(size * 0.32);
      const dur = 2;
      return `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${Math.round(size * 0.6)}px;
}

.${cls} span {
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${dotSize}px;
  height: ${dotSize}px;
  margin: ${Math.round(-dotSize / 2)}px;
  background: ${color};
  border-radius: 50%;
  animation: ${cls}-infinity ${dur}s linear infinite;
}

.${cls} span:nth-child(1) { animation-delay: 0s; }
.${cls} span:nth-child(2) { animation-delay: ${(-dur / 3).toFixed(3)}s; opacity: 0.6; }
.${cls} span:nth-child(3) { animation-delay: ${((-dur * 2) / 3).toFixed(3)}s; opacity: 0.35; }

@keyframes ${cls}-infinity {
  0%    { transform: translate(0, 0); }
  12.5% { transform: translate(${half}px, ${Math.round(-half * 0.6)}px); }
  25%   { transform: translate(${half * 2}px, 0); }
  37.5% { transform: translate(${half}px, ${Math.round(half * 0.6)}px); }
  50%   { transform: translate(0, 0); }
  62.5% { transform: translate(${-half}px, ${Math.round(-half * 0.6)}px); }
  75%   { transform: translate(${-half * 2}px, 0); }
  87.5% { transform: translate(${-half}px, ${Math.round(half * 0.6)}px); }
  100%  { transform: translate(0, 0); }
}`;
    },
  },
  {
    id: 'converge',
    label: 'Converge',
    html: (cls) => `<div class="${cls}"><span></span><span></span><span></span><span></span></div>`,
    css: (cls, size, color) => {
      const dotSize = Math.round(size * 0.18);
      const offset = Math.round(size / 2 - dotSize / 2);
      return `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
}

.${cls} span {
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${dotSize}px;
  height: ${dotSize}px;
  margin: ${Math.round(-dotSize / 2)}px;
  background: ${color};
  border-radius: 50%;
  animation-duration: 1s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

.${cls} span:nth-child(1) { animation-name: ${cls}-tl; }
.${cls} span:nth-child(2) { animation-name: ${cls}-tr; }
.${cls} span:nth-child(3) { animation-name: ${cls}-br; }
.${cls} span:nth-child(4) { animation-name: ${cls}-bl; }

@keyframes ${cls}-tl {
  0%, 100% { transform: translate(${-offset}px, ${-offset}px); }
  50% { transform: translate(0, 0); }
}

@keyframes ${cls}-tr {
  0%, 100% { transform: translate(${offset}px, ${-offset}px); }
  50% { transform: translate(0, 0); }
}

@keyframes ${cls}-br {
  0%, 100% { transform: translate(${offset}px, ${offset}px); }
  50% { transform: translate(0, 0); }
}

@keyframes ${cls}-bl {
  0%, 100% { transform: translate(${-offset}px, ${offset}px); }
  50% { transform: translate(0, 0); }
}`;
    },
  },
  {
    id: 'satellite',
    label: 'Satellite',
    html: (cls) => `<div class="${cls}"><span></span></div>`,
    css: (cls, size, color, track) => {
      const centerSize = Math.round(size * 0.5);
      const dotSize = Math.max(3, Math.round(size * 0.16));
      return `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
}

.${cls}::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${centerSize}px;
  height: ${centerSize}px;
  margin: ${Math.round(-centerSize / 2)}px;
  background: ${track};
  border-radius: 50%;
}

.${cls} span {
  position: absolute;
  top: 0;
  left: 50%;
  width: ${dotSize}px;
  height: ${dotSize}px;
  margin-left: ${Math.round(-dotSize / 2)}px;
  background: ${color};
  border-radius: 50%;
  transform-origin: 50% ${Math.round(size / 2)}px;
  animation: ${cls}-spin 1.4s linear infinite;
}

@keyframes ${cls}-spin {
  to { transform: rotate(360deg); }
}`;
    },
  },

  // --- More bars / progress -----------------------------------------------------------------

  {
    id: 'bars-fade',
    label: 'Bars Fade',
    html: (cls) => `<div class="${cls}"><span></span><span></span><span></span><span></span></div>`,
    css: (cls, size, color) => `.${cls} {
  display: flex;
  align-items: center;
  gap: ${Math.round(size * 0.1)}px;
  height: ${size}px;
}

.${cls} span {
  width: ${Math.max(2, Math.round(size * 0.12))}px;
  height: 100%;
  background: ${color};
  border-radius: 2px;
  animation: ${cls}-fade 1.1s ease-in-out infinite;
}

.${cls} span:nth-child(1) { animation-delay: 0s; }
.${cls} span:nth-child(2) { animation-delay: 0.15s; }
.${cls} span:nth-child(3) { animation-delay: 0.3s; }
.${cls} span:nth-child(4) { animation-delay: 0.45s; }

@keyframes ${cls}-fade {
  0%, 100% { opacity: 0.15; }
  50% { opacity: 1; }
}`,
  },
  {
    id: 'progress-dual',
    label: 'Dual Progress',
    html: (cls) => `<div class="${cls}"><span></span><span></span></div>`,
    css: (cls, size, color, track) => {
      const h = Math.max(4, Math.round(size * 0.14));
      const w = Math.round(size * 1.8);
      return `.${cls} {
  position: relative;
  width: ${w}px;
  height: ${h}px;
  background: ${track};
  border-radius: ${Math.round(h / 2)}px;
  overflow: hidden;
}

.${cls} span {
  position: absolute;
  top: 0;
  height: 100%;
  width: 25%;
  background: ${color};
  border-radius: ${Math.round(h / 2)}px;
  animation: ${cls}-chase 1.4s linear infinite;
}

.${cls} span:nth-child(2) {
  animation-delay: 0.7s;
  opacity: 0.6;
}

@keyframes ${cls}-chase {
  0% { left: -25%; }
  100% { left: 100%; }
}`;
    },
  },
  {
    id: 'steps',
    label: 'Steps',
    html: (cls) => `<div class="${cls}"><span></span><span></span><span></span><span></span><span></span></div>`,
    css: (cls, size, color, track) => {
      const h = Math.max(6, Math.round(size * 0.3));
      const segW = Math.round(size * 0.3);
      const count = 5;
      const dur = 1.5;
      let rules = '';
      for (let i = 0; i < count; i++) {
        rules += `.${cls} span:nth-child(${i + 1}) { animation-delay: ${((dur / count) * i).toFixed(3)}s; }\n`;
      }
      return `.${cls} {
  display: flex;
  gap: ${Math.round(size * 0.04)}px;
}

.${cls} span {
  width: ${segW}px;
  height: ${h}px;
  background: ${track};
  border-radius: 2px;
  animation: ${cls}-fill ${dur}s steps(1, end) infinite;
}

${rules}
@keyframes ${cls}-fill {
  0% { background: ${color}; }
  20% { background: ${color}; }
  20.01% { background: ${track}; }
  100% { background: ${track}; }
}`;
    },
  },
  {
    id: 'equalizer-circle',
    label: 'Circle Equalizer',
    html: (cls) => `<div class="${cls}">${Array.from({ length: 10 }, () => '<span></span>').join('')}</div>`,
    css: (cls, size, color) => {
      const barW = Math.max(2, Math.round(size * 0.05));
      const barH = Math.round(size * 0.2);
      const radius = Math.round(size / 2 - barH / 2 - 1);
      const count = 10;
      const durations = [0.6, 0.8, 0.5, 0.9, 0.7, 0.55, 0.85, 0.65, 0.75, 0.6];
      let rules = '';
      for (let i = 0; i < count; i++) {
        const angle = (360 / count) * i;
        rules += `.${cls} span:nth-child(${i + 1}) {
  transform: rotate(${angle}deg) translate(0, -${radius}px);
  animation-duration: ${durations[i % durations.length]}s;
}
`;
      }
      return `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
}

.${cls} span {
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${barW}px;
  height: ${barH}px;
  margin: ${Math.round(-barH / 2)}px 0 0 ${Math.round(-barW / 2)}px;
  background: ${color};
  border-radius: ${barW}px;
  animation-name: ${cls}-tick;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

${rules}
@keyframes ${cls}-tick {
  0%, 100% { opacity: 0.25; }
  50% { opacity: 1; }
}`;
    },
  },

  // --- More shapes -----------------------------------------------------------------------------

  {
    id: 'hexagon-rotate',
    label: 'Hexagon Rotate',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => `.${cls} {
  width: ${Math.round(size * 0.8)}px;
  height: ${Math.round(size * 0.8)}px;
  background: ${color};
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  animation: ${cls}-spin 1.5s linear infinite;
}

@keyframes ${cls}-spin {
  to { transform: rotate(360deg); }
}`,
  },
  {
    id: 'pentagon-pulse',
    label: 'Pentagon Pulse',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => `.${cls} {
  width: ${Math.round(size * 0.75)}px;
  height: ${Math.round(size * 0.75)}px;
  background: ${color};
  clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
  animation: ${cls}-pulse 1.1s ease-in-out infinite;
}

@keyframes ${cls}-pulse {
  0%, 100% { transform: scale(0.7); opacity: 0.6; }
  50% { transform: scale(1); opacity: 1; }
}`,
  },
  {
    id: 'blob',
    label: 'Blob',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => `.${cls} {
  width: ${Math.round(size * 0.75)}px;
  height: ${Math.round(size * 0.75)}px;
  background: ${color};
  animation: ${cls}-morph 2.5s ease-in-out infinite;
}

@keyframes ${cls}-morph {
  0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
}`,
  },
  {
    id: 'star-pulse',
    label: 'Star Pulse',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => `.${cls} {
  width: ${Math.round(size * 0.8)}px;
  height: ${Math.round(size * 0.8)}px;
  background: ${color};
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  animation: ${cls}-pulse 1.3s ease-in-out infinite;
}

@keyframes ${cls}-pulse {
  0%, 100% { transform: scale(0.75) rotate(0deg); }
  50% { transform: scale(1) rotate(20deg); }
}`,
  },
  {
    id: 'cross-spin',
    label: 'Cross Spin',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => `.${cls} {
  width: ${Math.round(size * 0.75)}px;
  height: ${Math.round(size * 0.75)}px;
  background: ${color};
  clip-path: polygon(35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0% 65%, 0% 35%, 35% 35%);
  animation: ${cls}-spin 1.4s linear infinite;
}

@keyframes ${cls}-spin {
  to { transform: rotate(360deg); }
}`,
  },
  {
    id: 'ring-square-morph',
    label: 'Ring Square Morph',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => `.${cls} {
  width: ${Math.round(size * 0.7)}px;
  height: ${Math.round(size * 0.7)}px;
  border: ${borderWidth(size)}px solid ${color};
  animation: ${cls}-morph 1.8s ease-in-out infinite;
}

@keyframes ${cls}-morph {
  0%, 100% { border-radius: 50%; transform: rotate(0deg); }
  50% { border-radius: 10%; transform: rotate(180deg); }
}`,
  },
  {
    id: 'morph-shape',
    label: 'Morph Shape',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => `.${cls} {
  width: ${Math.round(size * 0.7)}px;
  height: ${Math.round(size * 0.7)}px;
  background: ${color};
  animation: ${cls}-morph 1.6s ease-in-out infinite;
}

@keyframes ${cls}-morph {
  0%, 100% { clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%); }
  50% { clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); }
}`,
  },
  {
    id: 'nested-squares',
    label: 'Nested Squares',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color, track) => `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
  border: ${borderWidth(size)}px solid ${color};
  animation: ${cls}-spin 1.6s linear infinite;
}

.${cls}::before,
.${cls}::after {
  content: "";
  position: absolute;
  border: ${borderWidth(size)}px solid ${track};
}

.${cls}::before {
  inset: ${Math.round(size * 0.16)}px;
  animation: ${cls}-spin-reverse 1.1s linear infinite;
}

.${cls}::after {
  inset: ${Math.round(size * 0.32)}px;
  border-color: ${color};
  opacity: 0.6;
  animation: ${cls}-spin 0.8s linear infinite;
}

@keyframes ${cls}-spin {
  to { transform: rotate(360deg); }
}

@keyframes ${cls}-spin-reverse {
  to { transform: rotate(-360deg); }
}`,
  },

  // --- More ripple / bounce / 3D / misc -----------------------------------------------------

  {
    id: 'bounce-squash',
    label: 'Squash Bounce',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => {
      const dotSize = Math.round(size * 0.4);
      const travel = Math.round(size * 0.55);
      return `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
}

.${cls}::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 0;
  width: ${dotSize}px;
  height: ${dotSize}px;
  margin-left: ${Math.round(-dotSize / 2)}px;
  background: ${color};
  border-radius: 50%;
  animation: ${cls}-bounce 0.7s cubic-bezier(0.5, 0, 1, 0.5) infinite alternate;
}

@keyframes ${cls}-bounce {
  0% { transform: translateY(0) scale(1, 1); }
  90% { transform: translateY(${travel}px) scale(1, 1); }
  95% { transform: translateY(${travel}px) scale(1.3, 0.7); }
  100% { transform: translateY(${travel}px) scale(1.3, 0.7); }
}`;
    },
  },
  {
    id: 'wave-arc',
    label: 'Wave Arc',
    html: (cls) => `<div class="${cls}">${Array.from({ length: 7 }, () => '<i><span></span></i>').join('')}</div>`,
    css: (cls, size, color) => {
      const barW = Math.max(2, Math.round(size * 0.06));
      const barH = Math.round(size * 0.3);
      const radius = Math.round(size * 0.45);
      const count = 7;
      const spread = 140;
      const start = -spread / 2;
      let rules = '';
      for (let i = 0; i < count; i++) {
        const angle = start + (spread / (count - 1)) * i;
        rules += `.${cls} i:nth-child(${i + 1}) {
  transform: rotate(${angle.toFixed(1)}deg) translate(0, -${radius}px);
}
.${cls} i:nth-child(${i + 1}) span {
  animation-delay: ${(i * 0.08).toFixed(3)}s;
}
`;
      }
      return `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
}

.${cls} i {
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${barW}px;
  height: ${barH}px;
  margin: ${Math.round(-barH / 2)}px 0 0 ${Math.round(-barW / 2)}px;
  display: block;
}

.${cls} i span {
  display: block;
  width: 100%;
  height: 100%;
  background: ${color};
  border-radius: ${barW}px;
  animation: ${cls}-wave 1s ease-in-out infinite;
}

${rules}
@keyframes ${cls}-wave {
  0%, 100% { transform: scale(1, 0.4); }
  50% { transform: scale(1, 1); }
}`;
    },
  },
  {
    id: 'tilt-ring',
    label: 'Tilt Ring',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => `.${cls} {
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  border: ${borderWidth(size)}px solid transparent;
  border-top-color: ${color};
  border-bottom-color: ${color};
  transform: perspective(${size * 2}px) rotateX(60deg);
  animation: ${cls}-spin 0.9s linear infinite;
}

@keyframes ${cls}-spin {
  to { transform: perspective(${size * 2}px) rotateX(60deg) rotateZ(360deg); }
}`,
  },
  {
    id: 'coin-flip',
    label: 'Coin Flip',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color, track) => `.${cls} {
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  background: ${color};
  animation: ${cls}-flip 1s ease-in-out infinite;
}

@keyframes ${cls}-flip {
  0% { transform: scaleX(1); background: ${color}; }
  50% { transform: scaleX(0); background: ${track}; }
  100% { transform: scaleX(1); background: ${color}; }
}`,
  },
  {
    id: 'propeller',
    label: 'Propeller',
    html: (cls) => `<div class="${cls}"><span></span><span></span><span></span></div>`,
    css: (cls, size, color) => {
      const bladeLen = Math.round(size * 0.46);
      const bladeW = Math.max(3, Math.round(size * 0.12));
      return `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
  animation: ${cls}-spin 0.5s linear infinite;
}

.${cls} span {
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${bladeW}px;
  height: ${bladeLen}px;
  margin: ${-bladeLen}px 0 0 ${Math.round(-bladeW / 2)}px;
  background: ${color};
  border-radius: 50% 50% 50% 50% / 60% 60% 10% 10%;
  transform-origin: 50% 100%;
}

.${cls} span:nth-child(1) { transform: rotate(0deg); }
.${cls} span:nth-child(2) { transform: rotate(120deg); }
.${cls} span:nth-child(3) { transform: rotate(240deg); }

@keyframes ${cls}-spin {
  to { transform: rotate(360deg); }
}`;
    },
  },
  {
    id: 'orbit-ring',
    label: 'Orbit Ring',
    html: (cls) => `<div class="${cls}"><span></span></div>`,
    css: (cls, size, color, track) => `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
}

.${cls}::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: ${Math.max(1, Math.round(size / 25))}px solid ${track};
}

.${cls} span {
  position: absolute;
  top: 0;
  left: 50%;
  width: ${Math.round(size * 0.16)}px;
  height: ${Math.round(size * 0.16)}px;
  margin-left: ${Math.round(-size * 0.08)}px;
  margin-top: ${Math.round(-size * 0.08)}px;
  background: ${color};
  border-radius: 50%;
  transform-origin: 50% ${Math.round(size / 2 + size * 0.08)}px;
  animation: ${cls}-spin 1.3s linear infinite;
}

@keyframes ${cls}-spin {
  to { transform: rotate(360deg); }
}`,
  },
  {
    id: 'zigzag-dots',
    label: 'Zigzag Dots',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => {
      const dotSize = Math.round(size * 0.2);
      const half = Math.round(size * 0.35);
      const vTravel = Math.round(size * 0.3);
      return `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
}

.${cls}::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${dotSize}px;
  height: ${dotSize}px;
  margin: ${Math.round(-dotSize / 2)}px;
  background: ${color};
  border-radius: 50%;
  animation: ${cls}-zigzag 1.4s ease-in-out infinite;
}

@keyframes ${cls}-zigzag {
  0%   { transform: translate(${-half}px, ${-vTravel}px); }
  25%  { transform: translate(${Math.round(-half / 2)}px, ${vTravel}px); }
  50%  { transform: translate(0, ${-vTravel}px); }
  75%  { transform: translate(${Math.round(half / 2)}px, ${vTravel}px); }
  100% { transform: translate(${half}px, ${-vTravel}px); }
}`;
    },
  },
  {
    id: 'ripple-center-dot',
    label: 'Ripple Center Dot',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => {
      const dotSize = Math.round(size * 0.22);
      return `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
}

.${cls}::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${dotSize}px;
  height: ${dotSize}px;
  margin: ${Math.round(-dotSize / 2)}px;
  background: ${color};
  border-radius: 50%;
}

.${cls}::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${dotSize}px;
  height: ${dotSize}px;
  margin: ${Math.round(-dotSize / 2)}px;
  border: 2px solid ${color};
  border-radius: 50%;
  animation: ${cls}-ripple 1.3s ease-out infinite;
}

@keyframes ${cls}-ripple {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(${Math.max(2, Math.round(size / dotSize))}); opacity: 0; }
}`;
    },
  },
  {
    id: 'corner-squares',
    label: 'Corner Squares',
    html: (cls) => `<div class="${cls}"><span></span><span></span><span></span><span></span></div>`,
    css: (cls, size, color) => {
      const sq = Math.round(size * 0.26);
      return `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
}

.${cls} span {
  position: absolute;
  width: ${sq}px;
  height: ${sq}px;
  background: ${color};
  border-radius: 2px;
  animation: ${cls}-pulse 1.1s ease-in-out infinite;
}

.${cls} span:nth-child(1) { top: 0; left: 0; animation-delay: 0s; }
.${cls} span:nth-child(2) { top: 0; right: 0; animation-delay: 0.1s; }
.${cls} span:nth-child(3) { bottom: 0; right: 0; animation-delay: 0.2s; }
.${cls} span:nth-child(4) { bottom: 0; left: 0; animation-delay: 0.3s; }

@keyframes ${cls}-pulse {
  0%, 100% { transform: scale(0.5) rotate(0deg); opacity: 0.4; }
  50% { transform: scale(1) rotate(45deg); opacity: 1; }
}`;
    },
  },
  {
    id: 'blink-ring',
    label: 'Blink Ring',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => `.${cls} {
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  border: ${borderWidth(size)}px solid ${color};
  animation: ${cls}-blink 1s steps(1, end) infinite;
}

@keyframes ${cls}-blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0.15; }
}`,
  },
  {
    id: 'bouncing-pill',
    label: 'Bouncing Pill',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => {
      const w = Math.round(size * 0.3);
      const h = Math.round(size * 0.55);
      const travel = Math.round(size * 0.4);
      return `.${cls} {
  position: relative;
  width: ${size}px;
  height: ${size}px;
}

.${cls}::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 0;
  width: ${w}px;
  height: ${h}px;
  margin-left: ${Math.round(-w / 2)}px;
  background: ${color};
  border-radius: ${Math.round(w / 2)}px;
  animation: ${cls}-bounce 0.7s ease-in-out infinite;
}

@keyframes ${cls}-bounce {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(${travel}px) rotate(180deg); }
}`;
    },
  },
  {
    id: 'ring-wobble',
    label: 'Ring Wobble',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => `.${cls} {
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  border: ${borderWidth(size)}px solid ${color};
  animation: ${cls}-wobble 1.2s ease-in-out infinite;
}

@keyframes ${cls}-wobble {
  0%, 100% { transform: skew(0deg, 0deg) scale(1); }
  25% { transform: skew(8deg, 4deg) scale(1.05, 0.95); }
  50% { transform: skew(0deg, 0deg) scale(0.95, 1.05); }
  75% { transform: skew(-8deg, -4deg) scale(1.05, 0.95); }
}`,
  },
  {
    id: 'triangle-pulse',
    label: 'Triangle Pulse',
    html: (cls) => `<div class="${cls}"></div>`,
    css: (cls, size, color) => {
      const half = Math.round(size * 0.5);
      return `.${cls} {
  width: 0;
  height: 0;
  border-left: ${half}px solid transparent;
  border-right: ${half}px solid transparent;
  border-bottom: ${Math.round(size * 0.87)}px solid ${color};
  animation: ${cls}-pulse 1.1s ease-in-out infinite;
}

@keyframes ${cls}-pulse {
  0%, 100% { transform: scale(0.6); opacity: 0.5; }
  50% { transform: scale(1); opacity: 1; }
}`;
    },
  },
];

const THUMB_SIZE = 28;

// ---------------------------------------------------------------------------------------------
// HTML/CSS output boxes: editable, syntax-highlighted, with in-place Beautify/Minify actions —
// same editor shape (line-number gutter + highlighted backdrop behind an invisible-text
// textarea) as JSON/XML Formatter, and the same Beautify/Minify-as-action-button pattern as
// those two formatters' INPUT panes (json-formatter.ts's beautifyInput()/minifyInput()).
// ---------------------------------------------------------------------------------------------

/** [1, 2, ...N] for N lines in `text` — always at least [1], so an empty textarea still shows
 *  a line-1 gutter marker instead of an empty one. Same shape as JSON/XML Formatter's own
 *  (each has its own local copy too — this one isn't extracted to a shared module for the same
 *  reason theirs aren't: three tiny, stable, independent copies cost less than the coupling a
 *  shared import would add for something this small). */
function lineNumbersFor(text: string): number[] {
  const count = text ? text.split('\n').length : 1;
  return Array.from({ length: count }, (_, i) => i + 1);
}

function minifyHtmlSnippet(html: string): string {
  return html.replace(/>\s+</g, '><').trim();
}

/** Re-indents arbitrary (possibly minified or hand-edited) HTML by parsing it with the browser's
 *  own forgiving HTML parser and walking the resulting real DOM — same "let the browser's own
 *  parser do the hard part" idea as String Codec's HTML-entity decoder — rather than a regex
 *  pretty-printer, which would need to understand nesting itself. Never throws: a detached,
 *  never-appended <div>'s innerHTML always parses as inert markup, no matter how malformed. */
function beautifyHtmlSnippet(html: string): string {
  const container = document.createElement('div');
  container.innerHTML = html.trim();
  const lines: string[] = [];
  collectHtmlLines(container, 0, lines);
  return lines.join('\n');
}

function collectHtmlLines(node: Element, depth: number, lines: string[]): void {
  const indent = '  '.repeat(depth);
  for (const child of Array.from(node.children)) {
    const attrs = Array.from(child.attributes)
      .map((a) => ` ${a.name}="${a.value}"`)
      .join('');
    const tag = child.tagName.toLowerCase();
    if (child.children.length === 0) {
      lines.push(`${indent}<${tag}${attrs}></${tag}>`);
    } else {
      lines.push(`${indent}<${tag}${attrs}>`);
      collectHtmlLines(child, depth + 1, lines);
      lines.push(`${indent}</${tag}>`);
    }
  }
}

/** Strips comments, collapses all whitespace/newlines to nothing, and trims the space around
 *  structural punctuation — a regex pass rather than a real parser, same "doesn't need to be a
 *  full parser, just has to look right on the kind of CSS this tool itself generates" spirit as
 *  the JSON/XML tokenizers elsewhere in this app. */
function minifyCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s*\n\s*/g, ' ')
    .replace(/\s*([{}:;,])\s*/g, '$1')
    .replace(/;}/g, '}')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/** Re-indents arbitrary (possibly minified or hand-edited) CSS by first normalizing it down to
 *  minifyCss()'s compact baseline, then re-expanding: a newline after every `{`/`}`/`;`, indented
 *  by brace depth, with a space re-added after the first `:` of each declaration line (but never
 *  touching a selector line like `::before {` — `:: before {` would be invalid CSS, so the
 *  colon-spacing step only ever runs on lines that are NOT selector/at-rule lines). */
function beautifyCss(css: string): string {
  const compact = minifyCss(css);
  const rawLines = compact
    .replace(/\{/g, ' {\n')
    .replace(/\}/g, '\n}\n')
    .replace(/;/g, ';\n')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  let depth = 0;
  const out: string[] = [];
  for (const line of rawLines) {
    const spaced = line.replace(/,(?!\s)/g, ', ');
    if (spaced === '}') {
      depth = Math.max(0, depth - 1);
      out.push('  '.repeat(depth) + spaced);
      continue;
    }
    const indent = '  '.repeat(depth);
    if (spaced.endsWith('{')) {
      out.push(indent + spaced);
      depth++;
      continue;
    }
    const colonIndex = spaced.indexOf(':');
    const formatted =
      colonIndex === -1 ? spaced : `${spaced.slice(0, colonIndex)}: ${spaced.slice(colonIndex + 1)}`;
    out.push(indent + formatted);
  }
  return out.join('\n');
}

type CssTokenType =
  | 'comment'
  | 'string'
  | 'number'
  | 'at-rule'
  | 'function'
  | 'property'
  | 'selector'
  | 'value'
  | 'punct'
  | 'text';

// One token at a time: a comment, a quoted string, an @-keyword, a hex color, a number (with an
// optional unit/%), a bare identifier (selector/property/value/function name — which one is
// decided afterward, by lookahead, same approach as JSON Formatter's classify()), structural
// punctuation, or whitespace.
const CSS_TOKEN_PATTERN =
  /\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|@[a-zA-Z-]+|#[0-9a-fA-F]{3,8}\b|-?\d+\.?\d*[a-zA-Z%]*|[a-zA-Z_-][a-zA-Z0-9_-]*|[{}:;,()]|\s+/g;

/** A bare identifier's role can't be known from the token itself — "ring" could be a selector, a
 *  property, or a value keyword — so, like JSON Formatter's key-vs-string classify(), this peeks
 *  at what immediately follows (ignoring whitespace) in the ORIGINAL source: `(` means it's a
 *  function call, `{` means it's introducing a rule (a selector, or an at-rule's own name), `:`
 *  means it's a property name starting a declaration, and anything else (`;`, `,`, another word,
 *  end of input) means it's part of a value. */
function classifyCssToken(text: string, restOfSource: string): CssTokenType {
  if (/^\s+$/.test(text)) {
    return 'text';
  }
  if (text.startsWith('/*')) {
    return 'comment';
  }
  if (text.startsWith('"') || text.startsWith("'")) {
    return 'string';
  }
  if (text.startsWith('@')) {
    return 'at-rule';
  }
  if (text.startsWith('#')) {
    return 'number';
  }
  if (/^[{}:;,()]$/.test(text)) {
    return 'punct';
  }
  if (/^-?\d/.test(text)) {
    return 'number';
  }
  if (/^\s*\(/.test(restOfSource)) {
    return 'function';
  }
  if (/^\s*\{/.test(restOfSource)) {
    return 'selector';
  }
  if (/^\s*:/.test(restOfSource)) {
    return 'property';
  }
  return 'value';
}

/** Renders `source` as syntax-highlighted HTML for the generated-CSS output box — a hand-written
 *  tokenizer rather than a library, same rationale as JSON/XML Formatter's own highlighters. */
function highlightCss(source: string): string {
  if (!source) {
    return '';
  }
  let html = '';
  let lastIndex = 0;
  CSS_TOKEN_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = CSS_TOKEN_PATTERN.exec(source))) {
    if (match.index > lastIndex) {
      html += escapeHtml(source.slice(lastIndex, match.index));
    }
    const text = match[0];
    const type = classifyCssToken(text, source.slice(CSS_TOKEN_PATTERN.lastIndex));
    html += type === 'text' ? escapeHtml(text) : `<span class="css-${type}">${escapeHtml(text)}</span>`;
    lastIndex = CSS_TOKEN_PATTERN.lastIndex;
  }
  if (lastIndex < source.length) {
    html += escapeHtml(source.slice(lastIndex));
  }
  return html;
}

@Component({
  imports: [Button, FormsModule, PageHeader],
  selector: 'sap-loading-indicator',
  styleUrl: './loading-indicator.scss',
  templateUrl: './loading-indicator.html',
})
export class LoadingIndicator implements OnDestroy {
  readonly designs = DESIGNS;

  readonly selectedId = signal('ring');
  readonly color = signal('#3366ff');
  readonly size = signal(48);
  readonly previewDark = signal(false);

  readonly copiedHtml = signal(false);
  readonly copiedCss = signal(false);

  /** The box's CURRENT (possibly hand-edited) content — this, not the pure generator output,
   *  drives both the editable textareas and the live preview, so typing in either box is
   *  reflected immediately. Repopulated from scratch (discarding any edits) whenever the design/
   *  color/size controls change, or explicitly via Reset — see the constructor's effect and
   *  reset() below. */
  readonly editedHtml = signal('');
  readonly editedCss = signal('');

  /** A translucent version of the same chosen color, used for "track"/secondary arcs — keeps
   *  every design visually color-coordinated from a single picker instead of needing a second
   *  "track color" control. */
  readonly trackColor = computed(() => `color-mix(in srgb, ${this.color()} 22%, transparent)`);

  readonly selectedDesign = computed(
    () => this.designs.find((d) => d.id === this.selectedId()) ?? this.designs[0],
  );

  private readonly exportClassName = computed(() => `sap-spinner-${this.selectedId()}`);

  /** The PURE generator output for the current design/color/size — what Reset reverts to, and
   *  what the auto-repopulate effect below seeds editedHtml/editedCss with. Not what the boxes
   *  or the live preview render directly once editing is possible — see editedHtml/editedCss. */
  readonly htmlCode = computed(() => this.selectedDesign().html(this.exportClassName()));
  readonly cssCode = computed(() =>
    this.selectedDesign().css(this.exportClassName(), this.size(), this.color(), this.trackColor()),
  );

  readonly htmlHighlighted = computed(() => highlightXml(this.editedHtml()));
  readonly cssHighlighted = computed(() => highlightCss(this.editedCss()));
  readonly htmlLineNumbers = computed(() => lineNumbersFor(this.editedHtml()));
  readonly cssLineNumbers = computed(() => lineNumbersFor(this.editedCss()));

  // Angular's template compiler treats any literal <style> element found in a component's own
  // .html as STATIC css to extract at build time (the same mechanism that lets you write inline
  // component styles directly in a template) — it can't contain a live interpolation expression
  // at all (confirmed the hard way: `<style>{{ cssCode() }}</style>` failed the build with CSS
  // parse errors, because the compiler tried to parse the literal text "{{ cssCode() }}" as
  // CSS). So the generated CSS — which genuinely needs to be dynamic, reacting to typed edits as
  // much as to color/size — is instead injected via plain <style> elements created and updated
  // here with direct DOM APIs, entirely outside the template/compiler's view. This sidesteps
  // that restriction the same way the [innerHTML]-encapsulation gotcha elsewhere in this app is
  // sidestepped: global, non-component-scoped CSS text, just assembled dynamically instead of
  // once from a static file.
  private readonly previewStyleEl = document.createElement('style');
  private readonly thumbStyleEls = new Map<string, HTMLStyleElement>();

  constructor() {
    document.head.appendChild(this.previewStyleEl);
    for (const design of this.designs) {
      const el = document.createElement('style');
      document.head.appendChild(el);
      this.thumbStyleEls.set(design.id, el);
    }

    // Repopulates both boxes from the fresh generator output whenever the design/color/size
    // controls change — this only READS htmlCode()/cssCode() (which themselves only depend on
    // selectedId/color/size/trackColor), never editedHtml/editedCss, so typing in either box
    // can't retrigger it: no feedback loop.
    effect(() => {
      this.editedHtml.set(this.htmlCode());
      this.editedCss.set(this.cssCode());
    });

    // The live preview renders whatever's CURRENTLY in the (possibly hand-edited) boxes, not
    // the untouched generator output — same principle as a real HTML/CSS playground.
    effect(() => {
      this.previewStyleEl.textContent = this.editedCss();
    });

    effect(() => {
      const color = this.color();
      const track = this.trackColor();
      for (const design of this.designs) {
        this.thumbStyleEls.get(design.id)!.textContent = design.css(
          `sap-spinner-thumb-${design.id}`,
          THUMB_SIZE,
          color,
          track,
        );
      }
    });
  }

  ngOnDestroy(): void {
    // The router destroys this component on navigating away — without this, every visit to the
    // page would leak 7 more <style> elements into document.head that nothing ever cleans up.
    this.previewStyleEl.remove();
    for (const el of this.thumbStyleEls.values()) {
      el.remove();
    }
  }

  selectDesign(id: string): void {
    this.selectedId.set(id);
  }

  setPreviewDark(dark: boolean): void {
    this.previewDark.set(dark);
  }

  /** Each design-picker card renders its own live mini-preview — reusing the exact same HTML
   *  generator as the main preview/export, just under a thumbnail-only class name (see the
   *  thumbStyleEls effect above for why: the "Ring" card's thumbnail and the main preview, when
   *  Ring is selected, must NOT both define `.sap-spinner-ring` at two different sizes). Always
   *  the PURE generator output, deliberately unaffected by whatever's been hand-edited in the
   *  main boxes — a thumbnail represents "what this design looks like," not the user's edits. */
  thumbHtml(design: SpinnerDesign): string {
    return design.html(`sap-spinner-thumb-${design.id}`);
  }

  /** Neither the line-number gutter nor the syntax-highlight backdrop are the element the user
   *  actually scrolls (that's the — functionally real, but visually invisible-text — textarea
   *  on top), so both have to be kept in lockstep with its scroll position manually. */
  syncScroll(event: Event, gutter: HTMLElement, backdrop: HTMLElement): void {
    const source = event.target as HTMLElement;
    gutter.scrollTop = source.scrollTop;
    backdrop.scrollTop = source.scrollTop;
    backdrop.scrollLeft = source.scrollLeft;
  }

  /** Discards any hand-edits in both boxes, reverting to the current selection's clean generated
   *  output — the same thing the auto-repopulate effect does on a control change, just available
   *  on demand without needing to touch another control first. */
  reset(): void {
    this.editedHtml.set(this.htmlCode());
    this.editedCss.set(this.cssCode());
  }

  beautifyHtmlBox(): void {
    this.editedHtml.set(beautifyHtmlSnippet(this.editedHtml()));
  }

  minifyHtmlBox(): void {
    this.editedHtml.set(minifyHtmlSnippet(this.editedHtml()));
  }

  beautifyCssBox(): void {
    this.editedCss.set(beautifyCss(this.editedCss()));
  }

  minifyCssBox(): void {
    this.editedCss.set(minifyCss(this.editedCss()));
  }

  async copyHtml(): Promise<void> {
    await navigator.clipboard.writeText(this.editedHtml());
    this.copiedHtml.set(true);
  }

  async copyCss(): Promise<void> {
    await navigator.clipboard.writeText(this.editedCss());
    this.copiedCss.set(true);
  }
}
