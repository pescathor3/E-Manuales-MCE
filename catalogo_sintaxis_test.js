
(()=>{
'use strict';
const container = document.getElementById('manualCards');
const tabs = [...document.querySelectorAll('.tab')];
const search = document.getElementById('searchInput');
const count = document.getElementById('resultCount');
const availableCount = document.getElementById('availableCount');
const empty = document.getElementById('emptyState');
const error = document.getElementById('catalogError');
const errorDetail = document.getElementById('catalogErrorDetail');
const localHelp = document.getElementById('catalogLocalHelp');
const fileLabel = document.getElementById('localJSONLabel');
const fileInput = document.getElementById('jsonFileInput');
let level = 'all';
let manuals = [];
const legalLevels = new Set(['starter','explorer','deployer','master']);
const normalize = value => String(value ?? '').toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const arrowIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
const clockIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="9"/></svg>';
function element(tag, className, text){
  const n=document.createElement(tag);
  if(className)n.className=className;
  if(text!==undefined)n.textContent=String(text);
  return n;
}
function safeUrl(s){
 if(typeof s !== 'string' || !s.trim())return '';
 try{
  const u=new URL(s,location.href);
  return ['https:','http:'].includes(u.protocol) ? s : '';
 }catch{return '';}
}
function cleanManuals(input){
  if(!input || !Array.isArray(input.manuales))throw new Error('El archivo debe contener un arreglo llamado "manuales".');
  const ids=new Set();
  return input.manuales.map((row,i)=>{
    if(!row || typeof row !== 'object')throw new Error('Entrada '+(i+1)+' incorrecta.');
    const id=String(row.id||'').trim();
    const titulo=String(row.titulo||'').trim();
    const nivel=normalize(row.nivel).trim();
    const estado=normalize(row.estado).trim();
    if(!id||!titulo||!legalLevels.has(nivel)||!['publicado','preparacion','oculto'].includes(estado)){
      throw new Error('Revisa id, titulo, nivel y estado del manual '+(i+1)+'.');
    }
    if(ids.has(id))throw new Error('Hay un identificador duplicado: '+id);ids.add(id);
    const pasos=Number.isInteger(row.pasos)&&row.pasos>=0?row.pasos:null;
    const imagen=safeUrl(row.imagen);
    const url=safeUrl(row.url);
    return {
      id,titulo,nivel,estado,pasos,imagen,url,
      descripcion:String(row.descripcion||'').trim(),
      keywords:Array.isArray(row.palabras_clave)?row.palabras_clave.join(' '):String(row.palabras_clave||'')
    };
  }).filter(row=>row.estado!=='oculto');
}
function renderCard(m){
  const published=m.estado==='publicado'&&Boolean(m.url);
  const article=element('article','manual-card');
  article.dataset.level=m.nivel;
  article.dataset.status=published?'publicado':'preparacion';
  article.dataset.search=normalize([m.titulo,m.descripcion,m.nivel,m.keywords].join(' '));
  const visual=element('div','card-visual card-visual--'+m.nivel);
  if(m.imagen){
    const img=element('img');img.src=m.imagen;img.alt='Modelo de '+m.titulo;
    img.loading='lazy';img.decoding='async';
    img.addEventListener('error',()=>{img.remove();const ph=element('span','card-image-fallback','Vista previa no disponible');visual.prepend(ph);});
    visual.append(img);
  }else{visual.append(element('span','card-image-fallback','Sin imagen'));}
  const badge=element('span','card-level card-level--'+m.nivel,capitalize(m.nivel));visual.append(badge);
  const body=element('div','card-content');
  const topline=element('div','card-topline');
  const status=element('span','status '+(published?'status--live':'status--soon'));
  status.append(element('span','status-dot'),document.createTextNode(published?'Disponible':'En preparación'));
  topline.append(status,element('span','card-steps',m.pasos!==null?(m.pasos+' pasos'):'Ensamble 3D'));
  body.append(topline,element('h3','',m.titulo),element('p','',m.descripcion));
  if(published){
    const link=element('a','card-cta');link.href=m.url;link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label','Abrir manual de '+m.titulo);link.append(document.createTextNode('Abrir manual '));link.insertAdjacentHTML('beforeend',arrowIcon);body.append(link);
  }else{
    const inactive=element('span','card-cta card-cta--disabled');inactive.setAttribute('aria-label','Manual próximamente disponible');inactive.append(document.createTextNode('Próximamente '));inactive.insertAdjacentHTML('beforeend',clockIcon);body.append(inactive);
  }
  article.append(visual,body);return article;
}
function capitalize(s){return s.charAt(0).toUpperCase()+s.slice(1);}
function filter(){
  const q=normalize(search.value.trim());
  let visible=0;
  for(const card of container.children){
    const show=(level==='all'||card.dataset.level===level)&&(!q||card.dataset.search.includes(q));
    card.hidden=!show;if(show)visible++;
  }
  count.textContent=visible===1?'1 manual encontrado':visible+' manuales encontrados';
  empty.hidden=visible>0;
}
function showError(message){
  error.hidden=false;errorDetail.textContent=message;
  localHelp.hidden=location.protocol!=='file:';
  fileLabel.hidden=location.protocol!=='file:';
  container.setAttribute('aria-busy','false');
  container.replaceChildren();
  count.textContent='No se cargó el catálogo';
  empty.hidden=true;availableCount.textContent='—';
}
function render(data){
  const parsed=cleanManuals(data);
  manuals=parsed;
  container.replaceChildren(...manuals.map(renderCard));
  availableCount.textContent=String(manuals.filter(x=>x.estado==='publicado'&&x.url).length);
  error.hidden=true;
  container.setAttribute('aria-busy','false');
  filter();
}
async function load(){
  error.hidden=true;count.textContent='Cargando manuales…';container.setAttribute('aria-busy','true');
  try{
    const response=await fetch('./manuales.json',{cache:'no-store'});
    if(!response.ok)throw new Error('No se encontró manuales.json (HTTP '+response.status+').');
    const obj=await response.json();render(obj);
  }catch(e){showError(e.message+' Verifica que manuales.json esté junto a index.html.');}
}
tabs.forEach(t=>t.addEventListener('click',()=>{
  level=t.dataset.filter;tabs.forEach(x=>x.setAttribute('aria-pressed',String(x===t)));filter();
}));
search.addEventListener('input',filter);
document.getElementById('resetButton').addEventListener('click',()=>{
 level='all';search.value='';tabs.forEach(t=>t.setAttribute('aria-pressed',String(t.dataset.filter==='all')));filter();
});
document.getElementById('retryCatalog').addEventListener('click',load);
fileInput.addEventListener('change',async()=>{
  const file=fileInput.files?.[0];if(!file)return;
  try{render(JSON.parse(await file.text()));}catch(e){showError('Error en el archivo seleccionado: '+e.message);}
});
load();
})();
