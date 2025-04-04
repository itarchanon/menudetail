let configMenu = null;

window.onload = async function() {
    try {

        const page = document.body.getAttribute("data-page");
        switch(page) {
            case "Home page" :
                displayMenu()
        }

    } catch (error) {
        console.error("Error fetching config:", error);
    }
};

async function displayMenu() {
    const configRes = await fetch('/menus');
    const configMenu = await configRes.json();
    console.log(configMenu);
    console.log("This is form Function",configMenu);

    const menuScreen = document.getElementById("Menu")
    menuScreen.innerHTML = "";
    configMenu.sort(function(){return 0.5 - Math.random()})
    configMenu.forEach(menu => {
        const menu_info = `
        </br>
        <p>Name : ${menu.Menu_name}</p>
        <p>Ingredient : ${menu.Menu_ingredient}</p>
        </br>
        `
        menuScreen.innerHTML += menu_info;
    });
}