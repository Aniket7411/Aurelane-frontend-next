# Deployment Guide for Hostinger

This guide will help you deploy your Next.js static export to Hostinger hosting.

## Prerequisites

1. Build the project locally first
2. Have FTP/cPanel access to your Hostinger account
3. Know your `public_html` directory path

## Step 1: Build the Project

Run the following command in your project root:

```bash
npm run build
```

This will create an `out` folder containing all the static files ready for deployment.

## Step 2: Prepare Files for Upload

After building, you'll have:
- `out/` folder - Contains all static files
- `.htaccess` file - Apache configuration (already in project root)

## Step 3: Upload to Hostinger

### Option A: Using cPanel File Manager

1. Log into your Hostinger cPanel
2. Navigate to **File Manager**
3. Go to `public_html` directory (or your domain's root directory)
4. **Delete all existing files** in `public_html` (backup first if needed)
5. Upload the **contents** of the `out` folder to `public_html`
   - Select all files from `out/` folder
   - Upload them to `public_html`
6. Upload the `.htaccess` file to `public_html` root
7. Ensure `.htaccess` file permissions are set to `644`

### Option B: Using FTP

1. Connect to your Hostinger FTP server
2. Navigate to `public_html` directory
3. Delete all existing files (backup first)
4. Upload all files from the `out` folder to `public_html`
5. Upload `.htaccess` file to `public_html` root
6. Set file permissions:
   - Files: `644`
   - Folders: `755`
   - `.htaccess`: `644`

## Step 4: Verify File Structure

Your `public_html` should look like this:

```
public_html/
├── .htaccess
├── index.html
├── _next/
│   ├── static/
│   └── ...
├── images/
├── gemimages/
└── ... (other static assets)
```

## Step 5: Fix Common Issues

### 403 Forbidden Error

If you see a 403 error, check:

1. **File Permissions:**
   - Files should be `644`
   - Folders should be `755`
   - `.htaccess` should be `644`

2. **`.htaccess` File:**
   - Ensure `.htaccess` is uploaded to `public_html` root
   - Check that it's not blocked by Hostinger (some hosts require enabling it)

3. **Directory Structure:**
   - Make sure you uploaded the **contents** of `out/` folder, not the `out/` folder itself
   - `index.html` should be directly in `public_html`

4. **Enable `.htaccess` in Hostinger:**
   - Some Hostinger plans require enabling `.htaccess` support
   - Check your hosting panel settings

### Routes Not Working

If routes like `/shop` or `/gem/123` show 404:

1. Verify `.htaccess` is present and has correct permissions
2. Check that `index.html` exists in `public_html`
3. Clear browser cache
4. Test in incognito mode

### Assets Not Loading

If images/CSS/JS don't load:

1. Check file paths - they should be relative (starting with `/`)
2. Verify `_next/static/` folder is uploaded correctly
3. Check browser console for 404 errors
4. Ensure file permissions are correct

## Step 6: Test Your Deployment

1. Visit your domain: `https://yourdomain.com`
2. Test main routes:
   - `/` (Home)
   - `/shop`
   - `/gem/[id]` (any gem ID)
   - `/login`
3. Check browser console for errors
4. Test on different browsers

## Troubleshooting

### Still Getting 403 Error?

1. **Contact Hostinger Support:**
   - Ask them to enable `.htaccess` support
   - Verify your hosting plan supports static file hosting

2. **Check Error Logs:**
   - In cPanel, go to **Error Logs**
   - Look for specific error messages

3. **Try Alternative `.htaccess`:**
   - Some hosts have restrictions
   - You may need a simpler version

### Build Errors

If `npm run build` fails:

1. Check Node.js version (should be 18+)
2. Clear `.next` folder: `rm -rf .next`
3. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
4. Try building again: `npm run build`

## Important Notes

- **Dynamic Routes:** Routes like `/gem/[id]` will work client-side. The app fetches data from your API at runtime.
- **API Calls:** Ensure your backend API is accessible from the frontend domain (CORS configured).
- **Environment Variables:** If you use environment variables, they need to be set at build time (not runtime for static export).

## Quick Checklist

- [ ] Built project with `npm run build`
- [ ] Uploaded all files from `out/` to `public_html`
- [ ] Uploaded `.htaccess` to `public_html` root
- [ ] Set correct file permissions (644 for files, 755 for folders)
- [ ] Tested homepage loads
- [ ] Tested routes work
- [ ] Tested assets load correctly

## Need Help?

If you continue to experience issues:
1. Check Hostinger documentation for static site hosting
2. Contact Hostinger support with specific error messages
3. Verify your hosting plan supports static file hosting

