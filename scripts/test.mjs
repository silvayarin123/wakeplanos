import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFile,writeFile} from 'node:fs/promises';
import {api,hashWord,shortCode,sharePage} from '../src/data-api.mjs';
const sqlite=new DatabaseSync(':memory:');sqlite.exec(await readFile('migrations.sql','utf8'));
const DB={prepare(sql){let args=[];return {bind(...v){args=v;return this;},async first(){return sqlite.prepare(sql).get(...args)||null;},async all(){return {results:sqlite.prepare(sql).all(...args)};},async run(){return {meta:sqlite.prepare(sql).run(...args)};}};}};
const salt='11'.repeat(24),word='test123',hash=await hashWord(word,salt),env={DB,EDITOR_PASSWORD_CONFIG:JSON.stringify({salt,hash}),BUCKET:{}};
const invoke=(path,method='GET',body,token)=>api(new Request('https://test.invalid/api/'+path,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),'Origin':'https://embedded.test'},...(body?{body:JSON.stringify(body)}:{})}),env);
let r=await invoke('bootstrap');assert.equal(r.status,401);
r=await invoke('access','POST',{word:'wrong'});assert.equal(r.status,401);
r=await invoke('access','POST',{word});assert.equal(r.status,200);const login=await r.json();assert.match(login.token,/^[a-f0-9]{64}$/);assert.equal(login.redirectTo,'/painel');const token=login.token;
r=await invoke('bootstrap','GET',undefined,token);assert.equal(r.status,200);assert.equal((await r.json()).proposals.length,0);
const data={clientName:'Cliente de teste',title:'Proposta comercial',services:[{title:'Lançamento Digital',description:'Vídeos profissionais\nHospedagem das aulas'}],price:1200,payment:'Teste',notes:'',brandIds:[],clientLogo:''};
let first;
for(let i=0;i<10;i++){r=await invoke('proposals','POST',{...data,clientName:'Cliente '+i},token);assert.equal(r.status,201);const p=(await r.json()).proposal;if(i===0)first=p;}
r=await invoke('proposals','POST',data,token);assert.equal(r.status,409);
r=await invoke('public/'+first.token);assert.equal(r.status,200);assert.equal((await r.json()).proposal.data.services[0].title,'Lançamento Digital');
assert.match(first.shareCode,/^[A-Za-z0-9_-]{16}$/);assert.equal(first.shareCode,shortCode(first.token));
r=await invoke('public/'+first.shareCode);assert.equal(r.status,200);assert.equal((await r.json()).proposal.id,first.id);
const shared=await sharePage(new Request('https://test.invalid/s/'+first.shareCode),env,await readFile('src/index.html','utf8'));
assert.equal(shared.status,200);const sharedHtml=await shared.text();
assert.match(sharedHtml,/<meta property="og:title" content="WAKE Propostas">/);assert.match(sharedHtml,/Uma proposta preparada para Cliente 0/);assert.match(sharedHtml,/assets\/preview\.png/);
assert.equal((sharedHtml.match(/property="og:title"/g)||[]).length,1);
assert.match(sharedHtml,new RegExp('/s/'+first.shareCode));

r=await invoke('proposals/'+first.id,'PUT',{...data,clientName:'Cliente editado',price:1800},token);assert.equal(r.status,200);assert.equal((await r.json()).proposal.data.price,1800);
r=await invoke('proposals/'+first.id,'DELETE',undefined,token);assert.equal(r.status,200);
r=await invoke('public/'+first.token);assert.equal(r.status,404);
r=await invoke('public/'+first.shareCode);assert.equal(r.status,404);
const gone=await sharePage(new Request('https://test.invalid/s/'+first.shareCode),env,await readFile('src/index.html','utf8'));assert.equal(gone.status,404);
r=await invoke('proposals','POST',data,token);assert.equal(r.status,201);
r=await invoke('settings','PUT',{phone:'43999999999',email:'teste@example.com',location:'Londrina'},token);assert.equal(r.status,200);
r=await invoke('logout','POST',undefined,token);assert.equal(r.status,200);r=await invoke('bootstrap','GET',undefined,token);assert.equal(r.status,401);
// The normal browser session is never needed for API writes: only this random,
// server-issued token authorizes private data, including inside embedded views.
console.log('OK: link curto de 16 caracteres, links antigos preservados, prévia Open Graph no HTML, exclusão dos dois links; palavra curta, origem incorporada, token obrigatório, 10 propostas, edição, link público, exclusão, contatos e saída.');
