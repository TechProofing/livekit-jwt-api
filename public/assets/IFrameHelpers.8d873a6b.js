var K=Object.defineProperty;var _=Object.getOwnPropertySymbols;var M=Object.prototype.hasOwnProperty,T=Object.prototype.propertyIsEnumerable;var y=(n,e,t)=>e in n?K(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t,v=(n,e)=>{for(var t in e||(e={}))M.call(e,t)&&y(n,t,e[t]);if(_)for(var t of _(e))T.call(e,t)&&y(n,t,e[t]);return n};import{e as A,B as R,b as o,l as L,O as x}from"./vendor.c9d45a92.js";const $=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function t(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerpolicy&&(i.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?i.credentials="include":s.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(s){if(s.ep)return;s.ep=!0;const i=t(s);fetch(s.href,i)}};$();(function(){console.log("[globalThis-polyfill] load"),typeof globalThis!="object"&&(Object.prototype.__defineGetter__("__magic__",function(){return this}),__magic__.globalThis=__magic__,delete Object.prototype.__magic__)})();globalThis.global=globalThis;function S(n,e){if(e.length<=0)return!0;const t=e.map(s=>({type:s.type,pattern:new RegExp(s.pattern,"i")}));let a=!1;for(let s of t)if(s.type==="allow"){if(s.pattern.test(n)){a=!0;break}}else if(s.type==="deny"&&s.pattern.test(n)){a=!1;break}return a}function u(n){const e=new TextDecoder,t=A(n);return e.decode(t)}function I(n){return P(n)}function P(n){if(!n||!n.startsWith("vSK1."))return null;const e=n.slice("vSK1.".length);let t=e.indexOf(".");if(t<0)return null;const a=e.slice(0,t),s=e.slice(t+1);if(a.length<=0||s.length<=0)return null;const i=s.indexOf(".");if(i<0)return null;const r=s.slice(0,i),l=s.slice(i+1);if(r.length<=0||l.length<=0)return null;const p=l.indexOf(".");if(p<0)return null;const f=l.slice(0,p),g=l.slice(p+1);if(f.length<=0||g.length<=0)return null;try{const m=u(a),w=u(r),E=u(f),b=parseInt(u(g));return[m,w,E,b]}catch{return null}}const c="userEmail",d="acceptedTerms",h="sessionKey";class U{constructor(e,t){this._apiEndpoint=e,this._gitTag=t,this._loginState=new R(!1)}get userId(){return this._userId}get sessionId(){return this._sessionId}get email(){var e;return(e=this._appMetadata)==null?void 0:e.email}get phone(){var e;return(e=this._appMetadata)==null?void 0:e.phoneNumber}get avatarUrl(){var e;return(e=this._appMetadata)==null?void 0:e.avatarUrl}get avatarPortraitUrl(){var e;return(e=this._appMetadata)==null?void 0:e.avatarPortraitUrl}get name(){var e;return(e=this._appMetadata)==null?void 0:e.name}get userInfoLoaded(){return!!this._userId&&!!this.savedSessionKey&&!!this._appMetadata}get loginState(){return this._loginState}async validateEmail(e){if(!this._emailRules){const t=await this._getEmailRules();this._emailRules=t.map(a=>({type:a.type,pattern:a.pattern}))}return S(e,this._emailRules)}async validateSmsNumber(e){if(!this._phoneRules){const t=await this._getSmsRules();this._phoneRules=t.map(a=>({type:a.type,pattern:a.pattern}))}return S(e,this._phoneRules)}isLoggedIn(){const e=this.savedSessionKey;if(!e)return!1;const t=I(e);if(!t)return!1;const[a,s,i,r]=t;return!(Date.now()>=r)}async loadUserInfo(){const[e,t,a,s]=I(this.savedSessionKey);return this._userId=e,this._sessionId=t,this._appMetadata=await this._loadAppMetadata(),this._appMetadata?(this._saveAcceptedTerms(!0),this.email&&this._saveEmail(this.email)):(this._userId=null,this._sessionId=null,this.savedSessionKey=null),this._loginState.next(this.userInfoLoaded),this.userInfoLoaded}async createPublicRecordKey(e,t){return this.userInfoLoaded||await this.loadUserInfo(),(await o.post(`${this.apiEndpoint}/api/v2/records/key`,{recordName:e,policy:t},{headers:this._authenticationHeaders()})).data}async logout(e=!0){const t=this.savedSessionKey;t&&(this.savedSessionKey=null,e&&await this._revokeSessionKey(t)),this._userId=null,this._sessionId=null,this._appMetadata=null,this._saveEmail(null),this._loginState.next(!1)}async listSessions(e=null){const t=L.exports.omitBy({expireTimeMs:e},r=>typeof r=="undefined"||r===null),a=new URL(`${this.apiEndpoint}/api/v2/sessions`);for(let r in t)a.searchParams.set(r,t[r].toString());const i=(await o.get(a.href,{headers:this._authenticationHeaders()})).data;return i.success?i.sessions:[]}async _revokeSessionKey(e){try{const t=await o.post(`${this.apiEndpoint}/api/v2/revokeSession`,{sessionKey:e},{headers:{Authorization:`Bearer ${e}`}});console.log("[AuthManager] Session key revoked!")}catch(t){console.log("[AuthManager] Could not revoke session key:",t)}}async loginWithEmail(e){return this._login(e,"email")}async loginWithPhoneNumber(e){return this._login(e,"phone")}async completeLogin(e,t,a){const s=await this._completeLoginRequest(e,t,a);return s.success===!0&&(this.savedSessionKey=s.sessionKey,this._userId=s.userId),s}async revokeSession(e,t){const s=(await o.post(`${this.apiEndpoint}/api/v2/revokeSession`,{userId:e,sessionId:t},{validateStatus:i=>i<500,headers:this._authenticationHeaders()})).data;return s.success&&e===this.userId&&t===this.sessionId&&(this.savedSessionKey=null,await this.logout()),s}async revokeAllSessions(e){e||(e=this.userId);const a=(await o.post(`${this.apiEndpoint}/api/v2/revokeAllSessions`,{userId:e},{validateStatus:s=>s<500,headers:this._authenticationHeaders()})).data;return a.success&&e===this.userId&&(this.savedSessionKey=null,await this.logout()),a}async replaceSession(){const t=(await o.post(`${this.apiEndpoint}/api/v2/replaceSession`,{},{validateStatus:a=>a<500,headers:this._authenticationHeaders()})).data;return t.success&&t.userId===this.userId&&(this.savedSessionKey=t.sessionKey),t}async _completeLoginRequest(e,t,a){return(await o.post(`${this.apiEndpoint}/api/v2/completeLogin`,{userId:e,requestId:t,code:a},{validateStatus:i=>i<500})).data}async _login(e,t){return(await o.post(`${this.apiEndpoint}/api/v2/login`,{address:e,addressType:t},{validateStatus:s=>s<500})).data}get version(){return this._gitTag}get savedEmail(){return localStorage.getItem(c)}get hasAcceptedTerms(){return localStorage.getItem(d)==="true"}get savedSessionKey(){return localStorage.getItem(h)}set savedSessionKey(e){e?localStorage.setItem(h,e):localStorage.removeItem(h)}async changeEmail(e){}async updateMetadata(e){await this._putAppMetadata(v({avatarUrl:this.avatarUrl,avatarPortraitUrl:this.avatarPortraitUrl,name:this.name,email:this.email,phoneNumber:this.phone},e)),await this.loadUserInfo()}_saveEmail(e){e?localStorage.setItem(c,e):localStorage.removeItem(c)}_saveAcceptedTerms(e){e?localStorage.setItem(d,"true"):localStorage.removeItem(d)}async _loadAppMetadata(){try{return(await o.get(`${this.apiEndpoint}/api/${encodeURIComponent(this.userId)}/metadata`,{headers:this._authenticationHeaders()})).data}catch(e){if(e.response){if(e.response.status===404)return null;if(e.response.status===403)return null;if(e.response.status===401)return null}}}async _putAppMetadata(e){return(await o.put(`${this.apiEndpoint}/api/${encodeURIComponent(this.savedSessionKey)}/metadata`,e)).data}_authenticationHeaders(){return{Authorization:`Bearer ${this.savedSessionKey}`}}async _getEmailRules(){return(await o.get(`${this.apiEndpoint}/api/emailRules`)).data}async _getSmsRules(){try{return(await o.get(`${this.apiEndpoint}/api/smsRules`)).data}catch(e){if(o.isAxiosError(e)&&e.response.status===404)return[];throw e}}get apiEndpoint(){return this._apiEndpoint}}const B=new U("https://WEBRTC_SERVER_URL","v3.0.21");function C(n){const e=new MessageChannel;return n.postMessage({type:"init_port",port:e.port2},"*",[e.port2]),e}function N(n){return new x(e=>{let t=a=>{a.data.type==="init_port"&&(!n||a.origin===n)&&e.next(a.data.port)};return globalThis.addEventListener("message",t),()=>{globalThis.removeEventListener("message",t)}})}function H(n){return new Promise(e=>{let t=a=>{a.data.type==="init_port"&&(!n||a.origin===n)&&(globalThis.removeEventListener("message",t),e(a.data.port))};globalThis.addEventListener("message",t)})}export{B as a,H as b,N as l,I as p,C as s};
//# sourceMappingURL=IFrameHelpers.8d873a6b.js.map
