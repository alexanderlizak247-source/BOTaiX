import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { deflateRawSync, crc32 } from "node:zlib";

const root = process.cwd();
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const name = `cinima-private-gallery-${pkg.version}`;
const include = ["src", "public", "package.json", "README.md", "start.bat", "start.sh"];

function walk(path) {
  if (!statSync(path).isDirectory()) return [path];
  return readdirSync(path).flatMap((entry) => walk(join(path, entry)));
}

const files = include.flatMap((entry) => walk(join(root, entry)));
const chunks = [];
const central = [];
let offset = 0;

for (const file of files) {
  const entryName = `${name}/${relative(root, file).split(sep).join("/")}`;
  const nameBuf = Buffer.from(entryName);
  const data = readFileSync(file);
  const comp = deflateRawSync(data);
  const crc = crc32(data) >>> 0;

  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(20, 4);
  local.writeUInt16LE(0x0800, 6);
  local.writeUInt16LE(8, 8);
  local.writeUInt32LE(crc, 14);
  local.writeUInt32LE(comp.length, 18);
  local.writeUInt32LE(data.length, 22);
  local.writeUInt16LE(nameBuf.length, 26);

  const cen = Buffer.alloc(46);
  cen.writeUInt32LE(0x02014b50, 0);
  cen.writeUInt16LE(20, 4);
  cen.writeUInt16LE(20, 6);
  cen.writeUInt16LE(0x0800, 8);
  cen.writeUInt16LE(8, 10);
  cen.writeUInt32LE(crc, 16);
  cen.writeUInt32LE(comp.length, 20);
  cen.writeUInt32LE(data.length, 24);
  cen.writeUInt16LE(nameBuf.length, 28);
  cen.writeUInt32LE(offset, 42);

  chunks.push(local, nameBuf, comp);
  central.push(cen, nameBuf);
  offset += 30 + nameBuf.length + comp.length;
}

const centralBuf = Buffer.concat(central);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0);
end.writeUInt16LE(files.length, 8);
end.writeUInt16LE(files.length, 10);
end.writeUInt32LE(centralBuf.length, 12);
end.writeUInt32LE(offset, 16);

mkdirSync(join(root, "dist"), { recursive: true });
const out = join(root, "dist", `${name}.zip`);
writeFileSync(out, Buffer.concat([...chunks, centralBuf, end]));
console.log(`Created ${out} (${files.length} files)`);
