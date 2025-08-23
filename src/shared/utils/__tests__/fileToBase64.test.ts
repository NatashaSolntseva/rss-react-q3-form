import { describe, it, expect } from 'vitest';
import { fileToBase64 } from '@/shared/utils/fileToBase64';

describe('fileToBase64', () => {
  it('converts a File to a base64 data URL', async () => {
    const blob = new Blob(['hello'], { type: 'text/plain' });
    const file = new File([blob], 'hello.txt', { type: 'text/plain' });

    const dataUrl = await fileToBase64(file);

    expect(dataUrl).toMatch(/^data:text\/plain;base64,/);

    const [, base64 = ''] = dataUrl.split(',');
    const decoded = Buffer.from(base64, 'base64').toString('utf-8');
    expect(decoded).toBe('hello');
  });

  it('handles empty file content', async () => {
    const blob = new Blob([''], { type: 'text/plain' });
    const file = new File([blob], 'empty.txt', { type: 'text/plain' });

    const dataUrl = await fileToBase64(file);

    expect(dataUrl).toMatch(/^data:text\/plain;base64,/);

    const [, base64 = ''] = dataUrl.split(',');
    const decoded = Buffer.from(base64, 'base64').toString('utf-8');
    expect(decoded).toBe('');
  });
});
