# Fix Page SEO Not Saving - Implementation Plan

## Problem
The SEO settings in page editor are not being saved correctly. The data is being stored in the wrong format.

## Root Cause
In `SiteDataContext.tsx`, the `updatePageSeo` function stores SEO data at the wrong level:

```typescript
// Current (WRONG):
return {
  ...page,
  seo: { title, titleEn, ... }  // Stored as page.seo
};
```

But `CmsPageEditorView` reads it as:
```typescript
title: (page as any)?.seo?.title || ''  // Reading from page.seo
```

The data is stored flat at the top level instead of nested under `seo` property.

## Files to Modify

### 1. `src/app/admin/newAdmin/SiteDataContext.tsx`
**Lines around 1143-1161**

Change from:
```typescript
const updatePageSeo = useCallback((pageId: string, seo: any) => {
  setPages(prev => prev.map(page => {
    if (page.id !== pageId) return page;
    return {
      ...page,
      seo: {
        title: seo.title || '',
        titleEn: seo.titleEn || '',
        description: seo.description || '',
        descriptionEn: seo.descriptionEn || '',
        keywords: seo.keywords || '',
        keywordsEn: seo.keywordsEn || '',
        canonical: seo.canonical || '',
        noIndex: seo.noIndex || false,
        ogImage: seo.ogImage || '',
      },
    };
  }));
}, []);
```

To:
```typescript
const updatePageSeo = useCallback((pageId: string, seo: any) => {
  setPages(prev => prev.map(page => {
    if (page.id !== pageId) return page;
    return {
      ...page,
      seo: {
        title: seo.title || '',
        titleEn: seo.titleEn || '',
        description: seo.description || '',
        descriptionEn: seo.descriptionEn || '',
        keywords: seo.keywords || '',
        keywordsEn: seo.keywordsEn || '',
        canonical: seo.canonical || '',
        noIndex: seo.noIndex || false,
        ogImage: seo.ogImage || '',
      },
    };
  }));
}, []);
```

Wait, the current code already has this format. Let me check again...

Actually, looking more carefully at the current code (lines 1143-1161):
```typescript
return {
  ...page,
  seo: {
    title: seo.title || '',
    titleEn: seo.titleEn || '',
    // ...
  },
};
```

This looks correct. The issue must be elsewhere.

Let me re-check the actual current implementation and verify what's happening.

## Alternative Investigation Needed

The issue might be:
1. The `page` reference used in `handleSave` is stale
2. The `saveSiteData` dependency array doesn't include the latest changes
3. There's a timing issue with the auto-save

### Additional Check Required

Look at `handleSave` in `CmsPageEditorView.tsx`:
```typescript
const handleSave = async () => {
  setSaving(true);
  if (updatePageSeo) {
    updatePageSeo(page.id, seo);  // This updates the pages state
  }
  const ok = await saveSiteData();  // This might use stale pages
  // ...
};
```

The issue: `saveSiteData` is memoized with `pages` in its dependency array. When `updatePageSeo` is called, it updates the pages state, but `saveSiteData` might still reference the old value because React's useCallback dependency tracking doesn't update synchronously.

### Fix for Timing Issue

In `CmsPageEditorView.tsx`, change:
```typescript
const handleSave = async () => {
  setSaving(true);
  if (updatePageSeo) {
    updatePageSeo(page.id, seo);
  }
  const ok = await saveSiteData();
  // ...
};
```

To:
```typescript
const handleSave = async () => {
  setSaving(true);
  try {
    if (updatePageSeo) {
      updatePageSeo(page.id, seo);
    }
    // Force a small delay to ensure state update is processed
    await new Promise(resolve => setTimeout(resolve, 50));
    const ok = await saveSiteData();
    if (ok) {
      alert(isAr ? "تم الحفظ بنجاح!" : "Saved successfully!");
    } else {
      alert(isAr ? "حدث خطأ أثناء الحفظ" : "Error saving changes");
    }
  } catch (error) {
    console.error('Save error:', error);
    alert(isAr ? "حدث خطأ أثناء الحفظ" : "Error saving changes");
  } finally {
    setSaving(false);
  }
};
```

## Implementation Steps

1. **Add small delay in handleSave** to ensure state update is processed
2. **Add better logging** to track what's being saved
3. **Verify the API is receiving correct data**

## Testing

After implementing the fix:
1. Open page editor
2. Go to SEO tab
3. Fill in SEO fields
4. Click Save
5. Check browser console for:
   - "Saving page seo:" log
   - API response
6. Refresh the page and verify data is loaded correctly
