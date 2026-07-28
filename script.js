const header=document.getElementById('siteHeader');
const menuButton=document.getElementById('menuButton');
const mobileNav=document.getElementById('mobileNav');

async function loadHeroImage(){
  try{
    const parts=await Promise.all(Array.from({length:9},(_,index)=>fetch(`assets/hero/${index}.txt`,{cache:'force-cache'}).then(response=>{
      if(!response.ok) throw new Error(`Hero data ${index} unavailable`);
      return response.text();
    })));
    const image=document.querySelector('.hero-anatomy');
    image.src=`data:image/webp;base64,${parts.join('').replace(/\s/g,'')}`;
  }catch(error){
    console.warn('Anatomical fallback image active.',error);
  }
}
loadHeroImage();

window.addEventListener('scroll',()=>header.classList.toggle('scrolled',window.scrollY>24),{passive:true});
menuButton.addEventListener('click',()=>{
  const open=mobileNav.classList.toggle('open');
  document.body.classList.toggle('menu-open',open);
  menuButton.setAttribute('aria-expanded',String(open));
});
mobileNav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
  mobileNav.classList.remove('open');
  document.body.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded','false');
}));

const layerNames={muscular:'Sistema muscular activo',vascular:'Sistema vascular activo',nervioso:'Sistema nervioso activo','óseo':'Sistema óseo activo'};
document.querySelectorAll('.layer-button').forEach(button=>{
  button.addEventListener('click',()=>{
    document.querySelectorAll('.layer-button').forEach(item=>item.classList.remove('active'));
    button.classList.add('active');
    const status=document.getElementById('activeLayerStatus');
    status.textContent=layerNames[button.dataset.layer];
    status.parentElement.animate([{opacity:.35,transform:'translateY(-4px)'},{opacity:1,transform:'translateY(0)'}],{duration:320,easing:'ease-out'});
  });
});

const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

document.getElementById('contactForm').addEventListener('submit',event=>{
  event.preventDefault();
  const name=document.getElementById('name').value.trim();
  const email=document.getElementById('email').value.trim();
  const organization=document.getElementById('organization').value.trim();
  const projectType=document.getElementById('projectType').value;
  const message=document.getElementById('message').value.trim();
  const subject=encodeURIComponent('Solicitud de proyecto — Anatomy Lab');
  const body=encodeURIComponent(`Nombre: ${name}\nCorreo: ${email}\nInstitución: ${organization||'No indicada'}\nTipo de proyecto: ${projectType}\n\nNecesidad:\n${message}`);
  document.getElementById('formNote').textContent='Abriendo tu aplicación de correo…';
  window.location.href=`mailto:aduartech@gmail.com?subject=${subject}&body=${body}`;
});

document.getElementById('year').textContent=new Date().getFullYear();
