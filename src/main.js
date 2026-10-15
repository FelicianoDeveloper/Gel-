// Gelô — interações do menu, filtros e pedido via WhatsApp.
const WHATSAPP_NUMBER = "5562992964890"; // Troque pelo número comercial com código do país.
const PRICES = {
  "Morango": 9,
  "Chocolate": 10,
  "Pistache": 12,
  "Baunilha": 9,
  "Frutas vermelhas": 10,
  "Casquinha especial": 11
};
const cart = new Map();
const money = value => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const menuToggle = document.querySelector("#menu-toggle");
const navLinks = document.querySelector("#nav-links");
const toast = document.querySelector("#toast");
const dialog = document.querySelector("#order-dialog");
let toastTimeout;

document.querySelector("#year").textContent = new Date().getFullYear();

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  navLinks.classList.toggle("is-open", !isOpen);
});
navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  navLinks.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

document.querySelectorAll("[data-filter]").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach(item => item.classList.toggle("is-active", item === button));
    const filter = button.dataset.filter;
    document.querySelectorAll(".flavor-card").forEach(card => {
      card.hidden = filter !== "todos" && card.dataset.category !== filter;
    });
  });
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("is-visible"), 2400);
}
function addItem(name) {
  cart.set(name, (cart.get(name) || 0) + 1);
  updateCart();
  showToast(`${name} adicionado ao seu pedido ✳`);
}
function updateCart() {
  const count = [...cart.values()].reduce((sum, quantity) => sum + quantity, 0);
  const total = [...cart.entries()].reduce((sum, [name, quantity]) => sum + PRICES[name] * quantity, 0);
  document.querySelector("#cart-count").textContent = count;
  document.querySelector("#cart-total").textContent = money(total);
  document.querySelector("#dialog-total").textContent = money(total);
  document.querySelector("#cart-button").classList.toggle("is-visible", count > 0);
  const list = document.querySelector("#order-items");
  list.innerHTML = "";
  if (count === 0) {
    list.innerHTML = '<p class="menu-note">Seu pedido ainda está vazio. Feche esta janela e escolha seus sabores favoritos.</p>';
    return;
  }
  for (const [name, quantity] of cart) {
    const row = document.createElement("div");
    row.className = "order-line";
    const label = document.createElement("span");
    label.textContent = name;
    const controls = document.createElement("div");
    controls.className = "qty-controls";
    const minus = document.createElement("button");
    minus.type = "button"; minus.textContent = "−"; minus.setAttribute("aria-label", `Remover uma unidade de ${name}`);
    minus.addEventListener("click", () => {
      const next = (cart.get(name) || 0) - 1;
      if (next <= 0) cart.delete(name); else cart.set(name, next);
      updateCart();
    });
    const qty = document.createElement("span"); qty.textContent = quantity;
    const plus = document.createElement("button");
    plus.type = "button"; plus.textContent = "+"; plus.setAttribute("aria-label", `Adicionar uma unidade de ${name}`);
    plus.addEventListener("click", () => { cart.set(name, (cart.get(name) || 0) + 1); updateCart(); });
    const price = document.createElement("strong"); price.textContent = money(PRICES[name] * quantity);
    controls.append(minus, qty, plus);
    row.append(label, controls, price);
    list.append(row);
  }
}
document.querySelectorAll("[data-add]").forEach(button => button.addEventListener("click", () => addItem(button.dataset.add)));
document.querySelector("#cart-button").addEventListener("click", () => {
  updateCart();
  dialog.showModal();
});
document.querySelector("#whatsapp-cta").href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Quero conhecer o cardápio da Gelô.")}`;

document.querySelector("#send-order").addEventListener("click", event => {
  event.preventDefault();
  if (cart.size === 0) {
    showToast("Escolha pelo menos um sabor antes de continuar.");
    return;
  }
  const customer = document.querySelector("#customer-name").value.trim();
  const note = document.querySelector("#order-note").value.trim();
  if (!customer) {
    document.querySelector("#customer-name").focus();
    showToast("Digite seu nome para continuar.");
    return;
  }
  const lines = [...cart.entries()].map(([name, quantity]) => `• ${quantity}x ${name} — ${money(PRICES[name] * quantity)}`);
  const total = [...cart.entries()].reduce((sum, [name, quantity]) => sum + PRICES[name] * quantity, 0);
  const message = [
    "Olá! Quero fazer um pedido na Gelô 🍦",
    `Nome: ${customer}`,
    "",
    ...lines,
    "",
    `Total estimado: ${money(total)}`,
    note ? `Observações: ${note}` : ""
  ].filter(Boolean).join("\n");
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
});
updateCart();