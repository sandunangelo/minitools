import{$t as jl,B as ND,E as Ip,En as sv,F as Lp,Hn as xo,J as Qv,Nn as vI,Nt as cu,S as HI,Wn as yI,Y as RI,_ as Fl,a as BE,f as Dp,jn as ui,kt as cD,l as CI,ln as mc,ot as Up,p as Ec,pn as ny,sn as mI,vt as Yv,z as Mp}from"./chunk-Bi8wHUow.js";import"./main-PRJANMSN.js";import{t as m}from"./chunk-Ces19ZMO.js";import{i as In,l as Xt,n as Dn,p as qt,u as je}from"./chunk-DaA7wIE5.js";import{t as y}from"./chunk-CsAb98uU.js";import{n as s,t as $}from"./chunk-DtKTPU_b.js";var z=(t,e)=>e.id;function tt(t,e){if(t&1){let a=CI();ui(0,`button`,33),Mp(`click`,function(){let i=Fl(a).$implicit,r=RI();return jl(r.selectDesign(i.id))}),Dp(1,`span`,34),ui(2,`span`,35),cD(3),mc()()}if(t&2){let a=e.$implicit,n=RI();Lp(`active`,n.selectedId()===a.id),sv(),Ip(`innerHTML`,n.thumbHtml(a),ny),sv(2),Up(a.label)}}function et(t,e){if(t&1&&(ui(0,`span`),cD(1),mc()),t&2){let a=e.$implicit;sv(),Up(a)}}function nt(t,e){if(t&1&&(ui(0,`span`),cD(1),mc()),t&2){let a=e.$implicit;sv(),Up(a)}}function g(t){return Math.max(2,Math.round(t/8))}var at=[{id:`ring`,label:`Ring`,html:t=>`<div class="${t}"></div>`,css:(t,e,a,n)=>`.${t} {
  width: ${e}px;
  height: ${e}px;
  border: ${g(e)}px solid ${n};
  border-top-color: ${a};
  border-radius: 50%;
  animation: ${t}-spin 0.8s linear infinite;
}

@keyframes ${t}-spin {
  to { transform: rotate(360deg); }
}`},{id:`dual-ring`,label:`Dual Ring`,html:t=>`<div class="${t}"></div>`,css:(t,e,a,n)=>`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
}

.${t}::before,
.${t}::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: ${g(e)}px solid transparent;
}

.${t}::before {
  border-top-color: ${a};
  border-bottom-color: ${n};
  animation: ${t}-spin 1s linear infinite;
}

.${t}::after {
  inset: ${Math.round(e*.18)}px;
  border-left-color: ${a};
  border-right-color: ${n};
  animation: ${t}-spin-reverse 0.8s linear infinite;
}

@keyframes ${t}-spin {
  to { transform: rotate(360deg); }
}

@keyframes ${t}-spin-reverse {
  to { transform: rotate(-360deg); }
}`},{id:`dots`,label:`Dots`,html:t=>`<div class="${t}"><span></span><span></span><span></span></div>`,css:(t,e,a)=>`.${t} {
  display: flex;
  align-items: center;
  gap: ${Math.round(e*.18)}px;
  height: ${e}px;
}

.${t} span {
  width: ${Math.round(e*.22)}px;
  height: ${Math.round(e*.22)}px;
  background: ${a};
  border-radius: 50%;
  animation: ${t}-bounce 0.6s ease-in-out infinite;
}

.${t} span:nth-child(2) { animation-delay: 0.15s; }
.${t} span:nth-child(3) { animation-delay: 0.3s; }

@keyframes ${t}-bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}`},{id:`bars`,label:`Bars`,html:t=>`<div class="${t}"><span></span><span></span><span></span><span></span></div>`,css:(t,e,a)=>`.${t} {
  display: flex;
  align-items: center;
  gap: ${Math.round(e*.1)}px;
  height: ${e}px;
}

.${t} span {
  width: ${Math.round(e*.15)}px;
  height: 100%;
  background: ${a};
  border-radius: 2px;
  animation: ${t}-scale 1s ease-in-out infinite;
}

.${t} span:nth-child(1) { animation-delay: 0s; }
.${t} span:nth-child(2) { animation-delay: 0.15s; }
.${t} span:nth-child(3) { animation-delay: 0.3s; }
.${t} span:nth-child(4) { animation-delay: 0.45s; }

@keyframes ${t}-scale {
  0%, 100% { transform: scaleY(0.3); }
  50% { transform: scaleY(1); }
}`},{id:`pulse`,label:`Pulse`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>`.${t} {
  width: ${e}px;
  height: ${e}px;
  border-radius: 50%;
  background: ${a};
  animation: ${t}-pulse 1.2s ease-out infinite;
}

@keyframes ${t}-pulse {
  0% { transform: scale(0.25); opacity: 1; }
  100% { transform: scale(1); opacity: 0; }
}`},{id:`ball`,label:`Bouncing Ball`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
}

.${t}::before {
  content: "";
  position: absolute;
  left: 30%;
  top: 0;
  width: 40%;
  height: 40%;
  background: ${a};
  border-radius: 50%;
  animation: ${t}-bounce 0.6s cubic-bezier(0.5, 0, 1, 0.5) infinite alternate;
}

@keyframes ${t}-bounce {
  from { transform: translateY(0); }
  to { transform: translateY(${Math.round(e*.75)}px); }
}`},{id:`triple-ring`,label:`Triple Ring`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>{let n=Math.max(2,Math.round(e/16));return`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
  border-radius: 50%;
  border: ${n}px solid transparent;
  border-top-color: ${a};
  animation: ${t}-spin 1.5s linear infinite;
}

.${t}::before,
.${t}::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  border: ${n}px solid transparent;
}

.${t}::before {
  inset: ${Math.round(e*.14)}px;
  border-top-color: ${a};
  opacity: 0.7;
  animation: ${t}-spin 1s linear infinite reverse;
}

.${t}::after {
  inset: ${Math.round(e*.28)}px;
  border-top-color: ${a};
  opacity: 0.45;
  animation: ${t}-spin 0.7s linear infinite;
}

@keyframes ${t}-spin {
  to { transform: rotate(360deg); }
}`}},{id:`dashed-ring`,label:`Dashed Ring`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>`.${t} {
  width: ${e}px;
  height: ${e}px;
  border-radius: 50%;
  border: ${g(e)}px dashed ${a};
  animation: ${t}-spin 2s linear infinite;
}

@keyframes ${t}-spin {
  to { transform: rotate(360deg); }
}`},{id:`comet`,label:`Comet`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>{let n=g(e);return`.${t} {
  width: ${e}px;
  height: ${e}px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, transparent, ${a});
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - ${n}px - 1px), #000 calc(100% - ${n}px));
  mask: radial-gradient(farthest-side, transparent calc(100% - ${n}px - 1px), #000 calc(100% - ${n}px));
  animation: ${t}-spin 1s linear infinite;
}

@keyframes ${t}-spin {
  to { transform: rotate(360deg); }
}`}},{id:`semi-circle`,label:`Semi Circle`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>`.${t} {
  width: ${e}px;
  height: ${e}px;
  border-radius: 50%;
  border: ${g(e)}px solid transparent;
  border-top-color: ${a};
  border-right-color: ${a};
  animation: ${t}-spin 0.9s linear infinite;
}

@keyframes ${t}-spin {
  to { transform: rotate(360deg); }
}`},{id:`square-ring`,label:`Square Ring`,html:t=>`<div class="${t}"></div>`,css:(t,e,a,n)=>`.${t} {
  width: ${e}px;
  height: ${e}px;
  border: ${g(e)}px solid ${n};
  border-top-color: ${a};
  border-radius: 6px;
  animation: ${t}-spin 1s linear infinite;
}

@keyframes ${t}-spin {
  to { transform: rotate(360deg); }
}`},{id:`dotted-ring`,label:`Dotted Ring`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>`.${t} {
  width: ${e}px;
  height: ${e}px;
  border-radius: 50%;
  border: ${Math.max(3,Math.round(e/6))}px dotted ${a};
  animation: ${t}-spin 2.5s linear infinite;
}

@keyframes ${t}-spin {
  to { transform: rotate(360deg); }
}`},{id:`pie`,label:`Pie`,html:t=>`<div class="${t}"></div>`,css:(t,e,a,n)=>`@property --${t}-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.${t} {
  width: ${e}px;
  height: ${e}px;
  border-radius: 50%;
  background: conic-gradient(${a} var(--${t}-angle), ${n} var(--${t}-angle));
  animation: ${t}-grow 1.4s linear infinite;
}

@keyframes ${t}-grow {
  to { --${t}-angle: 360deg; }
}`},{id:`ring-dot`,label:`Ring & Dot`,html:t=>`<div class="${t}"></div>`,css:(t,e,a,n)=>`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
}

.${t}::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: ${g(e)}px solid ${n};
  border-top-color: ${a};
  animation: ${t}-spin 0.9s linear infinite;
}

.${t}::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: ${Math.round(e*.18)}px;
  height: ${Math.round(e*.18)}px;
  margin: ${Math.round(e*-.09)}px;
  background: ${a};
  border-radius: 50%;
  animation: ${t}-pulse 1.2s ease-in-out infinite;
}

@keyframes ${t}-spin {
  to { transform: rotate(360deg); }
}

@keyframes ${t}-pulse {
  0%, 100% { transform: scale(0.8); opacity: 0.6; }
  50% { transform: scale(1.2); opacity: 1; }
}`},{id:`orbit`,label:`Orbit`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>{let n=Math.max(3,Math.round(e*.18));return`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
  animation: ${t}-spin 1.2s linear infinite;
}

.${t}::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  width: ${n}px;
  height: ${n}px;
  margin-left: ${Math.round(-n/2)}px;
  background: ${a};
  border-radius: 50%;
}

@keyframes ${t}-spin {
  to { transform: rotate(360deg); }
}`}},{id:`dual-orbit`,label:`Dual Orbit`,html:t=>`<div class="${t}"></div>`,css:(t,e,a,n)=>{let i=Math.max(3,Math.round(e*.16)),r=Math.round(e/2);return`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
}

.${t}::before,
.${t}::after {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  width: ${i}px;
  height: ${i}px;
  margin-left: ${Math.round(-i/2)}px;
  border-radius: 50%;
  transform-origin: 50% ${r}px;
}

.${t}::before {
  background: ${a};
  animation: ${t}-spin 1.3s linear infinite;
}

.${t}::after {
  background: ${n};
  animation: ${t}-spin-reverse 1.3s linear infinite;
}

@keyframes ${t}-spin {
  to { transform: rotate(360deg); }
}

@keyframes ${t}-spin-reverse {
  to { transform: rotate(-360deg); }
}`}},{id:`chase`,label:`Chase`,html:t=>`<div class="${t}">${Array.from({length:8},()=>`<span></span>`).join(``)}</div>`,css:(t,e,a)=>{let n=Math.max(2,Math.round(e*.12)),i=Math.round((e-n)/2),r=1.2,o=8,s=``;for(let d=0;d<o;d++){let p=360/o*d,m=(r/o*d).toFixed(3);s+=`.${t} span:nth-child(${d+1}) {
  transform: rotate(${p}deg) translate(0, -${i}px);
  animation-delay: ${m}s;
}
`}return`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
}

