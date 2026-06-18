import { redirect } from 'next/navigation';

// وُحِّد فورم الواتساب مع نظام الفورمات (FormConfig) — يُدار من «إدارة الفورمات».
// هذا المسار القديم يحوّل إلى الفورم الموحّد للحفاظ على أي روابط سابقة.
export default function WhatsAppRequestRedirect() {
  redirect('/products/whatsapp/form');
}
