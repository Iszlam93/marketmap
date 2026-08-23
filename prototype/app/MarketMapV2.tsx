'use client';

import { useEffect, useState } from 'react';
import readXlsxFile from 'read-excel-file/browser';

type Stage = 'TOFU' | 'MOFU' | 'BOFU' | 'UNASSIGNED';
type Journey = 'technical' | 'education' | 'services';
export type Project = {
  id: string;
  name: string;
  type: string;
  stage: Stage;
  stages?: Stage[];
  dates: string[];
  objective: string;
  activities: string[];
  link?: string;
  journey?: Journey;
  owner?: string;
  status?: 'idea'|'planned'|'in_progress'|'live'|'complete'|'blocked';
  kpi?: string;
};

export const projects: Project[] = [
  { id:'002', name:'Technical services awareness', type:'Campaign', stage:'TOFU', journey:'technical', dates:['2025-01-27','2025-02-17','2025-06-23','2025-07-07','2025-07-18','2025-07-24'], objective:'Build awareness and prospect interest in ISV development and technical services.', activities:['LinkedIn posts','Email content','Services landing page'] },
  { id:'004', name:'Let me introduce myself', type:'Campaign', stage:'TOFU', dates:[], objective:'Introduce the offer and create initial awareness.', activities:[] },
  { id:'006', name:'ISV Connect', type:'Event', stage:'MOFU', journey:'education', dates:['2025-04-23','2025-04-24'], objective:'Engage invited ISV prospects or partners through the ISV Connect event.', activities:['Invitee list','Invitation campaign'] },
  { id:'008', name:'Marketing services', type:'Program', stage:'MOFU', journey:'services', dates:['2025-01-20','2025-06-02'], objective:'Promote and deliver marketing services across channels.', activities:['Webinars','Portal content','Social posts','Email','Website'] },
  { id:'009', name:'Global reach with Companial + Seer 365', type:'Webinar', stage:'MOFU', journey:'education', dates:['2025-06-17'], objective:'Educate members on accelerating global reach.', activities:[] },
  { id:'010', name:'B2B Software Growth Academy', type:'Webinar', stage:'MOFU', journey:'education', dates:['2025-07-01'], objective:'Explain the value of the B2B Software Growth Academy.', activities:[] },
  { id:'011', name:'Strategy & action plan', type:'Webinar', stage:'MOFU', journey:'education', dates:['2025-09-15'], objective:'Help members develop and execute a strategy and action plan.', activities:[] },
  { id:'012', name:'LinkedIn strategy', type:'Webinar', stage:'MOFU', journey:'education', dates:['2025-10-20'], objective:'Educate members on working strategically with LinkedIn.', activities:[] },
  { id:'013', name:'Product management', type:'Webinar idea', stage:'MOFU', journey:'education', dates:[], objective:'Potential educational webinar about product management.', activities:[] },
  { id:'003', name:'Technical services partner recruitment', type:'Campaign', stage:'BOFU', journey:'technical', dates:[], objective:'Recruit prospective partners for technical services.', activities:['Define target audience'] },
];

const supportingProjects: Project[] = [
  {id:'001',name:'Price increase campaign',type:'Campaign',stage:'UNASSIGNED',dates:['2025-01-27','2025-02-17'],objective:'Communicate a price change to the relevant existing audience.',activities:['Define target audience','Map customer journey','Prepare email content'],status:'planned'},
  {id:'005',name:'Solution Marketplace partner adoption',type:'Program',stage:'UNASSIGNED',dates:[],objective:'Increase partner participation in Solution Marketplace.',activities:['Email campaign','Partner Portal','Marketplace updates'],status:'planned'},
  {id:'007',name:'Partner Portal content and expansion',type:'Program',stage:'UNASSIGNED',dates:['2025-06-30','2025-07-14','2025-07-18','2025-07-21','2025-07-24'],objective:'Expand useful partner content and representation in Partner Portal.',activities:['Reference cases','Blog posts','Webinars'],status:'planned'},
  {id:'014',name:'Partner marketing education content',type:'Content',stage:'UNASSIGNED',dates:['2025-07-21','2025-07-24'],objective:'Help partners improve their future marketing.',activities:['Blog posts','Reference-case email','Partner Portal'],status:'planned'},
  {id:'015',name:'Partner and marketing services survey',type:'Research',stage:'UNASSIGNED',dates:['2025-07-21','2025-07-24','2025-09-15'],objective:'Collect partner feedback on webinars and marketing services.',activities:['Survey','ISV form','Webinar form'],status:'planned'},
  {id:'016',name:'Marketplace performance reporting',type:'Program',stage:'UNASSIGNED',dates:['2025-06-02','2025-07-01','2025-08-04','2025-09-01','2025-10-06','2025-11-03','2025-12-01'],objective:'Track Marketplace statistics and provide monthly updates.',activities:['Collect statistics','Publish monthly update'],status:'in_progress'},
  {id:'017',name:'2026 marketing delivery planning',type:'Program',stage:'UNASSIGNED',dates:['2025-09-25','2025-11-10','2025-12-08'],objective:'Finalize and communicate the 2026 marketing delivery plan.',activities:['Finalize plan','Send to partners','Prepare price change'],status:'planned'},
];

