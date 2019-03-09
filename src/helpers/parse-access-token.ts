import { Request } from 'express';

export default function getAccessToken(req: Request) {
  const header = req.get('Authorization');

  if (header) return header.split(' ')[1];

  return '';
}