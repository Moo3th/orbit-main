# مواصفات تتبّع GTM — موقع CORBIT (المدار)

هذا المستند يصف **أحداث dataLayer** التي يدفعها كود الموقع للمنتجات والفورمات، ليُستخدم في إعداد
الوسوم (Tags) والمشغّلات (Triggers) والمتغيرات (Variables) داخل حاويّة Google Tag Manager
(`GTM-MKGST5S6`).

> **مبدأ أساسي:** الكود يدفع الأحداث إلى `window.dataLayer` فقط. ربط هذه الأحداث بـ GA4 / Meta /
> Google Ads يتم داخل لوحة GTM وفق هذا المستند.

---

## 1. نموذج الموافقة (Consent)

يُدار عبر `src/components/PrivacyConsent.tsx` ويُخزَّن في `localStorage['cookie-consent']` (وكوكي مطابق):

| المستوى | `analytics_storage` | `ad_storage` / `ad_user_data` / `ad_personalization` |
|---|---|---|
| `accepted` (قبول الكل) | granted | granted |
| `necessary` (ضروري فقط) | granted | denied |
| لم يُختر بعد (null) | denied (الافتراضي) | denied |

تصنيف الأحداث في الكود (`src/lib/analytics/consent.ts`):
- **أحداث تحليلات/تحويل** (كل ما في هذا المستند تقريبًا + GA4): تُدفع عند `accepted` **أو** `necessary`.
- **أحداث Meta Pixel** (`Lead` فقط، تُطلق ضمن `form_submit`): تُدفع عند `accepted` فقط.
- لا يُدفع أي شيء قبل اختيار المستخدم لمستوى.

**في GTM:** فعّل "Consent Mode" واضبط فحص الموافقة على الوسوم:
- وسوم GA4 / أحداثها → تتطلّب `analytics_storage`.
- وسوم Meta / Google Ads (إعلانات / Remarketing) → تتطلّب `ad_storage`.

---

## 2. مفردات معرّف المنتج القانونية (`product`)

تُستخدم القيم التالية موحّدةً في معامل `product` عبر كل الأحداث:

| المنتج | قيمة `product` | المسار |
|---|---|---|
| الرسائل النصية SMS | `sms` | `/products/sms` |
| واتساب أعمال | `whatsapp` | `/products/whatsapp` |
| O-Time | `otime` | `/products/o-time` |
| Gov Gate | `govgate` | `/products/gov-gate` |
| SchoolBit | `schoolbit` | `/products/schoolbit` |

> ملاحظة: بعض الحقول القديمة في الفورمات تستخدم `serviceType` بصيغ مختلفة
> (`sms-platform`, `whatsapp-business-api`, `otime`, `gov-gate`...). تُمرَّر كما هي في معامل
> `service_type`، بينما `product` يلتزم بالمفردات أعلاه قدر الإمكان.

---

## 3. كتالوج الأحداث

كل صف: اسم حدث dataLayer (مفتاح المشغّل في GTM) + حدث GA4 المقابل + حدث Meta المقابل + المعاملات + موضع الإطلاق + صنف الموافقة.

### مشاهدة الصفحة — `page_view`
- **GA4:** `page_view` · **Meta:** PageView (تلقائي عبر وسم Meta).
- **يُدفع من:** `src/components/GoogleTagManager.tsx` عند كل تغيّر مسار (SPA).
- **المعاملات:** `page_path`, `page_location`, `page_title`.
- **الموافقة:** يُدفع دائمًا؛ لكن وسم GA4 يكبته Consent Mode عند رفض التخزين (إدارة على مستوى الوسم).
- **تنبيه:** لا تُنشئ مشاهدة صفحة مزدوجة — صفحات المنتجات لا تستدعي page_view؛ تستخدم `product_view` بدلها.

### مشاهدة صفحة منتج — `product_view`
- **GA4:** `view_item` (`items: [{ item_id: <product>, item_category: 'product' }]`).
- **يُدفع من:** كل مكوّن منتج عند mount (`trackProductView`).
- **المعاملات:** `product` (المفردات أعلاه), `page_path`.
- **الموافقة:** تحليلات (`accepted`/`necessary`).

### عرض قسم التسعير — `pricing_view`
- **GA4:** `view_item_list` (`item_list_id`, `item_list_name`, `items[]`).
- **يُدفع من:** SMS / WhatsApp / SchoolBit عند ظهور قسم `#pricing` فعليًا (IntersectionObserver، مرة واحدة).
- **المعاملات:** `service_type`, `item_list_id`.
- **الموافقة:** تحليلات.

### اختيار باقة — `select_item`
- **GA4:** `select_item` (`item_id`, `item_name`, `item_list_id`, `price`).
- **يُدفع من:** نقر زر باقة في SMS / WhatsApp / SchoolBit (`trackPlanSelected`).
- **المعاملات:** `item_id`, `item_name`, `item_list_id` (`<service>_pricing`), `price`.
- **الموافقة:** تحليلات. (ملاحظة: الباقات التي تفتح موقعًا خارجيًا تُطلق `outbound_click` أيضًا.)

