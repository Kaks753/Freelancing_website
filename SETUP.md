# NeuroDesk — Quick Setup Guide for Stephen

## Overview
Your site uses **three free services** to power the order system:
1. **Formspree** — receives orders/contact forms via email (with file attachments)
2. **Google Sheets** — powers the client portal / order tracker
3. **Tawk.to** — live chat widget on every page

All free. No credit card needed. Setup takes ~15 minutes total.

---

## 1. Formspree Setup (Order Form + Contact Form)

### Step 1: Create Account
Go to → https://formspree.io → Sign up with your email (musyokas753@gmail.com)

### Step 2: Create a Form
- Click **New Form**
- Name it: `NeuroDesk Orders`
- Your form ID will look like: `xkgwvnzp` (random letters)
- 

### Step 3: Configure Auto-Reply
In your Formspree dashboard → Settings:
- ✅ Enable **"Email Notifications"** → your email gets order emails
- ✅ Enable **"Auto-Responses"** → clients get a confirmation email automatically

### Step 4: Update the Form ID in your site
Find and replace `mrewkzvz` in these 2 files:

**`pages/order.html`** (line ~25):
```html
<form ... action="https://formspree.io/f/mrewkzvz" ...>
```

**`pages/contact.html`** (line ~140):
```html
<form ... action="https://formspree.io/f/mrewkzvz" ...>
```

Replace both with your real ID:
```html
action="https://formspree.io/f/xkgwvnzp"
```

### File Attachments
Formspree free tier supports files up to **10MB each**. Clients can attach PDFs, Word docs, images, ZIPs.

---

## 2. Google Sheets Setup (Client Portal)

### Step 1: Create the Sheet
1. Go to → https://sheets.google.com
2. Create a new spreadsheet named: **"NeuroDesk Orders"**

### Step 2: Set Up Columns
In **Row 1**, create these exact headers (copy-paste):
```
ref | email | clientName | service | serviceShort | deadline | price | status | updated | message | file1Name | file1Url | file2Name | file2Url | milestone1 | milestone1Done | milestone1Active | milestone2 | milestone2Done | milestone2Active | milestone3 | milestone3Done | milestone3Active | milestone4 | milestone4Done | milestone4Active
```

### Step 3: Publish the Sheet
1. **File → Share → Publish to web**
2. Choose: **Sheet1**
3. Format: **Web page** (or CSV — both work)
4. Click **Publish**
5. Copy the URL — it looks like:
   `https://docs.google.com/spreadsheets/d/1ABC...XYZ/pub?gid=0&single=true&output=csv`

### Step 4: Update portal.html
Find this line in `pages/portal.html` (~line 377):
```javascript
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/pub?output=csv';
```
Replace with your real published URL.

### Step 5: Add Orders
When a client places an order:
1. Add a new row in the sheet
2. Give them a reference number like `ND-2026-001`
3. Send them the reference + their email via WhatsApp/email
4. They go to → https://neurodesk.vercel.app/pages/portal.html
5. They enter their email + reference to see the status

### Status Values (use exactly these):
| Status | What it means |
|--------|--------------|
| `Received` | Order received, not started |
| `In Progress` | Currently working on it |
| `Review` | Sent for client review |
| `Done` | Delivered |

### Sharing Deliverables
1. Upload the file to Google Drive
2. Right-click → "Get link" → "Anyone with the link can view"
3. Paste the link in the `file1Url` column
4. The client will see a **Download** button in the portal

---

## 3. Tawk.to Live Chat Setup

### Step 1: Create Account
Go to → https://tawk.to → Sign up free

### Step 2: Create a Property
- Property name: `NeuroDesk`
- Website URL: `https://neurodesk.vercel.app`

### Step 3: Get Your Widget Code
After creating the property, Tawk.to gives you a snippet like:
```
s1.src='https://embed.tawk.to/66abc123def456/1i0000000';
```

### Step 4: Update All Pages
Search your site for:
```
REPLACE_WITH_YOUR_TAWK_PROPERTY_ID
```
It appears in every HTML file. Replace with your real Tawk.to property ID.

**Quick bash command** (run in your project folder):
```bash
grep -rl "REPLACE_WITH_YOUR_TAWK_PROPERTY_ID" . | xargs sed -i 's|6a3fed28762a271d4209ff8d/1js4rcqb9|YOUR_REAL_TAWK_ID/YOUR_REAL_WIDGET_ID|g'
```

### Step 5: Install Tawk.to App (Highly Recommended)
- Android: https://play.google.com/store/apps/details?id=to.tawk.android
- iOS: https://apps.apple.com/app/tawk-to-live-chat/id1361773732

You'll get push notifications when clients start a chat. You can reply from your phone, share files in chat, and view chat history.

---

## 4. Giving Clients Their Order Reference

After a client submits an order (via order.html):
1. You receive an email from Formspree with all their details + attachments
2. Assign them a reference: `ND-2026-001` (increment for each order)
3. Add a row to your Google Sheet with their details
4. Send them a WhatsApp/email:

```
Hi [Name]! 👋

Thanks for your order on NeuroDesk!

Your order reference is: ND-2026-XXX
Track your project anytime at: https://neurodesk.vercel.app/pages/portal.html

Enter your email + reference to see live status updates.

I'll get started right away and keep you updated. Feel free to WhatsApp me if you have any questions: +254 740 624 253

— Stephen, NeuroDesk 🧠
```

---

## 5. Cal.com Scheduling (Optional — Free)

Add a free scheduling link so clients can book a discovery call:

1. Go to → https://cal.com → Sign up free
2. Create a **"Discovery Call"** event type (30 min)
3. Connect your Google Calendar
4. Get your booking link: `https://cal.com/stephen-neurodesk/discovery`
5. Add it to your contact page and order success panel

---

## Quick Reference

| Task | Link |
|------|------|
| Formspree Dashboard | https://formspree.io/forms |
| Google Sheets | https://sheets.google.com |
| Tawk.to Dashboard | https://dashboard.tawk.to |
| Cal.com | https://cal.com |
| Your Site | https://neurodesk.vercel.app |
| Client Portal | https://neurodesk.vercel.app/pages/portal.html |
| Order Form | https://neurodesk.vercel.app/pages/order.html |

---

*Last updated: June 2026*
