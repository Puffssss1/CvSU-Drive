import { NextRequest, NextResponse } from 'next/server';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import formidable from 'formidable';
import fs from 'fs';

const firebaseConfig = {
    apiKey: "AIzaSyB4YWk-RjFaitdU10BSQw304L09ibshf94",
    authDomain: "cvsu-drive-b47b7.firebaseapp.com",
    projectId: "cvsu-drive-b47b7",
    storageBucket: "cvsu-drive-b47b7.firebasestorage.app",
    messagingSenderId: "1074064685269",
    appId: "1:1074064685269:web:eefd8a951d054031990a5c"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Disable body parsing (important for file uploads)
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const form = formidable({ multiples: false });
  const reqBody = await req.blob();
  const bodyBuffer = await reqBody.arrayBuffer();
  const boundary = req.headers.get('content-type')?.split('boundary=')[1] || '';
  form.headers = { 'content-type': boundary };

  return new Promise((resolve) => {
    form.parse(bodyBuffer, async (err, fields, files) => {
      if (err) {
        console.error(err);
        resolve(NextResponse.json({ error: 'File upload failed' }, { status: 400 }));
        return;
      }

      const file = files.file[0];
      const fileContent = fs.readFileSync(file);

      try {
        const storageRef = ref(storage, `uploads/${file.name}`);
        await uploadBytes(storageRef, fileContent);
        resolve(
          NextResponse.json({ message: 'File uploaded successfully' }, { status: 200 })
        );
      } catch (uploadError) {
        console.error(uploadError);
        resolve(NextResponse.json({ error: 'Error uploading to Firebase' }, { status: 500 }));
      }
    });
  });
}
