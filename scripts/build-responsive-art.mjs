import sharp from 'sharp';
const p='public/art/';
await sharp(p+'brand-header-transparent.png').resize({width:535,withoutEnlargement:true}).png({compressionLevel:9,adaptiveFiltering:true}).toFile(p+'brand-header-transparent-small.png');
for(const width of[416,692])await sharp(p+'ded-moroz-new-transparent.png').resize({width,withoutEnlargement:true}).webp({quality:92,alphaQuality:100,effort:6}).toFile(p+`ded-moroz-mobile-${width}.webp`);
// Mirrors existing mobile object-position:0% center; no change in original visible composition.
await sharp(p+'holiday-environment.webp').extract({left:0,top:0,width:416,height:576}).webp({quality:86,effort:6}).toFile(p+'holiday-environment-mobile.webp');
