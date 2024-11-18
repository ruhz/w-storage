import{j as t,B as v,k as y,r as w,H as be,c as A,n as m,J as ee,N as te,w as O,K as Ce,T as ge,L as se,O as E,Q as ne,U as we,V as re,W as I,X as oe,Y as K,Z as V,_ as ae,$ as ke,a0 as Pe,d as z,q as Ne,a1 as Se,u as le,a2 as Ae,a3 as Oe,C as ce,a as Te,a4 as $e,a5 as Le,a6 as De,a7 as Fe}from"./index-2027f720.js";import{C as Ie,m as G}from"./Modal.module-0abf3011.js";import{Z as ie,a as Z}from"./ZapAnimated-f4a4487c.js";import{F as Be,p as Re,A as Me,I as Ue}from"./Fab-f13637fc.js";import{R as He,a as qe,T as Ee}from"./TextFilter-0602bb54.js";import{f as Ke}from"./index-552e431d.js";import{T as Y}from"./Toggle-2641cea4.js";import{S as Ve}from"./Select-2954bbb9.js";import"./debounce-c1ba2006.js";const ze="_FlexCenter_1380a_1",Ge={FlexCenter:ze};function Ze({children:e}){return t.jsx("div",{className:Ge.FlexCenter,children:e})}const{useRef:W,useEffect:Ye}=y;function We({onClickPrimaryButton:e,onClickSecondaryButton:s}){const n=W(null),r=W(null);Ye(()=>{n.current.focus()},[]);const o=a=>{a.code==="ArrowRight"?r.current.focus():a.code==="ArrowLeft"&&n.current.focus()};return t.jsxs("div",{onKeyDown:o,children:[t.jsx("h2",{children:"Close Connections?"}),t.jsx("p",{children:"Click [Yes] to close those connections that are still using the old selected proxy in this group"}),t.jsx("div",{style:{height:30}}),t.jsxs(Ze,{children:[t.jsx(v,{onClick:e,ref:n,children:"Yes"}),t.jsx("div",{style:{width:20}}),t.jsx(v,{onClick:s,ref:r,children:"No"})]})]})}const Xe="_header_1y9js_1",Je="_arrow_1y9js_8",Qe="_isOpen_1y9js_13",et="_btn_1y9js_20",tt="_qty_1y9js_25",P={header:Xe,arrow:Je,isOpen:Qe,btn:et,qty:tt};function ue({name:e,type:s,toggle:n,isOpen:r,qty:o}){const a=w.useCallback(l=>{l.preventDefault(),(l.key==="Enter"||l.key===" ")&&n()},[n]);return t.jsxs("div",{className:P.header,onClick:n,style:{cursor:"pointer"},tabIndex:0,onKeyDown:a,role:"button",children:[t.jsx("div",{children:t.jsx(be,{name:e,type:s})}),typeof o=="number"?t.jsx("span",{className:P.qty,children:o}):null,t.jsx(v,{kind:"minimal",onClick:n,className:P.btn,title:"Toggle collapsible section",children:t.jsx("span",{className:A(P.arrow,{[P.isOpen]:r}),children:t.jsx(Ie,{size:20})})})]})}const{useMemo:st}=y;function nt(e,s){return e.filter(n=>{const r=s[n];return r===void 0?!0:!("number"in r&&r.number===0)})}const L=(e,s)=>{if(e&&"number"in e&&e.number>0)return e.number;const n=s&&s.type;return n&&te.indexOf(n)>-1?-1:999999},rt={Natural:e=>e,LatencyAsc:(e,s,n)=>e.sort((r,o)=>{const a=L(s[r],n&&n[r]),l=L(s[o],n&&n[o]);return a-l}),LatencyDesc:(e,s,n)=>e.sort((r,o)=>{const a=L(s[r],n&&n[r]);return L(s[o],n&&n[o])-a}),NameAsc:e=>e.sort(),NameDesc:e=>e.sort((s,n)=>s>n?-1:s<n?1:0)};function ot(e,s){const n=s.toLowerCase().split(" ").map(r=>r.trim()).filter(r=>!!r);return n.length===0?e:e.filter(r=>{let o=0;for(;o<n.length;o++){const a=n[o];if(r.toLowerCase().indexOf(a)>-1)return!0}return!1})}function at(e,s,n,r,o,a){let l=[...e];return n&&(l=nt(e,s)),typeof r=="string"&&r!==""&&(l=ot(l,r)),rt[o](l,s,a)}function de(e,s,n,r,o){const[a]=m(ee);return st(()=>at(e,s,n,a,r,o),[e,s,n,a,r,o])}const lt="_header_5pmv2_1",ct="_groupHead_5pmv2_5",it="_action_5pmv2_11",M={header:lt,groupHead:ct,action:it},ut="_proxy_5mgcm_1",dt="_now_5mgcm_25",xt="_error_5mgcm_29",pt="_selectable_5mgcm_32",mt="_proxyType_5mgcm_40",ht="_row_5mgcm_51",yt="_proxyName_5mgcm_57",ft="_proxySmall_5mgcm_66",f={proxy:ut,now:dt,error:xt,selectable:pt,proxyType:mt,row:ht,proxyName:yt,proxySmall:ft},_t="_proxyLatency_pw0sa_1",jt={proxyLatency:_t};function vt({latency:e,color:s}){let n=" ";if(e)switch(e.kind){case"Error":case"Testing":n="- ms";break;case"Result":n=(e.number!==0?Math.round(e.number/6):"-")+" ms";break}return t.jsx("span",{className:jt.proxyLatency,style:{color:s},children:n})}const{useMemo:S}=y,g={good:"#67c23a",normal:"#d4b75c",bad:"#e67f3c",na:"#909399"};function xe(e){if(!e||e.kind!=="Result")return g.na;const s=e.number;return s===0?g.na:s<1200?g.good:s<2400?g.normal:typeof s=="number"?g.bad:g.na}function bt(e,s){return te.indexOf(s)>-1?{border:"1px dotted #777"}:{background:xe(e)}}function Ct({now:e,name:s,proxy:n,latency:r,isSelectable:o,onClick:a}){const l=S(()=>bt(r,n.type),[r,n]),c=S(()=>{let d=s;return r&&r.kind==="Result"&&typeof r.number=="number"&&(d+=" "+r.number+" ms"),d},[s,r]),i=w.useCallback(()=>{o&&a&&a(s)},[s,a,o]),u=S(()=>A(f.proxySmall,{[f.now]:e,[f.selectable]:o}),[o,e]),p=w.useCallback(d=>{d.key==="Enter"&&i()},[i]);return t.jsx("div",{title:c,className:u,style:l,onClick:i,onKeyDown:p,role:o?"menuitem":""})}function gt(e){return e==="Shadowsocks"?"SS":e}const wt=e=>({left:e.left+window.scrollX-5,top:e.top+window.scrollY-38});function kt({children:e,label:s,"aria-label":n}){const[r,o]=Ce();return t.jsxs(t.Fragment,{children:[w.cloneElement(e,r),t.jsx(ge,{...o,label:s,"aria-label":n,position:wt})]})}function Pt({now:e,name:s,proxy:n,latency:r,isSelectable:o,onClick:a}){const l=S(()=>xe(r),[r]),c=w.useCallback(()=>{o&&a&&a(s)},[s,a,o]),i=w.useCallback(p=>{p.key==="Enter"&&c()},[c]),u=S(()=>A(f.proxy,{[f.now]:e,[f.selectable]:o}),[o,e]);return t.jsxs("div",{tabIndex:0,className:u,onClick:c,onKeyDown:i,role:o?"menuitem":"",children:[t.jsx("div",{className:f.proxyName,children:t.jsx(kt,{label:s,"aria-label":"proxy name: "+s,children:t.jsx("span",{children:s})})}),t.jsxs("div",{className:f.row,children:[t.jsx("span",{className:f.proxyType,style:{opacity:e?.6:.2},children:gt(n.type)}),t.jsx(vt,{latency:r,color:l})]})]})}const pe=(e,{name:s})=>{const n=se(e),r=E(e);return{proxy:n[s]||{name:s,type:"Unknown",history:[]},latency:r[s]}},Nt=O(pe)(Pt),St=O(pe)(Ct),At="_list_1oy7w_1",Ot="_listSummaryView_1oy7w_8",me={list:At,listSummaryView:Ot};function he({all:e,now:s,isSelectable:n,itemOnTapCallback:r}){const o=e;return t.jsx("div",{className:me.list,children:o.map(a=>t.jsx(Nt,{onClick:r,isSelectable:n,name:a,now:a===s},a))})}function ye({all:e,now:s,isSelectable:n,itemOnTapCallback:r}){return t.jsx("div",{className:me.listSummaryView,children:e.map(o=>t.jsx(St,{onClick:r,isSelectable:n,name:o,now:o===s},o))})}const{createElement:Tt,useCallback:D,useMemo:$t}=y;function Lt({name:e,all:s,delay:n,proxies:r,type:o,now:a,apiConfig:l,dispatch:c}){const[i,u]=m(oe),p=i[`proxyGroup:${e}`],[d]=m(K),[_]=m(V),x=de(s,n,_,d,r),h=$t(()=>o==="Selector",[o]),{proxies:{requestDelayForProxies:T}}=ne(),k=D((C,_e,je)=>{u(ve=>({...ve,[`${C}:${_e}`]:je}))},[u]),B=D(()=>{k("proxyGroup",e,!p)},[p,k,e]),[$]=m(ae),b=D(C=>{h&&c(we(l,e,C,$))},[l,c,e,h,$]),j=re(!1),R=D(async()=>{if(!j.value){j.set(!0);try{await T(l,x)}catch{}j.set(!1)}},[x,l,T,j]);return t.jsxs("div",{className:M.group,children:[t.jsxs("div",{className:M.groupHead,children:[t.jsx(ue,{name:e,type:o,toggle:B,qty:x.length,isOpen:p}),t.jsx("div",{className:M.action,children:t.jsx(I,{label:"Test latency",children:t.jsx(v,{kind:"circular",onClick:R,children:t.jsx(ie,{animate:j.value,size:16})})})})]}),Tt(p?he:ye,{all:x,now:a,isSelectable:h,itemOnTapCallback:b})]})}const Dt=O((e,{name:s,delay:n})=>{const r=se(e),o=r[s],{all:a,type:l,now:c}=o;return{all:a,delay:n,proxies:r,type:l,now:c}})(Lt),{useCallback:fe,useState:Ft}=y;function It({dispatch:e,apiConfig:s,name:n}){return fe(()=>e(ke(s,n)),[s,e,n])}function Bt({dispatch:e,apiConfig:s,names:n}){const[r,o]=Ft(!1);return[fe(async()=>{if(!r){o(!0);try{await e(Pe(s,n))}catch{}o(!1)}},[s,e,n,r]),r]}const{useState:Rt,useCallback:Mt}=y;function Ut({isLoading:e}){return e?t.jsx(Ue,{children:t.jsx(Z,{width:16,height:16})}):t.jsx(Z,{width:16,height:16})}function Ht({dispatch:e,apiConfig:s}){const[n,r]=Rt(!1),[o]=m(Ne);return[Mt(()=>{n||(r(!0),e(Se(s,o)).then(()=>r(!1),()=>r(!1)))},[s,e,n,o]),n]}function qt({dispatch:e,apiConfig:s,proxyProviders:n}){const{t:r}=z(),[o,a]=Ht({dispatch:e,apiConfig:s}),[l,c]=Bt({apiConfig:s,dispatch:e,names:n.map(i=>i.name)});return t.jsx(Be,{icon:t.jsx(Ut,{isLoading:a}),onClick:o,text:r("Test Latency"),style:Re,children:n.length>0?t.jsx(Me,{text:r("update_all_proxy_provider"),onClick:l,children:t.jsx(He,{isRotating:c})}):null})}const Et="_updatedAt_919yi_1",Kt="_main_919yi_8",Vt="_head_919yi_17",zt="_action_919yi_23",Gt="_refresh_919yi_31",N={updatedAt:Et,main:Kt,head:Vt,action:zt,refresh:Gt},{useCallback:U}=y;function Zt({name:e,proxies:s,delay:n,vehicleType:r,updatedAt:o,dispatch:a}){const[l,c]=m(oe),i=l[`proxyProvider:${e}`],[u]=m(K),[p]=m(V),d=le(),_=de(s,n,p,u),x=re(!1),h=It({dispatch:a,apiConfig:d,name:e}),T=U(()=>{if(x.value)return;x.set(!0);const b=()=>x.set(!1);a(Ae(d,e)).then(b,b)},[d,a,e,x]),k=U((b,j,R)=>{c(C=>({...C,[`${b}:${j}`]:R}))},[c]),B=U(()=>{k("proxyProvider",e,!i)},[i,k,e]),$=Ke(new Date(o),new Date);return t.jsxs("div",{className:N.main,children:[t.jsxs("div",{className:N.head,children:[t.jsx(ue,{name:e,toggle:B,type:r,isOpen:i,qty:_.length}),t.jsxs("div",{className:N.action,children:[t.jsx(I,{label:"Update",children:t.jsx(v,{kind:"circular",onClick:h,children:t.jsx(Xt,{})})}),t.jsx(I,{label:"Health Check",children:t.jsx(v,{kind:"circular",onClick:T,children:t.jsx(ie,{animate:x.value,size:16})})})]})]}),t.jsx("div",{className:N.updatedAt,children:t.jsxs("small",{children:["Updated ",$," ago"]})}),i?t.jsx(he,{all:_}):t.jsx(ye,{all:_})]})}const Yt={rest:{scale:1},pressed:{scale:.95}},Wt={rest:{rotate:0},hover:{rotate:360,transition:{duration:.3}}};function Xt(){const s=Oe.read().motion;return t.jsx(s.div,{className:N.refresh,variants:Yt,initial:"rest",whileHover:"hover",whileTap:"pressed",children:t.jsx(s.div,{className:"flexCenter",variants:Wt,children:t.jsx(qe,{size:16})})})}const Jt=(e,{proxies:s})=>{const n=E(e);return{proxies:s,delay:n}},Qt=O(Jt)(Zt);function es({items:e}){return e.length===0?null:t.jsxs(t.Fragment,{children:[t.jsx(ce,{title:"Proxy Provider"}),t.jsx("div",{children:e.map(s=>t.jsx(Qt,{name:s.name,proxies:s.proxies,type:s.type,vehicleType:s.vehicleType,updatedAt:s.updatedAt},s.name))})]})}const ts="_labeledInput_cmki0_1",H={labeledInput:ts},ss=[["Natural","order_natural"],["LatencyAsc","order_latency_asc"],["LatencyDesc","order_latency_desc"],["NameAsc","order_name_asc"],["NameDesc","order_name_desc"]],{useCallback:X}=y;function ns(){const[e,s]=m(ae),[n,r]=m(K),[o,a]=m(V),l=X(u=>r(u.target.value),[r]),c=X(u=>{a(u)},[a]),{t:i}=z();return t.jsxs(t.Fragment,{children:[t.jsxs("div",{className:H.labeledInput,children:[t.jsx("span",{children:i("sort_in_grp")}),t.jsx("div",{children:t.jsx(Ve,{options:ss.map(u=>[u[0],i(u[1])]),selected:n,onChange:l})})]}),t.jsx("hr",{}),t.jsxs("div",{className:H.labeledInput,children:[t.jsx("label",{htmlFor:"hideUnavailableProxies",children:i("hide_unavail_proxies")}),t.jsx("div",{children:t.jsx(Y,{id:"hideUnavailableProxies",checked:o,onChange:c})})]}),t.jsxs("div",{className:H.labeledInput,children:[t.jsx("label",{htmlFor:"autoCloseOldConns",children:i("auto_close_conns")}),t.jsx("div",{children:t.jsx(Y,{id:"autoCloseOldConns",checked:e,onChange:s})})]})]})}const rs="_overlay_uuk3b_1",os="_cnt_uuk3b_5",as="_afterOpen_uuk3b_16",q={overlay:rs,cnt:os,afterOpen:as},{useMemo:ls}=y;function J({isOpen:e,onRequestClose:s,children:n}){const r=ls(()=>({base:A(G.content,q.cnt),afterOpen:q.afterOpen,beforeClose:""}),[]);return t.jsx(Te,{isOpen:e,onRequestClose:s,className:r,overlayClassName:A(G.overlay,q.overlay),children:n})}function cs({color:e="currentColor",size:s=24}){return t.jsxs("svg",{fill:"none",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",width:s,height:s,stroke:e,strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[t.jsx("path",{d:"M2 6h9M18.5 6H22"}),t.jsx("circle",{cx:"16",cy:"6",r:"2"}),t.jsx("path",{d:"M22 18h-9M6 18H2"}),t.jsx("circle",{r:"2",transform:"matrix(-1 0 0 1 8 18)"})]})}const is="_topBar_16fpp_1",us="_topBarRight_16fpp_13",ds="_textFilterContainer_16fpp_22",xs="_group_16fpp_29",F={topBar:is,topBarRight:us,textFilterContainer:ds,group:xs},{useState:ps,useEffect:ms,useCallback:Q,useRef:hs}=y;function ys({dispatch:e,groupNames:s,delay:n,proxyProviders:r,showModalClosePrevConns:o}){const a=le(),l=hs({}),c=Q(()=>{l.current.startAt=Date.now(),e($e(a)).then(()=>{l.current.completeAt=Date.now()})},[a,e]);ms(()=>{c();const h=()=>{l.current.startAt&&Date.now()-l.current.startAt>3e4&&c()};return window.addEventListener("focus",h,!1),()=>window.removeEventListener("focus",h,!1)},[c]);const[i,u]=ps(!1),p=Q(()=>{u(!1)},[]),{proxies:{closeModalClosePrevConns:d,closePrevConnsAndTheModal:_}}=ne(),{t:x}=z();return t.jsxs(t.Fragment,{children:[t.jsx(J,{isOpen:i,onRequestClose:p,children:t.jsx(ns,{})}),t.jsxs("div",{className:F.topBar,children:[t.jsx(ce,{title:x("Proxies")}),t.jsxs("div",{className:F.topBarRight,children:[t.jsx("div",{className:F.textFilterContainer,children:t.jsx(Ee,{textAtom:ee})}),t.jsx(I,{label:x("settings"),children:t.jsx(v,{kind:"minimal",onClick:()=>u(!0),children:t.jsx(cs,{size:16})})})]})]}),t.jsx("div",{children:s.map(h=>t.jsx("div",{className:F.group,children:t.jsx(Dt,{name:h,delay:n,apiConfig:a,dispatch:e})},h))}),t.jsx(es,{items:r}),t.jsx("div",{style:{height:60}}),t.jsx(qt,{dispatch:e,apiConfig:a,proxyProviders:r}),t.jsx(J,{isOpen:o,onRequestClose:d,children:t.jsx(We,{onClickPrimaryButton:()=>_(a),onClickSecondaryButton:d})})]})}const fs=e=>({groupNames:Le(e),proxyProviders:De(e),delay:E(e),showModalClosePrevConns:Fe(e)}),Ns=O(fs)(ys);export{Ns as default};