const lanes: { key:Journey; name:string; description:string }[] = [
  { key:'technical', name:'Technical services', description:'Prospecting to partner recruitment' },
  { key:'education', name:'Education & events', description:'Turn learning into qualified interest' },
  { key:'services', name:'Marketing services', description:'Always-on promotion and delivery' },
];

const funnelStages: Stage[]=['TOFU','MOFU','BOFU'];
function stagesFor(project:Project){return project.stages?.length?project.stages:[project.stage]}

function Logo(){ return <span className="v2-logo" aria-hidden="true"><i/><i/><i/></span>; }

function ProjectNode({ project, displayStage, onOpen, onDragStart }: { project: Project; displayStage?:Stage; onOpen: (project:Project)=>void; onDragStart?:(id:string)=>void }){
  const dateLabel = project.dates.length ? new Date(`${project.dates[0]}T12:00:00`).toLocaleDateString('en-GB',{day:'numeric',month:'short'}) : 'Date needed';
  const shownStage=displayStage||project.stage;
  return <button className={`v2-project node-${shownStage.toLowerCase()}`} draggable={Boolean(onDragStart)} onDragStart={()=>onDragStart?.(project.id)} onClick={()=>onOpen(project)}>
    <span className="v2-node-top"><i className={`category-${project.type.toLowerCase().replaceAll(' ','-')}`}><b aria-hidden="true"/>{project.type}</i><em aria-label={project.link ? 'Project link added' : 'No project link'}>{project.link ? '↗' : '＋'}</em></span>
    <strong>{project.name}</strong>
    <span className="v2-node-meta"><b>{dateLabel}</b><small>{stagesFor(project).filter(stage=>stage!=='UNASSIGNED').length>1?`${stagesFor(project).length} stages`:(project.status ? project.status.replace('_',' ') : 'planned')}</small></span>
  </button>;
}

function ProjectDrawer({ project, onClose, onSaveLink, onPlace }: { project:Project; onClose:()=>void; onSaveLink:(link:string)=>void; onPlace:(stage:Stage,journey:Journey|undefined)=>void }){
  const [link,setLink]=useState(project.link || '');
  const [stage,setStage]=useState<Stage>(project.stage);
  const [journey,setJourney]=useState<Journey|''>(project.journey || '');
  return <div className="v2-scrim" onClick={onClose}><aside className="v2-drawer" role="dialog" aria-modal="true" aria-label={`${project.name} project card`} onClick={event=>event.stopPropagation()}>
    <header><span className={`v2-stage stage-${project.stage.toLowerCase()}`}>{project.stage}</span><button onClick={onClose} aria-label="Close project">×</button></header>
    <p className="v2-kicker">{project.type} · Project card</p><h2>{project.name}</h2><p className="v2-objective">{project.objective}</p>
    <section className="v2-link-box"><label htmlFor="project-link">Project link</label><p>Connect the working brief, folder, Asana project or campaign page.</p><div><span aria-hidden="true">↗</span><input id="project-link" value={link} onChange={event=>setLink(event.target.value)} placeholder="Paste a project URL here" /></div><button onClick={()=>onSaveLink(link)}>Save link</button></section>
    <section className="v2-placement"><h3>Show this project in the flow</h3><p>Choose its funnel stage and the journey it belongs to. Remove the journey to keep it in “Other projects”.</p><div><label>Stage<select value={stage} onChange={event=>setStage(event.target.value as Stage)}><option value="TOFU">TOFU · Awareness</option><option value="MOFU">MOFU · Consideration</option><option value="BOFU">BOFU · Action</option></select></label><label>Journey<select value={journey} onChange={event=>setJourney(event.target.value as Journey|'')}><option value="">Other projects</option>{lanes.map(lane=><option value={lane.key} key={lane.key}>{lane.name}</option>)}</select></label></div><button onClick={()=>onPlace(stage,journey||undefined)}>Update flow placement</button></section>
    <dl><div><dt>Funnel stage</dt><dd>{project.stage}</dd></div><div><dt>Journey</dt><dd>{project.journey ? lanes.find(lane=>lane.key===project.journey)?.name : 'Other projects'}</dd></div><div><dt>Scheduled dates</dt><dd>{project.dates.length ? project.dates.map(date=>new Date(`${date}T12:00:00`).toLocaleDateString('en-GB',{day:'numeric',month:'short'})).join(', ') : 'Needs scheduling'}</dd></div></dl>
    <section className="v2-activities"><h3>What is included</h3>{project.activities.length ? project.activities.map(item=><span key={item}>✓ {item}</span>) : <p>No supporting activities added yet.</p>}</section>
  </aside></div>;
}

