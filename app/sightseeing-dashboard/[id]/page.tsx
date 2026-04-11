// import { saveSightseeing } from "../actions"; 
import { dbConnect } from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
// import { saveSightseeing, deleteSightseeing } from "../actions";
import { DeleteButton } from "./DeleteButton";
import { saveSightseeing } from "../actions";

export default async function SightseeingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const isNew = id === "new";

  let existingData = null;

  if (!isNew) {
    const mongoose = await dbConnect();
    const db = mongoose.connection.db;
    existingData = await db?.collection("sightseeings").findOne({ 
      sightseeing_id: parseInt(id) 
    });
  }

  return (
    <div className="min-h-screen bg-background p-12 text-foreground">
      <div className="max-w-5xl mx-auto">
        
        {/* NAVIGATION: BACK TO DASHBOARD */}
        <Link 
          href="/sightseeing-dashboard" 
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-all w-fit group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Index</span>
        </Link>

        <header className="mb-10 border-b border-border pb-6">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">
            {isNew ? "New Registration" : `Console / ID: ${id}`}
          </h1>
        </header>

        <form action={saveSightseeing} className="space-y-8">
          
          <input type="hidden" name="current_id" value={id} />

          <div className="bg-background border border-foreground/20 rounded-[2rem] p-10 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              
              {/* English Name */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">English Name</label>
                <input 
                  name="name_en" 
                  defaultValue={existingData?.name_en || ""}
                  required 
                  className="w-full bg-muted/20 border border-foreground/20 rounded-xl p-4 font-bold outline-none focus:border-foreground transition-colors" 
                />
              </div>

              {/* Primary Category */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Primary Category</label>
                <select 
                  name="category_primary" 
                  defaultValue={existingData?.category_primary || "Historic"} 
                  className="w-full bg-muted/20 border border-foreground/20 rounded-xl p-4 font-bold outline-none focus:border-foreground transition-colors"
                >
                  <option value="Historic">Historic</option>
                  <option value="Experience">Experience</option>
                  <option value="Modern">Modern</option>
                  <option value="Temple">Temple</option>
                </select>
              </div>

              {/* Municipality */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Municipality</label>
                <input 
                  name="municipality" 
                  defaultValue={existingData?.municipality || ""} 
                  required 
                  className="w-full bg-muted/20 border border-foreground/20 rounded-xl p-4 outline-none focus:border-foreground transition-colors" 
                />
              </div>

              {/* Adult Price */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Adult Price (JPY)</label>
                <input 
                  name="adult_price" 
                  type="number" 
                  defaultValue={existingData?.adult_price || ""} 
                  required 
                  className="w-full bg-muted/20 border border-foreground/20 rounded-xl p-4 font-bold outline-none focus:border-foreground transition-colors" 
                />
              </div>
            </div>
          </div>

<div className="flex justify-between items-center mt-12 pt-8 border-t border-border">
  {/* DELETE BUTTON: Only visible on existing records */}
  {!isNew ? (
    <DeleteButton id={parseInt(id)} />
  ) : (
    <div /> 
  )}

  {/* SAVE BUTTON */}
  <button 
    type="submit" 
    className="bg-foreground text-background px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-lg"
  >
    {isNew ? "Register & Generate ID" : "Save Changes"}
  </button>
</div>

        </form>
      </div>
    </div>
  );
}