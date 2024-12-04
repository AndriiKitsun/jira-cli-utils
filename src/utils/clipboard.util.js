import clipboard from "clipboardy";

export function copyToClipboard(text) {
  return clipboard.write(text);
}
