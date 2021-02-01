function makeLibraries() {
  // use this to interact with the sheet
  const fiddler = bmPreFiddler.PreFiddler().getFiddler({
    id: '1DlKpVVYCrCPNfRbGsz6N_K3oPTgdC9gQIKi0aNb42uI',
    sheetName: 'vizzyLibraries',
    createIfMissing: true
  })

  // get the data
  const { mf, gd } = bmVizzyCache.VizzyCache.fetch(UrlFetchApp.fetch)
  const repos = gd.items('repos');
  const owners = gd.items('owners');
  const files = gd.items('files');
 
  // ignore case compare
  const compare = (a,b) => {
    const alab = a.label.toLowerCase();
    const blab = b.label.toLowerCase();
    return alab === blab ? 0 : (alab > blab ? 1 : -1)
  }

  const libs = Array.from(mf.maps.libraries.values()).sort(compare)
  console.log(libs)
  // dump the libraries
  const data = libs
    
    // turn the versions in use into a list
    .map(f => {
      const values = Array.from(f.versions.values());

      // remove the dups from all used userSymbols (it's possible a custom user symbol is in use by some)
      const userSymbols = new Set(values.map(g=>g.userSymbol))

      return {
        ...f,
        versions: values.map(v=>v.version).join(","),
        userSymbols: Array.from(userSymbols)
      }

    })

    // try to find if we know this library on github by one of its userSymbols
    // pretty poor match here probably either because the repo is not called the same thing as the usersymbol, or it's just not found on github
    .map(f=> {
      const file = files.find(g=>f.id === g.fields.scriptId)
      const repo = repos.find(g=>f.userSymbols.indexOf(g.fields.name) !== -1 || (file && g.fields.id ===  file.fields.repositoryId))
      const owner = repo && owners.find(g=>g.fields.id===repo.fields.ownerId)

      return {
        ...f,
        repo: repo && repo.fields.name,
        repoLink: repo && repo.fields.html_url,
        owner: owner && owner.fields.name,
        claspProject: file && file.fields.claspHtmlUrl && file.fields.claspHtmlUrl.replace('/.clasp.json','')
      }
    })


  fiddler.setData(data).dumpValues()
}
