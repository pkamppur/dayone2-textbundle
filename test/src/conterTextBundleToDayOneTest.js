import assert from "assert";
import conterTextBundleToDayOne from "../../src/conterTextBundleToDayOne.js";
import { rimraf } from "rimraf";
import fs from "fs";
import { URL } from "url";

const __dirname = new URL(".", import.meta.url).pathname;

describe("conterTextBundleToDayOne", () => {
  describe("normal", () => {
    it("creates files with proper names, timestamps and contents", async () => {
      // convert
      const targetDir = "./test/tmp/conterTextBundleToDayOne";
      const expectedContentsDir =
        __dirname + "/../assets/TextBundlesToDayOneConversion";

      rimraf.sync(targetDir);
      fs.mkdirSync(targetDir);

      const inputFilesDir = __dirname + "../assets/TextBundles";
      const logs = await conterTextBundleToDayOne(
        fs
          .readdirSync(inputFilesDir)
          .map((filename) => `${inputFilesDir}/${filename}`),
        targetDir,
        "demo.json"
      );

      assertEqualityOfFolders(expectedContentsDir, targetDir);

      // check logs
      assert.deepEqual(logs, {
        converter: {
          numberOfTextBundlesWritten: 4,
          filesErrors: [],
        },
        parser: {
          entriesErrors: [],
          numberOfEntries: 4,
          numberOfEntriesWithErrors: 0,
        },
      });
    });
  });
});

const assertEqualityOfFolders = (expectedContentsDir, targetDir) => {
  const files = fs.readdirSync(expectedContentsDir);

  files.forEach((file) => {
    if (file.charAt(0) == ".") {
      return;
    }

    const expectedFilePath = `${expectedContentsDir}/${file}`;
    const resultFilePath = `${targetDir}/${file}`;

    if (fs.lstatSync(expectedFilePath).isDirectory()) {
      assertEqualityOfFolders(expectedFilePath, resultFilePath);
    } else {
      const expectedData = fs.readFileSync(expectedFilePath, "binary");
      const resultData = fs.readFileSync(resultFilePath, "binary");

      assert.deepEqual(resultData, expectedData);
    }
  });
};
