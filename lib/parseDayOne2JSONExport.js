import fs from "fs";
import path from "path";
import parseDayOne2JSONExportEntry from "./parseDayOne2JSONExportEntry.js";

export default async (pathToDayOne2ExportJSON) => {
  const rawJSON = fs.readFileSync(pathToDayOne2ExportJSON, "utf8");
  if (!rawJSON) throw new Error("Failed to read " + pathToDayOne2ExportJSON);
  const data = JSON.parse(rawJSON);
  const attachmentsPath = path.dirname(pathToDayOne2ExportJSON);
  const entries = [];
  const entriesWithErrors = [];
  data.entries.forEach((rawEntry) => {
    try {
      const entry = parseDayOne2JSONExportEntry(rawEntry);
      entry.attachments?.forEach((attachment) => {
        attachment.path = path.join(
          attachmentsPath,
          attachment.relativeSourcePath
        );
      });
      entries.push(entry);
    } catch (e) {
      entriesWithErrors.push({
        error: e.message,
        rawEntry,
      });
    }
  });
  return {
    entries,
    entriesWithErrors,
  };
};