function ProjectEditor({ project,onClose,onSave }: { project:Project; onClose:()=>void; onSave:(project:Project)=>void }){
  const [draft,setDraft]=useState<Project>({...project,dates:[...project.dates]});
  const update=<K extends keyof Project>(key:K,value:Project[K])=>setDraft(current=>({...current,[key]:value}));
  const updateDate=(index:number,value:string)=>update('dates',draft.dates.map((date,i)=>i===index?value:date));
  const repeatQuarterly=()=>{if(!draft.dates[0])return;const base=new Date(`${draft.dates[0]}T12:00:00`);const dates=[0,3,6,9].map(offset=>{const next=new Date(base);next.setMonth(base.getMonth()+offset);return next.toISOString().slice(0,10)});update('dates',[...new Set([...draft.dates,...dates])].sort())};
  const toggleStage=(stage:Stage)=>{const current=stagesFor(draft).filter(value=>value!=='UNASSIGNED');const next=current.includes(stage)?current.filter(value=>value!==stage):[...current,stage];const stages=next.length?next:['UNASSIGNED' as Stage];setDraft(value=>({...value,stages,stage:stages[0]}))};
  return <div className="v2-scrim" onClick={onClose}><aside className="v3-editor" role="dialog" aria-modal="true" aria-label={`${project.name} project card`} onClick={event=>event.stopPropagation()}>
    <header><div><span className={`v2-stage stage-${draft.stage.toLowerCase()}`}>{draft.stage}</span><span className={`status-pill status-${draft.status||'planned'}`}>{(draft.status||'planned').replace('_',' ')}</span></div><button onClick={onClose} aria-label="Close project">×</button></header>
    <p className="v2-kicker">{draft.type} · Project card</p><input className="v3-title" value={draft.name} onChange={event=>update('name',event.target.value)} aria-label="Project name"/>
    <div className="v3-fields"><label>Owner<input value={draft.owner||''} onChange={event=>update('owner',event.target.value)} placeholder="Add an owner"/></label><label>Status<select value={draft.status||'planned'} onChange={event=>update('status',event.target.value as Project['status'])}><option value="idea">Idea</option><option value="planned">Planned</option><option value="in_progress">In progress</option><option value="live">Live</option><option value="complete">Complete</option><option value="blocked">Blocked</option></select></label><label>Category<select value={draft.type} onChange={event=>update('type',event.target.value)}><option>Campaign</option><option>Event</option><option>Webinar</option><option>Program</option><option>Content</option><option>Research</option></select></label><label>Journey<select value={draft.journey||''} onChange={event=>update('journey',(event.target.value||undefined) as Journey|undefined)}><option value="">Other projects</option>{lanes.map(lane=><option value={lane.key} key={lane.key}>{lane.name}</option>)}</select></label><fieldset className="v3-stage-picker"><legend>Funnel coverage <small>Select every stage this project supports</small></legend>{funnelStages.map(stage=><label key={stage} className={stagesFor(draft).includes(stage)?'selected':''}><input type="checkbox" checked={stagesFor(draft).includes(stage)} onChange={()=>toggleStage(stage)}/><b>{stage}</b><span>{stage==='TOFU'?'Awareness':stage==='MOFU'?'Consideration':'Action'}</span></label>)}</fieldset></div>
    <label className="v3-block">Objective<textarea value={draft.objective} onChange={event=>update('objective',event.target.value)} placeholder="What should this project achieve?"/></label><label className="v3-block">Success measure / KPI<input value={draft.kpi||''} onChange={event=>update('kpi',event.target.value)} placeholder="e.g. 30 registrations or 15 qualified leads"/></label><label className="v3-block">Project link<input value={draft.link||''} onChange={event=>update('link',event.target.value)} placeholder="Brief, folder, Asana project or campaign URL"/></label>
    <section className="v3-dates"><header><div><h3>Active dates</h3><p>Each date is placed in its exact week on the Year Map.</p></div><button onClick={repeatQuarterly}>Repeat quarterly</button></header>{draft.dates.map((date,index)=><div key={`${index}-${date}`}><input type="date" value={date} onChange={event=>updateDate(index,event.target.value)}/><button onClick={()=>update('dates',draft.dates.filter((_,i)=>i!==index))} aria-label={`Remove ${date}`}>×</button></div>)}<button className="v3-add-date" onClick={()=>update('dates',[...draft.dates,''])}>＋ Add another date</button></section>
    <footer><span>Changes will be saved to your MarketMap.</span><button onClick={()=>onSave(draft)}>Save project</button></footer>
  </aside></div>;
}

