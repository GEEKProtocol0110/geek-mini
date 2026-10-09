import { ImageResponse } from "next/og";

export const alt = "Geek Mini by Geek Protocol. Learn Kaspa. Pass it on. Daily Challenge and Speed Round. Free to play.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function SocialCard() {
  return new ImageResponse(
    <div style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"60px 70px", background:"linear-gradient(125deg, #0b1014 30%, #183f37)", color:"#f0f6f3", fontFamily:"sans-serif" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}><div style={{ display:"flex", fontSize:30, fontWeight:700, letterSpacing:3 }}>GEEK <span style={{ color:"#83e5d8", margin:"0 10px" }}>{"//"}</span> MINI</div><div style={{ fontSize:18, color:"#b1cbc1" }}>BY GEEK PROTOCOL</div></div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", flexDirection:"column", fontSize:88, lineHeight:1.05, letterSpacing:-5, fontWeight:700 }}><span>Learn Kaspa.</span><span style={{ color:"#83e5d8" }}>Pass it on.</span></div>
        <svg width="240" height="240" viewBox="0 0 240 240"><circle cx="120" cy="120" r="115" fill="#15382f" stroke="#4d8c7b" strokeWidth="2"/><path d="M70 90 L120 48 L172 90 L154 156 L86 174 Z M70 90 L154 156 M120 48 L86 174 M172 90 L86 174" fill="none" stroke="#83e5d8" strokeWidth="3"/>{[[70,90],[120,48],[172,90],[154,156],[86,174]].map(([cx,cy]) => <circle key={cx} cx={cx} cy={cy} r="9" fill="#83e5d8" />)}</svg>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", borderTop:"1px solid #416b61", paddingTop:25, fontSize:23 }}><span>Daily Challenge · Speed Round</span><span style={{ color:"#83e5d8" }}>FREE KASPA KNOWLEDGE PRACTICE ↗</span></div>
    </div>, size,
  );
}
