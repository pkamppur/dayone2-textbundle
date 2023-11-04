import fs from "fs";
import parseDayOne2JSONExport from "./dayone/parseJournal.js";
import buildTextPackZip from "./textbundle/buildTextPackZip.js";
import writeTextBundleFiles from "./textbundle/writeTextBundle.js";
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
    let outputEntry;
    if (options?.format === "textbundle") {
      outputEntry = await writeTextBundle(outputPath, entry, logs);
    } else {
      outputEntry = await writeTextPackZip(outputPath, entry, logs);
    }

    try {
      const createdAt = new Date(entry.createdAt).getTime() || undefined;
      const modifiedAt = new Date(entry.modifiedAt).getTime() || undefined;
      const accessedAt = undefined;
      await setUtimes(outputEntry, createdAt, modifiedAt, accessedAt);
    } catch (error) {
      logs.converter.filesErrors.push(
        new Error(`Failed to set utimes on ${outputEntry} ${error}`)
      );
    }
  }
  return logs;
};

const writeTextBundle = async (outputPath, entry, logs) => {
  const outputDirPath = `${outputPath}/${filenamify(entry.title)}.${
    entry.uuid
  }.textbundle`;

  try {
    fs.mkdirSync(outputDirPath);
    await writeTextBundleFiles(outputDirPath, entry);

    logs.converter.numberOfTextBundlesWritten += 1;

    return outputDirPath;
  } catch (error) {
    logs.converter.filesErrors.push(
      new Error(`Failed to write TextBundle ${outputDirPath} ${error}`)
    );
  }
};

const writeTextPackZip = async (outputPath, entry, logs) => {
  const outputFilePath = `${outputPath}/${filenamify(entry.title)}.${
    entry.uuid
  }.textpack`;

  try {
    const zip = buildTextPackZip(entry);
    const data = await zip.generateAsync({ type: "nodebuffer" });
    fs.writeFileSync(outputFilePath, data);
    logs.converter.numberOfTextBundlesWritten += 1;
    return outputFilePath;
  } catch (error) {
    logs.converter.filesErrors.push(
      new Error(`Failed to write TextBundle ${outputFilePath} ${error}`)
    );
    return null;
  }
};
