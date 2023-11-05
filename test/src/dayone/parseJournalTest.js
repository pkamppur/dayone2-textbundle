import assert from "assert";
import path from "path";
import parseJournal from "../../../src/dayone/parseJournal.js";
import { URL } from "url";

const __dirname = new URL(".", import.meta.url).pathname;

describe("parseJournal", () => {
  describe("normal", () => {
    it("returns", async () => {
      const data = await parseJournal(
        __dirname + "/../../assets/DayOne2JSONExport/demo.json"
      );
      assert.deepEqual(data, {
        entries: [
          {
            text: "# Initial entry\n\nsome text\n\n![](attachment:D3456FD591A34C098719F1A0E6C46829)",
            title: "Initial entry",
            createdAt: "2019-03-18T13:04:56Z",
            modifiedAt: "2019-03-26T21:48:44Z",
            uuid: "F4CF0509F3EA47D1B56F95D37F165F5E",
            attachments: [
              {
                uuid: "D3456FD591A34C098719F1A0E6C46829",
                filename: "cf80411fda6ba991b6110b2365fb8286.jpeg",
                relativeSourcePath:
                  "photos/cf80411fda6ba991b6110b2365fb8286.jpeg",
                path:
                  path.normalize(
                    __dirname + "/../../assets/DayOne2JSONExport/photos/"
                  ) + "cf80411fda6ba991b6110b2365fb8286.jpeg",
              },
            ],
          },
          {
            title: "Second entry",
            createdAt: "2010-02-26T21:44:20Z",
            modifiedAt: "2010-03-26T21:48:55Z",
            text: "# Second entry\n\nsome text",
            uuid: "6BD0AE9E21C447A6BC504A63899BA543",
          },
          {
            createdAt: "2010-02-27T21:14:20Z",
            modifiedAt: "2010-03-27T21:58:55Z",
            text: "# Third entry with double escapes\n\ndouble escape a/b dot. single escape slash/",
            title: "Third entry with double escapes",
            uuid: "6BD0AE9E21C447A6BC504A63899BC544",
          },
          {
            text: 'Fourth Test Journal Entry\nThis entry contains a PDF file.\n\n![0E4BD5DF4D8A4835B3BA3A53F31CE1AD.pdf](assets/2f1c651de5d167db3d62dc260925fa9c.pdf)<!-- {"embed":"true", "preview":"true"} -->\n\nContent continues here after the PDF.',
            title: "Fourth Test Journal Entry",
            createdAt: "2023-11-04T18:45:27Z",
            modifiedAt: "2023-11-04T18:45:44Z",
            uuid: "DFE9217ECAD140A49006530651446773",
            attachments: [
              {
                uuid: "0E4BD5DF4D8A4835B3BA3A53F31CE1AD",
                filename: "2f1c651de5d167db3d62dc260925fa9c.pdf",
                relativeSourcePath: "pdfs/2f1c651de5d167db3d62dc260925fa9c.pdf",
                path:
                  path.normalize(
                    __dirname + "/../../assets/DayOne2JSONExport/pdfs/"
                  ) + "2f1c651de5d167db3d62dc260925fa9c.pdf",
              },
            ],
          },
        ],
        entriesWithErrors: [
          {
            error: "Missing #text property",
            rawEntry: {
              creationDate: "2011-03-26T21:44:20Z",
              creationDevice: "bsingr-2018",
              creationDeviceModel: "MacBookPro15,1",
              creationDeviceType: "MacBook Pro",
              creationOSName: "macOS",
              creationOSVersion: "10.14.3",
              duration: 0,
              modifiedDate: "2011-03-26T21:48:55Z",
              starred: false,
              timeZone: "Europe/Berlin",
              uuid: "6BD0AE9E21C447A6BC504A63899BA544",
            },
          },
        ],
      });
    });
  });
});
