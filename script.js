const { Client, Databases, Query } = Appwrite; // Globale Appwrite-Objekte aus dem Browser-SDK verwenden
const client = new Client(); // Erstellen Sie eine neue Instanz des Client-Objekts

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
        <a href="praktika.html" class="logo">
            <img src="assets/logo.png" alt="Logo">
        </a>
        <nav class="nav">
            <a href="index.html">Home</a>
            <a href="praktika.html">Praktikas</a>
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
            <label for="Dauer">Dauer(in Tagen):</label>
            <input type="number" id="dauer" name="dauer">
            <button type="button" onclick="displayPraktikas()">Filter</button>
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
    let queries = []; // Create a query object
    const filter = getFilterData(); // Get the filter data
    const name = filter.name; // Get the name from the filter
    const ort = filter.ort; // Get the ort from the filter
    const berufsfeld = filter.berufsfeld; // Get the berufsfeld from the filter
    const beginn = filter.beginn; // Get the beginn from the filter
    const dauer = filter.dauer; // Get the dauer from the filter
    
    // Korrigiere die Suche: Stelle sicher, dass der Parameter ein String ist
    if (name) queries.push(Query.search('Name', String(name))); 
    if (ort) queries.push(Query.search('Ort', String(ort))); 
    if (berufsfeld) queries.push(Query.search('Berufsfeld', String(berufsfeld))); 
    
    if (beginn) queries.push(Query.lessThanEqual('Beginn', beginn)); 
    if (dauer) queries.push(Query.lessThanEqual('Dauer', parseInt(dauer))); 
    
    queries.push(Query.limit(25)); 
    queries.push(Query.orderDesc('$updatedAt')); 
    
    return databases.listDocuments(
        "67eebf55000c4fcc2eac",
        "67eebf7900353b1d71ca",
        queries
    ).then(function (response) {
        console.log(response);
        return response;
    }).catch(function (error) {
        console.log("Fehler bei der Datenabfrage:", error);
        return null;
    });
}

function displayPraktikasEndgueltig(elements){
    const body = document.querySelector('body'); // Select the body element
    body.innerHTML = ''; // Clear the body content
    body.appendChild(createHeader()); // Append the header
    body.appendChild(showFilter()); // Append the filter
    body.appendChild(elements); // Append the praktikas content
    body.appendChild(createFooter()); // Append the footer
}


function displayPraktikas() {
    // Erzeugte vor dem Anzeigen ein Lade-Element
    const loadingElement = document.createElement('div');
    loadingElement.textContent = 'Daten werden geladen...';
    
    const body = document.querySelector('body');
    body.innerHTML = '';
    body.appendChild(createHeader());
    body.appendChild(showFilter());
    body.appendChild(loadingElement);
    body.appendChild(createFooter());
    
    // Daten abrufen und anzeigen
    getData().then(data => {
        if (!data || !data.documents || data.documents.length === 0) {
            loadingElement.textContent = 'Keine Praktika gefunden.';
            return;
        }
        
        const main = document.createElement('main');
        main.className = 'praktikas';
        
        for (let i = 0; i < data.documents.length; i++) {
            const doc = data.documents[i];
            main.innerHTML += `
            <section>
                <p>${doc.Name || "Nicht verfügbar"}</p>
                <p>${doc.Ort || "Nicht verfügbar"}</p>
                <p>${doc.Beschreibung || "Nicht verfügbar"}</p>
                <p>${doc.Berufsfeld || "Nicht verfügbar"}</p>
                <p>${doc.Email || "Nicht verfügbar"}</p>
                <p>${doc.Tel || "Nicht verfügbar"}</p>
                <p>${doc.Link || "Nicht verfügbar"}</p>
                <p>${doc.AnzahlPlaetze || "Nicht verfügbar"}</p>
                <p>${doc.Dauer || "Nicht verfügbar"}</p>
                <p>${doc.Beginn || "Nicht verfügbar"}</p>
                <p>${doc['$updatedAt'] || "Nicht verfügbar"}</p>
            </section>
            `;
        }
        
        // Ersetze den Loading-Text mit den Ergebnissen
        body.removeChild(loadingElement);
        body.insertBefore(main, body.lastChild);
    });
}

function showPraktikas(){
    const body = document.querySelector('body'); // Select the body element
    body.innerHTML = ''; // Clear the body content
    body.appendChild(createHeader()); // Append the header
    body.appendChild(showFilter()); // Append the filter
    // body.appendChild(displayPraktikas()); // Append the praktikas content
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