.${t} span {
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${n}px;
  height: ${n}px;
  margin: ${Math.round(-n/2)}px;
  background: ${a};
  border-radius: 50%;
  animation: ${t}-fade ${r}s linear infinite;
}

${s}
@keyframes ${t}-fade {
  0%, 100% { opacity: 0.15; }
  50% { opacity: 1; }
}`}},{id:`trio-orbit`,label:`Trio Orbit`,html:t=>`<div class="${t}"><span></span><span></span><span></span></div>`,css:(t,e,a)=>{let n=Math.max(3,Math.round(e*.16)),i=Math.round(e/2);return`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
}

.${t} span {
  position: absolute;
  top: 0;
  left: 50%;
  width: ${n}px;
  height: ${n}px;
  margin-left: ${Math.round(-n/2)}px;
  background: ${a};
  border-radius: 50%;
  transform-origin: 50% ${i}px;
  animation: ${t}-spin 1.4s linear infinite;
}

.${t} span:nth-child(1) { animation-delay: 0s; }
.${t} span:nth-child(2) { animation-delay: ${(-1.4/3).toFixed(3)}s; }
.${t} span:nth-child(3) { animation-delay: ${(-2.8/3).toFixed(3)}s; }

@keyframes ${t}-spin {
  to { transform: rotate(360deg); }
}`}},{id:`dots-pulse`,label:`Dots Pulse`,html:t=>`<div class="${t}"><span></span><span></span><span></span></div>`,css:(t,e,a)=>`.${t} {
  display: flex;
  align-items: center;
  gap: ${Math.round(e*.18)}px;
  height: ${e}px;
}

.${t} span {
  width: ${Math.round(e*.22)}px;
  height: ${Math.round(e*.22)}px;
  background: ${a};
  border-radius: 50%;
  animation: ${t}-pulse 1s ease-in-out infinite;
}

.${t} span:nth-child(2) { animation-delay: 0.2s; }
.${t} span:nth-child(3) { animation-delay: 0.4s; }

@keyframes ${t}-pulse {
  0%, 100% { transform: scale(0.4); }
  50% { transform: scale(1); }
}`},{id:`dots-fade`,label:`Dots Fade`,html:t=>`<div class="${t}"><span></span><span></span><span></span></div>`,css:(t,e,a)=>`.${t} {
  display: flex;
  align-items: center;
  gap: ${Math.round(e*.18)}px;
  height: ${e}px;
}

.${t} span {
  width: ${Math.round(e*.2)}px;
  height: ${Math.round(e*.2)}px;
  background: ${a};
  border-radius: 50%;
  animation: ${t}-fade 1.2s ease-in-out infinite;
}

.${t} span:nth-child(2) { animation-delay: 0.2s; }
.${t} span:nth-child(3) { animation-delay: 0.4s; }

@keyframes ${t}-fade {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
}`},{id:`dots-flip`,label:`Dots Flip`,html:t=>`<div class="${t}"><span></span><span></span><span></span></div>`,css:(t,e,a)=>`.${t} {
  display: flex;
  align-items: center;
  gap: ${Math.round(e*.18)}px;
  height: ${e}px;
  perspective: ${e*3}px;
}

.${t} span {
  width: ${Math.round(e*.22)}px;
  height: ${Math.round(e*.22)}px;
  background: ${a};
  border-radius: 4px;
  animation: ${t}-flip 1.2s ease-in-out infinite;
}

.${t} span:nth-child(2) { animation-delay: 0.15s; }
.${t} span:nth-child(3) { animation-delay: 0.3s; }

@keyframes ${t}-flip {
  0%, 100% { transform: rotateY(0deg); }
  50% { transform: rotateY(180deg); }
}`},{id:`dots-wave`,label:`Dots Wave`,html:t=>`<div class="${t}"><span></span><span></span><span></span><span></span></div>`,css:(t,e,a)=>{let n=Math.max(3,Math.round(e*.16)),i=Math.round(e*.25);return`.${t} {
  display: flex;
  align-items: center;
  gap: ${Math.round(e*.1)}px;
  height: ${e}px;
}

.${t} span {
  width: ${n}px;
  height: ${n}px;
  background: ${a};
  border-radius: 50%;
  animation: ${t}-wave 1s ease-in-out infinite;
}

.${t} span:nth-child(1) { animation-delay: 0s; }
.${t} span:nth-child(2) { animation-delay: 0.1s; }
.${t} span:nth-child(3) { animation-delay: 0.2s; }
.${t} span:nth-child(4) { animation-delay: 0.3s; }

@keyframes ${t}-wave {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-${i}px); }
}`}},{id:`dots-train`,label:`Dots Train`,html:t=>`<div class="${t}"><span></span><span></span><span></span><span></span><span></span></div>`,css:(t,e,a)=>{let n=Math.max(3,Math.round(e*.14)),i=5,r=1.2,o=``;for(let s=0;s<i;s++)o+=`.${t} span:nth-child(${s+1}) { animation-delay: ${(r/i*s).toFixed(3)}s; }
`;return`.${t} {
  display: flex;
  align-items: center;
  gap: ${Math.round(e*.08)}px;
  height: ${e}px;
}

.${t} span {
  width: ${n}px;
  height: ${n}px;
  background: ${a};
  border-radius: 50%;
  opacity: 0.15;
  animation: ${t}-train ${r}s ease-in-out infinite;
}

${o}
@keyframes ${t}-train {
  0%, 80%, 100% { opacity: 0.15; }
  20% { opacity: 1; }
}`}},{id:`cradle`,label:`Cradle`,html:t=>`<div class="${t}"><span></span><span></span></div>`,css:(t,e,a)=>{let n=Math.max(4,Math.round(e*.3)),i=Math.round(e*.3);return`.${t} {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${Math.round(e*.05)}px;
  height: ${e}px;
}

.${t} span {
  width: ${n}px;
  height: ${n}px;
  background: ${a};
  border-radius: 50%;
}

.${t} span:nth-child(1) {
  animation: ${t}-left 1s ease-in-out infinite;
}

.${t} span:nth-child(2) {
  animation: ${t}-right 1s ease-in-out infinite;
}

@keyframes ${t}-left {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(${i}px); }
}

@keyframes ${t}-right {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-${i}px); }
}`}},{id:`wave-5`,label:`Wave`,html:t=>`<div class="${t}"><span></span><span></span><span></span><span></span><span></span><span></span></div>`,css:(t,e,a)=>{let n=Math.max(3,Math.round(e*.13)),i=6,r=1.6,o=``;for(let s=0;s<i;s++)o+=`.${t} span:nth-child(${s+1}) { animation-delay: ${(r/i*s*.6).toFixed(3)}s; }
`;return`.${t} {
  display: flex;
  align-items: center;
  gap: ${Math.round(e*.06)}px;
  height: ${e}px;
}

.${t} span {
  width: ${n}px;
  height: ${n}px;
  background: ${a};
  border-radius: 50%;
  animation: ${t}-roll ${r}s ease-in-out infinite;
}

${o}
@keyframes ${t}-roll {
  0%, 100% { transform: scale(0.5); opacity: 0.4; }
  50% { transform: scale(1.3); opacity: 1; }
}`}},{id:`bars-slide`,label:`Bars Slide`,html:t=>`<div class="${t}"><span></span><span></span><span></span><span></span></div>`,css:(t,e,a)=>{let n=Math.max(2,Math.round(e*.12)),i=Math.round(e*.25);return`.${t} {
  display: flex;
  align-items: center;
  gap: ${Math.round(e*.1)}px;
  height: ${e}px;
}

.${t} span {
  width: ${n}px;
  height: ${Math.round(e*.4)}px;
  background: ${a};
  border-radius: 2px;
  animation: ${t}-slide 1s ease-in-out infinite;
}

.${t} span:nth-child(1) { animation-delay: 0s; }
.${t} span:nth-child(2) { animation-delay: 0.1s; }
.${t} span:nth-child(3) { animation-delay: 0.2s; }
.${t} span:nth-child(4) { animation-delay: 0.3s; }

@keyframes ${t}-slide {
  0%, 100% { transform: translateY(${i}px); }
  50% { transform: translateY(-${i}px); }
}`}},{id:`bars-seesaw`,label:`Bars Seesaw`,html:t=>`<div class="${t}"><span></span><span></span><span></span></div>`,css:(t,e,a)=>{let n=Math.max(2,Math.round(e*.1));return`.${t} {
  display: flex;
  align-items: flex-end;
  gap: ${Math.round(e*.14)}px;
  height: ${e}px;
}

.${t} span {
  width: ${n}px;
  height: ${Math.round(e*.7)}px;
  background: ${a};
  border-radius: 2px;
  transform-origin: bottom center;
  animation: ${t}-seesaw 1s ease-in-out infinite;
}

.${t} span:nth-child(2) { animation-delay: 0.15s; }
.${t} span:nth-child(3) { animation-delay: 0.3s; }

@keyframes ${t}-seesaw {
  0%, 100% { transform: rotate(-18deg); }
  50% { transform: rotate(18deg); }
}`}},{id:`progress`,label:`Progress`,html:t=>`<div class="${t}"><span></span></div>`,css:(t,e,a,n)=>{let i=Math.max(4,Math.round(e*.14));return`.${t} {
  position: relative;
  width: ${Math.round(e*1.8)}px;
  height: ${i}px;
  background: ${n};
  border-radius: ${Math.round(i/2)}px;
  overflow: hidden;
}

.${t} span {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 40%;
  background: ${a};
  border-radius: ${Math.round(i/2)}px;
  animation: ${t}-slide 1.2s ease-in-out infinite;
}

@keyframes ${t}-slide {
  0% { left: -40%; }
  100% { left: 100%; }
}`}},{id:`progress-split`,label:`Progress Split`,html:t=>`<div class="${t}"><span></span></div>`,css:(t,e,a,n)=>{let i=Math.max(4,Math.round(e*.14));return`.${t} {
  position: relative;
  width: ${Math.round(e*1.8)}px;
  height: ${i}px;
  background: ${n};
  border-radius: ${Math.round(i/2)}px;
  overflow: hidden;
}

.${t} span {
  position: absolute;
  top: 0;
  left: 50%;
  right: 50%;
  height: 100%;
  background: ${a};
  border-radius: ${Math.round(i/2)}px;
  animation: ${t}-split 1.3s ease-in infinite;
}

@keyframes ${t}-split {
  0% { left: 50%; right: 50%; opacity: 1; }
  70% { left: 0%; right: 0%; opacity: 1; }
  100% { left: 0%; right: 0%; opacity: 0; }
}`}},{id:`progress-stripes`,label:`Striped Progress`,html:t=>`<div class="${t}"></div>`,css:(t,e,a,n)=>{let i=Math.max(6,Math.round(e*.16)),r=Math.round(e*1.8),o=Math.max(6,Math.round(i*.8)),s=Math.round(o*1.41);return`.${t} {
  width: ${r}px;
  height: ${i}px;
  border-radius: ${Math.round(i/4)}px;
  background-color: ${n};
  background-image: repeating-linear-gradient(
    45deg,
    ${a} 0,
    ${a} ${Math.round(o/2)}px,
    transparent ${Math.round(o/2)}px,
    transparent ${o}px
  );
  background-size: ${s}px ${s}px;
  animation: ${t}-stripes 0.7s linear infinite;
}

