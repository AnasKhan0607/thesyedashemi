/**
 * Google Apps Script for The Syed Ashemi Application Form
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Go to Google Sheets and create a new spreadsheet
 * 2. Name it "The Syed Ashemi - Applications" (or whatever you like)
 * 3. In the first row, add these headers:
 *    A1: Timestamp
 *    B1: Name
 *    C1: Email
 *    D1: Instagram
 *    E1: Phone
 *    F1: Fitness Level
 *    G1: Goal
 *    H1: Message
 * 
 * 4. Go to Extensions > Apps Script
 * 5. Delete any code in the editor and paste this entire script
 * 6. Click "Deploy" > "New deployment"
 * 7. Select type: "Web app"
 * 8. Set "Execute as": "Me"
 * 9. Set "Who has access": "Anyone"
 * 10. Click "Deploy"
 * 11. Copy the Web app URL
 * 12. Paste that URL in script.js where it says 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'
 * 
 * That's it! Form submissions will now appear in your Google Sheet.
 */

// The name of your sheet (tab) - default is "Sheet1"
const SHEET_NAME = 'Sheet1';

// Must match SHARED_SECRET in script.js
const SHARED_SECRET = 'ta-sh-9f3kq2p7xm';

// Rate limit: max submissions per fingerprint per window
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_SECONDS = 3600; // 1 hour

// Max field lengths (reject longer submissions)
const MAX_FIELD_LENGTH = 500;
const MAX_MESSAGE_LENGTH = 2000;

/**
 * Strip CSV-injection prefixes so formulas don't execute when the sheet is opened/exported.
 * Also trims and caps length.
 */
function sanitize(value, maxLength) {
  if (value === null || value === undefined) return '';
  let s = String(value).trim();
  if (s.length > maxLength) s = s.substring(0, maxLength);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return s;
}

/**
 * Handle POST requests from the website form
 */
function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);

    // --- Security checks ---

    // 1. Shared secret check — rejects blind POSTs that don't come from our site's JS
    if (data.secret !== SHARED_SECRET) {
      return jsonResponse({ status: 'success', message: 'Application received!' });
    }

    // 2. Honeypot — bots fill hidden fields; humans don't
    if (data.website && String(data.website).trim() !== '') {
      return jsonResponse({ status: 'success', message: 'Application received!' });
    }

    // 3. Rate limit by a fingerprint (email + name). CacheService is per-script, free.
    const fingerprint = (String(data.email || '') + '|' + String(data.name || '')).toLowerCase();
    const cache = CacheService.getScriptCache();
    const key = 'rl_' + Utilities.base64EncodeWebSafe(fingerprint).substring(0, 80);
    const current = parseInt(cache.get(key) || '0', 10);
    if (current >= RATE_LIMIT_MAX) {
      return jsonResponse({ status: 'success', message: 'Application received!' });
    }
    cache.put(key, String(current + 1), RATE_LIMIT_WINDOW_SECONDS);

    // 4. Required fields
    if (!data.name || !data.email) {
      return jsonResponse({ status: 'error', message: 'Missing required fields' });
    }

    // Get the active spreadsheet and sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    if (!sheet) {
      throw new Error('Sheet not found: ' + SHEET_NAME);
    }

    // Format the timestamp nicely
    const timestamp = data.timestamp
      ? new Date(data.timestamp).toLocaleString('en-US', {
          timeZone: 'America/Toronto',
          dateStyle: 'medium',
          timeStyle: 'short'
        })
      : new Date().toLocaleString('en-US', {
          timeZone: 'America/Toronto',
          dateStyle: 'medium',
          timeStyle: 'short'
        });

    // Append a sanitized row
    sheet.appendRow([
      timestamp,
      sanitize(data.name, MAX_FIELD_LENGTH),
      sanitize(data.email, MAX_FIELD_LENGTH),
      sanitize(data.instagram, MAX_FIELD_LENGTH),
      sanitize(data.phone, MAX_FIELD_LENGTH),
      sanitize(data.fitness_level, MAX_FIELD_LENGTH),
      sanitize(data.goal, MAX_FIELD_LENGTH),
      sanitize(data.message, MAX_MESSAGE_LENGTH)
    ]);
    
    // Send email notification (optional - uncomment if you want email alerts)
    // sendEmailNotification(data);
    
    // Return success response
    return jsonResponse({ status: 'success', message: 'Application received!' });

  } catch (error) {
    // Log the error
    console.error('Error processing form:', error);

    // Return error response
    return jsonResponse({ status: 'error', message: error.toString() });
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ 
      status: 'ok', 
      message: 'The Syed Ashemi form endpoint is live!' 
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Optional: Send email notification when someone applies
 * Uncomment the sendEmailNotification call in doPost to enable this
 */
function sendEmailNotification(data) {
  const YOUR_EMAIL = 'your@email.com'; // Replace with your email
  
  const subject = '🔥 New Coaching Application: ' + data.name;
  
  const body = `
New application received!

Name: ${data.name}
Email: ${data.email}
Instagram: ${data.instagram}
Fitness Level: ${data.fitness_level}
Goal: ${data.goal}
Message: ${data.message || 'N/A'}

---
Check your Google Sheet for all applications.
  `.trim();
  
  MailApp.sendEmail({
    to: YOUR_EMAIL,
    subject: subject,
    body: body
  });
}

/**
 * Test function - run this to verify everything is set up correctly
 */
function testSetup() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  
  if (sheet) {
    console.log('✅ Sheet found: ' + SHEET_NAME);
    console.log('✅ Current rows: ' + sheet.getLastRow());
    console.log('✅ Setup looks good!');
  } else {
    console.log('❌ Sheet not found: ' + SHEET_NAME);
    console.log('Make sure you have a sheet named "' + SHEET_NAME + '"');
  }
}
