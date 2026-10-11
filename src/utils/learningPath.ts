import type { QuizQuestion } from '../types/quiz';
import { questionById,type RoundReview } from './questionBank';
export const topicLessons: Record<string,{topic:string;name:string}> = {
 'Kaspa basics':{topic:'origins',name:'Where Kaspa began'},
 'Blocks and consensus':{topic:'blockdag',name:'Blocks, graphs & agreement'},
 'Network history':{topic:'ecosystem',name:'Nodes & builder tools'},
 'Wallet basics':{topic:'wallets',name:'Wallets & safe signatures'},
 'Transactions':{topic:'wallets',name:'Wallets & safe signatures'},
 'KAS units':{topic:'emission',name:'KAS & the emission schedule'},
 'Builder basics':{topic:'ecosystem',name:'Nodes & builder tools'},
 'Node basics':{topic:'ecosystem',name:'Nodes & builder tools'},
 'Network events':{topic:'fundamentals',name:'Keys, fees & finality'},
 'Application data':{topic:'ecosystem',name:'Nodes & builder tools'},
 'Programmability':{topic:'ecosystem',name:'Nodes & builder tools'},
 'KRC-20':{topic:'tokens',name:'Tokens & indexers'},
};
export function lessonFor(question: QuizQuestion) {
 const lesson = topicLessons[question.topic];
 return lesson ? {...lesson,href:`https://www.geekprotocol.xyz/study/?topic=${lesson.topic}&level=foundations`} : null;
}
export function missedLessons(items?: RoundReview[]) {
 const lessons = new Map<string,NonNullable<ReturnType<typeof lessonFor>>>();
 for(const item of items??[]) {
  const q = questionById.get(item.questionId);
  if(!q || item.selected===q.answer) continue;
  const lesson = lessonFor(q); if(lesson) lessons.set(lesson.topic,lesson);
 }
 return [...lessons.values()].slice(0,3);
}
