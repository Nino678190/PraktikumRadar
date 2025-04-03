const { Client, Databases } = require("appwrite"); // Importing the Client and Databases classes from the appwrite package
const client = new Client(); // Create a new instance of the Client class

client
    .setEndpoint('https://cloud.appwrite.io/v1') // Für Appwrite Cloud
    .setProject('67eebf2b001a3c98c38a') // Your project ID
;

const databases = new Databases(client); // Create a new instance of the Databases class

function getData(){
    databases.listDocuments( // List all documents in a collection
        "67eebf2b001a3c98c38a",
        "67eebf7900353b1d71ca",
    ).then(function (response) {
        console.log(response); // Log the response
        return response; // Return the response
    }, function (error) {
        console.log(error); // Log any errors
    });
}

function createHeader(){
    const header = document.createElement('header'); // Create a header element
    header.className = 'header'; // Set the class name
    header.innerHTML = `
    <section>
        <a onclick="showHome()" class="logo">
            <img src="assets/logo.png" alt="Logo">
        </a>
        <nav class="nav">
            <a onclick="showHome()">Home</a>
            <a onclick="showPraktikas()">Praktikas</a>
        </nav>
    </section>
    `; // Set the inner HTML
    return header; // Return the header element
}

function createFooter(){
    const footer = document.createElement('footer'); // Create a footer element
    footer.className = 'footer'; // Set the class name
    footer.innerHTML = `
    <section>
        <p>All rights reserved &copy; ${new Date().getFullYear()} by <a href="https://github.com/Nino678190">Nino678190</a></p>
    </section>
    `; // Set the inner HTML
    return footer; // Return the footer element
}

function showPraktikas(){
    const data = getData(); // Get data from the database
    if (!data) return; // If no data, return
    const main = document.createElement('main'); // Create a main element
    main.className = 'praktikas'; // Set the class name

}

function createHome(){
    const main = document.createElement('main'); // Create a main element
    main.className = 'home';
    main.innerHTML = `
    <section>
        <h1>Welcome to the Home Page</h1>
        <p>This is the home page content.</p>
    </section>
    `; // Set the inner HTML
    return main; // Return the main element
}

function loadHome() {
    const body = document.querySelector('body'); // Select the body element
    body.innerHTML = ''; // Clear the body content
    body.appendChild(createHeader()); // Append the header
    body.appendChild(createHome()); // Append the home content
    body.appendChild(createFooter()); // Append the footer
}

getData(); // Call the getData function to fetch data