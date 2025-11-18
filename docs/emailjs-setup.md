# EmailJS Setup Guide

## Overview
This application uses EmailJS to send contact form messages directly from the browser without a backend server.

## Setup Steps

### 1. Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Create Email Service
1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions
5. **Copy the Service ID** (e.g., `service_xxxxxxx`)

### 3. Create Email Template
1. Go to **Email Templates** in EmailJS dashboard
2. Click **Create New Template**
3. Use the following template variables:
   ```
   Subject: New Contact Form Submission from {{from_name}}
   
   Body:
   Name: {{from_name}}
   Email: {{from_email}}
   Phone: {{phone}}
   
   Message:
   {{message}}
   
   ---
   This message was sent from Aurelane website contact form.
   ```
4. **Copy the Template ID** (e.g., `template_xxxxxxx`)

### 4. Get Public Key
1. Go to **Account** → **General**
2. Find your **Public Key** (e.g., `xxxxxxxxxxxxx`)
3. **Copy the Public Key**

### 5. Configure Environment Variables

Create a `.env.local` file in the root directory (if it doesn't exist) and add:

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

### 6. Restart Development Server
After adding environment variables, restart your Next.js development server:
```bash
npm run dev
```

## Testing

1. Visit your website
2. Wait 5 seconds for the contact modal to appear
3. Fill out the form and submit
4. Check your email inbox for the message

## Troubleshooting

### Modal Not Appearing
- Check browser console for errors
- Verify localStorage is enabled
- Clear localStorage: `localStorage.removeItem('contactModalShown')`

### Email Not Sending
- Verify all three environment variables are set correctly
- Check EmailJS dashboard for error logs
- Ensure email service is properly connected
- Verify template variables match the code

### Environment Variables Not Working
- Ensure variables start with `NEXT_PUBLIC_`
- Restart the development server after adding variables
- For production, add variables to your hosting platform (Vercel, Netlify, etc.)

## Production Deployment

When deploying to production, add the same environment variables to your hosting platform:

### Vercel
1. Go to Project Settings → Environment Variables
2. Add all three `NEXT_PUBLIC_*` variables
3. Redeploy

### Netlify
1. Go to Site Settings → Environment Variables
2. Add all three `NEXT_PUBLIC_*` variables
3. Redeploy

### Other Platforms
Add the environment variables through your platform's dashboard or configuration file.

## Security Notes

- The Public Key is safe to expose in frontend code
- EmailJS handles rate limiting on free tier (200 emails/month)
- Consider upgrading to a paid plan for production use
- Never commit `.env.local` to version control

