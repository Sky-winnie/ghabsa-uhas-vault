import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const folderName = searchParams.get('folderName'); // e.g., "300"

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });

  const drive = google.drive({ version: 'v3', auth });

  try {
    // 1. Find the ID of the folder the student clicked (e.g., "Level 300")
    let query = `mimeType = 'application/vnd.google-apps.folder' and '${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents`;
    if (folderName) {
      query += ` and name contains '${folderName}'`;
    }

    const folderRes = await drive.files.list({ q: query, fields: 'files(id, name)' });
    const folders = folderRes.data.files;

    if (folderName && folders.length > 0) {
      // 2. If we found the specific level folder, get the FILES inside it
      const fileRes = await drive.files.list({
        q: `'${folders[0].id}' in parents and trashed = false`,
        fields: 'files(id, name, webViewLink, mimeType)',
      });
      return NextResponse.json(fileRes.data.files);
    }

    return NextResponse.json(folders);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
