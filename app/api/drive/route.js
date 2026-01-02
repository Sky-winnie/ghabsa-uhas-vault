import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const folderId = searchParams.get('folderId');

  // DEBUG LOGS - Check these in Vercel "Logs" tab
  console.log("Attempting to fetch Folder ID:", folderId);

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        // Improved replacement logic to catch Vercel-specific escapes
        private_key: process.env.GOOGLE_PRIVATE_KEY?.split(RegExp('\\\\n|\\n')).join('\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    const drive = google.drive({ version: 'v3', auth });

    const fileRes = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, webViewLink, mimeType, modifiedTime)',
      orderBy: 'name',
    });

    console.log(`Found ${fileRes.data.files?.length || 0} files`);
    return NextResponse.json(fileRes.data.files || []);
  } catch (error) {
    console.error("DRIVE API CRASH:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
