'use client';
import {useEffect} from 'react';
export default function ProposalEffects(){useEffect(()=>{
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 if(reduced.matches)return;
 const observed=new WeakSet<Element>();
 const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');reveal.unobserve(e.target);}}),{threshold:.05});
 const motion=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('is-motion-active',e.isIntersecting)),{rootMargin:'40px'});
 const scan=()=>{document.querySelectorAll('.tech-reveal,.neon-frame,.brand-strip').forEach(n=>{if(observed.has(n))return;observed.add(n);if(n.classList.contains('tech-reveal'))reveal.observe(n);if(n.matches('.neon-frame,.brand-strip'))motion.observe(n);});};
 scan();const changes=new MutationObserver(scan);changes.observe(document.body,{childList:true,subtree:true});
 const visibility=()=>document.documentElement.classList.toggle('page-hidden',document.visibilityState!=='visible');document.addEventListener('visibilitychange',visibility);
 return()=>{reveal.disconnect();motion.disconnect();changes.disconnect();document.removeEventListener('visibilitychange',visibility);document.documentElement.classList.remove('page-hidden');};
 },[]);return null;}
