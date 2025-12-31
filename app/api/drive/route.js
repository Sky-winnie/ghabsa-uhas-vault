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
    // 1. Better search: "contains" allows us to find "01_Level_100" just by searching "100"
    let query = `mimeType = 'application/vnd.google-apps.folder' and '${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents and trashed = false`;
    
    if (folderName) {
      query += ` and name contains '${folderName}'`;
    }

    const folderRes = await drive.files.list({ 
      q: query, 
      fields: 'files(id, name)',
      pageSize: 10 
    });
    
    const folders = folderRes.data.files || [];

    if (folderName && folders.length > 0) {
      // 2. We found the sub-folder (e.g., 01_Level_100), now get the actual files inside it
      const fileRes = await drive.files.list({
        q: `'${folders[0].id}' in parents and trashed = false and mimeType != 'application/vnd.google-apps.folder'`,
        fields: 'files(id, name, webViewLink, mimeType)',
      });
      return NextResponse.json(fileRes.data.files || []);
    }

    // If no specific level was requested, just return the list of folders
    return NextResponse.json(folders);
  } catch (error) {
    console.error("Drive API Error:", error.message);
    return NextResponse.json([], { status: 500 }); // Always return an array to prevent client crashes
  }
}
