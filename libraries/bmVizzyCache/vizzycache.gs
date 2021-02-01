var VizzyCache = {
    fetch: (fetcher) => {
      const {value, timestamp} = Cache.cacheGet(fetcher)
      const gd =  new GitData(value);
      const mf = Gasser.enumerateManifests(gd)
      return {
        gd,
        mf,
        timestamp
      }
    }
  }

