"""Matte the newly generated green-screen portrait at native pixels; no resampling/upscale."""
from pathlib import Path
from PIL import Image
import numpy as np
from scipy.ndimage import distance_transform_edt
import json,shutil
root=Path(__file__).resolve().parents[1]
source=root/'original-art/new-ded-moroz-generated-greenscreen.jpg'
a=np.asarray(Image.open(source).convert('RGB'),dtype=np.float32);r,g,b=a[:,:,0],a[:,:,1],a[:,:,2]
foreground=g<=np.maximum(r,b)+8
background=(g-np.maximum(r,b)>155)&(r<70)&(b<70)&(g>180)
_,indices=distance_transform_edt(~foreground,return_indices=True)
f=a[indices[0],indices[1]];key=np.array([0.,255.,0.]);v=f-key
alpha=np.clip(np.sum((a-key)*v,axis=2)/np.maximum(np.sum(v*v,axis=2),1),0,1)
alpha[foreground]=1;alpha[background]=0;alpha[alpha<.012]=0;alpha[alpha>.99]=1
rgb=np.clip((a-key*(1-alpha[:,:,None]))/np.maximum(alpha[:,:,None],.01),0,255)
edge=(alpha>0)&(alpha<.99);rgb[:,:,1][edge]=np.minimum(rgb[:,:,1][edge],np.maximum(rgb[:,:,0],rgb[:,:,2])[edge]+5)
rgb[alpha==0]=0
rgba=np.dstack((rgb,np.rint(alpha*255))).astype(np.uint8)
y,x=np.nonzero(rgba[:,:,3]);bounds=(max(0,int(x.min())-20),max(0,int(y.min())-20),min(a.shape[1],int(x.max())+21),min(a.shape[0],int(y.max())+21))
im=Image.fromarray(rgba).crop(bounds);out=root/'public/art/ded-moroz-new-transparent.png';im.save(out,optimize=True)
proof=Image.new('RGB',(im.width*2,im.height))
for i,color in enumerate(['#111317','#f2f0ea']):
 bg=Image.new('RGBA',im.size,color);bg.alpha_composite(im);proof.paste(bg.convert('RGB'),(i*im.width,0))
proof.save(root/'qc/ded-moroz-alpha-proof.jpg',quality=92)
stats={'file':str(out),'sourceNativeSize':[int(a.shape[1]),int(a.shape[0])],'pngSize':list(im.size),'mode':im.mode,'bytes':out.stat().st_size,'transparentPixels':int((np.asarray(im)[:,:,3]==0).sum()),'partialAlphaPixels':int(((np.asarray(im)[:,:,3]>0)&(np.asarray(im)[:,:,3]<255)).sum()),'opaquePixels':int((np.asarray(im)[:,:,3]==255).sum()),'upscaled':False,'method':'New generated JPEG on green, native-pixel nearest-foreground projection matting with edge despill; tool did not return native alpha'}
(root/'qc/ded-moroz-alpha-report.json').write_text(json.dumps(stats,indent=2));print(json.dumps(stats))
Image.open(root/'original-art/holiday-black-red-clean-plate.jpg').save(root/'public/art/holiday-environment.webp',quality=90,method=6)
