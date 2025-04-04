document.addEventListener("DOMContentLoaded", () => {
    const selectedList = document.getElementById("selected-list");
    const ingredientButtons = document.querySelectorAll(".ingredient-btn");
    const searchBtn = document.getElementById("search-btn");
    const randomBtn = document.getElementById("random-btn");
    const recipeResult = document.getElementById("recipe-result");
    const toggleSidebarBtn = document.getElementById("toggleSidebar");

    let selectedIngredients = [];

    ingredientButtons.forEach(button => {
        button.addEventListener("click", () => {
            if (!selectedIngredients.includes(button.innerText)) {
                selectedIngredients.push(button.innerText);
                updateSelectedIngredients();
            }
        });
    });

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

    searchBtn.addEventListener("click", () => {
        fetch("recipes.json")
            .then(response => response.json())
            .then(data => {
                const matchedRecipes = data.recipes.filter(recipe =>
                    recipe.ingredients.some(i => selectedIngredients.includes(i))
                );

                if (matchedRecipes.length > 0) {
                    displayRecipes(matchedRecipes);
                } else {
                    alert("No matching recipes found!");
                }
            });
    });

    randomBtn.addEventListener("click", () => {
        fetch("recipes.json")
            .then(response => response.json())
            .then(data => {
                const randomRecipe = data.recipes[Math.floor(Math.random() * data.recipes.length)];
                const missing = randomRecipe.ingredients.filter(ing => !selectedIngredients.includes(ing));
                randomRecipe.missing = missing;
                displayRecipe(randomRecipe);
            });
    });

    function displayRecipes(recipes) {
        const resultsContainer = document.getElementById("recipe-result");
        resultsContainer.innerHTML = "";
        recipes.forEach(recipe => {
            const recipeDiv = document.createElement("div");
            recipeDiv.classList.add("recipe");

            const recipeName = document.createElement("h4");
            recipeName.textContent = recipe.name;

            const recipeImage = document.createElement("img");
            recipeImage.src = recipe.image;
            recipeImage.alt = recipe.name;
            recipeImage.style.width = "100%";
            recipeImage.style.height = "auto";
            recipeImage.style.borderRadius = "10px";

            const recipeIngredients = document.createElement("p");
            recipeIngredients.innerHTML = `<strong>Ingredients:</strong> ${recipe.ingredients.join(", ")}`;

            const missingIngredients = document.createElement("p");
            missingIngredients.innerHTML = `<strong>Missing Ingredients:</strong> ${recipe.missing.join(", ")}`;

            recipeDiv.appendChild(recipeName);
            recipeDiv.appendChild(recipeImage);
            recipeDiv.appendChild(recipeIngredients);
            recipeDiv.appendChild(missingIngredients);

            resultsContainer.appendChild(recipeDiv);
        });
        resultsContainer.style.display = "block";
    }

    function displayRecipe(recipe) {
        document.getElementById("recipe-name").textContent = recipe.name;
        document.getElementById("recipe-ingredients").textContent = selectedIngredients.filter(i => recipe.ingredients.includes(i)).join(", ");
        document.getElementById("recipe-missing").textContent = recipe.missing.join(", ");
        document.getElementById("recipe-image").src = recipe.image;
        recipeResult.style.display = "block";
    }

    toggleSidebarBtn.addEventListener("click", () => {
        document.body.classList.toggle("sidebar-closed");
    });
});
