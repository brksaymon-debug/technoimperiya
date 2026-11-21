export type Product = {
  id: string; name: string; brand: string; category: string; price: number;
  diagonal: number; condition: 'Новый' | 'Уценка' | 'Витринный образец' | 'Распродажа';
  reason: string; description: string; color: 'mountain' | 'red';
  stock?: number; photos?: string[]; image?: string; features?: string[]; specs?: Record<string,string>;
};
/** Production inventory. Populate only verified offers. See docs/CATALOG.md. */
export const liveProducts: Product[] = [];
/** Fictional examples, never mixed into live inventory. */
export const demoProducts: Product[] = [
  {id:'demo-01',name:'Телевизор Samsung Crystal 55″',brand:'Samsung',category:'tv',price:39990,diagonal:55,condition:'Уценка',reason:'Пример: повреждение упаковки. Характеристики и цена вымышлены.',description:'Демонстрационная карточка 4K Smart TV для проверки интерфейса. Не является предложением о продаже.',color:'mountain'},
  {id:'demo-02',name:'Телевизор LG Cinema 65″',brand:'LG',category:'tv',price:64990,diagonal:65,condition:'Витринный образец',reason:'Пример: витринный образец. Состояние не проверялось.',description:'Демонстрационная карточка большого экрана 4K. Название, цена и параметры приведены только для тестирования.',color:'red'},
  {id:'demo-03',name:'Телевизор Hisense Vision 50″',brand:'Hisense',category:'tv',price:29990,diagonal:50,condition:'Распродажа',reason:'Пример: модель прошлой коллекции. Это не действующая акция.',description:'Пример товара для тестирования сортировки и фильтров. Приобрести этот товар нельзя.',color:'mountain'},
  {id:'demo-04',name:'Телевизор TCL Smart 43″',brand:'TCL',category:'tv',price:21990,diagonal:43,condition:'Уценка',reason:'Пример: косметическая отметка на корпусе. Не реальный дефект.',description:'Тестовый компактный Smart TV. Точные характеристики настоящего товара будут заполнены позже.',color:'red'},
  {id:'demo-05',name:'Телевизор Xiaomi View 55″',brand:'Xiaomi',category:'tv',price:34990,diagonal:55,condition:'Витринный образец',reason:'Пример: открытая упаковка. Не реальное предложение.',description:'Тестовая карточка для избранного, корзины и оформления. Товар не продаётся.',color:'mountain'},
  {id:'demo-06',name:'Телевизор Haier Screen 65″',brand:'Haier',category:'tv',price:54990,diagonal:65,condition:'Распродажа',reason:'Пример: прошлый модельный год. Не действующая акция.',description:'Пример большого 4K-экрана для проверки покупательского сценария. Не является офертой.',color:'red'},
];
export const brands = ['Samsung','LG','Hisense','TCL','Xiaomi','Haier'];
export const categories = [{id:'all',name:'Вся техника'}, {id:'tv',name:'Телевизоры'}, {id:'audio',name:'Аудиотехника'}, {id:'home',name:'Техника для дома'}, {id:'accessories',name:'Аксессуары'}];
export const money = (value: number) => new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
export function filterProducts(products: Product[], query: {q?:string;brand?:string;category?:string;condition?:string;max?:number;sort?:string}) {
 const list=products.filter(p => (!query.q || `${p.name} ${p.brand}`.toLowerCase().includes(query.q.toLowerCase().trim())) && (!query.brand || p.brand===query.brand) && (!query.category || query.category==='all'|| p.category===query.category) && (!query.condition || p.condition===query.condition) && (!query.max || p.price<=query.max));
 return list.sort((a,b)=>query.sort==='price-up'?a.price-b.price:query.sort==='price-down'?b.price-a.price:query.sort==='diagonal'?b.diagonal-a.diagonal:a.id.localeCompare(b.id));
}

export function productFeatures(p:Product,demo=false){return p.features??(demo?['4K Ultra HD','Smart TV',p.diagonal+'″']:(p.diagonal?[p.diagonal+'″']:[]));}