@keyframes ${t}-stripes {
  to { background-position: ${s}px 0; }
}`}},{id:`radial-bars`,label:`Radial Bars`,html:t=>`<div class="${t}">${Array.from({length:12},()=>`<span></span>`).join(``)}</div>`,css:(t,e,a)=>{let n=Math.max(2,Math.round(e*.06)),i=Math.round(e*.22),r=Math.round(e/2-i/2-2),o=1.2,s=12,d=``;for(let p=0;p<s;p++){let m=360/s*p,f=(o/s*p-o).toFixed(3);d+=`.${t} span:nth-child(${p+1}) {
  transform: rotate(${m}deg) translate(0, -${r}px);
  animation-delay: ${f}s;
}
`}return`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
}

.${t} span {
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${n}px;
  height: ${i}px;
  margin: ${Math.round(-i/2)}px 0 0 ${Math.round(-n/2)}px;
  background: ${a};
  border-radius: ${n}px;
  animation: ${t}-tick ${o}s linear infinite;
}

${d}
@keyframes ${t}-tick {
  0%, 100% { opacity: 0.2; }
  8% { opacity: 1; }
}`}},{id:`square-rotate`,label:`Square Rotate`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>`.${t} {
  width: ${Math.round(e*.7)}px;
  height: ${Math.round(e*.7)}px;
  background: ${a};
  animation: ${t}-spin 1.2s linear infinite;
}

@keyframes ${t}-spin {
  to { transform: rotate(360deg); }
}`},{id:`square-morph`,label:`Square Morph`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>`.${t} {
  width: ${Math.round(e*.7)}px;
  height: ${Math.round(e*.7)}px;
  background: ${a};
  animation: ${t}-morph 1.5s ease-in-out infinite;
}

@keyframes ${t}-morph {
  0%, 100% { border-radius: 10%; transform: rotate(0deg); }
  50% { border-radius: 50%; transform: rotate(180deg); }
}`},{id:`triangle-rotate`,label:`Triangle Rotate`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>{let n=Math.round(e*.5);return`.${t} {
  width: 0;
  height: 0;
  border-left: ${n}px solid transparent;
  border-right: ${n}px solid transparent;
  border-bottom: ${Math.round(e*.87)}px solid ${a};
  animation: ${t}-spin 1.2s linear infinite;
}

@keyframes ${t}-spin {
  to { transform: rotate(360deg); }
}`}},{id:`diamond-pulse`,label:`Diamond Pulse`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>`.${t} {
  width: ${Math.round(e*.55)}px;
  height: ${Math.round(e*.55)}px;
  background: ${a};
  animation: ${t}-pulse 1s ease-in-out infinite;
}

@keyframes ${t}-pulse {
  0%, 100% { transform: rotate(45deg) scale(0.6); opacity: 0.5; }
  50% { transform: rotate(45deg) scale(1); opacity: 1; }
}`},{id:`fold`,label:`Fold`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>`.${t} {
  width: ${Math.round(e*.6)}px;
  height: ${Math.round(e*.6)}px;
  background: ${a};
  animation: ${t}-fold 1.2s ease-in-out infinite;
}

@keyframes ${t}-fold {
  0%, 100% { transform: scale(1, 1); }
  25% { transform: scale(1, 0.1); }
  50% { transform: scale(0.1, 0.1); }
  75% { transform: scale(0.1, 1); }
}`},{id:`windmill`,label:`Windmill`,html:t=>`<div class="${t}"><span></span><span></span><span></span><span></span></div>`,css:(t,e,a)=>{let n=Math.max(3,Math.round(e*.14)),i=Math.round(e*.42);return`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
  animation: ${t}-spin 1s linear infinite;
}

.${t} span {
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${n}px;
  height: ${i}px;
  margin: ${-i}px 0 0 ${Math.round(-n/2)}px;
  background: ${a};
  border-radius: ${n}px ${n}px 0 0;
  transform-origin: 50% 100%;
}

.${t} span:nth-child(1) { transform: rotate(0deg); }
.${t} span:nth-child(2) { transform: rotate(90deg); }
.${t} span:nth-child(3) { transform: rotate(180deg); }
.${t} span:nth-child(4) { transform: rotate(270deg); }

@keyframes ${t}-spin {
  to { transform: rotate(360deg); }
}`}},{id:`flower`,label:`Flower`,html:t=>`<div class="${t}">${Array.from({length:6},()=>`<span></span>`).join(``)}</div>`,css:(t,e,a)=>{let n=Math.round(e*.32),i=e*.22,r=1.4,o=6,s=``;for(let d=0;d<o;d++){let p=360/o*d*Math.PI/180,m=Math.round(i*Math.sin(p)),f=Math.round(-i*Math.cos(p)),I=(r/o*d).toFixed(3);s+=`.${t} span:nth-child(${d+1}) {
  margin-left: ${Math.round(-n/2+m)}px;
  margin-top: ${Math.round(-n/2+f)}px;
  animation-delay: ${I}s;
}
`}return`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
}

.${t} span {
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${n}px;
  height: ${n}px;
  background: ${a};
  border-radius: 50%;
  animation: ${t}-bloom ${r}s ease-in-out infinite;
}

${s}
@keyframes ${t}-bloom {
  0%, 100% { transform: scale(0.3); opacity: 0.4; }
  50% { transform: scale(1); opacity: 1; }
}`}},{id:`hourglass`,label:`Hourglass`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>{let n=Math.round(e*.4);return`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
  animation: ${t}-flip 1.4s ease-in-out infinite;
}

.${t}::before,
.${t}::after {
  content: "";
  position: absolute;
  left: 50%;
  width: 0;
  height: 0;
  margin-left: ${-n}px;
  border-left: ${n}px solid transparent;
  border-right: ${n}px solid transparent;
}

.${t}::before {
  top: 0;
  border-top: ${Math.round(n*.8)}px solid ${a};
}

.${t}::after {
  bottom: 0;
  border-bottom: ${Math.round(n*.8)}px solid ${a};
}

