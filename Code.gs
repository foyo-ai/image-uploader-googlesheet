/**
 * Google Sheets Add-on: Upload local images -> Google Drive (public)
 * -> write image metadata into the CURRENT spreadsheet.
 *
 * - Bilingual UI (English / Tiếng Việt), auto-detected + switchable in the sidebar.
 * - Minimal OAuth scopes: only the current spreadsheet + files this add-on creates.
 *
 * Add-on cho Google Sheet: Upload ảnh từ máy -> Google Drive (public)
 * -> ghi metadata vào Sheet đang mở. Song ngữ Anh/Việt, xin quyền tối thiểu.
 */

/* ----------------------------- i18n ----------------------------- */

const I18N = {
  en: {
    menuTitle: '📤 Image Uploader',
    menuItem: 'Open upload panel',
    sidebarTitle: 'Upload images to Drive',
    sheetPrefix: 'Images',
    headers: ['No.', 'File name', 'Format', 'Size', 'Dimensions (WxH px)',
              'Drive link', 'Direct link', 'Preview', 'Uploaded at'],
    ui: {
      title: '📤 Upload images to Drive',
      langLabel: 'Language',
      step1: '1. Choose images',
      pickFolder: '📁 Choose folder',
      pickFiles: '🖼️ Choose files',
      step2: '2. Drive folder name',
      folderPlaceholder: 'Folder name...',
      uploadBtn: '🚀 Upload',
      count: '{n} images ({m} other files skipped)',
      note: '⚠️ Images will be made <b>public (anyone with the link can view)</b>. ' +
            'If your Google Workspace account blocks external sharing, making them public may fail.',
      creatingFolder: 'Creating Drive folder...',
      folderOk: '✓ Folder: {name}',
      sheetOk: '✓ Writing to sheet: {name}',
      initErr: '✗ Init error: {msg}',
      shareWarn: '⚠ {name} — could not make public ({msg})',
      itemOk: '✓ {name}',
      itemErr: '✗ {name}: {msg}',
      sep: '————————————',
      done: 'Done: {ok} succeeded, {fail} failed.',
      openFolder: 'Open Drive folder: {url}'
    }
  },
  vi: {
    menuTitle: '📤 Upload ảnh',
    menuItem: 'Mở bảng upload',
    sidebarTitle: 'Upload ảnh lên Drive',
    sheetPrefix: 'Ảnh upload',
    headers: ['STT', 'Tên ảnh', 'Định dạng', 'Dung lượng', 'Kích thước (RxC px)',
              'Link Drive', 'Link ảnh direct', 'Xem trước', 'Thời gian upload'],
    ui: {
      title: '📤 Upload ảnh lên Drive',
      langLabel: 'Ngôn ngữ',
      step1: '1. Chọn ảnh',
      pickFolder: '📁 Chọn thư mục',
      pickFiles: '🖼️ Chọn từng ảnh',
      step2: '2. Tên folder trên Drive',
      folderPlaceholder: 'Tên folder...',
      uploadBtn: '🚀 Upload',
      count: '{n} ảnh (bỏ qua {m} file khác)',
      note: '⚠️ Ảnh sẽ được đặt <b>public (ai có link đều xem được)</b>. ' +
            'Nếu tài khoản Google Workspace bị chặn chia sẻ ra ngoài, bước set public có thể lỗi.',
      creatingFolder: 'Đang tạo folder Drive...',
      folderOk: '✓ Folder: {name}',
      sheetOk: '✓ Ghi vào sheet: {name}',
      initErr: '✗ Lỗi khởi tạo: {msg}',
      shareWarn: '⚠ {name} — không set được public ({msg})',
      itemOk: '✓ {name}',
      itemErr: '✗ {name}: {msg}',
      sep: '————————————',
      done: 'Xong: {ok} thành công, {fail} lỗi.',
      openFolder: 'Mở folder Drive: {url}'
    }
  }
};

/** Nhận diện ngôn ngữ người dùng; mặc định 'en'. Bọc try/catch cho chế độ chưa cấp quyền. */
function getLocale_() {
  try {
    const loc = (Session.getActiveUserLocale() || '').toLowerCase();
    if (loc.indexOf('vi') === 0) return 'vi';
  } catch (e) { /* menu có thể chạy ở AuthMode.NONE */ }
  return 'en';
}

function strings_(lang) {
  return I18N[lang] || I18N.en;
}

/* ----------------------------- Menu / Sidebar ----------------------------- */

function onOpen() {
  const t = strings_(getLocale_());
  SpreadsheetApp.getUi()
    .createMenu(t.menuTitle)
    .addItem(t.menuItem, 'showSidebar')
    .addToUi();
}

/** Chạy ngay khi người dùng cài add-on (để menu hiện luôn, không cần mở lại file). */
function onInstall(e) {
  onOpen(e);
}

function showSidebar() {
  const lang = getLocale_();
  const tpl = HtmlService.createTemplateFromFile('Sidebar');
  tpl.i18n = { en: I18N.en.ui, vi: I18N.vi.ui }; // cả 2 bộ chữ cho UI
  tpl.defaultLang = lang;
  const html = tpl.evaluate().setTitle(strings_(lang).sidebarTitle);
  SpreadsheetApp.getUi().showSidebar(html);
}

