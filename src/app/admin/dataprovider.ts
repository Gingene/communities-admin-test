import { DataProvider, fetchUtils } from "ra-core";

const API_URL = "https://concert-now.dewed.one/api";

// Storage keys
const USER_KEY = "user";
const TOKEN_KEY = "access_token";

// Helper: Get store-scoped API URL

// Helper: Get user token from localStorage
const getToken = (): string | null => {
  try {
    const tokenString = localStorage.getItem(TOKEN_KEY);
    if (!tokenString) return null;
    const token = JSON.parse(tokenString);
    return token ?? null;
  } catch {
    return null;
  }
};

// Custom httpClient with authentication
const httpClient = (url: string, options: fetchUtils.Options = {}) => {
  const token = getToken();
  return fetchUtils.fetchJson(url, {
    ...options,
    user: {
      authenticated: !!token,
      token: token ? `Bearer ${token}` : "",
    },
  });
};

// Helper: Parse API response data
const parseResponseData = (json: Record<string, unknown>) => {
  const data = json?.data ?? json ?? [];
  return Array.isArray(data) ? data : [];
};

// Helper: Get total count from response
const parseTotal = (json: Record<string, unknown>, data: unknown[]) => {
  return typeof json?.total === "number" ? json.total : data.length;
};

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    const url = `${API_URL}/${resource}`;
    const { json } = await httpClient(url);

    const data = parseResponseData(json);
    const total = parseTotal(json, data);

    return { data, total };
  },

  getOne: async (resource, params) => {
    // API does not expose single-item endpoint, fallback to list and filter
    const url = `${API_URL}/${resource}`;
    const { json } = await httpClient(url);

    const data = parseResponseData(json);
    const record = data.find(
      (r: { id: unknown }) => String(r.id) === String(params.id)
    );

    if (!record) {
      throw new Error(
        `Record with id ${params.id} not found for resource ${resource}`
      );
    }

    return { data: record };
  },

  getMany: async (resource, params) => {
    const query = { ids: params.ids };
    const url = `${API_URL}/${resource}?${fetchUtils.queryParameters(query)}`;
    const { json } = await httpClient(url);

    const data = parseResponseData(json);
    const idsSet = new Set(params.ids.map((id) => String(id)));
    const filtered = data.filter((r: { id: unknown }) =>
      idsSet.has(String(r.id))
    );

    return { data: filtered };
  },

  getManyReference: async (resource, params) => {
    const { page = 1, perPage = 10 } = params.pagination || {};
    const query = { [params.target]: params.id, page, perPage };
    const url = `${API_URL}/${resource}?${fetchUtils.queryParameters(query)}`;
    const { json } = await httpClient(url);

    return {
      data: json.data ?? [],
      total: json.total ?? 0,
    };
  },

  create: async (resource, params) => {
    const url = `${API_URL}/${resource}`;
    const { json } = await httpClient(url, {
      method: "POST",
      body: JSON.stringify(params.data),
    });

    return { data: json.data };
  },

  update: async (resource, params) => {
    const url = `${API_URL}/${resource}/${params.id}`;
    const { json } = await httpClient(url, {
      method: "PUT",
      body: JSON.stringify(params.data),
    });

    return { data: json.data };
  },

  updateMany: async (resource, params) => {
    await Promise.all(
      params.ids.map((id) =>
        httpClient(`${API_URL}/${resource}/${id}`, {
          method: "PUT",
          body: JSON.stringify(params.data),
        })
      )
    );

    return { data: params.ids };
  },

  delete: async (resource, params) => {
    const url = `${API_URL}/${resource}/${params.id}`;
    const { json } = await httpClient(url, { method: "DELETE" });

    return { data: json.data };
  },

  deleteMany: async (resource, params) => {
    await Promise.all(
      params.ids.map((id) =>
        httpClient(`${API_URL}/${resource}/${id}`, { method: "DELETE" })
      )
    );

    return { data: params.ids };
  },
};