@keyframes ${t}-flip {
  0%, 40% { transform: rotate(0deg); }
  50%, 90% { transform: rotate(180deg); }
  100% { transform: rotate(360deg); }
}`}},{id:`double-ripple`,label:`Double Ripple`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
}

.${t}::before,
.${t}::after {
  content: "";
  position: absolute;
  inset: 0;
  border: ${Math.max(2,Math.round(e/16))}px solid ${a};
  border-radius: 50%;
  animation: ${t}-ripple 1.4s ease-out infinite;
}

.${t}::after {
  animation-delay: 0.7s;
}

@keyframes ${t}-ripple {
  0% { transform: scale(0.2); opacity: 1; }
  100% { transform: scale(1); opacity: 0; }
}`},{id:`ripple-square`,label:`Ripple Square`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>`.${t} {
  width: ${e}px;
  height: ${e}px;
  border-radius: 12%;
  background: ${a};
  animation: ${t}-ripple 1.2s ease-out infinite;
}

@keyframes ${t}-ripple {
  0% { transform: scale(0.25); opacity: 1; }
  100% { transform: scale(1); opacity: 0; }
}`},{id:`breathe`,label:`Breathe`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>`.${t} {
  width: ${Math.round(e*.6)}px;
  height: ${Math.round(e*.6)}px;
  background: ${a};
  border-radius: 50%;
  animation: ${t}-breathe 2.4s ease-in-out infinite;
}

@keyframes ${t}-breathe {
  0%, 100% { transform: scale(0.75); opacity: 0.6; }
  50% { transform: scale(1); opacity: 1; }
}`},{id:`heartbeat`,label:`Heartbeat`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>`.${t} {
  width: ${Math.round(e*.6)}px;
  height: ${Math.round(e*.6)}px;
  background: ${a};
  border-radius: 50%;
  animation: ${t}-beat 1.4s ease-in-out infinite;
}

@keyframes ${t}-beat {
  0%, 100% { transform: scale(1); }
  15% { transform: scale(1.3); }
  30% { transform: scale(1); }
  45% { transform: scale(1.3); }
  60% { transform: scale(1); }
}`},{id:`bouncing-bar`,label:`Bouncing Bar`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>{let n=Math.round(e*.18),i=Math.round(e*.6),r=Math.round(e*.5);return`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
}

.${t}::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 0;
  width: ${i}px;
  height: ${n}px;
  margin-left: ${Math.round(-i/2)}px;
  background: ${a};
  border-radius: ${Math.round(n/2)}px;
  animation: ${t}-bounce 0.6s cubic-bezier(0.5, 0, 1, 0.5) infinite alternate;
}

@keyframes ${t}-bounce {
  from { transform: translateY(0); }
  to { transform: translateY(${r}px); }
}`}},{id:`leapfrog`,label:`Leapfrog`,html:t=>`<div class="${t}"><span></span><span></span><span></span></div>`,css:(t,e,a)=>{let n=Math.round(e*.24),i=Math.round(e*.45);return`.${t} {
  display: flex;
  align-items: flex-end;
  gap: ${Math.round(e*.12)}px;
  height: ${e}px;
}

.${t} span {
  width: ${n}px;
  height: ${n}px;
  background: ${a};
  border-radius: 50%;
  animation: ${t}-hop 0.9s ease-in-out infinite;
}

.${t} span:nth-child(2) { animation-delay: 0.3s; }
.${t} span:nth-child(3) { animation-delay: 0.6s; }

@keyframes ${t}-hop {
  0%, 100% { transform: translateY(0); }
  30% { transform: translateY(-${i}px); }
}`}},{id:`bounce-wave`,label:`Bounce Wave`,html:t=>`<div class="${t}"><span></span><span></span><span></span><span></span><span></span></div>`,css:(t,e,a)=>{let n=Math.round(e*.16),i=Math.round(e*.4),r=5,o=.9,s=``;for(let d=0;d<r;d++)s+=`.${t} span:nth-child(${d+1}) { animation-delay: ${(o/r*d).toFixed(3)}s; }
`;return`.${t} {
  display: flex;
  align-items: flex-end;
  gap: ${Math.round(e*.08)}px;
  height: ${e}px;
}

.${t} span {
  width: ${n}px;
  height: ${n}px;
  background: ${a};
  border-radius: 50%;
  animation: ${t}-bounce ${o}s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
}

${s}
@keyframes ${t}-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-${i}px); }
}`}},{id:`flip-square`,label:`Flip Square`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>`.${t} {
  width: ${Math.round(e*.65)}px;
  height: ${Math.round(e*.65)}px;
  background: ${a};
  border-radius: 8%;
  animation: ${t}-flip 1.2s ease-in-out infinite;
}

@keyframes ${t}-flip {
  0% { transform: perspective(${e*3}px) rotateY(0deg); }
  50% { transform: perspective(${e*3}px) rotateY(180deg); }
  100% { transform: perspective(${e*3}px) rotateY(360deg); }
}`},{id:`cube`,label:`Cube`,html:t=>`<div class="${t}"></div>`,css:(t,e,a,n)=>`.${t} {
  width: ${Math.round(e*.6)}px;
  height: ${Math.round(e*.6)}px;
  background: ${a};
  border: ${Math.max(2,Math.round(e*.03))}px solid ${n};
  animation: ${t}-tumble 1.6s linear infinite;
}

@keyframes ${t}-tumble {
  0% { transform: perspective(${e*3}px) rotateX(0deg) rotateY(0deg); }
  100% { transform: perspective(${e*3}px) rotateX(360deg) rotateY(360deg); }
}`},{id:`radar`,label:`Radar`,html:t=>`<div class="${t}"></div>`,css:(t,e,a,n)=>{return`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
  border-radius: 50%;
  border: ${Math.max(1,Math.round(e/40))}px solid ${n};
  overflow: hidden;
}

.${t}::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(from 0deg, ${a}, transparent 35%);
  animation: ${t}-sweep 1.5s linear infinite;
}

@keyframes ${t}-sweep {
  to { transform: rotate(360deg); }
}`}},{id:`infinity`,label:`Infinity`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>{let n=Math.round(e*.18),i=Math.round(e*.32);return`.${t} {
  position: relative;
  width: ${e}px;
  height: ${Math.round(e*.6)}px;
}

.${t}::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${n}px;
  height: ${n}px;
  margin: ${Math.round(-n/2)}px;
  background: ${a};
  border-radius: 50%;
  animation: ${t}-infinity 2s linear infinite;
}

@keyframes ${t}-infinity {
  0%    { transform: translate(0, 0); }
  12.5% { transform: translate(${i}px, ${Math.round(-i*.6)}px); }
  25%   { transform: translate(${i*2}px, 0); }
  37.5% { transform: translate(${i}px, ${Math.round(i*.6)}px); }
  50%   { transform: translate(0, 0); }
  62.5% { transform: translate(${-i}px, ${Math.round(-i*.6)}px); }
  75%   { transform: translate(${-i*2}px, 0); }
  87.5% { transform: translate(${-i}px, ${Math.round(i*.6)}px); }
  100%  { transform: translate(0, 0); }
}`}},{id:`grid-flash`,label:`Grid Flash`,html:t=>`<div class="${t}">${Array.from({length:9},()=>`<span></span>`).join(``)}</div>`,css:(t,e,a)=>{let n=Math.round(e*.26),i=Math.round(e*.07),r=1.3,o=9,s=``;for(let d=0;d<o;d++)s+=`.${t} span:nth-child(${d+1}) { animation-delay: ${(r/o*d).toFixed(3)}s; }
`;return`.${t} {
  display: grid;
  grid-template-columns: repeat(3, ${n}px);
  grid-template-rows: repeat(3, ${n}px);
  gap: ${i}px;
}

.${t} span {
  background: ${a};
  border-radius: 2px;
  animation: ${t}-flash ${r}s ease-in-out infinite;
}

${s}
@keyframes ${t}-flash {
  0%, 100% { opacity: 0.15; }
  15% { opacity: 1; }
}`}},{id:`shimmer`,label:`Shimmer Bar`,html:t=>`<div class="${t}"></div>`,css:(t,e,a,n)=>{let i=Math.max(8,Math.round(e*.22));return`.${t} {
  width: ${Math.round(e*2.2)}px;
  height: ${i}px;
  border-radius: ${Math.round(i/3)}px;
  background-color: ${n};
  background-image: linear-gradient(90deg, transparent, ${a}, transparent);
  background-size: 60% 100%;
  background-repeat: no-repeat;
  background-position: -60% 0;
  animation: ${t}-shimmer 1.3s ease-in-out infinite;
}

@keyframes ${t}-shimmer {
  to { background-position: 160% 0; }
}`}},{id:`shimmer-circle`,label:`Shimmer Circle`,html:t=>`<div class="${t}"></div>`,css:(t,e,a,n)=>`.${t} {
  width: ${e}px;
  height: ${e}px;
  border-radius: 50%;
  background-color: ${n};
  background-image: linear-gradient(90deg, transparent, ${a}, transparent);
  background-size: 60% 100%;
  background-repeat: no-repeat;
  background-position: -60% 0;
  animation: ${t}-shimmer 1.3s ease-in-out infinite;
}

@keyframes ${t}-shimmer {
  to { background-position: 160% 0; }
}`},{id:`shimmer-lines`,label:`Shimmer Lines`,html:t=>`<div class="${t}"><span></span><span></span><span></span></div>`,css:(t,e,a,n)=>{let i=Math.max(6,Math.round(e*.14));return`.${t} {
  display: flex;
  flex-direction: column;
  gap: ${Math.round(e*.12)}px;
  width: ${Math.round(e*2)}px;
}

.${t} span {
  display: block;
  height: ${i}px;
  border-radius: ${Math.round(i/2)}px;
  background-color: ${n};
  background-image: linear-gradient(90deg, transparent, ${a}, transparent);
  background-size: 60% 100%;
  background-repeat: no-repeat;
  background-position: -60% 0;
  animation: ${t}-shimmer 1.3s ease-in-out infinite;
}

.${t} span:nth-child(1) { width: 100%; animation-delay: 0s; }
.${t} span:nth-child(2) { width: 80%; animation-delay: 0.1s; }
.${t} span:nth-child(3) { width: 60%; animation-delay: 0.2s; }

@keyframes ${t}-shimmer {
  to { background-position: 160% 0; }
}`}},{id:`soft-ring`,label:`Soft Ring`,html:t=>`<div class="${t}"></div>`,css:(t,e,a,n)=>{let i=Math.round(e*.14);return`.${t} {
  width: ${e}px;
  height: ${e}px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, ${n}, ${a}, ${n});
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - ${i}px), #000 calc(100% - ${i}px));
  mask: radial-gradient(farthest-side, transparent calc(100% - ${i}px), #000 calc(100% - ${i}px));
  filter: blur(${Math.max(1,Math.round(e*.015))}px);
  animation: ${t}-spin 1.1s linear infinite;
}

@keyframes ${t}-spin {
  to { transform: rotate(360deg); }
}`}},{id:`gradient-ring`,label:`Gradient Ring`,html:t=>`<div class="${t}"></div>`,css:(t,e,a,n)=>`.${t} {
  width: ${e}px;
  height: ${e}px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, ${a}, ${n}, ${a});
  animation: ${t}-spin 1.6s linear infinite;
}

@keyframes ${t}-spin {
  to { transform: rotate(360deg); }
}`},{id:`ring-segments`,label:`Ring Segments`,html:t=>`<div class="${t}">${Array.from({length:8},()=>`<span></span>`).join(``)}</div>`,css:(t,e,a)=>{let n=Math.round(e*.22),i=Math.max(2,Math.round(e*.08)),r=Math.round(e/2-i/2-1),o=1.2,s=8,d=``;for(let p=0;p<s;p++){let m=360/s*p,f=(o/s*p).toFixed(3);d+=`.${t} span:nth-child(${p+1}) {
  transform: rotate(${m}deg) translate(0, -${r}px) rotate(90deg);
  animation-delay: ${f}s;
}
`}return`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
}

.${t} span {
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${n}px;
  height: ${i}px;
  margin: ${Math.round(-i/2)}px 0 0 ${Math.round(-n/2)}px;
  background: ${a};
  border-radius: ${i}px;
  animation: ${t}-tick ${o}s steps(1, end) infinite;
}

${d}
@keyframes ${t}-tick {
  0%, 100% { opacity: 0.15; }
  12% { opacity: 1; }
}`}},{id:`eclipse`,label:`Eclipse`,html:t=>`<div class="${t}"></div>`,css:(t,e,a,n)=>`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
  border-radius: 50%;
  background: ${a};
  overflow: hidden;
}

.${t}::before {
  content: "";
  position: absolute;
  top: -10%;
  left: -100%;
  width: 100%;
  height: 120%;
  border-radius: 50%;
  background: ${n};
  animation: ${t}-pass 1.8s ease-in-out infinite;
}

@keyframes ${t}-pass {
  0% { left: -100%; }
  50% { left: 40%; }
  100% { left: 180%; }
}`},{id:`spiral`,label:`Spiral`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>`.${t} {
  width: ${e}px;
  height: ${e}px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, transparent 0deg, ${a} 300deg, transparent 360deg);
  -webkit-mask: radial-gradient(circle, transparent 15%, #000 15%);
  mask: radial-gradient(circle, transparent 15%, #000 15%);
  animation: ${t}-spin 1s linear infinite;
}

@keyframes ${t}-spin {
  to { transform: rotate(360deg); }
}`},{id:`pinwheel`,label:`Pinwheel`,html:t=>`<div class="${t}"><span></span><span></span><span></span><span></span></div>`,css:(t,e,a)=>{let n=Math.round(e*.44);return`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
  animation: ${t}-spin 1.3s linear infinite;
}

.${t} span {
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${n}px;
  height: ${n}px;
  margin: ${-n}px 0 0 0;
  background: ${a};
  border-radius: 100% 0 100% 100%;
  transform-origin: 0 100%;
}

.${t} span:nth-child(1) { transform: rotate(0deg); }
.${t} span:nth-child(2) { transform: rotate(90deg); }
.${t} span:nth-child(3) { transform: rotate(180deg); }
.${t} span:nth-child(4) { transform: rotate(270deg); }

@keyframes ${t}-spin {
  to { transform: rotate(360deg); }
}`}},{id:`kaleidoscope`,label:`Kaleidoscope`,html:t=>`<div class="${t}"></div>`,css:(t,e,a,n)=>`.${t} {
  width: ${e}px;
  height: ${e}px;
  border-radius: 50%;
  background: conic-gradient(
    ${a} 0deg 45deg, ${n} 45deg 90deg,
    ${a} 90deg 135deg, ${n} 135deg 180deg,
    ${a} 180deg 225deg, ${n} 225deg 270deg,
    ${a} 270deg 315deg, ${n} 315deg 360deg
  );
  animation: ${t}-spin 2.4s linear infinite;
}

@keyframes ${t}-spin {
  to { transform: rotate(360deg); }
}`},{id:`spiral-dots`,label:`Spiral Dots`,html:t=>`<div class="${t}">${Array.from({length:6},()=>`<span></span>`).join(``)}</div>`,css:(t,e,a)=>{let r=``;for(let o=0;o<6;o++){let s=o*70*(Math.PI/180),d=e/2*((o+1)/6)*.85,p=Math.round(d*Math.cos(s)),m=Math.round(d*Math.sin(s)),f=Math.max(3,Math.round(e*.1*(.6+o/6*.6))),I=(1.5/6*o).toFixed(3);r+=`.${t} span:nth-child(${o+1}) {
  width: ${f}px;
  height: ${f}px;
  margin-left: ${Math.round(p-f/2)}px;
  margin-top: ${Math.round(m-f/2)}px;
  animation-delay: ${I}s;
}
`}return`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
}

.${t} span {
  position: absolute;
  top: 50%;
  left: 50%;
  background: ${a};
  border-radius: 50%;
  animation: ${t}-pulse 1.5s ease-in-out infinite;
}

${r}
@keyframes ${t}-pulse {
  0%, 100% { transform: scale(0.4); opacity: 0.3; }
  50% { transform: scale(1); opacity: 1; }
}`}},{id:`dna-helix`,label:`DNA Helix`,html:t=>`<div class="${t}"><span></span><span></span><span></span><span></span><span></span><span></span></div>`,css:(t,e,a,n)=>{let i=Math.max(3,Math.round(e*.12)),r=Math.round(e*.3),o=6,s=1.2,d=``;for(let p=0;p<o;p++){let m=(s/o*p*.5).toFixed(3);d+=`.${t} span:nth-child(${p+1}) { animation-delay: ${m}s; background: ${p%2===0?a:n}; }
`}return`.${t} {
  display: flex;
  align-items: center;
  gap: ${Math.round(e*.04)}px;
  height: ${e}px;
}

.${t} span {
  width: ${i}px;
  height: ${i}px;
  border-radius: 50%;
  background: ${a};
  animation: ${t}-helix 1.2s ease-in-out infinite;
}

${d}
@keyframes ${t}-helix {
  0%, 100% { transform: translateY(-${r}px); }
  50% { transform: translateY(${r}px); }
}`}},{id:`barber-pole`,label:`Barber Pole`,html:t=>`<div class="${t}"></div>`,css:(t,e,a,n)=>{let i=Math.round(e*.4),r=e,o=Math.max(6,Math.round(i*.5)),s=Math.round(o*1.41);return`.${t} {
  width: ${i}px;
  height: ${r}px;
  border-radius: ${Math.round(i/2)}px;
  background-color: ${n};
  background-image: repeating-linear-gradient(
    -45deg,
    ${a} 0,
    ${a} ${Math.round(o/2)}px,
    transparent ${Math.round(o/2)}px,
    transparent ${o}px
  );
  background-size: ${s}px ${s}px;
  animation: ${t}-scroll 0.6s linear infinite;
}

@keyframes ${t}-scroll {
  to { background-position: 0 ${s}px; }
}`}},{id:`compass`,label:`Compass`,html:t=>`<div class="${t}"></div>`,css:(t,e,a,n)=>{let i=Math.round(e*.38),r=Math.max(2,Math.round(e*.05));return`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
  border-radius: 50%;
  border: ${Math.max(1,Math.round(e/30))}px solid ${n};
}

.${t}::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: ${r}px;
  height: ${i}px;
  margin: ${-i}px 0 0 ${Math.round(-r/2)}px;
  background: ${a};
  border-radius: ${r}px;
  transform-origin: 50% 100%;
  animation: ${t}-wobble 2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
}

@keyframes ${t}-wobble {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(100deg); }
  50% { transform: rotate(180deg); }
  75% { transform: rotate(290deg); }
  100% { transform: rotate(360deg); }
}`}},{id:`pendulum`,label:`Pendulum`,html:t=>`<div class="${t}"></div>`,css:(t,e,a,n)=>{let i=Math.round(e*.42),r=Math.round(e*.22),o=Math.round(-(i-r/2));return`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
}

.${t}::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 0;
  width: 2px;
  height: ${i}px;
  background: ${n};
  transform-origin: top center;
  animation: ${t}-swing 1.4s ease-in-out infinite;
}

.${t}::after {
  content: "";
  position: absolute;
  left: 50%;
  top: ${i-r/2}px;
  width: ${r}px;
  height: ${r}px;
  margin-left: ${Math.round(-r/2)}px;
  background: ${a};
  border-radius: 50%;
  transform-origin: 50% ${o}px;
  animation: ${t}-swing 1.4s ease-in-out infinite;
}

@keyframes ${t}-swing {
  0%, 100% { transform: rotate(-35deg); }
  50% { transform: rotate(35deg); }
}`}},{id:`clock-hands`,label:`Clock Hands`,html:t=>`<div class="${t}"></div>`,css:(t,e,a,n)=>{let i=Math.round(e*.38),r=Math.round(e*.26),o=Math.max(2,Math.round(e*.04));return`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
  border-radius: 50%;
  border: ${Math.max(1,Math.round(e/30))}px solid ${n};
}

.${t}::before,
.${t}::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: ${o}px;
  background: ${a};
  border-radius: ${o}px;
  transform-origin: 50% 100%;
}

.${t}::before {
  height: ${i}px;
  margin: ${-i}px 0 0 ${Math.round(-o/2)}px;
  animation: ${t}-spin 2s linear infinite;
}

.${t}::after {
  height: ${r}px;
  margin: ${-r}px 0 0 ${Math.round(-o/2)}px;
  opacity: 0.6;
  animation: ${t}-spin 3s linear infinite reverse;
}

@keyframes ${t}-spin {
  to { transform: rotate(360deg); }
}`}},{id:`concentric-squares`,label:`Concentric Squares`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
}

