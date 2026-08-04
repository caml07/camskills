#!/usr/bin/env node
/**
 * Package a skill directory into a .skill file (tar.gz).
 *
 * Usage:
 *   node package_skill.js ~/.config/opencode/skills/<name> --output ./<name>.skill
 */

const fs = require("fs");
const path = require("path");
const { createGzip } = require("zlib");
const { pipeline } = require("stream");
const { createWriteStream, createReadStream } = fs;

// Simple tar implementation without external deps
// Writes a tar.gz file

function addTarEntry(tarStream, filePath, arcName, callback) {
  const stats = fs.statSync(filePath);
  const isDir = stats.isDirectory();
  const size = isDir ? 0 : stats.size;
  const modTime = Math.floor(stats.mtime / 1000);

  // Tar header (512 bytes)
  const header = Buffer.alloc(512);
  const nameBuf = Buffer.from(arcName, "utf-8");
  nameBuf.copy(header, 0, 0, Math.min(nameBuf.length, 100));
  header.write("000644 ", 100, 7, "utf-8"); // mode
  header.write("000000 ", 108, 8, "utf-8"); // uid
  header.write("000000 ", 116, 8, "utf-8"); // gid
  const sizeStr = size.toString(8).padStart(11, "0");
  header.write(sizeStr, 124, 11, "utf-8"); // size
  const timeStr = modTime.toString(8).padStart(11, "0");
  header.write(timeStr, 136, 11, "utf-8"); // mtime
  header[156] = isDir ? 53 : 48; // type: '5' for dir, '0' for file

  // Calculate checksum
  let checksum = 0;
  for (let i = 0; i < 512; i++) checksum += header[i];
  const chkStr = checksum.toString(8).padStart(6, "0") + "\0 ";
  header.write(chkStr, 148, 8, "utf-8");

  tarStream.write(header);

  if (!isDir) {
    const data = fs.readFileSync(filePath);
    tarStream.write(data);
    // Pad to 512 boundary
    const pad = 512 - (size % 512 || 512);
    if (pad < 512) tarStream.write(Buffer.alloc(pad));
  }

  callback();
}

async function packageSkill(skillPath, outputPath) {
  const skillDir = path.resolve(skillPath);
  if (!fs.existsSync(path.join(skillDir, "SKILL.md"))) {
    console.error(`Error: SKILL.md not found in ${skillDir}`);
    process.exit(1);
  }

  const gzip = createGzip();
  const outStream = createWriteStream(outputPath);
  const tarStream = require("stream").PassThrough();

  pipeline(tarStream, gzip, outStream, (err) => {
    if (err) {
      console.error("Error packaging:", err.message);
      process.exit(1);
    }
  });

  // Collect files recursively
  function collectFiles(dir, base) {
    const entries = [];
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const arcName = path.join(base, item);
      if (fs.statSync(fullPath).isDirectory()) {
        entries.push({ fullPath, arcName, isDir: true });
        entries.push(...collectFiles(fullPath, arcName));
      } else {
        entries.push({ fullPath, arcName, isDir: false });
      }
    }
    return entries;
  }

  const baseName = path.basename(skillDir);
  const files = collectFiles(skillDir, baseName);

  // Add root directory
  const rootHeader = Buffer.alloc(512);
  const nameBuf = Buffer.from(baseName, "utf-8");
  nameBuf.copy(rootHeader, 0, 0, Math.min(nameBuf.length, 100));
  rootHeader.write("000755 ", 100, 7, "utf-8");
  rootHeader.write("000000 ", 108, 8, "utf-8");
  rootHeader.write("000000 ", 116, 8, "utf-8");
  rootHeader.write("00000000000", 124, 11, "utf-8");
  rootHeader.write("00000000000", 136, 11, "utf-8");
  rootHeader[156] = 53;
  let chk = 0;
  for (let i = 0; i < 512; i++) chk += rootHeader[i];
  rootHeader.write(chk.toString(8).padStart(6, "0") + "\0 ", 148, 8, "utf-8");
  tarStream.write(rootHeader);

  for (const file of files) {
    await new Promise((resolve) => addTarEntry(tarStream, file.fullPath, file.arcName, resolve));
  }

  // End with two zero blocks
  tarStream.end(Buffer.alloc(1024));

  await new Promise((resolve) => outStream.on("finish", resolve));
  const size = fs.statSync(outputPath).size;
  console.log(`Packaged ${skillDir} -> ${outputPath} (${(size / 1024).toFixed(1)} KB)`);
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error("Usage: package_skill.js <skill-path> --output <output.skill>");
    process.exit(1);
  }

  const skillPath = args[0];
  const outIdx = args.indexOf("--output");
  const outputPath = outIdx >= 0 && outIdx + 1 < args.length ? args[outIdx + 1] : `./${path.basename(skillPath)}.skill`;

  packageSkill(skillPath, outputPath);
}

main();
