import fs from "fs";
import path from "path";
import parseDayOne2JSONExportEntry from "./parseDayOne2JSONExportEntry.js";

export default async (pathToDayOne2ExportJSON) => {
  const rawJSON = fs.readFileSync(pathToDayOne2ExportJSON, "utf8");
  if (!rawJSON) throw new Error("Failed to read " + pathToDayOne2ExportJSON);
  const data = JSON.parse(rawJSON);
  const attachmentsPath = path.join(
    path.dirname(pathToDayOne2ExportJSON),
    "photos"
  );
  const entries = [];
  const entriesWithErrors = [];
  data.entries.forEach((rawEntry) => {
    try {
      const entry = parseDayOne2JSONExportEntry(rawEntry);
      if (entry.attachments) {
        entry.attachments.forEach((attachment) => {
          attachment.path = path.join(attachmentsPath, attachment.filename);
        });
      }
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
