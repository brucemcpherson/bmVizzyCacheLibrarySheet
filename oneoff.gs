 // run this once then delete
 const oneOff = () =>{
   // it's only me that will ever be running this
   const propertyStore = PropertiesService.getUserProperties()
   // get the service account from drive
   // in case we dont have drive permissions, prank some DriveApp.getFileById()
  cGoa.GoaApp.setPackage (propertyStore , cGoa.GoaApp.createServiceAccount (DriveApp , {
      packageName: 'scrvizpubsub',
      fileId:'xxxxxxx',  //scrviz-pubsub service account file downloaded from console
      scopes : cGoa.GoaApp.scopesGoogleExpand (['cloud-platform','pubsub']),
      service:'google_service'
    }));;

 }