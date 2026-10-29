import ProposalEditor from '@/components/ProposalEditor';
import {defaultAgency} from '@/lib/types';
export default function Demonstration(){return <ProposalEditor initial={{agency:defaultAgency,brands:[],proposals:[]}} demo/>}
