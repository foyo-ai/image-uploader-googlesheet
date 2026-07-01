# Publishing checklist — Google Workspace Marketplace

Steps to publish Image Uploader so anyone can install it. The minimal scopes
(`spreadsheets.currentonly`, `drive.file`, `script.container.ui`) are **not**
restricted scopes, so you avoid the expensive third-party CASA security
assessment — only lighter OAuth brand verification is required.

## 0. Prerequisites
- [ ] Add-on works via **Test deployment** (test it end-to-end first).
- [ ] Privacy Policy + Terms hosted at **public URLs on a domain you own**
      (e.g. `https://foyo.ai/image-uploader/privacy`). Content is in
      [`PRIVACY.md`](PRIVACY.md) and [`TERMS.md`](TERMS.md).
- [ ] Icons (32×32, 128×128) and at least one screenshot ready.

## 1. Standard GCP project
- [ ] Create a project at https://console.cloud.google.com
- [ ] Apps Script → **Project Settings** → **Google Cloud Platform (GCP) Project**
      → **Change project** → paste the GCP **Project Number**.

## 2. OAuth consent screen (in GCP)
- [ ] **APIs & Services → OAuth consent screen**
- [ ] User type **External**; fill app name, support email, logo.
- [ ] Add **Privacy Policy URL** and **Terms of Service URL** (from step 0).
- [ ] Add the 3 OAuth scopes.

## 3. Enable Marketplace SDK
- [ ] **APIs & Services → Library** → **Google Workspace Marketplace SDK** →
      **Enable**.

## 4. Versioned deployment
- [ ] Apps Script → **Deploy → New deployment** → type **Add-on** → **Deploy**.
- [ ] Copy the **Deployment ID**.

## 5. Marketplace SDK config
In GCP → **Google Workspace Marketplace SDK**:
- [ ] **App Configuration:** app type *Editor Add-on*, paste the Deployment ID,
      declare scopes, set visibility (Public or your organization only).
- [ ] **Store Listing:** name, descriptions (EN/VI from
      [`STORE_LISTING.md`](STORE_LISTING.md)), icons, screenshots, category
      (Productivity), language(s).

## 6. Submit for review
- [ ] Submit **OAuth brand verification** (Google emails you; usually a few days).
- [ ] Submit the **Marketplace listing** for review.
- [ ] After approval, users install from the Marketplace or via
      **Extensions → Add-ons → Get add-ons**.

---

### Faster paths (no review)
- **Just for you:** Apps Script → **Deploy → Test deployments → Editor Add-on →
  Install**. Available in your own Sheets immediately.
- **For a small team on your Workspace domain:** in step 5, set visibility to
  your organization; domain admins can install without public review.
