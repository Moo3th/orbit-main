# ORBIT Brand Style Guide

**Version:** 1.0  
**Last Updated:** 2025-01-30  
**Brand Name:** ORBIT

---

## Table of Contents

1. [Brand Overview](#brand-overview)
2. [Typography](#typography)
3. [Color Palette](#color-palette)
4. [Spacing System](#spacing-system)
5. [Component Guidelines](#component-guidelines)
6. [Usage Examples](#usage-examples)
7. [Do's and Don'ts](#dos-and-donts)

---

## Brand Overview

### Brand Values
- **Integrity**: Working with trust, transparency, and honesty
- **Team Work**: "We Are One" - the backbone of our philosophy
- **Respect**: Treating all others with courtesy
- **Passion**: Motivated professionals working towards common goals
- **Agile**: Embracing development and constant change

### Brand Personality
Clean, modern, stylish, distinctive, and legible. The brand expresses professionalism and sophistication while maintaining balance and visual harmony.

---

## Typography

### Font Families

#### English Font: IBM Plex Sans (Sans-Serif)
- **Usage**: All English text - headings (h1-h6), body text, UI elements, buttons, navigation, paragraphs
- **Style**: Sans-serif, clean, modern, professional
- **Available Weights**: 
  - Light (300)
  - Regular (400)
  - Medium (500)
  - SemiBold (600)
  - Bold (700)
- **Location**: Loaded via Google Fonts (next/font/google)

#### Arabic Font: IBM Plex Sans Arabic (Sans-Serif)
- **Usage**: All Arabic/RTL text content
- **Style**: Modern Arabic sans-serif
- **Available Weights**:
  - Light (300)
  - Regular (400)
  - Medium (500)
  - SemiBold (600)
  - Bold (700)
- **Location**: Loaded via Google Fonts (next/font/google)

### Typography Scale

#### Display Sizes (IBM Plex Sans)
```css
/* Display XL - Hero titles, major announcements */
font-size: 5.5rem; /* 88px */
line-height: 1.1;
letter-spacing: -0.03em;
font-family: 'IBM Plex Sans', sans-serif;

/* Display Large - Section headers */
font-size: 4.5rem; /* 72px */
line-height: 1.1;
letter-spacing: -0.02em;
font-family: 'IBM Plex Sans', sans-serif;

/* Display Medium - Subsection headers */
font-size: 3.5rem; /* 56px */
line-height: 1.15;
letter-spacing: -0.02em;
font-family: 'IBM Plex Sans', sans-serif;

/* Display Small - Card titles */
font-size: 2.5rem; /* 40px */
line-height: 1.2;
letter-spacing: -0.01em;
font-family: 'IBM Plex Sans', sans-serif;
```

#### Heading Sizes (IBM Plex Sans)
```css
/* H1 - Page titles */
font-size: 2.25rem; /* 36px */
line-height: 1.2;
letter-spacing: -0.02em;
font-weight: 400;
font-family: 'IBM Plex Sans', sans-serif;

/* H2 - Section titles */
font-size: 1.875rem; /* 30px */
line-height: 1.25;
letter-spacing: -0.02em;
font-weight: 400;
font-family: 'IBM Plex Sans', sans-serif;

/* H3 - Subsection titles */
font-size: 1.5rem; /* 24px */
line-height: 1.3;
letter-spacing: -0.01em;
font-weight: 400;
font-family: 'IBM Plex Sans', sans-serif;

/* H4 - Card headers */
font-size: 1.25rem; /* 20px */
line-height: 1.4;
letter-spacing: -0.01em;
font-weight: 400;
font-family: 'IBM Plex Sans', sans-serif;

/* H5, H6 - Small headers */
font-size: 1.125rem; /* 18px */
line-height: 1.4;
letter-spacing: 0;
font-weight: 400;
font-family: 'IBM Plex Sans', sans-serif;
```

#### Body Text (IBM Plex Sans)
```css
/* Body Large - Important paragraphs */
font-size: 1.125rem; /* 18px */
line-height: 1.6;
letter-spacing: -0.01em;
font-weight: 400;
font-family: 'IBM Plex Sans', sans-serif;

/* Body - Standard paragraphs */
font-size: 1rem; /* 16px */
line-height: 1.6;
letter-spacing: -0.01em;
font-weight: 400;
font-family: 'IBM Plex Sans', sans-serif;

/* Body Small - Captions, metadata */
font-size: 0.875rem; /* 14px */
line-height: 1.5;
letter-spacing: 0;
font-weight: 400;
font-family: 'IBM Plex Sans', sans-serif;
```

### Tailwind CSS Typography Classes

```jsx
// Headings - Always use IBM Plex Sans
<h1 className="font-heading text-4xl">Page Title</h1>
<h2 className="font-heading text-3xl">Section Title</h2>
<h3 className="font-heading text-2xl">Subsection</h3>

// Display sizes
<h1 className="font-heading text-display-xl">Hero Title</h1>
<h2 className="font-heading text-display-lg">Large Display</h2>

// Body text - Always use IBM Plex Sans (default sans)
<p className="text-lg">Important paragraph</p>
<p>Standard paragraph</p>
<p className="text-sm">Small text</p>

// Font family utilities
<div className="font-ibm-plex">IBM Plex Sans text</div>
<div className="font-ibm-plex-arabic">IBM Plex Sans Arabic text (Arabic)</div>
```

---

## Color Palette

### Primary Colors

#### Burgundy (Primary)
- **Hex**: `#7A1E2E`
- **RGB**: `rgb(122, 30, 46)`
- **Usage**: Main brand color, primary CTAs, key highlights, brand elements
- **When to use**: 
  - Primary buttons
  - Brand accents
  - Important highlights
  - Logo elements
  - Navigation active states

#### Beige (Secondary/Complementary)
- **Hex**: `#E8DCCB`
- **RGB**: `rgb(232, 220, 203)`
- **Usage**: Complementary color, backgrounds, subtle accents
- **When to use**:
  - Background sections
  - Card backgrounds
  - Subtle highlights
  - Complementary to Burgundy

#### Cool Gray (Neutral)
- **Hex**: `#A7A9AC`
- **RGB**: `rgb(167, 169, 172)`
- **Usage**: Balance color, neutral elements, spacing
- **When to use**:
  - Borders
  - Dividers
  - Secondary text
  - Neutral backgrounds
  - Balance elements

### Neutral Colors

#### Black
- **Hex**: `#161616`
- **RGB**: `rgb(22, 22, 22)`
- **Usage**: Primary text, strong contrast, logo elements

#### White
- **Hex**: `#FFFFFF`
- **Usage**: Backgrounds, text on dark backgrounds, logo elements

### Color Usage Rules

1. **Burgundy** should be used as the primary brand color with strong presence
2. **Beige** complements Burgundy - use them together for balance
3. **Cool Gray** provides balance and space between elements
4. Use colors equally over time to avoid association with just one color
5. **DO NOT** introduce alternative colors - they reduce brand impact
6. Always prefer positive (main) version of logo, use negative only when background matches logo color

### Tailwind CSS Color Classes

```jsx
// Primary (Burgundy)
<div className="bg-primary text-white">Primary background</div>
<button className="bg-primary hover:bg-primary/90">Primary button</button>

// Secondary (Beige)
<div className="bg-secondary text-primary">Secondary background</div>

// Neutral (Cool Gray)
<div className="bg-neutral text-white">Neutral background</div>
<div className="border-neutral">Neutral border</div>

// Text colors
<p className="text-primary">Burgundy text</p>
<p className="text-neutral">Cool Gray text</p>
```

---

## Spacing System

### Standard Spacing Scale
Use Tailwind's default spacing scale (4px base unit):
- `0` = 0px
- `1` = 4px
- `2` = 8px
- `3` = 12px
- `4` = 16px
- `5` = 20px
- `6` = 24px
- `8` = 32px
- `10` = 40px
- `12` = 48px
- `16` = 64px
- `20` = 80px
- `24` = 96px

### Spacing Guidelines
- **Section spacing**: Use `py-12` to `py-24` for major sections
- **Component spacing**: Use `mb-6` to `mb-12` between components
- **Card padding**: Use `p-6` to `p-8` for card content
- **Button padding**: Use `px-6 py-3` for standard buttons

---

## Component Guidelines

### Buttons

#### Primary Button (Burgundy)
```jsx
<button className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
  Primary Action
</button>
```

#### Secondary Button (Beige)
```jsx
<button className="bg-secondary text-primary px-6 py-3 rounded-lg font-medium hover:bg-secondary/90 transition-colors">
  Secondary Action
</button>
```

### Cards
```jsx
<div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-neutral/20 shadow-sm">
  <h3 className="font-heading text-xl mb-4">Card Title</h3>
  <p className="text-gray-700 dark:text-gray-300">
    Card content using IBM Plex Sans for body text.
  </p>
</div>
```

### Headings
```jsx
// Always use IBM Plex Sans for headings
<h1 className="font-heading text-4xl text-primary mb-6">
  Main Heading
</h1>
<h2 className="font-heading text-3xl text-gray-900 dark:text-white mb-4">
  Section Heading
</h2>
```

### Body Text
```jsx
// Always use IBM Plex Sans (default sans)
<p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
  Body text should always use IBM Plex Sans font family.
</p>
```

### Arabic Text
```jsx
// Always use IBM Plex Sans Arabic for Arabic/RTL content
<p className="font-ibm-plex-arabic text-lg" dir="rtl">
  النص العربي يجب أن يستخدم خط IBM Plex Sans Arabic دائماً.
</p>
```

---

## Usage Examples

### Complete Component Example
```jsx
export function FeatureCard({ title, description }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-neutral/20">
      {/* Heading - IBM Plex Sans */}
      <h3 className="font-heading text-2xl text-primary mb-4">
        {title}
      </h3>
      
      {/* Body - IBM Plex Sans */}
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        {description}
      </p>
      
      {/* Button - IBM Plex Sans */}
      <button className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
        Learn More
      </button>
    </div>
  );
}
```

### Hero Section Example
```jsx
<section className="py-24 bg-gradient-to-b from-secondary to-white">
  <div className="container mx-auto px-4">
    {/* Display heading - IBM Plex Sans */}
    <h1 className="font-heading text-display-xl text-primary mb-6">
      Welcome to ORBIT
    </h1>
    
    {/* Body text - IBM Plex Sans */}
    <p className="text-xl text-gray-700 mb-8 max-w-2xl">
      Professional, modern, and distinctive brand identity.
    </p>
    
    {/* CTA - IBM Plex Sans */}
    <button className="bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors">
      Get Started
    </button>
  </div>
</section>
```

---

## Do's and Don'ts

### ✅ DO's

1. **Always use IBM Plex Sans for all English text** (headings, body, UI elements)
2. **Always use IBM Plex Sans Arabic for all Arabic/RTL text** content
3. **Use Burgundy as the primary brand color** for key elements
4. **Balance Burgundy and Beige** in your designs
5. **Use Cool Gray for neutral elements** and balance
6. **Maintain consistent spacing** using the spacing scale
7. **Follow the typography scale** for text sizes
8. **Use positive logo version** when possible
9. **Check this style guide** before making design decisions
10. **Cite style guide sections** when making design choices

### ❌ DON'Ts

1. **Don't use non-brand colors** without explicit approval
2. **Don't use custom fonts** outside IBM Plex Sans (English) and IBM Plex Sans Arabic (Arabic)
4. **Don't introduce alternative colors** to the palette
5. **Don't skip the style guide** when making design decisions
6. **Don't use negative logo** unless background matches logo color
7. **Don't create custom color variations** - stick to the palette
8. **Don't mix font families incorrectly** - English = IBM Plex Sans, Arabic = IBM Plex Sans Arabic
9. **Don't ignore spacing guidelines** - maintain consistency
10. **Don't use other fonts for Arabic** - use IBM Plex Sans Arabic instead

---

## Quick Reference

### Font Families
- **English (All text)**: `font-heading` or `font-ibm-plex` or default `sans` (IBM Plex Sans)
- **Arabic/RTL**: `font-ibm-plex-arabic` (IBM Plex Sans Arabic)

### Colors
- **Primary**: `bg-primary`, `text-primary` (Burgundy)
- **Secondary**: `bg-secondary`, `text-secondary` (Beige)
- **Neutral**: `bg-neutral`, `text-neutral` (Cool Gray)

### Typography
- **Display XL**: `text-display-xl font-heading`
- **H1**: `text-4xl font-heading`
- **H2**: `text-3xl font-heading`
- **Body**: `text-base` (default IBM Plex Sans)

---

## Migration Notes

### Font Loading
**IMPORTANT**: IBM Plex Sans fonts are loaded via Google Fonts using Next.js font optimization:
- IBM Plex Sans (English) - loaded in `layout.tsx` with Latin subset
- IBM Plex Sans Arabic (Arabic) - loaded in `layout.tsx` with Arabic subset
- Fonts are automatically optimized and self-hosted by Next.js

## Notes

- **Color Values**: Verified from PDF:
  - Burgundy: `#7A1E2E`
  - Beige: `#E8DCCB`
  - Cool Gray: `#A7A9AC`
  - Black: `#161616`
- **Font Files**: 
  - IBM Plex Sans (English) - loaded via Google Fonts
  - IBM Plex Sans Arabic (Arabic) - loaded via Google Fonts
  - Available weights: Light (300), Regular (400), Medium (500), SemiBold (600), Bold (700)
- **Brand Name**: Always refer to the brand as "ORBIT" (not MarkLine or other names)

---

**Remember**: This style guide is the single source of truth for all design decisions. Always reference it before making any design or styling choices.

