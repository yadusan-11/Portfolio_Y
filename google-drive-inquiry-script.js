/**
 * Google Apps Script for Logging Portfolio Inquiries directly into Google Sheets in Google Drive
 * Account: yaesthetic1@gmail.com
 *
 * HOW TO SET UP IN 2 MINUTES:
 * 1. Go to Google Drive (logged in as yaesthetic1@gmail.com): https://drive.google.com
 * 2. Create a new Google Sheet named "Portfolio Inquiries".
 * 3. In Row 1, set the headers:
 *    A1: Timestamp | B1: Name | C1: Email | D1: Service | E1: Message
 * 4. Click "Extensions" > "Apps Script".
 * 5. Delete any existing code and paste this entire file content.
 * 6. Click "Deploy" > "New deployment".
 * 7. Choose type: "Web app".
 * 8. Set:
 *    - Description: "Portfolio Inquiry Receiver"
 *    - Execute as: "Me (yaesthetic1@gmail.com)"
 *    - Who has access: "Anyone"
 * 9. Click "Deploy", authorize access, and copy the Web App URL.
 * 10. (Optional) Paste that Web App URL into `GOOGLE_DRIVE_SHEET_WEBAPP_URL` in `js/main.js`.
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Append row
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString(),
      data.name || '',
      data.email || '',
      data.service || '',
      data.message || ''
    ]);

    // Send email notification to yaesthetic1@gmail.com
    var recipient = "yaesthetic1@gmail.com";
    var subject = "New Portfolio Inquiry from " + (data.name || 'Client');
    var body = "You received a new inquiry on your portfolio website:\n\n" +
               "Name: " + (data.name || 'N/A') + "\n" +
               "Email: " + (data.email || 'N/A') + "\n" +
               "Service: " + (data.service || 'N/A') + "\n" +
               "Message: \n" + (data.message || 'N/A') + "\n\n" +
               "Logged automatically to Google Drive.";
               
    MailApp.sendEmail(recipient, subject, body);

    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Inquiry logged to Google Drive Sheet" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Portfolio Google Drive Inquiry Service is Active.");
}
