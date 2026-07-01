# Privacy Policy — Image Uploader for Google Sheets

**Effective date:** 2 July 2026

Image Uploader ("the add-on") is a Google Sheets editor add-on published by
**foyo.ai** ("we", "us"). This policy explains what data the add-on accesses,
how it is used, and what is (and is not) shared.

## Summary

The add-on runs entirely within your own Google account (Google Apps Script,
Google Drive, and Google Sheets). **We operate no external servers, collect no
personal data, and have no access to your files, images, or spreadsheets.**

## What the add-on accesses

| Data | Why | Where it goes |
|------|-----|---------------|
| Images you choose (folder or files) | To upload them | **Your** Google Drive |
| The active spreadsheet | To write image metadata | **Your** Google Sheet |
| Your account language (locale) | To show the UI in English or Vietnamese | Stays in the browser |
| Folder names the add-on created | To avoid duplicate folder names | Google Apps Script *user properties*, inside **your** account |

The images you select are read in your browser and uploaded directly to your
own Google Drive through Google's APIs. Metadata (file name, format, size,
dimensions, links, upload time) is written only into the spreadsheet you are
using.

## Making files public

When you upload, the add-on sets the created Drive files to
"**Anyone with the link can view**", because the purpose of the add-on is to
generate publicly viewable image links. Only files created by the add-on are
affected. You can change or remove this sharing at any time from Google Drive.

## What we do NOT do

- We do **not** send your data to any third party or to any server we control.
- We do **not** store your images, spreadsheet content, or personal information.
- We do **not** use analytics, advertising, or tracking.
- We do **not** sell or share any data.

## OAuth scopes and justification

The add-on requests the **minimum** scopes needed:

- `.../auth/spreadsheets.currentonly` — read/write **only the spreadsheet you
  are currently using**.
- `.../auth/drive.file` — create and manage **only the files/folders the add-on
  creates**; it cannot see the rest of your Drive.
- `.../auth/script.container.ui` — display the sidebar.

## Limited Use disclosure

Image Uploader's use and transfer of information received from Google APIs
adheres to the [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy),
including the **Limited Use** requirements.

## Data retention

The only data the add-on persists is the list of folder names it has created,
stored in your account's Apps Script properties. You can clear it by removing
the add-on. We retain nothing on our side.

## Changes

We may update this policy; the "Effective date" above will change accordingly.

## Contact

Questions? Contact **james@foyo.ai**.
