export interface Hashing {
  hash(plainText: string): Promise<string>;
}
