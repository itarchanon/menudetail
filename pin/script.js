document.addEventListener("DOMContentLoaded", () => {
    const selectedList = document.getElementById("selected-list");
    const ingredientButtons = document.querySelectorAll(".ingredient-btn");
    const searchBtn = document.getElementById("search-btn");
    const resetBtn = document.getElementById("reset-btn");
    const recipeResult = document.getElementById("recipe-result");
    const howToCookBtn = document.getElementById("how-to-cook");
    const toggleSidebarBtn = document.getElementById("toggleSidebar");

    let selectedIngredients = [];

    // Ingredient button click event
    ingredientButtons.forEach(button => {
        button.addEventListener("click", () => {
            if (!selectedIngredients.includes(button.innerText)) {
                selectedIngredients.push(button.innerText);
                updateSelectedIngredients();
            }
        });
    });

    // Update the selected ingredients list
    function updateSelectedIngredients() {
        selectedList.innerHTML = "";
        selectedIngredients.forEach(ingredient => {
            const span = document.createElement("span");
            span.textContent = ingredient;
            span.classList.add("selected-item");

            const removeBtn = document.createElement("button");
            removeBtn.textContent = "x";
            removeBtn.addEventListener("click", () => {
                selectedIngredients = selectedIngredients.filter(i => i !== ingredient);
                updateSelectedIngredients();
            });

            span.appendChild(removeBtn);
            selectedList.appendChild(span);
        });
    }

    // Search button click event
    searchBtn.addEventListener("click", () => {
        fetch("recipes.json")  // Replace with actual JSON or API endpoint
            .then(response => response.json())
            .then(data => {
                const matchedRecipes = data.recipes.filter(recipe =>
                    recipe.ingredients.some(i => selectedIngredients.includes(i))
                );

                if (matchedRecipes.length > 0) {
                    displayRecipe(matchedRecipes);  // Show all matched recipes
                } else {
                    alert("No matching recipes found!");
                }
            });
    });

    // Reset button click event
    resetBtn.addEventListener("click", () => {
        selectedIngredients = [];
        updateSelectedIngredients();
        recipeResult.style.display = "none";  // Hide recipe result
        howToCookBtn.style.display = "none"; // Hide "How to Cook" button
    });

    // Display recipe function
    function displayRecipe(recipes) {
        recipeResult.style.display = "block";  // Show the recipe result section
        howToCookBtn.style.display = "inline-block"; // Show the "How to Cook" button

        // Clear existing recipe information
        const recipeContainer = document.getElementById("recipe-result");
        recipeContainer.innerHTML = "<h3>Recipe(s)</h3>";  // Add a title for the recipe section

        // Display each matching recipe
        recipes.forEach(recipe => {
            const recipeCard = document.createElement("div");
            recipeCard.classList.add("recipe-card");

            const recipeImage = document.createElement("img");
            recipeImage.src = recipe.image;
            recipeImage.alt = recipe.name;

            const recipeName = document.createElement("p");
            recipeName.innerHTML = `<strong>Name:</strong> ${recipe.name}`;

            const recipeIngredients = document.createElement("p");
            recipeIngredients.innerHTML = `<strong>Ingredients:</strong> ${recipe.ingredients.join(", ")}`;

            const recipeMissing = document.createElement("p");
            recipeMissing.innerHTML = `<strong>Missing Ingredients:</strong> ${recipe.missing ? recipe.missing.join(", ") : "None"}`;

            recipeCard.appendChild(recipeImage);
            recipeCard.appendChild(recipeName);
            recipeCard.appendChild(recipeIngredients);
            recipeCard.appendChild(recipeMissing);

            recipeContainer.appendChild(recipeCard);
        });
    }

    // Toggle sidebar visibility
    toggleSidebarBtn.addEventListener("click", () => {
        document.body.classList.toggle("sidebar-closed");
    });

    // How to cook button click event (you can add a specific functionality here)
    howToCookBtn.addEventListener("click", () => {
        alert("Instructions for cooking will be displayed here.");
    });
});
