/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import { defaultDailyLogs, computeSummaryForDate } from "./data";
import { DashboardHeader } from "./components/DashboardHeader";
import { KPICards } from "./components/KPICards";
import { OtrosDatosTable } from "./components/OtrosDatosTable";
import { DashboardCharts } from "./components/DashboardCharts";
import { downloadExcelTemplate, parseUploadedExcel } from "./utils/excelGenerator";
import { BarChart3, ListFilter, AlertCircle, Sparkles } from "lucide-react";
import { ExcelOverrides } from "./types";

export default function App() {
  // Application states
  const [logs, setLogs] = useState(defaultDailyLogs);
  const [selectedDate, setSelectedDate] = useState("2026-05-20");
  const [isCustomFileLoaded, setIsCustomFileLoaded] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [excelOverrides, setExcelOverrides] = useState<ExcelOverrides | null>(null);

  // Derive unique absolute dates available in logs (sorted chronologically)
  const allDates = useMemo(() => {
    return Array.from(new Set(logs.map((log) => log.fecha)));
  }, [logs]);

  // Read current selected daily log
  const currentLog = useMemo(() => {
    const found = logs.find((log) => log.fecha === selectedDate);
    // Fallback if date is not found
    return found || logs[logs.length - 1] || defaultDailyLogs[19];
  }, [logs, selectedDate]);

  // Compute month summary statistics accumulated up to selected date
  const summary = useMemo(() => {
    const baseSummary = computeSummaryForDate(logs, selectedDate);
    if (isCustomFileLoaded && excelOverrides) {
      return {
        ...baseSummary,
        tonelajeDespachadoAcumulado: excelOverrides.tonelajeAcumulado !== undefined ? excelOverrides.tonelajeAcumulado : baseSummary.tonelajeDespachadoAcumulado,
        m3Acumulados: excelOverrides.m3Acumulados !== undefined ? excelOverrides.m3Acumulados : baseSummary.m3Acumulados,
        promedioCamionTon: excelOverrides.promedioCamionTon !== undefined ? excelOverrides.promedioCamionTon : baseSummary.promedioCamionTon,
        promedioCamionM3: excelOverrides.promedioCamionM3 !== undefined ? excelOverrides.promedioCamionM3 : baseSummary.promedioCamionM3,
        cantidadCamiones: excelOverrides.cantidadCamiones !== undefined ? excelOverrides.cantidadCamiones : baseSummary.cantidadCamiones,
        viajesDespachadosAcumulados: excelOverrides.cantidadCamiones !== undefined ? excelOverrides.cantidadCamiones : baseSummary.viajesDespachadosAcumulados,
        productividadMes: excelOverrides.productividadMes !== undefined ? excelOverrides.productividadMes : baseSummary.productividadMes,
      };
    }
    return baseSummary;
  }, [logs, selectedDate, excelOverrides, isCustomFileLoaded]);

  // Handlers
  const handleFileUpload = async (file: File) => {
    try {
      setErrorNotice(null);
      const parsed = await parseUploadedExcel(file);
      
      if (parsed.logs.length === 0) {
        throw new Error("No se encontraron registros de días válidos.");
      }

      setLogs(parsed.logs);
      setExcelOverrides(parsed.overrides || null);
      setIsCustomFileLoaded(true);
      setFileName(file.name);
      
      // Auto-select the last parsed date so the dashboard isn't blank
      const lastDate = parsed.logs[parsed.logs.length - 1]?.fecha || "2026-05-20";
      setSelectedDate(lastDate);
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err?.message || err || "Error al procesar el archivo de Excel.");
    }
  };

  const handleDownloadTemplate = () => {
    downloadExcelTemplate(defaultDailyLogs);
  };

  const handleResetData = () => {
    setErrorNotice(null);
    setLogs(defaultDailyLogs);
    setExcelOverrides(null);
    setIsCustomFileLoaded(false);
    setFileName(null);
    setSelectedDate("2026-05-20");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F0F0F0] p-4 sm:p-6 lg:p-8 font-sans antialiased selection:bg-white/10">
      
      {/* Subtle modern corporate radial highlight */}
      <div className="absolute top-0 left-1/4 w-[35rem] h-[35rem] bg-blue-950/15 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-1/4 right-0 w-[20rem] h-[20rem] bg-slate-900/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        
        {/* Error Alert Display */}
        {errorNotice && (
          <div className="bg-rose-950/30 border border-rose-500/20 text-rose-200 px-6 py-4 rounded-xl flex items-center gap-4 shadow-xl">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-bold text-xs uppercase tracking-widest">Error de Estructura de Datos</h4>
              <p className="text-xs text-rose-300 mt-0.5">{errorNotice}</p>
            </div>
            <button 
              onClick={() => setErrorNotice(null)}
              className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded border border-white/10 active:scale-95 transition-all text-white/80"
            >
              Descartar
            </button>
          </div>
        )}

        {/* Dashboard Header Panel */}
        <DashboardHeader
          selectedDate={selectedDate}
          allDates={allDates}
          onDateChange={setSelectedDate}
          onFileUpload={handleFileUpload}
          onDownloadTemplate={handleDownloadTemplate}
          onResetData={handleResetData}
          isCustomFileLoaded={isCustomFileLoaded}
          fileName={fileName}
        />

        {/* SECTION: Quick Status Overview Title */}
        <div className="flex items-center gap-2 select-none border-l-2 border-white/60 pl-3">
          <BarChart3 className="w-4 h-4 text-blue-500" />
          <h2 className="text-xs font-bold tracking-[0.2em] text-white/80 uppercase">
            Estadísticas e Indicadores Clave (KPI)
          </h2>
        </div>

        {/* High-Fidelity KPI Despatch & Compliance Cards */}
        <KPICards currentLog={currentLog} summary={summary} />

        {/* "Otros Datos" Widget Table */}
        <OtrosDatosTable summary={summary} />

        {/* Interactive Month Charts & Graphs */}
        <DashboardCharts logs={logs} selectedDate={selectedDate} />

        {/* Sticky Executive Footer with general helpful notes */}
        <footer className="pt-8 pb-4 text-center border-t border-white/10 select-none text-[9px] tracking-[0.3em] text-white/30 uppercase">
          <p className="font-sans">
            Tablero Gerencial de Control &bull; Novandino Litio &copy; {new Date().getFullYear()} &bull; Confidencial e Interno
          </p>
        </footer>

      </div>
    </div>
  );
}
