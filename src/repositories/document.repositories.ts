import Document from '../models/document.model';
import { DocumentAttributes } from '../interfaces/document.interface';

export class DocumentRepository {
  async create(document: DocumentAttributes): Promise<DocumentAttributes> {
    const saved = await Document.create(document as any);
    return saved.get({ plain: true }) as DocumentAttributes;
  }
}
