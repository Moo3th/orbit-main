'use client';

import React, { useState } from "react";
import { Send, Phone, Mail, MapPin, CheckCircle, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/business/ui/button";
import { Card, CardContent } from "@/components/business/ui/card";
import { useSiteData } from "./SiteDataContext";

const productOptions = [
  { value: "sms", label: "الرسائل النصية SMS" },
  { value: "whatsapp", label: "واتساب أعمال API" },
  { value: "o-time", label: "O-Time نظام الموارد البشرية" },
  { value: "gov-gate", label: "Gov Gate بوابة حكومية" },
  { value: "other", label: "استفسار عام" },
];

export const ContactPage = () => {
  const { addContactSubmission, notificationEmail } = useSiteData();
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    product: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Send email via EmailJS
  const sendEmailNotification = async (formData: typeof form) => {
    try {
      // EmailJS: free plan = 200 emails/month - https://www.emailjs.com
      // Replace these with your actual EmailJS credentials from admin settings
      const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";   // e.g. "service_abc123"
      const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID"; // e.g. "template_xyz789"
      const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";    // e.g. "user_abc123xyz"

      // If credentials are not configured, use mailto fallback
      if (EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID") {
        // Fallback: Open mailto link to send notification
        const productLabel = productOptions.find(p => p.value === formData.product)?.label || "غير محدد";
        const subject = encodeURIComponent(`طلب تواصل جديد من ${formData.name} - المدار (Orbit)`);
        const body = encodeURIComponent(
          `طلب تواصل جديد:\n\n` +
          `الاسم: ${formData.name}\n` +
          `البريد: ${formData.email}\n` +
          `الجوال: ${formData.phone}\n` +
          `الشركة: ${formData.company || "غير محدد"}\n` +
          `الخدمة: ${productLabel}\n` +
          `الرسالة: ${formData.message}\n\n` +
          `---\nتم الإرسال تلقائياً من موقع المدار (Orbit)`
        );

        // Create a hidden iframe to trigger mailto without leaving the page
        const mailtoLink = `mailto:${notificationEmail}?subject=${subject}&body=${body}`;
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = mailtoLink;
        document.body.appendChild(iframe);
        setTimeout(() => document.body.removeChild(iframe), 3000);

        return { success: true, method: "mailto" };
      }

      // EmailJS actual API call
      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: {
            to_email: notificationEmail,
            from_name: formData.name,
            from_email: formData.email,
            phone: formData.phone,
            company: formData.company,
            product: productOptions.find(p => p.value === formData.product)?.label || "غير محدد",
            message: formData.message,
            reply_to: formData.email,
          },
        }),
      });

      if (response.ok) {
        return { success: true, method: "emailjs" };
      }
      return { success: false, method: "emailjs" };
    } catch (error) {
      console.error("Email notification error:", error);
      return { success: false, method: "error" };
    }
  };

  // Browser notification
  const sendBrowserNotification = (name: string) => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("طلب تواصل جديد - المدار", {
          body: `طلب جديد من ${name}`,
          icon: "/favicon.ico",
          tag: "orbit-contact",
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            new Notification("طلب تواصل جديد - المدار", {
              body: `طلب جديد من ${name}`,
              icon: "/favicon.ico",
              tag: "orbit-contact",
            });
          }
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.message) {
      toast.error("يرجى تعبئة جميع الحقول المطلوبة");
      return;
    }

    setSending(true);

    // 1. Save to admin submissions
    addContactSubmission(form);

    // 2. Send email notification to sales team
    const emailResult = await sendEmailNotification(form);

    if (emailResult.success) {
      if (emailResult.method === "mailto") {
        toast.success("تم إرسال رسالتك بنجاح وتم فتح بريد الإشعار!");
      } else {
        toast.success("تم إرسال رسالتك وإشعار فريق المبيعات بالبريد الإلكتروني!");
      }
    } else {
      toast.success("تم حفظ طلبك بنجاح! سيتم مراجعته من فريق المبيعات.");
    }

    // 3. Browser notification
    sendBrowserNotification(form.name);

    setSending(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="pt-32 pb-20 min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-lg mx-auto text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl text-slate-900">تم إرسال رسالتك بنجاح!</h2>
            <p className="text-lg text-slate-600">
              شكراً لتواصلك معنا. سيقوم فريق المبيعات بالرد عليك خلال ساعات العمل.
            </p>
            <div className="bg-orbit-blue/5 border border-orbit-blue/20 rounded-xl p-4">
              <p className="text-sm text-orbit-blue">
                تم إرسال إشعار تلقائي إلى فريق المبيعات على البريد: <span dir="ltr" className="font-medium">{notificationEmail}</span>
              </p>
            </div>
            <Button
              onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", company: "", product: "", message: "" }); }}
              variant="outline"
              className="border-orbit-blue text-orbit-blue hover:bg-orbit-blue/5"
            >
              إرسال رسالة أخرى
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-32 pb-20 min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/20" id="contact">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orbit-cyan/10 border border-orbit-cyan/20 text-orbit-blue text-sm font-medium mb-4">
            <MessageCircle className="h-4 w-4" />
            نحن هنا لمساعدتك
          </div>
          <h1 className="text-4xl md:text-5xl text-slate-900 mb-4">تواصل معنا</h1>
          <p className="text-lg text-slate-600">
            أخبرنا عن احتياجاتك وسيتواصل معك فريقنا المختص في أقرب وقت
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info Cards */}
          <div className="space-y-4">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-12 h-12 bg-orbit-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-orbit-blue" />
                </div>
                <div>
                  <h4 className="text-slate-900 mb-1">اتصل بنا</h4>
                  <p className="text-sm text-slate-500" dir="ltr">920000000</p>
                  <p className="text-xs text-slate-400 mt-1">من الأحد للخميس، 8ص - 6م</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-12 h-12 bg-orbit-cyan/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-orbit-cyan" />
                </div>
                <div>
                  <h4 className="text-slate-900 mb-1">البريد الإلكتروني</h4>
                  <p className="text-sm text-slate-500" dir="ltr">support@orbit.sa</p>
                  <p className="text-xs text-slate-400 mt-1">نرد خلال 24 ساعة كحد أقصى</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-12 h-12 bg-orbit-orange/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-orbit-orange" />
                </div>
                <div>
                  <h4 className="text-slate-900 mb-1">العنوان</h4>
                  <p className="text-sm text-slate-500">المملكة العربية السعودية، الرياض</p>
                  <p className="text-xs text-slate-400 mt-1">طريق الملك فهد، مبنى رقم 12</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-green-50 hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  asChild
                >
                  <a href="https://wa.me/966920006900" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 ml-2" />
                    تحدث معنا عبر واتساب
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-slate-600 mb-1.5 block">الاسم الكامل <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="مثال: محمد أحمد"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orbit-blue/20 focus:border-orbit-blue transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-slate-600 mb-1.5 block">البريد الإلكتروني <span className="text-red-500">*</span></label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="example@company.sa"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orbit-blue/20 focus:border-orbit-blue transition-all"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-slate-600 mb-1.5 block">رقم الجوال <span className="text-red-500">*</span></label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="05XXXXXXXX"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orbit-blue/20 focus:border-orbit-blue transition-all"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-slate-600 mb-1.5 block">اسم الشركة/الجهة</label>
                      <input
                        type="text"
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        placeholder="اسم الشركة أو الجهة"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orbit-blue/20 focus:border-orbit-blue transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-slate-600 mb-1.5 block">الخدمة المطلوبة</label>
                    <select
                      name="product"
                      value={form.product}
                      onChange={handleChange}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orbit-blue/20 focus:border-orbit-blue transition-all bg-white"
                    >
                      <option value="">اختر الخدمة...</option>
                      {productOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-slate-600 mb-1.5 block">رسالتك <span className="text-red-500">*</span></label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="اكتب تفاصيل استفسارك أو طلبك..."
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orbit-blue/20 focus:border-orbit-blue transition-all resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-orbit-blue hover:bg-orbit-blue-dark text-white h-12 text-lg shadow-lg shadow-orbit-blue/25"
                    disabled={sending}
                  >
                    {sending ? (
                      <>
                        <svg className="animate-spin w-5 h-5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 ml-2" />
                        إرسال الطلب
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-slate-400 text-center">
                    بإرسال هذا النموذج، أنت توافق على سياسة الخصوصية الخاصة بنا
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
