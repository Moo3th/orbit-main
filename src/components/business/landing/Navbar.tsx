'use client';

import React, { useState, useEffect } from "react";
import { Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/business/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/business/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { encodeImagePath } from "@/utils/imagePath";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/business/ui/dropdown-menu";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    
    // If clicking on "pricing" and we're on the SMS page, scroll there
    if (id === "pricing" && pathname === "/business/products/sms") {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    
    // If we're not on the business page, navigate to business first
    if (pathname !== "/business") {
      window.location.href = `/business#${id}`;
    } else {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { name: "الأسعار", id: "pricing" },
    { name: "المطورين (API)", id: "developers" },
    { name: "المدونة", id: "blog" },
  ];

  const productLinks = [
    { name: "الرسائل النصية SMS", href: "/business/products/sms" },
    { name: "واتساب أعمال API", href: "/business/products/whatsapp" },
    { name: "O-Time برنامج الموارد البشرية", href: "/business/products/o-time" },
    { name: "Gov Gate", href: "/business/products/gov-gate" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || pathname !== "/business" ? "bg-[#E8DCCB]/95 backdrop-blur-md shadow-sm py-0.5" : "bg-transparent py-1"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between min-h-[60px] md:min-h-[72px]">
        {/* Right: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={encodeImagePath("/logo/شعار المدار1-0٢.png")}
            alt="Orbit Logo"
            width={300}
            height={300}
            className="h-24 md:h-28 w-auto object-contain"
          />
        </Link>

        {/* Center: Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          
          {/* Products Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-[#7A1E2E] transition-colors outline-none cursor-pointer">
                المنتجات
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white border-[#7A1E2E]/10 z-50">
              {productLinks.map((product) => (
                <DropdownMenuItem key={product.name} asChild>
                  <Link href={product.href} className="w-full cursor-pointer hover:bg-[#7A1E2E]/5 hover:text-[#7A1E2E]">
                    {product.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {navLinks.map((link) => (
            <a
              key={link.name}
              href={`#${link.id}`}
              onClick={(e) => scrollToSection(e, link.id)}
              className="text-sm font-medium text-slate-700 hover:text-[#7A1E2E] transition-colors cursor-pointer"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Left: Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            className="font-medium text-[#7A1E2E] hover:text-[#7A1E2E] hover:bg-[#7A1E2E]/10"
            asChild
          >
            <a href="https://app.mobile.net.sa/login" target="_blank" rel="noopener noreferrer">
              تسجيل الدخول
            </a>
          </Button>
          <Button 
            className="bg-[#7A1E2E] hover:bg-[#601824] text-white font-bold shadow-lg shadow-[#7A1E2E]/20"
            asChild
          >
            <a href="https://app.mobile.net.sa/reg" target="_blank" rel="noopener noreferrer">
              أنشئ حسابك وابدأ بـ 50 رسالة مجانية
            </a>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-[#7A1E2E]" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-[#E8DCCB] border-l border-[#7A1E2E]/20 overflow-y-auto">
              <SheetTitle className="sr-only">القائمة</SheetTitle>
              <SheetDescription className="sr-only">
                قائمة التنقل الرئيسية للموقع
              </SheetDescription>
              
              <div className="flex flex-col gap-4 mt-6">
                {/* المنتجات */}
                <div className="space-y-3">
                  <h4 className="font-bold text-[#7A1E2E] text-sm uppercase tracking-wider border-b border-[#7A1E2E]/30 pb-2 text-center">
                    المنتجات
                  </h4>
                  <div className="space-y-2">
                    {productLinks.map((product) => (
                      <Link
                        key={product.name}
                        href={product.href}
                        className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-[#7A1E2E] hover:bg-white/50 rounded-lg transition-colors text-center"
                      >
                        {product.name}
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* الروابط الأخرى */}
                <div className="space-y-2">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={`#${link.id}`}
                      onClick={(e) => scrollToSection(e, link.id)}
                      className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-[#7A1E2E] hover:bg-white/50 rounded-lg transition-colors text-center"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
                
                {/* الأزرار */}
                <div className="space-y-3 pt-4 border-t border-[#7A1E2E]/20 mt-auto px-4">
                  <Button
                    variant="outline"
                    className="w-full justify-center border-[#7A1E2E] text-[#7A1E2E] hover:bg-[#7A1E2E]/10 bg-transparent font-medium"
                    asChild
                  >
                    <a href="https://app.mobile.net.sa/login" target="_blank" rel="noopener noreferrer">
                      تسجيل الدخول
                    </a>
                  </Button>
                  <Button 
                    className="w-full bg-[#7A1E2E] text-white hover:bg-[#601824] font-bold shadow-lg shadow-[#7A1E2E]/30"
                    asChild
                  >
                    <a href="https://app.mobile.net.sa/reg" target="_blank" rel="noopener noreferrer">
                      أنشئ حسابك وابدأ بـ 50 رسالة مجانية
                    </a>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};



