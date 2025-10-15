# Domain Configuration Guide - getshortzy.com

## 🌐 Connecting Your Custom Domain

This guide shows you how to connect `getshortzy.com` to your Vercel deployment.

---

## 📋 Prerequisites

- Domain registered (getshortzy.com)
- Access to domain registrar (Namecheap, GoDaddy, etc.)
- Vercel project deployed

---

## 🚀 Step-by-Step Setup

### Step 1: Add Domain in Vercel

1. **Go to Vercel Dashboard**
   - Navigate to your project: `getshortzy-v3`
   - Click on "Settings" tab
   - Select "Domains" from the sidebar

2. **Add Domain**
   - Click "Add Domain" button
   - Enter: `getshortzy.com`
   - Click "Add"

3. **Add WWW Subdomain** (Optional but recommended)
   - Click "Add Domain" again
   - Enter: `www.getshortzy.com`
   - Click "Add"
   - Set as redirect to main domain

---

### Step 2: Configure DNS Records

Vercel will show you the DNS records to add. Here's what you need:

#### Option A: Using A Records (Recommended)

**For Root Domain (getshortzy.com):**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.21.21 | 3600 |

**For WWW Subdomain:**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | www | cname.vercel-dns.com | 3600 |

#### Option B: Using CNAME (Alternative)

Some registrars support CNAME for root domains:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | @ | cname.vercel-dns.com | 3600 |
| CNAME | www | cname.vercel-dns.com | 3600 |

---

### Step 3: Update DNS at Your Registrar

#### For Namecheap:

