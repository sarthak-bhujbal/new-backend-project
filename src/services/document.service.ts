import { DocumentRepository } from '../repositories/document.repositories';
import { DocumentAttributes } from '../interfaces/document.interface';
import { v4 as uuidv4 } from 'uuid';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { MultipartFile } from '@fastify/multipart';

const pump = promisify(pipeline);
const repo = new DocumentRepository();

export class DocumentService {
  async uploadDocument(file: MultipartFile): Promise<DocumentAttributes> {
    if (!file) throw new Error("File is required");

    if (!existsSync("uploads")) {
      mkdirSync("uploads");
    }

    const fileExt = file.filename.split('.').pop()?.toLowerCase();
    let fileType: 'pdf' | 'image';

    if (fileExt === 'pdf') fileType = 'pdf';
    else if (['jpg','jpeg','png','gif','webp'].includes(fileExt || '')) fileType = 'image';
    else throw new Error("Only PDF or Image files are allowed");

    const savedPath = `uploads/${uuidv4()}_${file.filename}`;

    // Save file to disk
    await pump(file.file, createWriteStream(savedPath));

    const document: DocumentAttributes = {
      id: uuidv4(),

      file_name: file.filename,
      file_path: savedPath,
      file_type: fileType,
    };

    return await repo.create(document);
  }
}
