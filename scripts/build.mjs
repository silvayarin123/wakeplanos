import {readFile,mkdir,writeFile,rm} from 'node:fs/promises';
import {dirname} from 'node:path';
await rm('dist',{recursive:true,force:true});await rm('web',{recursive:true,force:true});
const read=path=>readFile(path,'utf8');
const assets=JSON.parse(await read('src/assets.json'));
const brands=Object.entries(assets).filter(([path])=>path.endsWith('.png')&&path!=='/assets/logo.png').map(([src,a])=>({src,name:a.name}));
const html=await read('src/index.html'),css=await read('src/style.css'),js='window.WAKE_BRANDS='+JSON.stringify(brands)+';\n'+await read('src/app.js'),server=await read('src/data-api.mjs');
await mkdir('web/assets',{recursive:true});
for(const [path,a] of Object.entries(assets))await writeFile('web'+path,Buffer.from(a.body,'base64'));
await writeFile('web/index.html',html);await writeFile('web/style.css',css);await writeFile('web/app.js',js);
if(!process.argv.includes('--static')){
const worker=server+'\nconst HTML='+JSON.stringify(html)+',CSS='+JSON.stringify(css)+',JS='+JSON.stringify(js)+',ASSETS='+JSON.stringify(assets)+';\n'+`export default {async fetch(req,env){const p=new URL(req.url).pathname;if(p.startsWith('/api/'))return api(req,env);if(ASSETS[p]){const a=ASSETS[p];return new Response(Uint8Array.from(atob(a.body),x=>x.charCodeAt(0)),{headers:{'Content-Type':a.type,'Cache-Control':'public,max-age=86400','X-Content-Type-Options':'nosniff'}});}if(p==='/style.css'||p==='/app.js')return new Response(p==='/style.css'?CSS:JS,{headers:{'Content-Type':p==='/style.css'?'text/css; charset=utf-8':'text/javascript; charset=utf-8','Cache-Control':'no-cache'}});return new Response(HTML,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'}});}};`;
await mkdir('dist/server',{recursive:true});await mkdir('dist/.openai',{recursive:true});await writeFile('dist/server/index.js',worker);await writeFile('dist/.openai/hosting.json',await read('.openai/hosting.json'));
}
console.log('WAKE leve: 22 logos, 1 fonte local, zero dependências de runtime.');
