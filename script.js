(()=>{
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const projects=window.PROJECTS, media=window.MEDIA;
// Start muted videos automatically when they enter view; pause outside the viewport.
// Browsers generally allow muted autoplay but can override it through user settings.
const videoObserver = new IntersectionObserver(entries => {
  for(const entry of entries){
    const v=entry.target;
    if(entry.isIntersecting && !v.closest('.hidden')){
      v.muted=true;
      v.play().catch(()=>{});
    }else{
      v.pause();
    }
  }
}, {threshold:0.12, rootMargin:'100px 0px'});
function prepareAutoVideos(scope=document){
  scope.querySelectorAll('video').forEach(v=>{
    v.muted=true;
    v.defaultMuted=true;
    v.loop=true;
    v.autoplay=true;
    v.playsInline=true;
    v.setAttribute('muted','');
    v.setAttribute('loop','');
    v.setAttribute('autoplay','');
    v.setAttribute('playsinline','');
    if(!v.dataset.autowatched){ v.dataset.autowatched='1'; videoObserver.observe(v); }
  });
}

const titles={memoria:'MEMORIA',standdown:'STAND DOWN',schrodinger:'SCHRÖDINGER’S CURIOSITY',stockwave:'STOCKWAVE',panopticon:'PANOPTICON',vfx:'REAL-TIME VFX',modeling:'3D MODELING & TEXTURING',illustration:'2D ART & ILLUSTRATION',vaast:'VAAST LAB',inman:'INMAN LAB'};
const workOrder=['memoria','schrodinger','stockwave','standdown','panopticon'];
const archiveOrder=['vfx','modeling','illustration'];
const practices=['INTERACTION DESIGN','CREATIVE CODING','HUMAN PERCEPTION','VISUAL STORYTELLING','PHYSICAL PLAY','RESEARCH PRACTICE'];
const matches={'0|1':['memoria','panopticon','schrodinger'],'0|2':['memoria','standdown','panopticon'],'0|3':['panopticon','schrodinger','illustration'],'0|4':['stockwave','schrodinger','memoria'],'0|5':['memoria','vaast','panopticon'],'1|2':['memoria','vaast','vfx'],'1|3':['vfx','schrodinger','modeling'],'1|4':['schrodinger','stockwave','vfx'],'1|5':['vaast','memoria','inman'],'2|3':['standdown','illustration','panopticon'],'2|4':['memoria','standdown','stockwave'],'2|5':['vaast','inman','memoria'],'3|4':['schrodinger','stockwave','illustration'],'3|5':['illustration','panopticon','inman'],'4|5':['stockwave','vaast','modeling']};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const lookup=(key,frag)=>media[key]?.find(x=>x.src.toLowerCase().endsWith('/'+frag.toLowerCase()+'.png'))||media[key]?.find(x=>x.src.toLowerCase().includes('/'+frag.toLowerCase()+'.'));
const source=(key,term)=>media[key]?.find(x=>x.src.toLowerCase().includes(term.toLowerCase()))?.src||'';
let current='home',previous='work',selected='memoria';
function show(page){
 if(page==='case'){ $('#case').classList.remove('hidden'); $$('.screen').forEach(e=>e.classList.add('hidden')); }
 else{ $$('.screen').forEach(e=>e.classList.toggle('hidden',e.id!==page)); $('#case').classList.add('hidden'); }
 current=page;$$('.site-head nav button').forEach(b=>b.classList.toggle('active',b.dataset.nav===page));window.scrollTo(0,0);
 if(page==='archive'){prepareAutoVideos($('#archive'));}
 if(page!=='case')$$('#case video').forEach(v=>v.pause());
 prepareAutoVideos(document.querySelector(page==='case'?'#case':'#'+page));
}
$$('[data-nav]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.nav)));
const chosenJamo=new Set();$$('[data-jamo]').forEach(b=>b.addEventListener('click',()=>{
const i=+b.dataset.jamo;chosenJamo.has(i)?chosenJamo.delete(i):chosenJamo.add(i);b.classList.toggle('picked',chosenJamo.has(i));$('#jo').textContent=chosenJamo.has(0)&&chosenJamo.has(1)?'조':'·';$('#hap').textContent=[2,3,4].every(x=>chosenJamo.has(x))?'합':'·';$('#jamo-hint').textContent=chosenJamo.size===5?'조합 / FORMED IN BETWEEN.':`${chosenJamo.size} / 5 COMPONENTS`; }));
$('#jamo-clear').addEventListener('click',()=>{chosenJamo.clear();$$('[data-jamo]').forEach(b=>b.classList.remove('picked'));$('#jo').textContent='·';$('#hap').textContent='·';$('#jamo-hint').textContent='SELECT COMPONENTS TO FORM 조합.'});
function practiceUpdate(){const a=+$('#range-a').value,b=+$('#range-b').value;const left=$('.orb-a'),right=$('.orb-b');if(left&&right){const d=Math.abs(a-b);left.style.transform=`translateX(${-32-d*3}%) translateY(${(a-2.5)*2}px) rotate(${a*9}deg)`;right.style.transform=`translateX(${32+d*3}%) translateY(${(b-2.5)*-2}px) rotate(${-b*9}deg)`;left.style.opacity=String(.76+a*.025);right.style.opacity=String(.73+b*.03)}$('#field-a').innerHTML=esc(practices[a]).replace(' ','<br>');$('#field-b').innerHTML=esc(practices[b]).replace(' ','<br>');const ids=a===b?[]:matches[[a,b].sort((x,y)=>x-y).join('|')]||[];$('#sai-number').textContent=ids.length.toString().padStart(2,'0')+' / CONNECTED WORKS';$('#sai-results').innerHTML=ids.length?ids.map((k,i)=>`<button data-project="${k}"><span class="label">0${i+1} / ${esc(projects[k].type)}</span><strong>${esc(projects[k].name)} ↗</strong><small>${esc(projects[k].headline)}</small></button>`).join(''):'<p>Choose two different practices to discover connections.</p>'};
$('#range-a').addEventListener('input',practiceUpdate);$('#range-b').addEventListener('input',practiceUpdate);practiceUpdate();
function coverHTML(key){
if(key==='schrodinger')return `<img class="bg" src="assets/schrodinger/gametitile_background.gif" alt="Animated game title background"><img class="logo-overlay" src="assets/schrodinger/logo.png" alt="Schrödinger’s Curiosity title logo">`;
let src=key==='standdown'?'assets/stand-down/StandDown_Logo.png':key==='stockwave'?'assets/stockwave/stockwave-logo-cutout.png':key==='memoria'?'assets/memoria/MEMORIA_THUMBNAIL.png':'assets/panopticon/PANOPTICON_LOGO.png';
return `<img src="${src}" alt="${esc(titles[key])} preview">`;
}
function selectWork(k){selected=k;$$('.work-list button').forEach(b=>b.classList.toggle('active',b.dataset.select===k));$('#work-preview-art').className='work-preview-art'+(k==='schrodinger'?' is-animated':'');$('#work-preview-art').innerHTML=coverHTML(k);$('#work-type').textContent=projects[k].type;$('#work-note').textContent=projects[k].headline;}
$('#work-list').innerHTML=workOrder.map((k,i)=>`<button data-select="${k}"><span class="idx">0${i+1}</span><strong>${esc(projects[k].name)}</strong><span>↗</span></button>`).join('');
$$('[data-select]').forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.select;if(k===selected)openProject(k);else selectWork(k)}));selectWork('memoria');$('#work-open').addEventListener('click',()=>openProject(selected));
const pixel=k=>k==='schrodinger';
const isPoster=m=>m.poster||'';
function tile(m,key,extra=''){
const c=esc(m.caption),src=esc(m.src);if(m.type==='video')return `<figure class="media-tile ${extra}"><video controls muted autoplay loop playsinline preload="metadata" poster="${esc(isPoster(m))}" src="${src}"></video><figcaption>${c}</figcaption></figure>`;
if(m.type==='pdf')return `<figure class="media-tile pdf ${extra}"><span class="label">ORIGINAL DOCUMENT / PDF</span><a href="${src}" target="_blank" rel="noopener">${c} ↗</a><figcaption>Opens the original PDF document.</figcaption></figure>`;
return `<figure class="media-tile ${extra}"><img class="zoomable ${pixel(key)?'pixel':''}" src="${src}" alt="${c}" loading="lazy" data-zoom="${src}" data-caption="${c}"><figcaption>${c}</figcaption></figure>`;
}
// Per-chapter browsing: category-specific assets are never placed in unrelated sections.
// Each original source file appears in exactly one category, except explicit team-only context.
function mediaPanel(key,group,opts={}){
const alreadyFeatured={memoria:'MEMORIA_THUMBNAIL.png',standdown:'STANDDOWN_FullGameplay.mp4',schrodinger:'gametitile_background.gif',stockwave:'Stockwave_wholelayout.jpg',vfx:'vfx_portal.mp4',modeling:'3DModeling_Snorlax3.png',illustration:'__no_featured_exclusion__'};
const items=(media[key]||[]).filter(m=>m.group===group&&!m.src.endsWith('/'+(alreadyFeatured[key]||'__none__')));
if(!items.length)return '';
const first=opts.show===1?1:2;
const id=`${key}-${group}`.replace(/[^\w-]/g,'-');
return `<div class="media-module" id="module-${id}" data-key="${key}" data-group="${group}" data-index="0" data-show="${first}"><div class="media-carousel ${first===1?'single':''}">${items.slice(0,first).map(m=>tile(m,key)).join('')}</div>${items.length>first?`<div class="media-controls"><span class="media-count">01—${String(Math.min(first,items.length)).padStart(2,'0')} / ${String(items.length).padStart(2,'0')} ITEMS</span><div><button class="media-prev" disabled aria-label="Previous ${group} media">←</button> <button class="media-next" aria-label="Next ${group} media">→</button></div></div>`:''}</div>`;
}
function chapterHTML(section,k,i){if(k==='vfx'&&section.group==='effects'){const arr=media.vfx||[];return `<section class="vfx-filmstrip-section"><div class="filmstrip-intro"><span class="label">09 / MOTION STUDIES</span><h3>Nine expressions of motion.</h3><p>Move horizontally to explore atmosphere, light, particles and timing. Each effect is independently playable.</p></div><div class="vfx-filmstrip" tabindex="0" aria-label="Nine VFX videos — scroll horizontally">${arr.map(a=>tile(a,'vfx')).join('')}</div><p class="label">SCROLL SIDEWAYS TO SEE ALL NINE VIDEOS →</p></section>`} const layout=section.layout||'split';const noMedia=section.group==='none';const mediaString=noMedia?'':mediaPanel(k,section.group,{show:section.layout==='feature'&&k==='illustration'?1:2});return `<article class="chapter ${layout==='split-reverse'?'reverse':layout==='statement'?'text':layout}" id="section-${k}-${i}"><div class="chapter-text"><span class="label">${esc(section.tag)}</span><h3>${esc(section.title)}</h3><p>${esc(section.body)}</p></div>${mediaString?`<div class="chapter-media">${mediaString}</div>`:''}</article>`}
function heroMedia(k){
if(k==='panopticon')return `<div class="gameplay-placeholder"><span class="label">PRE-RELEASE CAPSTONE / IN DEVELOPMENT</span><strong>GAMEPLAY VIDEO</strong><small>PLACEHOLDER — WILL BE ADDED WHEN AVAILABLE</small><div class="label">START SCREEN / OPTIONS SCREEN — ALSO PENDING</div></div>`;
if(k==='schrodinger')return `<div class="hero-media"><img class="animated-bg" src="assets/schrodinger/gametitile_background.gif" alt="Animated pixel-art title background"><img class="logo-overlay" src="assets/schrodinger/logo.png" alt="Game title logo"></div>`;
if(k==='vfx')return `<div class="hero-media"><video src="assets/vfx/vfx_portal.mp4" poster="assets/vfx/vfx_portal-poster.jpg" muted autoplay loop playsinline controls preload="metadata"></video></div>`;
if(k==='standdown')return `<div class="hero-media"><video src="assets/stand-down/STANDDOWN_FullGameplay.mp4" poster="assets/stand-down/STANDDOWN_FullGameplay-poster.jpg" controls muted autoplay loop playsinline preload="metadata"></video></div>`;
if(k==='vaast'||k==='inman')return '';
let src=k==='stockwave'?'assets/stockwave/stockwave-logo-cutout.png':k==='memoria'?'assets/memoria/MEMORIA_THUMBNAIL.png':k==='modeling'?'assets/modeling/3DModeling_Snorlax3.png':'assets/illustration/2D_Characters.jpg';
return `<div class="hero-media"><img src="${src}" alt="${esc(projects[k].name)} main visual"></div>`;
}
function mainLink(p){return p.link?`<a class="dark-button" href="${esc(p.link[1])}" target="_blank" rel="noopener">${esc(p.link[0])}</a>`:''}
function introMediaHTML(m){if(!m)return "";const cap=esc(m.caption||"Selected project media");if(m.type==='image'||(m.src||'').match(/\.(png|jpe?g|webp|gif)$/i))return `<div class="case-intro-media"><img src="${esc(m.src)}" alt="${cap}"><p class="label">${cap}</p></div>`;return `<div class="case-intro-media"><video controls muted autoplay loop playsinline preload="metadata" poster="${esc(m.poster||'')}" src="${esc(m.src)}"></video><p class="label">${cap}</p></div>`}
function openProject(k){
 const p=projects[k];if(!p)return;previous=current==='case'?previous:current;
 const all=media[k]||[];const assigned=new Set(p.sections.map(s=>s.group));
 const unassigned=all.filter(m=>!assigned.has(m.group)&&!(k==='panopticon'&&m.group==='team'));
 // Team-created Panopticon files are shown only as team-context documentation, never credited to the user.
 let appendix='';if(unassigned.length){appendix=`<details class="gallery-extra"><summary>Additional source materials / ${unassigned.length} files <span class="label">↘</span></summary><p>Selected supporting materials and production context.</p><div class="extra-grid">${unassigned.map(m=>tile(m,k)).join('')}</div></details>`}
 let placeholder=k==='schrodinger'?`<div class="gameplay-placeholder" style="margin:35px 0"><strong>FULL GAMEPLAY</strong><small>PLACEHOLDER / schrodingers-full-gameplay.mp4</small><span class="label">Replace this file in the project's assets folder when available.</span></div>`:'';
 const noArtwork=k==='vaast'||k==='inman';
 $('#case').className='case-screen case-'+k;
 $('#case-content').innerHTML=`<div class="case-top"><span class="label">${esc(p.kicker)}</span><button id="back-case" class="light-button">← BACK TO ${previous==='archive'?'ARCHIVE':previous==='research'?'RESEARCH':'WORK'}</button></div><div class="case-hero"><div class="case-headline"><span class="label">${esc(p.type)}</span><h1>${esc(p.name)}</h1><h2>${esc(p.headline)}</h2><p>${esc(p.intro)}</p><div class="role-line"><span class="label">MY ROLE</span><strong>${esc(p.role)}</strong></div>${mainLink(p)}</div>${noArtwork?'':`<div>${heroMedia(k)}<p class="label">${k==='panopticon'?'CAPSTONE PROJECT / TEAM PRODUCTION':k==='standdown'?'GAMEPLAY VIDEO / PLAY TO VIEW':k==='vfx'?'PORTAL / AUTOPLAYING MOTION STUDY':'SELECTED ORIGINAL PROJECT WORK'}</p></div>`}</div><div class="case-intro${p.introMedia?' with-media':''}"><div><span class="label">CONTEXT / DESIGN INTENT</span>${String(p.lead).split(/\n\n/).map(par=>`<p class="case-intro-paragraph">${esc(par)}</p>`).join('')}</div>${p.introMedia?introMediaHTML(p.introMedia):''}</div><div class="case-chapters">${p.sections.map((s,i)=>chapterHTML(s,k,i)).join('')}</div>${placeholder}${appendix}<div class="case-end"><h3>END OF ${esc(p.name)}.</h3><button class="light-button" id="case-return">← RETURN</button></div>`;
 $('#back-case').addEventListener('click',()=>show(previous));$('#case-return').addEventListener('click',()=>show(previous));show('case');
 // Rich media should not auto-play together; portal is the deliberate exception.
 if(k==='vfx'){$('#case .hero-media video')?.play().catch(()=>{})}
}
document.addEventListener('click',ev=>{
 const projectBtn=ev.target.closest('[data-project]');if(projectBtn){openProject(projectBtn.dataset.project);return}
 const mod=ev.target.closest('.media-module');
 if(mod&&(ev.target.closest('.media-next')||ev.target.closest('.media-prev'))){
  const key=mod.dataset.key,group=mod.dataset.group,alreadyFeatured={memoria:'MEMORIA_THUMBNAIL.png',standdown:'STANDDOWN_FullGameplay.mp4',schrodinger:'gametitile_background.gif',stockwave:'Stockwave_wholelayout.jpg',vfx:'vfx_portal.mp4',modeling:'3DModeling_Snorlax3.png',illustration:'__no_featured_exclusion__'},items=media[key].filter(m=>m.group===group&&!m.src.endsWith('/'+(alreadyFeatured[key]||'__none__'))),showN=+mod.dataset.show;
  let index=+mod.dataset.index;index+=ev.target.closest('.media-next')?showN:-showN;index=Math.max(0,Math.min(index,Math.max(0,items.length-showN)));mod.dataset.index=index;
  mod.querySelector('.media-carousel').innerHTML=items.slice(index,index+showN).map(m=>tile(m,key)).join('');
  prepareAutoVideos(mod);
  mod.querySelector('.media-prev').disabled=index===0;mod.querySelector('.media-next').disabled=index+showN>=items.length;
  mod.querySelector('.media-count').textContent=`${String(index+1).padStart(2,'0')}—${String(Math.min(index+showN,items.length)).padStart(2,'0')} / ${String(items.length).padStart(2,'0')} ITEMS`;return;
 }
 const img=ev.target.closest('[data-zoom]');if(img){$('#lightbox-image').src=img.dataset.zoom;$('#lightbox-image').alt=img.alt;$('#lightbox-caption').textContent=img.dataset.caption;$('#lightbox').classList.remove('hidden')}
});
$('#lightbox-close').addEventListener('click',()=>$('#lightbox').classList.add('hidden'));
$('#lightbox').addEventListener('click',e=>{if(e.target.id==='lightbox')$('#lightbox').classList.add('hidden')});
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('#lightbox').classList.add('hidden')});
show('home');
})();
