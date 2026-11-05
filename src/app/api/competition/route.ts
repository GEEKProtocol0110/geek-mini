import { NextRequest, NextResponse } from "next/server";

const endpoint = "https://www.geekprotocol.xyz/api/mini";
const cookieName = "geek_mini_player";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const response = (body: unknown, status=200) => NextResponse.json(body, {status,headers:{"Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});

async function proxy(req: NextRequest, method: "GET" | "POST" | "DELETE") {
  if(method!=="GET" && req.headers.get("origin")!==new URL(req.url).origin)return response({ok:false,error:"Reload Mini before trying again."},403);
  let body: Record<string, unknown> | undefined;
  if(method==="POST"){
    try{
      if(!req.headers.get("content-type")?.startsWith("application/json"))throw Error();
      const raw=await req.text();if(raw.length>2000)throw Error();body=JSON.parse(raw);
      if(!body||Array.isArray(body)||Object.keys(body).some(k=>!["action","mode","focus","id","index","choice"].includes(k))||!["start","answer","state","finish"].includes(String(body.action)))throw Error();
    }catch{return response({ok:false,error:"The request was not valid."},400);}
  }
  const token=req.cookies.get(cookieName)?.value || "";
  if(token&&!/^[a-f0-9]{64}$/.test(token))return response({ok:false,error:"Your Mini identity is invalid. Clear this site's cookies to start again."},401);
  try{
    const query=new URLSearchParams({mode:req.nextUrl.searchParams.get("mode")==="speed"?"speed":"daily",focus:req.nextUrl.searchParams.get("focus")||"mixed"});
    const upstream=await fetch(`${endpoint}${method==="GET"?`?${query}`:""}`,{method,headers:{"Content-Type":"application/json",...(token&&method!=="GET"?{Authorization:`Bearer ${token}`}:{})},body:body?JSON.stringify(body):undefined,cache:"no-store",signal:AbortSignal.timeout(12000)});
    const data=await upstream.json();
    const {token:newToken,...publicData}=data;
    const out=response(publicData,upstream.status);
    if(upstream.ok&&typeof newToken==="string"&&/^[a-f0-9]{64}$/.test(newToken))out.cookies.set(cookieName,newToken,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:90*86400});
    if((method==="DELETE"&&upstream.ok)||upstream.status===401)out.cookies.set(cookieName,"",{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:0});
    return out;
  }catch{return response({ok:false,error:"The public board is temporarily unavailable. Local practice is still ready to play."},503);}
}
export const GET=(req:NextRequest)=>proxy(req,"GET");
export const POST=(req:NextRequest)=>proxy(req,"POST");
export const DELETE=(req:NextRequest)=>proxy(req,"DELETE");
