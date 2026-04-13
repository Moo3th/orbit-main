'use client';

import React from "react";
import { Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { encodeImagePath } from "@/utils/imagePath";

export const Footer = () => {
  return (
    <footer className="bg-[#7A1E2E] text-[#E8DCCB] pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              {/* Logo size doubled from h-20 to h-40 */}
              <Image 
                src={encodeImagePath("/logo/شعار المدار-04.svg")} 
                alt="Orbit Logo" 
                width={160} 
                height={160} 
                className="h-40 w-auto object-contain brightness-0 invert opacity-90" 
              />
            </div>
            <p className="text-sm leading-relaxed text-[#E8DCCB]/80">
              المنصة السعودية الرائدة في حلول التواصل للشركات. نساعدك في الوصول لعملائك بأسرع الطرق وأكثرها أماناً.
            </p>
            <div className="flex gap-4">
              <a href="https://x.com/orbittec_sa" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="https://www.instagram.com/orbittec_sa?igsh=MXFqZmluMWhrbXk0dg==" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-white font-bold mb-6">المنتجات</h4>
            <ul className="space-y-4 text-sm text-[#E8DCCB]/80">
              <li><Link href="/business/products/whatsapp" className="hover:text-white transition-colors">واتساب للأعمال API</Link></li>
              <li><Link href="/business/products/sms" className="hover:text-white transition-colors">رسائل SMS</Link></li>
              <li><Link href="/business/products/o-time" className="hover:text-white transition-colors">O-Time</Link></li>
              <li><Link href="/business/products/gov-gate" className="hover:text-white transition-colors">Gov Gate</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-white font-bold mb-6">الشركة</h4>
            <ul className="space-y-4 text-sm text-[#E8DCCB]/80">
              <li><Link href="/about-us" className="hover:text-white transition-colors">من نحن</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">اتصل بنا</a></li>
              <li><a href="#" className="hover:text-white transition-colors">المدونة</a></li>
              <li><a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6">تواصل معنا</h4>
            <ul className="space-y-4 text-sm text-[#E8DCCB]/80">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4" />
                <span>marketing@corbit.sa</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4" />
                <span>920006900</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-1" />
                <div>
                  المدينة المنورة، طريق الملك عبدالله<br/>
                  حي الراية - 8443 طابق 6
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#E8DCCB]/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#E8DCCB]/60">
          <p>© 2025 مدار (Orbit). جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-6">
            <span>السجل التجاري: 7012398264</span>
            <span>التصريح: LGP0921-22</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

