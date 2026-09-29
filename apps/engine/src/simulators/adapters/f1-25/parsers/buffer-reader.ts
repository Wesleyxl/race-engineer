/**
 * title: "Little-endian reader for UDP buffers"
 * description: "Cursor over Buffer: uint8/16/32, int, float, uint64, chars, array. All F1 25 parsers advance this offset in the packed order of the PDF."
 */

import { Buffer } from "buffer";

export class BufferReader {
  private offset = 0;

  constructor(private readonly buffer: Buffer) { }

  get position(): number {
    return this.offset;
  }

  get remaining(): number {
    return this.buffer.length - this.offset;
  }

  skip(bytes: number): void {
    this.offset += bytes;
  }

  uint8(): number {
    const value = this.buffer.readUInt8(this.offset);
    this.offset += 1;
    return value;
  }

  int8(): number {
    const value = this.buffer.readInt8(this.offset);
    this.offset += 1;
    return value;
  }

  uint16(): number {
    const value = this.buffer.readUInt16LE(this.offset);
    this.offset += 2;
    return value;
  }

  int16(): number {
    const value = this.buffer.readInt16LE(this.offset);
    this.offset += 2;
    return value;
  }

  uint32(): number {
    const value = this.buffer.readUInt32LE(this.offset);
    this.offset += 4;
    return value;
  }

  int32(): number {
    const value = this.buffer.readInt32LE(this.offset);
    this.offset += 4;
    return value;
  }

  float(): number {
    const value = this.buffer.readFloatLE(this.offset);
    this.offset += 4;
    return value;
  }

  double(): number {
    const value = this.buffer.readDoubleLE(this.offset);
    this.offset += 8;
    return value;
  }

  uint64(): bigint {
    const value = this.buffer.readBigUInt64LE(this.offset);
    this.offset += 8;
    return value;
  }

  /** Lê N bytes como string UTF-8 (corta no primeiro null) */
  chars(length: number): string {
    const slice = this.buffer.subarray(this.offset, this.offset + length);
    this.offset += length;
    const nullIndex = slice.indexOf(0);
    const end = nullIndex === -1 ? length : nullIndex;
    return slice.subarray(0, end).toString('utf8');
  }

  array<T>(count: number, readItem: () => T): T[] {
    const items: T[] = [];
    for (let i = 0; i < count; i++) {
      items.push(readItem());
    }
    return items;
  }
}
