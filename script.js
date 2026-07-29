const header=document.getElementById('siteHeader');
const menuButton=document.getElementById('menuButton');
const mobileNav=document.getElementById('mobileNav');
const heroArt=document.getElementById('heroArt');
const heroImage=document.getElementById('heroAnatomy');

async function loadHeroImage(){
  try{
    const parts=await Promise.all(Array.from({length:9},(_,index)=>fetch(`assets/hero/${index}.txt`,{cache:'force-cache'}).then(response=>{
      if(!response.ok) throw new Error(`Hero data ${index} unavailable`);
      return response.text();
    })));
    heroImage.src=`data:image/webp;base64,${parts.join('').replace(/\s/g,'')}`;
  }catch(error){console.warn('Anatomical fallback image active.',error);}
}
loadHeroImage();

window.addEventListener('scroll',()=>header.classList.toggle('scrolled',window.scrollY>24),{passive:true});
menuButton.addEventListener('click',()=>{
  const open=mobileNav.classList.toggle('open');
  document.body.classList.toggle('menu-open',open);
  menuButton.classList.toggle('active',open);
  menuButton.setAttribute('aria-expanded',String(open));
});
mobileNav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
  mobileNav.classList.remove('open');document.body.classList.remove('menu-open');menuButton.classList.remove('active');menuButton.setAttribute('aria-expanded','false');
}));

const layerNames={superficial:'Vista superficial activa',muscular:'Vista muscular activa',vascular:'Vista vascular activa',nervioso:'Vista nerviosa activa',oseo:'Vista ósea activa'};
document.querySelectorAll('.layer-button').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.layer-button').forEach(item=>item.classList.remove('active'));
  button.classList.add('active');
  const layer=button.dataset.layer;
  document.getElementById('activeLayerStatus').textContent=layerNames[layer];
  heroImage.dataset.layer=layer;
  heroImage.animate([{opacity:.55,transform:'translateY(-50%) scale(.985)'},{opacity:1,transform:'translateY(-50%) scale(1.02)'}],{duration:360,easing:'ease-out'});
}));

heroArt.addEventListener('mousemove',event=>{
  if(matchMedia('(max-width:800px)').matches||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  const b=heroArt.getBoundingClientRect();
  const x=(event.clientX-b.left)/b.width-.5;
  const y=(event.clientY-b.top)/b.height-.5;
  heroImage.style.marginRight=`${x*14}px`;
  heroImage.style.marginTop=`${y*10}px`;
});
heroArt.addEventListener('mouseleave',()=>{heroImage.style.marginRight='0';heroImage.style.marginTop='0'});

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}
}),{threshold:.12,rootMargin:'0px 0px -35px 0px'});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

document.getElementById('contactForm').addEventListener('submit',event=>{
  event.preventDefault();
  const name=document.getElementById('name').value.trim();
  const email=document.getElementById('email').value.trim();
  const organization=document.getElementById('organization').value.trim();
  const type=document.getElementById('projectType').value;
  const message=document.getElementById('message').value.trim();
  const subject=encodeURIComponent(`Solicitud Anatomy Lab — ${type}`);
  const body=encodeURIComponent(['Hola, quiero presentar una solicitud a Anatomy Lab.','',`Nombre: ${name}`,`Correo: ${email}`,`Institución/empresa: ${organization||'No indicada'}`,`Tipo de proyecto: ${type}`,'','Necesidad:',message].join('\n'));
  document.getElementById('formNote').textContent='Abriendo tu aplicación de correo…';
  window.location.href=`mailto:aduartech@gmail.com?subject=${subject}&body=${body}`;
});
document.getElementById('year').textContent=new Date().getFullYear();