1. **Login to Namecheap**
   - Go to [namecheap.com](https://namecheap.com)
   - Login to your account

2. **Manage Domain**
   - Click "Domain List"
   - Click "Manage" next to getshortzy.com

3. **Advanced DNS**
   - Click "Advanced DNS" tab
   - Click "Add New Record"

4. **Add A Record**
   ```
   Type: A Record
   Host: @
   Value: 76.76.21.21
   TTL: Automatic
   ```

5. **Add CNAME Record**
   ```
   Type: CNAME Record
   Host: www
   Value: cname.vercel-dns.com
   TTL: Automatic
   ```

6. **Save Changes**
   - Click the green checkmark to save

#### For GoDaddy:

1. **Login to GoDaddy**
   - Go to [godaddy.com](https://godaddy.com)
   - Login to your account

2. **Manage DNS**
   - Go to "My Products"
   - Click "DNS" next to getshortzy.com

3. **Add Records**
   - Click "Add" button
   
   **A Record:**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   TTL: 1 Hour
   ```
   
   **CNAME Record:**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 1 Hour
   ```

4. **Save**
   - Click "Save" at the bottom

#### For Cloudflare:

1. **Login to Cloudflare**
   - Go to [cloudflare.com](https://cloudflare.com)
   - Select your domain

2. **DNS Settings**
   - Click "DNS" in the sidebar

3. **Add Records**
   
   **A Record:**
   ```
   Type: A
   Name: @
   IPv4 address: 76.76.21.21
   Proxy status: DNS only (gray cloud)
   TTL: Auto
   ```
   
   **CNAME Record:**
   ```
   Type: CNAME
   Name: www
   Target: cname.vercel-dns.com
   Proxy status: DNS only (gray cloud)
   TTL: Auto
   ```

4. **Important**: Set proxy status to "DNS only" (gray cloud icon)

---

### Step 4: Wait for DNS Propagation

DNS changes can take time to propagate globally:

- **Minimum**: 5-10 minutes
- **Average**: 30 minutes - 1 hour
- **Maximum**: 24-48 hours

#### Check Propagation Status:

1. **DNS Checker**
   - Go to [dnschecker.org](https://dnschecker.org)
   - Enter: `getshortzy.com`
   - Check if A record shows: `76.76.21.21`

2. **Command Line** (macOS/Linux)
   ```bash
   # Check A record
   dig getshortzy.com
   
   # Check CNAME record
   dig www.getshortzy.com
   ```

3. **Command Line** (Windows)
   ```cmd
   # Check A record
   nslookup getshortzy.com
   
   # Check CNAME record
   nslookup www.getshortzy.com
   ```

---

### Step 5: Verify in Vercel

1. **Check Domain Status**
   - Go back to Vercel → Settings → Domains
   - Wait for status to change from "Invalid Configuration" to "Valid Configuration"
   - Green checkmark = Success! ✅

2. **SSL Certificate**
   - Vercel automatically provisions SSL certificate
   - Usually takes 1-5 minutes after DNS propagation
   - Your site will be accessible via HTTPS

---

## 🔒 SSL/HTTPS Configuration

### Automatic SSL (Recommended)

Vercel automatically provides free SSL certificates via Let's Encrypt:

- ✅ Automatic renewal
- ✅ No configuration needed
- ✅ Covers all subdomains

### Force HTTPS Redirect

Add this to your `next.config.ts`:

```typescript
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
        destination: 'https://getshortzy.com/:path*',
        permanent: true,
      },
    ]
  },
}
```

---

## 🎯 Domain Redirect Configuration

### Redirect WWW to Root

In Vercel dashboard:

1. Go to Settings → Domains
2. Click on `www.getshortzy.com`
3. Select "Redirect to getshortzy.com"
4. Choose "Permanent (308)"
5. Save

### Redirect Root to WWW (Alternative)

If you prefer `www.getshortzy.com`:

1. Click on `getshortzy.com`
2. Select "Redirect to www.getshortzy.com"
3. Choose "Permanent (308)"
4. Save

---

## 🔧 Troubleshooting

### Domain Shows "Invalid Configuration"

**Possible causes:**
- DNS records not propagated yet → Wait longer
- Incorrect DNS values → Double-check records
- DNS cache → Clear browser cache

**Solutions:**
```bash
# Flush DNS cache (macOS)
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

# Flush DNS cache (Windows)
ipconfig /flushdns

# Flush DNS cache (Linux)
sudo systemd-resolve --flush-caches
```

### SSL Certificate Not Provisioning

**Possible causes:**
- DNS not fully propagated
- Cloudflare proxy enabled
- CAA records blocking Let's Encrypt

**Solutions:**
1. Wait for full DNS propagation (up to 24 hours)
2. If using Cloudflare, disable proxy (gray cloud)
3. Check CAA records don't block `letsencrypt.org`

### Site Not Loading

**Checklist:**
- [ ] DNS records added correctly
- [ ] DNS propagated (check dnschecker.org)
- [ ] Domain verified in Vercel
- [ ] SSL certificate issued
- [ ] No conflicting DNS records

---

## 📧 Email Configuration (Optional)

If you want to use email with your domain (e.g., hello@getshortzy.com):

### Using Google Workspace

1. **Sign up for Google Workspace**
   - Go to [workspace.google.com](https://workspace.google.com)
   - Choose plan ($6/user/month)

2. **Add MX Records**
   ```
   Priority: 1  | Value: ASPMX.L.GOOGLE.COM
   Priority: 5  | Value: ALT1.ASPMX.L.GOOGLE.COM
   Priority: 5  | Value: ALT2.ASPMX.L.GOOGLE.COM
   Priority: 10 | Value: ALT3.ASPMX.L.GOOGLE.COM
   Priority: 10 | Value: ALT4.ASPMX.L.GOOGLE.COM
   ```

### Using ProtonMail

1. **Sign up for ProtonMail**
   - Go to [proton.me](https://proton.me)
   - Choose plan (free or paid)

2. **Add MX Records**
   - Follow ProtonMail's DNS setup guide
   - Add provided MX and SPF records

---

## 🌍 Multiple Domains (Optional)

Want to use multiple domains? (e.g., getshortzy.ai, getshortzy.io)

1. **Add Each Domain in Vercel**
   - Repeat Step 1 for each domain

2. **Configure DNS**
   - Add same A/CNAME records for each domain

3. **Set Primary Domain**
   - Choose which domain is primary
   - Redirect others to primary

---

## ✅ Verification Checklist

Before going live, verify:

- [ ] `getshortzy.com` loads correctly
- [ ] `www.getshortzy.com` redirects properly
- [ ] HTTPS is working (green padlock)
- [ ] SSL certificate is valid
- [ ] No mixed content warnings
- [ ] All pages load correctly
- [ ] Authentication works
- [ ] Dashboard accessible

---

## 📊 Post-Setup

### Update Clerk Domain

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Go to "Domains"
4. Add: `getshortzy.com`
5. Remove old Vercel domain if needed

### Update Environment Variables

If you hardcoded any URLs, update them:

```env
NEXT_PUBLIC_APP_URL=https://getshortzy.com
```

### Update Social Links

Update your:
- Twitter/X profile
- LinkedIn company page
- Product Hunt listing
- Any marketing materials

---

## 🎉 You're Live!

Your custom domain is now configured and live!

### Next Steps:

1. ✅ Test all functionality
2. ✅ Update social media
3. ✅ Launch marketing campaign
4. ✅ Monitor analytics
5. ✅ Gather user feedback

---

## 📞 Support

Need help with domain configuration?

- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **DNS Help**: [dnschecker.org](https://dnschecker.org)
- **GitHub Issues**: [github.com/lehnenf98/getshortzy-v3/issues](https://github.com/lehnenf98/getshortzy-v3/issues)

---

**Your platform is ready to scale! 🚀**

