// ts-check
/**
 * 
 * @param {string} domainName 
 * @returns {import("./schema").checkDomain} 
*/
async function checkDomain(domainName){
try {
 const response= await fetch(`http://localhost:3000/${domainName}`)
 if(response.status===200){
  const result= await response.json() 
  return result
 }
 
 return {"authorized":false,
        "started":false, 
        "closed":false}

}catch(e){
   return {"authorized":false,
        "started":false, 
        "closed":false} 
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
    
    
})();

