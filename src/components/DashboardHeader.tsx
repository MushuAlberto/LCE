/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from "react";
import { Upload, Download, RefreshCw, Calendar, FileSpreadsheet, CheckCircle2, AlertCircle } from "lucide-react";
import { formatFullDateSpanish } from "../data";

interface DashboardHeaderProps {
  selectedDate: string;
  allDates: string[];
  onDateChange: (date: string) => void;
  onFileUpload: (file: File) => void;
  onDownloadTemplate: () => void;
  onResetData: () => void;
  isCustomFileLoaded: boolean;
  fileName: string | null;
}

export function DashboardHeader({
  selectedDate,
  allDates,
  onDateChange,
  onFileUpload,
  onDownloadTemplate,
  onResetData,
  isCustomFileLoaded,
  fileName,
}: DashboardHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "xlsx" && ext !== "xls" && ext !== "xlsm" && ext !== "csv") {
      setUploadStatus("error");
      setStatusMessage("Formato inválido. Cargue un archivo Excel (.xlsx, .xls, .xlsm) o CSV.");
      return;
    }

    try {
      onFileUpload(file);
      setUploadStatus("success");
      setStatusMessage(`"${file.name}" cargado correctamente.`);
      setTimeout(() => {
        setUploadStatus("idle");
      }, 5000);
    } catch (err) {
      setUploadStatus("error");
      setStatusMessage("No se pudo procesar el archivo.");
    }
  };

  return (
    <header className="w-full bg-[#0F0F0F] text-[#F0F0F0] rounded-xl p-8 shadow-xl border border-white/10">
      {/* Top Bar: Brand Logo & Information */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-white/10">
        {/* NOVANDINO Logo & Slogan */}
        <div className="flex items-center gap-4 self-start lg:self-center">
          <div className="relative flex items-center justify-center w-14 h-14 bg-blue-600 rounded-xl shadow-lg">
            {/* Elegant Polygon N Logo representing Mining / Lithium */}
            <svg viewBox="0 0 100 100" className="w-9 h-9 fill-none stroke-current text-white" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M25 80 V20 L75 80 V20" />
            </svg>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-ping" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-2xl tracking-widest text-[#F0F0F0]">
                NOVANDINO
              </span>
              <span className="text-xs uppercase font-bold bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-mono">
                LITIO
              </span>
            </div>
            <p className="text-xs tracking-[0.3em] text-white/40 font-semibold uppercase">
              SOMOS LITIO, SOMOS FUTURO
            </p>
          </div>
        </div>

        {/* Corporate Titles */}
        <div className="text-center lg:text-right flex-1 select-none">
          <h1 className="text-xl lg:text-2xl font-light tracking-widest text-white uppercase">
            Despacho Diario <span className="text-white/40">| Cloruro de Litio</span>
          </h1>
          <p className="text-sm font-semibold tracking-widest text-blue-400 mt-1 uppercase">
            Subgerencia Logística Litio &bull; Despacho Litio
          </p>
          <p className="text-xs font-medium tracking-widest text-white/30 uppercase mt-0.5">
            Salar de Atacama
          </p>
        </div>
      </div>

      {/* Control Area: Date Pickers & Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pt-6">
        
        {/* Date Selection Control */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-white/55 flex items-center gap-1.5 font-bold tracking-widest uppercase">
            <Calendar className="w-4 h-4 text-blue-500" />
            Fecha de Reporte (Día de Control)
          </label>
          <div className="flex gap-2 items-center">
            <select
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="flex-1 bg-[#0A0A0A] border border-white/10 rounded-lg px-5 py-3 text-base text-[#F0F0F0] focus:outline-none focus:border-blue-500 transition-colors cursor-pointer shadow-inner scrollbar-thin"
              id="date-select-picker"
            >
              {allDates.map((date) => {
                const dObj = new Date(date + "T00:00:00");
                const day = dObj.getDate();
                const month = dObj.toLocaleString("es-ES", { month: "short" });
                return (
                  <option key={date} value={date} className="bg-[#0A0A0A]">
                    {date} — {day} de {month}
                  </option>
                );
              })}
            </select>
          </div>
          <p className="text-xs text-white/40 mt-1 font-mono italic">
            Visualizando: {formatFullDateSpanish(selectedDate)}
          </p>
        </div>

        {/* Excel File Upload Area */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-white/55 flex items-center gap-1.5 font-bold tracking-widest uppercase">
            <FileSpreadsheet className="w-4 h-4 text-blue-500" />
            Cargar Matriz de Datos (Excel / XLSM / CSV)
          </label>
          
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex items-center justify-center gap-3 border border-dashed rounded-lg px-4 py-2 cursor-pointer transition-all duration-200 h-12 ${
              isDragOver
                ? "border-blue-500 bg-blue-950/10 text-blue-200"
                : isCustomFileLoaded
                ? "border-emerald-500/50 bg-emerald-950/10 hover:bg-emerald-900/10 text-emerald-200"
                : "border-white/10 bg-[#0A0A0A]/50 hover:bg-[#141414] text-white/60"
            }`}
            id="excel-drop-zone"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xlsx,.xls,.xlsm,.csv"
              className="hidden"
            />
            
            <Upload className={`w-5 h-5 ${isCustomFileLoaded ? "text-emerald-400" : "text-blue-500"}`} />
            <span className="text-sm truncate max-w-[240px] font-medium">
              {isCustomFileLoaded ? fileName : "Arrastre o seleccione su archivo Excel (.xlsx, .xlsm) o CSV"}
            </span>

            {isCustomFileLoaded && (
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.5 rounded font-mono uppercase">
                Activo
              </span>
            )}
          </div>

          {/* Feedback message overlay inside UI */}
          {uploadStatus !== "idle" && (
            <div className={`flex items-center gap-1.5 text-xs p-2 rounded mt-1 font-medium ${
              uploadStatus === "success" ? "bg-emerald-500/10 text-emerald-300 border border-emerald-400/20" : "bg-rose-500/10 text-rose-300 border border-rose-400/20"
            }`}>
              {uploadStatus === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
              <span className="truncate">{statusMessage}</span>
            </div>
          )}
        </div>

        {/* Operational Actions */}
        <div className="flex flex-col gap-2 justify-end">
          <label className="text-xs text-white/55 flex items-center gap-1.5 font-bold tracking-widest uppercase">
            Acciones Ejecutivas
          </label>
          <div className="grid grid-cols-2 gap-3 h-11">
            <button
              onClick={onDownloadTemplate}
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-200 active:bg-gray-300 transition-colors text-black rounded-lg text-sm font-bold uppercase tracking-widest shadow-md active:scale-95"
              title="Descargar plantilla de Excel pre-configurada"
              id="btn-download-excel-template"
            >
              <Download className="w-4 h-4 text-blue-600" />
              Plantilla
            </button>
            <button
              onClick={onResetData}
              disabled={!isCustomFileLoaded}
              className={`flex items-center justify-center gap-2 rounded-lg text-sm font-bold uppercase tracking-widest transition-all shadow-md active:scale-95 ${
                isCustomFileLoaded
                  ? "bg-transparent hover:bg-white/5 text-rose-400 border border-rose-500/20 hover:border-rose-500/40"
                  : "bg-transparent text-white/20 border border-white/5 pointer-events-none"
              }`}
              title="Restaurar base de datos histórica de demostración"
              id="btn-reset-excel-data"
            >
              <RefreshCw className={`w-4 h-4 ${isCustomFileLoaded ? "animate-pulse" : ""}`} />
              Restaurar
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}
