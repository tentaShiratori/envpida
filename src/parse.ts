type StringType = "string";
type NumberType = "number";
type BooleanType = "boolean";
interface UnionType {
  type: "union";
  values: string[];
}
type Type = StringType | NumberType | BooleanType | UnionType;
export type Env = [string, string, Type][];``
/**
 * Parses a string or buffer into an object
 * a. (?:^|^) = start of string or start of line
 * b. \s* = any number of whitespace characters
 * c. (?:export\s+)? = optional "export" followed by one or more whitespace characters
 * 1. ([\w.-]+) = one or more word characters, dots, or dashes
 * d. (?:\s*=\s*?|:\s+?) = optional equals sign surrounded by optional whitespace, or colon surrounded by one or more whitespace characters
 * 2. (\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)? = optional single-quoted, double-quoted, or backtick-quoted string, or any number of characters that are not a hash or newline
 * e. \s* = any number of whitespace characters
 * 3. (#.*)? = optional hash followed by any number of characters
 * f. (?:$|$) = end of string or end of line
 */

export function parse(src: string): Env {
  const LINE =
    /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(#.*)?(?:$|$)/gm;

  const arr: Env = [];

  let lines = src.toString();
  // Normalize line endings
  lines = lines.replace(/\r\n?/gm, "\n");

  let match;
  while ((match = LINE.exec(lines)) != null) {
    const key = match[1];
    let value = match[2] || "";
    let typeStr = match[3] || "";
    value = value.trim();
    const maybeQuote = value[0];
    value = value.replace(/^(['"`])([\s\S]*)\1$/gm, "$2");
    if (maybeQuote === '"') {
      value = value.replace(/\\n/g, "\n");
      value = value.replace(/\\r/g, "\r");
    }
    typeStr = typeStr.substring(1).trim();
    let type: Type = "string";
    switch (typeStr) {
      case "number":
        type = "number";
        if (isNaN(Number(value))) {
          throw new Error(`Value ${value} is not a number`);
        }
        break;
      case "boolean":
        type = "boolean";
        if (value !== "true" && value !== "false") {
          throw new Error(`Value ${value} is not a boolean`);
        }
        break;
      default:
        if (isUnion(typeStr)) {
          type = {
            type: "union",
            values: typeStr.split("|").map((s) => s.trim()),
          };
          if (!type.values.includes(value)) {
            throw new Error(
              `Value ${value} is not in union ${type.values.join("|")}`
            );
          }
        }
        break;
    }
    arr.push([key, value, type]);
  }

  return arr;
}

function isUnion(value: string) {
  return value.includes("|");
}
