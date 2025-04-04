let configMenu = null;

window.onload = function () {
    const page = document.body.getAttribute("data-page");
    if (page === "Home page") {
      displayMenu(); // โหลดตอนแรก
    }
  };

let currentPage = 1;
const itemsPerPage = 5;


async function displayMenu() {
  const menuScreen = document.getElementById("Menu");
  const pagination = document.getElementById("pagination");
  const page = document.getElementById("Current_page");

  // ถ้ายังไม่มีข้อมูล ให้โหลดและสุ่มเลย
  if (!configMenu) {
    const configRes = await fetch('/menus');
    const menuData = await configRes.json();
    configMenu = menuData.sort(() => 0.5 - Math.random()); // สุ่มครั้งเดียว
  }

  menuScreen.innerHTML = "";
  pagination.innerHTML = "";
  page.innerHTML = `</br></br><p>Current PAGE : ${currentPage}</p>`;

  const totalPages = Math.ceil(configMenu.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;
  const currentPageMenu = configMenu.slice(startIndex, endIndex);

  currentPageMenu.forEach(menu => {
    const menu_info = `
        </br>
        <p>Name: ${menu.Menu_name}</p>
        <p>Ingredient: ${menu.Menu_ingredient}</p>
        </br>
    `;
    menuScreen.innerHTML += menu_info;
  });

  // ปุ่มตัวเลข
  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
        <button onclick="changePage(${i})">${i}</button>
    `;
  }
}

function changePage(page) {
  currentPage = page;
  displayMenu(); // เรียกซ้ำได้ เพราะสุ่มแค่รอบแรก
}



