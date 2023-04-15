
var checkbutton = document.getElementById("checkmessages")
var privateKey;
// Function to convert an ArrayBuffer to a string
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  }

  function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
  
  function generateKeys() {
    return new Promise((resolve, reject) => {
      window.crypto.subtle
        .generateKey(
          {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
          },
          true,
          ["encrypt", "decrypt"]
        )
        .then(async myKeyPair => {
         
          console.log(typeof privateKey);
          privateKey = myKeyPair.privateKey
          publicKey = myKeyPair.publicKey; // Store the publicKey in the variable
          const exported = await window.crypto.subtle.exportKey("spki", publicKey); // Update to "spki" for public key
          
          const exportedAsString = arrayBufferToBase64(exported);
          console.log("Public Key: ", publicKey);
          console.log("Private Key: ", privateKey);
          console.log(exportedAsString)
          // Resolve with the publicKey
  
          fetch('/publickey', {
            method: 'POST',
            body: JSON.stringify({"key":exportedAsString}),
            headers: { 'Content-Type': 'application/json' }
          }).catch(error => {
            console.error("Error:", error);
          });
        })
        .catch(error => {
          console.error("Error generating key pair:", error);
          reject(error); // Reject with the error
        });
    });
  }
  
  window.addEventListener("load", generateKeys);
  


  checkbutton.addEventListener("click", function() {
    fetch('/checkmessages1', {
      method: 'GET',
    }).then(response => response.json()) // Convert the response to JSON
    .then(data => {
    const cipher = data.message;
    const decodedData = atob(cipher);
    const uint8Array = new Uint8Array(decodedData.length);
    for (let i = 0; i < decodedData.length; i++) {
      uint8Array[i] = decodedData.charCodeAt(i);
    }
    // Convert Uint8Array to ArrayBuffer
    const cipherArrayBuffer = uint8Array.buffer;
    // Pass cipherArrayBuffer to decryptMessage()
    decryptMessage(cipherArrayBuffer, privateKey);
  })
  
  });
  
  
  async function decryptMessage(ciphertext,privateKey) {
   
    let decrypted = await window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP"
      },
      privateKey,
      ciphertext
    );
  
    let decryptedArray = new Uint8Array(decrypted);
  
    // Decode Uint8Array to string
    let plaintext = new TextDecoder().decode(decryptedArray);
    console.log(plaintext)
    alert(plaintext)
  
  }
