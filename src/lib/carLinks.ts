const CYRILLIC_RANGE = /[а-яёіїґșțăâîșțşţęąćłńóśźż]+/i;

const normalizeString = (value: string) => {
  if (!value) {
    return "";
  }

  const trimmed = value.toString().trim();

  if (!trimmed) {
    return "";
  }

  return trimmed.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const createCarSlug = (name: string) => {
  const normalized = normalizeString(name)
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9\u0400-\u04FF-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!normalized) {
    const fallback = name
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");
    return encodeURIComponent(fallback || "car");
  }

  const slug = CYRILLIC_RANGE.test(normalized)
    ? normalized
    : normalized.replace(/[^a-z0-9-]/g, "");

  return encodeURIComponent(slug);
};

export const createCarPath = (id: string, name: string) => {
  const slug = createCarSlug(name);
  return `/car/${id}-${slug}`;
};

export const createCarShareUrl = (id: string, name: string) => {
  const path = createCarPath(id, name);

  if (typeof window === "undefined") {
    return path;
  }

  return `${window.location.origin}${path}`;
};

export const extractCarInfoFromPath = (pathname: string) => {
  if (!pathname || !pathname.startsWith("/car/")) {
    return null;
  }

  const raw = pathname.replace(/^\/car\//, "");
  if (!raw) {
    return null;
  }

  const [id, ...slugParts] = raw.split("-");
  if (!id) {
    return null;
  }

  const slug = slugParts.join("-");
  return { id, slug };
};

export const isPathForCar = (pathname: string, id: string, name: string) => {
  const targetPath = createCarPath(id, name);
  return pathname === targetPath;
};