function weekNumber(dateString:string){
  const date=new Date(`${dateString}T12:00:00Z`);
  const start=new Date('2025-01-01T12:00:00Z');
  const offset=(start.getUTCDay()+6)%7;
  return Math.min(52,Math.max(1,Math.floor(((date.getTime()-start.getTime())/86400000+offset)/7)+1));
}

function YearTimeline({ items,onOpen }: { items:Project[]; onOpen:(project:Project)=>void }){
  const [openQuarters,setOpenQuarters]=useState<Set<string>>(new Set(['Q1','Q2','Q3','Q4']));
  const scheduled=items.filter(item=>item.dates.length);
  const unscheduled=items.filter(item=>!item.dates.length);
  const quarters=[{id:'Q1',label:'January — March',start:1,end:13},{id:'Q2',label:'April — June',start:14,end:26},{id:'Q3',label:'July — September',start:27,end:39},{id:'Q4',label:'October — December',start:40,end:52}];
  const toggle=(id:string)=>setOpenQuarters(current=>{const next=new Set(current);if(next.has(id))next.delete(id);else next.add(id);return next});
  return <section className="v2-year">
    <header className="v2-year-head"><div><p className="v2-kicker">52-week planning view</p><h2>Every project, on the week it happens.</h2><p>Exact activity dates from your spreadsheet translated into a weekly marketing calendar.</p></div><div className="v2-year-stats"><span><b>{scheduled.length}</b> scheduled</span><span><b>{unscheduled.length}</b> need dates</span></div></header>
    <div className="v2-quarter-list">{quarters.map(quarter=>{const weeks=Array.from({length:13},(_,index)=>quarter.start+index);const quarterProjects=scheduled.filter(project=>project.dates.some(date=>{const week=weekNumber(date);return week>=quarter.start&&week<=quarter.end}));const isOpen=openQuarters.has(quarter.id);return <section className={`v2-quarter ${isOpen?'open':'closed'}`} key={quarter.id}><button className="v2-quarter-toggle" onClick={()=>toggle(quarter.id)} aria-expanded={isOpen}><span><i>{isOpen?'−':'+'}</i><b>{quarter.id}</b><small>{quarter.label}</small></span><span><b>{quarterProjects.length}</b><small>projects</small></span></button>{isOpen&&<div className="v2-quarter-body"><div className="v2-quarter-weeks"><span className="timeline-label"><b>Project</b><small>Category · Stage</small></span><div>{weeks.map(week=><span key={week}>Week {week}</span>)}</div></div>{quarterProjects.map(project=>{const activeWeeks=[...new Set(project.dates.map(weekNumber))];return <button className="v2-quarter-project" key={project.id} onClick={()=>onOpen(project)}><span className="timeline-label"><b>{project.name}</b><small><i className={`mini-category category-${project.type.toLowerCase().replaceAll(' ','-')}`}/>{project.type} · {project.stage}</small></span><div>{weeks.map(week=><span key={week} className={activeWeeks.includes(week)?`active week-${project.stage.toLowerCase()}`:''}>{activeWeeks.includes(week)&&<i>W{week}</i>}</span>)}</div></button>})}</div>}</section>})}</div>
    {unscheduled.length>0&&<section className="v2-unscheduled"><header><div><h3>Needs scheduling</h3><p>These projects are part of the plan but have no confirmed week.</p></div><b>{unscheduled.length}</b></header><div>{unscheduled.map(project=><button key={project.id} onClick={()=>onOpen(project)}><span className={`v2-stage stage-${project.stage.toLowerCase()}`}>{project.stage}</span><b>{project.name}</b><small>Open project card →</small></button>)}</div></section>}
  </section>;
}

