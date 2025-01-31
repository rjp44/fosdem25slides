import googleapis from '@googleapis/slides';

import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


async function main() {
  // Use your service account credentials to authenticate with Google Slides API
  const SCOPES = ['https://www.googleapis.com/auth/presentations.readonly'];
  const authClient = await googleapis.auth.getClient({
    keyFile: path.join(__dirname, 'credentials/g.json'),
    scopes: SCOPES,
  });

  // Create a new instance of the Google Slides API client
  const slideApi = googleapis.slides({ version: 'v1', auth: authClient });

  // The presentation ID is found in the URL of your Google Slides presentation
  const presentationId = '1W3gGRoTVtEfCSgbLkWJYt3JRJWZKmlNnSimq_-RXH_c';

  // Get the metadata about the presentation
  const { data: { slides } } = await slideApi.presentations.get({
    presentationId: presentationId,
  });

  slides.forEach(slide => {
    const { objectId, slideProperties: { notesPage } } = slide;
    const { pageElements: notesElements } = notesPage;
    const notes = JSON.stringify(notesElements, null, 2);
    const shape = notesElements.find(n => n.objectId === notesPage?.notesProperties?.speakerNotesObjectId);
    const { shape: { text } } = shape;
    console.log({ shape, text }, 'text');
    let textString = text?.textElements?.map(t => t?.textRun?.contents).join('');

    console.log({ slide, textString, objectId, notesPage, notesElements, notes });
  }
  );

}

main().catch((err) => {
  console.error(err);
});