/* ----------------------------- Server actions ----------------------------- */

/**
 * Tạo folder Drive mới bằng Drive Advanced Service (v3) để hợp với scope tối
 * thiểu drive.file (DriveApp thì đòi full scope drive). Chống trùng tên bằng
 * cách ghi nhớ tên đã dùng trong PropertiesService — KHÔNG quét Drive.
 * @param {string} baseName
 * @return {{folderId:string, folderName:string, folderUrl:string}}
 */
function createDriveFolder(baseName) {
  baseName = (baseName || 'Upload').toString().trim() || 'Upload';

  const props = PropertiesService.getUserProperties();
  let used = {};
  try { used = JSON.parse(props.getProperty('usedFolderNames') || '{}'); } catch (e) {}

  let name = baseName;
  let i = 0;
  while (used[name]) {
    i++;
    name = baseName + ' (' + i + ')';
  }

  const folder = Drive.Files.create({
    name: name,
    mimeType: 'application/vnd.google-apps.folder'
  });

  used[name] = true;
  try { props.setProperty('usedFolderNames', JSON.stringify(used)); } catch (e) {}

  return {
    folderId: folder.id,
    folderName: name,
    folderUrl: 'https://drive.google.com/drive/folders/' + folder.id
  };
}

/**
 * Chọn sheet đích: nếu sheet đầu tiên trống thì dùng nó, ngược lại tạo tab mới.
 * Ghi header theo ngôn ngữ đang chọn.
 * @param {string} lang 'en' | 'vi'
 * @return {string} tên sheet đích
 */
function ensureTargetSheet(lang) {
  const t = strings_(lang);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheets()[0];
  const isEmpty = sheet.getLastRow() === 0 && sheet.getLastColumn() === 0;
  if (!isEmpty) {
    // Tránh trùng tên tab (vd upload nhiều lần trong cùng 1 phút) -> tự thêm hậu tố.
    let base = t.sheetPrefix + ' ' + nowStamp_();
    let nm = base, k = 0;
    while (ss.getSheetByName(nm)) { k++; nm = base + ' (' + k + ')'; }
    sheet = ss.insertSheet(nm);
  }
  sheet.getRange(1, 1, 1, t.headers.length)
    .setValues([t.headers])
    .setFontWeight('bold');
  sheet.setFrozenRows(1);
  return sheet.getName();
}

/**
 * Upload 1 ảnh vào folder, set public, ghi 1 dòng metadata vào cuối sheet.
 * @param {Object} p {sheetName, folderId, name, mimeType, dataBase64, width, height}
 * @return {{ok:boolean, shareFailed:boolean, shareError:string}}
 */
function processImage(p) {
  const bytes = Utilities.base64Decode(p.dataBase64);
  const blob = Utilities.newBlob(bytes, p.mimeType, p.name);

  // Tạo file bằng Drive Advanced Service (v3) -> hợp scope drive.file.
  const file = Drive.Files.create({ name: p.name, parents: [p.folderId] }, blob);
  const fileId = file.id;

  // Set public: bất kỳ ai có link đều xem được (anyone + reader).
  let shareFailed = false, shareError = '';
  try {
    Drive.Permissions.create({ role: 'reader', type: 'anyone' }, fileId);
  } catch (e) {
    shareFailed = true;
    shareError = e.message; // thường do Workspace chặn chia sẻ ra ngoài
  }

  const driveLink = 'https://drive.google.com/file/d/' + fileId + '/view';
  const directLink = 'https://lh3.googleusercontent.com/d/' + fileId;
  const format = extOf_(p.name) || String(p.mimeType || '').split('/')[1] || '';
  const sizeText = humanSize_(bytes.length);
  const dims = (p.width && p.height) ? (p.width + ' x ' + p.height) : '';
  const uploadTime = Utilities.formatDate(
    new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(p.sheetName);
  const row = sheet.getLastRow() + 1;
  const values = [
    row - 1,               // STT (trừ dòng header)
    p.name,
    format,
    sizeText,
    dims,
    driveLink,
    directLink,
    '=IMAGE("' + directLink + '")',
    uploadTime
  ];
  sheet.getRange(row, 1, 1, values.length).setValues([values]);
  sheet.setRowHeight(row, 80); // cho cao để xem preview

  return { ok: true, shareFailed: shareFailed, shareError: shareError };
}

/* ----------------------------- Helpers ----------------------------- */

function humanSize_(bytes) {
  if (bytes < 1024) return bytes + ' B';
  const kb = bytes / 1024;
  if (kb < 1024) return kb.toFixed(1) + ' KB';
  return (kb / 1024).toFixed(2) + ' MB';
}

function extOf_(name) {
  const m = String(name || '').match(/\.([a-zA-Z0-9]+)$/);
  return m ? m[1].toUpperCase() : '';
}

function nowStamp_() {
  return Utilities.formatDate(
    new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH\'h\'mm');
}
