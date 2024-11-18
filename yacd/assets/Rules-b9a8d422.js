import{a8 as p,F as w,a9 as b,aa as k,ab as v,n as B,o as g,j as i,H as A,B as F,d as _,u as T,C as $,k as S}from"./index-2027f720.js";import{V as z,a as D}from"./index.esm-8fa0a61e.js";import{u as x}from"./useMutation-96b0c8b2.js";import{R,T as E}from"./TextFilter-0602bb54.js";import{f as L}from"./index-552e431d.js";import{F as Q,p as U}from"./Fab-f13637fc.js";import{u as q}from"./useRemainingViewPortHeight-cadcc6b7.js";import"./debounce-c1ba2006.js";function H(e){const t=e.providers,s=Object.keys(t),r={};for(let n=0;n<s.length;n++){const a=s[n];r[a]={...t[a],idx:n}}return{byName:r,names:s}}async function M(e){const t=await p(e)||{providers:{}};return H(t)}async function y({name:e,apiConfig:t}){const{url:s,init:r}=w(t);try{return(await fetch(s+`/providers/rules/${e}`,{method:"PUT",...r})).ok}catch(n){return console.log("failed to PUT /providers/rules/:name",n),!1}}async function V({names:e,apiConfig:t}){for(let s=0;s<e.length;s++)await y({name:e[s],apiConfig:t})}var W=function(e,t,s,r,n,a,o,u){if(!e){var l;if(t===void 0)l=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var d=[s,r,n,a,o,u],C=0;l=new Error(t.replace(/%s/g,function(){return d[C++]})),l.name="Invariant Violation"}throw l.framesToPop=1,l}},O=W;const J=b(O);function K(e){return J(e.rules&&e.rules.length>=0,"there is no valid rules list in the rules API response"),e.rules.map((t,s)=>({...t,id:s}))}async function G(e){const t=await p(e)||{rules:[]};return K(t)}const j=k("");function X(e,t){const s=g(),{mutate:r,isLoading:n}=x(y,{onSuccess:()=>{s.invalidateQueries(["/providers/rules"])}});return[o=>{o.preventDefault(),r({name:e,apiConfig:t})},n]}function Y(e){const t=g(),{data:s}=P(e),{mutate:r,isLoading:n}=x(V,{onSuccess:()=>{t.invalidateQueries(["/providers/rules"])}});return[o=>{o.preventDefault(),r({names:s.names,apiConfig:e})},n]}function P(e){return v(["/providers/rules",e],M)}function Z(e){const{data:t,isFetching:s}=v(["/rules",e],G),{data:r}=P(e),[n]=B(j);if(n==="")return{rules:t,provider:r,isFetching:s};{const a=n.toLowerCase();return{rules:t.filter(o=>o.payload.toLowerCase().indexOf(a)>=0),isFetching:s,provider:{byName:r.byName,names:r.names.filter(o=>o.toLowerCase().indexOf(a)>=0)}}}}const ee="_RuleProviderItem_12aid_1",te="_left_12aid_7",se="_middle_12aid_14",ne="_gray_12aid_21",re="_action_12aid_25",ie="_refreshBtn_12aid_32",c={RuleProviderItem:ee,left:te,middle:se,gray:ne,action:re,refreshBtn:ie};function ae({idx:e,name:t,vehicleType:s,behavior:r,updatedAt:n,ruleCount:a,apiConfig:o}){const[u,l]=X(t,o),d=L(new Date(n),new Date);return i.jsxs("div",{className:c.RuleProviderItem,children:[i.jsx("span",{className:c.left,children:e}),i.jsxs("div",{className:c.middle,children:[i.jsx(A,{name:t,type:`${s} / ${r}`}),i.jsx("div",{className:c.gray,children:a<2?`${a} rule`:`${a} rules`}),i.jsxs("div",{className:c.action,children:[i.jsxs(F,{onClick:u,disabled:l,className:c.refreshBtn,children:[i.jsx(R,{isRotating:l,size:13}),i.jsx("span",{className:"visually-hidden",children:"Refresh"})]}),i.jsxs("small",{className:c.gray,children:["Updated ",d," ago"]})]})]})]})}function oe({apiConfig:e}){const[t,s]=Y(e),{t:r}=_();return i.jsx(Q,{icon:i.jsx(R,{isRotating:s}),text:r("update_all_rule_provider"),style:U,onClick:t})}const le="_rule_1kxgd_1",ce="_left_1kxgd_12",ue="_a_1kxgd_19",de="_b_1kxgd_26",me="_type_1kxgd_37",m={rule:le,left:ce,a:ue,b:de,type:me},f={_default:"#59caf9",DIRECT:"#f5bc41",REJECT:"#cb3166"};function fe({proxy:e}){let t=f._default;return f[e]&&(t=f[e]),{color:t}}function he({type:e,payload:t,proxy:s,id:r}){const n=fe({proxy:s});return i.jsxs("div",{className:m.rule,children:[i.jsx("div",{className:m.left,children:r}),i.jsxs("div",{children:[i.jsx("div",{className:m.b,children:t}),i.jsxs("div",{className:m.a,children:[i.jsx("div",{className:m.type,children:e}),i.jsx("div",{style:n,children:s})]})]})]})}const pe="_header_n1m95_1",ve="_RuleProviderItemWrapper_n1m95_17",N={header:pe,RuleProviderItemWrapper:ve},{memo:ge}=S,h=30;function _e(e,{rules:t,provider:s}){const r=s.names.length;return e<r?s.names[e]:t[e-r].id}function xe({provider:e}){return function(s){const r=e.names.length;return s<r?110:80}}const I=ge(({index:e,style:t,data:s})=>{const{rules:r,provider:n,apiConfig:a}=s,o=n.names.length;if(e<o){const l=n.names[e],d=n.byName[l];return i.jsx("div",{style:t,className:N.RuleProviderItemWrapper,children:i.jsx(ae,{apiConfig:a,...d})})}const u=r[e-o];return i.jsx("div",{style:t,children:i.jsx(he,{...u})})},D);I.displayName="MemoRow";function be(){const e=T(),[t,s]=q(),{rules:r,provider:n}=Z(e),a=xe({provider:n}),{t:o}=_();return i.jsxs("div",{children:[i.jsxs("div",{className:N.header,children:[i.jsx($,{title:o("Rules")}),i.jsx(E,{placeholder:"Filter",textAtom:j})]}),i.jsx("div",{ref:t,style:{paddingBottom:h},children:i.jsx(z,{height:s-h,width:"100%",itemCount:r.length+n.names.length,itemSize:a,itemData:{rules:r,provider:n,apiConfig:e},itemKey:_e,children:I})}),n&&n.names&&n.names.length>0?i.jsx(oe,{apiConfig:e}):null]})}export{be as default};
