import * as qs from "qs";

export function getUrlSearchParam(searchString) {
  return qs.parse(searchString, { ignoreQueryPrefix: true });
}

export function updateUrlSearchParam(url, params) {
  url = new URL(url);

  const search = getUrlSearchParam(url.search);
  for (const paramsKey in params) {
    if (params[paramsKey] === undefined) {
      delete search[paramsKey];
    } else {
      search[paramsKey] = params[paramsKey];
    }
  }

  url.search = qs.stringify(search, { encode: false });

  return url.toString();
}
