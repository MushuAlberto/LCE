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
import html2canvas from "html2canvas";

export default function App() {
  // Application states
  const [logs, setLogs] = useState(defaultDailyLogs);
  const [selectedDate, setSelectedDate] = useState("2026-05-20");
  const [isCustomFileLoaded, setIsCustomFileLoaded] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [excelOverrides, setExcelOverrides] = useState<ExcelOverrides | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

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
      const overridenLceActualTotal = excelOverrides.lceActualTotal !== undefined ? excelOverrides.lceActualTotal : baseSummary.lceActualTotal;
      const overridenLceProgramadoTotal = excelOverrides.lceProgramadoTotal !== undefined ? excelOverrides.lceProgramadoTotal : baseSummary.lceProgramadoTotal;
      const overridenLceCumplimiento = overridenLceProgramadoTotal > 0 ? (overridenLceActualTotal / overridenLceProgramadoTotal) * 100 : 0;
      return {
        ...baseSummary,
        tonelajeDespachadoAcumulado: excelOverrides.tonelajeAcumulado !== undefined ? excelOverrides.tonelajeAcumulado : baseSummary.tonelajeDespachadoAcumulado,
        m3Acumulados: excelOverrides.m3Acumulados !== undefined ? excelOverrides.m3Acumulados : baseSummary.m3Acumulados,
        promedioCamionTon: excelOverrides.promedioCamionTon !== undefined ? excelOverrides.promedioCamionTon : baseSummary.promedioCamionTon,
        promedioCamionM3: excelOverrides.promedioCamionM3 !== undefined ? excelOverrides.promedioCamionM3 : baseSummary.promedioCamionM3,
        cantidadCamiones: excelOverrides.cantidadCamiones !== undefined ? excelOverrides.cantidadCamiones : baseSummary.cantidadCamiones,
        viajesDespachadosAcumulados: excelOverrides.cantidadCamiones !== undefined ? excelOverrides.cantidadCamiones : baseSummary.viajesDespachadosAcumulados,
        productividadMes: excelOverrides.productividadMes !== undefined ? excelOverrides.productividadMes : baseSummary.productividadMes,
        lceProgramadoTotal: overridenLceProgramadoTotal,
        lceActualTotal: overridenLceActualTotal,
        lceCumplimiento: overridenLceCumplimiento,
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

      // Deduplicate parsed logs by date to solve Recharts & dropdown options duplicate key errors safely
      const uniqueLogsMap = new Map<string, typeof parsed.logs[0]>();
      parsed.logs.forEach(log => {
        if (log.fecha) {
          uniqueLogsMap.set(log.fecha, log);
        }
      });
      const uniqueLogs = Array.from(uniqueLogsMap.values()).sort((a, b) => a.fecha.localeCompare(b.fecha));

      setLogs(uniqueLogs);
      setExcelOverrides(parsed.overrides || null);
      setIsCustomFileLoaded(true);
      setFileName(file.name);
      
      // Auto-select the last parsed date so the dashboard isn't blank
      const lastDate = uniqueLogs[uniqueLogs.length - 1]?.fecha || "2026-05-20";
      setSelectedDate(lastDate);
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err?.message || err || "Error al procesar el archivo de Excel.");
    }
  };

  const handleDownloadImage = () => {
    setIsCapturing(true);
    setErrorNotice(null);
    // Let the DOM/render cycle align
    setTimeout(async () => {
      const element = document.getElementById("dashboard-capture-area");
      if (!element) {
        setIsCapturing(false);
        setErrorNotice("No se pudo encontrar el área del tablero para la captura.");
        return;
      }
      try {
        const canvas = await html2canvas(element, {
          backgroundColor: "#FAF5E6", // Match --color-calido
          scale: 2.0, // Crisp image resolution without extra lag
          useCORS: true,
          logging: false,
          allowTaint: false, // Must be false or canvas.toDataURL fails with SecurityError
          onclone: (clonedDoc) => {
            const clonedEl = clonedDoc.getElementById("dashboard-capture-area");
            if (clonedEl) {
              // Add nice framing padding only for the downloaded high-resolution image
              clonedEl.style.padding = "28px";
              clonedEl.style.borderRadius = "16px";
            }
          }
        });
        
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `NOVANDINO_Reporte_Despacho_${selectedDate}.png`;
        link.href = dataUrl;
        
        // Dynamic appending is extremely critical for reliable downloads inside iframe sandboxes
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err: any) {
        console.error("Error al generar la imagen del tablero:", err);
        setErrorNotice(`No se pudo descargar la imagen: ${err?.message || err}`);
      } finally {
        setIsCapturing(false);
      }
    }, 250);
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
    <div className="min-h-screen bg-calido text-tecnico p-4 sm:p-6 lg:p-8 font-sans antialiased selection:bg-nucleo/10 relative">
      
      {/* Subtle modern corporate radial highlight in brand purple / aquamarine */}
      <div className="absolute top-0 left-1/4 w-[35rem] h-[35rem] bg-nucleo/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-1/4 right-0 w-[20rem] h-[20rem] bg-litio/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        
        {/* Error Alert Display */}
        {errorNotice && (
          <div className="bg-rose-50 border border-rose-200 text-rose-900 px-6 py-4 rounded-xl flex items-center gap-4 shadow-md">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-bold text-xs uppercase tracking-widest text-rose-950">Error de Estructura de Datos</h4>
              <p className="text-xs text-rose-700 mt-0.5">{errorNotice}</p>
            </div>
            <button 
              onClick={() => setErrorNotice(null)}
              className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-rose-100 hover:bg-rose-200 rounded border border-rose-200 active:scale-95 transition-all text-rose-900"
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
          onDownloadImage={handleDownloadImage}
          onResetData={handleResetData}
          isCustomFileLoaded={isCustomFileLoaded}
          fileName={fileName}
          isCapturing={isCapturing}
        />

        {/* Captured Content Wrapper representing everything requested in the attached image */}
        <div id="dashboard-capture-area" className="flex flex-col gap-6 bg-calido">
          {/* SECTION: Quick Status Overview Title */}
          <div className="flex flex-col gap-1 select-none border-l-2 border-nucleo pl-3">
            <span className="text-[10px] font-black tracking-[0.25em] text-[#3FAA88] uppercase">
              NOVANDINO
            </span>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-nucleo" />
              <h2 className="text-xs font-bold tracking-[0.2em] text-nucleo uppercase">
                Estadísticas e Indicadores Clave (KPI)
              </h2>
            </div>
          </div>

          {/* High-Fidelity KPI Despatch & Compliance Cards */}
          <KPICards currentLog={currentLog} summary={summary} />

          {/* "Otros Datos" Widget Table */}
          <OtrosDatosTable summary={summary} />

          {/* Interactive Month Charts & Graphs */}
          <DashboardCharts logs={logs} selectedDate={selectedDate} />
        </div>

        {/* Sticky Executive Footer with general helpful notes */}
        <footer className="pt-8 pb-4 text-center border-t border-nucleo/15 select-none text-[9px] tracking-[0.3em] text-tecnico/40 uppercase">
          <p className="font-sans">
            Tablero Gerencial de Control &bull; Novandino Litio &copy; {new Date().getFullYear()} &bull; Confidencial e Interno
          </p>
        </footer>

      </div>
    </div>
  );
}