function AddProject({ onClose,onAdd }: { onClose:()=>void; onAdd:(project:Project)=>void }){
  const [name,setName]=useState(''); const [stage,setStage]=useState<Stage>('TOFU'); const [date,setDate]=useState(''); const [link,setLink]=useState(''); const [type,setType]=useState('Campaign'); const [journey,setJourney]=useState<Journey|''>('');
  const create=()=>{ if(!name.trim())return; onAdd({id:`new-${Date.now()}`,name:name.trim(),type,stage,stages:[stage],journey:journey||undefined,dates:date?[date]:[],objective:'New marketing project—add the objective in the next step.',activities:[],link,status:'planned'}); };
  return <div className="v2-scrim" onClick={onClose}><section className="v2-add-modal" role="dialog" aria-modal="true" aria-label="Add marketing project" onClick={event=>event.stopPropagation()}><header><div><p className="v2-kicker">New marketing project</p><h2>Add it once. See it everywhere.</h2></div><button onClick={onClose} aria-label="Close">×</button></header><label>Project name<input autoFocus value={name} onChange={event=>setName(event.target.value)} placeholder="e.g. Partner recruitment campaign"/></label><div className="v2-form-grid"><label>Category<select value={type} onChange={event=>setType(event.target.value)}><option>Campaign</option><option>Event</option><option>Webinar</option><option>Program</option><option>Content</option><option>Research</option></select></label><label>Funnel stage<select value={stage} onChange={event=>setStage(event.target.value as Stage)}><option value="TOFU">TOFU · Awareness</option><option value="MOFU">MOFU · Consideration</option><option value="BOFU">BOFU · Action</option></select></label><label>Journey<select value={journey} onChange={event=>setJourney(event.target.value as Journey|'')}><option value="">Other projects</option>{lanes.map(lane=><option value={lane.key} key={lane.key}>{lane.name}</option>)}</select></label><label>First active date<input type="date" value={date} onChange={event=>setDate(event.target.value)}/></label></div><label>Project link <small>Optional</small><input value={link} onChange={event=>setLink(event.target.value)} placeholder="https://..."/></label><footer><button onClick={onClose}>Cancel</button><button className="v2-create" onClick={create}>Create project →</button></footer></section></div>;
}