.${t}::before,
.${t}::after {
  content: "";
  position: absolute;
  inset: 0;
  border: ${Math.max(2,Math.round(e/16))}px solid ${a};
  border-radius: 12%;
  animation: ${t}-ripple 1.4s ease-out infinite;
}

.${t}::after {
  animation-delay: 0.7s;
}

@keyframes ${t}-ripple {
  0% { transform: scale(0.2); opacity: 1; }
  100% { transform: scale(1); opacity: 0; }
}`},{id:`corner-dots`,label:`Corner Dots`,html:t=>`<div class="${t}"><span></span><span></span><span></span><span></span></div>`,css:(t,e,a)=>{let n=Math.round(e*.2);return`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
}

.${t} span {
  position: absolute;
  width: ${n}px;
  height: ${n}px;
  background: ${a};
  border-radius: 50%;
  animation: ${t}-blink 1.2s ease-in-out infinite;
}

.${t} span:nth-child(1) { top: 0; left: 0; animation-delay: 0s; }
.${t} span:nth-child(2) { top: 0; right: 0; animation-delay: 0.2s; }
.${t} span:nth-child(3) { bottom: 0; right: 0; animation-delay: 0.4s; }
.${t} span:nth-child(4) { bottom: 0; left: 0; animation-delay: 0.6s; }

@keyframes ${t}-blink {
  0%, 100% { opacity: 0.2; transform: scale(0.7); }
  50% { opacity: 1; transform: scale(1); }
}`}},{id:`accordion-bars`,label:`Accordion Bars`,html:t=>`<div class="${t}"><span></span><span></span><span></span><span></span><span></span></div>`,css:(t,e,a)=>{let n=Math.round(e*.6),i=5,r=1.2,o=``;for(let s=0;s<i;s++)o+=`.${t} span:nth-child(${s+1}) { animation-delay: ${(r/i*s).toFixed(3)}s; }
`;return`.${t} {
  display: flex;
  align-items: center;
  height: ${e}px;
}

.${t} span {
  width: ${Math.round(e*.14)}px;
  height: ${n}px;
  background: ${a};
  margin: 0 1px;
  animation: ${t}-squeeze ${r}s ease-in-out infinite;
  transform-origin: center;
}

${o}
@keyframes ${t}-squeeze {
  0%, 100% { transform: scaleX(1); }
  50% { transform: scaleX(0.3); }
}`}},{id:`heart-pulse`,label:`Heart Pulse`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>{let n=Math.round(e*.3);return`.${t} {
  position: relative;
  width: ${n*2}px;
  height: ${n*2}px;
  background: ${a};
  transform: rotate(-45deg);
  animation: ${t}-beat 1.1s ease-in-out infinite;
}

.${t}::before,
.${t}::after {
  content: "";
  position: absolute;
  width: ${n}px;
  height: ${n}px;
  border-radius: 50%;
  background: ${a};
}

.${t}::before {
  top: ${-n/2}px;
  left: 0;
}

.${t}::after {
  top: 0;
  left: ${n/2}px;
}

@keyframes ${t}-beat {
  0%, 100% { transform: rotate(-45deg) scale(1); }
  25% { transform: rotate(-45deg) scale(1.15); }
  50% { transform: rotate(-45deg) scale(1); }
}`}},{id:`orbit-trail`,label:`Orbit Trail`,html:t=>`<div class="${t}"><span></span><span></span><span></span><span></span></div>`,css:(t,e,a)=>{let n=Math.max(3,Math.round(e*.2)),i=1.1,r=4,o=``;for(let s=0;s<r;s++){let d=1-s*.2,p=1-s*.22;o+=`.${t} span:nth-child(${s+1}) {
  width: ${Math.round(n*d)}px;
  height: ${Math.round(n*d)}px;
  margin-left: ${Math.round(-n*d/2)}px;
  opacity: ${p.toFixed(2)};
  animation-delay: ${(-.275*s).toFixed(3)}s;
}
`}return`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
}

.${t} span {
  position: absolute;
  top: 0;
  left: 50%;
  background: ${a};
  border-radius: 50%;
  transform-origin: 50% ${Math.round(e/2)}px;
  animation: ${t}-spin ${i}s linear infinite;
}

${o}
@keyframes ${t}-spin {
  to { transform: rotate(360deg); }
}`}},{id:`figure-eight-dots`,label:`Figure Eight Dots`,html:t=>`<div class="${t}"><span></span><span></span><span></span></div>`,css:(t,e,a)=>{let n=Math.round(e*.14),i=Math.round(e*.32);return`.${t} {
  position: relative;
  width: ${e}px;
  height: ${Math.round(e*.6)}px;
}

.${t} span {
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${n}px;
  height: ${n}px;
  margin: ${Math.round(-n/2)}px;
  background: ${a};
  border-radius: 50%;
  animation: ${t}-infinity 2s linear infinite;
}

.${t} span:nth-child(1) { animation-delay: 0s; }
.${t} span:nth-child(2) { animation-delay: ${(-2/3).toFixed(3)}s; opacity: 0.6; }
.${t} span:nth-child(3) { animation-delay: ${(-4/3).toFixed(3)}s; opacity: 0.35; }

@keyframes ${t}-infinity {
  0%    { transform: translate(0, 0); }
  12.5% { transform: translate(${i}px, ${Math.round(-i*.6)}px); }
  25%   { transform: translate(${i*2}px, 0); }
  37.5% { transform: translate(${i}px, ${Math.round(i*.6)}px); }
  50%   { transform: translate(0, 0); }
  62.5% { transform: translate(${-i}px, ${Math.round(-i*.6)}px); }
  75%   { transform: translate(${-i*2}px, 0); }
  87.5% { transform: translate(${-i}px, ${Math.round(i*.6)}px); }
  100%  { transform: translate(0, 0); }
}`}},{id:`converge`,label:`Converge`,html:t=>`<div class="${t}"><span></span><span></span><span></span><span></span></div>`,css:(t,e,a)=>{let n=Math.round(e*.18),i=Math.round(e/2-n/2);return`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
}

.${t} span {
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${n}px;
  height: ${n}px;
  margin: ${Math.round(-n/2)}px;
  background: ${a};
  border-radius: 50%;
  animation-duration: 1s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

.${t} span:nth-child(1) { animation-name: ${t}-tl; }
.${t} span:nth-child(2) { animation-name: ${t}-tr; }
.${t} span:nth-child(3) { animation-name: ${t}-br; }
.${t} span:nth-child(4) { animation-name: ${t}-bl; }

@keyframes ${t}-tl {
  0%, 100% { transform: translate(${-i}px, ${-i}px); }
  50% { transform: translate(0, 0); }
}

@keyframes ${t}-tr {
  0%, 100% { transform: translate(${i}px, ${-i}px); }
  50% { transform: translate(0, 0); }
}

@keyframes ${t}-br {
  0%, 100% { transform: translate(${i}px, ${i}px); }
  50% { transform: translate(0, 0); }
}

@keyframes ${t}-bl {
  0%, 100% { transform: translate(${-i}px, ${i}px); }
  50% { transform: translate(0, 0); }
}`}},{id:`satellite`,label:`Satellite`,html:t=>`<div class="${t}"><span></span></div>`,css:(t,e,a,n)=>{let i=Math.round(e*.5),r=Math.max(3,Math.round(e*.16));return`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
}

.${t}::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${i}px;
  height: ${i}px;
  margin: ${Math.round(-i/2)}px;
  background: ${n};
  border-radius: 50%;
}

