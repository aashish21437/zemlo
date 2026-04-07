import dbConnect from '@/lib/db';
import Sightseeing from '@/models/Sightseeing';
import Link from 'next/link';

export default async function SightseeingDashboard() {
  await dbConnect();
  
  // Fetch all entries, sorted by newest first
  const spots = await Sightseeing.find({}).sort({ createdAt: -1 });

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Sightseeing Dashboard</h1>
            <p className="text-slate-500">Managing {spots.length} entries in Atlas Cloud</p>
          </div>
          <Link 
            href="/add-sightseeings" 
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg"
          >
            + Add New Spot
          </Link>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-black uppercase text-slate-500">Spot Name</th>
                <th className="p-4 text-xs font-black uppercase text-slate-500">Location</th>
                <th className="p-4 text-xs font-black uppercase text-slate-500">Category</th>
                <th className="p-4 text-xs font-black uppercase text-slate-500">Price (Adult)</th>
                <th className="p-4 text-xs font-black uppercase text-slate-500">Vibe</th>
                <th className="p-4 text-xs font-black uppercase text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {spots.map((spot) => (
                <tr key={spot._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{spot.who_what?.name_en}</div>
                    <div className="text-xs text-slate-400">{spot.who_what?.tagline || 'No tagline'}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-slate-600">{spot.where?.hierarchy?.prefecture}</div>
                    <div className="text-xs text-slate-400">{spot.where?.hierarchy?.municipality}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100">
                      {spot.who_what?.category_primary}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-sm text-slate-700">
                    ¥{spot.ticketing?.pricing?.adult?.toLocaleString() || '0'}
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-medium ${spot.vibe?.primary === 'Spiritual' ? 'text-purple-600' : 'text-slate-500'}`}>
                      {spot.vibe?.primary || 'N/A'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {spot.who_what?.unesco_status && (
                        <span title="UNESCO World Heritage" className="text-amber-500 text-lg">🏛️</span>
                      )}
                      {spot.facilities?.photography_allowed && (
                        <span title="Photography Allowed" className="text-emerald-500 text-lg">📸</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {spots.length === 0 && (
            <div className="p-20 text-center text-slate-400">
              No entries found. Go add some magic to the database!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}