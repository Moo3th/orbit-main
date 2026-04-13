export interface AboutPromiseItem {
  textEn: string;
  textAr: string;
}

export interface AboutSectionData {
  visionTitleEn: string;
  visionTitleAr: string;
  visionTextEn: string;
  visionTextAr: string;
  missionTitleEn: string;
  missionTitleAr: string;
  missionTextEn: string;
  missionTextAr: string;
  promisesTitleEn: string;
  promisesTitleAr: string;
  promises: AboutPromiseItem[];
}

export interface WhyOrbitStatItem {
  number: string;
  labelEn: string;
  labelAr: string;
}

export interface WhyOrbitFeatureItem {
  textEn: string;
  textAr: string;
  descriptionEn: string;
  descriptionAr: string;
}

export interface WhyOrbitSectionData {
  stats: WhyOrbitStatItem[];
  features: WhyOrbitFeatureItem[];
}

export interface MainPageSettingsSnapshot {
  about: AboutSectionData;
  whyOrbit: WhyOrbitSectionData;
}

const DEFAULT_ABOUT: AboutSectionData = {
  visionTitleEn: 'Vision',
  visionTitleAr: 'الرؤية',
  visionTextEn: 'To be the first and most trusted technical partner in the Kingdom and beyond',
  visionTextAr: 'أن نكون الشريك التقني الأول والأكثر ثقة في المملكة وخارجها',
  missionTitleEn: 'Mission',
  missionTitleAr: 'الرسالة',
  missionTextEn: "Providing innovative technical solutions with quality and professionalism that meet our clients' changing needs",
  missionTextAr: 'تقديم حلول تقنية مبتكرة بجودة واحترافية تلبي احتياجات عملائنا المتغيرة',
  promisesTitleEn: 'We Promise You',
  promisesTitleAr: 'نعدكم',
  promises: [
    { textEn: '24/7 Technical Support', textAr: 'دعم فني على مدار الساعة' },
    { textEn: 'Fast Access', textAr: 'سرعة وصول' },
    { textEn: 'Continuous Development', textAr: 'التطوير المستمر' },
    { textEn: 'Best Prices', textAr: 'أفضل الأسعار' },
  ],
};

const DEFAULT_WHY_ORBIT: WhyOrbitSectionData = {
  stats: [
    { number: '20+', labelEn: 'Years of Experience', labelAr: 'عامًا خبرة' },
    { number: '20,000+', labelEn: 'Government and Private Entities', labelAr: 'جهة حكومية وخاصة' },
    { number: '180+', labelEn: 'Million Messages Monthly', labelAr: 'مليون رسالة شهريًا' },
    { number: '98%+', labelEn: 'Customer Satisfaction Rate', labelAr: 'نسبة رضا عملاء تتجاوز' },
  ],
  features: [
    {
      textEn: 'Local Expertise',
      textAr: 'خبرة محلية وفهم لاحتياجات السوق',
      descriptionEn: 'Deep understanding of local market needs',
      descriptionAr: 'فهم عميق للسوق المحلي واحتياجاته الفريدة',
    },
    {
      textEn: 'High-Performance Infrastructure',
      textAr: 'بنية تقنية عالية الأداء',
      descriptionEn: 'Robust and stable infrastructure supporting your operations',
      descriptionAr: 'بنية تحتية قوية ومستقرة تدعم عملياتك',
    },
    {
      textEn: 'Specialized Support',
      textAr: 'دعم فني واستشارات متخصصة',
      descriptionEn: 'Professional support team ready to assist you every step',
      descriptionAr: 'فريق دعم محترف جاهز لمساعدتك في كل خطوة',
    },
    {
      textEn: 'Scalable Solutions',
      textAr: 'حلول قابلة للتوسع',
      descriptionEn: 'Solutions that grow with your business expansion',
      descriptionAr: 'حلول تنمو مع نمو أعمالك وتوسعها',
    },
    {
      textEn: 'Government Compliance',
      textAr: 'توافق كامل مع المتطلبات الحكومية',
      descriptionEn: 'Full compliance with government standards and regulations',
      descriptionAr: 'امتثال تام للمعايير واللوائح الحكومية',
    },
    {
      textEn: 'Fast Deployment',
      textAr: 'سرعة تشغيل وتكامل سلس مع الأنظمة',
      descriptionEn: 'Quick and seamless integration with your existing systems',
      descriptionAr: 'تكامل سريع وسلس مع أنظمتك الحالية',
    },
  ],
};

const asRecord = (value: unknown): Record<string, unknown> => {
  if (typeof value !== 'object' || value === null) {
    return {};
  }

  return value as Record<string, unknown>;
};

