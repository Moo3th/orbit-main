'use client';

import { useEffect, useState } from 'react';

interface OrganizationJsonLdProps {
  data: Record<string, unknown> | null;
}

export function OrganizationJsonLd({ data }: OrganizationJsonLdProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !data) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface WebsiteJsonLdProps {
  data: Record<string, unknown> | null;
}

export function WebsiteJsonLd({ data }: WebsiteJsonLdProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !data) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
