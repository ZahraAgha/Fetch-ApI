const shoppingIcon = document.getElementById("shoppingIcon");
const shoppingCard = document.querySelector(".shoppingCard")
const sideBar = document.getElementById("sideBar");
const close = document.getElementById("close-btn")

const cartContentsDiv = document.getElementById('cartContents') //bu

function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || []; //bu
}

function setData(key, data) {
    localStorage.setItem(key, JSON.stringify(data)); //bu
}

const openSideBar = () => {
    // console.log("Clicked");
    document.getElementById("sideBar").style.right = "0"

    // ----5 bu 
    const cartContents = getData('cart');
    const cartTotal = cartContents.reduce((a, item) => a + item.product.price * item.quantity, 0);

    document.getElementById('cartTotal').textContent = cartTotal; //bu

    cartContentsDiv.innerHTML = ''; //bu
    cartContents.forEach(item => {
        const card = document.createElement("div");

        card.innerHTML = `
        <div class="cardImage"> 
        ${item.quantity}   //bu
        <img src=${item.product.image}>    //bu 
        <button class="btnView">Quick View</button>
        </div>
        <div class="cardBody">
        <a class="cardTitle">${item.product.title}</a>    //bu
        <div class="heart">
        <i class="fa-regular fa-heart"></i>
        <i class="fa-solid fa-heart"></i>
        </div>
        </div>
        <span>$ ${item.product.price}</span>   //bu
        `;

        card.classList.add('card');

        cartContentsDiv.appendChild(card);
    });
}

const closeSideBar = () => {
    document.getElementById("sideBar").style.right = "-450px"
}

close.addEventListener("click", closeSideBar)
shoppingIcon.addEventListener("click", openSideBar)



const cards = document.getElementById("cards");
const loadMoreButton = document.getElementById("loadMore");
const box = document.querySelector(".box");


let products = []; // ----1  bu 

// ----3 (butun funksiya) bu 
function addToCard(id) {
    const product = products.find(p => p.id == id);

    const cartContents = JSON.parse(localStorage.getItem('cart')) || [];

    const existing = cartContents.find(p => p.product.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cartContents.push({
            product: product,
            quantity: 1,
        });
    }

    setData('cart', cartContents);
}  //bura qede

// Fetch the data
fetch('http://localhost:3005/product')
    .then(res => res.json())
    .then(data => {
        products = data; // ----2
        data.forEach(item => {
            const card = document.createElement("div");

            card.innerHTML = `
            <div class="cardImage"> 
            <img src=${item.image}>
            <button class="btnView">Quick View</button>
            </div>
            <div class="cardBody">
            <a class="cardTitle">${item.title}</a>
            <div class="heart">
            <i class="fa-regular fa-heart"></i>
            <i class="fa-solid fa-heart"></i>
            </div>
            </div>
            <span>$ ${item.price}</span>
            `;

            card.classList.add('card');
            cards.appendChild(card);

            card.addEventListener('click', () => {
                box.innerHTML = ''; // Clear the box
                box.style.display = "block"; // Show the box

                const selectedCard = document.createElement("div");
                selectedCard.innerHTML = `
                <button class="closeMark"><i class="fa-solid fa-xmark"></i></button>
                <!-- ---- add to cart -->
                <button class="add-to-cart" onclick="addToCard(${item.id})">Add to cart</button>
                <img src=${item.image}>
                <h2>${item.title}</h2>
                <p>$ ${item.price}</p>
                `;
                selectedCard.classList.add("selectedCard");
                box.appendChild(selectedCard);



                const closeMark = selectedCard.querySelector(".closeMark");
                closeMark.addEventListener('click', () => {
                    box.style.display = "none";
                });
            });
        });

    })
    .catch(error => console.error('ERROR!!!:', error));



const closeModal = document.querySelector('.closeMark');

// Function to open the modal with item details
function openModal(item) {
    box.innerHTML = `
            <button class="closeMark"><i class="fa-solid fa-xmark"></i></button>
            <img src=${item.image} alt="Product Image">
            <h2>${item.title}</h2>
            <p>$ ${item.price}</p>
        `;
    box.style.display = 'block'; // Show the modal

    // Attach event listener to newly added close button
    box.querySelector('.closeMark').addEventListener('click', function () {
        box.style.display = 'none'; // Hide the modal on click
    });
}

// Attach click event listeners to each card
cards.forEach(card => {
    card.addEventListener('click', function () {
        // Assuming `item` is the data for this card. You'd fetch or define it here.
        // Since this is a static example, let's define a mock item
        const item = {
            image: card.querySelector('img').src, // Or any specific image
            title: card.querySelector('.cardTitle').textContent, // Adjust selectors based on your HTML
            price: card.querySelector('span').textContent // Adjust selectors based on your HTML
        };

        openModal(item);
    });
});

// If the modal should be closed when clicking outside of it
window.addEventListener('click', function (event) {
    if (event.target === box) {
        box.style.display = 'none';
    }
});




























//slide

const sliderContainer = document.querySelector(".slides");
const slides = document.querySelectorAll(".slide");
const nextIcon = document.querySelector(".next");
const prevIcon = document.querySelector(".prev");
// const dotContainer = document.querySelector(".dot-container");

let currentIndex = 0;

sliderContainer.addEventListener("mouseover", stopPlay)
sliderContainer.addEventListener("mouseout", startPlay);


slides.forEach((slide, index) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");

    if (index === currentIndex) {
        dot.classList.add("active");
    }
    dot.addEventListener("click", () => {
        currentIndex = index;
        updateSlider();
        updateDot();
    });

    dotContainer.appendChild(dot);
});

function updateDot() {
    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot, index) => {
        if (index === currentIndex) {
            dot.classList.add("active");
        } else {
            dot.classList.remove("active");
        }
    });
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
    // updateDot();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlider();
    // updateDot();
}

function updateSlider() {
    const newTransform = -currentIndex * 100 + "%";
    sliderContainer.style.transform = `translateX(${newTransform})`;
}

nextIcon.addEventListener("click", nextSlide);
prevIcon.addEventListener("click", prevSlide);

let interval;

function startPlay() {
    interval = setInterval(nextSlide, 5000);
}

function stopPlay() {
    clearInterval(interval);
}

startPlay();



//add to cart 


