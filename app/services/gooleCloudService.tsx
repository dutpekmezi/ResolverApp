import storage from "firebase-admin";
import { firebaseApp } from "../utils/firebase";
import { UploadHandler, 
  writeAsyncIterableToWritable,
	unstable_createFileUploadHandler as createFileUploadHandler,
  unstable_composeUploadHandlers as composeUploadHandlers
 } from "@remix-run/node";

export async function uploadFile(
  path: string,
  contentType: string,
  data: AsyncIterable<Uint8Array>
): Promise<{ url: string; size: number }> {
  return new Promise(async (resolve, reject) => {
    const file = storage.storage(firebaseApp)
      .bucket(`${process.env.FIREBASE_PROJECT_ID}.appspot.com`)
      .file(path);

    const writeStream = file.createWriteStream({
      contentType,
      resumable: false,
      predefinedAcl: "publicRead",
    });

    writeStream
      .on("finish", async () => {
        const url = file.publicUrl();
        const [metadata] = await file.getMetadata();

        resolve({ url, size: Number(metadata.size) });
      })
      .on("error", (error) => {
        reject(error);
      });

    await writeAsyncIterableToWritable(data, writeStream);
  });
}

export const googleCloudUploadHandler : UploadHandler = async (file) => {
  if (file.name !== "img" || !file.filename) {
    return undefined;
  }

  const { url, size } = await uploadFile(
    `${file.filename}`,
    file.contentType,
    file.data
  );

  return JSON.stringify({
    url,
    size,
    name: file.filename,
    contentType: file.contentType,
  });
}