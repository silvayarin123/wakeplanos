import {env} from 'cloudflare:workers';
import {database} from '@/lib/server';
export const dynamic='force-dynamic';
export async function GET(_req:Request,{params}:{params:Promise<{id:string}>}){const {id}=await params;if(!/^[a-f0-9-]{36}$/.test(id))return new Response('Não encontrado',{status:404});const row=await database().prepare('SELECT object_key, mime FROM wake_assets WHERE id = ?').bind(id).first<{object_key:string;mime:string}>();if(!row||!env.BUCKET)return new Response('Não encontrado',{status:404});const obj=await env.BUCKET.get(row.object_key);if(!obj)return new Response('Não encontrado',{status:404});return new Response(obj.body,{headers:{'Content-Type':row.mime,'Cache-Control':'public, max-age=3600','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex'}});}
