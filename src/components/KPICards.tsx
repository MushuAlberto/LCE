/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { TrendingUp, Truck, Route, CalendarCheck, Percent, Layers, ShieldCheck } from "lucide-react";
import { DailyLog, MonthSummary } from "../types";
import { formatShortDateSpanish } from "../data";

interface KPICardsProps {
  currentLog: DailyLog;
  summary: MonthSummary;
}

export function KPICards({ currentLog, summary }: KPICardsProps) {
  // Safe calculation helper of percentages
  const tonCompliance = currentLog.toneladasProgramadas > 0 
    ? (currentLog.toneladasDespachadas / currentLog.toneladasProgramadas) * 100 
    : 0;

  const tripsCompliance = currentLog.viajesProgramados > 0 
    ? (currentLog.viajesRealizados / currentLog.viajesProgramados) * 100 
    : 0;

  // Formatting helper
  const numFmt = (val: number, precision = 2) => 
    new Intl.NumberFormat("es-CL", { minimumFractionDigits: precision, maximumFractionDigits: precision }).format(val);

  const intFmt = (val: number) => 
    new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 }).format(val);

  // Status Color Picker for Compliance
  const getStatusColor = (percent: number) => {
    if (percent >= 100) return "text-emerald-400 bg-emerald-500/10 border-emerald-400/20";
    if (percent >= 90) return "text-blue-400 bg-blue-500/10 border-blue-400/20";
    if (percent >= 75) return "text-amber-400 bg-amber-500/10 border-amber-400/20";
    return "text-rose-400 bg-rose-500/10 border-rose-400/20";
  };

  const getProgressBarColor = (percent: number) => {
    if (percent >= 100) return "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]";
    if (percent >= 90) return "bg-gradient-to-r from-blue-600 to-cyan-500 shadow-[0_0_12px_rgba(37,99,235,0.2)]";
    if (percent >= 75) return "bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_12px_rgba(245,158,11,0.2)]";
    return "bg-gradient-to-r from-rose-500 to-orange-400 shadow-[0_0_12px_rgba(239,68,68,0.2)]";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 select-none">
      
      {/* CARD 1: Programa Despacho (Toneladas) */}
      <div className="bg-[#141414] rounded-xl p-5 border border-white/10 shadow-lg flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-300" />
        
        <div>
          <div className="flex justify-between items-start gap-2">
            <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
              Prog. Despacho (Toneladas)
            </span>
            <span className="text-[10px] font-mono text-white/50 px-2 py-0.5 bg-white/5 rounded-lg border border-white/10">
              {formatShortDateSpanish(currentLog.fecha)}
            </span>
          </div>

          <div className="my-5 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-white/45 font-medium">Programadas</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-bold font-mono text-white/90">
                  {numFmt(currentLog.toneladasProgramadas, 0)}
                </span>
                <span className="text-xs text-white/40 font-medium">t</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-white/45 font-medium font-sans">Despachadas</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-bold font-mono text-blue-400">
                  {numFmt(currentLog.toneladasDespachadas, 2)}
                </span>
                <span className="text-xs text-blue-400/70 font-medium">t</span>
              </div>
            </div>
          </div>

          {/* TRUCK SVG WITH LIQUID brine level reflecting actual dispatch compliance */}
          <div className="w-full h-24 my-3 bg-[#0A0A0A] rounded-xl relative flex items-center justify-center p-2 overflow-hidden border border-white/10">
            {/* Ambient chemical background glow */}
            <div className="absolute -inset-1 opacity-5 bg-gradient-to-r from-blue-700 to-indigo-500 blur-xl animate-pulse" />
            
            <svg viewBox="0 0 160 70" className="w-36 h-20 relative z-10">
              {/* Ground road line */}
              <line x1="5" y1="58" x2="155" y2="58" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" strokeDasharray="3 3" />
              
              {/* Truck Cabin (Front) */}
              <path d="M120 30 H138 Q145 30 145 38 V54 H120 Z" fill="#1C1C1C" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" />
              {/* Cabin Glass */}
              <path d="M125 35 H135 Q138 35 138 40 V45 H125 Z" fill="#9de4ff" opacity="0.3" className="animate-pulse" />
              {/* Cabin bumper & grill */}
              <rect x="141" y="48" width="6" height="6" rx="1" fill="#2C2C2C" />
              <circle cx="143" cy="51" r="1.5" fill="#ffffff" />
              
              {/* Tanker Cylinder Back (Chassis & Tank) */}
              <rect x="15" y="20" width="102" height="30" rx="4" fill="#141414" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" />
              
              {/* Brine (Liquid Lithium Solution representation inside the tank of the truck!) */}
              <mask id="tank-mask">
                <rect x="16.5" y="21.5" width="99" height="27" rx="3" fill="white" />
              </mask>
              <g mask="url(#tank-mask)">
                {/* Simulated liquid gradient */}
                <rect
                  x="16.5"
                  y={`${50 - Math.min(27, Math.max(1, 27 * (tonCompliance / 100)))}`}
                  width="100"
                  height="30"
                  className="fill-blue-500/20 fill-emerald-400/10"
                />
                {/* Flowing liquid wave line */}
                <path
                  d="M16 35 Q 40 33, 64 35 T 112 35 V 50 H 16 Z"
                  fill="url(#liquid-grad)"
                  className="animate-pulse opacity-80"
                />
              </g>

              {/* Tank labels */}
              <text x="65" y="38" fill="#F0F0F0" fontSize="8.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                {numFmt(currentLog.toneladasDespachadas, 1)} t
              </text>
              
              {/* Truck Wheels */}
              <circle cx="32" cy="56" r="8" fill="#0A0A0A" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" />
              <circle cx="32" cy="56" r="3" fill="#ffffff" opacity="0.4" />
              <circle cx="50" cy="56" r="8" fill="#0A0A0A" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" />
              <circle cx="50" cy="56" r="3" fill="#ffffff" opacity="0.4" />
              <circle cx="95" cy="56" r="8" fill="#0A0A0A" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" />
              <circle cx="95" cy="56" r="3" fill="#ffffff" opacity="0.4" />
              <circle cx="132" cy="56" r="8" fill="#0A0A0A" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" />
              <circle cx="132" cy="56" r="3" fill="#ffffff" opacity="0.4" />
            </svg>

            {/* Gradient definition */}
            <svg width="0" height="0">
              <defs>
                <linearGradient id="liquid-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* COMPLIANCE PERCENTAGE */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
          <span className="text-[10px] text-white/40 font-semibold uppercase flex items-center gap-1">
            <Percent className="w-3 h-3 text-blue-500" /> Cumplimiento Diario
          </span>
          <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-lg border ${getStatusColor(tonCompliance)}`}>
            {numFmt(tonCompliance, 1)}%
          </span>
        </div>
        
        {/* Progress horizontal Indicator bar */}
        <div className="w-full bg-[#0A0A0A] h-1.5 rounded-full mt-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${tonCompliance >= 100 ? "bg-emerald-500" : tonCompliance >= 90 ? "bg-blue-500" : tonCompliance >= 75 ? "bg-amber-500" : "bg-rose-500"}`}
            style={{ width: `${Math.min(100, tonCompliance)}%` }}
          />
        </div>
      </div>

      {/* CARD 2: Programa Despacho (Viajes) */}
      <div className="bg-[#141414] rounded-xl p-5 border border-white/10 shadow-lg flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-300" />
        
        <div>
          <div className="flex justify-between items-start gap-2">
            <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
              Prog. Despacho (Viajes)
            </span>
            <span className="text-[10px] font-mono text-white/50 px-2 py-0.5 bg-white/5 rounded-lg border border-white/10">
              Diario
            </span>
          </div>

          <div className="my-5 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-white/45 font-medium">Programados</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-bold font-mono text-white/90">
                  {intFmt(currentLog.viajesProgramados)}
                </span>
                <span className="text-xs text-white/40 font-medium">Viajes</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-white/45 font-medium">Realizados</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-bold font-mono text-emerald-400">
                  {intFmt(currentLog.viajesRealizados)}
                </span>
                <span className="text-xs text-emerald-400/80 font-medium">Viajes</span>
              </div>
            </div>
          </div>

          {/* VISUAL SHUTTLE ANIMATION RENDER */}
          <div className="w-full h-24 my-3 bg-[#0A0A0A] rounded-xl relative flex flex-col justify-center gap-2 px-4 border border-white/10">
            {/* Track 1: Backwards shadow */}
            <div className="relative w-full h-6 bg-white/5 rounded-md border border-white/5 flex items-center justify-between px-2 overflow-hidden">
              <span className="text-[8px] text-white/30 font-mono tracking-wider">LÍNEA DE MEZCLADO</span>
              <div className="flex gap-2">
                <div className="w-5 h-1 bg-blue-500/10 rounded animate-pulse" />
                <div className="w-3 h-1 bg-emerald-500/15 rounded" />
              </div>
            </div>
            {/* Track 2: Animated vehicle lane */}
            <div className="relative w-full h-9 bg-white/5 rounded-md flex items-center overflow-hidden border border-white/5">
              <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/15 to-transparent top-1/2 -translate-y-1/2" />
              
              {/* Dynamic Animated Delivery Fleet */}
              <div className="flex gap-12 items-center w-max animate-[marquee_12s_linear_infinite]">
                <div className="flex items-center gap-1.5 bg-blue-900/10 border border-blue-500/10 px-1.5 py-0.5 rounded text-blue-300">
                  <Truck className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[8px] font-mono">LITIO-07</span>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-950/10 border border-emerald-500/10 px-1.5 py-0.5 rounded text-emerald-300">
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[8px] font-mono">LITIO-14</span>
                </div>
                <div className="flex items-center gap-1.5 bg-blue-950/10 border border-blue-400/10 px-1.5 py-0.5 rounded text-blue-300 animate-pulse">
                  <Truck className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[8px] font-mono">LITIO-11</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COMPLIANCE PERCENTAGE */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
          <span className="text-[10px] text-white/40 font-semibold uppercase flex items-center gap-1">
            <Route className="w-3.5 h-3.5 text-blue-500" /> Vueltas Diarias
          </span>
          <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-lg border ${getStatusColor(tripsCompliance)}`}>
            {numFmt(tripsCompliance, 1)}%
          </span>
        </div>
        
        {/* Progress horizontal Indicator bar */}
        <div className="w-full bg-[#0A0A0A] h-1.5 rounded-full mt-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${tripsCompliance >= 100 ? "bg-emerald-500" : tripsCompliance >= 90 ? "bg-blue-500" : tripsCompliance >= 75 ? "bg-amber-500" : "bg-rose-500"}`}
            style={{ width: `${Math.min(100, tripsCompliance)}%` }}
          />
        </div>
      </div>

      {/* CARD 3: Cumplimiento Mes en Curso (MTD Accums) */}
      <div className="bg-[#141414] rounded-xl p-5 border border-white/10 shadow-lg flex flex-col justify-between relative overflow-hidden group xl:col-span-1">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-300" />
        
        <div>
          <div className="flex justify-between items-start gap-2">
            <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
              Cumplimiento MTD ({summary.mes})
            </span>
            <span className="text-[10px] font-semibold text-blue-400 px-2 py-0.5 bg-blue-500/10 rounded-lg border border-blue-500/20 flex items-center gap-1 font-mono">
              <TrendingUp className="w-3 h-3" /> ACUM.
            </span>
          </div>

          <div className="my-[13px] space-y-3">
            {/* Tonelaje Row */}
            <div className="bg-[#0A0A0A] p-2.5 rounded-lg border border-white/5">
              <div className="flex justify-between text-[10px] text-white/50 font-medium">
                <span>Tonelaje Acumulado</span>
                <span className="text-[#F0F0F0] font-mono font-bold">
                  {numFmt(summary.cumplimientoTonelaje, 0)}%
                </span>
              </div>
              <div className="flex justify-between items-baseline mt-1">
                <span className="text-xs text-white/35 font-mono">
                  {numFmt(summary.tonelajeProgramadoAcumulado, 0)} t
                </span>
                <span className="text-sm font-bold font-mono text-white">
                  {numFmt(summary.tonelajeDespachadoAcumulado, 2)} t
                </span>
              </div>
              <div className="w-full bg-[#141414] h-1 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${Math.min(100, summary.cumplimientoTonelaje)}%` }}
                />
              </div>
            </div>

            {/* Viajes Row */}
            <div className="bg-[#0A0A0A] p-2.5 rounded-lg border border-white/5">
              <div className="flex justify-between text-[10px] text-white/50 font-medium">
                <span>Viajes Acumulados</span>
                <span className="text-[#F0F0F0] font-mono font-bold">
                  {numFmt(summary.cumplimientoViajes, 0)}%
                </span>
              </div>
              <div className="flex justify-between items-baseline mt-1">
                <span className="text-xs text-white/35 font-mono">
                  {intFmt(summary.viajesProgramadosAcumulados)} viajes
                </span>
                <span className="text-sm font-bold font-mono text-white">
                  {intFmt(summary.viajesDespachadosAcumulados)} viajes
                </span>
              </div>
              <div className="w-full bg-[#141414] h-1 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${Math.min(100, summary.cumplimientoViajes)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* CUMPLIMIENTO GLOBAL DE VIAJES */}
        <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between">
          <span className="text-[10px] text-white/40 font-semibold uppercase flex items-center gap-1">
            <CalendarCheck className="w-3.5 h-3.5 text-blue-500" /> Estado Mensual
          </span>
          <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-lg border ${getStatusColor(summary.cumplimientoTonelaje)}`}>
            {numFmt(summary.cumplimientoTonelaje, 1)}% MTD
          </span>
        </div>
      </div>

      {/* CARD 4: LCE - Salar de Atacama (Circular Progress donut representation) */}
      <div className="bg-[#141414] rounded-xl p-5 border border-white/10 shadow-lg flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl transition-all duration-300" />
        
        <div>
          <div className="flex justify-between items-start gap-2">
            <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
              LCE - Salar de Atacama
            </span>
            <span className="text-[10px] font-semibold text-blue-400 px-2 py-0.5 bg-blue-500/10 rounded-lg border border-blue-500/10">
              Acum. Mes
            </span>
          </div>

          <div className="my-[13px] grid grid-cols-12 gap-2 items-center">
            {/* Values Column */}
            <div className="col-span-7 space-y-2">
              <div>
                <p className="text-[10px] text-white/40 font-medium">LCE Programado</p>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-sm font-bold font-mono text-white/85">
                    {intFmt(summary.lceProgramadoTotal)}
                  </span>
                  <span className="text-[10px] text-white/40 font-semibold uppercase font-sans">t</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-white/45 font-medium">LCE Actual (SdA)</p>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-base font-extrabold font-mono text-blue-450 text-[#F0F0F0]">
                    {numFmt(summary.lceActualTotal, 2)}
                  </span>
                  <span className="text-[10px] text-blue-450 font-semibold uppercase font-sans text-blue-400">t</span>
                </div>
              </div>
            </div>

            {/* Glowing Donut Column (using dynamic SVG) */}
            <div className="col-span-5 flex justify-center items-center relative">
              <svg viewBox="0 0 100 100" className="w-18 h-18 transform -rotate-90">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#0A0A0A" strokeWidth="12" />
                {/* Colored Dynamic Value Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="url(#donut-grad)"
                  strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - Math.min(100, summary.lceCumplimiento) / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              {/* Inner compliance text label in donut center */}
              <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-center items-center">
                <span className="text-[11px] font-bold font-mono text-[#F0F0F0] leading-none">
                  {numFmt(summary.lceCumplimiento, 0)}%
                </span>
                <span className="text-[7px] text-white/40 uppercase font-semibold scale-90 tracking-wide mt-0.5">
                  Meta LCE
                </span>
              </div>
              
              {/* Gradient definitions for donut */}
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="donut-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e3a8a" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#60a5fa" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/* POZAS MONITOR & FOOTER STATUS */}
        <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between">
          <span className="text-[9px] text-white/40 font-semibold uppercase flex items-center gap-1 mt-0.5 font-sans">
            <Layers className="w-3.5 h-3.5 text-blue-500" /> Nivel Pozas PQLC:
          </span>
          <span className={`text-[10px] font-semibold font-mono px-2 py-0.5 rounded border ${
            currentLog.nivelPozasPqlc === "S/D" 
              ? "bg-white/5 text-white/40 border-white/10" 
              : "bg-emerald-500/15 text-emerald-300 border-emerald-500/20"
          }`}>
            {currentLog.nivelPozasPqlc}
          </span>
        </div>
      </div>

    </div>
  );
}
