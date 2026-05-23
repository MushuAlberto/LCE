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

  // Status Color Picker for Compliance matching our brand colors
  const getStatusColor = (percent: number) => {
    if (percent >= 100) return "text-ionizado bg-ionizado/10 border-ionizado/20";
    if (percent >= 90) return "text-nucleo bg-nucleo/10 border-nucleo/20";
    if (percent >= 75) return "text-mineral bg-mineral/10 border-mineral/20";
    return "text-rose-600 bg-rose-50 border-rose-200";
  };

  const getProgressBarColor = (percent: number) => {
    if (percent >= 100) return "bg-ionizado";
    if (percent >= 90) return "bg-nucleo";
    if (percent >= 75) return "bg-mineral";
    return "bg-rose-500";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 select-none">
      
      {/* CARD 1: Programa Despacho (Toneladas) */}
      <div className="bg-white rounded-xl p-5 border border-nucleo/10 shadow-sm flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-nucleo/5 rounded-full blur-2xl group-hover:bg-nucleo/10 transition-all duration-300 pointer-events-none" />
        
        <div>
          <div className="flex justify-between items-start gap-2">
            <span className="text-[10px] font-bold tracking-widest text-[#461D77] uppercase">
              Prog. Despacho (Toneladas)
            </span>
            <span className="text-[10px] font-mono text-nucleo px-2 py-0.5 bg-nucleo/5 rounded-lg border border-nucleo/10">
              {formatShortDateSpanish(currentLog.fecha)}
            </span>
          </div>

          <div className="my-5 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-tecnico/50 font-medium">Programadas</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-bold font-mono text-tecnico">
                  {numFmt(currentLog.toneladasProgramadas, 0)}
                </span>
                <span className="text-xs text-tecnico/40 font-medium">t</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-tecnico/50 font-medium font-sans">Despachadas</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-bold font-mono text-ionizado">
                  {numFmt(currentLog.toneladasDespachadas, 2)}
                </span>
                <span className="text-xs text-ionizado/80 font-medium">t</span>
              </div>
            </div>
          </div>

          {/* TRUCK SVG WITH LIQUID brine level reflecting actual dispatch compliance */}
          <div className="w-full h-32 my-3 bg-calido rounded-xl relative flex items-center justify-center p-2 overflow-hidden border border-nucleo/10">
            {/* Ambient chemical background glow */}
            <div className="absolute -inset-1 opacity-5 bg-gradient-to-r from-nucleo to-litio blur-xl animate-pulse" />
            
            <svg viewBox="0 0 160 70" className="w-full max-w-[220px] h-24 relative z-10">
              {/* Ground road line */}
              <line x1="5" y1="58" x2="155" y2="58" stroke="rgba(70, 29, 119, 0.15)" strokeWidth="1.5" strokeDasharray="3 3" />
              
              {/* Truck Cabin (Front) */}
              <path d="M120 30 H138 Q145 30 145 38 V54 H120 Z" fill="#171717" stroke="rgba(70, 29, 119, 0.15)" strokeWidth="1.5" />
              {/* Cabin Glass */}
              <path d="M125 35 H135 Q138 35 138 40 V45 H125 Z" fill="#4FD1C5" opacity="0.6" className="animate-pulse" />
              {/* Cabin bumper & grill */}
              <rect x="141" y="48" width="6" height="6" rx="1" fill="#461D77" />
              <circle cx="143" cy="51" r="1.5" fill="#FAF5E6" />
              
              {/* Tanker Cylinder Back (Chassis & Tank) */}
              <rect x="15" y="20" width="102" height="30" rx="4" fill="#171717" stroke="rgba(70, 29, 119, 0.15)" strokeWidth="1.5" />
              
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
                  className="fill-nucleo/30 fill-litio/20"
                />
                {/* Flowing liquid wave line */}
                <path
                  d="M16 35 Q 40 33, 64 35 T 112 35 V 50 H 16 Z"
                  fill="url(#liquid-grad)"
                  className="animate-pulse opacity-80"
                />
              </g>

              {/* Tank labels - enlarged font size for superior readability */}
              <text x="65" y="38.5" fill="#FAF5E6" fontSize="11.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                {numFmt(currentLog.toneladasDespachadas, 1)} t
              </text>
              
              {/* Truck Wheels */}
              <circle cx="32" cy="56" r="8" fill="#171717" stroke="rgba(70, 29, 119, 0.15)" strokeWidth="1.5" />
              <circle cx="32" cy="56" r="3" fill="#FAF5E6" opacity="0.8" />
              <circle cx="50" cy="56" r="8" fill="#171717" stroke="rgba(70, 29, 119, 0.15)" strokeWidth="1.5" />
              <circle cx="50" cy="56" r="3" fill="#FAF5E6" opacity="0.8" />
              <circle cx="95" cy="56" r="8" fill="#171717" stroke="rgba(70, 29, 119, 0.15)" strokeWidth="1.5" />
              <circle cx="95" cy="56" r="3" fill="#FAF5E6" opacity="0.8" />
              <circle cx="132" cy="56" r="8" fill="#171717" stroke="rgba(70, 29, 119, 0.15)" strokeWidth="1.5" />
              <circle cx="132" cy="56" r="3" fill="#FAF5E6" opacity="0.8" />
            </svg>

            {/* Gradient definition */}
            <svg width="0" height="0">
              <defs>
                <linearGradient id="liquid-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#461D77" />
                  <stop offset="100%" stopColor="#4FD1C5" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* COMPLIANCE PERCENTAGE */}
        <div className="mt-4 pt-3 border-t border-nucleo/5 flex items-center justify-between">
          <span className="text-[10px] text-tecnico/50 font-semibold uppercase flex items-center gap-1">
            <Percent className="w-3.5 h-3.5 text-nucleo" /> Cumplimiento Diario
          </span>
          <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-lg border ${getStatusColor(tonCompliance)}`}>
            {numFmt(tonCompliance, 1)}%
          </span>
        </div>
        
        {/* Progress horizontal Indicator bar */}
        <div className="w-full bg-calido h-1.5 rounded-full mt-2 overflow-hidden border border-nucleo/5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(tonCompliance)}`}
            style={{ width: `${Math.min(100, tonCompliance)}%` }}
          />
        </div>
      </div>

      {/* CARD 2: Programa Despacho (Viajes) */}
      <div className="bg-white rounded-xl p-5 border border-nucleo/10 shadow-sm flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-nucleo/5 rounded-full blur-2xl group-hover:bg-nucleo/10 transition-all duration-300 pointer-events-none" />
        
        <div>
          <div className="flex justify-between items-start gap-2">
            <span className="text-[10px] font-bold tracking-widest text-[#461D77] uppercase">
              Prog. Despacho (Viajes)
            </span>
            <span className="text-[10px] font-mono text-nucleo px-2 py-0.5 bg-nucleo/5 rounded-lg border border-nucleo/10">
              Diario
            </span>
          </div>

          <div className="my-5 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-tecnico/50 font-medium">Programados</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-bold font-mono text-tecnico">
                  {intFmt(currentLog.viajesProgramados)}
                </span>
                <span className="text-xs text-tecnico/40 font-medium">Viajes</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-tecnico/50 font-medium">Realizados</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-bold font-mono text-ionizado">
                  {intFmt(currentLog.viajesRealizados)}
                </span>
                <span className="text-xs text-ionizado/85 font-medium">Viajes</span>
              </div>
            </div>
          </div>

          {/* VISUAL SHUTTLE ANIMATION RENDER */}
          <div className="w-full h-24 my-3 bg-calido rounded-xl relative flex flex-col justify-center gap-2 px-4 border border-nucleo/10">
            {/* Track 1: Backwards shadow */}
            <div className="relative w-full h-6 bg-white rounded-md border border-nucleo/5 flex items-center justify-between px-2 overflow-hidden">
              <span className="text-[8px] text-tecnico/40 font-mono tracking-wider">LÍNEA DE MEZCLADO</span>
              <div className="flex gap-2">
                <div className="w-5 h-1 bg-nucleo/10 rounded animate-pulse" />
                <div className="w-3 h-1 bg-litio/35 rounded" />
              </div>
            </div>
            {/* Track 2: Animated vehicle lane */}
            <div className="relative w-full h-9 bg-white rounded-md flex items-center overflow-hidden border border-nucleo/5">
              <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-nucleo/15 to-transparent top-1/2 -translate-y-1/2" />
              
              {/* Dynamic Animated Delivery Fleet */}
              <div className="flex gap-12 items-center w-max animate-[marquee_12s_linear_infinite]">
                <div className="flex items-center gap-1.5 bg-nucleo/10 border border-nucleo/20 px-1.5 py-0.5 rounded text-nucleo">
                  <Truck className="w-3.5 h-3.5 text-[#461D77]" />
                  <span className="text-[8px] font-mono">LITIO-07</span>
                </div>
                <div className="flex items-center gap-1.5 bg-ionizado/10 border border-ionizado/20 px-1.5 py-0.5 rounded text-ionizado font-bold">
                  <Truck className="w-3.5 h-3.5 text-[#3FAA88]" />
                  <span className="text-[8px] font-mono">LITIO-14</span>
                </div>
                <div className="flex items-center gap-1.5 bg-violeta/10 border border-violeta/20 px-1.5 py-0.5 rounded text-violeta">
                  <Truck className="w-3.5 h-3.5 text-[#7177EC]" />
                  <span className="text-[8px] font-mono">LITIO-11</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COMPLIANCE PERCENTAGE */}
        <div className="mt-4 pt-3 border-t border-nucleo/5 flex items-center justify-between">
          <span className="text-[10px] text-tecnico/50 font-semibold uppercase flex items-center gap-1">
            <Route className="w-3.5 h-3.5 text-nucleo" /> Vueltas Diarias
          </span>
          <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-lg border ${getStatusColor(tripsCompliance)}`}>
            {numFmt(tripsCompliance, 1)}%
          </span>
        </div>
        
        {/* Progress horizontal Indicator bar */}
        <div className="w-full bg-calido h-1.5 rounded-full mt-2 overflow-hidden border border-nucleo/5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(tripsCompliance)}`}
            style={{ width: `${Math.min(100, tripsCompliance)}%` }}
          />
        </div>
      </div>

      {/* CARD 3: Cumplimiento Mes en Curso (MTD Accums) */}
      <div className="bg-white rounded-xl p-5 border border-nucleo/10 shadow-sm flex flex-col justify-between relative overflow-hidden group xl:col-span-1">
        <div className="absolute top-0 right-0 w-32 h-32 bg-nucleo/5 rounded-full blur-2xl group-hover:bg-nucleo/10 transition-all duration-300 pointer-events-none" />
        
        <div>
          <div className="flex justify-between items-start gap-2">
            <span className="text-[10px] font-bold tracking-widest text-[#461D77] uppercase">
              Cumplimiento MTD ({summary.mes})
            </span>
            <span className="text-[10px] font-semibold text-nucleo px-2 py-0.5 bg-nucleo/5 rounded-lg border border-nucleo/10 flex items-center gap-1 font-mono font-bold">
              <TrendingUp className="w-3" /> ACUM.
            </span>
          </div>

          <div className="my-[13px] space-y-3">
            {/* Tonelaje Row */}
            <div className="bg-calido p-2.5 rounded-lg border border-nucleo/5">
              <div className="flex justify-between text-[10px] text-tecnico/60 font-semibold">
                <span>Tonelaje Acumulado</span>
                <span className="text-tecnico font-mono font-bold">
                  {numFmt(summary.cumplimientoTonelaje, 0)}%
                </span>
              </div>
              <div className="flex justify-between items-baseline mt-1">
                <span className="text-xs text-tecnico/40 font-mono">
                  {numFmt(summary.tonelajeProgramadoAcumulado, 0)} t
                </span>
                <span className="text-sm font-bold font-mono text-nucleo">
                  {numFmt(summary.tonelajeDespachadoAcumulado, 2)} t
                </span>
              </div>
              <div className="w-full bg-white h-1 rounded-full mt-1.5 overflow-hidden border border-nucleo/5">
                <div
                  className="h-full bg-nucleo rounded-full"
                  style={{ width: `${Math.min(100, summary.cumplimientoTonelaje)}%` }}
                />
              </div>
            </div>

            {/* Viajes Row */}
            <div className="bg-calido p-2.5 rounded-lg border border-nucleo/5">
              <div className="flex justify-between text-[10px] text-tecnico/60 font-semibold">
                <span>Viajes Acumulados</span>
                <span className="text-tecnico font-mono font-bold">
                  {numFmt(summary.cumplimientoViajes, 0)}%
                </span>
              </div>
              <div className="flex justify-between items-baseline mt-1">
                <span className="text-xs text-tecnico/45 font-mono">
                  {intFmt(summary.viajesProgramadosAcumulados)} viajes
                </span>
                <span className="text-sm font-bold font-mono text-ionizado">
                  {intFmt(summary.viajesDespachadosAcumulados)} viajes
                </span>
              </div>
              <div className="w-full bg-white h-1 rounded-full mt-1.5 overflow-hidden border border-nucleo/5">
                <div
                  className="h-full bg-ionizado rounded-full"
                  style={{ width: `${Math.min(100, summary.cumplimientoViajes)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* CUMPLIMIENTO GLOBAL DE VIAJES */}
        <div className="mt-2.5 pt-2 border-t border-nucleo/5 flex items-center justify-between">
          <span className="text-[10px] text-tecnico/50 font-semibold uppercase flex items-center gap-1">
            <CalendarCheck className="w-3.5 h-3.5 text-nucleo" /> Estado Mensual
          </span>
          <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-lg border ${getStatusColor(summary.cumplimientoTonelaje)}`}>
            {numFmt(summary.cumplimientoTonelaje, 1)}% MTD
          </span>
        </div>
      </div>

      {/* CARD 4: LCE - Salar de Atacama (Circular Progress donut representation) */}
      <div className="bg-white rounded-xl p-5 border border-nucleo/10 shadow-sm flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-nucleo/5 rounded-full blur-2xl transition-all duration-300 pointer-events-none" />
        
        <div>
          <div className="flex justify-between items-start gap-2">
            <span className="text-[10px] font-bold tracking-widest text-[#461D77] uppercase">
              LCE - Salar de Atacama
            </span>
            <span className="text-[10px] font-semibold text-nucleo px-2 py-0.5 bg-nucleo/5 rounded-lg border border-nucleo/10">
              Acum. Mes
            </span>
          </div>

          <div className="my-[13px] grid grid-cols-12 gap-2 items-center">
            {/* Values Column */}
            <div className="col-span-12 sm:col-span-7 space-y-2">
              <div>
                <p className="text-[10px] text-tecnico/50 font-semibold">LCE Programado</p>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-sm font-bold font-mono text-tecnico/70">
                    {intFmt(summary.lceProgramadoTotal)}
                  </span>
                  <span className="text-[10px] text-tecnico/40 font-semibold uppercase font-sans">t</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-tecnico/50 font-semibold">LCE Actual (SdA)</p>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-base font-extrabold font-mono text-nucleo">
                    {numFmt(summary.lceActualTotal, 2)}
                  </span>
                  <span className="text-[10px] text-nucleo font-semibold uppercase font-sans">t</span>
                </div>
              </div>
            </div>

            {/* Glowing Donut Column (using dynamic SVG) */}
            <div className="col-span-12 sm:col-span-5 flex justify-center items-center relative">
              <svg viewBox="0 0 100 100" className="w-18 h-18 rotate-270">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#FAF5E6" strokeWidth="12" />
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
                <span className="text-[11px] font-bold font-mono text-tecnico leading-none font-bold">
                  {numFmt(summary.lceCumplimiento, 0)}%
                </span>
                <span className="text-[7px] text-tecnico/55 uppercase font-semibold scale-90 tracking-wide mt-0.5">
                  Meta LCE
                </span>
              </div>
              
              {/* Gradient definitions for donut */}
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="donut-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#461D77" />
                    <stop offset="100%" stopColor="#4FD1C5" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/* POZAS MONITOR & FOOTER STATUS */}
        <div className="mt-2.5 pt-2 border-t border-nucleo/5 flex items-center justify-between">
          <span className="text-[9px] text-tecnico/50 font-semibold uppercase flex items-center gap-1 mt-0.5 font-sans">
            <Layers className="w-3.5 h-3.5 text-nucleo" /> Nivel Pozas PQLC:
          </span>
          <span className={`text-[10px] font-semibold font-mono px-2 py-0.5 rounded border ${
            currentLog.nivelPozasPqlc === "S/D" 
              ? "bg-calido text-tecnico/40 border-nucleo/10" 
              : "bg-ionizado/10 text-ionizado border-ionizado/15"
          }`}>
            {currentLog.nivelPozasPqlc}
          </span>
        </div>
      </div>

    </div>
  );
}
