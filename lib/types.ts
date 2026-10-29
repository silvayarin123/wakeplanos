export type Service={title:string;description:string;quantity:string;price?:number|null;selected?:boolean};
export type Stage={title:string;period:string;description:string};
export type ProposalData={clientName:string;contactName:string;clientEmail:string;clientPhone:string;clientLogo:string;clientLogoDark?:boolean;title:string;headline:string;summary:string;objective:string;context:string;services:Service[];stages:Stage[];price:number|null;billing:string;payment:string;validUntil:string;notes:string;brandIds:string[];illustrative?:boolean;automaticTotal?:boolean};
export type Agency={name:string;email:string;phone:string;tagline:string;location:string};
export type Brand={id:string;name:string;assetId:string;dark?:boolean;src?:string;width?:number;height?:number};
export type Proposal={id:string;token:string;data:ProposalData;published:boolean;archived:boolean;opens:number;firstOpenedAt:string|null;lastOpenedAt:string|null;createdAt:string;updatedAt:string};
export type Bootstrap={agency:Agency;brands:Brand[];proposals:Proposal[]};
export const defaultAgency:Agency={name:'WAKE',email:'',phone:'',tagline:'Estratégia que encontra forma.',location:''};
export const blankProposal=():ProposalData=>({clientName:'',contactName:'',clientEmail:'',clientPhone:'',clientLogo:'',title:'',headline:'Uma nova\nperspectiva.',summary:'Estratégia, conteúdo e tecnologia. Uma proposta feita para o próximo momento da sua marca.',objective:'',context:'',services:[{title:'',description:'',quantity:''}],stages:[{title:'Alinhamento',period:'A definir',description:'Objetivos, briefing e direcionamento.'},{title:'Desenvolvimento',period:'A definir',description:'Execução das entregas definidas nesta proposta.'},{title:'Entrega',period:'A definir',description:'Apresentação, ajustes acordados e entrega final.'}],price:null,billing:'Investimento total',payment:'',validUntil:'',notes:'',brandIds:[]});
export const exampleProposal=():ProposalData=>({...blankProposal(),clientName:'Sua marca',title:'Proposta comercial',illustrative:true,automaticTotal:false,services:[{title:'Lançamento Digital',quantity:'',price:null,description:'Vídeos profissionais\nHospedagem das aulas\nConfiguração da plataforma\nFotos das capas'}],price:1200,billing:'Investimento',payment:'Condições de pagamento a definir.',notes:'Personalize o escopo, o investimento e as condições antes de enviar ao cliente.'});
export const selectedServices=(data:ProposalData)=>data.services.filter(s=>s.selected!==false&&s.title.trim());
export const serviceTotal=(data:ProposalData)=>selectedServices(data).reduce((sum,s)=>sum+(s.price??0),0);

export const brl=(v:number|null)=>v===null?'A definir':new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:2}).format(v);

export const assetUrl=(id:string)=>id.startsWith('blob:')?id:'/api/media/'+id;

export const brandLogoUrl=(brand:Brand)=>brand.src||assetUrl(brand.assetId);