### نقر زر دعوة — `cta_click`
- **GA4:** `click_button` · **Meta:** ViewContent.
- **يُدفع من:** المستمع المفوَّض `CtaTracker` على أي عنصر يحمل `data-cta` (هيرو/عروض/CTA أخير، وأزرار O-Time).
- **المعاملات:** `button_id` (من `data-cta-id`), `button_text`, `destination`, `page_location`.
- **الموافقة:** تحليلات (GA4 dataLayer)؛ جزء Meta ViewContent خلف موافقة الإعلانات.

### نقر رابط خارجي — `outbound_click`
- **GA4:** `click` (موصى به: علّم وسم GA4 بـ `outbound: true`).
- **يُدفع من:** `CtaTracker` تلقائيًا لأي `<a>` بمضيف خارجي (مثل `app.mobile.net.sa`, `schoolbit.corbit.sa`, `wa.me`).
- **المعاملات:** `link_url`, `link_text`.
- **الموافقة:** تحليلات.

### بدء تعبئة فورم — `form_start`
- **يُدفع من:** أول تفاعل مع أي فورم (Contact / Request-Quote / فورم منتج / فورم مخصّص).
- **المعاملات:** `form_id`, `product`.
- **الموافقة:** تحليلات.

### إرسال فورم ناجح (Lead) — `form_submit`
- **GA4:** `generate_lead` · **Meta:** `Lead` (خلف موافقة الإعلانات).
- **يُدفع من:** نقطة نجاح الإرسال في كل فورم.
- **المعاملات:** `form_id`, `product`, `service_type`, `source`, `package_name`.
- **الموافقة:** dataLayer + GA4 = تحليلات؛ Meta `Lead` = إعلانات (`accepted`).
- **استخدمه كتحويل (Conversion) في GA4 و Google Ads.**

### حدث الاتصال القديم — `contact_form_submit`
- يُطلقه فورم «تواصل معنا» إضافةً إلى منطق `generate_lead`/`Lead` (دالة `trackContactFormSubmit`).
- **المعاملات:** `form_id: 'contact'`, `service_type`, `product`, `source`.

### فشل إرسال فورم — `form_error`
- **يُدفع من:** مساري الفشل (استجابة غير ناجحة + استثناء) في كل فورم.
- **المعاملات:** `form_id`, `product`, `error_message`.
- **الموافقة:** تحليلات.

---

## 4. جدول مصادر الإطلاق (الكود)

| الحدث | الملفات |
|---|---|
| `product_view` | `src/components/business/products/{SMSPage,WhatsAppPage,OTimePage,GovGatePage,SchoolBitPage}.tsx` |
| `pricing_view`, `select_item` | `SMSPage.tsx`, `WhatsAppPage.tsx`, `SchoolBitPage.tsx` |
| `cta_click`, `outbound_click` | `src/components/analytics/CtaTracker.tsx` (مفوَّض) + سمات `data-cta` في مكوّنات المنتجات |
| `form_start` / `form_submit` / `form_error` | `src/components/Contact.tsx`, `src/components/business/RequestQuoteForm.tsx`, `src/app/products/[product]/form/DynamicFormPage.tsx`, `src/app/forms/[slug]/FormsFormPage.tsx` |
| منطق الدفع + الموافقة | `src/lib/analytics/events.ts`, `src/lib/analytics/consent.ts` |

---

## 5. إعداد GTM المقترح

**المتغيرات (Data Layer Variables):** `product`, `form_id`, `service_type`, `source`, `package_name`,
`button_id`, `button_text`, `destination`, `item_id`, `item_name`, `item_list_id`, `price`, `link_url`.

**المشغّلات (Custom Event Triggers):** واحد لكل اسم حدث dataLayer أعلاه
(`product_view`, `pricing_view`, `select_item`, `cta_click`, `outbound_click`, `form_start`,
`form_submit`, `form_error`, `contact_form_submit`).

**الوسوم (Tags):**
1. **GA4 Configuration** — يُطلق على All Pages (أو `page_view`)، يتطلّب `analytics_storage`.
2. **GA4 Event** لكل مشغّل أعلاه، مع تمرير المعاملات المطابقة (مثلاً `generate_lead` على `form_submit`).
   عرّف `generate_lead` و`select_item` و`view_item_list` كأحداث رئيسية/تحويلات في GA4.
3. **Meta Pixel — Lead** على `form_submit`، يتطلّب `ad_storage` (موافقة كاملة).
4. **Google Ads Conversion** على `form_submit` (و/أو `select_item`)، يتطلّب `ad_storage`.

**Consent Initialization:** اعتمد على إعداد Consent Mode الافتراضي المحقون في الكود
(`denied` لكل التخزين مع `wait_for_update`)، وحدّثه عبر حدث `cookie-consent-changed` الذي يطلقه الموقع.
