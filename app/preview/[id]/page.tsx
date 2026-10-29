import {redirect,notFound} from 'next/navigation';
import {currentAdmin,ownedProposal,getBootstrap,HttpError} from '@/lib/server';
import ProposalView from '@/components/ProposalView';
import ProposalEffects from '@/components/ProposalEffects';
export const dynamic='force-dynamic';
export default async function Preview({params}:{params:Promise<{id:string}>}){
 const user=await currentAdmin();if(!user)redirect('/editar');
 const {id}=await params;
 try{const [p,b]=await Promise.all([ownedProposal(id,user.userId),getBootstrap(user.userId)]);return <><div className="preview-notice">PRÉVIA DA PROPOSTA <a href="/painel">Voltar à edição ↗</a></div><ProposalView data={p.data} agency={b.agency} brands={b.brands}/><ProposalEffects/></>;}catch(e){if(e instanceof HttpError&&e.status===404)notFound();throw e;}
}
