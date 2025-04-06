const { Client, Databases, Query } = Appwrite; // Globale Appwrite-Objekte aus dem Browser-SDK verwenden
const client = new Client(); // Erstellen Sie eine neue Instanz des Client-Objekts

client
    .setEndpoint('https://cloud.appwrite.io/v1') // Für Appwrite Cloud
    .setProject('67eebf2b001a3c98c38a') // Your project ID
    ;

const databases = new Databases(client); // Create a new instance of the Databases class

function createHeader() {
    const header = document.createElement('header'); // Create a header element
    header.className = 'header'; // Set the class name
    header.innerHTML = `
        <section>
            <a href="index.html" class="logo">
                <img src="images/icons8-calendar-100.png" alt="Logo" class="logo-img">
            </a>
        </section>
        <section>
            <nav class="nav">
                <a href="index.html">Home</a>
                <a href="praktika.html">Praktika</a>
            </nav>
        </section>
    `; // Set the inner HTML
    return header; // Return the header element
}

function createFooter() {
    const footer = document.createElement('footer'); // Create a footer element
    footer.className = 'footer'; // Set the class name
    footer.innerHTML = `
    <section>
        <p>All rights reserved &copy; ${new Date().getFullYear()} by <a class="standart" href="https://github.com/Nino678190">Nino678190</a></p>
    </section>
    `; // Set the inner HTML
    return footer; // Return the footer element
}

