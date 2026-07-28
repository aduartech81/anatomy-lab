const header=document.getElementById('siteHeader');
const menuButton=document.getElementById('menuButton');
const mobileNav=document.getElementById('mobileNav');
const heroArt=document.getElementById('heroArt');
const heroImage=document.getElementById('heroAnatomy');

async function loadHeroImage(){
  try{
    const parts=await Promise.all(
      Array.from({length:9},(_,index)=>
        fetch(`assets/hero/${index}.txt`,{cache:'force-cache'}).then(response=>{
          if(!response.ok) throw new Error(`Hero data ${index} unavailable`);
          return response.text();
        })
      )
    );
    heroImage.src=`data:image/webp;base64,${parts.join('').replace(/\s/g,'')}`;
  }catch(error){
    console.warn('Anatomical fallback image active.',error);
  }
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
  mobileNav.classList.remove('open');
  document.body.classList.remove('menu-open');
  menuButton.classList.remove('active');
  menuButton.setAttribute('aria-expanded','false');
}));

const layerNames={
  muscular:'Sistema muscular activo',
  vascular:'Sistema vascular activo',
  nervioso:'Sistema nervioso activo',
  'óseo':'Sistema óseo activo'
};

document.querySelectorAll('.layer-button').forEach(button=>{
  button.addEventListener('click',()=>{
    document.querySelectorAll('.layer-button').forEach(item=>item.classList.remove('active'));
    button.classList.add('active');
    const layer=button.dataset.layer;
    const status=document.getElementById('activeLayerStatus');
    status.textContent=layerNames[layer];
    heroImage.dataset.layer=layer;
    heroImage.animate(
      [{opacity:.55,transform:'translateY(-50%) scale(.985)'},{opacity:1,transform:'translateY(-50%) scale(1)'}],
      {duration:360,easing:'ease-out'}
    );
    status.parentElement.animate(
      [{opacity:.35,transform:'translateY(-4px)'},{opacity:1,transform:'translateY(0)'}],
      {duration:320,easing:'ease-out'}
    );
  });
});

heroArt.addEventListener('mousemove',event=>{
  if(window.matchMedia('(max-width:800px)').matches || window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const bounds=heroArt.getBoundingClientRect();
  const x=(event.clientX-bounds.left)/bounds.width-.5;
  const y=(event.clientY-bounds.top)/bounds.height-.5;
  heroImage.style.marginRight=`${x*11}px`;
  heroImage.style.marginTop=`${y*8}px`;
});

heroArt.addEventListener('mouseleave',()=>{
  heroImage.style.marginRight='0';
  heroImage.style.marginTop='0';
});

const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:.12,rootMargin:'0px 0px -40px 0px'});

document.querySelectorAll('.reveal').forEach(element=>revealObserver.observe(element));

document.getElementById('contactForm').addEventListener('submit',event=>{
  event.preventDefault();
  const name=document.getElementById('name').value.trim();
  const email=document.getElementById('email').value.trim();
  const organization=document.getElementById('organization').value.trim();
  const projectType=document.getElementById('projectType').value;
  const message=document.getElementById('message').value.trim();
  const text=[
    'Hola, quiero presentar una solicitud a Anatomy Lab.',
    '',
    `Nombre: ${name}`,
    `Correo: ${email}`,
    `Institución/empresa: ${organization||'No indicada'}`,
    `Tipo de proyecto: ${projectType}`,
    '',
    'Necesidad:',
    message
  ].join('\n');
  document.getElementById('formNote').textContent='Abriendo WhatsApp con la solicitud preparada…';
  window.open(`https://wa.me/573138872071?text=${encodeURIComponent(text)}`,'_blank','noopener,noreferrer');
});

document.getElementById('year').textContent=new Date().getFullYear();