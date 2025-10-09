import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const key = Buffer.from('Your32CharLongEncryptionKey!123456', 'utf-8'); // 32 bytes for AES-256
const iv = Buffer.from('16CharInitVector!', 'utf-8'); // 16 bytes for AES

export function encrypt(plainText: string): Buffer {
  const cipher = createCipheriv('aes-256-cbc', key, iv);
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  return encrypted;
}

export function decrypt(encrypted: Buffer): string {
  const decipher = createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}