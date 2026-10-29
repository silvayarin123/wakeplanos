import {ArrowUpRight,Plus,Pencil,LockKeyhole,Check,ChevronDown} from 'lucide-react';
import {type Agency,type Brand,type ProposalData,brl,assetUrl,serviceTotal,selectedServices} from '@/lib/types';
import WakeLogo from './WakeLogo';
import {referenceBrands} from '@/lib/reference-brands';
import BrandRibbon from './BrandRibbon';

export type EditSection='cliente'|'entregas'|'investimento'|'marcas'|'contato';
export function contactHref(agency:Agency,data:ProposalData){let phone=agency.phone.replace(/\D/g,'');if(phone){if(phone.length<=11)phone='55'+phone;return 'https://wa.me/'+phone+'?text='+encodeURIComponent('Olá! Gostaria de conversar sobre a proposta '+data.title+' para '+data.clientName+'.');}if(agency.email)return 'mailto:'+agency.email+'?subject='+encodeURIComponent('Proposta '+data.title);return '';}

export default function ProposalView({data,agency,brands,model=false,compact=false,onEdit,onClientNameChange}:{data:ProposalData;agency:Agency;brands:Brand[];model?:boolean;compact?:boolean;onEdit?:(section:EditSection)=>void;onClientNameChange?:(value:string)=>void}){
 const plans=selectedServices(data),total=data.automaticTotal?serviceTotal(data):data.price;
 const contact=contactHref(agency,data),selected=[...referenceBrands,...brands.filter(b=>data.brandIds.includes(b.id))],client=data.clientName||'Sua marca';
 const valid=data.validUntil&&Number.isFinite(Date.parse(data.validUntil))?new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date(data.validUntil+'T12:00:00')):'';
 const edit=(section:EditSection,label:string)=>onEdit?<button className="section-edit" onClick={()=>onEdit(section)}><Pencil size={13}/>{label}</button>:null;
 return <article className={'wake-proposal wake-short wake-minimal-tech'+(compact?' is-compact':'')}>
  <header className="short-nav"><a href="#inicio" aria-label="WAKE · Início"><WakeLogo/></a><span>PROPOSTA COMERCIAL <i/></span></header>
  <BrandRibbon brands={selected} onEdit={onEdit?()=>onEdit('marcas'):undefined}/>
  <main className="short-content" id="inicio">
   <section className="short-intro editable-section">
    <div><span className="short-eyebrow">PREPARADA PARA</span><div className="short-client">{data.clientLogo&&<div className={'short-client-logo'+(data.clientLogoDark?' dark':'')}><img src={assetUrl(data.clientLogo)} alt={'Logo '+client}/></div>}{onClientNameChange?<input className="short-client-name" aria-label="Nome do cliente na proposta" placeholder="Digite o nome do cliente" value={data.clientName} maxLength={180} onChange={e=>onClientNameChange(e.target.value)}/>:<p>{client}</p>}</div></div>
    <div className="short-intro-meta"><span>{data.title||'Proposta comercial'}</span>{edit('cliente','Dados do cliente')}</div>
   </section>
   <section className="short-plans editable-section" id="entregas" aria-labelledby="plans-title">
    <div className="short-section-heading"><h1 id="plans-title">ESCOPO DA PARCERIA<span>.</span></h1>{edit('entregas','Editar escopo')}</div>
    <div className="short-plan-grid" data-count={plans.length}>{plans.map((s,i)=><section className={'short-plan neon-frame tech-reveal'+(plans.length===1||i===1?' short-plan-featured':'')} key={i}>
     <div className="short-plan-body"><div className="short-plan-summary"><header><span>TÍTULO DA PROPOSTA</span><span className="short-plan-check"><Check size={13}/></span></header><h2>{s.title}</h2></div>
     {s.description&&<div className="short-plan-deliverables"><span>ENTREGÁVEIS</span><ul>{s.description.split('\n').filter(Boolean).map((line,n)=><li key={n}><Check size={13}/><span>{line}</span></li>)}</ul></div>}</div>
    </section>)}</div>
    {!plans.length&&onEdit&&<button className="short-empty" onClick={()=>onEdit('entregas')}><Plus size={18}/>Selecionar os planos desta proposta</button>}
   </section>
   <section className="short-total editable-section neon-frame tech-reveal" id="investimento" aria-label="Investimento da proposta">
    <div className="short-total-main"><div><span className="short-eyebrow">Investimento</span><p><strong>{total===null?'Sob consulta':brl(total)}</strong></p></div><div className="short-total-actions">{contact?<a className="short-cta neon-frame tech-cta" href={contact} target="_blank" rel="noopener noreferrer">Vamos conversar <ArrowUpRight size={17}/></a>:null}{edit('investimento','Editar valores')}</div></div>
    <div className="short-total-foot">{data.illustrative&&<span className="short-simulation"><i/>Valores ilustrativos</span>}{valid&&<span>Válida até {valid}</span>}{total!==null&&plans.some(s=>s.price!==undefined&&s.price!==null)&&total!==serviceTotal(data)&&<span>Ajuste no pacote: {total>serviceTotal(data)?'+':'−'} {brl(Math.abs(total-serviceTotal(data)))}</span>}</div>
    {(data.payment||data.notes)&&<details className="short-conditions" open={!!onEdit}><summary>Condições da proposta <ChevronDown size={14}/></summary>{data.payment&&<p>{data.payment}</p>}{data.notes&&<p>{data.notes}</p>}</details>}
   </section>
  </main>
  <footer className="short-footer"><WakeLogo/><span>{agency.location||'WAKE'}{!onEdit&&<a className="footer-edit-lock" href="/editar" aria-label="Acessar painel de edição" title="Acessar edição"><LockKeyhole size={15}/></a>}{onEdit&&<button className="section-edit" onClick={()=>onEdit('contato')}><Pencil size={12}/>Contato</button>}</span></footer>
 </article>;
}