.${t} span {
  position: absolute;
  top: 0;
  left: 50%;
  width: ${r}px;
  height: ${r}px;
  margin-left: ${Math.round(-r/2)}px;
  background: ${a};
  border-radius: 50%;
  transform-origin: 50% ${Math.round(e/2)}px;
  animation: ${t}-spin 1.4s linear infinite;
}

@keyframes ${t}-spin {
  to { transform: rotate(360deg); }
}`}},{id:`bars-fade`,label:`Bars Fade`,html:t=>`<div class="${t}"><span></span><span></span><span></span><span></span></div>`,css:(t,e,a)=>`.${t} {
  display: flex;
  align-items: center;
  gap: ${Math.round(e*.1)}px;
  height: ${e}px;
}

.${t} span {
  width: ${Math.max(2,Math.round(e*.12))}px;
  height: 100%;
  background: ${a};
  border-radius: 2px;
  animation: ${t}-fade 1.1s ease-in-out infinite;
}

.${t} span:nth-child(1) { animation-delay: 0s; }
.${t} span:nth-child(2) { animation-delay: 0.15s; }
.${t} span:nth-child(3) { animation-delay: 0.3s; }
.${t} span:nth-child(4) { animation-delay: 0.45s; }

@keyframes ${t}-fade {
  0%, 100% { opacity: 0.15; }
  50% { opacity: 1; }
}`},{id:`progress-dual`,label:`Dual Progress`,html:t=>`<div class="${t}"><span></span><span></span></div>`,css:(t,e,a,n)=>{let i=Math.max(4,Math.round(e*.14));return`.${t} {
  position: relative;
  width: ${Math.round(e*1.8)}px;
  height: ${i}px;
  background: ${n};
  border-radius: ${Math.round(i/2)}px;
  overflow: hidden;
}

.${t} span {
  position: absolute;
  top: 0;
  height: 100%;
  width: 25%;
  background: ${a};
  border-radius: ${Math.round(i/2)}px;
  animation: ${t}-chase 1.4s linear infinite;
}

.${t} span:nth-child(2) {
  animation-delay: 0.7s;
  opacity: 0.6;
}

@keyframes ${t}-chase {
  0% { left: -25%; }
  100% { left: 100%; }
}`}},{id:`steps`,label:`Steps`,html:t=>`<div class="${t}"><span></span><span></span><span></span><span></span><span></span></div>`,css:(t,e,a,n)=>{let i=Math.max(6,Math.round(e*.3)),r=Math.round(e*.3),o=5,s=1.5,d=``;for(let p=0;p<o;p++)d+=`.${t} span:nth-child(${p+1}) { animation-delay: ${(s/o*p).toFixed(3)}s; }
`;return`.${t} {
  display: flex;
  gap: ${Math.round(e*.04)}px;
}

.${t} span {
  width: ${r}px;
  height: ${i}px;
  background: ${n};
  border-radius: 2px;
  animation: ${t}-fill ${s}s steps(1, end) infinite;
}

${d}
@keyframes ${t}-fill {
  0% { background: ${a}; }
  20% { background: ${a}; }
  20.01% { background: ${n}; }
  100% { background: ${n}; }
}`}},{id:`equalizer-circle`,label:`Circle Equalizer`,html:t=>`<div class="${t}">${Array.from({length:10},()=>`<span></span>`).join(``)}</div>`,css:(t,e,a)=>{let n=Math.max(2,Math.round(e*.05)),i=Math.round(e*.2),r=Math.round(e/2-i/2-1),o=10,s=[.6,.8,.5,.9,.7,.55,.85,.65,.75,.6],d=``;for(let p=0;p<o;p++){let m=360/o*p;d+=`.${t} span:nth-child(${p+1}) {
  transform: rotate(${m}deg) translate(0, -${r}px);
  animation-duration: ${s[p%s.length]}s;
}
`}return`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
}

.${t} span {
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${n}px;
  height: ${i}px;
  margin: ${Math.round(-i/2)}px 0 0 ${Math.round(-n/2)}px;
  background: ${a};
  border-radius: ${n}px;
  animation-name: ${t}-tick;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

${d}
@keyframes ${t}-tick {
  0%, 100% { opacity: 0.25; }
  50% { opacity: 1; }
}`}},{id:`hexagon-rotate`,label:`Hexagon Rotate`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>`.${t} {
  width: ${Math.round(e*.8)}px;
  height: ${Math.round(e*.8)}px;
  background: ${a};
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  animation: ${t}-spin 1.5s linear infinite;
}

@keyframes ${t}-spin {
  to { transform: rotate(360deg); }
}`},{id:`pentagon-pulse`,label:`Pentagon Pulse`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>`.${t} {
  width: ${Math.round(e*.75)}px;
  height: ${Math.round(e*.75)}px;
  background: ${a};
  clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
  animation: ${t}-pulse 1.1s ease-in-out infinite;
}

@keyframes ${t}-pulse {
  0%, 100% { transform: scale(0.7); opacity: 0.6; }
  50% { transform: scale(1); opacity: 1; }
}`},{id:`blob`,label:`Blob`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>`.${t} {
  width: ${Math.round(e*.75)}px;
  height: ${Math.round(e*.75)}px;
  background: ${a};
  animation: ${t}-morph 2.5s ease-in-out infinite;
}

@keyframes ${t}-morph {
  0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
}`},{id:`star-pulse`,label:`Star Pulse`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>`.${t} {
  width: ${Math.round(e*.8)}px;
  height: ${Math.round(e*.8)}px;
  background: ${a};
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  animation: ${t}-pulse 1.3s ease-in-out infinite;
}

@keyframes ${t}-pulse {
  0%, 100% { transform: scale(0.75) rotate(0deg); }
  50% { transform: scale(1) rotate(20deg); }
}`},{id:`cross-spin`,label:`Cross Spin`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>`.${t} {
  width: ${Math.round(e*.75)}px;
  height: ${Math.round(e*.75)}px;
  background: ${a};
  clip-path: polygon(35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0% 65%, 0% 35%, 35% 35%);
  animation: ${t}-spin 1.4s linear infinite;
}

@keyframes ${t}-spin {
  to { transform: rotate(360deg); }
}`},{id:`ring-square-morph`,label:`Ring Square Morph`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>`.${t} {
  width: ${Math.round(e*.7)}px;
  height: ${Math.round(e*.7)}px;
  border: ${g(e)}px solid ${a};
  animation: ${t}-morph 1.8s ease-in-out infinite;
}

@keyframes ${t}-morph {
  0%, 100% { border-radius: 50%; transform: rotate(0deg); }
  50% { border-radius: 10%; transform: rotate(180deg); }
}`},{id:`morph-shape`,label:`Morph Shape`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>`.${t} {
  width: ${Math.round(e*.7)}px;
  height: ${Math.round(e*.7)}px;
  background: ${a};
  animation: ${t}-morph 1.6s ease-in-out infinite;
}

@keyframes ${t}-morph {
  0%, 100% { clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%); }
  50% { clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); }
}`},{id:`nested-squares`,label:`Nested Squares`,html:t=>`<div class="${t}"></div>`,css:(t,e,a,n)=>`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
  border: ${g(e)}px solid ${a};
  animation: ${t}-spin 1.6s linear infinite;
}

.${t}::before,
.${t}::after {
  content: "";
  position: absolute;
  border: ${g(e)}px solid ${n};
}

.${t}::before {
  inset: ${Math.round(e*.16)}px;
  animation: ${t}-spin-reverse 1.1s linear infinite;
}

.${t}::after {
  inset: ${Math.round(e*.32)}px;
  border-color: ${a};
  opacity: 0.6;
  animation: ${t}-spin 0.8s linear infinite;
}

@keyframes ${t}-spin {
  to { transform: rotate(360deg); }
}

@keyframes ${t}-spin-reverse {
  to { transform: rotate(-360deg); }
}`},{id:`bounce-squash`,label:`Squash Bounce`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>{let n=Math.round(e*.4),i=Math.round(e*.55);return`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
}

.${t}::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 0;
  width: ${n}px;
  height: ${n}px;
  margin-left: ${Math.round(-n/2)}px;
  background: ${a};
  border-radius: 50%;
  animation: ${t}-bounce 0.7s cubic-bezier(0.5, 0, 1, 0.5) infinite alternate;
}

@keyframes ${t}-bounce {
  0% { transform: translateY(0) scale(1, 1); }
  90% { transform: translateY(${i}px) scale(1, 1); }
  95% { transform: translateY(${i}px) scale(1.3, 0.7); }
  100% { transform: translateY(${i}px) scale(1.3, 0.7); }
}`}},{id:`wave-arc`,label:`Wave Arc`,html:t=>`<div class="${t}">${Array.from({length:7},()=>`<i><span></span></i>`).join(``)}</div>`,css:(t,e,a)=>{let n=Math.max(2,Math.round(e*.06)),i=Math.round(e*.3),r=Math.round(e*.45),o=7,s=140,d=-70,p=``;for(let m=0;m<o;m++){let f=d+s/6*m;p+=`.${t} i:nth-child(${m+1}) {
  transform: rotate(${f.toFixed(1)}deg) translate(0, -${r}px);
}
.${t} i:nth-child(${m+1}) span {
  animation-delay: ${(m*.08).toFixed(3)}s;
}
`}return`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
}

.${t} i {
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${n}px;
  height: ${i}px;
  margin: ${Math.round(-i/2)}px 0 0 ${Math.round(-n/2)}px;
  display: block;
}

.${t} i span {
  display: block;
  width: 100%;
  height: 100%;
  background: ${a};
  border-radius: ${n}px;
  animation: ${t}-wave 1s ease-in-out infinite;
}

${p}
@keyframes ${t}-wave {
  0%, 100% { transform: scale(1, 0.4); }
  50% { transform: scale(1, 1); }
}`}},{id:`tilt-ring`,label:`Tilt Ring`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>`.${t} {
  width: ${e}px;
  height: ${e}px;
  border-radius: 50%;
  border: ${g(e)}px solid transparent;
  border-top-color: ${a};
  border-bottom-color: ${a};
  transform: perspective(${e*2}px) rotateX(60deg);
  animation: ${t}-spin 0.9s linear infinite;
}

@keyframes ${t}-spin {
  to { transform: perspective(${e*2}px) rotateX(60deg) rotateZ(360deg); }
}`},{id:`coin-flip`,label:`Coin Flip`,html:t=>`<div class="${t}"></div>`,css:(t,e,a,n)=>`.${t} {
  width: ${e}px;
  height: ${e}px;
  border-radius: 50%;
  background: ${a};
  animation: ${t}-flip 1s ease-in-out infinite;
}

@keyframes ${t}-flip {
  0% { transform: scaleX(1); background: ${a}; }
  50% { transform: scaleX(0); background: ${n}; }
  100% { transform: scaleX(1); background: ${a}; }
}`},{id:`propeller`,label:`Propeller`,html:t=>`<div class="${t}"><span></span><span></span><span></span></div>`,css:(t,e,a)=>{let n=Math.round(e*.46),i=Math.max(3,Math.round(e*.12));return`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
  animation: ${t}-spin 0.5s linear infinite;
}

.${t} span {
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${i}px;
  height: ${n}px;
  margin: ${-n}px 0 0 ${Math.round(-i/2)}px;
  background: ${a};
  border-radius: 50% 50% 50% 50% / 60% 60% 10% 10%;
  transform-origin: 50% 100%;
}

