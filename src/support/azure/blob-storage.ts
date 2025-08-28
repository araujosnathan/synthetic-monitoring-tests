import fs from 'fs';
import { containerClient } from './blob-storage-client';

export async function uploadFileToBlobStorage(filePath: string, blobName: string): Promise<void> {
  if (!containerClient) {
    console.warn('[BlobStorage] Container client not initialized.');
    return;
  }

  console.log('[BlobStorage] Checking/Creating container if not exists...');
  await containerClient.createIfNotExists();
  console.log('[BlobStorage] Container ready.');

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  console.log('[BlobStorage] Reading file...');
  const fileBuffer = fs.readFileSync(filePath);

  console.log('[BlobStorage] Uploading data...');
  await blockBlobClient.uploadData(fileBuffer, {
    blobHTTPHeaders: { blobContentType: 'application/zip' },
  });

  console.log(`[BlobStorage] Upload completed: ${blobName}`);
}
