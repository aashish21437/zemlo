import React from 'react';
import { ArrowRight, Shield, Zap, Globe } from 'lucide-react'; // You may need to run: npm install lucide-react

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* --- Navigation --- */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-tighter text-indigo-600">
          ZEMLO
        </div>
        <div className="hidden md:flex space-x-8 font-medium text-slate-600">
          <a href="#features" className="hover:text-indigo-600 transition">Features</a>
          <a href="#" className="hover:text-indigo-600 transition">About</a>
          <a href="#" className="hover:text-indigo-600 transition">Contact</a>
        </div>
        <button className="bg-slate-900 text-white px-5 py-2 rounded-full font-medium hover:bg-slate-800 transition">
          Launch App
        </button>
      </nav>

      {/* --- Hero Section --- */}
      <header className="relative px-8 pt-20 pb-32 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          The future of <span className="text-indigo-600">Zemlo</span> starts here.
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          Building high-performance web applications with Next.js. 
          Fast, secure, and deployed globally on zemlo.in.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <button className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition">
            Get Started <ArrowRight size={20} />
          </button>
          <button className="bg-white border-2 border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition">
            View Documentation
          </button>
        </div>
      </header>

      {/* --- Features Grid --- */}
      <section id="features" className="bg-slate-50 py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Zap className="text-indigo-600" />}
              title="Lightning Fast"
              description="Optimized with Next.js 16 and Turbopack for the fastest load times possible."
            />
            <FeatureCard 
              icon={<Shield className="text-indigo-600" />}
              title="Secure by Default"
              description="Enterprise-grade security and SSL protection live on zemlo.in."
            />
            <FeatureCard 
              icon={<Globe className="text-indigo-600" />}
              title="Global Scale"
              description="Deploy your application to the edge and reach users anywhere in milliseconds."
            />
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-12 border-t border-slate-100 text-center text-slate-500">
        <p>© 2026 Zemlo. All rights reserved.</p>
      </footer>
    </div>
  );
}

// Small helper component for the features
function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
      <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}