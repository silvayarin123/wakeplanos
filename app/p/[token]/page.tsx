import {notFound} from 'next/navigation';
import {publicProposal} from '@/lib/server';
import {selectedServices} from '@/lib/types';
import ProposalView from '@/components/ProposalView';
import ProposalEffects from '@/components/ProposalEffects';
export const dynamic='force-dynamic';
export default async function PublicProposal({params}:{params:Promise<{token:string}>}){const {token}=await params;const page=await publicProposal(token);if(!page)notFound();return <><ProposalView data={{...page.proposal.data,services:selectedServices(page.proposal.data)}} agency={page.agency} brands={page.brands}/><ProposalEffects/></>}
