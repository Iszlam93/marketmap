import { env } from 'cloudflare:workers';
import { createJourneysTable } from '../../../db/schema';

type DatabaseEnv={DB:D1Database};
type JourneyRecord={id:string;name:string;description:string;sortOrder:number};
function database(){return (env as unknown as DatabaseEnv).DB}
async function ensureSchema(){const db=database();await db.prepare(createJourneysTable).run();return db}
export async function GET(){const db=await ensureSchema();const result=await db.prepare('SELECT id,name,description,sort_order FROM journeys ORDER BY sort_order ASC, name ASC').all<{id:string;name:string;description:string;sort_order:number}>();return Response.json({journeys:result.results.map(row=>({id:row.id,name:row.name,description:row.description,sortOrder:row.sort_order}))})}
export async function POST(request:Request){const db=await ensureSchema();const body=await request.json() as {journeys:JourneyRecord[]};const now=new Date().toISOString();const statements=body.journeys.filter(item=>item.id&&item.name.trim()).map(item=>db.prepare(`INSERT INTO journeys (id,name,description,sort_order,updated_at) VALUES (?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,description=excluded.description,sort_order=excluded.sort_order,updated_at=excluded.updated_at`).bind(item.id,item.name.trim(),item.description||'',item.sortOrder||0,now));if(statements.length)await db.batch(statements);return Response.json({count:statements.length})}
