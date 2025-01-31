'use server'
import * as googleapis from '@googleapis/slides';

import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export default async function getPresentation() {
  // Use your service account credentials to authenticate with Google Slides API
  const SCOPES = ['https://www.googleapis.com/auth/presentations.readonly'];
  const authClient = await googleapis.auth.getClient({
    keyFile: path.join(__dirname, '../../credentials/g.json'),
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

  return Promise.all(slides.map(async slide => {
    const { objectId, slideProperties: { notesPage } } = slide;
    const { pageElements: notesElements } = notesPage;
    const shape = notesElements.find(n => n.objectId === notesPage?.notesProperties?.speakerNotesObjectId);
    const { shape: { text } } = shape;
    console.log({ shape, text }, 'text');
    let textString = text?.textElements?.map(t => t?.textRun?.content).join('');
    let res = await slideApi.presentations.pages.getThumbnail({
      presentationId: presentationId,
      pageObjectId: objectId,
    });
    let {contentUrl: image} = res.data
    console.log(image);
  
    return { notes: textString, image };
  })
);


}

