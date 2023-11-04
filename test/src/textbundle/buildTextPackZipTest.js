import assert from "assert";
import fs from "fs";
import path from "path";
import buildTextPackZip from "../../../src/textbundle/buildTextPackZip.js";
import { URL } from "url";

const __dirname = new URL(".", import.meta.url).pathname;

describe("buildTextPackZip", () => {
  describe("normal", () => {
    it("returns", async () => {
      const zip = buildTextPackZip({
        uuid: "65A6F350C04E496DB775971441E41FBA",
        text: "# Foo",
      });
      const infoJSON = await zip.file("info.json").async("string");
      assert.deepEqual(JSON.parse(infoJSON), {
        version: 2,
        type: "net.daringfireball.markdown",
        transient: true,
        creatorIdentifier: "org.dayoneexport.vendor",
        sourceURL: "dayone2://view?entryId=65A6F350C04E496DB775971441E41FBA",
      });
      const text = await zip.file("text.md").async("string");
      assert.deepEqual(text, "# Foo");
    });
  });

  describe("with attachments", () => {
    it("returns", async () => {
      const zip = buildTextPackZip({
        uuid: "65A6F350C04E496DB775971441E41FBA",
        text: "# Foo\n![](attachment:D3456FD591A34C098719F1A0E6C46829)",
        attachments: [
          {
            uuid: "D3456FD591A34C098719F1A0E6C46829",
            filename: "cf80411fda6ba991b6110b2365fb8286.jpeg",
            path:
              path.normalize(
                __dirname + "/../../assets/DayOne2JSONExport/photos/"
              ) + "cf80411fda6ba991b6110b2365fb8286.jpeg",
          },
        ],
      });
      const infoJSON = await zip.file("info.json").async("string");
      assert.deepEqual(JSON.parse(infoJSON), {
        version: 2,
        type: "net.daringfireball.markdown",
        transient: true,
        creatorIdentifier: "org.dayoneexport.vendor",
        sourceURL: "dayone2://view?entryId=65A6F350C04E496DB775971441E41FBA",
      });
      assert.deepEqual(
        await zip.file("text.md").async("string"),
        "# Foo\n![](assets/cf80411fda6ba991b6110b2365fb8286.jpeg)"
      );

      const attachmentPath =
        path.normalize(__dirname + "/../../assets/DayOne2JSONExport/photos/") +
        "cf80411fda6ba991b6110b2365fb8286.jpeg";
      assert.deepEqual(
        await zip
          .file("assets/cf80411fda6ba991b6110b2365fb8286.jpeg")
          .async("string"),
        fs.readFileSync(attachmentPath, "utf8")
      );
    });
  });
});
