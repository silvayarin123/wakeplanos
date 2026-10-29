import {sameOrigin,jsonInput,reply,failure,HttpError,database,now} from '@/lib/server';
import {editorAccess,editorIdentity,passwordHash,constantEqual,createEditorSession,sessionCookie,readSessionToken,digest} from '@/lib/editor-auth';
export const dynamic='force-dynamic';
export async function GET(){try{return reply({configured:!!await editorAccess(),authenticated:!!await editorIdentity()});}catch(e){return failure(e);}}
function formRedirect(path:string){return new Response(null,{status:303,headers:{Location:path,'Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow','Referrer-Policy':'no-referrer'}});}
export async function POST(req:Request){
 const isForm=req.headers.get('content-type')?.includes('application/x-www-form-urlencoded')||false;
 try{
 let body:{action?:string;password?:string};
 if(isForm){const text=await req.text();if(text.length>4096)throw new HttpError(413,'Conteúdo muito grande.');const fields=new URLSearchParams(text);body={action:fields.get('action')||'',password:fields.get('password')||''};}
 else{sameOrigin(req);body=await jsonInput(req) as {action?:string;password?:string};}
 if(isForm&&body.action!=='login')throw new HttpError(400,'Ação inválida.');
 if(body.action==='logout'){
  const token=await readSessionToken();if(token)await database().prepare('DELETE FROM wake_editor_sessions WHERE id = ?').bind(await digest(token)).run();
  const response=reply({ok:true});response.headers.set('Set-Cookie',sessionCookie('',0));return response;
 }
 if(body.action!=='login')throw new HttpError(400,'Ação inválida.');
 const password=body.password;
 if(typeof password!=='string'||password.length<10||password.length>128)throw new HttpError(400,'Confira a senha informada.');
 const access=await editorAccess();
 if(!access)throw new HttpError(503,'O acesso à edição ainda não foi configurado.');
 if(access.locked_until&&access.locked_until>now())throw new HttpError(429,'Muitas tentativas. Aguarde cinco minutos e tente novamente.');
 const valid=constantEqual(await passwordHash(password,access.salt),access.password_hash);
 if(!valid){
  const current=now(),lock=new Date(Date.now()+5*60*1000).toISOString();
  await database().prepare('UPDATE wake_editor_access SET failures = CASE WHEN locked_until IS NOT NULL AND locked_until <= ? THEN 1 ELSE failures + 1 END, locked_until = CASE WHEN (locked_until IS NULL OR locked_until > ?) AND failures >= 7 THEN ? ELSE NULL END WHERE id = ?').bind(current,current,lock,'primary').run();
  throw new HttpError(401,'Senha incorreta. Tente novamente.');
 }
 await database().prepare('UPDATE wake_editor_access SET failures = 0, locked_until = NULL WHERE id = ?').bind('primary').run();
 const token=await createEditorSession(access),response=isForm?formRedirect('/painel'):reply({ok:true,redirectTo:'/painel'});response.headers.set('Set-Cookie',sessionCookie(token));return response;
 }catch(e){
  if(isForm){const code=e instanceof HttpError?(e.status===401||e.status===400?'senha':e.status===429?'aguarde':e.status===403?'origem':'indisponivel'):'indisponivel';if(!(e instanceof HttpError))console.error('WAKE login failed',e instanceof Error?e.message:'unknown');return formRedirect('/editar?erro='+code);}
  return failure(e);
 }}
