"use client"

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { registerQuery, getQueryById, updateQuery, getAgents, deleteQuery } from '@/app/qreg/actions';
import { ChevronLeft, Loader2, Save, Search, User, Mail, Phone, Hash, Check, Trash2, Calendar } from 'lucide-react';

const STAGES = [
  "Query Received", "Acknowledged", "Quoted", "Follow Up", "Revision", 
  "Negotiation", "Confirmation", "Invoiced", "Operations", "Closed Lost", "Closed Won"
];

export default function QueryDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const isNew = id === 'new';

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!isNew);
  
  const [formData, setFormData] = useState({
    owner: '',
    opportunityName: '',
    queryNumber: '',
    queryType: 'FIT PRIVATE',
    arrivalDate: '',
    departureDate: '',
    contactName: '', 
    email: '', 
    phone: '', 
    country: '',
    status: 'Query Received',
    pax: 1 as number | string,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [allAgents, setAllAgents] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [showAgentResults, setShowAgentResults] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        // 1. Fetch Agents and cast to any array for safety
        const agentsData = await getAgents() as any[];
        setAllAgents(agentsData);

        if (isNew) {
            setFormData(prev => ({ ...prev, status: 'Query Received' }));
            setSelectedCompany(null);
            setSearchTerm('');
            setFetching(false);
            return;
        }

        if (id) {
          setFetching(true);
          // 2. Fetch Query and cast to any to stop property errors
          const query = await getQueryById(id as string) as any;
          
          if (query) {
            setFormData({
              owner: query.owner || '',
              opportunityName: query.queryName || '',
              queryNumber: query.queryNumber || '',
              queryType: query.queryType || 'FIT PRIVATE',
              arrivalDate: query.arrivalDate || '',
              departureDate: query.departureDate || '',
              contactName: query.agentName || '', 
              email: query.agentEmail || '',
              phone: query.phone || '',
              country: query.country || '',
              status: query.status || 'Query Received',
              pax: query.guests || 1,
            });
            
            const linkedCompany = agentsData.find(a => a.agentNumber === query.agentCode);
            if (linkedCompany) {
              setSelectedCompany(linkedCompany);
              setSearchTerm(`${linkedCompany.companyName} ${linkedCompany.agentNumber}`);
            }
          }
        }
      } catch (error) { 
        console.error(error); 
      } finally { 
        setFetching(false); 
      }
    }
    init();
  }, [id, isNew]);

  const calculatedNights = formData.arrivalDate && formData.departureDate 
    ? Math.max(0, Math.ceil((new Date(formData.departureDate).getTime() - new Date(formData.arrivalDate).getTime()) / 86400000))
    : 0;

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedCompany) return alert("Please search and select a Company Account first.");
    
    setLoading(true);
    try {
      const payload = {
          ...formData,
          nights: calculatedNights,
          agentCode: selectedCompany.agentNumber || "0000",
          agentName: formData.contactName,
          agentEmail: formData.email,
          guests: formData.pax
      };

      let res;
      if (isNew) {
          const dataToSend = new FormData();
          Object.entries(payload).forEach(([key, value]) => {
            dataToSend.append(key, value != null ? String(value) : '');
          });
          res = await registerQuery(dataToSend);
      } else {
          res = await updateQuery(id as string, payload);
      }

      setLoading(false);
      if (!res?.error) {
          alert("Query saved successfully!");
          if (isNew) {
              router.push('/qreg/query');
          } else {
              router.push(`/qreg/query/${res?.queryNumber || formData.queryNumber || id}`);
          }
      } else {
          alert(res.error);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("An unexpected error occurred while saving.");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanentely delete this query?")) return;
    setLoading(true);
    const res = await deleteQuery(id as string) as any;
    setLoading(false);
    if (res.success) {
      router.push('/qreg/query');
      router.refresh();
    } else {
      alert(res.error);
    }
  };

  if (fetching) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-[#0070d2]" size={40} /></div>;

  return (
    <div className="max-w-screen-2xl mx-auto px-6 pb-20 font-sans text-zinc-900">
      
      {/* 1. PROGRESS BAR */}
      <div className="w-full overflow-x-auto no-scrollbar py-6">
        <div className="flex items-center min-w-max px-1">
          {STAGES.map((stage, index) => {
            const isActive = formData.status === stage;
            const isCompleted = STAGES.indexOf(formData.status) > index;
            
            return (
              <div 
                key={stage}
                onClick={() => setFormData({ ...formData, status: stage })}
                className={`relative flex items-center justify-center px-6 py-2 cursor-pointer transition-all border-y border-r first:border-l first:rounded-l-full last:rounded-r-full group
                  ${isActive ? 'bg-[#0070d2] border-[#0070d2] text-white z-10' : ''}
                  ${isCompleted ? 'bg-emerald-50 text-emerald-700 border-zinc-200' : ''}
                  ${!isActive && !isCompleted ? 'bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50' : ''}
                `}
                style={{ clipPath: index !== STAGES.length - 1 ? 'polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 0% 100%, 5% 50%)' : '' }}
              >
                <span className="text-[10px] font-bold uppercase tracking-tight whitespace-nowrap px-2">
                  {isCompleted ? <Check size={12} className="inline mr-1" /> : null}
                  {stage}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <header className="flex justify-between items-center py-4 border-b border-zinc-200 mb-8">
        <button onClick={() => router.push('/qreg/query')} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-black transition-colors font-medium">
          <ChevronLeft size={16} /> Back
        </button>
        
        <div className="flex items-center gap-3">
          {!isNew && (
            <button type="button" onClick={handleDelete} disabled={loading} className="px-4 py-2.5 text-red-600 border border-red-200 bg-red-50 rounded-md text-xs font-bold hover:bg-red-100 flex items-center gap-2">
              <Trash2 size={14} /> Delete
            </button>
          )}

          {!isNew && (
            <button 
              type="button" 
              onClick={() => router.push(`/qmake/${formData.queryNumber}`)} 
              className="px-6 py-2.5 bg-zinc-900 text-white rounded-md text-xs font-bold hover:bg-zinc-800 transition-all shadow-sm flex items-center gap-2"
            >
              <Calendar size={14} /> Itinerary
            </button>
          )}

          <button type="submit" form="queryForm" disabled={loading} className="px-10 py-2.5 bg-[#0070d2] text-white rounded-md text-xs font-bold hover:bg-[#005fb2] disabled:opacity-50 transition-all shadow-sm">
            {loading ? <Loader2 className="animate-spin" size={16} /> : "Save Changes"}
          </button>
        </div>
      </header>

      <form id="queryForm" onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-zinc-200 border border-zinc-200 rounded-lg overflow-hidden shadow-sm items-start min-h-125">
        
        {/* LEFT COLUMN: Query Info */}
        <div className="bg-white flex flex-col divide-y divide-zinc-100 h-full">
          <div className="p-4 bg-zinc-50/50 text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-200">Query Information</div>
          
          <div className="grid grid-cols-3 items-center p-4 gap-4">
            <label className="text-[13px] text-zinc-600">Owner</label>
            <input required value={formData.owner} onChange={e => setFormData({...formData, owner: e.target.value})} className="col-span-2 bg-white border border-zinc-200 rounded py-1.5 px-3 text-sm outline-none focus:border-[#0070d2]" />
          </div>

          <div className="grid grid-cols-3 items-center p-4 gap-4">
            <label className="text-[13px] text-zinc-600 font-bold">Query Name</label>
            <div className="col-span-2 text-xs font-mono font-bold text-zinc-900 bg-zinc-50 p-2 rounded border border-zinc-100">
                {isNew ? "-- Auto Generated --" : formData.opportunityName}
            </div>
          </div>

          <div className="grid grid-cols-3 items-center p-4 gap-4">
            <label className="text-[13px] text-zinc-600">Query Type</label>
            <select value={formData.queryType} onChange={e => setFormData({...formData, queryType: e.target.value})} className="col-span-2 bg-white border border-zinc-200 rounded py-1.5 px-2 text-sm outline-none">
                <option value="FIT PRIVATE">FIT PRIVATE</option>
                <option value="SIC PRIVATE">SIC PRIVATE</option>
                <option value="GIT GROUP">GIT GROUP</option>
            </select>
          </div>

          <div className="grid grid-cols-3 items-center p-4 gap-4">
            <label className="text-[13px] text-zinc-600 font-bold">PAX (Guests)</label>
            <input type="number" required value={formData.pax} onChange={e => setFormData({...formData, pax: e.target.value})} className="w-24 bg-white border border-zinc-200 rounded py-1.5 px-3 text-sm outline-none font-bold" />
          </div>

          <div className="grid grid-cols-3 items-center p-4 gap-4">
              <label className="text-[13px] text-zinc-600">Arrival Date</label>
              <input type="date" required value={formData.arrivalDate} onChange={e => setFormData({...formData, arrivalDate: e.target.value})} className="col-span-2 bg-white border border-zinc-200 rounded py-1.5 px-3 text-sm outline-none" />
          </div>

          <div className="grid grid-cols-3 items-center p-4 gap-4">
              <label className="text-[13px] text-zinc-600">Departure Date</label>
              <input type="date" required value={formData.departureDate} onChange={e => setFormData({...formData, departureDate: e.target.value})} className="col-span-2 bg-white border border-zinc-200 rounded py-1.5 px-3 text-sm outline-none" />
          </div>

          <div className="grid grid-cols-3 items-center p-4 gap-4">
              <label className="text-[13px] font-bold text-zinc-900 uppercase">Duration</label>
              <div className="col-span-2 text-sm font-black text-[#0070d2]">
                {calculatedNights} Nights / {calculatedNights + 1} Days
              </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Account Info */}
        <div className="bg-white flex flex-col divide-y divide-zinc-100 h-full">
          <div className="p-4 bg-zinc-50/50 text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-200">Account & Partner</div>
          
          <div className="grid grid-cols-3 items-center p-4 gap-4">
            <label className="text-[13px] text-zinc-600">Query Number</label>
            <div className="col-span-2 text-sm font-mono font-bold text-zinc-400">
                {isNew ? "-- New --" : formData.queryNumber}
            </div>
          </div>

          <div className="grid grid-cols-3 items-center p-4 gap-4 relative">
              <label className="text-[13px] text-zinc-600">Search Agent</label>
              <div className="col-span-2 relative">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 opacity-20" size={14} />
                  <input 
                      className="w-full bg-zinc-50 border border-zinc-200 rounded py-1.5 pl-9 pr-3 text-sm outline-none font-bold focus:border-[#0070d2]"
                      placeholder="Company Name or Code..."
                      value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); setShowAgentResults(true); setSelectedCompany(null); }}
                  />
                </div>
                {showAgentResults && searchTerm && !selectedCompany && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-zinc-200 rounded shadow-xl max-h-48 overflow-y-auto">
                    {allAgents.filter(a => a.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) || a.agentNumber?.includes(searchTerm)).map(agent => (
                      <div key={agent._id} onClick={() => { setSelectedCompany(agent); setSearchTerm(`${agent.companyName} ${agent.agentNumber}`); setShowAgentResults(false); }} className="p-3 text-xs hover:bg-zinc-50 cursor-pointer flex justify-between items-center border-b border-zinc-100 last:border-0">
                        <span className="font-bold uppercase text-zinc-700">{agent.companyName}</span>
                        <span className="font-mono text-zinc-400">{agent.agentNumber}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
          </div>

          <div className="grid grid-cols-3 items-center p-4 gap-4">
              <label className="text-[13px] text-zinc-600">Contact Person</label>
              <input required value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} className="col-span-2 bg-white border border-zinc-200 rounded py-1.5 px-3 text-sm outline-none" />
          </div>

          <div className="grid grid-cols-3 items-center p-4 gap-4">
              <label className="text-[13px] text-zinc-600">Email Address</label>
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="col-span-2 bg-white border border-zinc-200 rounded py-1.5 px-3 text-sm outline-none" />
          </div>

          <div className="grid grid-cols-3 items-center p-4 gap-4">
              <label className="text-[13px] text-zinc-600">WhatsApp / Phone</label>
              <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="col-span-2 bg-white border border-zinc-200 rounded py-1.5 px-3 text-sm outline-none" />
          </div>

          <div className="grid grid-cols-3 items-center p-4 gap-4">
              <label className="text-[13px] text-zinc-600 font-bold uppercase">Destination</label>
              <input required value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="col-span-2 bg-zinc-50 border border-zinc-200 rounded py-1.5 px-3 text-sm outline-none font-bold" placeholder="e.g. TOKYO / OSAKA" />
          </div>
        </div>
      </form>
    </div>
  );
}