import sharp from 'sharp';
const p='public/art/';
await sharp(p+'brand-header-transparent.png').resize({width:535,withoutEnlargement:true}).png({compressionLevel:9,adaptiveFiltering:true}).toFile(p+'brand-header-transparent-small.png');
for(const width of[416,692])await sharp(p+'ded-moroz-new-transparent.png').resize({width,withoutEnlargement:true}).webp({quality:92,alphaQuality:100,effort:6}).toFile(p+`ded-moroz-mobile-${width}.webp`);
// Mirrors existing mobile object-position:0% center; no change in original visible composition.
await sharp(p+'holiday-environment.webp').extract({left:0,top:0,width:416,height:576}).webp({quality:86,effort:6}).toFile(p+'holiday-environment-mobile.webp');

// 184 CSS px header at Lighthouse/mobile DPR1.75: transparent original artwork, no recolour.
await sharp(p+'brand-header-transparent.png').resize({width:384,withoutEnlargement:true}).png({compressionLevel:9,adaptiveFiltering:true}).toFile(p+'brand-header-transparent-compact.png');
// Pixel-position equivalent of mobile stage background cover at88% on its1.02 aspect ratio.
await sharp(p+'holiday-environment.webp').extract({left:480,top:0,width:734,height:720}).resize({width:416}).webp({quality:88,effort:6}).toFile(p+'holiday-stage-mobile.webp');
// Existing mobile decorative background is850px wide/right-aligned; retain only visible440px.
await sharp(await sharp(p+'catalog-festive-edges.webp').resize({width:850}).toBuffer()).extract({left:410,top:0,width:440,height:983}).webp({quality:88,effort:6}).toFile(p+'catalog-festive-mobile.webp');
