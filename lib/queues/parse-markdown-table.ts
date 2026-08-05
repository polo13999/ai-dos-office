import type {
  MarkdownTableParseResult,
  MarkdownTableRow,
} from "./types";

function splitMarkdownRow(line: string) {
  const trimmed = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  const cells: string[] = [];
  let current = "";
  let escaped = false;

  for (const character of trimmed) {
    if (escaped) {
      current += character;
      escaped = false;
      continue;
    }
    if (character === "\\") {
      escaped = true;
      continue;
    }
    if (character === "|") {
      cells.push(current.trim());
      current = "";
      continue;
    }
    current += character;
  }
  if (escaped) current += "\\";
  cells.push(current.trim());
  return cells;
}

function isSeparatorCell(value: string) {
  return /^:?-{3,}:?$/.test(value.trim());
}

export function unwrapScalar(value: string) {
  const trimmed = value.trim();
  if (trimmed.startsWith("`") && trimmed.endsWith("`") && trimmed.length >= 2) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

export function optionalScalar(value: string | undefined) {
  if (value === undefined) return null;
  const normalized = unwrapScalar(value);
  return normalized === "" || normalized === "—" ? null : normalized;
}

export function parseMarkdownTable(
  markdown: string,
  expectedHeaders: readonly string[],
): MarkdownTableParseResult {
  const lines = markdown.split(/\r?\n/);
  const warnings: string[] = [];
  const errors: string[] = [];
  let headerIndex = -1;

  for (let index = 0; index < lines.length; index += 1) {
    const cells = splitMarkdownRow(lines[index]).map(unwrapScalar);
    if (
      cells.length === expectedHeaders.length &&
      cells.every((cell, cellIndex) => cell === expectedHeaders[cellIndex])
    ) {
      headerIndex = index;
      break;
    }
  }

  if (headerIndex < 0) {
    return {
      status: "PARSE_ERROR",
      headers: [],
      rows: [],
      warnings,
      errors: ["Expected authoritative queue table header was not found."],
    };
  }

  const separatorLine = lines[headerIndex + 1];
  if (!separatorLine) {
    return {
      status: "PARSE_ERROR",
      headers: [...expectedHeaders],
      rows: [],
      warnings,
      errors: ["Markdown table separator row is missing."],
    };
  }

  const separatorCells = splitMarkdownRow(separatorLine);
  if (
    separatorCells.length !== expectedHeaders.length ||
    !separatorCells.every(isSeparatorCell)
  ) {
    return {
      status: "PARSE_ERROR",
      headers: [...expectedHeaders],
      rows: [],
      warnings,
      errors: ["Markdown table separator row is malformed."],
    };
  }

  const rows: MarkdownTableRow[] = [];
  for (let index = headerIndex + 2; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim().startsWith("|")) break;
    const cells = splitMarkdownRow(line);
    if (cells.length !== expectedHeaders.length) {
      warnings.push(`Source row ${index + 1} was skipped because its column count is invalid.`);
      continue;
    }
    rows.push({
      sourceRow: index + 1,
      values: Object.fromEntries(
        expectedHeaders.map((header, cellIndex) => [header, cells[cellIndex]]),
      ),
    });
  }

  return {
    status: rows.length ? "OK" : "EMPTY",
    headers: [...expectedHeaders],
    rows,
    warnings,
    errors,
  };
}
