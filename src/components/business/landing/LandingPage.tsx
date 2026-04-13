'use client';

import React from "react";
import { Hero } from "./Hero";
import { TrustSection } from "./TrustSection";
import { Solutions } from "./Solutions";
import { PersonaTabs } from "./PersonaTabs";
import { Integrations } from "./Integrations";
import { WhyUs } from "./WhyUs";
import type { CmsPage, CmsPartner } from '@/lib/cms/types';

interface LandingPageProps {
  pageData?: CmsPage | null;
  partners?: CmsPartner[];
}

export const LandingPage = ({ pageData = null, partners = [] }: LandingPageProps) => {
  return (
    <>
      <Hero pageData={pageData} partners={partners} />
      <TrustSection pageData={pageData} partners={partners} />
      <Solutions pageData={pageData} />
      <PersonaTabs pageData={pageData} />
      <Integrations pageData={pageData} />
      <WhyUs pageData={pageData} />
    </>
  );
};
