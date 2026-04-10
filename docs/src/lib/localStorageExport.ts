export interface LocalStorageExportPayload {
  meta: {
    exportedAt: string;
    app: string;
    source: "localStorage";
  };
  localStorage: Record<string, unknown>;
}

const EXPORT_USER_NAME_STORAGE_KEY = "localStorageExportUserName";

function tryParseJson(value: string): unknown {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return value;
  }
}

function getTimestamp(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}_${hour}${minute}${second}`;
}

function sanitizeFileNamePart(name: string): string {
  return name
    .trim()
    .replace(/[\\/:*?"<>|\u0000-\u001F]/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function loadLocalStorageExportUserName(): string {
  try {
    return localStorage.getItem(EXPORT_USER_NAME_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveLocalStorageExportUserName(userName: string): void {
  try {
    localStorage.setItem(EXPORT_USER_NAME_STORAGE_KEY, userName.trim());
  } catch {
    // localStorage が利用できない環境では永続化しない
  }
}

export function buildLocalStorageExportPayload(): LocalStorageExportPayload {
  const data: Record<string, unknown> = {};

  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key) continue;

    const value = localStorage.getItem(key);
    data[key] = value === null ? null : tryParseJson(value);
  }

  return {
    meta: {
      exportedAt: new Date().toISOString(),
      app: "programming-bootcamp",
      source: "localStorage",
    },
    localStorage: data,
  };
}

export function downloadLocalStorageJson(userName: string): string {
  const trimmedName = userName.trim();
  const safeName = sanitizeFileNamePart(trimmedName) || "user";
  const timestamp = getTimestamp(new Date());
  const fileName = `${safeName}_${timestamp}.json`;
  const payload = buildLocalStorageExportPayload();
  const json = JSON.stringify(payload, null, 2);

  saveLocalStorageExportUserName(trimmedName);

  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return fileName;
}
