"use server";
import * as googleapis from "@googleapis/slides";
import fs from "fs/promises";

import { SlideType } from "@/types";

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { NODE_ENV } = process.env;

export default async function getSlides() {
  if (NODE_ENV === "production") {
    return import("@/slides").then(({ slides }) => slides);
  } else {
    const slides = await getPresentation();
    await fs.writeFile(
      path.join(__dirname, "../slides.tsx"),
      `import { SlideType } from './types';
export const slides: SlideType[] = ${JSON.stringify(slides)}
    `
    );
    console.log("Wrote slides to file");
    return slides;
  }
}

async function getPresentation() {
  // Use your service account credentials to authenticate with Google Slides API
  const SCOPES = ["https://www.googleapis.com/auth/presentations.readonly"];
  const authClient = await googleapis.auth.getClient({
    keyFile: path.join(__dirname, "../../credentials/g.json"),
    scopes: SCOPES,
  });

  // Create a new instance of the Google Slides API client
  const slideApi = googleapis.slides({ version: "v1", auth: authClient });

  // The presentation ID is found in the URL of your Google Slides presentation
  const presentationId = "1W3gGRoTVtEfCSgbLkWJYt3JRJWZKmlNnSimq_-RXH_c";

  // Get the metadata about the presentation
  const {
    data: { slides },
  } =
    (await slideApi.presentations.get({
      presentationId: presentationId,
    })) || {};

  const results = await Promise.all(
    slides?.map(
      async (
        slide: googleapis.slides_v1.Schema$Page
      ): Promise<SlideType | undefined> => {
        if (slide) {
          const { objectId, slideProperties } = slide;
          const notesPage = slideProperties?.notesPage;
          const notesElements = notesPage?.pageElements;
          const shape = notesElements?.find(
            (n) =>
              n.objectId === notesPage?.notesProperties?.speakerNotesObjectId
          );
          const text = shape?.shape?.text;
          const textString =
            text?.textElements?.map((t) => t?.textRun?.content).join("") || "";
          const { data } = await slideApi.presentations.pages.getThumbnail({
            presentationId: presentationId,
            pageObjectId: objectId,
          } as googleapis.slides_v1.Params$Resource$Presentations$Pages$Getthumbnail);
          const contentUrl = data?.contentUrl;
          const imageData = contentUrl && (await fetch(contentUrl));
          const buffer =
            contentUrl &&
            imageData &&
            Buffer.from(await imageData?.arrayBuffer());
          const image = buffer
            ? `data:image/png;base64,${buffer.toString("base64")}`
            : "";
          return { notes: textString, image };
        }
        return undefined;
      }
    ) || []
  );
  return results.filter(
    (result): result is SlideType => result !== undefined
  ) as SlideType[];
}
