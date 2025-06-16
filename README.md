# nested-table-excel

A lightweight JavaScript library to export tables with **nested columns** to Excel. Effortlessly transform complex, hierarchical table structures into beautifully formatted Excel files.

[![npm version](https://img.shields.io/npm/v/nested-table-excel.svg)](https://www.npmjs.com/package/nested-table-excel)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/github/workflow/status/yourusername/nested-table-excel/CI)](https://github.com/yourusername/nested-table-excel)

## Features

- **Nested Column Support**: Export tables with hierarchical columns (columns with `children`) to Excel.
- **Customizable Headers**: Add custom titles with flexible formatting (bold, font size, width).
- **Auto-Adjusted Column Widths**: Automatically sizes columns based on content, with a configurable maximum width.
- **Lightweight & Fast**: Built on [ExcelJS](https://github.com/exceljs/exceljs), optimized for performance.
- **Framework-Agnostic**: Works with any JavaScript project (React, Vue, Angular, or vanilla JS).
- **TypeScript Support**: Full type definitions for a seamless TypeScript experience.

## Installation

Install `nested-table-excel` via npm:

```bash
npm install nested-table-excel
```

Or via yarn:

```bash
yarn add nested-table-excel
```

## Usage

### Basic Example

Export a table with nested columns to Excel:

```javascript
import { exportExcel } from "nested-table-excel";

const columns = [
  { key: "id", header: "#", width: 10 },
  {
    header: "Personal Info",
    children: [
      { key: "first_name", header: "First Name", width: 20 },
      { key: "last_name", header: "Last Name", width: 20 },
    ],
  },
  { key: "email", header: "Email", width: 30 },
];

const data = [
  {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
  },
  {
    id: 2,
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@example.com",
  },
];

const titles = [
  { content: "User Data Report", bold: true, width: 5, fontSize: 16 },
];

exportExcel(columns, data, "users.xlsx", titles)
  .then(() => console.log("Excel file exported successfully!"))
  .catch((err) => console.error("Export failed:", err));
```

This will generate an Excel file (`users.xlsx`) with a formatted title, nested headers, and data.

### Column Structure

The `columns` array supports both simple and nested columns:

```javascript
const columns = [
  { key: "id", header: "#", width: 10 }, // Simple column
  {
    header: "Details", // Nested column
    children: [
      { key: "name", header: "Name", width: 20 },
      { key: "age", header: "Age", width: 10 },
    ],
  },
];
```

### Title Configuration

The `titles` array allows you to add custom headers above the table:

```javascript
const titles = [
  { content: "Report Title", bold: true, width: 5, fontSize: 14 },
  { content: "Generated on 2025-06-13", bold: false, width: 5, fontSize: 12 },
];
```

## API

### `exportExcel(columns, data, fileName, titles)`

Exports a table to an Excel file.

- **Parameters**:
  - `columns: Array<Column>`: Array of column definitions (simple or nested).
  - `data: Array<Record<string, any>>`: Array of data rows.
  - `fileName: string`: Name of the output Excel file (e.g., `report.xlsx`).
  - `titles: Array<Title>`: Array of custom title rows.
- **Returns**: `Promise<void>` - Resolves when the file is exported, rejects on error.

#### Column Interface

```typescript
interface Column {
  key?: string; // Optional key for data mapping
  header: string; // Column header text
  width?: number; // Optional width (in characters)
  children?: Column[]; // Nested columns (supports one level in v1.0)
}
```

#### Title Interface

```typescript
interface Title {
  content: string; // Title text
  bold: boolean; // Bold text
  width: number; // Number of columns to span
  fontSize?: number; // Optional font size (default: 12)
}
```

## Limitations

- **Nested Columns**: Currently supports **one level of nested columns** (columns with `children`). Support for deeper nesting is planned for future releases.
- **Formatting**: Limited to basic formatting (bold, font size, alignment). Advanced styling (colors, borders) will be added in future updates.

## Contributing

We welcome contributions! To get started:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

Please read our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Issues

Found a bug or have a feature request? Please open an issue on our [GitHub Issues page](https://github.com/yourusername/nested-table-excel/issues).

## Roadmap

- [ ] Support for multi-level nested columns.
- [ ] Advanced cell styling (colors, borders, conditional formatting).
- [ ] Export to CSV and other formats.
- [ ] Streaming support for large datasets.

## Acknowledgments

- Built with [ExcelJS](https://github.com/exceljs/exceljs).
- Inspired by modern table UIs with hierarchical headers.

---

**Happy exporting!** 🚀

## 📞 Support

💌 **Email:** Reach out to me at [khoavutri@gmail.com](mailto:khoavutri@gmail.com)  
🐛 **GitHub Issues:** Found a bug or have a suggestion? [Open an issue here](https://github.com/khoavutri)  
💬 **Community Chat:** Join the discussion on [Facebook](https://www.facebook.com/khoa.tri.365.org)
