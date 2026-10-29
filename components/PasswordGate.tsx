'use client';
import {useState} from 'react';
import WakeLogo from './WakeLogo';
import {ArrowLeft,ArrowRight,Eye,EyeOff,LockKeyhole} from 'lucide-react';
export default function PasswordGate({configured,error=''}:{configured:boolean;error?:string}){
 const [show,setShow]=useState(false);
 // Keep this as a plain browser form. It works both on the public URL and when
 // the Site is opened inside an embedded preview, without a client-side wait.
 return <main className="password-page password-simple"><a className="password-logo" href="/" aria-label="WAKE · Página inicial"><WakeLogo/></a><section className="password-card"><span className="password-lock"><LockKeyhole size={22}/></span><span className="editor-eyebrow">ÁREA RESERVADA</span><h1>Painel de edição.</h1><form method="post" action="/api/editor-session"><input type="hidden" name="action" value="login"/><p>Digite sua senha para personalizar e salvar as propostas.</p><label className="editor-field"><span>Senha de edição</span><div className="password-input"><input name="password" type={show?'text':'password'} autoComplete="current-password" required minLength={10} maxLength={128} placeholder="Digite sua senha" aria-invalid={error?true:undefined} aria-describedby={error?'editor-login-error':undefined}/><button type="button" aria-label={show?'Ocultar senha':'Mostrar senha'} onClick={()=>setShow(v=>!v)}>{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>{error&&<p id="editor-login-error" role="alert" className="editor-error">{error}</p>}{!configured&&<p role="alert" className="editor-error">O acesso ainda não está disponível.</p>}<button type="submit" className="editor-primary" disabled={!configured}><ArrowRight size={17}/> Entrar no painel</button></form><a className="password-back" href="/"><ArrowLeft size={14}/>Voltar à proposta</a></section></main>;
}
