import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

const connectionString = process.env.AZURE_BLOB_CONNECTION_STRING;
const containerName = process.env.AZURE_BLOB_CONTAINER_NAME;

if (!connectionString) {
  console.warn('[BlobClient] Missing AZURE_BLOB_CONNECTION_STRING env var');
}

if (!containerName) {
  console.warn('[BlobClient] Missing AZURE_BLOB_CONTAINER_NAME env var');
}

const blobServiceClient = connectionString
  ? BlobServiceClient.fromConnectionString(connectionString)
  : null;

let containerClient: ContainerClient | null = null;

if (blobServiceClient && containerName) {
  containerClient = blobServiceClient.getContainerClient(containerName);
}

export { containerClient };
