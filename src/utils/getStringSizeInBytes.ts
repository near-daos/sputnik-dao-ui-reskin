export function getStringSizeInBytes(value: string): number {
  return new TextEncoder().encode(value).length;
}
