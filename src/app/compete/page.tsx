import type { Metadata } from "next";
import { PublicChallenge } from "../../components/PublicChallenge";
export const metadata:Metadata={title:"Public Mini challenge",robots:{index:false,follow:true}};
export default function Page(){return <PublicChallenge/>;}
