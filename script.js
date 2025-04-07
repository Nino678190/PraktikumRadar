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
        <p>All rights reserved &copy; ${new Date().getFullYear()} by <a class="standart" href="https://nino678190.github.io/nic-tolksdorf/">Nino678190</a></p>
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
            <section>
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" placeholder="Name des Unternehmens">
            </section>
            <section>
                <label for="ort">Ort:</label>
                <input type="text" id="ort" name="ort" placeholder="Ort des Praktikums">
            </section>
            <section>
                <label for="berufsfeld">Berufsfeld:</label>
                <select id="berufsfeld" name="berufsfeld">
                    <option value="">Berufsfeld auswählen</option>
                    <option value="Naturwissenschaften & Technik">Naturwissenschaften & Technik</option>
                    <option value="IT & Informatik">IT & Informatik</option>
                    <option value="Gesundheit & Soziales">Gesundheit & Soziales</option>
                    <option value="Bildung & Wissenschaft">Bildung & Wissenschaft</option>
                    <option value="Kunst, Kultur & Medien">Kunst, Kultur & Medien</option>
                    <option value="Handwerk & Technik">Handwerk & Technik</option>
                    <option value="Wirtschaft & Verwaltung">Wirtschaft & Verwaltung</option>
                    <option value="Recht & Sicherheit">Recht & Sicherheit</option>
                    <option value="Verkehr, Logistik & Tourismus">Verkehr, Logistik & Tourismus</option>
                    <option value="Landwirtschaft, Umwelt & Natur">Landwirtschaft, Umwelt & Natur</option>
                </select>
            </section>
            <section>
                <label for="Beginn">Beginn:</label>
                <input type="date" id="beginn" name="beginn">
            </section>
            <section>
                <label for="Dauer">Dauer(in Tagen):</label>
                <input type="number" id="dauer" name="dauer" placeholder="Dauer in Tagen">
            </section>
            <button type="button" onclick="showPraktikas()">Filter</button>
            <button type="button" onclick="resetForm()">Reset</button>
        </form>
    </section>
    `; // Set the inner HTML
    // Add event listener to form inputs to save the values in sessionStorage
    filter.querySelector('form').addEventListener('input', function (event) {
        sessionStorage.setItem(event.target.name, event.target.value); // Direkte Verwendung von event.target
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
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission
            displayPraktikas(); // Geändert zu displayPraktikas
        }
    });

    // Add event listener to page
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            resetForm(); // Call the resetForm function
        }
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission
            displayPraktikas(); // Geändert zu displayPraktikas
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
    const select = document.querySelector('.filter select'); // Select the select element in the filter
    if (select) {
        select.selectedIndex = 0; // Reset the select element to the first option
    }
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

    if (beginn) queries.push(Query.greaterThanEqual('Beginn', beginn));
    if (dauer) queries.push(Query.lessThanEqual('Dauer', parseInt(dauer)));

    queries.push(Query.limit(25));
    queries.push(Query.orderDesc('$updatedAt'));

    return databases.listDocuments(
        "67eebf55000c4fcc2eac", // Your database ID
        "67eebf7900353b1d71ca", // Your collection IDs
        queries
    ).then(function (response) {
        return response;
    }).catch(function (error) {
        console.error("Fehler bei der Datenabfrage:", error);
        return null;
    });
}

async function displayPraktikas() {
    const body = document.querySelector('body'); // Select the body element
    const MAX_DESCRIPTION_LENGTH = 150; // Maximum visible description length before collapsing
    const mainElement = body.querySelector('main');
    if (mainElement) {
        body.removeChild(mainElement); // Remove the previous main element if it exists
    }
    // Create loading element
    const loadingElement = document.createElement('div');
    loadingElement.textContent = 'Daten werden geladen...';
    body.appendChild(loadingElement);

    // Get the data and process it asynchronously
    await getData().then(data => {
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

            let links ="";
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
        body.appendChild(main); // Append the main element to the body
        return main; // Return the main element
    }).catch(error => {
        console.error("Fehler beim Anzeigen der Praktika:", error);
        loadingElement.textContent = 'Fehler beim Laden der Daten.';
    });
}

async function showPraktikas() {
    const body = document.querySelector('body'); // Select the body element
    body.innerHTML = ''; // Clear the body content
    body.appendChild(createHeader()); // Append the header
    body.appendChild(showFilter()); // Append the filter

    document.getElementById("berufsfeld").addEventListener("change", function () {
        const options = this.options;
        for (let i = 0; i < options.length; i++) {
            if (options[i].value === "") {
                options[i].disabled = true;
                break;
            }
        }
    });
    await displayPraktikas(); // Die Funktion fügt ihre Ergebnisse selbst ein
    body.appendChild(createFooter()); // Append the footer
}
function createHome() {
    const main = document.createElement('main'); // Create a main element
    main.className = 'home';
    main.innerHTML = `
    <main>
        <h1>Willkommen bei PraktikumRadar</h1>

        <p>
        PraktikumRadar ist deine Anlaufstelle, wenn du nach einem passenden Praktikumsplatz suchst.
        Egal, ob du gerade noch zur Schule gehst oder schon erste Berufserfahrungen sammeln möchtest –
        bei uns findest du eine Vielzahl an Angeboten aus ganz unterschiedlichen Bereichen.
        </p>

        <p>
        Die Praktikumsplätze werden von engagierten Unternehmen, Organisationen und Institutionen bereitgestellt,
        die jungen Menschen wie dir einen Einblick in den Berufsalltag ermöglichen wollen. Du kannst dich in Ruhe umsehen,
        verschiedene Berufsfelder entdecken und herausfinden, was zu dir passt.
        </p>

        <h2>Was bietet dir diese Seite?</h2>

        <p>
        Wir bieten dir eine wachsende Sammlung an Praktikumsangeboten – sortiert nach Berufsfeldern und Regionen.
        Zu jedem Eintrag findest du eine Beschreibung, Informationen zur Dauer, zum Ort und natürlich die Kontaktdaten.
        So kannst du dich direkt beim jeweiligen Unternehmen bewerben – ganz unkompliziert.
        </p>

        <p>
        <b>Wichtig:</b> Diese Plattform dient ausschließlich zur Orientierung und Information.
        Eine Bewerbung ist nicht über diese Seite möglich. Bitte nimm direkt Kontakt zum Anbieter des Praktikums auf.
        </p>

        <h2>Für Unternehmen</h2>

        <p>
        Sie möchten jungen Menschen die Möglichkeit geben, erste Erfahrungen in Ihrem Berufsfeld zu sammeln?
        Dann freuen wir uns, wenn Sie Ihr Praktikumsangebot bei uns einreichen!
        Bitte senden Sie uns dazu eine E-Mail mit folgenden Informationen:
        </p>

        <ul>
        <li>Name und Beschreibung Ihres Unternehmens</li>
        <li>Ort und Zeitraum des Praktikums</li>
        <li>Eine kurze Beschreibung der Aufgaben</li>
        <li>Kontaktdaten für Rückfragen und Bewerbungen</li>
        </ul>

        <p>
        Schicken Sie Ihre Angaben bitte an: <strong>PraktikumRadar@example.org</strong>
        </p>

        <h2>Gemeinsam Perspektiven schaffen</h2>

        <p>
        Ein Praktikum kann der erste Schritt in die berufliche Zukunft sein.
        Wir möchten Schüler:innen, Studierenden und anderen Interessierten helfen, diesen Schritt mit möglichst viel Orientierung und Unterstützung zu gehen.
        Schön, dass du hier bist!
        </p>

    </main>
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
