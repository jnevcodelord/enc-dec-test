// Define the endpoint URL and request body
const endpoint = '/sendmessage';
const data = {
  message: 'Hello, world!'
};

// Create a new XMLHttpRequest object
const xhr = new XMLHttpRequest();

// Set the request method, endpoint URL, and asynchronous flag
xhr.open('POST', endpoint, true);

// Set the request header for the content type
xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

// Define the onload event handler
xhr.onload = function () {
  if (xhr.status >= 200 && xhr.status < 400) {
    // Success! Parse the response JSON
    const response = JSON.parse(xhr.responseText);
    console.log('Response:', response);
  } else {
    // Error: Log the status and response text
    console.error('Error:', xhr.status, xhr.responseText);
  }
};

// Define the onerror event handler
xhr.onerror = function () {
  // Error: Log the status and response text
  console.error('Error:', xhr.status, xhr.responseText);
};

// Send the request with the request body as JSON
xhr.send(JSON.stringify(data));
