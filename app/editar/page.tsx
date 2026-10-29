import {currentAdmin,getBootstrap} from '@/lib/server';
import {editorAccess} from '@/lib/editor-auth';
import PasswordGate from '@/components/PasswordGate';
import ProposalEditor from '@/components/ProposalEditor';
import {redirect} from 'next/navigation';
export const dynamic='force-dynamic';
const loginErrors:Record<string,string>={senha:'Senha incorreta. Confira os caracteres e tente novamente.',aguarde:'Muitas tentativas. Aguarde cinco minutos antes de tentar novamente.',indisponivel:'Não foi possível abrir o painel agora. Tente novamente.',origem:'Abra esta página diretamente e tente entrar novamente.'};
export default async function Edit({searchParams}:{searchParams:Promise<{erro?:string;proposta?:string}>}){
 const query=await searchParams;
 const user=await currentAdmin();
 if(!user){const {erro}=query;return <PasswordGate configured={!!await editorAccess()} error={erro?loginErrors[erro]||loginErrors.indisponivel:undefined}/>;}
 redirect(query.proposta?'/painel?proposta='+encodeURIComponent(query.proposta):'/painel');
}
