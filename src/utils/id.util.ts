import { randomUUID } from 'node:crypto';

export function generateId(prefixe: string): string {
    return `${prefixe}_${randomUUID()}`;
}