.${t} span:nth-child(1) { transform: rotate(0deg); }
.${t} span:nth-child(2) { transform: rotate(120deg); }
.${t} span:nth-child(3) { transform: rotate(240deg); }

@keyframes ${t}-spin {
  to { transform: rotate(360deg); }
}`}},{id:`orbit-ring`,label:`Orbit Ring`,html:t=>`<div class="${t}"><span></span></div>`,css:(t,e,a,n)=>`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
}

.${t}::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: ${Math.max(1,Math.round(e/25))}px solid ${n};
}

.${t} span {
  position: absolute;
  top: 0;
  left: 50%;
  width: ${Math.round(e*.16)}px;
  height: ${Math.round(e*.16)}px;
  margin-left: ${Math.round(-e*.08)}px;
  margin-top: ${Math.round(-e*.08)}px;
  background: ${a};
  border-radius: 50%;
  transform-origin: 50% ${Math.round(e/2+e*.08)}px;
  animation: ${t}-spin 1.3s linear infinite;
}

@keyframes ${t}-spin {
  to { transform: rotate(360deg); }
}`},{id:`zigzag-dots`,label:`Zigzag Dots`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>{let n=Math.round(e*.2),i=Math.round(e*.35),r=Math.round(e*.3);return`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
}

.${t}::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${n}px;
  height: ${n}px;
  margin: ${Math.round(-n/2)}px;
  background: ${a};
  border-radius: 50%;
  animation: ${t}-zigzag 1.4s ease-in-out infinite;
}

@keyframes ${t}-zigzag {
  0%   { transform: translate(${-i}px, ${-r}px); }
  25%  { transform: translate(${Math.round(-i/2)}px, ${r}px); }
  50%  { transform: translate(0, ${-r}px); }
  75%  { transform: translate(${Math.round(i/2)}px, ${r}px); }
  100% { transform: translate(${i}px, ${-r}px); }
}`}},{id:`ripple-center-dot`,label:`Ripple Center Dot`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>{let n=Math.round(e*.22);return`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
}

.${t}::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${n}px;
  height: ${n}px;
  margin: ${Math.round(-n/2)}px;
  background: ${a};
  border-radius: 50%;
}

.${t}::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${n}px;
  height: ${n}px;
  margin: ${Math.round(-n/2)}px;
  border: 2px solid ${a};
  border-radius: 50%;
  animation: ${t}-ripple 1.3s ease-out infinite;
}

@keyframes ${t}-ripple {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(${Math.max(2,Math.round(e/n))}); opacity: 0; }
}`}},{id:`corner-squares`,label:`Corner Squares`,html:t=>`<div class="${t}"><span></span><span></span><span></span><span></span></div>`,css:(t,e,a)=>{let n=Math.round(e*.26);return`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
}

.${t} span {
  position: absolute;
  width: ${n}px;
  height: ${n}px;
  background: ${a};
  border-radius: 2px;
  animation: ${t}-pulse 1.1s ease-in-out infinite;
}

.${t} span:nth-child(1) { top: 0; left: 0; animation-delay: 0s; }
.${t} span:nth-child(2) { top: 0; right: 0; animation-delay: 0.1s; }
.${t} span:nth-child(3) { bottom: 0; right: 0; animation-delay: 0.2s; }
.${t} span:nth-child(4) { bottom: 0; left: 0; animation-delay: 0.3s; }

@keyframes ${t}-pulse {
  0%, 100% { transform: scale(0.5) rotate(0deg); opacity: 0.4; }
  50% { transform: scale(1) rotate(45deg); opacity: 1; }
}`}},{id:`blink-ring`,label:`Blink Ring`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>`.${t} {
  width: ${e}px;
  height: ${e}px;
  border-radius: 50%;
  border: ${g(e)}px solid ${a};
  animation: ${t}-blink 1s steps(1, end) infinite;
}

@keyframes ${t}-blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0.15; }
}`},{id:`bouncing-pill`,label:`Bouncing Pill`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>{let n=Math.round(e*.3),i=Math.round(e*.55),r=Math.round(e*.4);return`.${t} {
  position: relative;
  width: ${e}px;
  height: ${e}px;
}

.${t}::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 0;
  width: ${n}px;
  height: ${i}px;
  margin-left: ${Math.round(-n/2)}px;
  background: ${a};
  border-radius: ${Math.round(n/2)}px;
  animation: ${t}-bounce 0.7s ease-in-out infinite;
}

@keyframes ${t}-bounce {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(${r}px) rotate(180deg); }
}`}},{id:`ring-wobble`,label:`Ring Wobble`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>`.${t} {
  width: ${e}px;
  height: ${e}px;
  border-radius: 50%;
  border: ${g(e)}px solid ${a};
  animation: ${t}-wobble 1.2s ease-in-out infinite;
}

@keyframes ${t}-wobble {
  0%, 100% { transform: skew(0deg, 0deg) scale(1); }
  25% { transform: skew(8deg, 4deg) scale(1.05, 0.95); }
  50% { transform: skew(0deg, 0deg) scale(0.95, 1.05); }
  75% { transform: skew(-8deg, -4deg) scale(1.05, 0.95); }
}`},{id:`triangle-pulse`,label:`Triangle Pulse`,html:t=>`<div class="${t}"></div>`,css:(t,e,a)=>{let n=Math.round(e*.5);return`.${t} {
  width: 0;
  height: 0;
  border-left: ${n}px solid transparent;
  border-right: ${n}px solid transparent;
  border-bottom: ${Math.round(e*.87)}px solid ${a};
  animation: ${t}-pulse 1.1s ease-in-out infinite;
}

