import { ViewTransition } from 'react';
import { Link } from 'react-router-dom';
import { productFeatures, type Product } from './catalog';
import { Icon } from './ui';
/** Deliberately split out of the initial home bundle; loaded only when inspecting a model. */
export default function FocusDetails({product:p,demo}:{product:Product;demo:boolean}){
 const specs=p.specs??{'Бренд':p.brand,'Диагональ':p.diagonal?p.diagonal+'″':'Не указана','Особенности':productFeatures(p,demo).join(' · ')||'Не указаны','Состояние':p.condition};
 return <ViewTransition enter="panel-in" default="none"><div className="focus-detail-body"><span className="focus-detail-label">{demo?'ДЕМО · НЕ ПРОДАЁТСЯ':'ОБ ЭКЗЕМПЛЯРЕ'}</span><p className="focus-detail-reason">{p.reason}</p><dl>{Object.entries(specs).map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p className="focus-detail-description">{p.description}</p><Link to={'/product/'+p.id} className="text-link">Полная карточка <Icon name="arrow" size={18}/></Link></div></ViewTransition>
}
