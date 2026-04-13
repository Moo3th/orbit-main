'use client';

import React from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/business/ui/button";

export const WhatsAppButton = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
        {/* Tooltip bubble */}
        <div className="absolute bottom-full right-0 mb-4 bg-white p-3 rounded-xl shadow-xl border border-slate-100 w-48 hidden md:block animate-in slide-in-from-bottom-2">
            <p className="text-xs text-slate-700 font-medium">عندك استفسار؟ تحدث مع فريقنا الآن</p>
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white transform rotate-45 border-b border-r border-slate-100"></div>
        </div>

      <Button 
        className="h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#128C7E] shadow-lg hover:shadow-xl transition-all p-0 flex items-center justify-center animate-bounce duration-[2000ms]"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-8 w-8 text-white fill-current" />
      </Button>
    </div>
  );
};



