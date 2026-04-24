"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, Trash2, BookOpen, FileText, ChevronRight, AlertTriangle, Search, Plus, X } from 'lucide-react';
import { getItineraryByCode, deleteItinerary, searchSightseeing, saveItineraryData } from '../../actions';

// ─── Types ────────────────────────────────────────────────────────────────────
interface SightseeingEntry {
  name: string;
  adultPrice: number | null;
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
          <span className={`hidden sm:block text-[10px] font-black uppercase tracking-widest ml-2 transition-colors ${
            saveStatus === 'saving' ? 'text-yellow-500' :
            saveStatus === 'saved'  ? 'text-emerald-500' :
            saveStatus === 'error'  ? 'text-red-400' : 'text-zinc-700'
          }`}>
            {saveStatus === 'saving' && '● Saving…'}
            {saveStatus === 'saved'  && '● Saved'}
            {saveStatus === 'error'  && '● Save failed'}
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
              <div className="flex w-full bg-zinc-900">
                {COLUMNS.map((col, i) => (
                  <div
                    key={col.key}
                    className={`
                      flex-shrink-0 flex items-center px-3 py-2
                      text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400
                      ${i < COLUMNS.length - 1 ? 'border-r border-zinc-700' : ''}
                    `}
                    style={{ width: col.width, flexGrow: col.grow ?? 0, flexBasis: col.grow ? 0 : undefined }}
                  >
                    {col.label}
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
                <path d="M4.5 1.5v6M1.5 4.5h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              Add Day
            </button>

          </div>
        )}

        {/* ── COSTING TAB ── */}
        {activeTab === 'costing' && (
          <div className="w-full pt-6">
            <div className="overflow-auto border-b border-zinc-300">

              {/* Column header — grid layout for pixel-perfect alignment with rows */}
              <div
                className="w-full bg-zinc-900"
                style={{ display: 'grid', gridTemplateColumns: COSTING_GRID }}
              >
                {COSTING_COLUMNS.map((col, i) => (
                  <div
                    key={col.key}
                    className={`
                      flex items-center px-3 py-2
                      text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400
                      ${i < COSTING_COLUMNS.length - 1 ? 'border-r border-zinc-700' : ''}
                    `}
                  >
                    {col.label}
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
                />
              ))}

              {/* ── TOTALS ROW ── */}
              <div
                className="w-full bg-zinc-950 border-t border-black"
                style={{ display: 'grid', gridTemplateColumns: COSTING_GRID }}
              >
                {/* Skip columns 1 to 9 */}
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="min-h-[40px] border-r border-zinc-800" />
                ))}

                {/* Column 10: Sightseeing Total */}
                <div className="min-h-[40px] border-r border-zinc-800 flex items-center justify-between px-3 py-2 bg-zinc-900 shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]">
                  <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                    Total
                  </span>
                  <span className="text-[12px] font-black text-emerald-400">
                    ¥ {rows.reduce(
                      (acc, row) => acc + row.sightseeings.reduce((rAcc, s) => rAcc + (Number(s.adultPrice) || 0), 0),
                      0
                    ).toLocaleString()}
                  </span>
                </div>

                {/* Skip columns 11 to 13 */}
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className={`min-h-[40px] ${i < 2 ? 'border-r border-zinc-800' : ''}`} />
                ))}
              </div>

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
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M4.5 1.5v6M1.5 4.5h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              Add Day
            </button>

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
              ${
                activeTab === tab
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
  { key: 'date',        label: 'Date',        width: '176px' },
  { key: 'col2',        label: 'Column 2',    grow: 1, minWidth: '120px' },
  { key: 'col3',        label: 'Column 3',    grow: 1, minWidth: '120px' },
  { key: 'sightseeing', label: 'Sightseeing', grow: 1, minWidth: '120px' },
  { key: 'col5',        label: 'Column 5',    grow: 1, minWidth: '120px' },
  { key: 'col6',        label: 'Column 6',    grow: 1, minWidth: '120px' },
  { key: 'col7',        label: 'Column 7',    grow: 1, minWidth: '120px' },
];

// Costing = all itinerary columns + 6 extra
const COSTING_COLUMNS: ColDef[] = [
  ...COLUMNS,
  { key: 'col8',  label: 'Column 8',  grow: 1, minWidth: '120px' },
  { key: 'col9',  label: 'Column 9',  grow: 1, minWidth: '120px' },
  { key: 'col10', label: 'SS COST', grow: 1, minWidth: '160px' },
  { key: 'col11', label: 'Column 11', grow: 1, minWidth: '120px' },
  { key: 'col12', label: 'Column 12', grow: 1, minWidth: '120px' },
  { key: 'col13', label: 'Column 13', grow: 1, minWidth: '120px' },
];

// Grid template derived from COSTING_COLUMNS — shared by header + every CostingRow
const COSTING_GRID = COSTING_COLUMNS
  .map(col => col.width ? col.width : `minmax(${col.minWidth ?? '120px'}, 1fr)`)
  .join(' ');

