document.addEventListener("DOMContentLoaded", () => {
    const selectedList = document.getElementById("selected-list");
    const ingredientButtons = document.querySelectorAll(".ingredient-btn");
    const searchBtn = document.getElementById("search-btn");
    const resetBtn = document.getElementById("reset-btn");
    const recipeResult = document.getElementById("recipe-result");
    const howToCookBtn = document.getElementById("how-to-cook");
    const toggleSidebarBtn = document.getElementById("toggleSidebar");

    let selectedIngredients = [];

    // Restore Sidebar State
    if (localStorage.getItem("sidebarClosed") === "true") {
        document.body.classList.add("sidebar-closed");
    }

    toggleSidebarBtn.addEventListener("click", () => {
        document.body.classList.toggle("sidebar-closed");
        localStorage.setItem("sidebarClosed", document.body.classList.contains("sidebar-closed"));
    });

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
                    displayRecipe(matchedRecipes);
                } else {
                    alert("No matching recipes found!");
                    recipeResult.style.display = "none";
                    howToCookBtn.style.display = "none";
                }
            })
            .catch(error => {
                console.error("Error loading recipes.json:", error);
                alert("Failed to load recipes.");
            });
    });

    resetBtn.addEventListener("click", () => {
        selectedIngredients = [];
        updateSelectedIngredients();
        recipeResult.style.display = "none";
        recipeResult.innerHTML = "";
        howToCookBtn.style.display = "none";
    });

    function displayRecipe(recipes) {
        recipeResult.style.display = "block";
        howToCookBtn.style.display = "inline-block";
        recipeResult.innerHTML = "<h3>Recipe(s)</h3>";

        recipes.forEach(recipe => {
            const recipeCard = document.createElement("div");
            recipeCard.classList.add("recipe-card");

            const recipeImage = document.createElement("img");
            recipeImage.src = recipe.image;
            recipeImage.alt = recipe.name;
            recipeImage.style.width = "100%";
            recipeImage.style.borderRadius = "10px";
            recipeImage.style.marginBottom = "15px";

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

            recipeResult.appendChild(recipeCard);
        });
    }

    howToCookBtn.addEventListener("click", () => {
        alert("Instructions for cooking will be displayed here.");
    });
});
