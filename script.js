const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const menuButton = document.querySelector('.menu-btn');
const mobileNav = document.querySelector('.mobile-nav');
menuButton?.addEventListener('click', () => {
  const open = mobileNav?.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(Boolean(open)));
});
document.querySelectorAll('.mobile-nav a').forEach(link => link.addEventListener('click', () => {
  mobileNav?.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');
filterButtons.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filterButtons.forEach(item => item.classList.toggle('active', item === button));
  productCards.forEach(card => card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter));
}));

const modal = document.getElementById('imageModal');
const modalImage = modal?.querySelector('img');
const modalCategory = modal?.querySelector('small');
const modalTitle = modal?.querySelector('h3');
const modalText = modal?.querySelector('p');
document.querySelectorAll('.product-image').forEach(button => button.addEventListener('click', () => {
  const card = button.closest('.product-card');
  const sourceImage = button.querySelector('img');
  if (!modal || !sourceImage || !card) return;
  modalImage.src = sourceImage.src;
  modalImage.alt = sourceImage.alt;
  modalCategory.textContent = card.querySelector('.product-meta small')?.textContent || '';
  modalTitle.textContent = card.querySelector('h3')?.textContent || '';
  modalText.textContent = card.querySelector('h4')?.textContent || '';
  modal.showModal();
  document.body.classList.add('modal-open');
}));
const closeModal = () => {
  modal?.close();
  document.body.classList.remove('modal-open');
};
modal?.querySelector('.modal-close')?.addEventListener('click', closeModal);
modal?.addEventListener('click', event => {
  if (event.target === modal) closeModal();
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

document.getElementById('contactForm')?.addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const organization = document.getElementById('organization').value.trim();
  const message = document.getElementById('message').value.trim();
  const subject = encodeURIComponent('Solicitud desde Duarte & Barros Anatomical Simulation');
  const body = encodeURIComponent(`Nombre: ${name}\nCorreo: ${email}\nInstitución o empresa: ${organization}\n\nProyecto o necesidad:\n${message}`);
  window.location.href = `mailto:aduartech@gmail.com?subject=${subject}&body=${body}`;
  document.getElementById('formNote').textContent = 'Se abrió tu cliente de correo con el mensaje listo para enviar.';
});
