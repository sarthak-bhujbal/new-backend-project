// import { FastifyReply, FastifyRequest } from 'fastify';
// import { DocumentService } from '../services/document.service';
// import { MultipartFile } from '@fastify/multipart';

// const service = new DocumentService();

// export class DocumentController {
//   async upload(req: FastifyRequest, reply: FastifyReply) {
//     const file = await req.file();
//      // simpler than req.parts()

//     if (!file) {
//       return reply.code(400).send({ message: 'File is required' });
//     }

//     const { agent_id, customer_id } = req.body as { agent_id?: string; customer_id?: string };

//     const doc = await service.uploadDocument(file as MultipartFile, agent_id, customer_id);

//     return reply.code(201).send({
//       message: 'File uploaded successfully',
//       document: doc,
//     });
//   }
// }

import { FastifyReply, FastifyRequest } from 'fastify';
import { DocumentService } from '../services/document.service';
import { MultipartFile } from '@fastify/multipart';

const service = new DocumentService();

export class DocumentController {
    upload = async (req: FastifyRequest, reply: FastifyReply)=> {
        try {
            const file = await req.file(); // simpler than req.parts()

            if (!file) {
                return reply.code(400).send({ message: 'File is required' });
            }

            //   const { agent_id, customer_id } = req.body as { agent_id?: string; customer_id?: string };

            const doc = await service.uploadDocument(file as MultipartFile);

            // Only return id and message
            return reply.code(201).send({
                message: 'File uploaded successfully',
                document_id: doc.id,
            });

        } catch (err: any) {
            return reply.code(500).send({ message: err.message || 'Upload failed' });
        }
    }
}

