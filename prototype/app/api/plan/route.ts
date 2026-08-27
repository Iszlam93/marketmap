import { env } from 'cloudflare:workers';
import { createPlansTable } from '../../../db/schema';

type DatabaseEnv={DB:D1Database};
type StrategyMapState={nodes:unknown[];edges:unknown[]};
type PlanRecord={id:string;name:string;year:number;strategy?:StrategyMapState};

const defaultPlan:PlanRecord={id:'default',name:'ISV Marketing',year:2025};
function database(){return (env as unknown as DatabaseEnv).DB}
async function ensureSchema(){const db=database();await db.prepare(createPlansTable).run();const columns=await db.prepare('PRAGMA table_info(plans)').all<{name:string}>();if(!columns.results.some(column=>column.name==='strategy_json'))await db.prepare("ALTER TABLE plans ADD COLUMN strategy_json TEXT NOT NULL DEFAULT '{}'").run();return db}

export async function GET(){
  const db=await ensureSchema();
  const row=await db.prepare('SELECT id,name,plan_year,strategy_json FROM plans WHERE id=?').bind(defaultPlan.id).first<{id:string;name:string;plan_year:number;strategy_json:string}>();
  if(!row){await db.prepare('INSERT INTO plans (id,name,plan_year,strategy_json,updated_at) VALUES (?,?,?,?,?)').bind(defaultPlan.id,defaultPlan.name,defaultPlan.year,'{}',new Date().toISOString()).run();return Response.json({plan:defaultPlan})}
  const strategy=JSON.parse(row.strategy_json||'{}') as StrategyMapState;
  return Response.json({plan:{id:row.id,name:row.name,year:row.plan_year,strategy:strategy.nodes?.length?strategy:undefined}});
}

export async function PUT(request:Request){
  const db=await ensureSchema();
  const plan=await request.json() as PlanRecord;
  const year=Number(plan.year);
  if(!plan.name?.trim())return Response.json({error:'Plan name is required'},{status:400});
  if(!Number.isInteger(year)||year<2000||year>2100)return Response.json({error:'Choose a valid planning year'},{status:400});
  const saved={id:plan.id||defaultPlan.id,name:plan.name.trim(),year,strategy:plan.strategy};
  await db.prepare(`INSERT INTO plans (id,name,plan_year,strategy_json,updated_at) VALUES (?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,plan_year=excluded.plan_year,strategy_json=excluded.strategy_json,updated_at=excluded.updated_at`).bind(saved.id,saved.name,saved.year,JSON.stringify(saved.strategy||{}),new Date().toISOString()).run();
  return Response.json({plan:saved});
}
