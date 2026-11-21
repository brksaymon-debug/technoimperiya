import { Link } from 'react-router-dom';
import { HolidayHero } from './HolidayHero';
import { HolidayCollections } from './HolidayCollections';
import { ShoppingWorld } from './ScrollScene';
import { Catalog } from './Catalog';
import { StoreFaq } from './StoreFaq';
import { useShop } from './shop';
export function Home(){const shop=useShop();const brands=[...new Set(shop.products.map(p=>p.brand))];return <div className="holiday-storefront"><HolidayHero/><ShoppingWorld><HolidayCollections/>{brands.length>0&&<nav className="holiday-brand-channel" aria-label="Телевизоры по бренду"><div>{brands.map(brand=><Link data-tv-focus key={brand} to={'/catalog?brand='+brand}>{brand==='Samsung'?'SAMSUNG':brand}</Link>)}</div></nav>}<section id="televisions" className="holiday-catalog-plane" aria-label="Каталог телевизоров"><Catalog embedded/></section><StoreFaq/></ShoppingWorld></div>}
