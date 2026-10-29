import ProposalView from '@/components/ProposalView';
import ProposalEffects from '@/components/ProposalEffects';
import {defaultAgency,exampleProposal} from '@/lib/types';
export default function Home(){return <><ProposalView data={exampleProposal()} agency={defaultAgency} brands={[]} model/><ProposalEffects/></>}
