import { Request, Response } from 'express';


export interface HandlerResponse {
  body?: any;
  status?: number;
  headers?: any;
}

export interface RequestHandler {
  (req: Request, res?: Response): Promise<HandlerResponse>;
}
