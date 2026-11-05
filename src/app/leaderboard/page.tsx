import type { Metadata } from "next";
import { MiniLeaderboard } from "../../components/MiniLeaderboard";
export const metadata:Metadata={title:"Mini leaderboard",description:"Public Geek Mini Daily and Speed standings. Play a server-graded Kaspa practice challenge and meet the Mini leaders.",alternates:{canonical:"/leaderboard"}};
export default function Page(){return <MiniLeaderboard/>;}
