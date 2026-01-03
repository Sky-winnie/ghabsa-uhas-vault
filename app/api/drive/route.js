import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const folderId = searchParams.get('folderId');
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
    let targetFolderId = folderId;

    // If we only have a name (like for the initial Level click), find its ID first
    if (!targetFolderId && folderName) {
      const folderRes = await drive.files.list({
        q: `mimeType = 'application/vnd.google-apps.folder' and '${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents and name contains '${folderName}' and trashed = false`,
        fields: 'files(id)',
      });
      targetFolderId = folderRes.data.files[0]?.id;
    }

    if (!targetFolderId) return NextResponse.json([]);

    // Fetch BOTH files and subfolders
    const res = await drive.files.list({
      q: `'${targetFolderId}' in parents and trashed = false`,
      fields: 'files(id, name, webViewLink, mimeType, modifiedTime)',
      orderBy: 'folder, name', // Folders first, then alphabetical
    });

    return NextResponse.json(res.data.files || []);
  } catch (error) {
    console.error("Drive API Error:", error.message);
    return NextResponse.json([], { status: 500 });
  }
}
