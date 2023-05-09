export interface Hashing {
  hash(plainText: string): Promise<string>;
  compare(value: string, hash: string): Promise<boolean>;
}
