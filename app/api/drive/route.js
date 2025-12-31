import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const folderName = searchParams.get('folderName'); 

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });

  const drive = google.drive({ version: 'v3', auth });

  try {
    // 1. Search for the sub-folder within your Root
    // Using 'contains' ensures we find "01_Level_100" when folderName is "100"
    let folderQuery = `mimeType = 'application/vnd.google-apps.folder' and '${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents and name contains '${folderName}' and trashed = false`;
    
    const folderRes = await drive.files.list({ q: folderQuery, fields: 'files(id, name)' });
    const folders = folderRes.data.files || [];

    if (folders.length > 0) {
      // 2. Fetch files from the FIRST matching folder found
      const fileRes = await drive.files.list({
        q: `'${folders[0].id}' in parents and trashed = false and mimeType != 'application/vnd.google-apps.folder'`,
        fields: 'files(id, name, webViewLink, mimeType, modifiedTime)', // Added modifiedTime
        orderBy: 'name',
      });
      return NextResponse.json(fileRes.data.files || []);
    }

    return NextResponse.json([]); 
  } catch (error) {
    console.error("Drive API Error:", error.message);
    return NextResponse.json([], { status: 500 });
  }
}
