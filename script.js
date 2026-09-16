let cart = [];
let currentProduct = {name:"", price:0, image:"", description:""};

const TELEGRAM = "https://t.me/tvoya_smertt";

function loadCart(){
  const saved = localStorage.getItem("vantaCart");
  if(!saved) return;
  try{
    cart = JSON.parse(saved).map(p => ({...p, quantity: Math.max(1, Number(p.quantity)||1)}));
  }catch(e){ cart=[]; }
}

function saveCart(){ localStorage.setItem("vantaCart", JSON.stringify(cart)); }

function money(value){ return Number(value||0).toLocaleString("ru-RU") + " ₽"; }

function openProduct(name, price, image, description){
  currentProduct = {name, price:Number(price), image, description};
  document.getElementById("modalImage").src = image;
  document.getElementById("modalImage").alt = name;
  document.getElementById("modalName").textContent = name;
  document.getElementById("modalPrice").textContent = money(price);
  document.getElementById("modalDescription").textContent = description;

  const message = `Здравствуйте! Хочу заказать: ${name}. Цена: ${money(price)}`;
  document.getElementById("modalButton").href = TELEGRAM + "?text=" + encodeURIComponent(message);

  const modal = document.getElementById("productModal");
  modal.classList.add("active");
  modal.setAttribute("aria-hidden","false");
}

function closeProduct(){
  const modal = document.getElementById("productModal");
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden","true");
}

function addToCart(){
  const existing = cart.find(p => p.name === currentProduct.name);
  if(existing) existing.quantity += 1;
  else cart.push({...currentProduct, quantity:1});
  saveCart();
  updateCart();
  closeProduct();
  showToast();
}

function getCartCount(){ return cart.reduce((sum,p)=>sum+(Number(p.quantity)||1),0); }
function getCartTotal(){ return cart.reduce((sum,p)=>sum+p.price*(Number(p.quantity)||1),0); }

function updateCart(){
  document.getElementById("cartCount").textContent = getCartCount();
  const items = document.getElementById("cartItems");
  items.innerHTML = "";

  if(cart.length === 0){
    items.innerHTML = '<p class="empty-cart">Корзина пока пустая</p>';
  }else{
    cart.forEach((p,index)=>{
      const q = Number(p.quantity)||1;
      const item = document.createElement("div");
      item.className = "cart-item";
      item.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <div class="cart-item-info">
          <h3>${p.name}</h3>
          <strong>${money(p.price*q)}</strong>
        </div>
        <div class="quantity">
          <button type="button" onclick="changeQuantity(${index},-1)">−</button>
          <span>${q}</span>
          <button type="button" onclick="changeQuantity(${index},1)">+</button>
        </div>
        <button class="cart-remove" type="button" onclick="removeFromCart(${index})">×</button>`;
      items.appendChild(item);
    });
  }

  document.getElementById("cartTotal").textContent = money(getCartTotal());
  updateTelegramOrder();
}

function changeQuantity(index, change){
  if(!cart[index]) return;
  cart[index].quantity = (Number(cart[index].quantity)||1) + change;
  if(cart[index].quantity <= 0) cart.splice(index,1);
  saveCart();
  updateCart();
}

function removeFromCart(index){
  cart.splice(index,1);
  saveCart();
  updateCart();
}

function updateTelegramOrder(){
  const button = document.getElementById("cartOrder");
  if(cart.length === 0){
    button.href = "#";
    button.style.opacity = ".45";
    return;
  }
  button.style.opacity = "1";
  let message = "Здравствуйте! Хочу оформить заказ:%0A%0A";
  cart.forEach((p,i)=>{
    const q = Number(p.quantity)||1;
    message += `${i+1}. ${p.name} × ${q} — ${money(p.price*q)}%0A`;
  });
  message += `%0AИтого: ${money(getCartTotal())}`;
  button.href = TELEGRAM + "?text=" + encodeURIComponent(decodeURIComponent(message));
}

function showToast(){
  const toast = document.getElementById("toast");
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),1800);
}

document.addEventListener("DOMContentLoaded",()=>{
  loadCart();
  updateCart();

  document.getElementById("addToCartButton").addEventListener("click",addToCart);

  const cartModal = document.getElementById("cartModal");
  document.getElementById("cartButton").addEventListener("click",()=>{
    updateCart();
    cartModal.classList.add("active");
    cartModal.setAttribute("aria-hidden","false");
  });

  document.getElementById("closeCart").addEventListener("click",()=>{
    cartModal.classList.remove("active");
    cartModal.setAttribute("aria-hidden","true");
  });

  document.getElementById("productModal").addEventListener("click",(e)=>{
    if(e.target.id === "productModal") closeProduct();
  });

  cartModal.addEventListener("click",(e)=>{
    if(e.target.id === "cartModal"){
      cartModal.classList.remove("active");
      cartModal.setAttribute("aria-hidden","true");
    }
  });

  document.addEventListener("keydown",(e)=>{
    if(e.key === "Escape"){
      closeProduct();
      cartModal.classList.remove("active");
      cartModal.setAttribute("aria-hidden","true");
    }
  });

  const hero = document.getElementById("heroImage");
  hero.addEventListener("error",()=>{ hero.src="watch1.png"; },{once:true});
});
