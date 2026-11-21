from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import numpy as np
from scipy import ndimage as ndi
import hashlib, json
root=Path(__file__).resolve().parents[1]
original=root/'original-art/header-original.jpg'
im=Image.open(original).convert('RGB').transpose(Image.Transpose.ROTATE_90)
rgb=np.asarray(im).astype(np.float64);mx=rgb.max(2);chroma=mx-rgb.min(2)
# Only near-black EXTERIOR connected to the canvas boundary is removable.
eligible=(mx<=32)&(chroma<=20)
seed=np.zeros(eligible.shape,bool);seed[0]=eligible[0];seed[-1]=eligible[-1];seed[:,0]=eligible[:,0];seed[:,-1]=eligible[:,-1]
exterior=ndi.binary_propagation(seed,mask=eligible,structure=np.ones((3,3)))
foreground=~exterior
labels,count=ndi.label(foreground)
for label in range(1,count+1):
 region=labels==label
 if int(region.sum())<=12 and float(mx[region].max())<80:
  foreground[region]=False
exterior=~foreground
distance=ndi.distance_transform_edt(foreground)
interior=distance>2.1
_,nearest=ndi.distance_transform_edt(~interior,return_indices=True)
reference=rgb[nearest[0],nearest[1]]
a=np.ones(mx.shape,float);a[exterior]=0
boundary=foreground&(distance<=1.5)
projection=np.sum(rgb*reference,2)/np.maximum(np.sum(reference*reference,2),1)
# Decontaminate only the one-pixel anti-aliased boundary, never internal shading.
a[boundary]=np.clip(projection[boundary],.08,1)
a[boundary&(mx>100)]=1
rgba=np.dstack((rgb,np.round(a*255)))
partial=(a>0)&(a<1)
rgba[partial,:3]=np.minimum(255,rgb[partial]/a[partial,None])
rgba[exterior,:3]=0
rgba=np.round(rgba).clip(0,255).astype(np.uint8)
out=root/'public/art/brand-header-transparent.png'
Image.fromarray(rgba).save(out,optimize=True)
Image.fromarray(rgba).resize((1069,368),Image.Resampling.LANCZOS).save(root/'public/art/brand-header-transparent-half.png',optimize=True)
opaque=rgba[:,:,3]==255
assert np.array_equal(rgba[:,:,:3][opaque],np.asarray(im)[opaque])
# Composition proof: light, dark and checkerboard, plus native edge crop.
proof=Image.new('RGB',(1200,1320),'#31343a');draw=ImageDraw.Draw(proof)
small=Image.fromarray(rgba).resize((1100,379),Image.Resampling.LANCZOS)
for index,color in enumerate(['#f3f1ec','#11151a',None]):
 y=32+index*430
 base=Image.new('RGBA',(1100,379),color or '#c3c6ca')
 if color is None:
  d=ImageDraw.Draw(base)
  for yy in range(0,379,20):
   for xx in range(0,1100,20):
    if (xx//20+yy//20)%2:d.rectangle((xx,yy,xx+19,yy+19),fill='#f4f5f6')
 base.alpha_composite(small);proof.paste(base.convert('RGB'),(50,y+20));draw.text((50,y),['LIGHT','DARK','CHECKERBOARD'][index],fill='white')
proof.save(root/'qc/brand-header-alpha-proof.png')
edge=Image.fromarray(rgba).crop((20,210,620,470));edgeproof=Image.new('RGB',(1200,280),'white');edgeproof.paste(edge, (0,10),edge);dark=Image.new('RGBA',edge.size,'#11151a');dark.alpha_composite(edge);edgeproof.paste(dark.convert('RGB'),(600,10));edgeproof.save(root/'qc/brand-header-alpha-edge-proof.png')
report={'file':str(out),'size':list(im.size),'mode':'RGBA','transparentPixels':int((rgba[:,:,3]==0).sum()),'partialAlphaPixels':int(((rgba[:,:,3]>0)&(rgba[:,:,3]<255)).sum()),'opaquePixels':int(opaque.sum()),'opaqueRGBUnchanged':True,'method':'8-connected exterior near-black flood fill, preserved enclosed shading, local one-pixel edge unmatting','originalSHA256':hashlib.sha256(original.read_bytes()).hexdigest(),'generation':False,'crop':False,'upscale':False}
(root/'qc/brand-header-alpha-report.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
