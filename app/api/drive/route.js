import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const folderId = searchParams.get('folderId');

  if (!folderId) return NextResponse.json([]);

  try {
    // Robust Key Formatting: Handles quotes, escaped newlines, and literal newlines
    const rawKey = process.env.GOOGLE_PRIVATE_KEY || "";
    const formattedKey = rawKey
      .replace(/^["']|["']$/g, '') // Remove accidental surrounding quotes
      .replace(/\\n/g, '\n');      // Convert escaped \n to real newlines

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: formattedKey,
      },
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    const drive = google.drive({ version: 'v3', auth });

    const fileRes = await drive.files.list({
      // Fetching directly from the ID provided by the frontend
      q: `'${folderId}' in parents and trashed = false and mimeType != 'application/vnd.google-apps.folder'`,
      fields: 'files(id, name, webViewLink, mimeType, modifiedTime)',
      orderBy: 'name',
    });

    return NextResponse.json(fileRes.data.files || []);
  } catch (error) {
    console.error("Drive API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
