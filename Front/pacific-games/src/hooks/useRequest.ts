import { API } from "../global";

type RequestParams = {
  path: string;
  method?: string;
};

function useRequest({ path, method = "POST" }: RequestParams) {
  return async (body: unknown) => {
    const result = await fetch(`${API.URL}${path}`, {
      method,
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    return result.json()
  };
}

export { useRequest };
