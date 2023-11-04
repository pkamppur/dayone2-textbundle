export default (rawEntry) => {
  if (!rawEntry.text) throw new Error("Missing #text property");
  const entry = {};
  if (rawEntry.text) {
    entry.text = rawEntry.text;

    // replace double-escaped symbols
    entry.text = entry.text.replace(
      /\\([\\/.+-?![\](){}><±~`#$%^&*_=:;'"@°§,])/g,
      "$1"
    );

    // replace dayone moments (pdf) with embedded attachments
    entry.text = entry.text.replace(
      /!\[(.*?)\]\(dayone-moment:\/pdfAttachment\/(.+?)\)/g,
      '[$2.pdf](assets/$2.pdf)<!-- {"embed":"true", "preview":"true"} -->'
    );

    // replace dayone moments (photos) with embedded attachments
    entry.text = entry.text.replace(
      /!\[(.*?)\]\(dayone-moment:\/\/(.+?)\)/g,
      "![$1](attachment:$2)"
    );

    /*
     * try to extract a meaningful title from the text first line
     * remove attachments from text, but keep their names if present
     */
    const textWithoutLinksOrAttachments = rawEntry.text.replace(
      /!?\[(.*?)\]\((.+?)\)/g,
      "$1"
    );
    const titleMatch = textWithoutLinksOrAttachments.match(
      /\s*(?<title>[^\n]+)\n*/
    );
    let titleCandidate = "";
    if (titleMatch && titleMatch.groups && titleMatch.groups.title) {
      titleCandidate = titleMatch.groups.title.replace(/^[#\s]*/, "").trim();
    }
    if (titleCandidate && titleCandidate.length > 0) {
      entry.title = titleCandidate;

      /*
       * entry text is pure image -> set title to image title, fallback is location name (asuming it's the photo location)
       * and also set a text, because image-only entry is not supported in typical notes editors
       */
    } else if (rawEntry.text.match(/!\[\s*\]\(.+?\)/)) {
      if (rawEntry.location && rawEntry.location.localityName) {
        entry.title = `Photo ${[
          rawEntry.location.localityName,
          rawEntry.location.placeName,
        ].join(", ")}`;
        entry.text = `${entry.title}\n${entry.text}`;
      } else {
        entry.title = "Untitled Photo";
        entry.text = `${entry.title}\n${entry.text}`;
      }
    } else if (rawEntry.text.match(/\[\s*\]\(.+?\)/)) {
      entry.title = "Untitled Link";
      entry.text = `${entry.title}\n${entry.text}`;
    } else {
      throw new Error(
        `Cannot parse title for content >>>>>>>>>${rawEntry.text}<<<<<<<<<`
      );
    }
  }
  if (rawEntry.uuid) entry.uuid = rawEntry.uuid;
  if (rawEntry.tags) entry.tags = rawEntry.tags;
  if (rawEntry.creationDate) entry.createdAt = rawEntry.creationDate;
  if (rawEntry.modifiedDate) entry.modifiedAt = rawEntry.modifiedDate;
  if (rawEntry.photos || rawEntry.pdfAttachments) {
    entry.attachments = [];
  }
  if (rawEntry.photos) {
    rawEntry.photos.map((rawEntryPhoto) => {
      const filename = `${rawEntryPhoto.md5}.${rawEntryPhoto.type}`;
      const photo = {
        uuid: rawEntryPhoto.identifier,
        relativeSourcePath: `photos/${filename}`,
        filename,
      };
      entry.attachments.push(photo);
    });
  }
  if (rawEntry.pdfAttachments) {
    rawEntry.pdfAttachments.map((rawEntryPdf) => {
      const filename = `${rawEntryPdf.md5}.${rawEntryPdf.type}`;
      const pdf = {
        uuid: rawEntryPdf.identifier,
        relativeSourcePath: `pdfs/${filename}`,
        filename,
      };
      entry.attachments.push(pdf);

      entry.text = entry.text.replace(
        /\[(.*?)\.pdf\]\(assets\/(.+?)\.pdf\)/g,
        `[$1.pdf](assets/${rawEntryPdf.md5}.pdf)`
      );
    });
  }
  return entry;
};
