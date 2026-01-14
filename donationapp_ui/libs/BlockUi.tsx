// lib/BlockUI.tsx
"use client";

import React from "react";

interface BlockUIProps {
  loading: boolean;     
  message?: string;       
}


const BlockUI: React.FC<BlockUIProps> = ({ loading, message = "กำลังโหลด..." }) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60">
      <div className="w-14 h-14 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
      <span className="text-white text-sm">{message}</span>
    </div>
  );
};

export default BlockUI;
