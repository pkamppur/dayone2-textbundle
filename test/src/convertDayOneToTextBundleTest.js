import assert from "assert";
import convertDayOneToTextBundle from "../../src/convertDayOneToTextBundle.js";
import { rimraf } from "rimraf";
import fs from "fs";
import { URL } from "url";

const __dirname = new URL(".", import.meta.url).pathname;

describe("convertDayOneToTextBundle", () => {
  describe("normal", () => {
    it("creates files with proper names, timestamps and contents", async () => {
      // convert
      const targetDir = "./test/tmp/convertDayOneToTextBundle";
      const expectedContentsDir = __dirname + "/../assets/TextBundles";
      rimraf.sync(targetDir);
      fs.mkdirSync(targetDir);
      const logs = await convertDayOneToTextBundle(
        __dirname + "/../assets/DayOne2JSONExport/demo.json",
        targetDir,
        { format: "textbundle" }
      );

      // check logs
      assert.deepEqual(logs, {
        converter: {
          numberOfTextBundlesWritten: 4,
          filesErrors: [],
        },
        parser: {
          entriesErrors: [
            "Missing #text property 6BD0AE9E21C447A6BC504A63899BA544 0",
          ],
          numberOfEntries: 4,
          numberOfEntriesWithErrors: 1,
        },
      });

      /*
       * file timestamps are correctly set
       * note: this can only be fully tested on macOS, where birthtime is fully supported
       */
      const statSubset = ({ birthtime, mtime }) => {
        if (process.platform === "darwin") {
          return { birthtime, mtime };
        }
        return { mtime };
      };

      assertEqualityOfFolders(expectedContentsDir, targetDir, statSubset);
    });
  });
});

const assertEqualityOfFolders = (
  expectedContentsDir,
  targetDir,
  statSubset
) => {
  const files = fs.readdirSync(expectedContentsDir);

  files.forEach((file) => {
    if (file.charAt(0) == ".") {
      return;
    }

    const expectedFilePath = `${expectedContentsDir}/${file}`;
    const resultFilePath = `${targetDir}/${file}`;

    //if (file !== "assets" || !file.endsWith("pdf") || !file.endsWith("jpeg")) {
    if (file.endsWith(".textbundle") || file.endsWith(".md")) {
      assert.deepEqual(
        statSubset(fs.statSync(expectedFilePath)),
        statSubset(fs.statSync(resultFilePath))
      );
    }

    if (fs.lstatSync(expectedFilePath).isDirectory()) {
      assertEqualityOfFolders(expectedFilePath, resultFilePath, statSubset);
    } else {
      const expectedData = fs.readFileSync(expectedFilePath, "binary");
      const resultData = fs.readFileSync(resultFilePath, "binary");

      assert.deepEqual(resultData, expectedData);
    }
  });
};
