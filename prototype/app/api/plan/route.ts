import { env } from 'cloudflare:workers';
import { createPlansTable } from '../../../db/schema';

type DatabaseEnv={DB:D1Database};
type PlanRecord={id:string;name:string;year:number};

const defaultPlan:PlanRecord={id:'default',name:'ISV Marketing',year:2025};
function database(){return (env as unknown as DatabaseEnv).DB}
async function ensureSchema(){const db=database();await db.prepare(createPlansTable).run();return db}

export async function GET(){
  const db=await ensureSchema();
  const row=await db.prepare('SELECT id,name,plan_year FROM plans WHERE id=?').bind(defaultPlan.id).first<{id:string;name:string;plan_year:number}>();
  if(!row){await db.prepare('INSERT INTO plans (id,name,plan_year,updated_at) VALUES (?,?,?,?)').bind(defaultPlan.id,defaultPlan.name,defaultPlan.year,new Date().toISOString()).run();return Response.json({plan:defaultPlan})}
  return Response.json({plan:{id:row.id,name:row.name,year:row.plan_year}});
}

export async function PUT(request:Request){
  const db=await ensureSchema();
  const plan=await request.json() as PlanRecord;
  const year=Number(plan.year);
  if(!plan.name?.trim())return Response.json({error:'Plan name is required'},{status:400});
  if(!Number.isInteger(year)||year<2000||year>2100)return Response.json({error:'Choose a valid planning year'},{status:400});
  const saved={id:plan.id||defaultPlan.id,name:plan.name.trim(),year};
  await db.prepare(`INSERT INTO plans (id,name,plan_year,updated_at) VALUES (?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,plan_year=excluded.plan_year,updated_at=excluded.updated_at`).bind(saved.id,saved.name,saved.year,new Date().toISOString()).run();
  return Response.json({plan:saved});
}
