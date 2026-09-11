function showSpinner() {
  document.getElementById("spinner").classList.remove("hidden");
}

function hideSpinner() {
  document.getElementById("spinner").classList.add("hidden");
}


const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories));
};

function removeActive() {
  const activeBtn = document.querySelector("#categories-list .bg-green-600");
  if (activeBtn) {
    activeBtn.classList.remove("bg-green-600", "text-white");
  }
}

const displayCategories = (categories) => {
  const listCategories = document.getElementById("categories-list");
  listCategories.innerHTML = "";

  categories.forEach((list) => {
    const btnDiv = document.createElement("div");
    btnDiv.classList.add(
      "text-[#1F2937]",
      "cursor-pointer",
      "hover:bg-green-600",
      "mt-2"
    );
    btnDiv.innerText = list.category_name;

    btnDiv.addEventListener("click", () => {
      removeActive();
      btnDiv.classList.add("bg-green-600", "text-white");
       showSpinner(); 

      fetch(`https://openapi.programming-hero.com/api/category/${list.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status && data.message === "This category has no plant") {
            document.getElementById("plants-container").innerHTML =
              "<p class='text-red-500'>No plants found in this category.</p>";
          } else {
            displayPlants(data.plants);
          }
          hideSpinner();
        });
    });

    listCategories.appendChild(btnDiv);
  });
};

const loadPlants = () => {
     showSpinner();
  fetch("https://openapi.programming-hero.com/api/plants")
    .then((res) => res.json())
    .then((data) => displayPlants(data.plants));
     hideSpinner(); 
};

const displayPlants = (plants) => {
  const plantsContainer = document.getElementById("plants-container");
  plantsContainer.innerHTML = "";

  plants.forEach((plant) => {
    const plantDiv = document.createElement("div");
    plantDiv.innerHTML = `<div class="card bg-base-100 w-full  shadow-sm">
            <figure class="px-4 pt-4">
              <img src="${plant.image}" alt="" class="w-full h-40 rounded-lg" />
            </figure>
            <div class="card-body text-left">
              <h2 class="card-title cursor-pointer " id="plant-name-${plant.id}">${plant.name}</h2>
              <p>${plant.description}</p>
              <div class="flex justify-between items-center">
                <div class="w-[100px]">
                  <p
                    class="bg-[#DCFCE7] text-[#15803D] rounded-2xl text-center"
                  >${plant.category}</p>
                </div>
                <div>
                  <p>৳${plant.price}</p>
                </div>
              </div>
              <div class="card-actions">
               <button 
    onclick='addToCart({ id: ${plant.id}, name: "${plant.name}", price: ${plant.price}, image: "${plant.image}" })' class="bg-[#15803D] text-white w-full h-[42px] rounded-3xl hover:bg-green-200">Add to Cart<button> 
              </div>
            </div>
          </div>`;
    plantsContainer.appendChild(plantDiv);

    // click plant name modal show
    const plantName = document.getElementById(`plant-name-${plant.id}`);
    plantName.addEventListener("click", () => {
      fetch(`https://openapi.programming-hero.com/api/plant/${plant.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status) {
            const modal = document.getElementById("plant_modal");
            const detailsContainer = document.getElementById(
              "plant_details_container"
            );

            detailsContainer.innerHTML = `
          <h2 class="text-xl font-bold">${data.plants.name}</h2>
          <img src="${data.plants.image}" alt="${data.plants.name}" class="w-full h-40 rounded-lg my-2" />
          <p class="font-semibold">Category: ${data.plants.category}</p>
          <p class="font-semibold">Price: ৳${data.plants.price}</p>
          <p class="mt-2">${data.plants.description}</p>`;

            modal.showModal();
          }
        });
    });
  });
};

loadCategories();
loadPlants();

// cart section
let cart = [];

function addToCart(plant) {
  const fruits = cart.find((item) => item.id === plant.id);
  if (fruits) {
    fruits.quantity += 1;
  } else {
    cart.push({ ...plant, quantity: 1 });
  }
  cartContainer();
}

function removeCart(id) {
  cart = cart.filter((item) => item.id !== id);
  cartContainer();
}
function cartContainer() {
  const cartList = document.getElementById("cart-list");
  const cartTotal = document.getElementById("cart-total");

  cartList.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;

    const li = document.createElement("li");
    li.classList.add(
      "flex",
      "justify-between",
      "items-center",
      "bg-green-50",
      "p-2",
      "rounded",
      "mb-2"
    );

    li.innerHTML = `
      <div>
        <h1 class="font-bold">${item.name}</h1>
        <p class="text-sm text-gray-600">৳${item.price} * ${item.quantity}</p>
      </div>
      <button onclick="removeCart(${item.id})" class="font-bold"><i class="fa-solid fa-xmark"></i></button>
    `;

    cartList.appendChild(li);
  });

  cartTotal.innerText = `৳${total}`;
}
