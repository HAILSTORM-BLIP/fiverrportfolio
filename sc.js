(function(){
'use strict';
var REDUCED=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* nav scroll */
var nav=document.getElementById('navbar');
window.addEventListener('scroll',function(){
  nav.classList.toggle('scrolled',window.scrollY>40);
},{passive:true});

/* mobile menu */
var btn=document.getElementById('menu-btn');
var menu=document.getElementById('mobile-menu');
function openMenu(){menu.classList.add('open');btn.setAttribute('aria-expanded','true');document.body.style.overflow='hidden'}
function closeMenu(){menu.classList.remove('open');btn.setAttribute('aria-expanded','false');document.body.style.overflow=''}
btn.addEventListener('click',function(){menu.classList.contains('open')?closeMenu():openMenu()});
menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',closeMenu)});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&menu.classList.contains('open')){closeMenu();btn.focus()}});

/* smooth scroll */
document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener('click',function(e){
    var id=a.getAttribute('href');
    if(!id||id==='#')return;
    var el=document.querySelector(id);
    if(el){e.preventDefault();el.scrollIntoView({behavior:REDUCED?'auto':'smooth'});history.pushState(null,'',id)}
  });
});

/* reveal on scroll */
var reveals=document.querySelectorAll('.rv');
if(reveals.length){
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target)}});
  },{threshold:0.1,rootMargin:'0px 0px -30px 0px'});
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
