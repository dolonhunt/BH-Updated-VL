const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType, WidthType, BorderStyle,
  ShadingType,
} = require("docx");
const fs = require("fs");
const path = require("path");

const BRAND = "FF2109";
const DARK = "111111";
const LIGHT_BORDER = "DDDDDD";
const DARK_BORDER = "CC1A07";

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

function salaryCell(text, width, bold, shade, align, textColor) {
  const cellBorders = {
    top: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_BORDER },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_BORDER },
    left: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_BORDER },
    right: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_BORDER },
  };
  return new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    shading: shade ? { type: ShadingType.CLEAR, fill: typeof shade === 'string' ? shade : "F9F0F2" } : undefined,
    margins: { top: 50, bottom: 50, left: 100, right: 100 },
    borders: cellBorders,
    children: [
      new Paragraph({
        alignment: align || AlignmentType.LEFT,
        children: [new TextRun({ text, bold: !!bold, size: 21, color: textColor || DARK, font: { ascii: "Calibri" } })],
      }),
    ],
  });
}

function headerCell(text, width, align) {
  return new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.CLEAR, fill: BRAND },
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: DARK_BORDER },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: DARK_BORDER },
      left: { style: BorderStyle.SINGLE, size: 1, color: DARK_BORDER },
      right: { style: BorderStyle.SINGLE, size: 1, color: DARK_BORDER },
    },
    children: [
      new Paragraph({
        alignment: align || AlignmentType.LEFT,
        children: [new TextRun({ text, bold: true, size: 21, color: "FFFFFF", font: { ascii: "Calibri" } })],
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
          // SALARY CERTIFICATE
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 320 },
            children: [
              new TextRun({ text: "SALARY CERTIFICATE", bold: true, size: 28, font: { ascii: "Calibri" } }),
            ],
          }),

          // Ref and Date
          new Paragraph({
            spacing: { after: 280 },
            children: [
              new TextRun({ text: "Ref: TBH-46077", size: 22, font: { ascii: "Calibri" } }),
              new TextRun({ text: "\t\t\t\t\t\t\t\tDate: February 24, 2026", size: 22, font: { ascii: "Calibri" } }),
            ],
          }),

          // Body text
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 240 },
            children: [
              new TextRun({ text: "This is to certify that Mr. ", size: 22, font: { ascii: "Calibri" } }),
              new TextRun({ text: "Syed Ashfaqul Haque", bold: true, size: 22, font: { ascii: "Calibri" } }),
              new TextRun({ text: " has been working as a permanent employee in our organisation, The Beyond Headlines and, his contract excludes any retirement age limit. His employment details are as follows:", size: 22, font: { ascii: "Calibri" } }),
            ],
          }),

          // Designation
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({ text: "Designation:", bold: true, size: 22, font: { ascii: "Calibri" } }),
              new TextRun({ text: "\tEditor", size: 22, font: { ascii: "Calibri" } }),
            ],
          }),

          // Joining date
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({ text: "Joining date:", bold: true, size: 22, font: { ascii: "Calibri" } }),
              new TextRun({ text: "\tOctober 01, 2025", size: 22, font: { ascii: "Calibri" } }),
            ],
          }),

          // Job Location
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({ text: "Job Location:", bold: true, size: 22, font: { ascii: "Calibri" } }),
              new TextRun({ text: "\tHead Office, Dhaka", size: 22, font: { ascii: "Calibri" } }),
            ],
          }),

          // Salary Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              // Header row
              new TableRow({
                tableHeader: true,
                cantSplit: true,
                children: [
                  headerCell("Monthly Gross Salary", 38),
                  headerCell("(in BDT)", 12, AlignmentType.RIGHT),
                  headerCell("Monthly Deductions", 38),
                  headerCell("(in BDT)", 12, AlignmentType.RIGHT),
                ],
              }),
              // Basic / Tax
              new TableRow({
                cantSplit: true,
                children: [
                  salaryCell("Basic", 38, false, false),
                  salaryCell("150,000.00", 12, false, false, AlignmentType.RIGHT),
                  salaryCell("Tax", 38, false, false),
                  salaryCell("43,000.00", 12, false, false, AlignmentType.RIGHT),
                ],
              }),
              // House Rent / Others
              new TableRow({
                cantSplit: true,
                children: [
                  salaryCell("House Rent", 38, false, true),
                  salaryCell("75,000.00", 12, false, true, AlignmentType.RIGHT),
                  salaryCell("Others", 38, false, true),
                  salaryCell("-", 12, false, true, AlignmentType.RIGHT),
                ],
              }),
              // Conveyance
              new TableRow({
                cantSplit: true,
                children: [
                  salaryCell("Conveyance", 38, false, false),
                  salaryCell("30,000.00", 12, false, false, AlignmentType.RIGHT),
                  salaryCell("", 38, false, false),
                  salaryCell("", 12, false, false),
                ],
              }),
              // Medical Allowance
              new TableRow({
                cantSplit: true,
                children: [
                  salaryCell("Medical Allowance", 38, false, true),
                  salaryCell("22,500.00", 12, false, true, AlignmentType.RIGHT),
                  salaryCell("", 38, false, true),
                  salaryCell("", 12, false, true),
                ],
              }),
              // Food & Mobile Allowances
              new TableRow({
                cantSplit: true,
                children: [
                  salaryCell("Food & Mobile Allowances", 38, false, false),
                  salaryCell("22,500.00", 12, false, false, AlignmentType.RIGHT),
                  salaryCell("", 38, false, false),
                  salaryCell("", 12, false, false),
                ],
              }),
              // Cash
              new TableRow({
                cantSplit: true,
                children: [
                  salaryCell("Cash", 38, false, true),
                  salaryCell("143,000.00", 12, false, true, AlignmentType.RIGHT),
                  salaryCell("", 38, false, true),
                  salaryCell("", 12, false, true),
                ],
              }),
              // Total row
              new TableRow({
                cantSplit: true,
                children: [
                  salaryCell("Total", 38, true, "F0E0E4"),
                  salaryCell("443,000.00", 12, true, "F0E0E4", AlignmentType.RIGHT),
                  salaryCell("Total", 38, true, "F0E0E4"),
                  salaryCell("43,000.00", 12, true, "F0E0E4", AlignmentType.RIGHT),
                ],
              }),
              // Net Total row
              new TableRow({
                cantSplit: true,
                children: [
                  salaryCell("Net Total", 38, true, BRAND, AlignmentType.LEFT, "000000"),
                  salaryCell("400,000.00", 12, true, BRAND, AlignmentType.RIGHT, "000000"),
                  salaryCell("", 38, false, BRAND),
                  salaryCell("", 12, false, BRAND),
                ],
              }),
            ],
          }),

          // Annual Pay & Benefits
          new Paragraph({
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({ text: "Annual Pay & Benefits (in BDT)", bold: true, size: 22, font: { ascii: "Calibri" } }),
            ],
          }),

          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({ text: "Salary & Others Allowances", size: 22, font: { ascii: "Calibri" } }),
              new TextRun({ text: "\t:\t5,316,000.00", size: 22, font: { ascii: "Calibri" } }),
            ],
          }),

          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({ text: "Festival Bonus(es)", size: 22, font: { ascii: "Calibri" } }),
              new TextRun({ text: "\t:\t300,000.00", size: 22, font: { ascii: "Calibri" } }),
            ],
          }),

          // Divider
          new Paragraph({
            spacing: { before: 60, after: 60 },
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 2, color: "999999" },
            },
            children: [],
          }),

          // Total (Annually)
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({ text: "Total (Annually)", bold: true, size: 22, font: { ascii: "Calibri" } }),
              new TextRun({ text: "\t:\t5,616,000.00", bold: true, size: 22, font: { ascii: "Calibri" } }),
            ],
          }),

          // Declaration
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 360 },
            children: [
              new TextRun({
                text: "We hereby certify that the above-mentioned information is correct and accurate to the best of our knowledge. We are issuing this letter on the specific request of our employee for whatever the purpose he may require without accepting any liability on behalf of this letter or part of this letter on our company.",
                size: 22,
                font: { ascii: "Calibri" },
              }),
            ],
          }),

          // Signature section
          new Paragraph({ spacing: { before: 600, after: 0 }, children: [] }),
          new Paragraph({
            spacing: { after: 60 },
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 3, color: "333333" },
            },
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
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(__dirname, "../public/SalaryCertificate-Syed-Ashfaqul-Haque.docx");
  fs.writeFileSync(outputPath, buffer);
  console.log("DOCX generated at:", outputPath);
  console.log("File size:", buffer.length, "bytes");
}

generateDocx().catch(console.error);
