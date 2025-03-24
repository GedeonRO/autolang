// post request helpers boiler plate
// env
const REACT_APP_DOMAIN = import.meta.env.VITE_REACT_APP_DOMAIN;

const postReq = async ({
  data,
  url,
}: {
  data: unknown;
  url: string;
}): Promise<Response> => {
  // headers
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");

  // fetch
  const endpoint = `${REACT_APP_DOMAIN}${url}`;

  try {
    const req = await fetch(endpoint, {
      mode: "cors",
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
      credentials: "include",
    });

    return req;
  } catch (error) {
    const err = error as Error;
    console.error("Error:", error);
    throw err;
  }
};

export default postReq;