function showFilter() {
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
            <button type="button" onclick="displayPraktikasNeu()">Filter</button>
            <button type="button" onclick="resetForm()">Reset</button>
        </form>
    </section>
    `; // Set the inner HTML
    // Add event listener to form inputs to save the values in sessionStorage
    filter.querySelector('form').addEventListener('input', function (event) {
        const input = event.target;
        sessionStorage.setItem(input.name, input.value); // Save the value in sessionStorage
    });
    // Load the saved values from sessionStorage
    if (sessionStorage) {
        const inputs = filter.querySelectorAll('input');
        inputs.forEach(input => {
            const savedValue = sessionStorage.getItem(input.name); // Get the saved value
            if (savedValue) {
                input.value = savedValue; // Set the input value to the saved value
            }
        });
    }
    // Add event listener to the form input to enable the button
    filter.querySelector('form').addEventListener('keydown', function (event) {
        const input = event.target;
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission
            displayPraktikasNeu(); // Call the displayPraktikas function
        }
    });

    // Add event listener to page
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            resetForm(); // Call the resetForm function
        }
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission
            displayPraktikasNeu(); // Call the displayPraktikas function
        }
    });

    return filter; // Return the filter element
}

function resetForm() {
    const inputs = document.querySelectorAll('.filter input'); // Select all input elements in the filter
    inputs.forEach(input => {
        input.value = ''; // Clear the input values
        sessionStorage.clear(); // Remove the saved value from sessionStorage
    });
}

function getFilterData() {
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
        "67eebf55000c4fcc2eac", // Your database ID
        "67eebf7900353b1d71ca", // Your collection IDs
        queries
    ).then(function (response) {
        console.log(response);
        return response;
    }).catch(function (error) {
        console.error("Fehler bei der Datenabfrage:", error);
        return null;
    });
}

function displayPraktikasEndgueltig(elements) {
    const body = document.querySelector('body'); // Select the body element
    body.innerHTML = ''; // Clear the body content
    body.appendChild(createHeader()); // Append the header
    body.appendChild(showFilter()); // Append the filter
    body.appendChild(elements); // Append the praktikas content
    body.appendChild(createFooter()); // Append the footer
}


function displayPraktikas() {
    const body = document.querySelector('body'); // Select the body element
    const MAX_DESCRIPTION_LENGTH = 150; // Maximum visible description length before collapsing

    // Create loading element
    const loadingElement = document.createElement('div');
    loadingElement.textContent = 'Daten werden geladen...';
    body.appendChild(loadingElement);

    // Get the data and process it asynchronously
    getData().then(data => {
        if (!data || !data.documents || data.documents.length === 0) {
            loadingElement.textContent = 'Keine Praktika gefunden.';
            return;
        }

        const main = document.createElement('main');
        main.className = 'praktikas';
        main.innerHTML = `
            <h2>Praktika</h2>`;

        for (let i = 0; i < data.documents.length; i++) {
            const doc = data.documents[i];
            const updatet = doc['$updatedAt'];
            const date = new Date(updatet);
            const formattedDate = date.toLocaleDateString('de-DE', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
            const formattedTime = date.toLocaleTimeString('de-DE', {
                hour: '2-digit',
                minute: '2-digit'
            });
            const formattedDateTime = `${formattedDate} ${formattedTime}`;

            // Initialisiere die Variablen mit leerem Wert (nicht disabled)
            let links ="";
            
            console.log(doc.Link, doc.Email, doc.Tel);
            
            // Füge http:// zum Link hinzu, wenn nötig
            if (doc.Link && doc.Link !== "" && !doc.Link.includes("https://") && !doc.Link.includes("http://")) {
                doc.Link = "http://" + doc.Link;
            }

            if (doc.Email !== "" && doc.Email !== null && doc.Email !== undefined) {
                links += `<a href="mailto:${doc.Email}" target="_blank" class="link">&#128386;</a>`;
            }
            if (doc.Tel !== "" && doc.Tel !== null && doc.Tel !== undefined) {
                links += `<a href="tel:${doc.Tel}" target="_blank" class="link">&#128222;</a>`;
            }
            if (doc.Link !== "" && doc.Link !== null && doc.Link !== undefined) {
                links += `<a href="${doc.Link}" target="_blank" class="link">&#127760;</a>`;
            }
            
            // Format beginn date to DD.MM.YYYY
            let formattedBeginn = "Nicht verfügbar";
            if (doc.Beginn && doc.Beginn !== "") {
                const beginnDate = new Date(doc.Beginn);
                formattedBeginn = beginnDate.toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
            }

            // Process description for partial display
            const description = doc.Beschreibung || "Nicht verfügbar";
            const isLongDescription = description.length > MAX_DESCRIPTION_LENGTH;
            const visibleDescription = isLongDescription
                ? description.substring(0, MAX_DESCRIPTION_LENGTH) + "..."
                : description;

            main.innerHTML += `
                <article class="Praktikumsplatz">
                    <section>
                        <section class="name">
                            <h3>${doc.Name}</h3>
                        </section>
                        <section>
                            <h5>&#128205; ${doc.Ort}</h5>
                        </section>
                        <section>
                            <p>Dauer: ${doc.DauerInT}</p>
                        </section>
                        <section>
                            <p>Letztes Update: ${formattedDateTime}</p>
                        </section>
                    </section>
                    <section class="description-section">
                        <div class="description-visible">${visibleDescription}</div>
                        ${isLongDescription ? `
                        <div class="description-toggle" onclick="toggleDescription(this)">Mehr anzeigen &#9660;</div>
                        <div class="description-full" style="display: none;">
                            <p>${description}</p>
                        </div>` : ''}
                    </section>
                    <section class="right">
                        <section>
                            <h3>${doc.Berufsfeld}</h3>
                        </section>
                        <section>
                            <h4>Plätze: ${doc.AnzahlPlaetze}</h4>
                        </section>
                        <section>
                            <p>Beginn: ${formattedBeginn}</p>
                        </section>
                        <section class="icons">
                            ${links}
                        </section>
                    </section>
                </article>
        `
        }
        // Replace the loading text with the results
        body.removeChild(loadingElement);
        
        // Add toggle function to window object
        window.toggleDescription = function (element) {
            const visibleText = element.previousElementSibling;
            const fullText = element.nextElementSibling;
            const isExpanded = fullText.style.display !== 'none';

            if (isExpanded) {
                visibleText.style.display = 'block';
                fullText.style.display = 'none';
                element.innerHTML = 'Mehr anzeigen &#9660;';
            } else {
                visibleText.style.display = 'none';
                fullText.style.display = 'block';
                element.innerHTML = 'Weniger anzeigen &#9650;';
            }
        };
        console.log(main);
        return main; // Return the main element
    }).catch(error => {
        console.error("Fehler beim Anzeigen der Praktika:", error);
        loadingElement.textContent = 'Fehler beim Laden der Daten.';
    });
}

function getDataFirst() {
    return databases.listDocuments(
        "67eebf55000c4fcc2eac", // Your database ID
        "67eebf7900353b1d71ca", // Your collection IDs
        [Query.limit(25), Query.orderDesc('$updatedAt')]
    ).then(function (response) {
        return response;
    }).catch(function (error) {
        console.error("Fehler bei der Datenabfrage:", error);
        return null;
    });
}

