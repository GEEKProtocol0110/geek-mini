const test=require('node:test');
const assert=require('node:assert/strict');
require('./load-utils.cjs');
const {NextRequest}=require('next/server');
const {GET,POST,DELETE}=require('../src/app/api/competition/route.ts');
const origin='https://mini-test.invalid';
const token='a'.repeat(64);
const req=(method,body,headers={})=>new NextRequest(`${origin}/api/competition?mode=speed&focus=wallets`,{method,headers:{origin,'content-type':'application/json',...headers},...(body?{body:JSON.stringify(body)}:{})});

test('public board proxy is fixed to HQ, strips identity from JSON and sets an HttpOnly cookie',async t=>{
 let outbound;
 t.mock.method(globalThis,'fetch',async(url,options)=>{outbound={url:String(url),...options};return Response.json({ok:true,token,state:{id:'test-round',score:0}});});
 const r=await POST(req('POST',{action:'start',mode:'daily'}));assert.equal(r.status,200);const d=await r.json();assert.equal(d.token,undefined);assert.equal(d.state.score,0);assert.match(r.headers.get('set-cookie'),/HttpOnly/);assert.match(r.headers.get('set-cookie'),/SameSite=lax/i);assert.equal(outbound.url,'https://www.geekprotocol.xyz/api/mini');assert.equal(outbound.headers.Authorization,undefined);assert.equal(outbound.cache,'no-store');
});
test('cross-origin writes and forged score/identity payloads are rejected before the upstream request',async t=>{
 let calls=0;t.mock.method(globalThis,'fetch',async()=>{calls++;throw Error('unexpected');});
 assert.equal((await POST(req('POST',{action:'start'},{origin:'https://other.invalid'}))).status,403);
 assert.equal((await POST(req('POST',{action:'answer',id:'x',score:999}))).status,400);
 assert.equal((await POST(req('POST',{action:'start',token}))).status,400);
 assert.equal((await DELETE(req('DELETE',null,{origin:'https://other.invalid'}))).status,403);assert.equal(calls,0);
});
test('saved identity stays in the backchannel Authorization header and upstream failures preserve removal access',async t=>{
 t.mock.method(globalThis,'fetch',async(url,options)=>{assert.equal(options.headers.Authorization,`Bearer ${token}`);assert.doesNotMatch(options.body||'',new RegExp(token));return Response.json({ok:false,error:'Try again.'},{status:503});});
 const r=await DELETE(req('DELETE',null,{cookie:`geek_mini_player=${token}`}));assert.equal(r.status,503);assert.equal(r.headers.get('set-cookie'),null);
});
test('successful removal clears the identity cookie; public reads need no identity',async t=>{
 t.mock.method(globalThis,'fetch',async(url,options)=>{if(options.method==='GET'){assert.equal(String(url),'https://www.geekprotocol.xyz/api/mini?mode=speed&focus=wallets');return Response.json({ok:true,entries:[]});}return Response.json({ok:true});});
 assert.equal((await GET(req('GET'))).status,200);const d=await DELETE(req('DELETE',null,{cookie:`geek_mini_player=${token}`}));assert.equal(d.status,200);assert.match(d.headers.get('set-cookie'),/Max-Age=0/);
});
test('upstream exceptions expose a bounded generic error and no private endpoint details',async t=>{
 t.mock.method(globalThis,'fetch',async()=>{throw Error('private-provider-secret');});const r=await GET(req('GET'));assert.equal(r.status,503);assert.doesNotMatch(JSON.stringify(await r.json()),/private-provider-secret/);
});
