import { env } from 'cloudflare:workers';
import { createJourneyIndex, createProjectsTable, createStageIndex } from '../../../db/schema';

type DatabaseEnv = { DB: D1Database };
type ProjectConnection = { targetId:string; type:'supports'|'leads_to'|'depends_on'|'repurposes' };
type ProjectRecord = { id:string; name:string; type:string; stage:string; stages?:string[]; journey?:string; dates:string[]; objective:string; activities:string[]; link?:string; owner?:string; status?:string; kpi?:string; connections?:ProjectConnection[] };

function database(){ return (env as unknown as DatabaseEnv).DB; }
async function ensureSchema(){
  const db=database();
  await db.batch([db.prepare(createProjectsTable),db.prepare(createStageIndex),db.prepare(createJourneyIndex)]);
  const columns=await db.prepare('PRAGMA table_info(projects)').all<{name:string}>();
  if(!columns.results.some(column=>column.name==='stages_json')) await db.prepare("ALTER TABLE projects ADD COLUMN stages_json TEXT NOT NULL DEFAULT '[]'").run();
  if(!columns.results.some(column=>column.name==='connections_json')) await db.prepare("ALTER TABLE projects ADD COLUMN connections_json TEXT NOT NULL DEFAULT '[]'").run();
  await db.prepare('PRAGMA optimize').run();
  return db;
}
function rowToProject(row:Record<string,unknown>):ProjectRecord{
  return {id:String(row.id),name:String(row.name),type:String(row.category),stage:String(row.stage),stages:JSON.parse(String(row.stages_json||'[]')),journey:row.journey?String(row.journey):undefined,dates:JSON.parse(String(row.dates_json||'[]')),objective:String(row.objective||''),activities:JSON.parse(String(row.activities_json||'[]')),link:String(row.project_link||''),owner:String(row.owner||''),status:String(row.status||'planned'),kpi:String(row.kpi||''),connections:JSON.parse(String(row.connections_json||'[]'))};
}
function upsert(db:D1Database,project:ProjectRecord,updatedAt:string){
  return db.prepare(`INSERT INTO projects (id,name,category,stage,stages_json,journey,dates_json,objective,activities_json,project_link,owner,status,kpi,connections_json,updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,category=excluded.category,stage=excluded.stage,stages_json=excluded.stages_json,journey=excluded.journey,dates_json=excluded.dates_json,objective=excluded.objective,activities_json=excluded.activities_json,project_link=excluded.project_link,owner=excluded.owner,status=excluded.status,kpi=excluded.kpi,connections_json=excluded.connections_json,updated_at=excluded.updated_at`)
    .bind(project.id,project.name,project.type,project.stage,JSON.stringify(project.stages||[project.stage]),project.journey||null,JSON.stringify(project.dates||[]),project.objective||'',JSON.stringify(project.activities||[]),project.link||'',project.owner||'',project.status||'planned',project.kpi||'',JSON.stringify(project.connections||[]),updatedAt);
}
export async function GET(){const db=await ensureSchema();const result=await db.prepare('SELECT * FROM projects ORDER BY updated_at ASC').all<Record<string,unknown>>();return Response.json({projects:result.results.map(rowToProject)});}
export async function PUT(request:Request){const db=await ensureSchema();const project=await request.json() as ProjectRecord;if(!project.id||!project.name)return Response.json({error:'Project name is required'},{status:400});await upsert(db,project,new Date().toISOString()).run();return Response.json({project});}
export async function POST(request:Request){const db=await ensureSchema();const body=await request.json() as {projects:ProjectRecord[]};const statements=(body.projects||[]).filter(project=>project.id&&project.name).map(project=>upsert(db,project,new Date().toISOString()));if(statements.length)await db.batch(statements);return Response.json({count:statements.length});}
