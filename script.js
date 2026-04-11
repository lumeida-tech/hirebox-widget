// ts-check
/**
 * 
 * @param {string} domainName // le nom de domaine à vérifier
 * @returns {import("./schema").checkDomain}  // un objet contenant les propriétés authorized, started et closed
*/
async function checkDomain(domainName){ // une fonction asynchrone qui vérifie le domaine en envoyant une requête à un serveur local
try {//
 const response= await fetch(`http://localhost:3000/${domainName}`) // envoie une requête GET à l'URL http://localhost:3000/{domainName} et attend la réponse
 if(response.status===200){ // si la réponse a un statut 200 (OK), alors on parse le corps de la réponse en JSON et on retourne le résultat
  const result= await response.json() // parse le corps de la réponse en JSON et attend le résultat
  return result // retourne le résultat qui doit être un objet contenant les propriétés authorized, started et closed
 }
 
 return {"authorized":false, // si la réponse n'a pas un statut 200, alors on retourne un objet avec authorized à false, started à false et closed à false
        "started":false,  // indique que l'application n'est pas encore démarrée
        "closed":false} // indique que l'application n'est pas encore fermée

}catch(e){ // si une erreur se produit lors de l'envoi de la requête ou du parsing de la réponse, alors on retourne un objet avec authorized à false, started à false et closed à false
   return {"authorized":false, // indique que l'utilisateur n'est pas autorisé à accéder à l'application
        "started":false, // indique que l'application n'est pas encore démarrée
        "closed":false} // indique que l'application n'est pas encore fermée
}
 
}


(async function () {
    let isLoaded= true
    const rootDocument = document.getElementById('root')
    const loadedElemnt = document.getElementById('isLoaded')
    const unauthorisedElement = document.getElementById('unauthorised')
    const applicationUnstarted = document.getElementById('applicationUnstarted')
    const applicationClosed = document.getElementById('applicationClosed')
    rootDocument.classList.add("isLoading")
    loadedElemnt.classList.add("enabled")
    // debugger
    // const result= await checkDomain('hire.cgl.com')
    //const domainName=window.location.href
   // console.log(domainName)
    const result= await checkDomain('hire.cgl.com')
    isLoaded=false
    rootDocument.classList.remove("isLoading") 
    loadedElemnt.classList.remove("enabled") 
    if(result.authorized==false){
     unauthorisedElement.classList.add("enabled")
    }
    if(result.authorized==false){
     rootDocument.classList.add("disabled")
    }
    if(result.started==false){
     rootDocument.classList.add("disabled")
     applicationUnstarted.classList.add("enabled")
    }
    if(result.closed==true){
     rootDocument.classList.add("disabled")
     applicationUnstarted.classList.add("disabled")
     applicationClosed.classList.add("enabled")
    }
// ─── Upload CV ───────────────────────────
  const dropZone       = document.getElementById('dropZone')
  const fileInput      = document.getElementById('fileInput')
  const browseBtn      = document.getElementById('browseBtn')
  const filePreview    = document.getElementById('filePreview')
  const fileNameEl     = document.getElementById('fileName')
  const fileSizeEl     = document.getElementById('fileSize')
  const removeBtn      = document.getElementById('removeBtn')
  const submitBtn      = document.getElementById('submitBtn')
  const errorMsg       = document.getElementById('errorMsg')
  const successMsg     = document.getElementById('successMsg')
  const uploadSection  = document.getElementById('upload-section')

  browseBtn.addEventListener('click', () => fileInput.click())

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) handleFile(fileInput.files[0])
  })

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault()
    dropZone.classList.add('dragover')
  })
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'))
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault()
    dropZone.classList.remove('dragover')
    if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0])
  })

  function handleFile(file) {
    errorMsg.classList.remove('visible')
    if (file.type !== 'application/pdf' || file.size > 5 * 1024 * 1024) {
      errorMsg.classList.add('visible')
      return
    }
    fileNameEl.textContent = file.name
    fileSizeEl.textContent = (file.size / 1024).toFixed(0) + ' Ko'
    filePreview.classList.add('visible')
    submitBtn.classList.add('active')
  }

  removeBtn.addEventListener('click', () => {
    fileInput.value = ''
    filePreview.classList.remove('visible')
    submitBtn.classList.remove('active')
    errorMsg.classList.remove('visible')
  })

  submitBtn.addEventListener('click', async () => {
    const formData = new FormData()
    formData.append('cv', fileInput.files[0])

    // Simulation succès (à supprimer quand l'API est prête)
    uploadSection.style.display = 'none'
    successMsg.classList.add('visible')
  })    
    
})();

