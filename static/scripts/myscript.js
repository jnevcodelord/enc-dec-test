

let publicKey; // Declare a variable to store the publicKey
let privateKey;
let ciphertextArray;

var button = document.getElementById("sendbutton")

var message = document.getElementById("message");

function str2ab(str) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

button.addEventListener("click", async function() { // Add 'async' keyword before function declaration
  console.log(message.value)
  fetch('/checkKey', {
    method: 'GET',
  }).then(response => response.json())
  .then(data => {
    key = data.key;
    console.log(key);
    // encrypt(message.value, pubKey);

    const binaryDerString = window.atob(key)
    const binaryDer = str2ab(binaryDerString);
    
    return window.crypto.subtle.importKey(
      "spki",
      binaryDer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      ["encrypt"]
    ).then((importedKey) => {
      // The resolved value of the Promise is the imported key
      publicKey = importedKey;
      console.log(typeof publicKey)
      encrypt(message.value,publicKey)

    }).catch((error) => {
      // Handle any errors that may occur during the import process
      console.error("Error importing key:", error);
    });

  });
});

async function encrypt(message, publicKey) {
  let enc = new TextEncoder();
  let encoded = enc.encode(message);

let ciphertext = await window.crypto.subtle.encrypt(
  {
    name: "RSA-OAEP",
  },
  publicKey, // Use the publicKey passed as an argument
  encoded
);

// Convert the ciphertext ArrayBuffer to a base64 string
 ciphertextArray = new Uint8Array(ciphertext);
let ciphertextBase64 = btoa(String.fromCharCode(...ciphertextArray));
let ciphertext1 = ciphertextBase64 

console.log(message);
console.log(ciphertextBase64);


fetch('/sendmessage', {
  method: 'POST',
  body: JSON.stringify({"message":ciphertext1}),
  headers: { 'Content-Type': 'application/json' }
}).catch(error => {
  console.error("Error:", error);
});
}
   // encrypt(message.value, pubKey);



