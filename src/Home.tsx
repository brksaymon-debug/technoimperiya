import { Link } from 'react-router-dom';
import { HolidayHero } from './HolidayHero';
import { HolidayCollections } from './HolidayCollections';
import { ShoppingWorld } from './ScrollScene';
import { Catalog } from './Catalog';
import { StoreFaq } from './StoreFaq';
import { brands } from './catalog';
export function Home(){return <div className="holiday-storefront"><HolidayHero/><ShoppingWorld><HolidayCollections/><nav className="holiday-brand-channel" aria-label="Телевизоры по бренду"><div>{brands.map(brand=><Link data-tv-focus key={brand} to={'/catalog?brand='+brand}>{brand==='Samsung'?'SAMSUNG':brand}</Link>)}</div></nav><section id="televisions" className="holiday-catalog-plane" aria-label="Каталог телевизоров"><Catalog embedded/></section><StoreFaq/></ShoppingWorld></div>}
