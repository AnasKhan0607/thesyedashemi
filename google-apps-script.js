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
 *    E1: Fitness Level
 *    F1: Goal
 *    G1: Message
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

/**
 * Handle POST requests from the website form
 */
function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
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
    
    // Append a new row with the form data
    sheet.appendRow([
      timestamp,
      data.name || '',
      data.email || '',
      data.instagram || '',
      data.fitness_level || '',
      data.goal || '',
      data.message || ''
    ]);
    
    // Send email notification (optional - uncomment if you want email alerts)
    // sendEmailNotification(data);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'success', 
        message: 'Application received!' 
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log the error
    console.error('Error processing form:', error);
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'error', 
        message: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
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
