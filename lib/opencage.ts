export type OpenCageGeometry = {
  lat: number;
  lng: number;
};

export type OpenCageResult = {
  formatted: string;
  geometry: OpenCageGeometry;
  confidence?: number;
  components?: Record<string, string | string[] | undefined>;
};

export type OpenCageGeocodeResponse = {
  status: { code: number; message: string };
  results: OpenCageResult[];
};

const BASE = 'https://api.opencagedata.com/geocode/v1/json';

export async function reverseGeocode(
  lat: number,
  lng: number,
  apiKey: string,
  options?: { language?: string },
): Promise<OpenCageGeocodeResponse> {
  const params = new URLSearchParams({
    q: `${lat},${lng}`,
    key: apiKey,
  });
  if (options?.language) {
    params.set('language', options.language);
  }

  const res = await fetch(`${BASE}?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`OpenCage: HTTP ${res.status}`);
  }

  const data = (await res.json()) as OpenCageGeocodeResponse;
  if (data.status?.code !== 200) {
    throw new Error(data.status?.message ?? 'OpenCage: resposta inválida');
  }

  return data;
}
