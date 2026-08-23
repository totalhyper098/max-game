import {games} from "../data/games.js";
const box=document.querySelector("#games"),dots=document.querySelector("#dots");
games.forEach((g,i)=>{const c=document.createElement("article");c.className="card";c.innerHTML=`<div class="art ${g.art}">${g.icon}</div><span class="tag">${String(i+1).padStart(2,"0")} · ${g.category}</span><h3>${g.name}</h3><p>${g.description}</p><div class="bottom"><span>${g.players}</span><button class="play" data-game="${g.id}">PLAY NOW →</button></div>`;box.append(c);const d=document.createElement("span");d.className="dot${i===0?" active":""}";dots.append(d)});
const cards=[...document.querySelectorAll(".card")],ds=[...document.querySelectorAll(".dot")];box.addEventListener("scroll",()=>{let mid=box.scrollLeft+box.clientWidth/2,b=0,x=1e9;cards.forEach((c,i)=>{let q=Math.abs(c.offsetLeft+c.offsetWidth/2-mid);if(q<x){x=q;b=i}});ds.forEach((d,i)=>d.classList.toggle("active",i===b))},{passive:true});
document.querySelectorAll(".play").forEach(b=>b.onclick=()=>{const g=games.find(x=>x.id===b.dataset.game);alert(`${g.name}\n\nNext screen: Local • AI • Online modes.`)});
document.querySelector("#sound").onclick=e=>e.currentTarget.textContent=e.currentTarget.textContent==="♫"?"🔇":"♫";
document.querySelectorAll("nav button").forEach(n=>n.onclick=()=>{document.querySelectorAll("nav button").forEach(x=>x.classList.remove("active"));n.classList.add("active")});
