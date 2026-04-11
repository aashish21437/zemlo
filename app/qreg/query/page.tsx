"use client"

import React, { useState, useEffect } from 'react';
import { getQueries } from '../actions';
import { QueryForm } from '@/components/qreg/query-form';
import { QueryTable } from '@/components/qreg/query-table';

export default function QueryRegistrationPage() {
  const [queries, setQueries] = useState<any[]>([]);

  useEffect(() => { loadQueries(); }, []);

  async function loadQueries() {
    const data = await getQueries();
    setQueries(data);
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight">Query Management</h2>
          <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1">Live Tour Requests</p>
        </div>
        <QueryForm/>
      </div>
      <hr className="border-border/50" />
      <QueryTable queries={queries} />
    </div>
  );
}