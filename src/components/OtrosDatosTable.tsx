/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BarChart3, HelpCircle, ShieldCheck, Scale, Compass, Award } from "lucide-react";
import { MonthSummary } from "../types";

interface OtrosDatosTableProps {
  summary: MonthSummary;
}

export function OtrosDatosTable({ summary }: OtrosDatosTableProps) {
  const numFmt = (val: number, precision = 2) => 
    new Intl.NumberFormat("es-CL", { minimumFractionDigits: precision, maximumFractionDigits: precision }).format(val);

  const intFmt = (val: number) => 
    new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 }).format(val);

  // Determine productivity status
  const prodDiff = summary.productividadMes - summary.productividadMeta;
  const isMetaAchieved = prodDiff >= 0;

  return (
    <div className="bg-[#141414] rounded-xl border border-white/10 shadow-lg flex flex-col lg:flex-row overflow-hidden select-none">
      
      {/* Rotated Vertical Month Banner - Recreating the iconic widget sidebar from the image */}
      <div className="bg-[#0F0F0F] p-8 lg:w-32 flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-4 border-b lg:border-b-0 lg:border-r border-white/10 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.02),transparent)] pointer-events-none" />
        
        <span className="text-xs tracking-widest text-white/40 font-bold uppercase lg:mb-4">
          Resumen
        </span>
        
        {/* Large stylized rotated label */}
        <div className="lg:rotate-270 lg:transform lg:my-6 transition-transform duration-300">
          <span className="text-2xl lg:text-4xl font-extrabold text-[#F0F0F0] capitalize tracking-wider flex items-center">
            {summary.mes}
          </span>
        </div>

        <div className="flex gap-1 items-center bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded text-xs text-blue-400 font-mono font-bold mt-auto">
          MTR
        </div>
      </div>

      {/* Main Stats Data Grid */}
      <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* KPI Segment 1: Accumulated Volumes */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white/80 tracking-wider uppercase flex items-center gap-1.5 pb-2 border-b border-white/10">
            <Scale className="w-5 h-5 text-blue-500" />
            Volúmenes Acumulados
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0A0A0A] border border-white/5 hover:bg-white/[0.02] transition-colors">
              <span className="text-sm text-white/50">Tonelaje Acumulado</span>
              <div className="text-right">
                <span className="text-base font-bold font-mono text-white">
                  {numFmt(summary.tonelajeDespachadoAcumulado, 2)}
                </span>
                <span className="text-xs text-white/30 font-medium ml-1">t</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0A0A0A] border border-white/5 hover:bg-white/[0.02] transition-colors">
              <span className="text-sm text-white/50">m³ Acumulados</span>
              <div className="text-right">
                <span className="text-base font-bold font-mono text-white/90">
                  {intFmt(summary.m3Acumulados)}
                </span>
                <span className="text-xs text-white/30 font-medium ml-1">m³</span>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Segment 2: Logistics & Fleets */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white/80 tracking-wider uppercase flex items-center gap-1.5 pb-2 border-b border-white/10">
            <Compass className="w-5 h-5 text-blue-500" />
            Rendimiento del Transporte
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0A0A0A] border border-white/5 hover:bg-white/[0.02] transition-colors">
              <span className="text-sm text-white/50">Promedio por Camión (Ton)</span>
              <div className="text-right">
                <span className="text-base font-bold font-mono text-white">
                  {numFmt(summary.promedioCamionTon, 2)}
                </span>
                <span className="text-xs text-white/30 font-medium ml-1">t</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0A0A0A] border border-white/5 hover:bg-white/[0.02] transition-colors">
              <span className="text-sm text-white/50">Promedio por Camión (Vol.)</span>
              <div className="text-right">
                <span className="text-base font-bold font-mono text-white/90">
                  {numFmt(summary.promedioCamionM3, 2)}
                </span>
                <span className="text-xs text-white/30 font-medium ml-1">m³</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0A0A0A] border border-white/5 hover:bg-white/[0.02] transition-colors">
              <span className="text-sm text-white/50">Cantidad de Camiones (Viajes)</span>
              <div className="text-right font-bold font-mono text-base text-white/90">
                {intFmt(summary.cantidadCamiones)}
              </div>
            </div>
          </div>
        </div>

        {/* KPI Segment 3: Productivity metrics */}
        <div className="space-y-4 md:col-span-2 lg:col-span-1">
          <h3 className="text-sm font-bold text-white/80 tracking-wider uppercase flex items-center gap-1.5 pb-2 border-b border-white/10">
            <Award className="w-5 h-5 text-blue-500" />
            Productividad Mensual
          </h3>
          
          <div className="bg-[#0A0A0A] rounded-xl p-4 border border-white/5 flex flex-col justify-between h-[110px] hover:bg-white/[0.02] transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-white/40 uppercase font-semibold">Productividad Lograda</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className={`text-2xl font-extrabold font-mono ${isMetaAchieved ? "text-emerald-400" : "text-amber-400"}`}>
                    {numFmt(summary.productividadMes, 2)}
                  </span>
                  <span className="text-sm text-white/40">vs Meta {numFmt(summary.productividadMeta, 1)}</span>
                </div>
              </div>
              <span className={`text-xs font-mono px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                isMetaAchieved 
                  ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20" 
                  : "bg-amber-500/10 text-amber-300 border border-amber-500/20"
              }`}>
                {isMetaAchieved ? "Superada" : "Desviada"}
              </span>
            </div>

            {/* Micro visual progress gauge */}
            <div className="w-full bg-[#141414] h-2 rounded-full overflow-hidden mt-1 relative">
              <div
                className={`absolute left-0 top-0 h-full bg-blue-500/10`}
                style={{ width: "65%" }} // Meta ratio mark
              />
              <div
                className={`h-full rounded-full ${isMetaAchieved ? "bg-emerald-555 bg-emerald-500" : "bg-amber-555 bg-amber-500"}`}
                style={{ width: `${Math.min(100, (summary.productividadMes / 2) * 100)}%` }}
              />
              {/* White tick marker for meta ratio limit */}
              <div className="absolute h-full w-[2px] bg-red-400/80 top-0 left-[65%]" title="Meta de 1.3" />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
