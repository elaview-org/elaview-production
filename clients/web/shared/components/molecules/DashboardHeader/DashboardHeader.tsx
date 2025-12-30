"use client";

import React from "react";

function DashboardHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white">{title}</h1>
      <p className="mt-2 text-slate-400">{subtitle}</p>
    </div>
  );
}

export default DashboardHeader;
