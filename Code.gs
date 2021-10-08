// webhook for pubsub
function doPost  (e)  {

  // this should be all set up already
  const goa = makeGoa()
  if(!goa.hasToken()) throw new Error('no goa')
  const {postData} = e || {};

  // get messagedata - postdata going to be a series of bytes, but as base64
  const body = postData && postData.getDataAsString()
  const data = body && body.message && body.message.data
  const pack = data && Utilities.newBlob(Utilities.base64Decode(data)).getDataAsString()
  const work = pack && JSON.parse(pack)
  console.log(work)

  // mark as done - this should return a http response code of 200
  return ContentService.createTextOutput('200 ok')

}
const libReport = () => {
  console.log(bmPreFiddler.exportUsage())
}

function doGet(e) {
console.log(e)
}

const makeGoa = () => {
  return cGoa.GoaApp.createGoa('scrvizpubsub',PropertiesService.getUserProperties()).execute()
}
function makeLibraries() {

  // get service account

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
  console.log('libraries', libs.length)
  const si = files.filter(g=>g.fields.scriptId)
  console.log('scriptId', si.length, 'no sid', files.length - si.length)

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