function showPraktikasFirst() {
    const body = document.querySelector('body'); // Select the body element
    const MAX_DESCRIPTION_LENGTH = 150; // Maximum visible description length before collapsing

    // Create loading element
    const loadingElement = document.createElement('div');
    loadingElement.textContent = 'Daten werden geladen...';
    body.appendChild(loadingElement);

    // Get the data and process it asynchronously
    getDataFirst().then(data => {
        if (!data || !data.documents || data.documents.length === 0) {
            loadingElement.textContent = 'Keine Praktika gefunden.';
            return;
        }

        const main = document.createElement('main');
        main.className = 'praktikas';
        main.innerHTML = `
            <h2>Praktika</h2>`;

        for (let i = 0; i < data.documents.length; i++) {
            const doc = data.documents[i];
            const updatet = doc['$updatedAt'];
            const date = new Date(updatet);
            const formattedDate = date.toLocaleDateString('de-DE', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
            const formattedTime = date.toLocaleTimeString('de-DE', {
                hour: '2-digit',
                minute: '2-digit'
            });
            const formattedDateTime = `${formattedDate} ${formattedTime}`;

            // Initialisiere die Variablen mit leerem Wert (nicht disabled)
            let links = "";

            console.log(doc.Link, doc.Email, doc.Tel);

            // Füge http:// zum Link hinzu, wenn nötig
            if (doc.Link && doc.Link !== "" && !doc.Link.includes("https://") && !doc.Link.includes("http://")) {
                doc.Link = "http://" + doc.Link;
            }

            if (doc.Email !== "" && doc.Email !== null && doc.Email !== undefined) {
                links += `<a href="mailto:${doc.Email}" target="_blank" class="link">&#128386;</a>`;
            }
            if (doc.Tel !== "" && doc.Tel !== null && doc.Tel !== undefined) {
                links += `<a href="tel:${doc.Tel}" target="_blank" class="link">&#128222;</a>`;
            }
            if (doc.Link !== "" && doc.Link !== null && doc.Link !== undefined) {
                links += `<a href="${doc.Link}" target="_blank" class="link">&#127760;</a>`;
            }

            // Format beginn date to DD.MM.YYYY
            let formattedBeginn = "Nicht verfügbar";
            if (doc.Beginn && doc.Beginn !== "") {
                const beginnDate = new Date(doc.Beginn);
                formattedBeginn = beginnDate.toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
            }

            // Process description for partial display
            const description = doc.Beschreibung || "Nicht verfügbar";
            const isLongDescription = description.length > MAX_DESCRIPTION_LENGTH;
            const visibleDescription = isLongDescription
                ? description.substring(0, MAX_DESCRIPTION_LENGTH) + "..."
                : description;

            main.innerHTML += `
                <article class="Praktikumsplatz">
                    <section>
                        <section class="name">
                            <h3>${doc.Name}</h3>
                        </section>
                        <section>
                            <h5>&#128205; ${doc.Ort}</h5>
                        </section>
                        <section>
                            <p>Dauer: ${doc.DauerInT}</p>
                        </section>
                        <section>
                            <p>Letztes Update: ${formattedDateTime}</p>
                        </section>
                    </section>
                    <section class="description-section">
                        <div class="description-visible">${visibleDescription}</div>
                        ${isLongDescription ? `
                        <div class="description-toggle" onclick="toggleDescription(this)">Mehr anzeigen &#9660;</div>
                        <div class="description-full" style="display: none;">
                            <p>${description}</p>
                        </div>` : ''}
                    </section>
                    <section class="right">
                        <section>
                            <h3>${doc.Berufsfeld}</h3>
                        </section>
                        <section>
                            <h4>Plätze: ${doc.AnzahlPlaetze}</h4>
                        </section>
                        <section>
                            <p>Beginn: ${formattedBeginn}</p>
                        </section>
                        <section class="icons">
                            ${links}
                        </section>
                    </section>
                </article>
        `
        }

        // Replace the loading text with the results
        body.removeChild(loadingElement);
        body.insertBefore(main, body.lastChild);
        
        // Add toggle function to window object
        window.toggleDescription = function(element) {
            const visibleText = element.previousElementSibling;
            const fullText = element.nextElementSibling;
            const isExpanded = fullText.style.display !== 'none';
            
            if (isExpanded) {
                visibleText.style.display = 'block';
                fullText.style.display = 'none';
                element.innerHTML = 'Mehr anzeigen &#9660;';
            } else {
                visibleText.style.display = 'none';
                fullText.style.display = 'block';
                element.innerHTML = 'Weniger anzeigen &#9650;';
            }
        };
    }).catch(error => {
        console.error("Fehler beim Anzeigen der Praktika:", error);
        loadingElement.textContent = 'Fehler beim Laden der Daten.';
    });
}

function createPraktikasElement(data) {
    const MAX_DESCRIPTION_LENGTH = 150;

    // Main-Element erstellen
    const main = document.createElement('main');
    main.className = 'praktikas';
    main.innerHTML = '<h2>Praktika</h2>';

    if (!data || !data.documents || data.documents.length === 0) {
        main.innerHTML += '<p>Keine Praktika gefunden.</p>';
        return main;
    }

    // Daten verarbeiten und anzeigen
    data.documents.forEach(doc => {
        const updatet = doc['$updatedAt'];
        const date = new Date(updatet);
        const formattedDate = date.toLocaleDateString('de-DE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        const formattedTime = date.toLocaleTimeString('de-DE', {
            hour: '2-digit',
            minute: '2-digit'
        });
        const formattedDateTime = `${formattedDate} ${formattedTime}`;

        // Links erstellen
        let links = "";

        // Füge http:// zum Link hinzu, wenn nötig
        if (doc.Link && doc.Link !== "" && !doc.Link.includes("https://") && !doc.Link.includes("http://")) {
            doc.Link = "http://" + doc.Link;
        }

        if (doc.Email !== "" && doc.Email !== null && doc.Email !== undefined) {
            links += `<a href="mailto:${doc.Email}" target="_blank" class="link">&#128386;</a>`;
        }
        if (doc.Tel !== "" && doc.Tel !== null && doc.Tel !== undefined) {
            links += `<a href="tel:${doc.Tel}" target="_blank" class="link">&#128222;</a>`;
        }
        if (doc.Link !== "" && doc.Link !== null && doc.Link !== undefined) {
            links += `<a href="${doc.Link}" target="_blank" class="link">&#127760;</a>`;
        }

        // Format beginn date to DD.MM.YYYY
        let formattedBeginn = "Nicht verfügbar";
        if (doc.Beginn && doc.Beginn !== "") {
            const beginnDate = new Date(doc.Beginn);
            formattedBeginn = beginnDate.toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }

        // Process description for partial display
        const description = doc.Beschreibung || "Nicht verfügbar";
        const isLongDescription = description.length > MAX_DESCRIPTION_LENGTH;
        const visibleDescription = isLongDescription
            ? description.substring(0, MAX_DESCRIPTION_LENGTH) + "..."
            : description;

        main.innerHTML += `
            <article class="Praktikumsplatz">
                <section>
                    <section class="name">
                        <h3>${doc.Name}</h3>
                    </section>
                    <section>
                        <h5>&#128205; ${doc.Ort}</h5>
                    </section>
                    <section>
                        <p>Dauer: ${doc.DauerInT}</p>
                    </section>
                    <section>
                        <p>Letztes Update: ${formattedDateTime}</p>
                    </section>
                </section>
                <section class="description-section">
                    <div class="description-visible">${visibleDescription}</div>
                    ${isLongDescription ? `
                    <div class="description-toggle" onclick="toggleDescription(this)">Mehr anzeigen &#9660;</div>
                    <div class="description-full" style="display: none;">
                        <p>${description}</p>
                    </div>` : ''}
                </section>
                <section class="right">
                    <section>
                        <h3>${doc.Berufsfeld}</h3>
                    </section>
                    <section>
                        <h4>Plätze: ${doc.AnzahlPlaetze}</h4>
                    </section>
                    <section>
                        <p>Beginn: ${formattedBeginn}</p>
                    </section>
                    <section class="icons">
                        ${links}
                    </section>
                </section>
            </article>
        `;
    });

    return main;
}

