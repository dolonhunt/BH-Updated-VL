const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType, WidthType, BorderStyle,
  ShadingType, PageNumber,
} = require("docx");
const fs = require("fs");
const path = require("path");

const BRAND = "FF2109";
const DARK = "111111";
const GRAY = "555555";
const LIGHT_BORDER = "DDDDDD";
const DARK_BORDER = "CC1A07";

// Shared border for no-border tables
const NO_BORDERS = {
  top: { style: BorderStyle.NONE, size: 0 },
  bottom: { style: BorderStyle.NONE, size: 0 },
  left: { style: BorderStyle.NONE, size: 0 },
  right: { style: BorderStyle.NONE, size: 0 },
};

function buildHeader(logoBuffer) {
  return new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [
          new ImageRun({
            data: logoBuffer,
            transformation: { width: 250, height: 73 },
            type: "png",
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 240 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 8, color: BRAND },
        },
        children: [],
      }),
    ],
  });
}

function buildFooter() {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 120, after: 40 },
        border: {
          top: { style: BorderStyle.SINGLE, size: 24, color: BRAND },
        },
        shading: { type: ShadingType.CLEAR, fill: BRAND },
        children: [
          new TextRun({
            text: "Office Address:",
            size: 20,
            bold: true,
            color: "FFFFFF",
            font: { ascii: "Calibri" },
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        shading: { type: ShadingType.CLEAR, fill: BRAND },
        spacing: { after: 20 },
        children: [
          new TextRun({
            text: "Eureka Kanon Villa, House-84, Level-3, Road-10/1, Block-D,",
            size: 18,
            color: "FFFFFF",
            font: { ascii: "Calibri" },
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        shading: { type: ShadingType.CLEAR, fill: BRAND },
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: "Niketon, Gulshan-1, Dhaka-1212, Bangladesh.",
            size: 18,
            color: "FFFFFF",
            font: { ascii: "Calibri" },
          }),
        ],
      }),
    ],
  });
}

function salaryRow(desc, amount, descBold, shade, descRightAlign) {
  const cellBorders = {
    top: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_BORDER },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_BORDER },
    left: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_BORDER },
    right: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_BORDER },
  };
  return new TableRow({
    cantSplit: true,
    children: [
      new TableCell({
        width: { size: 60, type: WidthType.PERCENTAGE },
        shading: shade ? { type: ShadingType.CLEAR, fill: "F9F0F2" } : undefined,
        margins: { top: 50, bottom: 50, left: 120, right: 120 },
        borders: cellBorders,
        children: [
          new Paragraph({
            alignment: descRightAlign ? AlignmentType.RIGHT : undefined,
            children: [new TextRun({ text: desc, bold: descBold, size: 21, font: { ascii: "Calibri" } })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 40, type: WidthType.PERCENTAGE },
        shading: shade ? { type: ShadingType.CLEAR, fill: "F9F0F2" } : undefined,
        margins: { top: 50, bottom: 50, left: 120, right: 120 },
        borders: cellBorders,
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: amount, bold: false, size: 21, font: { ascii: "Calibri" } })],
          }),
        ],
      }),
    ],
  });
}

