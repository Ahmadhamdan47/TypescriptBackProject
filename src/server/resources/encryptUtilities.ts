import crypto from "crypto";

export function hashData(data: any): string {
  const hash = crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
  return hash;
}
