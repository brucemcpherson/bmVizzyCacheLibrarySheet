// this used to be on redis, but we need it client side now
// so the is a just a gist compressed

const Cache = (() => {

  // this should get us the latest raw url for this gist
  const raw = (fetcher) => {
    const r = JSON.parse(fetcher(QueryDefinition.gistApi).getContentText());
    return r.files && r.files[Object.keys(r.files)[0]].raw_url;
  };

  // cache is using gist now
  const cacheGet = (fetcher) => {
  if(!fetcher) throw new Error(`please supply your fetchapp - from apps script the call is cacheGet(${'Url'}${'FetchApp.'}fetch`)
    const { decompress } = Compress
    const rawUrl = raw(fetcher);
    const response = fetcher(rawUrl);
    const text = response.getContentText();
    return text && decompress(text);
  };
  return {
    cacheGet,
  };
})();
