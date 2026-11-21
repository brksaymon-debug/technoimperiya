import{Link}from'react-router-dom';
import{Icon}from'./ui';
export function NotFound(){return <div className="page-padding not-found-page"><span className="not-found-number" aria-hidden="true">404</span><h1>Страница не найдена</h1><p>Вернитесь на главную или выберите телевизор в каталоге.</p><div className="detail-actions"><Link className="button primary" to="/">На главную <Icon name="arrow"/></Link><Link className="button secondary" to="/catalog">В каталог</Link></div></div>}
