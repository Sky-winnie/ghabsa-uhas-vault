import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const folderId = searchParams.get('folderId');

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });

  const drive = google.drive({ version: 'v3', auth });

  try {
    const fileRes = await drive.files.list({
      // We look directly into the ID provided by the frontend
      q: `'${folderId}' in parents and trashed = false and mimeType != 'application/vnd.google-apps.folder'`,
      fields: 'files(id, name, webViewLink, mimeType, modifiedTime)',
      orderBy: 'name',
    });
    return NextResponse.json(fileRes.data.files || []);
  } catch (error) {
    console.error("Drive API Error:", error.message);
    return NextResponse.json([], { status: 500 });
  }
}
