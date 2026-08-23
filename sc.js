(function(){
'use strict';
var R=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* nav scroll */
var nav=document.getElementById('navbar');
window.addEventListener('scroll',function(){
  nav.style.borderBottomColor=window.scrollY>40?'#d4d4d4':'transparent';
},{passive:true});

/* mobile menu */
var btn=document.getElementById('menu-btn');
var menu=document.getElementById('mobile-menu');
function open(){menu.classList.add('open');btn.setAttribute('aria-expanded','true');document.body.style.overflow='hidden'}
function close(){menu.classList.remove('open');btn.setAttribute('aria-expanded','false');document.body.style.overflow=''}
btn.addEventListener('click',function(){menu.classList.contains('open')?close():open()});
menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',close)});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&menu.classList.contains('open')){close();btn.focus()}});

/* smooth scroll */
document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener('click',function(e){
    var id=a.getAttribute('href');
    if(!id||id==='#')return;
    var el=document.querySelector(id);
    if(el){e.preventDefault();el.scrollIntoView({behavior:R?'auto':'smooth'});history.pushState(null,'',id)}
  });
});

/* reveal on scroll */
var reveals=document.querySelectorAll('.rv');
if(reveals.length){
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target)}});
  },{threshold:0.08,rootMargin:'0px 0px -20px 0px'});
  reveals.forEach(function(el){obs.observe(el)});
}

/* active nav */
var navLinks=document.querySelectorAll('#nav-links a');
var secs=[];
navLinks.forEach(function(a){
  var id=a.getAttribute('href');
  if(id&&id.startsWith('#')){var s=document.querySelector(id);if(s)secs.push({el:s,link:a})}
});
function updateActive(){
  var y=window.scrollY+120;var cur=secs[0];
  secs.forEach(function(s){if(s.el.offsetTop<=y)cur=s});
  navLinks.forEach(function(a){a.classList.remove('active')});
  if(cur)cur.link.classList.add('active');
}
window.addEventListener('scroll',updateActive,{passive:true});
updateActive();
})();
