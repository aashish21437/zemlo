import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, Shield, Globe, Cpu } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-indigo-100">
      
      {/* --- HERO SECTION --- */}
      <section className="container mx-auto px-6 pt-32 pb-24 text-center">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium rounded-full border-primary/10">
            Now Live on zemlo.in
          </Badge>
          <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1]">
            Build faster. <br />
            <span className="text-muted-foreground">Ship smarter.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-muted-foreground mb-12 leading-relaxed">
            A high-performance Next.js foundation for your next big idea. 
            Clean code, accessible components, and global deployment.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-14 px-10 text-lg rounded-full group">
              Get Started 
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-10 text-lg rounded-full">
              Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="container mx-auto px-6 py-24 border-t border-border/40">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            icon={<Zap className="h-6 w-6 text-yellow-500" />}
            title="Next.js 16"
            description="Leveraging the latest App Router and React 19 features."
          />
          <FeatureCard 
            icon={<Shield className="h-6 w-6 text-blue-500" />}
            title="Type Safe"
            description="Built with TypeScript to catch errors before they reach production."
          />
          <FeatureCard 
            icon={<Cpu className="h-6 w-6 text-indigo-500" />}
            title="Shadcn/UI"
            description="Beautifully designed components you actually own."
          />
          <FeatureCard 
            icon={<Globe className="h-6 w-6 text-emerald-500" />}
            title="Global Edge"
            description="Deployed to the edge for sub-millisecond response times."
          />
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="mt-auto py-12 border-t border-border/40 text-center">
        <p className="text-sm text-muted-foreground font-medium">
          © 2026 ZEMLO • Built with Passion
        </p>
      </footer>
    </div>
  );
}

// Reusable Feature Card Component
function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="group hover:border-primary/50 transition-all duration-300 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="mb-6 p-3 bg-secondary/50 w-fit rounded-xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 tracking-tight">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}