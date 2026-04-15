import { cp, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const source = resolve(root, "content");
const target = resolve(root, "dist", "content");

await mkdir(target, { recursive: true });
await cp(source, target, { recursive: true });
