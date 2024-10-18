let openShopping = document.querySelector('.shopping');
let closeShopping = document.querySelector('.closeShopping');
let listCard = document.querySelector('.listCard');
let body = document.querySelector('body');
let total = document.querySelector('.total');
let quantity = document.querySelector('.quantity');
let listCards = {};

openShopping.addEventListener('click', () => {
    body.classList.add('active');
});

closeShopping.addEventListener('click', () => {
    body.classList.remove('active');
});

function addToCard(key) {
    const selectedVolume = document.getElementById(`user_obym_${key}`).value;

    // Проверяем, это кофе или чай, исходя из префикса ID
    const isTea = key.startsWith('t');
    const products = isTea ? productsTea : productsCoffee;

    const product = products.find(p => p.id === key); // Находим нужный продукт

    if (product && product.prices[selectedVolume] !== 'такого объёма нет') {
        const productKey = `${key}_${selectedVolume}`;

        if (!listCards[productKey]) {
            listCards[productKey] = {
                ...product,
                quantity: 1,
                selectedVolume: selectedVolume,
                price: product.prices[selectedVolume]
            };
        } else {
            listCards[productKey].quantity++;
            listCards[productKey].price = product.prices[selectedVolume] * listCards[productKey].quantity;
        }

        reloadCard();
    } else {
        alert('Такого объёма нет. Выберите другой объем.');
    }

    updateShoppingText();
}




function reloadCard() {
    listCard.innerHTML = '';
    let totalPrice = 0;
    let count = 0;

    Object.keys(listCards).forEach((productKey) => {
        const value = listCards[productKey];
        if (value != null) {
            let newDiv = document.createElement('li');
            newDiv.innerHTML = `
                <div><img src="image/${value.image}" class="picture"/></div>
                <div>${value.name}</div>
                <div>${value.price.toLocaleString()}р</div>
                <div>Объем: ${value.selectedVolume} мл</div>
                <div>
                    <button onclick="changeQuantity('${productKey}', 'decrement')">-</button>
                    <div class="count" id="count_${productKey}">${value.quantity}</div>
                    <button onclick="changeQuantity('${productKey}', 'increment')">+</button>
                </div>`;
            listCard.appendChild(newDiv);

            totalPrice += value.price;
            count += value.quantity;
        }
    });

    updateShoppingText();
    total.innerText = `${totalPrice.toLocaleString()}р`;
    quantity.innerText = count;
}

function changeQuantity(productKey, action) {
    let currentQuantity = listCards[productKey].quantity;
    
    if (action === 'decrement') {
        if (currentQuantity > 1) {
            currentQuantity--;
        } else {
            delete listCards[productKey];
        }
    } else if (action === 'increment') {
        currentQuantity++;
    }

    if (listCards[productKey]) {
        listCards[productKey].quantity = currentQuantity;
        listCards[productKey].price = listCards[productKey].prices[listCards[productKey].selectedVolume] * currentQuantity;
    }

    reloadCard();
    updateShoppingText();
}

function updateShoppingText() {
    let totalQuantity = 0;
    let totalSum = 0;

    Object.keys(listCards).forEach((productKey) => {
        const value = listCards[productKey];
        if (value != null) {
            totalQuantity += value.quantity;
            totalSum += value.price;
        }
    });

    const shoppingText = totalQuantity > 0 ? `${totalSum.toLocaleString()}р` : 'Корзина';
    document.querySelector('.shopping p').innerText = shoppingText;
}

document.addEventListener('DOMContentLoaded', function () {
    // Получаем все элементы с классом 'item'
    let items = document.querySelectorAll('.item');

    // Добавляем обработчик события для каждого элемента
    items.forEach(function (item) {
        let button = item.querySelector('button');

        // Получаем идентификатор товара из data-key
        let productKey = item.getAttribute('data-key');

        // Добавляем обработчик события для клика на кнопку "Добавить в корзину"
        button.addEventListener('click', function () {
            // Вызов функции для анимации добавления в корзину
            addToCartAnimation(productKey); // Используем правильный идентификатор
        });
    });
});


// Анимация добавления в корзину
function addToCartAnimation(productKey) {
    const item = document.querySelector(`.item[data-key="${productKey}"]`);
    const img = item.querySelector('img');
    const clone = img.cloneNode(true);

    clone.style.opacity = '0.8';
    clone.style.position = 'absolute';
    clone.style.height = '150px';
    clone.style.width = '150px';
    clone.style.objectFit = 'cover';
    clone.style.zIndex = '100';
    clone.style.transition = 'all 1s ease-in-out';
    clone.style.top = `${img.offsetTop}px`;
    clone.style.left = `${img.offsetLeft}px`;

    document.body.appendChild(clone);

    const shoppingCart = document.querySelector('.shopping');
    const cartRect = shoppingCart.getBoundingClientRect();

    clone.style.top = `${cartRect.top + 5}px`;
    clone.style.left = `${cartRect.left + 5}px`;
    clone.style.width = '75px';
    clone.style.height = '75px';

    clone.addEventListener('transitionend', () => {
        document.body.removeChild(clone);
    });
}
