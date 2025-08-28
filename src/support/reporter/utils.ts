import fs from 'fs';
import path from 'path';
import os from 'os';
import archiver from 'archiver';


export async function zipReportFolder(folderPath: string, zipName: string): Promise<string> {
  const zipPath = path.join(os.tmpdir(), `${zipName}.zip`);

  await new Promise<void>((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`[ZIP] Report successfully zipped at: ${zipPath}`);
      resolve();
    });

    archive.on('error', (err) => reject(err));

    archive.pipe(output);
    archive.directory(folderPath, false);
    archive.finalize();
  });

  return zipPath;
}
