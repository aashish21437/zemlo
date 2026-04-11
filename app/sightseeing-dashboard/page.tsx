import { dbConnect } from '@/lib/db';
import Sightseeing from '@/models/Sightseeing';
import Link from 'next/link';
import Navbar from "@/components/Navbar";


interface SightseeingSpot {
  _id: string;
  sightseeing_id: number;
  name_en: string;
  category_primary: string;
  municipality: string;
  adult_price: number;
  createdAt: Date;
}

export default async function SightseeingDashboard() {
  await dbConnect();

  const spots = (await Sightseeing.find({})
    .sort({ sightseeing_id: -1 })
    .lean()) as unknown as SightseeingSpot[];

  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-6">
      <div className="max-w-7xl mx-auto">
              <Navbar />

        {/* HEADER SECTION */}
        <div className="flex justify-between items-end mb-12 border-b border-border pb-8">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">
              Database <span className="text-muted-foreground not-italic font-light">Index</span>
            </h1>
            <p className="text-muted-foreground mt-2 font-medium italic text-sm">
              {spots.length} destinations currently synced to Master Engine
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* BULK BUTTON: Outlined Style */}
            <Link
              href="/sightseeing-dashboard/bulk"
              className="px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] border border-foreground hover:bg-muted/10 transition-all"
            >
              Bulk Registration
            </Link>

            {/* REGISTER BUTTON: Solid Black Style (Matching the Bulk look but inverted) */}
            <Link
              href="/sightseeing-dashboard/new"
              className="bg-foreground text-background px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] border border-foreground hover:opacity-90 transition-all"
            >
              + Register Spot
            </Link>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/20 border-b border-border">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">ID</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Destination Name</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Adult Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {spots.map((spot) => (
                  <tr key={spot._id.toString()} className="hover:bg-muted/10 transition-colors group">
                    <td className="p-6 font-mono text-sm font-bold text-primary italic">
                      #{spot.sightseeing_id}
                    </td>
                    <td className="p-6">
                      <Link
                        href={`/sightseeing-dashboard/${spot.sightseeing_id}`}
                        className="font-bold text-lg hover:underline underline-offset-8 decoration-2"
                      >
                        {spot.name_en}
                      </Link>
                    </td>
                    <td className="p-6">
                      <span className="px-3 py-1 bg-foreground/5 rounded-full text-[10px] font-black uppercase tracking-widest border border-foreground/10">
                        {spot.category_primary}
                      </span>
                    </td>
                    <td className="p-6 font-bold text-right">
                      ¥{spot.adult_price?.toLocaleString() || '0'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {spots.length === 0 && (
            <div className="p-20 text-center">
              <div className="text-muted-foreground font-bold italic uppercase tracking-widest text-xs opacity-40">
                No Records Found
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}