@keyframes ${t}-pulse {
  0%, 100% { transform: scale(0.6); opacity: 0.5; }
  50% { transform: scale(1); opacity: 1; }
}`}}];var it=28;function K(t){let e=t?t.split(`
`).length:1;return Array.from({length:e},(a,n)=>n+1)}function rt(t){return t.replace(/>\s+</g,`><`).trim()}function ot(t){let e=document.createElement(`div`);e.innerHTML=t.trim();let a=[];return J(e,0,a),a.join(`
`)}function J(t,e,a){let n=`  `.repeat(e);for(let i of Array.from(t.children)){let r=Array.from(i.attributes).map(s=>` ${s.name}="${s.value}"`).join(``),o=i.tagName.toLowerCase();i.children.length===0?a.push(`${n}<${o}${r}></${o}>`):(a.push(`${n}<${o}${r}>`),J(i,e+1,a),a.push(`${n}</${o}>`))}}function Q(t){return t.replace(/\/\*[\s\S]*?\*\//g,``).replace(/\s*\n\s*/g,` `).replace(/\s*([{}:;,])\s*/g,`$1`).replace(/;}/g,`}`).replace(/\s{2,}/g,` `).trim()}function st(t){let a=Q(t).replace(/\{/g,` {
`).replace(/\}/g,`
}
`).replace(/;/g,`;
`).split(`
`).map(r=>r.trim()).filter(r=>r.length>0),n=0,i=[];for(let r of a){let o=r.replace(/,(?!\s)/g,`, `);if(o===`}`){n=Math.max(0,n-1),i.push(`  `.repeat(n)+o);continue}let s=`  `.repeat(n);if(o.endsWith(`{`)){i.push(s+o),n++;continue}let d=o.indexOf(`:`),p=d===-1?o:`${o.slice(0,d)}: ${o.slice(d+1)}`;i.push(s+p)}return i.join(`
`)}var O=/\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|@[a-zA-Z-]+|#[0-9a-fA-F]{3,8}\b|-?\d+\.?\d*[a-zA-Z%]*|[a-zA-Z_-][a-zA-Z0-9_-]*|[{}:;,()]|\s+/g;function dt(t,e){return/^\s+$/.test(t)?`text`:t.startsWith(`/*`)?`comment`:t.startsWith(`"`)||t.startsWith(`'`)?`string`:t.startsWith(`@`)?`at-rule`:t.startsWith(`#`)?`number`:/^[{}:;,()]$/.test(t)?`punct`:/^-?\d/.test(t)?`number`:/^\s*\(/.test(e)?`function`:/^\s*\{/.test(e)?`selector`:/^\s*:/.test(e)?`property`:`value`}function pt(t){if(!t)return``;let e=``,a=0;O.lastIndex=0;let n;for(;n=O.exec(t);){n.index>a&&(e+=s(t.slice(a,n.index)));let i=n[0],r=dt(i,t.slice(O.lastIndex));e+=r===`text`?s(i):`<span class="css-${r}">${s(i)}</span>`,a=O.lastIndex}return a<t.length&&(e+=s(t.slice(a))),e}var U=class t{designs=at;selectedId=xo(`ring`);color=xo(`#3366ff`);size=xo(48);previewDark=xo(!1);copiedHtml=xo(!1);copiedCss=xo(!1);editedHtml=xo(``);editedCss=xo(``);trackColor=ND(()=>`color-mix(in srgb, ${this.color()} 22%, transparent)`);selectedDesign=ND(()=>this.designs.find(e=>e.id===this.selectedId())??this.designs[0]);exportClassName=ND(()=>`sap-spinner-${this.selectedId()}`);htmlCode=ND(()=>this.selectedDesign().html(this.exportClassName()));cssCode=ND(()=>this.selectedDesign().css(this.exportClassName(),this.size(),this.color(),this.trackColor()));htmlHighlighted=ND(()=>$(this.editedHtml()));cssHighlighted=ND(()=>pt(this.editedCss()));htmlLineNumbers=ND(()=>K(this.editedHtml()));cssLineNumbers=ND(()=>K(this.editedCss()));previewStyleEl=document.createElement(`style`);thumbStyleEls=new Map;constructor(){document.head.appendChild(this.previewStyleEl);for(let e of this.designs){let a=document.createElement(`style`);document.head.appendChild(a),this.thumbStyleEls.set(e.id,a)}cu(()=>{this.editedHtml.set(this.htmlCode()),this.editedCss.set(this.cssCode())}),cu(()=>{this.previewStyleEl.textContent=this.editedCss()}),cu(()=>{let e=this.color(),a=this.trackColor();for(let n of this.designs)this.thumbStyleEls.get(n.id).textContent=n.css(`sap-spinner-thumb-${n.id}`,it,e,a)})}ngOnDestroy(){this.previewStyleEl.remove();for(let e of this.thumbStyleEls.values())e.remove()}selectDesign(e){this.selectedId.set(e)}setPreviewDark(e){this.previewDark.set(e)}thumbHtml(e){return e.html(`sap-spinner-thumb-${e.id}`)}syncScroll(e,a,n){let i=e.target;a.scrollTop=i.scrollTop,n.scrollTop=i.scrollTop,n.scrollLeft=i.scrollLeft}reset(){this.editedHtml.set(this.htmlCode()),this.editedCss.set(this.cssCode())}beautifyHtmlBox(){this.editedHtml.set(ot(this.editedHtml()))}minifyHtmlBox(){this.editedHtml.set(rt(this.editedHtml()))}beautifyCssBox(){this.editedCss.set(st(this.editedCss()))}minifyCssBox(){this.editedCss.set(Q(this.editedCss()))}async copyHtml(){await navigator.clipboard.writeText(this.editedHtml()),this.copiedHtml.set(!0)}async copyCss(){await navigator.clipboard.writeText(this.editedCss()),this.copiedCss.set(!0)}static ɵfac=function(a){return new(a||t)};static ɵcmp=BE({type:t,selectors:[[`sap-loading-indicator`]],decls:73,vars:16,consts:[[`htmlGutter`,``],[`htmlBackdrop`,``],[`cssGutter`,``],[`cssBackdrop`,``],[`icon`,`🌀`,`title`,`Loading Indicator Generator`,`description`,`Pick a design, color, and size, then copy the ready-to-use HTML/CSS.`],[1,`generator-layout`],[1,`design-grid`],[`type`,`button`,1,`design-card`,3,`active`],[1,`preview-column`],[1,`controls-row`],[1,`control`],[1,`control-label`],[`type`,`color`,`name`,`color`,3,`ngModelChange`,`ngModel`],[`type`,`range`,`min`,`24`,`max`,`160`,`name`,`size`,3,`ngModelChange`,`ngModel`],[1,`view-toggle`],[`type`,`button`,3,`click`],[1,`preview-stage`],[1,`preview-shape`,3,`innerHTML`],[1,`codec-toolbar`],[1,`pane-label`],[`type`,`button`,`fillMode`,`outline`,3,`clicked`],[1,`codec-grid`],[1,`codec-pane`],[1,`pane-header`],[1,`pane-actions`],[`type`,`button`,`fillMode`,`flat`,`themeColor`,`base`,3,`clicked`],[1,`code-editor`],[1,`line-numbers`],[1,`code-area`],[`aria-hidden`,`true`,1,`syntax-backdrop`],[3,`innerHTML`],[`wrap`,`off`,`spellcheck`,`false`,`name`,`editedHtml`,1,`code-textarea`,3,`ngModelChange`,`scroll`,`ngModel`],[`wrap`,`off`,`spellcheck`,`false`,`name`,`editedCss`,1,`code-textarea`,3,`ngModelChange`,`scroll`,`ngModel`],[`type`,`button`,1,`design-card`,3,`click`],[1,`design-thumb`,3,`innerHTML`],[1,`design-label`]],template:function(a,n){if(a&1){let i=CI();Dp(0,`sap-page-header`,4),ui(1,`div`,5)(2,`div`,6),yI(3,tt,4,4,`button`,7,z),mc(),ui(5,`div`,8)(6,`div`,9)(7,`label`,10)(8,`span`,11),cD(9,`Color`),mc(),ui(10,`input`,12),Qv(),Mp(`ngModelChange`,function(o){return n.color.set(o)}),mc()(),ui(11,`label`,10)(12,`span`,11),cD(13),mc(),ui(14,`input`,13),Qv(),Mp(`ngModelChange`,function(o){return n.size.set(o)}),mc()(),ui(15,`div`,10)(16,`span`,11),cD(17,`Preview background`),mc(),ui(18,`div`,14)(19,`button`,15),Mp(`click`,function(){return n.setPreviewDark(!1)}),cD(20,`Light`),mc(),ui(21,`button`,15),Mp(`click`,function(){return n.setPreviewDark(!0)}),cD(22,`Dark`),mc()()()(),ui(23,`div`,16),Dp(24,`div`,17),mc()()(),ui(25,`div`,18)(26,`span`,19),cD(27,`Generated Code`),mc(),ui(28,`sap-button`,20),Mp(`clicked`,function(){return n.reset()}),cD(29,`↺ Reset`),mc()(),ui(30,`div`,21)(31,`div`,22)(32,`div`,23)(33,`span`,19),cD(34,`HTML`),mc(),ui(35,`div`,24)(36,`sap-button`,20),Mp(`clicked`,function(){return n.beautifyHtmlBox()}),cD(37,`Beautify`),mc(),ui(38,`sap-button`,20),Mp(`clicked`,function(){return n.minifyHtmlBox()}),cD(39,`Minify`),mc(),ui(40,`sap-button`,25),Mp(`clicked`,function(){return n.copyHtml()}),cD(41),mc()()(),ui(42,`div`,26)(43,`div`,27,0),yI(45,et,2,1,`span`,null,mI),mc(),ui(47,`div`,28)(48,`pre`,29,1),Dp(50,`code`,30),mc(),ui(51,`textarea`,31),Qv(),Mp(`ngModelChange`,function(o){return n.editedHtml.set(o)})(`scroll`,function(o){Fl(i);let s=HI(44),d=HI(49);return jl(n.syncScroll(o,s,d))}),mc()()()(),ui(52,`div`,22)(53,`div`,23)(54,`span`,19),cD(55,`CSS`),mc(),ui(56,`div`,24)(57,`sap-button`,20),Mp(`clicked`,function(){return n.beautifyCssBox()}),cD(58,`Beautify`),mc(),ui(59,`sap-button`,20),Mp(`clicked`,function(){return n.minifyCssBox()}),cD(60,`Minify`),mc(),ui(61,`sap-button`,25),Mp(`clicked`,function(){return n.copyCss()}),cD(62),mc()()(),ui(63,`div`,26)(64,`div`,27,2),yI(66,nt,2,1,`span`,null,mI),mc(),ui(68,`div`,28)(69,`pre`,29,3),Dp(71,`code`,30),mc(),ui(72,`textarea`,32),Qv(),Mp(`ngModelChange`,function(o){return n.editedCss.set(o)})(`scroll`,function(o){Fl(i);let s=HI(65),d=HI(70);return jl(n.syncScroll(o,s,d))}),mc()()()()()}a&2&&(sv(3),vI(n.designs),sv(7),Ip(`ngModel`,n.color()),Yv(),sv(3),Ec(`Size: `,n.size(),`px`),sv(),Ip(`ngModel`,n.size()),Yv(),sv(5),Lp(`active`,!n.previewDark()),sv(2),Lp(`active`,n.previewDark()),sv(2),Lp(`dark`,n.previewDark()),sv(),Ip(`innerHTML`,n.editedHtml(),ny),sv(17),Ec(` `,n.copiedHtml()?`Copied!`:`Copy`,` `),sv(4),vI(n.htmlLineNumbers()),sv(5),Ip(`innerHTML`,n.htmlHighlighted(),ny),sv(),Ip(`ngModel`,n.editedHtml()),Yv(),sv(11),Ec(` `,n.copiedCss()?`Copied!`:`Copy`,` `),sv(4),vI(n.cssLineNumbers()),sv(5),Ip(`innerHTML`,n.cssHighlighted(),ny),sv(),Ip(`ngModel`,n.editedCss()),Yv())},dependencies:[m,In,je,Xt,Dn,qt,y],styles:[`.generator-layout[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;align-items:start;margin-bottom:1.5rem}@media(max-width:800px){.generator-layout[_ngcontent-%COMP%]{grid-template-columns:1fr}}.design-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:.75rem;max-height:335px;overflow-y:auto}.preview-column[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:1.5rem;min-width:0}.design-card[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;gap:.6rem;padding:1rem .5rem;border:1px solid var(--%NS%sap-border);border-radius:var(--%NS%sap-radius);background:var(--%NS%sap-surface);cursor:pointer;transition:border-color .15s ease,box-shadow .15s ease}.design-card[_ngcontent-%COMP%]:hover{border-color:var(--%NS%sap-primary)}.design-card.active[_ngcontent-%COMP%]{border-color:var(--%NS%sap-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--%NS%sap-primary) 18%,transparent)}.design-thumb[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;height:36px}.design-label[_ngcontent-%COMP%]{font-size:.8rem;font-weight:600;color:var(--%NS%sap-text);text-align:center}.controls-row[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;align-items:flex-end;gap:1.5rem;padding:1rem 1.25rem;background:var(--%NS%sap-surface);border:1px solid var(--%NS%sap-border);border-radius:var(--%NS%sap-radius)}.control[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:.4rem}.control-label[_ngcontent-%COMP%]{font-size:.8rem;font-weight:600;color:var(--%NS%sap-muted)}input[type=color][_ngcontent-%COMP%]{width:3rem;height:2.25rem;padding:.2rem;border:1px solid var(--%NS%sap-border);border-radius:6px;background:var(--%NS%sap-surface);cursor:pointer}input[type=range][_ngcontent-%COMP%]{width:180px}.view-toggle[_ngcontent-%COMP%]{display:flex;gap:.3rem;padding:.2rem;background:var(--%NS%sap-bg);border-radius:999px}.view-toggle[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{padding:.3rem .75rem;border:none;border-radius:999px;background:transparent;color:var(--%NS%sap-muted);font-size:.8rem;font-weight:600;cursor:pointer;transition:background-color .15s ease,color .15s ease}.view-toggle[_ngcontent-%COMP%]   button.active[_ngcontent-%COMP%]{background:var(--%NS%sap-surface);color:var(--%NS%sap-text);box-shadow:var(--%NS%sap-shadow)}.preview-stage[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;height:220px;background:var(--%NS%sap-bg);border:1px solid var(--%NS%sap-border);border-radius:var(--%NS%sap-radius);transition:background-color .15s ease}.preview-stage.dark[_ngcontent-%COMP%]{background:#1f2430;border-color:#1f2430}.preview-shape[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center}.codec-toolbar[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:.75rem;margin-bottom:.75rem}.codec-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem}@media(max-width:800px){.codec-grid[_ngcontent-%COMP%]{grid-template-columns:1fr}}.codec-pane[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:.6rem;min-width:0}.pane-header[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:.75rem;min-height:2.25rem}.pane-label[_ngcontent-%COMP%]{font-size:.8rem;font-weight:700;letter-spacing:.04em;color:var(--%NS%sap-muted);text-transform:uppercase}.pane-actions[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;gap:.6rem}.code-editor[_ngcontent-%COMP%]{display:flex;height:260px;border:1px solid var(--%NS%sap-border);border-radius:6px;overflow:hidden;background:var(--%NS%sap-surface);transition:border-color .15s ease,box-shadow .15s ease}.code-editor[_ngcontent-%COMP%]:focus-within{border-color:var(--%NS%sap-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--%NS%sap-primary) 18%,transparent)}.line-numbers[_ngcontent-%COMP%]{flex-shrink:0;padding:.75rem .6rem;background:var(--%NS%sap-bg);border-right:1px solid var(--%NS%sap-border);color:var(--%NS%sap-muted);font-family:Cascadia Code,Consolas,monospace;font-size:.85rem;line-height:1.5;text-align:right;overflow:hidden;-webkit-user-select:none;user-select:none}.line-numbers[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{display:block}.code-area[_ngcontent-%COMP%]{position:relative;flex:1;min-width:0}.syntax-backdrop[_ngcontent-%COMP%]{position:absolute;inset:0;margin:0;padding:.75rem 1rem;overflow:hidden;pointer-events:none;background:transparent;color:var(--%NS%sap-text);font-family:Cascadia Code,Consolas,monospace;font-size:.85rem;line-height:1.5;white-space:pre}.syntax-backdrop[_ngcontent-%COMP%]   code[_ngcontent-%COMP%]{font:inherit}.code-textarea[_ngcontent-%COMP%]{position:absolute;inset:0;padding:.75rem 1rem;border:none;background:transparent;color:transparent;caret-color:var(--%NS%sap-text);font-family:Cascadia Code,Consolas,monospace;font-size:.85rem;line-height:1.5;white-space:pre;overflow:auto;resize:none}.code-textarea[_ngcontent-%COMP%]::selection{background:color-mix(in srgb,var(--%NS%sap-primary) 35%,transparent)}.code-textarea[_ngcontent-%COMP%]:focus-visible{outline:none;box-shadow:none}`]})};export{U as LoadingIndicator};