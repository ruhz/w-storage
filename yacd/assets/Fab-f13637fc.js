import{j as t,k as C,r as l}from"./index-2027f720.js";const E="_spining_4i8sg_1",I="_spining_keyframes_4i8sg_1",y={spining:E,spining_keyframes:I},{useState:F}=C;function A({children:n}){return t.jsx("span",{className:y.spining,children:n})}const B={right:10,bottom:10},R=({children:n,...e})=>t.jsx("button",{type:"button",...e,className:"rtf--ab",children:n}),M=({children:n,...e})=>t.jsx("button",{type:"button",className:"rtf--mb",...e,children:n}),v={bottom:24,right:24},H=({event:n="hover",style:e=v,alwaysShowTitle:o=!1,children:b,icon:f,mainButtonStyles:g,onClick:p,text:u,...x})=>{const[a,r]=F(!1),c=o||!a,d=()=>r(!0),m=()=>r(!1),h=()=>n==="hover"&&d(),_=()=>n==="hover"&&m(),j=s=>p?p(s):(s.persist(),n==="click"?a?m():d():null),k=(s,i)=>{s.persist(),r(!1),setTimeout(()=>{i(s)},1)},N=()=>l.Children.map(b,(s,i)=>l.isValidElement(s)?t.jsxs("li",{className:`rtf--ab__c ${"top"in e?"top":""}`,children:[l.cloneElement(s,{"data-testid":`action-button-${i}`,"aria-label":s.props.text||`Menu button ${i+1}`,"aria-hidden":c,tabIndex:a?0:-1,...s.props,onClick:$=>{s.props.onClick&&k($,s.props.onClick)}}),s.props.text&&t.jsx("span",{className:`${"right"in e?"right":""} ${o?"always-show":""}`,"aria-hidden":c,children:s.props.text})]}):null);return t.jsx("ul",{onMouseEnter:h,onMouseLeave:_,className:`rtf ${a?"open":"closed"}`,"data-testid":"fab",style:e,...x,children:t.jsxs("li",{className:"rtf--mb__c",children:[t.jsx(M,{onClick:j,style:g,"data-testid":"main-button",role:"button","aria-label":"Floating menu",tabIndex:0,children:f}),u&&t.jsx("span",{className:`${"right"in e?"right":""} ${o?"always-show":""}`,"aria-hidden":c,children:u}),t.jsx("ul",{children:N()})]})})};export{R as A,H as F,A as I,B as p};