// ─── DayRow ───────────────────────────────────────────────────────────────────
function DayRow({
  idx,
  row,
  onUpdate,
  onDelete,
  canDelete,
  isLast,
}: {
  idx: number;
  row: ItinRow;
  onUpdate: (patch: Partial<ItinRow>) => void;
  onDelete: () => void;
  canDelete: boolean;
  isLast: boolean;
}) {
  return (
    <div className={`flex w-full bg-white ${
      !isLast ? 'border-b border-zinc-200' : ''
    }`}>

      {/* ── COL 1: Date ── */}
      <div className="flex-shrink-0 border-r border-zinc-200 flex flex-col justify-center gap-2 px-3 py-3 bg-zinc-50" style={{ width: '176px' }}>
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

      {/* ── COL 2: placeholder ── */}
      <div className="flex-1 min-h-[80px] border-r border-zinc-200" />

      {/* ── COL 3: placeholder ── */}
      <div className="flex-1 min-h-[80px] border-r border-zinc-200" />

      {/* ── COL 4: Sightseeing ── */}
      <div className="flex-1 min-h-[80px] border-r border-zinc-200">
        <SightseeingCell
          entries={row.sightseeings}
          onChange={entries => onUpdate({ sightseeings: entries })}
        />
      </div>

      {/* ── COL 5: placeholder ── */}
      <div className="flex-1 min-h-[80px] border-r border-zinc-200" />

      {/* ── COL 6: placeholder ── */}
      <div className="flex-1 min-h-[80px] border-r border-zinc-200" />

      {/* ── COL 7: placeholder ── */}
      <div className="flex-1 min-h-[80px]" />

    </div>
  );
}

// ─── SightseeingCell ───────────────────────────────────────────────────────
function SightseeingCell({
  entries,
  onChange,
}: {
  entries: SightseeingEntry[];
  onChange: (entries: SightseeingEntry[]) => void;
}) {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen]       = useState(false);
  const wrapRef               = useRef<HTMLDivElement>(null);

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
          className="flex items-center justify-between gap-1 bg-zinc-100 border border-zinc-200 px-2 py-1 rounded"
        >
          <span className="text-[10px] font-bold text-zinc-700 leading-tight truncate">
            {entry.name}
          </span>
          <button
            onClick={() => removeEntry(entry.name)}
            className="flex-shrink-0 text-zinc-300 hover:text-red-500 transition-colors"
          >
            <X size={10} />
          </button>
        </div>
      ))}

      {/* Search input */}
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
}: {
  idx: number;
  row: ItinRow;
  onUpdate: (patch: Partial<ItinRow>) => void;
  onDelete: () => void;
  canDelete: boolean;
  isLast: boolean;
}) {
  return (
    <div
      className={`w-full bg-white ${!isLast ? 'border-b border-zinc-200' : ''}`}
      style={{ display: 'grid', gridTemplateColumns: COSTING_GRID }}
    >

      {/* ── COL 1: Date (shared with itinerary) ── */}
      <div className="border-r border-zinc-200 flex flex-col justify-center gap-2 px-3 py-3 bg-zinc-50">
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

      {/* ── COL 2: placeholder ── */}
      <div className="min-h-[80px] border-r border-zinc-200" />

      {/* ── COL 3: placeholder ── */}
      <div className="min-h-[80px] border-r border-zinc-200" />

      {/* ── COL 4: Sightseeing (shared with itinerary) ── */}
      <div className="min-h-[80px] border-r border-zinc-200">
        <SightseeingCell
          entries={row.sightseeings}
          onChange={entries => onUpdate({ sightseeings: entries })}
        />
      </div>

      {/* ── COL 5: placeholder ── */}
      <div className="min-h-[80px] border-r border-zinc-200" />

      {/* ── COL 6: placeholder ── */}
      <div className="min-h-[80px] border-r border-zinc-200" />

      {/* ── COL 7: placeholder ── */}
      <div className="min-h-[80px] border-r border-zinc-200" />

      {/* ── COL 8 ── */}
      <div className="min-h-[80px] border-r border-zinc-200" />

      {/* ── COL 9 ── */}
      <div className="min-h-[80px] border-r border-zinc-200" />

      {/* ── COL 10: Sightseeing read-only summary ── */}
      <div className="min-h-[80px] border-r border-zinc-200 flex flex-col gap-1 px-3 py-3">
        {row.sightseeings.length === 0 ? (
          <span className="text-[10px] text-zinc-300 font-semibold">—</span>
        ) : (
          row.sightseeings.map((entry, i) => (
            <div key={i} className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-zinc-700 truncate flex-1">
                {entry.name}
              </span>
              <span className="text-[10px] font-black text-zinc-400 whitespace-nowrap flex-shrink-0">
                {entry.adultPrice != null
                  ? `¥ ${Number(entry.adultPrice).toLocaleString()}`
                  : '—'}
              </span>
            </div>
          ))
        )}
      </div>

      {/* ── COL 11 ── */}
      <div className="min-h-[80px] border-r border-zinc-200" />

      {/* ── COL 12 ── */}
      <div className="min-h-[80px] border-r border-zinc-200" />

      {/* ── COL 13 ── */}
      <div className="min-h-[80px]" />

    </div>
  );
}
