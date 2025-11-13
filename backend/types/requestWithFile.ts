import { Request } from 'express';

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

export type RequestWithFile = Omit<Request, 'file'> & {
  file?: UploadedFile;
};