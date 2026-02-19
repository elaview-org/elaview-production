import fs from "node:fs";
import path from "node:path";
import { cleanupRegistryPath } from "./constants";

export type CleanupEntry =
  | { type: "account"; email: string; password: string }
  | { type: "space"; id: string; email: string; password: string }
  | { type: "campaign"; id: string; email: string; password: string }
  | { type: "review"; id: string; email: string; password: string }
  | { type: "paymentMethod"; id: string; email: string; password: string };

export function register(entry: CleanupEntry): void {
  fs.mkdirSync(path.dirname(cleanupRegistryPath), { recursive: true });
  fs.appendFileSync(cleanupRegistryPath, JSON.stringify(entry) + "\n");
}

export function readAll(): CleanupEntry[] {
  if (!fs.existsSync(cleanupRegistryPath)) return [];

  return fs
    .readFileSync(cleanupRegistryPath, "utf-8")
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as CleanupEntry);
}

export function clear(): void {
  if (fs.existsSync(cleanupRegistryPath)) {
    fs.unlinkSync(cleanupRegistryPath);
  }
}
