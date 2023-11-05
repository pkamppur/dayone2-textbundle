import fs from "fs";
import writeTextBundleFiles from "./textbundle/writeTextBundle.js";
import filenamify from "filenamify";

export default async (inputPaths, outputPath, journalName) => {
  const logs = {
    parser: {},
    converter: {
      numberOfTextBundlesWritten: 0,
      filesErrors: [],
    },
  };

  let entries = [];
  let photos = [];
  let pdfs = [];
  let entriesWithErrors = [];

  inputPaths.forEach((inputPath) => {
    let entry = {};

    entry.text = fs.readFileSync(inputPath + "/text.md", "utf8");

    const pdfRegex =
      /!\[(.*?)\.pdf\]\(assets\/(.+?)\.pdf\)(<!-- {"embed":"true", "preview":"true"} -->)?/g;
    const pdfMatches = [...entry.text.matchAll(pdfRegex)];
    pdfMatches.forEach((match) => {
      const wholeMatch = match[0];
      const uuid = match[1];
      const md5 = match[2];

      pdfs.push({ name: `${md5}.pdf`, source: inputPath });

      entry.text = entry.text.replace(
        wholeMatch,
        `![](dayone-moment:/pdfAttachment/${uuid})`
      );

      if (entry.pdfAttachments === undefined) {
        entry.pdfAttachments = [];
      }

      entry.pdfAttachments.push({
        type: "pdf",
        identifier: uuid,
        md5,
        pdfName: uuid,
      });
    });

    const photoRegex = /!\[(.*?)\]\(assets\/(.+?)\)/g;
    const photoMatches = [...entry.text.matchAll(photoRegex)];
    photoMatches.forEach((match) => {
      const wholeMatch = match[0];
      const filename = match[2];
      const filetype = filename.split(".")[1];
      const md5 = filename.split(".")[0];

      photos.push({ name: filename, source: inputPath });

      entry.text = entry.text.replace(
        wholeMatch,
        `![](dayone-moment://${md5})`
      );

      if (entry.photos === undefined) {
        entry.photos = [];
      }

      entry.photos.push({
        type: filetype,
        identifier: md5,
        md5,
        orderInEntry: entry.photos.length,
      });
    });

    const stats = fs.statSync(inputPath);

    entry.modifiedDate = stats.mtime.toISOString().replace(".000", "");
    entry.creationDate = stats.birthtime.toISOString().replace(".000", "");

    entries.push(entry);
  });

  logs.converter.numberOfTextBundlesWritten = entries.length;

  logs.parser.numberOfEntries = entries.length;
  logs.parser.numberOfEntriesWithErrors = entriesWithErrors.length;
  logs.parser.entriesErrors = entriesWithErrors.map((entryWithError) => {
    return `${entryWithError.error} ${entryWithError.rawEntry.uuid} ${
      (entryWithError.rawEntry.attachments || []).length
    }`;
  });

  const journal = {
    metadata: {
      version: "1.0",
    },
    entries,
  };

  fs.writeFileSync(
    outputPath + "/" + journalName,
    JSON.stringify(journal, null, 2)
  );

  if (pdfs.length > 0) {
    const pdfsTargetDir = `${outputPath}/pdfs`;
    fs.mkdirSync(pdfsTargetDir);

    pdfs.forEach((pdf) => {
      const src = `${pdf.source}/assets/${pdf.name}`;
      fs.copyFileSync(src, `${pdfsTargetDir}/${pdf.name}`);
    });
  }

  if (photos.length > 0) {
    const photosTargetDir = `${outputPath}/photos`;
    fs.mkdirSync(photosTargetDir);

    photos.forEach((photo) => {
      const src = `${photo.source}/assets/${photo.name}`;
      fs.copyFileSync(src, `${photosTargetDir}/${photo.name}`);
    });
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
    return null;
  }
};
