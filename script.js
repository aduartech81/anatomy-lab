const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const menuButton = document.querySelector('.menu-btn');
const mobileNav = document.querySelector('.mobile-nav');
const setMenu = open => {
  mobileNav.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
};
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuButton.focus();
  }
});
window.matchMedia('(min-width:1121px)').addEventListener('change', event => {
  if (event.matches) setMenu(false);
});

const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');
filterButtons.forEach(button => {
  button.setAttribute('aria-pressed', String(button.classList.contains('active')));
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => {
      item.classList.toggle('active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    let count = 0;
    productCards.forEach(card => {
      const hidden = filter !== 'all' && card.dataset.category !== filter;
      card.classList.toggle('hidden', hidden);
      if (!hidden) count++;
    });
    document.getElementById('catalogStatus').textContent = `${count} modelos · ${button.textContent}`;
  });
});

const product = document.getElementById('product');
const selectProduct = value => {
  if ([...product.options].some(option => option.value === value)) product.value = value;
};
selectProduct(new URLSearchParams(window.location.search).get('producto'));
const modal = document.getElementById('imageModal');
const modalInquiry = document.getElementById('modalInquiry');
let modalOpener;
const closeModal = () => modal.close();
document.querySelectorAll('.product-image').forEach(button => button.addEventListener('click', () => {
  const card = button.closest('.product-card');
  const sourceImage = button.querySelector('img');
  modal.querySelector('img').src = sourceImage.src;
  modal.querySelector('img').alt = sourceImage.alt;
  modal.querySelector('small').textContent = card.querySelector('.product-meta small').textContent;
  modal.querySelector('h3').textContent = card.querySelector('h3').textContent;
  modal.querySelector('p').textContent = card.querySelector('h4').textContent;
  modalInquiry.href = `?producto=${encodeURIComponent(card.id)}#contacto`;
  modalInquiry.dataset.product = card.id;
  modalOpener = button;
  modal.showModal();
  document.body.classList.add('modal-open');
}));
modal.querySelector('.modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', event => {
  if (event.target === modal) closeModal();
});
modal.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  if (modalOpener) modalOpener.focus();
});
const activateInquiry = event => {
  // Preserve native open-in-new-tab behavior and the no-JS query URL.
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  const value = event.currentTarget.dataset.product;
  selectProduct(value);
  if (modal.open) {
    modalOpener = null;
    closeModal();
  }
  const url = new URL(window.location.href);
  url.searchParams.set('producto', value);
  url.hash = 'contacto';
  history.replaceState(null, '', url);
  document.getElementById('contacto').scrollIntoView();
  product.focus({ preventScroll: true });
};
document.querySelectorAll('.product-inquiry').forEach(link => link.addEventListener('click', activateInquiry));
modalInquiry.addEventListener('click', activateInquiry);

// Content remains visible if JavaScript or IntersectionObserver is unavailable.
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}

const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
const recipient = 'aduartech@gmail.com'; // Existing public contact in the source website.
const inquiry = () => {
  const value = id => document.getElementById(id).value.trim();
  const model = product.options[product.selectedIndex].textContent;
  return {
    subject: `Consulta sobre ${model} · Duarte & Barros`,
    body: `Modelo: ${model}\nNombre: ${value('name')}\nCorreo: ${value('email')}\nInstitución o empresa: ${value('organization')}\n\nObjetivo docente o necesidad:\n${value('message')}\n\nPor favor, confirmar configuración, estado del modelo, precio y plazo.`
  };
};
form.addEventListener('submit', event => {
  event.preventDefault();
  const { subject, body } = inquiry();
  note.textContent = 'Se ha solicitado abrir tu aplicación de correo. Revisa y envía el mensaje allí. Si no se abre, usa «Copiar consulta».';
  window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
document.getElementById('copyInquiry').addEventListener('click', async () => {
  if (!form.reportValidity()) return;
  const { subject, body } = inquiry();
  const text = `Para: ${recipient}\nAsunto: ${subject}\n\n${body}`;
  try {
    await navigator.clipboard.writeText(text);
    note.textContent = 'Consulta copiada. Pégala en tu correo, revísala y envíala a aduartech@gmail.com.';
  } catch {
    document.getElementById('copyFallback').hidden = false;
    const fallback = document.getElementById('inquiryText');
    fallback.value = text;
    fallback.focus();
    fallback.select();
    note.textContent = 'Selecciona y copia el texto de abajo. La consulta todavía no se ha enviado.';
  }
});
