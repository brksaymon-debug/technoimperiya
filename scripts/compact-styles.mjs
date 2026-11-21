import{readFileSync,existsSync}from'node:fs';import{resolve,dirname}from'node:path';
// Conservative, source-aware stylesheet compaction. Retains dynamic class prefixes,
// functional pseudo-selectors and all unknown tag/attribute-only selectors.
export function compactStyles(root=process.cwd()){
 const seen=new Set(),words=new Set(),prefixes=new Set();
 function visit(file){if(seen.has(file)||!existsSync(file))return;seen.add(file);const text=readFileSync(file,'utf8');for(const match of text.matchAll(/(['"`])([\s\S]*?)\1/g)){for(const token of match[2].match(/[a-zA-Z_][\w-]*/g)||[]){words.add(token);if(token.endsWith('-'))prefixes.add(token)}}for(const match of text.matchAll(/(?:from\s*|import\s*\(?\s*)['"](\.[^'"]+)['"]/g)){const base=resolve(dirname(file),match[1]);for(const ext of['','.tsx','.ts'])if(existsSync(base+ext)&&/\.[tj]sx?$/.test(base+ext)){visit(base+ext);break}}}
 visit(resolve(root,'src/main.tsx'));visit(resolve(root,'index.html'));
 function possible(selector){let clean='',depth=0,bracket=0,escape=false;for(const c of selector){if(escape){escape=false;if(!depth&&!bracket)clean+=c;continue}if(c==='\\'){escape=true;continue}if(c==='('){depth++;continue}if(c===')'){depth--;continue}if(c==='['){bracket++;continue}if(c===']'){bracket--;continue}if(!depth&&!bracket)clean+=c}const classes=[...clean.matchAll(/\.([a-zA-Z_][\w-]*)/g)].map(m=>m[1]);return classes.every(c=>words.has(c)||[...prefixes].some(p=>c.startsWith(p)))}
 return{postcssPlugin:'technoimperiya-conservative-compact',OnceExit(ast){const before=ast.toString().length;let removedRules=0,removedDeclarations=0;ast.walkRules(rule=>{if(!rule.selectors)return;const keep=rule.selectors.filter(possible);if(!keep.length){rule.remove();removedRules++}else rule.selectors=keep});
 // A property repeated later under the identical selector/at-rule context always
 // supersedes its earlier declaration (importance tracked). Never reorder rules.
 const later=new Map();const rules=[];ast.walkRules(r=>rules.push(r));for(const rule of rules.reverse()){let context='',parent=rule.parent;while(parent&&parent.type!=='root'){context=parent.type==='atrule'?'@'+parent.name+' '+parent.params+'|'+context:context;parent=parent.parent}const key=context+'>'+rule.selector;const props=later.get(key)||new Set();for(const decl of [...rule.nodes].reverse()){if(decl.type!=='decl')continue;const p=decl.prop+'|'+Boolean(decl.important);if(props.has(p)){decl.remove();removedDeclarations++}else props.add(p)}later.set(key,props);if(!rule.nodes.length)rule.remove()}
 ast.walkAtRules(a=>{if(a.nodes&&!a.nodes.length)a.remove()});const after=ast.toString().length;if(before>20000)console.log('[CSS compact]',before,'→',after,'chars; rules',removedRules,'declarations',removedDeclarations);}};
}
compactStyles.postcss=true;
