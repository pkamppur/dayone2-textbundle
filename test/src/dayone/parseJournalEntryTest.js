import assert from "assert";
import parseDayOne2JSONExportEntry from "../../../src/dayone/parseJournalEntry.js";

describe("parseDayOne2JSONExportEntry", () => {
  describe("normal", () => {
    it("returns", () => {
      assert.deepEqual(parseDayOne2JSONExportEntry(examplEntries.normal), {
        uuid: "65A6F350C04E496DB775971441E41FBA",
        createdAt: "2018-12-06T21:04:39Z",
        modifiedAt: "2018-12-06T21:05:56Z",
        text: "# Foo\nBar\n",
        title: "Foo",
        tags: ["foo", "bar"],
      });
    });
  });

  describe("special text escape", () => {
    it("returns", () => {
      assert.deepEqual(
        parseDayOne2JSONExportEntry({
          text: "\\. \\, \\\\ \\/ \\+ \\- \\( \\) \\[ \\] \\{ \\} \\> \\< \\± \\~ \\` \\# \\$ \\% \\^ \\& \\* \\_ \\= \\: \\; \\' \\\" \\? \\! \\@ \\° \\§",
        }).text,
        ". , \\ / + - ( ) [ ] { } > < ± ~ ` # $ % ^ & * _ = : ; ' \" ? ! @ ° §"
      );

      assert.deepEqual(
        parseDayOne2JSONExportEntry({
          text: "https:\\/\\/example.com\\/foo\\/bar",
        }).text,
        "https://example.com/foo/bar"
      );

      assert.deepEqual(
        parseDayOne2JSONExportEntry({
          text: "https:\\/\\/example\\.com\\/foo\\/bar",
        }).text,
        "https://example.com/foo/bar"
      );
    });
  });

  describe("special title", () => {
    it("returns", () => {
      assert.deepEqual(
        parseDayOne2JSONExportEntry({
          text: " \n \n \t # Foo \nBar",
        }).title,
        "Foo"
      );

      assert.deepEqual(
        parseDayOne2JSONExportEntry({
          text: " \n \n \t ## Foo \nBar",
        }).title,
        "Foo"
      );

      assert.deepEqual(
        parseDayOne2JSONExportEntry({
          text: "Foo \nBar",
        }).title,
        "Foo"
      );

      assert.deepEqual(
        parseDayOne2JSONExportEntry({
          text: "Foo \n",
        }).title,
        "Foo"
      );

      assert.deepEqual(
        parseDayOne2JSONExportEntry({
          text: "Foo",
        }).title,
        "Foo"
      );

      assert.deepEqual(
        parseDayOne2JSONExportEntry({
          text: "![](dayone-moment://2D886F84A1BF4A34B2F0396AF109F86F)\n\n# Foo \n Bar",
        }).title,
        "Foo"
      );

      assert.deepEqual(
        parseDayOne2JSONExportEntry({
          text: "![](dayone-moment://2D886F84A1BF4A34B2F0396AF109F86F)\n\n Foo \nBar",
        }).title,
        "Foo"
      );

      assert.deepEqual(
        parseDayOne2JSONExportEntry({
          text: "![ Foo Lala  ](dayone-moment://2D886F84A1BF4A34B2F0396AF109F86F)\n\n Foo \nBar",
        }).title,
        "Foo Lala"
      );

      assert.deepEqual(
        parseDayOne2JSONExportEntry({
          text: "[](dayone-moment://2D886F84A1BF4A34B2F0396AF109F86F)\n\n# Foo \n Bar",
        }).title,
        "Foo"
      );

      assert.deepEqual(
        parseDayOne2JSONExportEntry({
          text: "[](dayone-moment://2D886F84A1BF4A34B2F0396AF109F86F)\n\n Foo \nBar",
        }).title,
        "Foo"
      );

      assert.deepEqual(
        parseDayOne2JSONExportEntry({
          text: "[ Foo Lala ](dayone-moment://2D886F84A1BF4A34B2F0396AF109F86F)\n\n Foo \nBar",
        }).title,
        "Foo Lala"
      );

      assert.deepEqual(
        parseDayOne2JSONExportEntry({
          text: "[](dayone-moment://2D886F84A1BF4A34B2F0396AF109F86F)\n",
        }).title,
        "Untitled Link"
      );

      assert.deepEqual(
        parseDayOne2JSONExportEntry({
          text: "[ ](dayone-moment://2D886F84A1BF4A34B2F0396AF109F86F)\n",
        }).title,
        "Untitled Link"
      );

      assert.deepEqual(
        parseDayOne2JSONExportEntry({
          text: "![](dayone-moment://2D886F84A1BF4A34B2F0396AF109F86F)\n",
        }).title,
        "Untitled Photo"
      );

      assert.deepEqual(
        parseDayOne2JSONExportEntry({
          text: "![ ](dayone-moment://2D886F84A1BF4A34B2F0396AF109F86F)\n",
        }).title,
        "Untitled Photo"
      );

      assert.deepEqual(
        parseDayOne2JSONExportEntry({
          text: "![](dayone-moment://2D886F84A1BF4A34B2F0396AF109F86F)\n",
          location: {
            localityName: "Erlenbach",
            placeName: "Seestrasse",
          },
        }).title,
        "Photo Erlenbach, Seestrasse"
      );
    });
  });

  describe("title as text", () => {
    it("returns", () => {
      assert.deepEqual(
        parseDayOne2JSONExportEntry({
          text: "[](dayone-moment://2D886F84A1BF4A34B2F0396AF109F86F)\n",
        }).text,
        "Untitled Link\n[](dayone-moment://2D886F84A1BF4A34B2F0396AF109F86F)\n"
      );

      assert.deepEqual(
        parseDayOne2JSONExportEntry({
          text: "[ ](dayone-moment://2D886F84A1BF4A34B2F0396AF109F86F)\n",
        }).text,
        "Untitled Link\n[ ](dayone-moment://2D886F84A1BF4A34B2F0396AF109F86F)\n"
      );

      assert.deepEqual(
        parseDayOne2JSONExportEntry({
          text: "![](dayone-moment://2D886F84A1BF4A34B2F0396AF109F86F)\n",
        }).text,
        "Untitled Photo\n![](attachment:2D886F84A1BF4A34B2F0396AF109F86F)\n"
      );

      assert.deepEqual(
        parseDayOne2JSONExportEntry({
          text: "![ ](dayone-moment://2D886F84A1BF4A34B2F0396AF109F86F)\n",
        }).text,
        "Untitled Photo\n![ ](attachment:2D886F84A1BF4A34B2F0396AF109F86F)\n"
      );

      assert.deepEqual(
        parseDayOne2JSONExportEntry({
          text: "![](dayone-moment://2D886F84A1BF4A34B2F0396AF109F86F)\n",
          location: {
            localityName: "Erlenbach",
            placeName: "Seestrasse",
          },
        }).text,
        "Photo Erlenbach, Seestrasse\n![](attachment:2D886F84A1BF4A34B2F0396AF109F86F)\n"
      );
    });
  });

  describe("attachmentImages", () => {
    it("returns", () => {
      assert.deepEqual(
        parseDayOne2JSONExportEntry(examplEntries.attachmentImages),
        {
          uuid: "6D9C3106A32C4E829BB880E719150907",
          text: "# Image example\n![](attachment:D102C64516364C2195B19636EAC9FE9F)\n## Second Image\n![bar](attachment:D102C64516364C2195B19636EAC9FE99)",
          title: "Image example",
          attachments: [
            {
              uuid: "D102C64516364C2195B19636EAC9FE9F",
              relativeSourcePath: "photos/dc6cb29b2f32ce896ebf417608885889.png",
              filename: "dc6cb29b2f32ce896ebf417608885889.png",
            },
            {
              uuid: "D102C64516364C2195B19636EAC9FE99",
              relativeSourcePath:
                "photos/dc6cb29b2f32ce896ebf417608885899.jpeg",
              filename: "dc6cb29b2f32ce896ebf417608885899.jpeg",
            },
          ],
        }
      );
    });
  });

  describe("externalImages", () => {
    it("returns", () => {
      assert.deepEqual(
        parseDayOne2JSONExportEntry(examplEntries.externalImages),
        {
          uuid: "65A6F350C04E496DB775971441E41FBA",
          title: "Foo",
          text: "# Foo\n![](http://example.org/foo.png)\n![bar](http://example.org/bar.png)\n",
        }
      );
    });
  });

  describe("with pdf", () => {
    it("parses correctly", () => {
      assert.deepEqual(parseDayOne2JSONExportEntry(examplEntries.withPdf), {
        createdAt: "2023-11-01T07:31:20Z",
        modifiedAt: "2023-11-01T07:32:30Z",
        attachments: [
          {
            filename: "4b5997d3e4d8ed8f581395ae365d2f71.pdf",
            relativeSourcePath: "pdfs/4b5997d3e4d8ed8f581395ae365d2f71.pdf",
            uuid: "D229A6574C0340E68AD3BB65F950A77C",
          },
        ],
        text: 'TYT-tulosraportti 2023\n\n![D229A6574C0340E68AD3BB65F950A77C.pdf](assets/4b5997d3e4d8ed8f581395ae365d2f71.pdf)<!-- {"embed":"true", "preview":"true"} -->',
        title: "TYT\\-tulosraportti 2023",
        uuid: "AEF9A0A34B8A443AA9A83F3713C94244",
      });
    });
  });

  describe("with pdfs and images", () => {
    it("parses correctly", () => {
      assert.deepEqual(
        parseDayOne2JSONExportEntry(examplEntries.withPdfAndImages),
        {
          createdAt: "2023-11-01T07:31:20Z",
          modifiedAt: "2023-11-01T07:32:30Z",
          attachments: [
            {
              filename: "88ecaafd35b44cc45fa804fb247be012.png",
              relativeSourcePath: "photos/88ecaafd35b44cc45fa804fb247be012.png",
              uuid: "37A9D40021444291B91102841325B5CF",
            },
            {
              filename: "4b5997d3e4d8ed8f581395ae365d2f71.pdf",
              relativeSourcePath: "pdfs/4b5997d3e4d8ed8f581395ae365d2f71.pdf",
              uuid: "D229A6574C0340E68AD3BB65F950A77C",
            },
          ],
          text: 'TYT-tulosraportti 2023\n\n![D229A6574C0340E68AD3BB65F950A77C.pdf](assets/4b5997d3e4d8ed8f581395ae365d2f71.pdf)<!-- {"embed":"true", "preview":"true"} -->\n\n![](attachment:37A9D40021444291B91102841325B5CF)',
          title: "TYT\\-tulosraportti 2023",
          uuid: "AEF9A0A34B8A443AA9A83F3713C94244",
        }
      );
    });
  });

  describe("missing mandatory properties", () => {
    it("throws", () => {
      assert.throws(() => parseDayOne2JSONExportEntry({}));
    });
  });
});