async function generateDocx() {
  const logoBuffer = fs.readFileSync(path.join(__dirname, "../public/Logo-main.png"));

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: { ascii: "Calibri", eastAsia: "Calibri" },
            size: 22,
            color: DARK,
          },
          paragraph: {
            spacing: { line: 276 },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1200, bottom: 1200, left: 1440, right: 1440 },
          },
        },
        headers: {
          default: buildHeader(logoBuffer),
        },
        footers: {
          default: buildFooter(),
        },
        children: [
          // ── PAGE 1 CONTENT ──
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { after: 280 },
            children: [
              new TextRun({ text: "Date: 22nd September, 2025", size: 22, bold: true, font: { ascii: "Calibri" } }),
            ],
          }),

          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({ text: "To,", size: 22, bold: true, font: { ascii: "Calibri" } }),
            ],
          }),
          new Paragraph({
            spacing: { after: 0 },
            children: [
              new TextRun({ text: "Mr. Syed Ashfaqul Haque", size: 22, font: { ascii: "Calibri" } }),
            ],
          }),
          new Paragraph({
            spacing: { after: 0 },
            children: [
              new TextRun({ text: "Former Executive Editor,", size: 22, font: { ascii: "Calibri" } }),
            ],
          }),
          new Paragraph({
            spacing: { after: 240 },
            children: [
              new TextRun({ text: "The Daily Star", size: 22, font: { ascii: "Calibri" } }),
            ],
          }),

          new Paragraph({
            spacing: { after: 240 },
            children: [
              new TextRun({ text: "Subject: A letter of appointment", size: 22, bold: true, font: { ascii: "Calibri" } }),
            ],
          }),

          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({ text: "Dear Mr. Haque,", size: 22, font: { ascii: "Calibri" } }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: "On behalf of the 'Beyond Headlines', I, Saqib Ahmed, am pleased to appoint you as the Editor of Beyond Headlines; a digital news portal with a vision for an English-language newspaper in the future ahead. The management is hereby giving you the responsibility to turn BH into an independent, credible and free media. The performance of the portal and your stewardship will be reviewed by February, 2026 in order to decide on the future the contract.",
                size: 22,
                font: { ascii: "Calibri" },
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 120 },
            children: [
              new TextRun({ text: "As the Editor, you will be broadly expected to:", size: 22, bold: false, font: { ascii: "Calibri" } }),
            ],
          }),

          ...[
            "Execute editorial and all other policies as approved by the owner.",
            "Ensure neutrality, accountability and transparency in all aspects of media operations.",
            "Exercise your complete authority in hiring and firing of the manpower under you with utmost fairness. In case of the recruitment and retrenchment of top-level manpower like Managing Editor, Executive Editor or other HODs, you will consult with the management/owner beforehand.",
            "Run the media in light of the approved AOP and SOP.",
          ].map((text) =>
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 100 },
              indent: { left: 720, hanging: 360 },
              children: [
                new TextRun({ text: "\u2022  ", size: 22, font: { ascii: "Calibri" } }),
                new TextRun({ text, size: 22, font: { ascii: "Calibri" } }),
              ],
            })
          ),

          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { before: 100, after: 200 },
            children: [
              new TextRun({
                text: "As the editor, your take-home salary will be Tk. 4 lakh a month, and the income tax will be borne by the company. In addition to your monthly salary, you will be entitled to additional allowances as per the company policy.",
                size: 22,
                font: { ascii: "Calibri" },
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: "It may be added that the tenure of this letter will be effective from the 1st of October, 2025 and all other terms and policies of your Employment will be mentioned in detail, in the formal agreement.",
                size: 22,
                font: { ascii: "Calibri" },
              }),
            ],
          }),

          // ── PAGE 2 CONTENT ──
          new Paragraph({
            spacing: { after: 160 },
            children: [
              new TextRun({ text: "Your salary structure will be as follows:", size: 22, bold: true, font: { ascii: "Calibri" } }),
            ],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                cantSplit: true,
                children: [
                  new TableCell({
                    width: { size: 60, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: BRAND },
                    margins: { top: 60, bottom: 60, left: 120, right: 120 },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Description", bold: true, size: 21, color: "FFFFFF", font: { ascii: "Calibri" } })],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 40, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: BRAND },
                    margins: { top: 60, bottom: 60, left: 120, right: 120 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [new TextRun({ text: "Amount (BDT)", bold: true, size: 21, color: "FFFFFF", font: { ascii: "Calibri" } })],
                      }),
                    ],
                  }),
                ],
              }),
              ...[
                { desc: "Bank Deposit", amount: "3,00,000", descBold: false, shade: false, descRight: false },
                { desc: "(Cash)", amount: "1,43,000", descBold: false, shade: true, descRight: false },
                { desc: "Basic 50%", amount: "1,50,000", descBold: false, shade: false, descRight: false },
                { desc: "House Rent @25%", amount: "75,000", descBold: false, shade: true, descRight: false },
                { desc: "Conveyance @10%", amount: "30,000", descBold: false, shade: false, descRight: false },
                { desc: "Medical Allowance @7.5%", amount: "22,500", descBold: false, shade: true, descRight: false },
                { desc: "Other Allowances @7.5%", amount: "22,500", descBold: false, shade: false, descRight: false },
                { desc: "Before AIT", amount: "3,00,000", descBold: false, shade: true, descRight: false },
                { desc: "AIT", amount: "43,000", descBold: true, shade: false, descRight: true },
              ].map(({ desc, amount, descBold, shade, descRight }) => salaryRow(desc, amount, descBold, shade, descRight)),
              // NET row
              new TableRow({
                cantSplit: true,
                children: [
                  new TableCell({
                    width: { size: 60, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: BRAND },
                    margins: { top: 60, bottom: 60, left: 120, right: 120 },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 1, color: DARK_BORDER },
                      bottom: { style: BorderStyle.SINGLE, size: 1, color: DARK_BORDER },
                      left: { style: BorderStyle.SINGLE, size: 1, color: DARK_BORDER },
                      right: { style: BorderStyle.SINGLE, size: 1, color: DARK_BORDER },
                    },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [new TextRun({ text: "NET Deposit after AIT Deduction", bold: true, size: 21, color: "000000", font: { ascii: "Calibri" } })],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 40, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: BRAND },
                    margins: { top: 60, bottom: 60, left: 120, right: 120 },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 1, color: DARK_BORDER },
                      bottom: { style: BorderStyle.SINGLE, size: 1, color: DARK_BORDER },
                      left: { style: BorderStyle.SINGLE, size: 1, color: DARK_BORDER },
                      right: { style: BorderStyle.SINGLE, size: 1, color: DARK_BORDER },
                    },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [new TextRun({ text: "2,57,000", bold: false, size: 21, color: "000000", font: { ascii: "Calibri" } })],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 160, after: 240 },
            children: [
              new TextRun({ text: "NET Salary [Bank + Cash] = 4,00,000", bold: true, size: 22, font: { ascii: "Calibri" } }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 360 },
            children: [
              new TextRun({
                text: "Please sign a copy of this letter in acknowledgement of this understanding. Kindly note that this Employment Letter is subject to the signing of the Agreement to be signed between you and the proprietor of BH.",
                size: 22,
                font: { ascii: "Calibri" },
              }),
            ],
          }),

          // Signature section
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: NO_BORDERS.top,
              bottom: NO_BORDERS.bottom,
              left: NO_BORDERS.left,
              right: NO_BORDERS.right,
              insideHorizontal: NO_BORDERS.top,
              insideVertical: NO_BORDERS.left,
            },
            rows: [
              new TableRow({
                children: [
                  // Left: Saqib Ahmed (Sender)
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    borders: NO_BORDERS,
                    children: [
                      new Paragraph({
                        spacing: { after: 0 },
                        children: [
                          new TextRun({ text: "Sincerely yours", bold: true, size: 22, color: "000000", font: { ascii: "Calibri" } }),
                        ],
                      }),
                      new Paragraph({ spacing: { before: 1400, after: 0 }, children: [] }),
                      new Paragraph({
                        spacing: { after: 60 },
                        border: {
                          bottom: { style: BorderStyle.SINGLE, size: 3, color: "333333" },
                        },
                        children: [],
                      }),
                      new Paragraph({
                        spacing: { after: 0 },
                        children: [
                          new TextRun({ text: "Saqib Ahmed", bold: true, size: 22, font: { ascii: "Calibri" } }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { after: 0 },
                        children: [
                          new TextRun({ text: "Proprietor", size: 20, color: "000000", font: { ascii: "Calibri" } }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { after: 0 },
                        children: [
                          new TextRun({ text: "Beyond Headlines", size: 20, color: "000000", font: { ascii: "Calibri" } }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { after: 0 },
                        children: [
                          new TextRun({ text: "House 5, Road 2,", size: 20, color: "000000", font: { ascii: "Calibri" } }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { after: 0 },
                        children: [
                          new TextRun({ text: "4th Floor, Gulshan 1", size: 20, color: "000000", font: { ascii: "Calibri" } }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { after: 0 },
                        children: [
                          new TextRun({ text: "Dhaka 1212", size: 20, color: "000000", font: { ascii: "Calibri" } }),
                        ],
                      }),
                    ],
                  }),
                  // Right: Syed Ashfaqul Haque (Accepted)
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    borders: NO_BORDERS,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        spacing: { after: 0 },
                        children: [
                          new TextRun({ text: "Accepted", bold: true, size: 22, color: "000000", font: { ascii: "Calibri" } }),
                        ],
                      }),
                      new Paragraph({ spacing: { before: 1400, after: 0 }, children: [] }),
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        spacing: { after: 60 },
                        border: {
                          bottom: { style: BorderStyle.SINGLE, size: 3, color: "333333" },
                        },
                        children: [],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        spacing: { after: 0 },
                        children: [
                          new TextRun({ text: "Syed Ashfaqul Haque", bold: true, size: 22, font: { ascii: "Calibri" } }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        spacing: { after: 0 },
                        children: [
                          new TextRun({ text: "On Date: 30th September 2025", size: 20, color: "000000", font: { ascii: "Calibri" } }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(__dirname, "../public/AppointmentLetter.docx");
  fs.writeFileSync(outputPath, buffer);
  console.log("DOCX generated at:", outputPath);
  console.log("File size:", buffer.length, "bytes");
}

generateDocx().catch(console.error);
