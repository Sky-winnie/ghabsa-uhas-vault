import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const folderId = searchParams.get('folderId');
  const folderName = searchParams.get('folderName');
  const globalQuery = searchParams.get('q'); // New Global Search Param

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });

  const drive = google.drive({ version: 'v3', auth });

  try {
    // GLOBAL SEARCH LOGIC
    if (globalQuery) {
      const res = await drive.files.list({
        q: `name contains '${globalQuery}' and trashed = false and '${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents`, 
        // Note: For true deep search across all subfolders, we use 'tranportability' logic or simply:
        q: `name contains '${globalQuery}' and trashed = false`, 
        fields: 'files(id, name, webViewLink, mimeType, modifiedTime)',
      });
      return NextResponse.json(res.data.files || []);
    }

    // NORMAL NAVIGATION LOGIC
    let targetFolderId = folderId;
    if (!targetFolderId && folderName) {
      const folderRes = await drive.files.list({
        q: `mimeType = 'application/vnd.google-apps.folder' and '${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents and name contains '${folderName}' and trashed = false`,
        fields: 'files(id)',
      });
      targetFolderId = folderRes.data.files[0]?.id;
    }

    if (!targetFolderId) return NextResponse.json([]);

    const res = await drive.files.list({
      q: `'${targetFolderId}' in parents and trashed = false`,
      fields: 'files(id, name, webViewLink, mimeType, modifiedTime)',
      orderBy: 'folder, name',
    });

    return NextResponse.json(res.data.files || []);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
