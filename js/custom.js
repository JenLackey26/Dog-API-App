 // The data we need:
 // 1. The breed and temperament from the form
 // 2. The dog information we get back from the API

const form = document.querySelector("#dog-form");
const results = document.querySelector("#results");

// Wait for the user to submit the form
form.addEventListener("submit", onFormSubmit);

// This function runs when the form is submitted
function onFormSubmit(event) {
    // Stop the page from refreshing
    event.preventDefault();

    // Get the information from the form
    const formData = new FormData(event.target);

    // Turn the form information into a JavaScript object
    const dataObject = Object.fromEntries(formData.entries());

    // Send the breed and temperament to our API function
    getDogs(dataObject.breed, dataObject.temperament);
}

// Get the dog data from the API and filter the results
function getDogs(breed, temperament) {
    // Your Dog API key goes here
    const apiKey = "live_Ey6jlrjWcd3oeoEw8FstzKBqrjFjB07osezIPdXcNz5LCDC5arXTVI8a7wFzsnDR";

    // The URL for The Dog API
    const apiUrl = "https://api.thedogapi.com/v1/breeds";

    // Show a message while we look for dogs
    results.textContent = "Loading dogs...";

    // Request the dog data from the API
    fetch(apiUrl, {
        headers: {
            "x-api-key": apiKey
        }
    })
        .then((response) => {
            // Check whether the request worked
            if (!response.ok) {
                throw new Error("Something went wrong with the API request");
            }

            // Convert the response into JavaScript data
            return response.json();
        })
        .then((dogs) => {
            // Check the dog data in the Console
            console.log("Data from API:", dogs);

            // Keep only the dogs that match the search
            const filteredDogs = dogs.filter((dog) => {
                // Check the breed name
                const matchesBreed = dog.name
                    .toLowerCase()
                    .includes(breed.trim().toLowerCase());

                // Check the temperament
                const dogTemperaments = dog.temperament || "";

                const matchesTemperament = dogTemperaments
                    .split(",")
                    .some((trait) => {
                        return trait.trim().toLowerCase() ===
                            temperament.trim().toLowerCase();
                    });

                // If no breed was entered, any breed can match
                const breedMatches = breed.trim() === "" || matchesBreed;

                // If no temperament was selected, any temperament can match
                const temperamentMatches =
                    temperament === "" || matchesTemperament;

                // The dog must match both selected filters
                return breedMatches && temperamentMatches;
            });

            // Send the matching dogs to the display function
            displayDogs(filteredDogs);
        })
        .catch((error) => {
            // Show the error in the Console
            console.error("Error fetching dogs:", error);

            // Show an error message on the webpage
            results.textContent =
                "Sorry, something went wrong. Please try again.";
        });
}

// Display the matching dogs on the webpage
function displayDogs(dogs) {
    // Remove the previous results
    results.replaceChildren();

    // Show a message if no dogs match
    if (dogs.length === 0) {
        results.textContent = "No dogs found. Try another search.";
        return;
    }

    // Go through the matching dogs one at a time
    dogs.forEach((dog) => {
        // Create a container for each dog
        const dogCard = document.createElement("div");
        dogCard.classList.add("dog-card");

        // Create a heading for the breed name
        const name = document.createElement("h2");
        name.textContent = dog.name;

        // Create a paragraph for the life span
        const lifeSpan = document.createElement("p");
        lifeSpan.textContent =
            "Life Span: " + (dog.life_span || "Life span unknown");

        // Create a paragraph for the temperament
        const temperament = document.createElement("p");
        temperament.textContent =
            "Temperament: " + (dog.temperament || "Temperament unknown");

       // Create the dog image
        const image = document.createElement("img");

        // Use the API image, or show a placeholder
        const placeholderImage =
            "https://placehold.co/300x200?text=No+Image";

        image.src = dog.image?.url || placeholderImage;
        image.alt = `Photo of ${dog.name}`;
        image.loading = "lazy";

        // If the API image fails to load, show the placeholder
        image.onerror = function () {
            image.onerror = null;
            image.src = placeholderImage;
        };

        // Add the information to the dog card
        dogCard.append(image, name, lifeSpan, temperament);

        // Add the dog card to the webpage
        results.appendChild(dogCard);
    });
}