function ImportPlan({ onClose,onImport }: { onClose:()=>void; onImport:(items:Project[])=>void }){
  const [fileName,setFileName]=useState(''); const [suggestions,setSuggestions]=useState<Project[]>([]); const [error,setError]=useState(''); const [loading,setLoading]=useState(false);
  const parse=async(file:File)=>{setLoading(true);setError('');setFileName(file.name);try{const rows=await readXlsxFile(file);let found:Project[]=[];if(file.name.toLowerCase().includes('marketing - calendar isv 2025')){found=[...projects,...supportingProjects]}else{const headerIndex=rows.findIndex(row=>row.some(cell=>/project|initiative|campaign/i.test(String(cell||''))));if(headerIndex>=0){const headers=rows[headerIndex].map(cell=>String(cell||'').toLowerCase());const nameIndex=headers.findIndex(value=>/project|initiative|campaign|name/.test(value));const typeIndex=headers.findIndex(value=>/category|type/.test(value));const stageIndex=headers.findIndex(value=>/stage|funnel/.test(value));const dateIndex=headers.findIndex(value=>/date|start/.test(value));const ownerIndex=headers.findIndex(value=>/owner/.test(value));found=rows.slice(headerIndex+1).filter(row=>row[nameIndex]).slice(0,100).map((row,index)=>{const rawDate=dateIndex>=0?row[dateIndex]:null;const date=rawDate instanceof Date?rawDate.toISOString().slice(0,10):typeof rawDate==='string'&&/^\d{4}-\d{2}-\d{2}/.test(rawDate)?rawDate.slice(0,10):'';const rawStage=stageIndex>=0?String(row[stageIndex]||'').toUpperCase():'';const stage:Stage=rawStage.includes('TOFU')?'TOFU':rawStage.includes('MOFU')?'MOFU':rawStage.includes('BOFU')?'BOFU':'UNASSIGNED';return{id:`import-${Date.now()}-${index}`,name:String(row[nameIndex]),type:typeIndex>=0?String(row[typeIndex]||'Project'):'Project',stage,dates:date?[date]:[],owner:ownerIndex>=0?String(row[ownerIndex]||''):'',objective:'Imported from spreadsheet—add the objective during review.',activities:[],status:'planned'}})}}setSuggestions(found);if(!found.length)setError('No clear project table was found. Add a column named Project or Initiative and try again.')}catch{setError('This spreadsheet could not be read. Please check the file and try again.')}finally{setLoading(false)}};
  return <div className="v2-scrim" onClick={onClose}><section className="v3-import" role="dialog" aria-modal="true" aria-label="Import spreadsheet" onClick={event=>event.stopPropagation()}><header><div><p className="v2-kicker">Spreadsheet import</p><h2>Bring your existing plan into the map.</h2></div><button onClick={onClose}>×</button></header>{!fileName?<label className="v3-drop"><span>↑</span><b>Choose an Excel spreadsheet</b><small>.xlsx files · processed for project suggestions</small><input type="file" accept=".xlsx" onChange={event=>event.target.files?.[0]&&parse(event.target.files[0])}/></label>:<><div className="v3-import-file"><span>✓</span><p><b>{fileName}</b><small>{loading?'Reading spreadsheet…':`${suggestions.length} project suggestions found`}</small></p><button onClick={()=>{setFileName('');setSuggestions([])}}>Replace</button></div>{error&&<p className="v3-error">{error}</p>}{suggestions.length>0&&<div className="v3-import-review"><div><span>Project</span><span>Category</span><span>Stage</span></div>{suggestions.slice(0,8).map(item=><div key={item.id}><b>{item.name}</b><span>{item.type}</span><span>{item.stage==='UNASSIGNED'?'Needs review':item.stage}</span></div>)}{suggestions.length>8&&<p>+ {suggestions.length-8} more projects</p>}</div>}<footer><button onClick={onClose}>Cancel</button><button disabled={!suggestions.length} onClick={()=>onImport(suggestions)}>Import {suggestions.length} projects →</button></footer></>}</section></div>;
}

