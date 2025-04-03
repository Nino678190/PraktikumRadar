import { Client, Databases } from "appwrite"; // Importing the Client and Databases classes from the appwrite package
const client = new Client(); // Create a new instance of the Client class

client
    .setEndpoint('http://localhost/v1') // Your API Endpoint
    .setProject('67eebf55000c4fcc2eac') // Your project ID
;

const databases = new Databases(client); // Create a new instance of the Databases class

databases.listDocuments( // List all documents in a collection
    "67eebf55000c4fcc2eac",
    "67eebf7900353b1d71ca",
    [
        Query.equal('title', 'Avatar') // Query to filter documents
    ]
).then(function (response) {
    console.log(response); // Log the response
}, function (error) {
    console.log(error); // Log any errors
});