const examplEntries = {
  normal: {
    creationOSName: "iOS",
    richText:
      '{"contents":[{"text":"Foo\\n","attributes":{"line":{"header":1}}},{"text":"\\n"},{"text":"Bar\\n\\n"}],"meta":{"version":1}}',
    creationDeviceModel: "iPhone11,8",
    starred: false,
    weather: {
      moonPhaseCode: "new",
      sunsetDate: "2018-12-06T15:30:41Z",
      weatherServiceName: "HAMweather",
      weatherCode: "mostly-cloudy-night",
      temperatureCelsius: 9,
      windBearing: 0,
      sunriseDate: "2018-12-06T06:55:33Z",
      conditionsDescription: "Mostly Cloudy",
      pressureMB: 1024,
      moonPhase: 0.9819,
      visibilityKM: 48.280319213867188,
      relativeHumidity: 94,
      windSpeedKPH: 0,
      windChillCelsius: 9,
    },
    creationDate: "2018-12-06T21:04:39Z",
    creationOSVersion: "12.1",
    creationDevice: "bsingr",
    creationDeviceType: "iPhone",
    timeZone: "Europe/Zurich",
    location: {
      region: {
        center: {
          longitude: 8.5916093,
          latitude: 47.300171,
        },
        radius: 75,
      },
      localityName: "Erlenbach",
      country: "Deutschland",
      longitude: 8.5916093,
      administrativeArea: "Baden-Württemberg",
      placeName: "Seestrasse",
      latitude: 47.300171,
    },
    tags: ["foo", "bar"],
    text: "# Foo\nBar\n",
    modifiedDate: "2018-12-06T21:05:56Z",
    uuid: "65A6F350C04E496DB775971441E41FBA",
    duration: 0,
  },
  attachmentImages: {
    photos: [
      {
        fnumber: "(null)",
        orderInEntry: 1,
        width: 1870,
        type: "png",
        identifier: "D102C64516364C2195B19636EAC9FE9F",
        isSketch: false,
        height: 1416,
        md5: "dc6cb29b2f32ce896ebf417608885889",
        focalLength: "(null)",
      },
      {
        fnumber: "(null)",
        orderInEntry: 1,
        width: 1870,
        type: "jpeg",
        identifier: "D102C64516364C2195B19636EAC9FE99",
        isSketch: false,
        height: 1416,
        md5: "dc6cb29b2f32ce896ebf417608885899",
        focalLength: "(null)",
      },
    ],
    text: "# Image example\n![](dayone-moment://D102C64516364C2195B19636EAC9FE9F)\n## Second Image\n![bar](dayone-moment://D102C64516364C2195B19636EAC9FE99)",
    uuid: "6D9C3106A32C4E829BB880E719150907",
  },
  externalImages: {
    text: "# Foo\n![](http://example.org/foo.png)\n![bar](http://example.org/bar.png)\n",
    uuid: "65A6F350C04E496DB775971441E41FBA",
  },
  withPdf: {
    pdfAttachments: [
      {
        favorite: false,
        fileSize: 3572578,
        orderInEntry: 0,
        width: 0,
        type: "pdf",
        identifier: "D229A6574C0340E68AD3BB65F950A77C",
        height: 0,
        creationDevice: "Petteri - iPhone 14 Pro",
        duration: 0,
        md5: "4b5997d3e4d8ed8f581395ae365d2f71",
      },
    ],
    creationDeviceModel: "iPhone15,2",
    isPinned: false,
    duration: 0,
    richText:
      '{"meta":{"version":1,"small-lines-removed":true,"created":{"platform":"com.bloombuilt.dayone-ios","version":2444}},"contents":[{"attributes":{"line":{"header":1,"identifier":"1F9CC0E4-5FE6-41B7-BBC9-FC46D584DFE6"}},"text":"TYT-tulosraportti 2023"},{"embeddedObjects":[{"type":"pdfAttachment","identifier":"D229A6574C0340E68AD3BB65F950A77C"}]}]}',
    text: "TYT\\-tulosraportti 2023\n\n![](dayone-moment:/pdfAttachment/D229A6574C0340E68AD3BB65F950A77C)",
    modifiedDate: "2023-11-01T07:32:30Z",
    editingTime: 15.114930033683777,
    uuid: "AEF9A0A34B8A443AA9A83F3713C94244",
    isAllDay: false,
    timeZone: "Europe/Helsinki",
    creationDate: "2023-11-01T07:31:20Z",
    creationOSName: "iOS",
    creationDevice: "Petteri - iPhone 14 Pro",
    starred: false,
    creationDeviceType: "iPhone",
    creationOSVersion: "16.7.1",
  },
  withPdfAndImages: {
    pdfAttachments: [
      {
        favorite: false,
        fileSize: 3572578,
        orderInEntry: 0,
        width: 0,
        type: "pdf",
        identifier: "D229A6574C0340E68AD3BB65F950A77C",
        height: 0,
        creationDevice: "Petteri - iPhone 14 Pro",
        duration: 0,
        md5: "4b5997d3e4d8ed8f581395ae365d2f71",
      },
    ],
    photos: [
      {
        fileSize: 1387866,
        orderInEntry: 5,
        creationDevice: "Petteri’s iPad Pro M2",
        duration: 0,
        favorite: false,
        type: "png",
        filename: "IMG_2792",
        identifier: "37A9D40021444291B91102841325B5CF",
        date: "2023-10-31T16:00:23Z",
        exposureBiasValue: 0,
        height: 1179,
        width: 2556,
        md5: "88ecaafd35b44cc45fa804fb247be012",
        isSketch: false,
      },
    ],
    creationDeviceModel: "iPhone15,2",
    isPinned: false,
    duration: 0,
    richText:
      '{"meta":{"version":1,"small-lines-removed":true,"created":{"platform":"com.bloombuilt.dayone-ios","version":2444}},"contents":[{"attributes":{"line":{"header":1,"identifier":"1F9CC0E4-5FE6-41B7-BBC9-FC46D584DFE6"}},"text":"TYT-tulosraportti 2023"},{"embeddedObjects":[{"type":"pdfAttachment","identifier":"D229A6574C0340E68AD3BB65F950A77C"}]}]}',
    text: "TYT\\-tulosraportti 2023\n\n![](dayone-moment:/pdfAttachment/D229A6574C0340E68AD3BB65F950A77C)\n\n![](dayone-moment://37A9D40021444291B91102841325B5CF)",
    modifiedDate: "2023-11-01T07:32:30Z",
    editingTime: 15.114930033683777,
    uuid: "AEF9A0A34B8A443AA9A83F3713C94244",
    isAllDay: false,
    timeZone: "Europe/Helsinki",
    creationDate: "2023-11-01T07:31:20Z",
    creationOSName: "iOS",
    creationDevice: "Petteri - iPhone 14 Pro",
    starred: false,
    creationDeviceType: "iPhone",
    creationOSVersion: "16.7.1",
  },
};
