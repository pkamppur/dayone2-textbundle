import fs from "fs";
import utimes from "utimes";

export default async (outputDir, entry) => {
  fs.writeFileSync(
    `${outputDir}/info.json`,
    JSON.stringify(
      {
        version: 2,
        type: "net.daringfireball.markdown",
        transient: true,
        creatorIdentifier: "org.dayoneexport.vendor",
        sourceURL: `dayone2://view?entryId=${entry.uuid}`,
      },
      null,
      2
    )
  );
  let text = entry.text;
  if (entry.attachments) {
    const assetsDir = `${outputDir}/assets`;
    fs.mkdirSync(assetsDir);
    entry.attachments.forEach((attachment) => {
      try {
        const data = fs.readFileSync(attachment.path, "binary");

        const assetFilePath = `${assetsDir}/${attachment.filename}`;
        fs.writeFileSync(assetFilePath, data, "binary");
      } catch (e) {
        console.log(
          `Missing attachment entry=${entry.uuid} attachment=${
            attachment.path
          }, error=${JSON.stringify(e)}, entry=${JSON.stringify(entry)}}`
        );
      }
      // update the references to the attachment
      text = text.replace(
        new RegExp(`!\\[(.*?)\\]\\(attachment:${attachment.uuid}\\)`, "g"),
        `![$1](assets/${attachment.filename})`
      );
    });
  }
  const textFilePath = `${outputDir}/text.md`;
  fs.writeFileSync(textFilePath, text);
  const createdAt = new Date(entry.createdAt).getTime() || undefined;
  const modifiedAt = new Date(entry.modifiedAt).getTime() || undefined;
  utimes.utimes(textFilePath, {
    btime: createdAt,
    mtime: modifiedAt,
  });
};
