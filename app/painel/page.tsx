import {redirect} from 'next/navigation';
import {currentAdmin,getBootstrap} from '@/lib/server';
import ProposalEditor from '@/components/ProposalEditor';
export const dynamic='force-dynamic';
export default async function Painel({searchParams}:{searchParams:Promise<{proposta?:string}>}){
 const query=await searchParams;
 const user=await currentAdmin();
 if(!user)redirect('/editar');
 return <ProposalEditor initial={await getBootstrap(user.userId)} initialProposalId={query.proposta}/>;
}
