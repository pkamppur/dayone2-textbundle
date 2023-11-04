import fs from "fs";
import parseDayOne2JSONExport from "./parseDayOne2JSONExport.js";
import buildTextBundleZip from "./buildTextBundleZip.js";
import writeTextBundleFiles from "./writeTextBundleFiles.js";
import filenamify from "filenamify";
import utimes from "utimes";

// note: createdAt can't be set on linux, only on macOS/win
const setUtimes = async (path, createdAt, modifiedAt, accessedAt) => {
  await utimes.utimes(path, {
    btime: createdAt,
    mtime: modifiedAt,
    atime: accessedAt,
  });
};

export default async (inputPath, outputPath, options) => {
  const logs = {
    parser: {},
    converter: {
      numberOfTextBundlesWritten: 0,
      filesErrors: [],
    },
  };
  const dayOne2JSONExport = await parseDayOne2JSONExport(inputPath);
  logs.parser.numberOfEntries = dayOne2JSONExport.entries.length;
  logs.parser.numberOfEntriesWithErrors =
    dayOne2JSONExport.entriesWithErrors.length;
  logs.parser.entriesErrors = dayOne2JSONExport.entriesWithErrors.map(
    (entryWithError) => {
      return `${entryWithError.error} ${entryWithError.rawEntry.uuid} ${
        (entryWithError.rawEntry.attachments || []).length
      }`;
    }
  );
  for (const entry of dayOne2JSONExport.entries) {
    if (options.format === "textbundle") {
      const outputDirPath = `${outputPath}/${filenamify(entry.title)}.${
        entry.uuid
      }.textbundle`;
      try {
        fs.mkdirSync(outputDirPath);
        await writeTextBundleFiles(outputDirPath, entry);

        logs.converter.numberOfTextBundlesWritten += 1;
        try {
          const createdAt = new Date(entry.createdAt).getTime() || undefined;
          const modifiedAt = new Date(entry.modifiedAt).getTime() || undefined;
          const accessedAt = undefined;
          await setUtimes(outputDirPath, createdAt, modifiedAt, accessedAt);
        } catch (error) {
          logs.converter.filesErrors.push(
            new Error(`Failed to set utimes on ${outputDirPath} ${error}`)
          );
        }
      } catch (error) {
        logs.converter.filesErrors.push(
          new Error(`Failed to write TextBundle ${outputDirPath} ${error}`)
        );
      }
    } else {
      const outputFilePath = `${outputPath}/${filenamify(entry.title)}.${
        entry.uuid
      }.textpack`;
      try {
        const zip = buildTextBundleZip(entry);
        const data = await zip.generateAsync({ type: "nodebuffer" });
        fs.writeFileSync(outputFilePath, data);
        logs.converter.numberOfTextBundlesWritten += 1;
        try {
          const createdAt = new Date(entry.createdAt).getTime() || undefined;
          const modifiedAt = new Date(entry.modifiedAt).getTime() || undefined;
          const accessedAt = undefined;
          await setUtimes(outputFilePath, createdAt, modifiedAt, accessedAt);
        } catch (error) {
          logs.converter.filesErrors.push(
            new Error(`Failed to set utimes on ${outputFilePath} ${error}`)
          );
        }
      } catch (error) {
        logs.converter.filesErrors.push(
          new Error(`Failed to write TextBundle ${outputFilePath} ${error}`)
        );
      }
    }
  }
  return logs;
};
