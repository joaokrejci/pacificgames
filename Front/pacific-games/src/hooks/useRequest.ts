type RequestParams = {
  path: string;
  method?: string;
};

function useRequest({ path, method = "POST" }: RequestParams) {
  return async (body: unknown) => {
    const result = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
      method,
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    return result.json()
  };
}

export default useRequest;
