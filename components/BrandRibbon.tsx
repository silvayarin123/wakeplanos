import {Pencil} from 'lucide-react';
import {type Brand,brandLogoUrl} from '@/lib/types';
export default function BrandRibbon({brands,onEdit}:{brands:Brand[];onEdit?:()=>void}){
 if(!brands.length)return null;
 const items=Array.from({length:Math.ceil(10/brands.length)},()=>brands).flat();
 return <section className="short-brands brand-ribbon-top" aria-label="Empresas que já atendemos"><div className="short-brands-heading"><span>EMPRESAS QUE JÁ ATENDEMOS</span>{onEdit&&<button className="section-edit" onClick={onEdit}><Pencil size={12}/>Editar logos</button>}</div><div className="brand-strip"><div className="brand-track">{[0,1].map(copy=><div className="brand-group" key={copy} aria-hidden={copy===1?true:undefined}>{items.map((b,i)=><div className="brand-item" key={b.id+'-'+i}><div className="brand-ink" role="img" aria-label={copy===0&&i<brands.length?b.name:undefined} style={{maskImage:`url("${brandLogoUrl(b)}")`,WebkitMaskImage:`url("${brandLogoUrl(b)}")`}}><img src={brandLogoUrl(b)} alt="" aria-hidden="true" width={b.width} height={b.height} loading="eager" decoding="async"/></div></div>)}</div>)}</div></div></section>;
}
