

let publicKey; // Declare a variable to store the publicKey
let privateKey;


var button = document.getElementById("sendbutton")
var message = document.getElementById("message");

console.log(message.value)

button.addEventListener("click", function() {

    console.log(message.value);
    generateKeys()
    .then(pubKey => {
      // Pass the returned publicKey to the encrypt() function
      encrypt(message.value, pubKey);
    })
    .catch(error => {
      console.error("Error generating key pair:", error);
    });

    decryptMessage(privateKey, ciphertext)

});

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
      .then(myKeyPair => {
        privateKey = myKeyPair.privateKey
        publicKey = myKeyPair.publicKey; // Store the publicKey in the variable

        console.log("Public Key: ", publicKey);
        console.log("Private Key: ", myKeyPair.privateKey);
        localStorage.setItem("privateKey", privateKey)
        resolve(publicKey); // Resolve with the publicKey
      })
      .catch(error => {
        console.error("Error generating key pair:", error);
        reject(error); // Reject with the error
      });
  });
}

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
  let ciphertextArray = new Uint8Array(ciphertext);
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


async function decryptMessage(key, ciphertext) {

  let decrypted = await window.crypto.subtle.decrypt(
    {
      name: "RSA-OAEP"
    },
    key,
    ciphertext
  );

  let dec = new TextDecoder();
  const decryptedValue = document.querySelector(".rsa-oaep .decrypted-value");
  decryptedValue.classList.add('fade-in');
  decryptedValue.addEventListener('animationend', () => {
    decryptedValue.classList.remove('fade-in');
  });
  decryptedValue.textContent = dec.decode(decrypted);
  console.log(decryptedValue.textContent)

}