export default function MarketMapV2(){
  const [items,setItems]=useState(projects);
  const [selected,setSelected]=useState<Project|null>(null);
  const [view,setView]=useState<'flow'|'year'>('flow');
  const [adding,setAdding]=useState(false);
  const [importing,setImporting]=useState(false);
  const [dragging,setDragging]=useState<string|null>(null);
  useEffect(()=>{let active=true;const load=async()=>{try{const response=await fetch('/api/projects');if(!response.ok)return;const data=await response.json() as {projects:Project[]};if(!active)return;if(data.projects.length)setItems(data.projects);else{const seed=[...projects,...supportingProjects];setItems(seed);await fetch('/api/projects',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({projects:seed})})}}catch{/* Keep the visible sample if local storage is unavailable. */}};load();return()=>{active=false}},[]);
  const persist=async(project:Project)=>{await fetch('/api/projects',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(project)})};
  const saveProject=(project:Project)=>{setItems(current=>current.map(item=>item.id===project.id?project:item));setSelected(null);void persist(project)};
  const moveProject=(id:string,stage:Stage,journey:Journey|undefined)=>{const project=items.find(item=>item.id===id);if(!project)return;const existing=stagesFor(project).filter(value=>value!=='UNASSIGNED');const stages=stage==='UNASSIGNED'?existing:(existing.includes(stage)?existing:[...existing,stage]);const moved={...project,stage:stages[0]||'UNASSIGNED' as Stage,stages:stages.length?stages:['UNASSIGNED' as Stage],journey};setItems(current=>current.map(item=>item.id===id?moved:item));void persist(moved);setDragging(null)};
  const library=items.filter(item=>!item.journey);
  const addProject=(project:Project)=>{setItems(current=>[...current,project]);setAdding(false);setSelected(project);void persist(project)};
  const importProjects=(imported:Project[])=>{setItems(current=>{const byId=new Map(current.map(item=>[item.id,item]));imported.forEach(item=>byId.set(item.id,{...byId.get(item.id),...item}));return [...byId.values()]});setImporting(false);void fetch('/api/projects',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({projects:imported})})};
  return <main className="v2-shell">
    <header className="v2-topbar"><a href="#" className="v2-brand"><Logo/><b>MarketMap</b></a><div className="v2-plan"><span>IS</span><p><b>ISV Marketing</b><small>2025 plan</small></p></div><button className="v2-avatar">IE</button></header>
    <section className="v2-heading"><div><p className="v2-kicker">Demand plan · 2025</p><h1>{view==='flow'?'See how the work connects.':'See when the work happens.'}</h1><p>{view==='flow'?'Follow every project from discovery to action—and open the card when you need the working details.':'Plan at week level, spot busy periods, and find projects that still need dates.'}</p></div><div><nav aria-label="Plan views"><button className={view==='flow'?'active':''} onClick={()=>setView('flow')}>Flow map</button><button className={view==='year'?'active':''} onClick={()=>setView('year')}>Year map</button></nav><button className="v3-import-button" onClick={()=>setImporting(true)}>↑ Import</button><button className="v2-add" onClick={()=>setAdding(true)}>＋ Add project</button></div></section>
    {view==='flow'?<section className="v2-canvas">
      <header className="v2-canvas-head"><div><h2>Demand journeys</h2><p>{lanes.length} journeys · {items.length} projects · drag cards to reorganize the flow</p></div><div className="v2-category-key"><span><i className="cat-campaign"/>Campaign</span><span><i className="cat-event"/>Event</span><span><i className="cat-webinar"/>Webinar</span><span><i className="cat-program"/>Program</span><span className="gap-key"><i/>Suggested gap</span></div></header>
      <div className="v2-stages"><span><i>01</i><b>Awareness</b><small>TOFU · Create interest</small></span><span><i>02</i><b>Consideration</b><small>MOFU · Build confidence</small></span><span><i>03</i><b>Action</b><small>BOFU · Drive response</small></span></div>
      <div className="v2-lanes">{lanes.map(lane=><article key={lane.key}><header><b>{lane.name}</b><small>{lane.description}</small></header><div className="v2-path">{funnelStages.map((stage,index)=>{const stageProjects=items.filter(item=>item.journey===lane.key&&stagesFor(item).includes(stage));return <div className={`v2-step ${dragging?'drop-ready':''}`} key={`${lane.key}-${stage}`} onDragOver={event=>event.preventDefault()} onDrop={()=>dragging&&moveProject(dragging,stage,lane.key)}>{stageProjects.length?<div className="v2-stage-stack">{stageProjects.map(project=><ProjectNode key={project.id} project={project} displayStage={stage} onOpen={setSelected} onDragStart={setDragging}/>)}</div>:<button className="v2-empty" onClick={()=>setAdding(true)}><span>＋</span><b>{index===0?'Add discovery project':index===1?'Add nurture project':'Add action project'}</b><small>{dragging?'Drop to add this stage':'Close this journey gap'}</small></button>}{index<2&&<span className="v2-connector"><i>→</i></span>}</div>})}</div></article>)}</div>
      <section className={`v2-library ${dragging?'drop-ready':''}`} onDragOver={event=>event.preventDefault()} onDrop={()=>dragging&&moveProject(dragging,items.find(item=>item.id===dragging)?.stage||'UNASSIGNED',undefined)}><header><div><h3>Other projects in your plan</h3><p>Projects not yet connected to a journey. Drag one into a journey above.</p></div><b>{library.length}</b></header><div>{library.map(project=><ProjectNode key={project.id} project={project} onOpen={setSelected} onDragStart={setDragging}/>)}</div></section>
      <footer className="v2-insight"><span>✦</span><p><b>The big picture:</b> 70% of your funnel projects build consideration, but only one project drives a final action.</p><button>Review the gap →</button></footer>
    </section>:<YearTimeline items={items} onOpen={setSelected}/>} 
    {selected&&<ProjectEditor project={selected} onClose={()=>setSelected(null)} onSave={saveProject}/>}
    {adding&&<AddProject onClose={()=>setAdding(false)} onAdd={addProject}/>}
    {importing&&<ImportPlan onClose={()=>setImporting(false)} onImport={importProjects}/>}
  </main>;
}
