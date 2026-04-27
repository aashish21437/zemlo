"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, Trash2, BookOpen, FileText, ChevronRight, AlertTriangle, Search, Plus, X } from 'lucide-react';
import { getItineraryByCode, deleteItinerary, searchSightseeing, saveItineraryData } from '../../actions';
import { searchHyperdia, type RouteData } from '@/app/trains/actions';
import { TrainRouteCard, TrainIcon } from '@/components/TrainRouteCard';

// ─── Types ────────────────────────────────────────────────────────────────────
interface SightseeingEntry {
  name: string;
  adultPrice: number | null;
}

export interface TrainLeg {
  id: string;
  from: string;
  train: string;
  to: string;
  duration: string;
}

export interface TrainEntry {
  id: string;
  ticketType: 'Standard' | 'Green';
  price: number;
  legs: TrainLeg[];
}

interface ItinRow {
  date: string;
  vehicle: string;
  vehicleCity: string;
  vendorName: string;
  vehicleServiceType: string;
  vehicleAmount: number | null;
  guide: string;
  serviceTime: string;
  sightseeings: SightseeingEntry[];
  mealBreakfast: boolean;
  mealLunch: boolean;
  mealDinner: boolean;
  hotelName: string;
  stayingCity: string;
  trains: TrainEntry[];
}

