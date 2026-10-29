import {env} from 'cloudflare:workers';
import {headers} from 'next/headers';
import {type ChatGPTUser} from '@/app/chatgpt-auth';

export const cookieName=import.meta.env.DEV?'wake-editor-local':'__Host-wake-editor';
export const sessionSeconds=7*24*60*60;
type Access={id:string;owner_id:string;password_hash:string;salt:string;version:number;failures:number;locked_until:string|null};
const db=()=>{if(!env.DB)throw new Error('Banco de dados indisponível.');return env.DB;};
export const randomKey=(size=32)=>Array.from(crypto.getRandomValues(new Uint8Array(size)),v=>v.toString(16).padStart(2,'0')).join('');
export async function digest(value:string){const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));return Array.from(new Uint8Array(hash),v=>v.toString(16).padStart(2,'0')).join('');}
export async function editorAccess(){
 let access=await db().prepare('SELECT * FROM wake_editor_access WHERE id = ?').bind('primary').first<Access>();
 // The owner configures the password through a server secret. The browser only
 // receives a session cookie; neither the password nor its hash enters a bundle.
 if(env.EDITOR_PASSWORD_CONFIG){
  const config=JSON.parse(env.EDITOR_PASSWORD_CONFIG) as {salt:string;hash:string};
  if(!/^[a-f0-9]{48}$/.test(config.salt)||!/^[a-f0-9]{64}$/.test(config.hash))throw new Error('Configuração de acesso inválida.');
  if(!access||access.salt!==config.salt||access.password_hash!==config.hash){
   const savedOwner=access?.owner_id||
    (await db().prepare('SELECT owner_id FROM wake_settings ORDER BY updated_at DESC LIMIT 1').first<{owner_id:string}>())?.owner_id||
    (await db().prepare('SELECT owner_id FROM wake_proposals ORDER BY updated_at DESC LIMIT 1').first<{owner_id:string}>())?.owner_id||'wake-primary-editor';
   await db().prepare('INSERT INTO wake_editor_access (id, owner_id, password_hash, salt, version, failures, updated_at) VALUES (?, ?, ?, ?, 1, 0, ?) ON CONFLICT(id) DO UPDATE SET password_hash = excluded.password_hash, salt = excluded.salt, version = wake_editor_access.version + 1, failures = 0, locked_until = NULL, updated_at = excluded.updated_at WHERE wake_editor_access.password_hash != excluded.password_hash OR wake_editor_access.salt != excluded.salt').bind('primary',savedOwner,config.hash,config.salt,new Date().toISOString()).run();
   access=await db().prepare('SELECT * FROM wake_editor_access WHERE id = ?').bind('primary').first<Access>();
  }
 }
 return access;
}
export async function passwordHash(password:string,salt:string){
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);
 const bits=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',iterations:100000,salt:new TextEncoder().encode(salt)},key,256);
 return Array.from(new Uint8Array(bits),v=>v.toString(16).padStart(2,'0')).join('');
}
export function constantEqual(a:string,b:string){let different=a.length^b.length;for(let i=0;i<Math.max(a.length,b.length);i++)different|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0);return different===0;}
export async function readSessionToken(){const cookie=(await headers()).get('cookie')||'';return cookie.split(';').map(v=>v.trim()).find(v=>v.startsWith(cookieName+'='))?.slice(cookieName.length+1)||'';}
export async function editorIdentity():Promise<ChatGPTUser|null>{
 await editorAccess();
 const token=await readSessionToken();if(!/^[a-f0-9]{64}$/.test(token))return null;
 const row=await db().prepare('SELECT s.owner_id FROM wake_editor_sessions s JOIN wake_editor_access a ON a.id = ? AND a.owner_id = s.owner_id AND a.version = s.version WHERE s.id = ? AND s.expires_at > ?').bind('primary',await digest(token),new Date().toISOString()).first<{owner_id:string}>();
 return row?{userId:row.owner_id,email:'',displayName:'WAKE',fullName:'WAKE'}:null;
}
export async function createEditorSession(access:Access){
 const token=randomKey(),expires=new Date(Date.now()+sessionSeconds*1000).toISOString();
 await db().batch([
  db().prepare('DELETE FROM wake_editor_sessions WHERE expires_at <= ?').bind(new Date().toISOString()),
  db().prepare('INSERT INTO wake_editor_sessions (id, owner_id, version, expires_at) VALUES (?, ?, ?, ?)').bind(await digest(token),access.owner_id,access.version,expires)
 ]);
 return token;
}
export function sessionCookie(token:string,maxAge=sessionSeconds){
 const context=import.meta.env.DEV?'; SameSite=Lax':'; SameSite=None; Secure; Partitioned';
 return `${cookieName}=${token}; Path=/; HttpOnly; Max-Age=${maxAge}${context}`;
}
