"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { LogOut, User as UserIcon, LogIn } from "lucide-react";

export default function UserStatus() {
  const { data: session, status } = useSession();

  // Show a loading pulse while checking if user is logged in
  if (status === "loading") {
    return <div className="h-8 w-8 animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-full" />;
  }

  // If user is logged in, show their profile pic and a logout button
  if (session) {
    return (
      <div className="flex items-center gap-3 bg-white/10 dark:bg-black/10 p-1 rounded-full pr-3 border border-white/5">
        {session.user?.image ? (
          <img 
            src={session.user.image} 
            alt="User" 
            // CRITICAL: This allows the browser to show your Google photo on localhost
            referrerPolicy="no-referrer"
            // object-cover ensures your space photo isn't stretched
            className="w-8 h-8 rounded-full border border-white/20 shadow-sm object-cover" 
          />
        ) : (
          <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center text-white">
            <UserIcon size={14} />
          </div>
        )}
        
        <button 
          onClick={() => signOut()} 
          className="text-white dark:text-zinc-900 hover:text-red-400 dark:hover:text-red-600 transition-colors"
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  // If not logged in, show the Sign In button
  return (
    <button 
      onClick={() => signIn("google")}
      className="flex items-center gap-2 bg-white dark:bg-black text-black dark:text-white px-4 py-2 rounded-full text-[12px] font-bold hover:opacity-80 transition-all shadow-md"
    >
      <LogIn size={14} /> Sign In
    </button>
  );
}