const BLANK_ROW = (): ItinRow => ({
  date: '',
  vehicle: '',
  vehicleCity: '',
  vendorName: '',
  vehicleServiceType: '',
  vehicleAmount: null,
  guide: '',
  serviceTime: '',
  sightseeings: [],
  mealBreakfast: false,
  mealLunch: false,
  mealDinner: false,
  hotelName: '',
  stayingCity: '',
  trains: [],
});

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({
  itineraryCode,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  itineraryCode: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        {/* Red accent top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-red-500 to-rose-600" />
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={20} className="text-red-500" />
            </div>
            <div>
              <h2 className="text-[11px] font-black text-zinc-900 uppercase tracking-widest">
                Delete Itinerary
              </h2>
              <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                This action cannot be undone
              </p>
            </div>
          </div>

          <p className="text-[11px] text-zinc-600 font-semibold leading-relaxed mb-6">
            You are about to permanently delete itinerary{' '}
            <span className="font-black text-zinc-900 bg-zinc-100 px-1.5 py-0.5 rounded font-mono text-[11px]">
              {itineraryCode}
            </span>{' '}
            and all its row data. This cannot be recovered.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-[11px] font-black uppercase tracking-wider text-zinc-600 hover:bg-zinc-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition disabled:opacity-60"
            >
              {isDeleting ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Trash2 size={12} />
              )}
              {isDeleting ? 'Deleting…' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function ItineraryNavbar({
  itineraryCode,
  queryId,
  rowCount,
  saveStatus,
}: {
  itineraryCode: string;
  queryId: string;
  rowCount: number;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
}) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteItinerary(itineraryCode, queryId);
      router.push(`/qmake/${queryId}`);
    } catch {
      alert('Failed to delete itinerary. Please try again.');
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-zinc-950 border-b border-zinc-800 flex items-center px-5 gap-4">

        {/* ── Left: Breadcrumb ── */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            onClick={() => router.push(`/qmake/${queryId}`)}
            className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors whitespace-nowrap"
          >
            Query&nbsp;{queryId}
          </button>
          <ChevronRight size={12} className="text-zinc-700 flex-shrink-0" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white bg-zinc-800 px-2 py-0.5 rounded font-mono truncate">
            {itineraryCode}
          </span>
          <span className="hidden sm:block text-[10px] font-bold text-zinc-600 uppercase tracking-widest ml-1">
            · {rowCount} {rowCount === 1 ? 'day' : 'days'}
          </span>

          {/* Save status indicator */}
          <span className={`hidden sm:block text-[10px] font-black uppercase tracking-widest ml-2 transition-colors ${saveStatus === 'saving' ? 'text-yellow-500' :
              saveStatus === 'saved' ? 'text-emerald-500' :
                saveStatus === 'error' ? 'text-red-400' : 'text-zinc-700'
            }`}>
            {saveStatus === 'saving' && '● Saving…'}
            {saveStatus === 'saved' && '● Saved'}
            {saveStatus === 'error' && '● Save failed'}
          </span>
        </div>

        {/* ── Right: Action buttons ── */}
        <div className="flex items-center gap-2">

          {/* PDF — non-functional placeholder */}
          <button
            title="Export as PDF (coming soon)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest
                       text-zinc-500 border border-zinc-800 bg-transparent
                       cursor-not-allowed opacity-50 select-none"
          >
            <FileText size={12} />
            <span>PDF</span>
          </button>

          {/* Registry — goes to qreg query page */}
          <button
            onClick={() => router.push(`/qreg/query/${queryId}`)}
            title="Open CRM registry for this query"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest
                       text-zinc-300 border border-zinc-700 bg-zinc-900
                       hover:bg-zinc-800 hover:text-white hover:border-zinc-600 transition-all"
          >
            <BookOpen size={12} />
            <span>Registry</span>
          </button>

          {/* Delete itinerary */}
          <button
            onClick={() => setShowDeleteModal(true)}
            title={`Delete itinerary ${itineraryCode}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest
                       text-red-400 border border-red-900/60 bg-red-950/30
                       hover:bg-red-900/50 hover:text-red-300 hover:border-red-700 transition-all"
          >
            <Trash2 size={12} />
            <span>Delete</span>
          </button>
        </div>
      </nav>

      {showDeleteModal && (
        <DeleteModal
          itineraryCode={itineraryCode}
          onConfirm={handleDelete}
          onCancel={() => !isDeleting && setShowDeleteModal(false)}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ItineraryBuilder() {
  const { id, itineraryCode } = useParams();
  const queryId = String(id).padStart(5, '0');
  const code = itineraryCode as string;

  const [rows, setRows] = useState<ItinRow[]>([BLANK_ROW()]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'costing'>('costing');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [profitPercents, setProfitPercents] = useState<Record<string, number>>(() => {
    const defaults: Record<string, number> = {};
    COSTING_COLUMNS.forEach(col => {
      defaults[col.key] = 10;
    });
    return defaults;
  });

  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
    const defaults: Record<string, number> = {};
    COSTING_COLUMNS.forEach(col => {
      if (col.width) defaults[col.key] = parseInt(col.width, 10);
      else if (col.minWidth) defaults[col.key] = parseInt(col.minWidth, 10);
      else defaults[col.key] = 120;
    });
    return defaults;
  });

  const [resizingCol, setResizingCol] = useState<string | null>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  const handleResizeStart = (e: React.MouseEvent, key: string) => {
    setResizingCol(key);
    startXRef.current = e.pageX;
    startWidthRef.current = columnWidths[key] || 120;
    e.preventDefault(); // prevent text selection
  };

  useEffect(() => {
    if (!resizingCol) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.pageX - startXRef.current;
      const newWidth = Math.max(80, startWidthRef.current + delta); // minimum 80px
      setColumnWidths(prev => ({ ...prev, [resizingCol]: newWidth }));
    };

    const handleMouseUp = () => {
      setResizingCol(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingCol]);

  const [rowHeights, setRowHeights] = useState<Record<number, number>>({});
  const [resizingRow, setResizingRow] = useState<number | null>(null);
  const startYRef = useRef<number>(0);
  const startHeightRef = useRef<number>(0);

  const handleRowResizeStart = (e: React.MouseEvent, idx: number) => {
    setResizingRow(idx);
    startYRef.current = e.pageY;
    startHeightRef.current = rowHeights[idx] || 80;
    e.preventDefault();
  };

  useEffect(() => {
    if (resizingRow === null) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.pageY - startYRef.current;
      const newHeight = Math.max(40, startHeightRef.current + delta); // minimum 40px
      setRowHeights(prev => ({ ...prev, [resizingRow]: newHeight }));
    };

    const handleMouseUp = () => setResizingRow(null);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingRow]);

  const isFirstRender = useRef(true);

  // ── Load ───────────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      const data = await getItineraryByCode(code);
      if (data?.rows?.length > 0) {
        // Normalize legacy string[] sightseeings -> SightseeingEntry[]
        const normalized = data.rows.map((row: any) => ({
          ...row,
          sightseeings: (row.sightseeings ?? []).map((s: any) =>
            typeof s === 'string' ? { name: s, adultPrice: null } : s
          ),
          trains: row.trains ?? [],
        }));
        setRows(normalized);
      }
      setLoading(false);
    }
    load();
  }, [code]);

  // ── Debounced autosave ───────────────────────────────────────────────────────
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    setSaveStatus('saving');
    const t = setTimeout(async () => {
      try {
        await saveItineraryData(code, rows);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2500);
      } catch {
        setSaveStatus('error');
      }
    }, 1500);
    return () => clearTimeout(t);
  }, [rows, code]);

  // ── Row helpers ───────────────────────────────────────────────────────────
  const getColumnTotal = (key: string) => {
    if (key === 'col9') {
      return rows.reduce((acc, row) => acc + row.trains.reduce((rAcc, t) => rAcc + (Number(t.price) || 0), 0), 0);
    }
    if (key === 'col10') {
      return rows.reduce((acc, row) => acc + row.sightseeings.reduce((rAcc, s) => rAcc + (Number(s.adultPrice) || 0), 0), 0);
    }
    return 0;
  };

  const updateRow = (idx: number, patch: Partial<ItinRow>) =>
    setRows(prev => { const n = [...prev]; n[idx] = { ...n[idx], ...patch }; return n; });

  const addDay = () =>
    setRows(prev => [...prev, BLANK_ROW()]);

  const deleteDay = (idx: number) => {
    if (rows.length <= 1) return;
    setRows(prev => prev.filter((_, i) => i !== idx));
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="animate-spin text-zinc-500" size={32} />
      </div>
    );
  }

  return (
    <>
      <ItineraryNavbar
        itineraryCode={code}
        queryId={queryId}
        rowCount={rows.length}
        saveStatus={saveStatus}
      />

      {/* ── Page body ── */}
      <main className="pt-14 pb-10 bg-[#f4f4f6]">

        {/* ── ITINERARY TAB ── */}
        {activeTab === 'itinerary' && (
          <div className="w-full pt-6">

            {/* Connected day rows */}
            <div className="overflow-hidden border-b border-zinc-300">

              {/* Column header */}
              <div className="flex bg-zinc-900">
                {COLUMNS.map((col, i) => (
                  <div
                    key={col.key}
                    style={{ width: `${columnWidths[col.key]}px`, flexShrink: 0, flexGrow: 0 }}
                    className={`
                      relative flex items-center px-3 py-2
                      text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400
                      ${i < COLUMNS.length - 1 ? 'border-r border-zinc-700' : ''}
                    `}
                  >
                    <span className="truncate flex-1 pr-2">{col.label}</span>
                    <div
                      onMouseDown={e => handleResizeStart(e, col.key)}
                      className={`absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-emerald-500/50 z-10 ${resizingCol === col.key ? 'bg-emerald-500' : ''}`}
                    />
                  </div>
                ))}
              </div>

              {/* Day rows */}
              {rows.map((row, idx) => (
                <DayRow
                  key={idx}
                  idx={idx}
                  row={row}
                  onUpdate={patch => updateRow(idx, patch)}
                  onDelete={() => deleteDay(idx)}
                  canDelete={rows.length > 1}
                  isLast={idx === rows.length - 1}
                  columnWidths={columnWidths}
                  rowHeights={rowHeights}
                  onRowResizeStart={handleRowResizeStart}
                  resizingRow={resizingRow}
                />
              ))}
            </div>

            {/* Add Day button */}
            <button
              onClick={addDay}
              className="
                w-full py-3
                border-t-0 border-b border-l-0 border-r-0 border border-zinc-300
                flex items-center justify-center gap-2
                text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400
                bg-white hover:bg-zinc-50 hover:text-zinc-700
                transition-all duration-150
              "
            >
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M4.5 1.5v6M1.5 4.5h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Add Day
            </button>

          </div>
        )}

        {/* ── COSTING TAB ── */}
        {activeTab === 'costing' && (
          <div className="w-full pt-6">
            <div className="overflow-x-auto pb-10">
              <div className="min-w-max">

              {/* Column header */}
              <div className="flex bg-zinc-900 min-w-[max-content]">
                {COSTING_COLUMNS.map((col, i) => (
                  <div
                    key={col.key}
                    style={{ width: `${columnWidths[col.key]}px`, flexShrink: 0, flexGrow: 0 }}
                    className={`
                      relative flex items-center px-3 py-2
                      text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400
                      ${i < COSTING_COLUMNS.length - 1 ? 'border-r border-zinc-700' : ''}
                    `}
                  >
                    <span className="truncate flex-1 pr-2">{col.label}</span>
                    <div
                      onMouseDown={e => handleResizeStart(e, col.key)}
                      className={`absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-emerald-500/50 z-10 ${resizingCol === col.key ? 'bg-emerald-500' : ''}`}
                    />
                  </div>
                ))}
              </div>

              {/* Costing rows */}
              {rows.map((row, idx) => (
                <CostingRow
                  key={idx}
                  idx={idx}
                  row={row}
                  onUpdate={patch => updateRow(idx, patch)}
                  onDelete={() => deleteDay(idx)}
                  canDelete={rows.length > 1}
                  isLast={idx === rows.length - 1}
                  columnWidths={columnWidths}
                  rowHeights={rowHeights}
                  onRowResizeStart={handleRowResizeStart}
                  resizingRow={resizingRow}
                />
              ))}

              {/* ── TOTALS ROW ── */}
              <div className="flex bg-zinc-950 border-t border-black min-w-[max-content]">
                {COSTING_COLUMNS.map((col, i) => (
                  <div key={col.key} style={{ width: `${columnWidths[col.key]}px`, flexShrink: 0, flexGrow: 0 }} className={`min-h-[40px] border-r border-zinc-800 flex items-center justify-between px-3 py-2 ${['col9', 'col10', 'col11', 'col12', 'col13'].includes(col.key) ? 'bg-zinc-900 shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]' : ''}`}>
                    {['col9', 'col10', 'col11', 'col12', 'col13'].includes(col.key) && (
                      <>
                        <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Total</span>
                        <span className="text-[12px] font-black text-emerald-400">¥ {getColumnTotal(col.key).toLocaleString()}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Day button (Costing Tab) */}
              <button
                onClick={addDay}
                className="
                w-full py-3 mt-4
                border border-dashed border-zinc-300 rounded-lg
                flex items-center justify-center gap-2
                text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400
                bg-white hover:bg-zinc-50 hover:text-zinc-700 hover:border-zinc-400
                transition-all duration-150
              "
              >
                <Plus size={12} /> Add Day
              </button>

              <div className="mt-12 space-y-0 border border-zinc-200 rounded-2xl overflow-hidden shadow-xl shadow-zinc-200/20 w-max">
                <div className="bg-zinc-50 px-6 py-3 border-b border-zinc-200">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-3">Margin & Profit Summary</h3>
                </div>

                <div className="w-full">
                  {/* 1. Profit % Row */}
                  <div className="flex bg-white border-b border-zinc-100">
                    {COSTING_COLUMNS.map((col, i) => {
                      const isCalculated = ['col9', 'col10', 'col11', 'col12', 'col13'].includes(col.key);
                      return (
                        <div key={col.key} style={{ width: `${columnWidths[col.key]}px`, flexShrink: 0, flexGrow: 0 }} className={`min-h-[50px] ${i < COSTING_COLUMNS.length - 1 ? 'border-r border-zinc-100' : ''} flex flex-col justify-center px-4 py-2`}>
                          {isCalculated && (
                            <>
                              <span className="text-[9px] font-black uppercase text-zinc-400 tracking-tighter mb-1.5">Profit %</span>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  value={profitPercents[col.key] ?? 10}
                                  onChange={e => setProfitPercents(prev => ({ ...prev, [col.key]: Number(e.target.value) }))}
                                  className="w-16 bg-zinc-50 border border-zinc-200 rounded-md px-2 py-1 text-[11px] font-bold text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                                />
                                <span className="text-[10px] font-bold text-zinc-400">%</span>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* 2. Profit Amount Row */}
                  <div className="flex bg-white border-b border-zinc-100">
                    {COSTING_COLUMNS.map((col, i) => {
                      const isCalculated = ['col9', 'col10', 'col11', 'col12', 'col13'].includes(col.key);
                      const profit = isCalculated ? getColumnTotal(col.key) * ((profitPercents[col.key] ?? 10) / 100) : 0;
                      return (
                        <div key={col.key} style={{ width: `${columnWidths[col.key]}px`, flexShrink: 0, flexGrow: 0 }} className={`min-h-[50px] ${i < COSTING_COLUMNS.length - 1 ? 'border-r border-zinc-100' : ''} flex flex-col justify-center px-4 py-2`}>
                          {isCalculated && (
                            <>
                              <span className="text-[9px] font-black uppercase text-zinc-400 tracking-tighter mb-1">Profit Amount</span>
                              <span className="text-[11px] font-black text-blue-600 font-mono tracking-tight">¥ {Math.round(profit).toLocaleString()}</span>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* 3. Grand Total Row */}
                  <div className="flex bg-zinc-900 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                    {COSTING_COLUMNS.map((col, i) => {
                      const isCalculated = ['col9', 'col10', 'col11', 'col12', 'col13'].includes(col.key);
                      const total = isCalculated ? getColumnTotal(col.key) : 0;
                      const profit = isCalculated ? total * ((profitPercents[col.key] ?? 10) / 100) : 0;
                      const grand = total + profit;
                      return (
                        <div key={col.key} style={{ width: `${columnWidths[col.key]}px`, flexShrink: 0, flexGrow: 0 }} className={`min-h-[60px] ${i < COSTING_COLUMNS.length - 1 ? 'border-r border-zinc-800' : ''} flex flex-col justify-center px-4 py-2 bg-zinc-950`}>
                          {isCalculated && (
                            <>
                              <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest mb-1">Grand Total</span>
                              <span className="text-[14px] font-black text-emerald-400 font-mono tracking-tight">¥ {Math.round(grand).toLocaleString()}</span>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              </div>
            </div>
          </div>
        )}

      </main>

      {/* ── BOTTOM TAB BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-end bg-[#f0f0f0] border-t border-zinc-300 px-3 h-10">
        {(['itinerary', 'costing'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              relative h-9 px-5 text-[10px] font-black uppercase tracking-widest
              border-l border-r border-t transition-colors
              ${activeTab === tab
                ? 'bg-white text-zinc-900 border-zinc-300 -mb-px z-10'
                : 'bg-[#e8e8e8] text-zinc-400 border-transparent hover:text-zinc-600 hover:bg-[#efefef]'
              }
            `}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
    </>
  );
}

// ─── Column definitions ───────────────────────────────────────────────────────
type ColDef = { key: string; label: string; width?: string; minWidth?: string; grow?: number };

const COLUMNS: ColDef[] = [
  { key: 'date', label: 'Date', width: '176px' },
  { key: 'col2', label: 'Column 2', grow: 1, minWidth: '120px' },
  { key: 'col3', label: 'TRAINS', grow: 1, minWidth: '120px' },
  { key: 'sightseeing', label: 'Sightseeing', grow: 1, minWidth: '120px' },
  { key: 'col5', label: 'Column 5', grow: 1, minWidth: '120px' },
  { key: 'col6', label: 'Column 6', grow: 1, minWidth: '120px' },
  { key: 'col7', label: 'Column 7', grow: 1, minWidth: '120px' },
];

// Costing = all itinerary columns + 6 extra
const COSTING_COLUMNS: ColDef[] = [
  ...COLUMNS,
  { key: 'col8', label: 'Column 8', grow: 1, minWidth: '120px' },
  { key: 'col9', label: 'TRAIN COST', grow: 1, minWidth: '120px' },
  { key: 'col10', label: 'SS COST', grow: 1, minWidth: '160px' },
  { key: 'col11', label: 'Column 11', grow: 1, minWidth: '120px' },
  { key: 'col12', label: 'Column 12', grow: 1, minWidth: '120px' },
  { key: 'col13', label: 'Column 13', grow: 1, minWidth: '120px' },
];

// Grid template derived from COLUMNS — shared by header + every DayRow
const ITINERARY_GRID = COLUMNS
  .map(col => col.width ? col.width : `minmax(${col.minWidth ?? '120px'}, ${col.grow ?? 1}fr)`)
  .join(' ');

// Grid template derived from COSTING_COLUMNS — shared by header + every CostingRow
const COSTING_GRID = COSTING_COLUMNS
  .map(col => col.width ? col.width : `minmax(${col.minWidth ?? '120px'}, ${col.grow ?? 1}fr)`)
  .join(' ');

// ─── TrainSearchModal ────────────────────────────────────────────────────────
function TrainSearchModal({
  isOpen,
  onClose,
  onAddTrain,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddTrain: (entry: TrainEntry) => void;
}) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!from.trim() || !to.trim()) return;

    setIsSearching(true);
    setRoutes([]);
    setError('');

    try {
      const result = await searchHyperdia({ from: from.trim(), to: to.trim() });
      if (result.success) {
        setRoutes(result.routes || []);
      } else {
        setError(result.error || 'Unknown error');
      }
    } catch (err: any) {
      setError(err.message || 'Request failed');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectRoute = (route: RouteData, type: 'Standard' | 'Green', price: number) => {
    // Reconstruct legs
    const legs: TrainLeg[] = [];
    let currentFrom = "";
    route.segments.forEach((seg, i) => {
      if (seg.type === "departure" || seg.type === "transfer") {
        currentFrom = seg.stationName || "";
      } else if (seg.type === "train") {
        let toStation = "";
        for (let j = i + 1; j < route.segments.length; j++) {
          if (route.segments[j].type === "transfer" || route.segments[j].type === "arrival") {
            toStation = route.segments[j].stationName || "";
            break;
          }
        }
        legs.push({
          id: seg.id,
          from: currentFrom,
          train: seg.trainName || "Unknown",
          to: toStation,
          duration: seg.duration?.replace(/[\[\]]/g, "") || "",
        });
        currentFrom = toStation;
      }
    });

    onAddTrain({
      id: crypto.randomUUID(),
      ticketType: type,
      price,
      legs,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#f4f4f6] rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-zinc-200">
          <h2 className="text-sm font-black text-zinc-900 uppercase tracking-widest">Search Train Routes</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-900"><X size={16} /></button>
        </div>

        <div className="p-6 bg-white border-b border-zinc-200">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-end gap-4">
            <div className="flex-1 w-full">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-tighter mb-1.5">Origin Station</label>
              <input type="text" required value={from} onChange={(e) => setFrom(e.target.value)}
                placeholder="e.g. TOKYO" className="w-full bg-zinc-100 border-none rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all uppercase" />
            </div>

            <div className="flex-1 w-full">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-tighter mb-1.5">Destination Station</label>
              <input type="text" required value={to} onChange={(e) => setTo(e.target.value)}
                placeholder="e.g. KYOTO" className="w-full bg-zinc-100 border-none rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all uppercase" />
            </div>

            <button type="submit" disabled={isSearching}
              className="h-[40px] px-8 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold shadow-sm min-w-[150px] w-full md:w-auto mt-4 md:mt-0 transition-colors disabled:opacity-50 flex justify-center items-center">
              {isSearching ? <Loader2 className="animate-spin mx-auto" size={16} /> : "SEARCH"}
            </button>
          </form>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold">{error}</div>
          )}
          {routes.map((route, idx) => (
            <TrainRouteCard key={route.id} route={route} index={idx} onSelect={handleSelectRoute} />
          ))}
          {routes.length === 0 && !isSearching && !error && (
            <div className="text-center text-zinc-500 font-medium py-10">Enter stations to search routes.</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── TrainCell ─────────────────────────────────────────────────────────────
function TrainCell({
  entries,
  onChange,
  mode = 'all',
}: {
  entries: TrainEntry[];
  onChange: (entries: TrainEntry[]) => void;
  mode?: 'all' | 'info' | 'price';
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleAddTrain = (entry: TrainEntry) => {
    onChange([...entries, entry]);
  };

  const handleRemove = (id: string) => {
    if (mode === 'price') return;
    onChange(entries.filter(e => e.id !== id));
  };

  return (
    <div className="flex flex-col h-full p-2 gap-2">
      {entries.map((entry) => (
        <div key={entry.id} className={`flex flex-col gap-1 p-2 rounded-lg relative group ${mode === 'price' ? 'border border-transparent' : 'bg-zinc-50 border border-zinc-200'}`}>
          {mode !== 'price' && (
            <button onClick={() => handleRemove(entry.id)} className="absolute top-1.5 right-1.5 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <X size={12} />
            </button>
          )}
          <div className={`flex items-center gap-2 mb-1 ${mode === 'price' ? 'justify-end' : ''}`}>
            <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${mode === 'price' ? 'opacity-0 pointer-events-none' : 'bg-zinc-200 text-zinc-700'}`}>
              {entry.ticketType}
            </span>
            <span className={`text-[10px] font-bold text-emerald-600 ${mode === 'info' ? 'opacity-0 pointer-events-none' : ''}`}>
              ¥ {entry.price.toLocaleString()}
            </span>
          </div>
          <div className={`flex flex-col gap-1 ${mode === 'price' ? 'opacity-0 pointer-events-none select-none' : ''}`}>
            {entry.legs.map(leg => (
              <div key={leg.id} className="flex items-center gap-1.5 text-[9px] font-medium text-zinc-600 leading-tight">
                <span className="font-bold text-zinc-800 truncate max-w-[60px]">{leg.from}</span>
                <span className="text-zinc-300">➔</span>
                <span className="truncate max-w-[80px] flex items-center gap-1 text-zinc-500">
                  <span className="w-3 h-3"><TrainIcon name={leg.train} /></span>
                  {leg.train}
                </span>
                <span className="text-zinc-300">➔</span>
                <span className="font-bold text-zinc-800 truncate max-w-[60px]">{leg.to}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {mode !== 'price' ? (
        <button
          onClick={() => setModalOpen(true)}
          className="w-full py-2 mt-auto border border-dashed border-zinc-300 rounded flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-zinc-50 hover:text-zinc-700 hover:border-zinc-400 transition-all"
        >
          <Plus size={10} /> Add Train
        </button>
      ) : (
        <button className="w-full py-2 mt-auto border border-transparent rounded flex items-center justify-center gap-1.5 text-[10px] opacity-0 pointer-events-none select-none">
          <Plus size={10} /> Add Train
        </button>
      )}

      <TrainSearchModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddTrain={handleAddTrain}
      />
    </div>
  );
}

// ─── DayRow ───────────────────────────────────────────────────────────────────
function DayRow({
  idx,
  row,
  onUpdate,
  onDelete,
  canDelete,
  isLast,
  columnWidths,
  rowHeights,
  onRowResizeStart,
  resizingRow,
}: {
  idx: number;
  row: ItinRow;
  onUpdate: (patch: Partial<ItinRow>) => void;
  onDelete: () => void;
  canDelete: boolean;
  isLast: boolean;
  columnWidths: Record<string, number>;
  rowHeights: Record<number, number>;
  onRowResizeStart: (e: React.MouseEvent, idx: number) => void;
  resizingRow: number | null;
}) {
  return (
    <div 
      className={`flex w-full bg-white ${!isLast ? 'border-b border-zinc-200' : ''}`}
      style={{ minHeight: rowHeights[idx] ? `${rowHeights[idx]}px` : undefined }}
    >
      {COLUMNS.map((col, i) => {
        let content = null;
        if (col.key === 'date') {
          content = (
            <div className="flex flex-col justify-center gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-zinc-400 tracking-widest">
                  DAY {String(idx + 1).padStart(2, '0')}
                </span>
                <button
                  onClick={onDelete}
                  disabled={!canDelete}
                  title={canDelete ? `Delete Day ${idx + 1}` : 'Cannot delete the only day'}
                  className="w-6 h-6 flex items-center justify-center text-zinc-300 hover:text-red-500 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <input
                type="date"
                value={row.date}
                onChange={e => onUpdate({ date: e.target.value })}
                className="w-full h-7 px-2 border border-zinc-200 bg-white text-[11px] font-bold text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-800 focus:border-transparent hover:border-zinc-400 transition-colors cursor-pointer"
              />
              {row.date && (
                <span className="text-[10px] font-semibold text-zinc-400 leading-tight">
                  {new Date(row.date + 'T00:00:00').toLocaleDateString('en-IN', {
                    weekday: 'long', day: 'numeric', month: 'short',
                  })}
                </span>
              )}
            </div>
          );
        } else if (col.key === 'col3') {
          content = <TrainCell entries={row.trains} onChange={trains => onUpdate({ trains })} />;
        } else if (col.key === 'sightseeing') {
          content = <SightseeingCell entries={row.sightseeings} onChange={sightseeings => onUpdate({ sightseeings })} />;
        }

        return (
          <div
            key={col.key}
            style={{ width: `${columnWidths[col.key]}px`, flexShrink: 0, flexGrow: 0 }}
            className={`min-h-[80px] px-3 py-3 ${i < COLUMNS.length - 1 ? 'border-r border-zinc-200' : ''} ${col.key === 'date' ? 'bg-zinc-50 relative' : ''} flex flex-col justify-center`}
          >
            {content}
            {col.key === 'date' && (
              <div
                onMouseDown={e => onRowResizeStart(e, idx)}
                className={`absolute left-0 right-0 bottom-0 h-1.5 cursor-row-resize hover:bg-emerald-500/50 z-10 ${resizingRow === idx ? 'bg-emerald-500' : ''}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── SightseeingCell ───────────────────────────────────────────────────────
function SightseeingCell({
  entries,
  onChange,
  mode = 'all',
}: {
  entries: SightseeingEntry[];
  onChange: (entries: SightseeingEntry[]) => void;
  mode?: 'all' | 'info' | 'price';
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Debounced search
  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    const res = await searchSightseeing(q);
    setResults(res);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => doSearch(query), 280);
    return () => clearTimeout(t);
  }, [query, doSearch]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
        setResults([]);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const addEntry = (spot: any) => {
    const already = entries.some(e => e.name === spot.name_en);
    if (already) return;
    onChange([...entries, { name: spot.name_en, adultPrice: spot.adult_price ?? null }]);
    setQuery('');
    setResults([]);
  };

  const removeEntry = (name: string) =>
    onChange(entries.filter(e => e.name !== name));

  return (
    <div className="flex flex-col h-full p-2 gap-1.5" ref={wrapRef}>

      {/* Added sightseeing tags */}
      {entries.map((entry, eIdx) => (
        <div
          key={eIdx}
          className={`flex items-center justify-between gap-1 px-2 py-1 rounded ${mode === 'price' ? 'border border-transparent' : 'bg-zinc-100 border border-zinc-200'}`}
        >
          <span className={`text-[10px] font-bold leading-tight truncate ${mode === 'price' ? 'opacity-0 pointer-events-none' : 'text-zinc-700'}`}>
            {entry.name}
          </span>
          {mode === 'price' ? (
            <span className="text-[10px] font-black text-emerald-600 whitespace-nowrap flex-shrink-0">
              {entry.adultPrice != null ? `¥ ${Number(entry.adultPrice).toLocaleString()}` : '—'}
            </span>
          ) : (
            <button
              onClick={() => removeEntry(entry.name)}
              className="flex-shrink-0 text-zinc-300 hover:text-red-500 transition-colors"
            >
              <X size={10} />
            </button>
          )}
        </div>
      ))}

      {/* Search input */}
      {mode !== 'price' ? (
        <div className="relative">
          <div className="flex items-center gap-1 border border-zinc-200 bg-white px-2 py-1 focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-300 transition">
            <Search size={9} className="text-zinc-300 flex-shrink-0" />
            <input
              value={query}
              onFocus={() => setOpen(true)}
              onChange={e => { setQuery(e.target.value); setOpen(true); }}
              placeholder="Search sightseeing..."
              className="flex-1 bg-transparent text-[11px] font-semibold text-zinc-700 outline-none placeholder:text-zinc-300 min-w-0"
            />
          </div>

          {/* Results dropdown */}
          {open && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 bg-white border border-zinc-300 shadow-lg max-h-48 overflow-y-auto">
              {results.map((spot: any) => (
                <div
                  key={spot._id}
                  className="flex items-center justify-between px-2 py-1.5 hover:bg-zinc-50 border-b border-zinc-100 last:border-b-0 group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-zinc-800 truncate">{spot.name_en}</p>
                    {spot.municipality && (
                      <p className="text-[10px] text-zinc-400 font-semibold truncate">{spot.municipality}</p>
                    )}
                  </div>
                  <button
                    onMouseDown={e => { e.preventDefault(); addEntry(spot); }}
                    className="flex-shrink-0 ml-2 w-5 h-5 flex items-center justify-center bg-zinc-900 hover:bg-zinc-700 text-white transition"
                  >
                    <Plus size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="relative opacity-0 pointer-events-none select-none">
          <div className="flex items-center gap-1 border border-transparent px-2 py-1">
            <Search size={9} />
            <input className="flex-1 min-w-0" disabled />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CostingRow ───────────────────────────────────────────────────────────────────
function CostingRow({
  idx,
  row,
  onUpdate,
  onDelete,
  canDelete,
  isLast,
  columnWidths,
  rowHeights,
  onRowResizeStart,
  resizingRow,
}: {
  idx: number;
  row: ItinRow;
  onUpdate: (patch: Partial<ItinRow>) => void;
  onDelete: () => void;
  canDelete: boolean;
  isLast: boolean;
  columnWidths: Record<string, number>;
  rowHeights: Record<number, number>;
  onRowResizeStart: (e: React.MouseEvent, idx: number) => void;
  resizingRow: number | null;
}) {
  return (
    <div 
      className={`flex w-full bg-white ${!isLast ? 'border-b border-zinc-200' : ''}`}
      style={{ minHeight: rowHeights[idx] ? `${rowHeights[idx]}px` : undefined }}
    >
      {COSTING_COLUMNS.map((col, i) => {
        let content = null;
        if (col.key === 'date') {
          content = (
            <div className="flex flex-col justify-center gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-zinc-400 tracking-widest">
                  DAY {String(idx + 1).padStart(2, '0')}
                </span>
                <button
                  onClick={onDelete}
                  disabled={!canDelete}
                  title={canDelete ? `Delete Day ${idx + 1}` : 'Cannot delete the only day'}
                  className="w-6 h-6 flex items-center justify-center text-zinc-300 hover:text-red-500 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <input
                type="date"
                value={row.date}
                onChange={e => onUpdate({ date: e.target.value })}
                className="w-full h-7 px-2 border border-zinc-200 bg-white text-[11px] font-bold text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-800 focus:border-transparent hover:border-zinc-400 transition-colors cursor-pointer"
              />
              {row.date && (
                <span className="text-[10px] font-semibold text-zinc-400 leading-tight">
                  {new Date(row.date + 'T00:00:00').toLocaleDateString('en-IN', {
                    weekday: 'long', day: 'numeric', month: 'short',
                  })}
                </span>
              )}
            </div>
          );
        } else if (col.key === 'col3') {
           content = <TrainCell entries={row.trains} onChange={trains => onUpdate({ trains })} mode="info" />;
        } else if (col.key === 'sightseeing') {
           content = <SightseeingCell entries={row.sightseeings} onChange={sightseeings => onUpdate({ sightseeings })} mode="info" />;
        } else if (col.key === 'col9') {
          content = <TrainCell entries={row.trains} onChange={() => {}} mode="price" />;
        } else if (col.key === 'col10') {
          content = <SightseeingCell entries={row.sightseeings} onChange={() => {}} mode="price" />;
        }

        return (
          <div
            key={col.key}
            style={{ width: `${columnWidths[col.key]}px`, flexShrink: 0, flexGrow: 0 }}
            className={`min-h-[80px] px-3 py-3 ${i < COSTING_COLUMNS.length - 1 ? 'border-r border-zinc-200' : ''} ${col.key === 'date' ? 'bg-zinc-50 relative' : ''} flex flex-col justify-center`}
          >
            {content}
            {col.key === 'date' && (
              <div
                onMouseDown={e => onRowResizeStart(e, idx)}
                className={`absolute left-0 right-0 bottom-0 h-1.5 cursor-row-resize hover:bg-emerald-500/50 z-10 ${resizingRow === idx ? 'bg-emerald-500' : ''}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
