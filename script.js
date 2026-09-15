// =========================
// КОРЗИНА
// =========================

let cart = [];


// =========================
// ТЕКУЩИЙ ТОВАР
// =========================

let currentProduct = {
    name: "",
    price: 0,
    image: "",
    description: ""
};


// =========================
// ЗАГРУЗКА КОРЗИНЫ
// =========================

function loadCart() {

    const savedCart =
        localStorage.getItem("vantaCart");

    if (savedCart) {

        try {

            cart = JSON.parse(savedCart);

        } catch (error) {

            cart = [];

        }

    }

}


// =========================
// СОХРАНЕНИЕ КОРЗИНЫ
// =========================

function saveCart() {

    localStorage.setItem(
        "vantaCart",
        JSON.stringify(cart)
    );

}


// =========================
// ПОЛУЧЕНИЕ ЧИСЛА ИЗ ЦЕНЫ
// =========================

function getPriceNumber(price) {

    return Number(
        price
            .replace(/\s/g, "")
            .replace("₽", "")
    );

}


// =========================
// ОТКРЫТИЕ ТОВАРА
// =========================

function openProduct(
    name,
    price,
    image,
    description
) {

    const modal =
        document.getElementById("productModal");


    currentProduct = {

        name: name,

        price: getPriceNumber(price),

        image: image,

        description: description

    };


    document.getElementById(
        "modalImage"
    ).src = image;


    document.getElementById(
        "modalName"
    ).textContent = name;


    document.getElementById(
        "modalPrice"
    ).textContent = price;


    document.getElementById(
        "modalDescription"
    ).textContent = description;


    const message =
        "Здравствуйте! Хочу заказать: " +
        name +
        ". Цена: " +
        price;


    document.getElementById(
        "modalButton"
    ).href =
        "https://t.me/tvoya_smertt?text=" +
        encodeURIComponent(message);


    modal.classList.add("active");

}


// =========================
// ЗАКРЫТИЕ ТОВАРА
// =========================

function closeProduct() {

    document
        .getElementById("productModal")
        .classList.remove("active");

}


// =========================
// ДОБАВЛЕНИЕ В КОРЗИНУ
// =========================

function addToCart() {

    const existingProduct =
        cart.find(function(product) {

            return product.name === currentProduct.name;

        });


    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({

            name: currentProduct.name,

            price: currentProduct.price,

            image: currentProduct.image,

            description: currentProduct.description,

            quantity: 1

        });

    }


    saveCart();

    updateCart();

    closeProduct();

}


// =========================
// ОБЩЕЕ КОЛИЧЕСТВО
// =========================

function getCartCount() {

    let count = 0;


    cart.forEach(function(product) {

        count += product.quantity;

    });


    return count;

}


// =========================
// ОБЩАЯ СУММА
// =========================

function getCartTotal() {

    let total = 0;


    cart.forEach(function(product) {

        total +=
            product.price *
            product.quantity;

    });


    return total;

}


// =========================
// ОБНОВЛЕНИЕ КОРЗИНЫ
// =========================

function updateCart() {

    const cartCount =
        document.getElementById("cartCount");


    const cartItems =
        document.getElementById("cartItems");


    const cartTotal =
        document.getElementById("cartTotal");


    // Количество

    cartCount.textContent =
        getCartCount();


    // Очищаем

    cartItems.innerHTML = "";


    // Пустая корзина

    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p class='empty-cart'>" +
            "Корзина пока пустая" +
            "</p>";

    }


    // Товары

    cart.forEach(function(product, index) {

        const item =
            document.createElement("div");


        item.className =
            "cart-item";


        item.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
            >

            <div class="cart-item-info">

                <h3>
                    ${product.name}
                </h3>

                <strong>
                    ${(
                        product.price *
                        product.quantity
                    ).toLocaleString("ru-RU")} ₽
                </strong>

            </div>


            <div class="quantity">

                <button
                    type="button"
                    onclick="changeQuantity(${index}, -1)"
                >
                    −
                </button>

                <span>
                    ${product.quantity}
                </span>

                <button
                    type="button"
                    onclick="changeQuantity(${index}, 1)"
                >
                    +
                </button>

            </div>


            <button
                class="cart-remove"
                type="button"
                onclick="removeFromCart(${index})"
            >
                ×
            </button>

        `;


        cartItems.appendChild(item);

    });


    // Общая сумма

    cartTotal.textContent =
        getCartTotal().toLocaleString("ru-RU") +
        " ₽";


    // Telegram

    updateTelegramOrder();

}


// =========================
// ИЗМЕНЕНИЕ КОЛИЧЕСТВА
// =========================

function changeQuantity(
    index,
    change
) {

    cart[index].quantity += change;


    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }


    saveCart();

    updateCart();

}


// =========================
// УДАЛЕНИЕ
// =========================

function removeFromCart(index) {

    cart.splice(index, 1);

    saveCart();

    updateCart();

}


// =========================
// TELEGRAM ЗАКАЗ
// =========================

function updateTelegramOrder() {

    const cartOrder =
        document.getElementById("cartOrder");


    if (cart.length === 0) {

        cartOrder.href = "#";

        return;

    }


    let message =
        "Здравствуйте! Хочу оформить заказ:\n\n";


    cart.forEach(function(product, index) {

        const productTotal =
            product.price *
            product.quantity;


        message +=
            (index + 1) +
            ". " +
            product.name +
            " × " +
            product.quantity +
            " — " +
            productTotal.toLocaleString("ru-RU") +
            " ₽\n";

    });


    message +=
        "\nИтого: " +
        getCartTotal().toLocaleString("ru-RU") +
        " ₽";


    cartOrder.href =
        "https://t.me/tvoya_smertt?text=" +
        encodeURIComponent(message);

}


// =========================
// ЗАПУСК
// =========================

document.addEventListener(
    "DOMContentLoaded",
    function() {


        // Загружаем корзину

        loadCart();


        // Кнопка "В корзину"

        const addToCartButton =
            document.getElementById(
                "addToCartButton"
            );


        if (addToCartButton) {

            addToCartButton.addEventListener(
                "click",
                addToCart
            );

        }


        // Кнопка корзины

        const cartButton =
            document.getElementById(
                "cartButton"
            );


        const cartModal =
            document.getElementById(
                "cartModal"
            );


        if (
            cartButton &&
            cartModal
        ) {

            cartButton.addEventListener(
                "click",
                function() {

                    updateCart();

                    cartModal.classList.add(
                        "active"
                    );

                }
            );

        }


        // Закрытие корзины

        const closeCart =
            document.getElementById(
                "closeCart"
            );


        if (closeCart) {

            closeCart.addEventListener(
                "click",
                function() {

                    cartModal.classList.remove(
                        "active"
                    );

                }
            );

        }


        // Закрытие товара по фону

        const productModal =
            document.getElementById(
                "productModal"
            );


        if (productModal) {

            productModal.addEventListener(
                "click",
                function(event) {

                    if (
                        event.target ===
                        productModal
                    ) {

                        closeProduct();

                    }

                }
            );

        }


        // Закрытие корзины по фону

        if (cartModal) {

            cartModal.addEventListener(
                "click",
                function(event) {

                    if (
                        event.target ===
                        cartModal
                    ) {

                        cartModal.classList.remove(
                            "active"
                        );

                    }

                }
            );

        }


        // ESC

        document.addEventListener(
            "keydown",
            function(event) {

                if (event.key === "Escape") {

                    closeProduct();

                    if (cartModal) {

                        cartModal.classList.remove(
                            "active"
                        );

                    }

                }

            }
        );


        // Первоначальное обновление

        updateCart();

    }
);