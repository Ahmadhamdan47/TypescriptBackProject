import aesjs from "aes-js";
import { prefs } from "../../webServer";
import { AES_PREFIX } from "./constants";

/**
 * Encrypts a given string with aes
 * @param str string to encrypt
 * @returns encrypted string as hex
 */
export async function aesEncryptStringToHex(str: string) {
  const value = aesjs.utils.hex.toBytes(prefs.value); // Convert str to bytes
  const strBytes = aesjs.utils.utf8.toBytes(AES_PREFIX + str);
  // This uses the key and counter to encrypt the data
  const aesCtr = new aesjs.ModeOfOperation.ctr(
    value,
    new aesjs.Counter(prefs.counter)
  );
  const encryptedBytes = aesCtr.encrypt(strBytes);
  // To store the encrypted binary data, convert it to hex
  return aesjs.utils.hex.fromBytes(encryptedBytes);
}

/**
 * Decrypts a given hex string with aes
 * @param encryptedHex hex string to decrypt
 * @returns decrypted hex as string
 */
export async function aesDecryptStringFromHex(encryptedHex: string) {
  const value = aesjs.utils.hex.toBytes(prefs.value); // Convert str to bytes
  const encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);
  // This uses the key and counter to decrypt the data
  const aesCtr = new aesjs.ModeOfOperation.ctr(
    value,
    new aesjs.Counter(prefs.counter)
  );
  const decryptedBytes = aesCtr.decrypt(encryptedBytes);
  // Convert bytes back into text
  return aesjs.utils.utf8.fromBytes(decryptedBytes).replace(AES_PREFIX, "");
}