function showPraktikas() {
    const body = document.querySelector('body'); // Select the body element
    body.innerHTML = ''; // Clear the body content
    body.appendChild(createHeader()); // Append the header
    body.appendChild(showFilter()); // Append the filter
    showPraktikasFirst(); // Show the praktikas
    body.appendChild(createFooter()); // Append the footer
}

async function displayPraktikasNeu() {
    const body = document.querySelector('body');
    body.innerHTML = '';
    body.appendChild(createHeader());
    body.appendChild(showFilter());
    
    // Lade-Element erstellen und anzeigen
    const loadingElement = document.createElement('div');
    loadingElement.textContent = 'Daten werden geladen...';
    body.appendChild(loadingElement);
    
    // Daten asynchron laden und verarbeiten
    await getData().then(data => {
        // Lade-Element entfernen
        body.removeChild(loadingElement);
        
        // Element erstellen und anzeigen
        const praktikasElement = createPraktikasElement(data);
        body.appendChild(praktikasElement);
        
        // Add toggle function to window object
        window.toggleDescription = function(element) {
            const visibleText = element.previousElementSibling;
            const fullText = element.nextElementSibling;
            const isExpanded = fullText.style.display !== 'none';
            
            if (isExpanded) {
                visibleText.style.display = 'block';
                fullText.style.display = 'none';
                element.innerHTML = 'Mehr anzeigen &#9660;';
            } else {
                visibleText.style.display = 'none';
                fullText.style.display = 'block';
                element.innerHTML = 'Weniger anzeigen &#9650;';
            }
        };
    })
    .catch(error => {
        console.error("Fehler beim Anzeigen der Praktika:", error);
        loadingElement.textContent = 'Fehler beim Laden der Daten.';
    });
    
    body.appendChild(createFooter());
}

function createHome() {
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
