# The Syed Ashemi - Online Fitness Coaching Website

A sleek, modern landing page for The Syed Ashemi fitness coaching brand. Built with a Greek god/Hercules aesthetic featuring black, white, and gold colors.

## 🏛️ Features

- **Responsive Design** - Looks great on all devices
- **Dark Theme** - Black/white/gold Greek mythology vibe (inspired by architectarmy.com)
- **Video Placeholder** - Ready for your intro video
- **Before/After Sliders** - Interactive transformation galleries
- **Application Form** - Submits to Google Sheets
- **Smooth Animations** - Fade-ins and hover effects
- **Social Links** - Instagram, TikTok, Twitter, YouTube

## 🚀 Quick Start

### Local Preview

Just open `index.html` in your browser - no build step required!

### Deploy

Deploy to any static hosting:

- **GitHub Pages** - Push to `gh-pages` branch
- **Netlify** - Drag and drop the folder
- **Vercel** - Import the repo
- **Cloudflare Pages** - Connect your repo

## 📋 Setup Google Sheets Integration

1. Create a new Google Spreadsheet
2. Add headers in row 1:
   - A1: `Timestamp`
   - B1: `Name`
   - C1: `Email`
   - D1: `Instagram`
   - E1: `Fitness Level`
   - F1: `Goal`
   - G1: `Message`
3. Go to **Extensions > Apps Script**
4. Paste the contents of `google-apps-script.js`
5. Click **Deploy > New deployment**
6. Choose **Web app**
7. Set **Execute as**: Me
8. Set **Who has access**: Anyone
9. Copy the deployment URL
10. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` in `script.js` with your URL

## ✏️ Customization

### Add Your Photos

Replace the placeholder divs in `index.html`:

```html
<!-- Before: -->
<div class="absolute inset-0 bg-zinc-800 flex items-center justify-center">
  <div class="text-center">
    <div class="text-6xl mb-2">📷</div>
    <p class="text-gray-500">Before Photo</p>
  </div>
</div>

<!-- After: -->
<img src="images/client1-before.jpg" alt="Before transformation" class="absolute inset-0 w-full h-full object-cover">
```

### Update Testimonials

Edit the testimonial text in the transformation cards:

```html
<p class="text-gray-300 italic mb-4">"Your actual client testimonial here."</p>
<p class="text-gold-500 font-semibold">— Actual Client Name</p>
<p class="text-gray-500 text-sm">12 Week Transformation</p>
```

### Add Your Video

Replace the video placeholder with an embed:

```html
<div id="video-placeholder" class="aspect-video">
  <iframe
    src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
    class="w-full h-full"
    frameborder="0"
    allowfullscreen>
  </iframe>
</div>
```

### Update Stats

Edit the numbers in the hero section stats grid.

### Set Workout Plan Price

Update the `$XX` placeholders in the Programs section.

### Update Social Links

Edit the `href` attributes for Twitter and YouTube when ready.

## 📁 File Structure

```
thesyedashemi/
├── index.html              # Main landing page
├── styles.css              # Custom CSS styles
├── script.js               # JavaScript (form, sliders, etc.)
├── google-apps-script.js   # Google Sheets integration code
├── README.md               # This file
└── images/                 # Add your images here
    ├── transformations/
    ├── about/
    └── ...
```

## 🎨 Color Palette (architectarmy.com style)

- **Black**: `#000000` - Background
- **Matte Card**: `#0A0A0A` - Cards/sections
- **Gold-500**: `#C9A962` - Primary accent
- **Gold-600**: `#B8954D` - Buttons/CTAs
- **White**: `#ffffff` - Text
- **Gray-300/400**: `#d1d5db/#9ca3af` - Secondary text

## 📱 Socials

- Instagram: [@thesyedashemi](https://www.instagram.com/thesyedashemi/)
- TikTok: [@thesyedashemi](https://www.tiktok.com/@thesyedashemi)

---

Built with 💪 by The Syed Ashemi