const asNonEmptyString = (value: unknown, fallback: string): string => {
  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

const cloneDefaultAbout = (): AboutSectionData => ({
  ...DEFAULT_ABOUT,
  promises: DEFAULT_ABOUT.promises.map((promise) => ({ ...promise })),
});

const cloneDefaultWhyOrbit = (): WhyOrbitSectionData => ({
  stats: DEFAULT_WHY_ORBIT.stats.map((stat) => ({ ...stat })),
  features: DEFAULT_WHY_ORBIT.features.map((feature) => ({ ...feature })),
});

export const createMainPageSettingsDefaults = (): MainPageSettingsSnapshot => ({
  about: cloneDefaultAbout(),
  whyOrbit: cloneDefaultWhyOrbit(),
});

const normalizeAbout = (value: unknown): AboutSectionData => {
  const source = asRecord(value);
  const defaults = cloneDefaultAbout();
  const rawPromises = Array.isArray(source.promises) ? source.promises : [];

  const promises = rawPromises
    .map((item) => {
      const promise = asRecord(item);
      const textEn = asNonEmptyString(promise.textEn, '');
      const textAr = asNonEmptyString(promise.textAr, '');

      if (!textEn && !textAr) {
        return null;
      }

      return {
        textEn: textEn || textAr,
        textAr: textAr || textEn,
      };
    })
    .filter((item): item is AboutPromiseItem => item !== null);

  return {
    visionTitleEn: asNonEmptyString(source.visionTitleEn, defaults.visionTitleEn),
    visionTitleAr: asNonEmptyString(source.visionTitleAr, defaults.visionTitleAr),
    visionTextEn: asNonEmptyString(source.visionTextEn, defaults.visionTextEn),
    visionTextAr: asNonEmptyString(source.visionTextAr, defaults.visionTextAr),
    missionTitleEn: asNonEmptyString(source.missionTitleEn, defaults.missionTitleEn),
    missionTitleAr: asNonEmptyString(source.missionTitleAr, defaults.missionTitleAr),
    missionTextEn: asNonEmptyString(source.missionTextEn, defaults.missionTextEn),
    missionTextAr: asNonEmptyString(source.missionTextAr, defaults.missionTextAr),
    promisesTitleEn: asNonEmptyString(source.promisesTitleEn, defaults.promisesTitleEn),
    promisesTitleAr: asNonEmptyString(source.promisesTitleAr, defaults.promisesTitleAr),
    promises: promises.length > 0 ? promises : defaults.promises,
  };
};

const normalizeWhyOrbit = (value: unknown): WhyOrbitSectionData => {
  const source = asRecord(value);
  const defaults = cloneDefaultWhyOrbit();

  const statsInput = Array.isArray(source.stats) ? source.stats : [];
  const featuresInput = Array.isArray(source.features) ? source.features : [];

  const stats = statsInput
    .map((item) => {
      const stat = asRecord(item);
      const number = asNonEmptyString(stat.number, '');
      const labelEn = asNonEmptyString(stat.labelEn, '');
      const labelAr = asNonEmptyString(stat.labelAr, '');

      if (!number || (!labelEn && !labelAr)) {
        return null;
      }

      return {
        number,
        labelEn: labelEn || labelAr,
        labelAr: labelAr || labelEn,
      };
    })
    .filter((item): item is WhyOrbitStatItem => item !== null);

  const features = featuresInput
    .map((item) => {
      const feature = asRecord(item);
      const textEn = asNonEmptyString(feature.textEn, '');
      const textAr = asNonEmptyString(feature.textAr, '');
      const descriptionEn = asNonEmptyString(feature.descriptionEn, '');
      const descriptionAr = asNonEmptyString(feature.descriptionAr, '');

      if ((!textEn && !textAr) || (!descriptionEn && !descriptionAr)) {
        return null;
      }

      return {
        textEn: textEn || textAr,
        textAr: textAr || textEn,
        descriptionEn: descriptionEn || descriptionAr,
        descriptionAr: descriptionAr || descriptionEn,
      };
    })
    .filter((item): item is WhyOrbitFeatureItem => item !== null);

  return {
    stats: stats.length > 0 ? stats : defaults.stats,
    features: features.length > 0 ? features : defaults.features,
  };
};

export const normalizeMainPageSettings = (value: unknown): MainPageSettingsSnapshot => {
  const source = asRecord(value);

  return {
    about: normalizeAbout(source.about),
    whyOrbit: normalizeWhyOrbit(source.whyOrbit),
  };
};
