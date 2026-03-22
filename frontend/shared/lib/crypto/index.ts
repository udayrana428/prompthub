// crypto.ts

export interface EncryptedPayload {
  iv: string;
  data: string;
  tag: string;
}

/**
 * Convert ArrayBuffer → hex string
 */
function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Convert hex string → ArrayBuffer
 */
function hexToArrayBuffer(hex: string): ArrayBuffer {
  if (hex.length % 2 !== 0) {
    throw new Error("Invalid hex string");
  }

  const bytes = new Uint8Array(hex.length / 2);

  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }

  return bytes.buffer;
}

/**
 * Concatenate two ArrayBuffers
 */
function concatBuffers(
  buffer1: ArrayBuffer,
  buffer2: ArrayBuffer,
): ArrayBuffer {
  const tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  tmp.set(new Uint8Array(buffer1), 0);
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
  return tmp.buffer;
}

/**
 * Import raw AES-256 key from hex string
 */
async function importKey(
  hexKey: string,
  usage: KeyUsage[],
): Promise<CryptoKey> {
  const keyBuffer = hexToArrayBuffer(hexKey);

  if (keyBuffer.byteLength !== 32) {
    throw new Error("Key must be 32 bytes (256-bit)");
  }

  return crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-GCM" },
    false,
    usage,
  );
}

/**
 * Encrypt data using AES-256-GCM
 */
export async function encrypt(
  data: unknown,
  hexKey: string,
): Promise<EncryptedPayload> {
  const key = await importKey(hexKey, ["encrypt"]);

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encoded = new TextEncoder().encode(JSON.stringify(data));

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded,
  );

  const cipherArray = new Uint8Array(ciphertext);

  const tag = cipherArray.slice(cipherArray.length - 16);
  const encryptedData = cipherArray.slice(0, cipherArray.length - 16);

  return {
    iv: bufferToHex(iv.buffer),
    data: bufferToHex(encryptedData.buffer),
    tag: bufferToHex(tag.buffer),
  };
}

/**
 * Decrypt AES-256-GCM payload
 */
export async function decrypt<T = unknown>(
  payload: EncryptedPayload,
  hexKey: string,
): Promise<T> {
  const key = await importKey(hexKey, ["decrypt"]);

  const iv = hexToArrayBuffer(payload.iv);
  const encryptedData = hexToArrayBuffer(payload.data);
  const authTag = hexToArrayBuffer(payload.tag);

  const combined = concatBuffers(encryptedData, authTag);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(iv) },
    key,
    combined,
  );

  const decoded = new TextDecoder().decode(decrypted);

  return JSON.parse(decoded) as T;
}

// ✅ Usage Example (React / Next.js)
// const SESSION_KEY = "64_hex_character_string_here";

// const encrypted = await encrypt(
//   { email: "test@test.com", password: "123456" },
//   SESSION_KEY,
// );

// const response = await fetch("/api/checklogin", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify(encrypted),
// });

// const encryptedResponse = await response.json();

// const decrypted = await decrypt<{ token: string }>(
//   encryptedResponse,
//   SESSION_KEY,
// );

// console.log(decrypted.token);

// node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
