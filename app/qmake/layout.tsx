import { checkPermission } from "@/lib/check-permissions";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default async function QmakeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasAccess = await checkPermission('qmake_access');

  if (!hasAccess) {
    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="h-20 w-20 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center mx-auto text-red-500">
                    <ShieldAlert size={40} />
                </div>
                <h1 className="text-3xl font-black uppercase italic tracking-tighter">Module Locked</h1>
                <p className="text-muted-foreground text-sm font-medium italic">
                    You do not have permission to access the Itinerary Builder (Query Maker). Contact admin for authorization.
                </p>
                <div className="pt-6 border-t border-border">
                    <Link href="/" className="px-8 py-3 bg-foreground text-background rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all inline-block">
                        Return home
                    </Link>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  );
}
