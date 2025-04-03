const { Client, Databases, Query } = require("appwrite"); // Importing the Client and Databases classes from the appwrite package
const client = new Client(); // Create a new instance of the Client class

client
    .setEndpoint('https://cloud.appwrite.io/v1') // Für Appwrite Cloud
    .setProject('67eebf2b001a3c98c38a') // Your project ID
;

const databases = new Databases(client); // Create a new instance of the Databases class

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

function showFilter(){
    const filter = document.createElement('div'); // Create a filter element
    filter.className = 'filter'; // Set the class name
    filter.innerHTML = `
    <section>
        <h2>Filter</h2>
        <form>
            <label for="name">Name:</label>
            <input type="text" id="name" name="name">
            <label for="ort">Ort:</label>
            <input type="text" id="ort" name="ort">
            <label for="berufsfeld">Berufsfeld:</label>
            <input type="text" id="berufsfeld" name="berufsfeld">
            <label for="Beginn">Beginn:</label>
            <input type="date" id="beginn" name="beginn">
            <label for="Dauer">Dauer:</label>
            <input type="number" id="dauer" name="dauer">
            <button type="submit" onclick="displayPraktikas()">Filter</button>
        </form>
    </section>
    `; // Set the inner HTML
    return filter; // Return the filter element
}

function getFilterData(){
    let name = document.getElementById('name').value; // Get the name value
    let ort = document.getElementById('ort').value; // Get the ort value
    let berufsfeld = document.getElementById('berufsfeld').value; // Get the berufsfeld value
    let beginn = document.getElementById('beginn').value; // Get the beginn value
    let dauer = document.getElementById('dauer').value; // Get the dauer value
    // Check if the fields are empty and set them to null
    if (name === '') name = null;
    if (ort === '') ort = null;
    if (berufsfeld === '') berufsfeld = null;
    if (beginn === '') beginn = null;
    if (dauer === '') dauer = null;
    // Return the filter data
    return { name, ort, berufsfeld, beginn, dauer }; // Return the filter data
}

function getData() {
    const filter = getFilterData(); // Get the filter data
    const name = filter.name; // Get the name from the filter
    const ort = filter.ort; // Get the ort from the filter
    const berufsfeld = filter.berufsfeld; // Get the berufsfeld from the filter
    const beginn = filter.beginn; // Get the beginn from the filter
    const dauer = filter.dauer; // Get the dauer from the filter
    // Create a query object
    const query = [];
    if (name) query.push(Query.contains('Name', name)); // If name is not null, add it to the query
    if (ort) query.push(Query.contains('Ort', ort)); // If ort is not null, add it to the query
    if (berufsfeld) query.push(Query.contains('Berufsfeld', berufsfeld)); // If berufsfeld is not null, add it to the query
    if (beginn) query.push(Query.lessThanEqual('Beginn', beginn)); // If beginn is not null, add it to the query
    if (dauer) query.push(Query.lessThanEqual('Dauer', dauer)); // If dauer is not null, add it to the query
    databases.listDocuments( // List all documents in a collection
        "67eebf55000c4fcc2eac",
        "67eebf7900353b1d71ca",
        [ // Query parameters
            query
        ]
    ).then(function (response) {
        console.log(response); // Log the response
        return response; // Return the response
    }, function (error) {
        console.log(error); // Log any errors
    });
}


function displayPraktikas(){
    const data = getData(); // Get data from the database
    if (!data) return; // If no data, return
    const main = document.createElement('main'); // Create a main element
    main.className = 'praktikas'; // Set the class name
    for (let i = 0; i < data.documents.length; i++) { // Loop through the documents
        const doc = data.documents[i]; // Get the document
        main.innerHTML += `
        <section>
            <p>${doc.Name || "Nicht verfügbar"}</p>
            <p>${doc.Ort || "Nicht verfügbar"}}</p>
            <p>${doc.Beschreibung || "Nicht verfügbar"}}</p>
            <p>${doc.Berufsfeld || "Nicht verfügbar"}}</p>
            <p>${doc.Email || "Nicht verfügbar"}}</p>
            <p>${doc.Tel || "Nicht verfügbar"}}</p>
            <p>${doc.Link || "Nicht verfügbar"}}</p>
            <p>${doc.AnzahlPlaetze || "Nicht verfügbar"}}</p>
            <p>${doc.Dauer || "Nicht verfügbar"}}</p>
            <p>${doc.Beginn || "Nicht verfügbar"}}</p>
            <p>${doc['$updatedAt'] || "Nicht verfügbar"} </p>
        </section>
        `; // Set the inner HTML
    }
    return main; // Return the main element
}

function showPraktikas(){
    const body = document.querySelector('body'); // Select the body element
    body.innerHTML = ''; // Clear the body content
    body.appendChild(createHeader()); // Append the header
    body.appendChild(displayPraktikas()); // Append the praktikas content
    body.appendChild(createFooter()); // Append the footer
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

