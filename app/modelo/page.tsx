import ProposalView from '@/components/ProposalView';
import ProposalEffects from '@/components/ProposalEffects';
import {exampleProposal,defaultAgency} from '@/lib/types';
export default function Modelo(){return <><ProposalView data={exampleProposal()} agency={defaultAgency} brands={[]} model/><ProposalEffects/></>}
