//app/qreg/layout.tsx

import { QregNav } from "@/components/qreg/qreg-nav";

export default function QregLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Changed pt-32 to pt-8 to bring the navbar up
    // Also removed container mx-auto from the outer div if you want full-width header
    <div className="min-h-screen bg-background text-foreground pt-8 pb-20 px-6 lg:px-16 container mx-auto">
      <QregNav />
      <main>
        {children}
      </main>
    </div>
  );
}