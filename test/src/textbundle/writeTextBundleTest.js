import assert from "assert";
import fs from "fs";
import path from "path";
import writeTextBundle from "../../../src/textbundle/writeTextBundle.js";
import { rimraf } from "rimraf";
import { URL } from "url";

const __dirname = new URL(".", import.meta.url).pathname;
const testSuitePath = `${__dirname}../../tmp/writeTextBundle`;

describe("writeTextBundle", () => {
  before(() => {
    rimraf.sync(testSuitePath);
    fs.mkdirSync(testSuitePath);
  });

  describe("normal", () => {
    it("returns", async () => {
      const targetDir = `${testSuitePath}/normal`;
      rimraf.sync(targetDir);
      fs.mkdirSync(targetDir);

      writeTextBundle(targetDir, {
        uuid: "65A6F350C04E496DB775971441E41FBA",
        text: "# Foo",
      });

      const infoJSON = fs.readFileSync(`${targetDir}/info.json`);
      assert.deepEqual(JSON.parse(infoJSON), {
        version: 2,
        type: "net.daringfireball.markdown",
        transient: true,
        creatorIdentifier: "org.dayoneexport.vendor",
        sourceURL: "dayone2://view?entryId=65A6F350C04E496DB775971441E41FBA",
      });
      const text = fs.readFileSync(`${targetDir}/text.md`, "utf8");
      assert.deepEqual(text, "# Foo");
    });
  });

  describe("with attachments", () => {
    it("returns", async () => {
      const targetDir = `${testSuitePath}/with-attachments`;
      rimraf.sync(targetDir);
      fs.mkdirSync(targetDir);

      writeTextBundle(targetDir, {
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

      const infoJSON = fs.readFileSync(`${targetDir}/info.json`);
      assert.deepEqual(JSON.parse(infoJSON), {
        version: 2,
        type: "net.daringfireball.markdown",
        transient: true,
        creatorIdentifier: "org.dayoneexport.vendor",
        sourceURL: "dayone2://view?entryId=65A6F350C04E496DB775971441E41FBA",
      });
      const text = fs.readFileSync(`${targetDir}/text.md`, "utf8");
      assert.deepEqual(
        text,
        "# Foo\n![](assets/cf80411fda6ba991b6110b2365fb8286.jpeg)"
      );

      const attachmentPath =
        path.normalize(__dirname + "/../../assets/DayOne2JSONExport/photos/") +
        "cf80411fda6ba991b6110b2365fb8286.jpeg";
      const attachmentData = fs.readFileSync(
        `${targetDir}/assets/cf80411fda6ba991b6110b2365fb8286.jpeg`,
        "utf8"
      );
      assert.deepEqual(attachmentData, fs.readFileSync(attachmentPath, "utf8"));
    });
  });
});
