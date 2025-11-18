# Contact Modal & EmailJS Setup

## Features Implemented

### 1. Contact Modal
- ✅ Appears automatically after 5 seconds when user visits the website
- ✅ Shows only once per user (stored in localStorage)
- ✅ Beautiful, responsive design with animations
- ✅ Can be closed by clicking outside or the X button
- ✅ Form validation included

### 2. EmailJS Integration
- ✅ Integrated with EmailJS for sending emails directly from browser
- ✅ No backend server required
- ✅ Form fields: Name, Email, Phone (optional), Message
- ✅ Success/Error feedback

## Installation

### Step 1: Install EmailJS Package
```bash
npm install @emailjs/browser
```

### Step 2: Get EmailJS Credentials

1. **Sign up at [EmailJS.com](https://www.emailjs.com/)**
2. **Create Email Service:**
   - Go to Email Services → Add New Service
   - Connect your email (Gmail, Outlook, etc.)
   - Copy the **Service ID** (e.g., `service_abc123`)

3. **Create Email Template:**
   - Go to Email Templates → Create New Template
   - Use these variables:
     ```
     Subject: New Contact from {{from_name}}
     
     Name: {{from_name}}
     Email: {{from_email}}
     Phone: {{phone}}
     
     Message: {{message}}
     ```
   - Copy the **Template ID** (e.g., `template_xyz789`)

4. **Get Public Key:**
   - Go to Account → General
   - Copy the **Public Key**

### Step 3: Configure Environment Variables

Create `.env.local` file in the root directory:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id_here
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
```

**Example:**
```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_abc123
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xyz789
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=abcdefghijklmnop
```

### Step 4: Restart Server
```bash
npm run dev
```

## How It Works

1. **First Visit:** User visits website → After 5 seconds, modal appears
2. **Subsequent Visits:** Modal won't show (stored in localStorage)
3. **Form Submission:** User fills form → EmailJS sends email → Success message shown
4. **Reset:** To test again, clear localStorage: `localStorage.removeItem('contactModalShown')`

## File Locations

- **Component:** `app/reactcomponents/components/common/ContactModal.js`
- **Integration:** `app/reactcomponents/components/layout/MainLayout.js`
- **Documentation:** `docs/emailjs-setup.md`

## Customization

### Change Delay Time
Edit `ContactModal.js` line 42:
```javascript
setTimeout(() => {
    setIsOpen(true);
    // ...
}, 5000); // Change 5000 to desired milliseconds
```

### Change Modal Appearance
Edit styles in `ContactModal.js` - all Tailwind CSS classes are used.

### Disable Modal
Comment out the ContactModal import in `MainLayout.js`:
```javascript
// import ContactModal from '../common/ContactModal';
// ...
// <ContactModal />
```

## Testing

1. Clear localStorage: Open browser console → `localStorage.removeItem('contactModalShown')`
2. Refresh page
3. Wait 5 seconds
4. Modal should appear
5. Fill form and submit
6. Check your email inbox

## Troubleshooting

**Modal not appearing:**
- Check browser console for errors
- Verify localStorage is enabled
- Clear localStorage and refresh

**Email not sending:**
- Verify all 3 environment variables are set
- Check EmailJS dashboard for errors
- Ensure email service is connected
- Restart dev server after adding env variables

**Environment variables not working:**
- Must start with `NEXT_PUBLIC_`
- Restart server after adding
- For production, add to hosting platform settings

## Production Deployment

Add environment variables to your hosting platform:

**Vercel:**
- Project Settings → Environment Variables
- Add all 3 `NEXT_PUBLIC_*` variables
- Redeploy

**Netlify:**
- Site Settings → Environment Variables
- Add all 3 `NEXT_PUBLIC_*` variables
- Redeploy

## Support

For detailed EmailJS setup, see: `docs/emailjs-setup.md`

