const handleResponse = (response: any) =>
  response.json()
    .then((json: any) =>
      response.ok ? json : Promise.reject(json)
    );

export const get = (url: string) =>
  fetch(url, {
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(handleResponse);
