const strategies={maintenance:{name:'Maintenance Rehearsal',instructions:'Repeat each word over and over until the next word appears.'},self:{name:'Self-Reference',instructions:'Think about how each word relates to your life or experiences.'},imagery:{name:'Mental Imagery',instructions:'Form a vivid mental picture of the object.'}};
const wordLists=[['guitar','orange','bridge','rabbit','candle','wallet'],['bicycle','cookie','camera','garden','turtle','jacket'],['hammer','bedroom','airplane','pumpkin','mirror','backpack']];
let app=document.getElementById('app'),session={};
function sh(a){a=[...a];for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function start(){let so=sh(Object.keys(strategies)),lo=sh([0,1,2]);session.map={};session.order=so;session.i=0;so.forEach((s,i)=>session.map[s]=wordLists[lo[i]]);nextBlock();}
function nextBlock(){if(session.i===3)return distractor();let s=session.order[session.i];app.innerHTML=`<h2>${strategies[s].name}</h2><p>${strategies[s].instructions}</p><button id=n>Begin</button>`;n.onclick=()=>show(session.map[s],s,0);}
function show(list,s,i){if(i>=list.length){session.i++;return nextBlock();}app.innerHTML=`<div class=word>${list[i]}</div>`;setTimeout(()=>show(list,s,i+1),3000);}
function distractor(){let num=Math.floor(Math.random()*900)+100;app.innerHTML=`<h2>Distractor Task</h2><p>Count backward by 3s from <b>${num}</b> for 30 seconds.</p><textarea></textarea><div id=t>30</div>`;let c=30;let iv=setInterval(()=>{t.textContent=--c;if(c<=0){clearInterval(iv);recall();}},1000);}
function recall(){app.innerHTML=`<h2>Recall</h2><textarea id=r></textarea><button id=s>Score</button>`;s.onclick=score;}
function score(){let resp=new Set(r.value.toLowerCase().split(/[\s,
]+/).filter(Boolean));let rows=[],sum=[];for(let st of session.order){let c=0;for(let w of session.map[st]){let hit=[...resp].some(x=>x===w||x.startsWith(w)||w.startsWith(x));if(hit)c++;rows.push([strategies[st].name,w,hit]);}sum.push([strategies[st].name,c]);}
app.innerHTML='<h2>Results</h2><table><tr><th>Strategy</th><th>Score</th></tr>'+sum.map(x=>`<tr><td>${x[0]}</td><td>${x[1]}/6</td></tr>`).join('')+'</table><button id=a>Summary CSV</button><button id=b>Trial CSV</button>';
a.onclick=()=>dl('strategy,score
'+sum.map(x=>x.join(',')).join('
'),'summary.csv');
b.onclick=()=>dl('strategy,word,recalled
'+rows.map(x=>[x[0],x[1],x[2]?1:0].join(',')).join('
'),'trial_level.csv');}
function dl(txt,name){let blob=new Blob([txt],{type:'text/csv'});let a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();}
app.innerHTML='<button id=startBtn>Start Experiment</button>';startBtn.onclick=start;