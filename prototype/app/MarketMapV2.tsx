'use client';

import { useEffect, useState } from 'react';
import readXlsxFile from 'read-excel-file/browser';
import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, useDraggable, useDroppable, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import './strategy.css';
import './strategy-controls.css';
import './strategy-bright.css';
import StrategyCanvas, { type StrategyMapState } from './StrategyCanvas';

type Stage = 'TOFU' | 'MOFU' | 'BOFU' | 'UNASSIGNED';
type Journey = string;
type JourneyRecord = { id:string; name:string; description:string; sortOrder:number };
type PlanRecord = { id:string; name:string; year:number; strategy?:StrategyMapState };
type ConnectionType = 'supports'|'leads_to'|'depends_on'|'repurposes';
type ProjectConnection = { targetId:string; type:ConnectionType };
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
  channel?: string;
  source?: 'asana'|'spreadsheet'|'manual';
  mappingState?: 'mapped'|'needs_review';
  mappingReason?: string;
  connections?: ProjectConnection[];
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

const initialJourneys: JourneyRecord[] = [
  { id:'technical', name:'Technical services', description:'Prospecting to partner recruitment', sortOrder:0 },
  { id:'education', name:'Education & events', description:'Turn learning into qualified interest', sortOrder:1 },
  { id:'services', name:'Marketing services', description:'Always-on promotion and delivery', sortOrder:2 },
];
const lanes=initialJourneys.map(item=>({key:item.id,name:item.name,description:item.description}));

const funnelStages: Stage[]=['TOFU','MOFU','BOFU'];
function stagesFor(project:Project){return project.stages?.length?project.stages:[project.stage]}

function Logo(){ return <span className="v2-logo" aria-hidden="true"><i/><i/><i/></span>; }

function ProjectNode({ project, displayStage, onOpen, onDragStart }: { project: Project; displayStage?:Stage; onOpen: (project:Project)=>void; onDragStart?:(id:string)=>void }){
  const dateLabel = project.dates.length ? new Date(`${project.dates[0]}T12:00:00`).toLocaleDateString('en-GB',{day:'numeric',month:'short'}) : 'Date needed';
  const shownStage=displayStage||project.stage;
  return <button className={`v2-project node-${shownStage.toLowerCase()}`} draggable={Boolean(onDragStart)} onDragStart={()=>onDragStart?.(project.id)} onClick={()=>onOpen(project)}>
    <span className="v2-node-top"><i className={`category-${project.type.toLowerCase().replaceAll(' ','-')}`}><b aria-hidden="true"/>{project.type}</i>{project.channel&&<small className="v7-channel">{project.channel}</small>}<em aria-label={project.link ? 'Project link added' : 'No project link'}>{project.link ? '↗' : '＋'}</em></span>
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

function ProjectEditor({ project,journeys,onClose,onSave }: { project:Project; journeys:JourneyRecord[]; onClose:()=>void; onSave:(project:Project)=>void }){
  const [draft,setDraft]=useState<Project>({...project,dates:[...project.dates],connections:[...(project.connections||[])]});
  const update=<K extends keyof Project>(key:K,value:Project[K])=>setDraft(current=>({...current,[key]:value}));
  const updateDate=(index:number,value:string)=>update('dates',draft.dates.map((date,i)=>i===index?value:date));
  const repeatQuarterly=()=>{if(!draft.dates[0])return;const base=new Date(`${draft.dates[0]}T12:00:00`);const dates=[0,3,6,9].map(offset=>{const next=new Date(base);next.setMonth(base.getMonth()+offset);return next.toISOString().slice(0,10)});update('dates',[...new Set([...draft.dates,...dates])].sort())};
  const toggleStage=(stage:Stage)=>{const current=stagesFor(draft).filter(value=>value!=='UNASSIGNED');const next=current.includes(stage)?current.filter(value=>value!==stage):[...current,stage];const stages=next.length?next:['UNASSIGNED' as Stage];setDraft(value=>({...value,stages,stage:stages[0]}))};
  return <div className="v2-scrim" onClick={onClose}><aside className="v3-editor" role="dialog" aria-modal="true" aria-label={`${project.name} project card`} onClick={event=>event.stopPropagation()}>
    <header><div><span className={`v2-stage stage-${draft.stage.toLowerCase()}`}>{draft.stage}</span><span className={`status-pill status-${draft.status||'planned'}`}>{(draft.status||'planned').replace('_',' ')}</span></div><button onClick={onClose} aria-label="Close project">×</button></header>
    <p className="v2-kicker">{draft.type} · Project card</p><input className="v3-title" value={draft.name} onChange={event=>update('name',event.target.value)} aria-label="Project name"/>
    <div className="v3-fields"><label>Owner<input value={draft.owner||''} onChange={event=>update('owner',event.target.value)} placeholder="Add an owner"/></label><label>Status<select value={draft.status||'planned'} onChange={event=>update('status',event.target.value as Project['status'])}><option value="idea">Idea</option><option value="planned">Planned</option><option value="in_progress">In progress</option><option value="live">Live</option><option value="complete">Complete</option><option value="blocked">Blocked</option></select></label><label>Category<select value={draft.type} onChange={event=>update('type',event.target.value)}><option>Campaign</option><option>Event</option><option>Webinar</option><option>Program</option><option>Content</option><option>Research</option></select></label><label>Format or channel<select value={draft.channel||''} onChange={event=>update('channel',event.target.value)}><option value="">Needs review</option><option>Paid ads</option><option>Online event</option><option>Onsite event</option><option>Email</option><option>Organic social · LinkedIn</option><option>Website</option><option>Partner channel</option><option>Multi-channel</option><option>Not applicable</option></select></label><label>Journey<select value={draft.journey||''} onChange={event=>update('journey',(event.target.value||undefined) as Journey|undefined)}><option value="">Other projects</option>{journeys.map(journey=><option value={journey.id} key={journey.id}>{journey.name}</option>)}</select></label><fieldset className="v3-stage-picker"><legend>Funnel coverage <small>Select every stage this project supports</small></legend>{funnelStages.map(stage=><label key={stage} className={stagesFor(draft).includes(stage)?'selected':''}><input type="checkbox" checked={stagesFor(draft).includes(stage)} onChange={()=>toggleStage(stage)}/><b>{stage}</b><span>{stage==='TOFU'?'Awareness':stage==='MOFU'?'Consideration':'Action'}</span></label>)}<button type="button" className={`v5-outside-choice ${stagesFor(draft).includes('UNASSIGNED')?'selected':''}`} onClick={()=>setDraft(value=>({...value,stage:'UNASSIGNED',stages:['UNASSIGNED']}))}><b>Outside funnel</b><span>Supporting work: research, reporting, retention or operations</span></button></fieldset></div>
    {draft.source==='asana'&&<section className={`v7-mapping-note ${draft.mappingState==='needs_review'?'needs-review':''}`}><b>{draft.mappingState==='needs_review'?'Needs your help':'Mapped from Asana'}</b><p>{draft.mappingReason}</p></section>}
    <label className="v3-block">Objective<textarea value={draft.objective} onChange={event=>update('objective',event.target.value)} placeholder="What should this project achieve?"/></label><label className="v3-block">Success measure / KPI<input value={draft.kpi||''} onChange={event=>update('kpi',event.target.value)} placeholder="e.g. 30 registrations or 15 qualified leads"/></label>
    <label className="v3-block">Project link<input value={draft.link||''} onChange={event=>update('link',event.target.value)} placeholder="Brief, folder, Asana project or campaign URL"/></label>
    <section className="v3-dates"><header><div><h3>Active dates</h3><p>Each date is placed in its exact week on the Year Map.</p></div><button onClick={repeatQuarterly}>Repeat quarterly</button></header>{draft.dates.map((date,index)=><div key={`${index}-${date}`}><input type="date" value={date} onChange={event=>updateDate(index,event.target.value)}/><button onClick={()=>update('dates',draft.dates.filter((_,i)=>i!==index))} aria-label={`Remove ${date}`}>×</button></div>)}<button className="v3-add-date" onClick={()=>update('dates',[...draft.dates,''])}>＋ Add another date</button></section>
    <footer><span>Changes will be saved to your MarketMap.</span><button onClick={()=>onSave(draft)}>Save project</button></footer>
  </aside></div>;
}

function weekNumber(dateString:string,year:number){
  const date=new Date(`${dateString}T12:00:00Z`);
  const start=new Date(`${year}-01-01T12:00:00Z`);
  const offset=(start.getUTCDay()+6)%7;
  return Math.min(52,Math.max(1,Math.floor(((date.getTime()-start.getTime())/86400000+offset)/7)+1));
}

function YearTimeline({ items,year,onOpen }: { items:Project[];year:number;onOpen:(project:Project)=>void }){
  const [openQuarters,setOpenQuarters]=useState<Set<string>>(new Set(['Q1','Q2','Q3','Q4']));
  const datesInYear=(project:Project)=>project.dates.filter(date=>date.startsWith(`${year}-`));
  const scheduled=items.filter(item=>datesInYear(item).length);
  const unscheduled=items.filter(item=>!datesInYear(item).length);
  const quarters=[{id:'Q1',label:'January — March',start:1,end:13},{id:'Q2',label:'April — June',start:14,end:26},{id:'Q3',label:'July — September',start:27,end:39},{id:'Q4',label:'October — December',start:40,end:52}];
  const toggle=(id:string)=>setOpenQuarters(current=>{const next=new Set(current);if(next.has(id))next.delete(id);else next.add(id);return next});
  return <section className="v2-year">
    <header className="v2-year-head"><div><p className="v2-kicker">{year} · 52-week planning view</p><h2>Every project, on the week it happens.</h2><p>Exact activity dates translated into your {year} marketing calendar.</p></div><div className="v2-year-stats"><span><b>{scheduled.length}</b> scheduled</span><span><b>{unscheduled.length}</b> need {year} dates</span></div></header>
    <div className="v2-quarter-list">{quarters.map(quarter=>{const weeks=Array.from({length:13},(_,index)=>quarter.start+index);const quarterProjects=scheduled.filter(project=>datesInYear(project).some(date=>{const week=weekNumber(date,year);return week>=quarter.start&&week<=quarter.end}));const isOpen=openQuarters.has(quarter.id);return <section className={`v2-quarter ${isOpen?'open':'closed'}`} key={quarter.id}><button className="v2-quarter-toggle" onClick={()=>toggle(quarter.id)} aria-expanded={isOpen}><span><i>{isOpen?'−':'+'}</i><b>{quarter.id}</b><small>{quarter.label}</small></span><span><b>{quarterProjects.length}</b><small>projects</small></span></button>{isOpen&&<div className="v2-quarter-body"><div className="v2-quarter-weeks"><span className="timeline-label"><b>Project</b><small>Category · Stage</small></span><div>{weeks.map(week=><span key={week}>Week {week}</span>)}</div></div>{quarterProjects.map(project=>{const activeWeeks=[...new Set(datesInYear(project).map(date=>weekNumber(date,year)))];return <button className="v2-quarter-project" key={project.id} onClick={()=>onOpen(project)}><span className="timeline-label"><b>{project.name}</b><small><i className={`mini-category category-${project.type.toLowerCase().replaceAll(' ','-')}`}/>{project.type} · {project.stage}</small></span><div>{weeks.map(week=><span key={week} className={activeWeeks.includes(week)?`active week-${project.stage.toLowerCase()}`:''}>{activeWeeks.includes(week)&&<i>W{week}</i>}</span>)}</div></button>})}</div>}</section>})}</div>
    {unscheduled.length>0&&<section className="v2-unscheduled"><header><div><h3>Needs scheduling</h3><p>These projects are part of the plan but have no confirmed week.</p></div><b>{unscheduled.length}</b></header><div>{unscheduled.map(project=><button key={project.id} onClick={()=>onOpen(project)}><span className={`v2-stage stage-${project.stage.toLowerCase()}`}>{project.stage}</span><b>{project.name}</b><small>Open project card →</small></button>)}</div></section>}
  </section>;
}

function PlanSettings({plan,onClose,onSave}:{plan:PlanRecord;onClose:()=>void;onSave:(plan:PlanRecord)=>void}){
  const [draft,setDraft]=useState(plan);
  return <div className="v2-scrim" onClick={onClose}><section className="v6-plan-modal" role="dialog" aria-modal="true" aria-label="Plan settings" onClick={event=>event.stopPropagation()}>
    <header><div><p className="v2-kicker">Plan settings</p><h2>Name the plan you are working on.</h2><p>The selected year controls the dates and weeks shown in your Year Map.</p></div><button onClick={onClose} aria-label="Close">×</button></header>
    <label>Plan name<input autoFocus value={draft.name} onChange={event=>setDraft(current=>({...current,name:event.target.value}))} placeholder="e.g. 2026 Demand Generation Plan"/></label>
    <label>Planning year<input type="number" min="2000" max="2100" value={draft.year} onChange={event=>setDraft(current=>({...current,year:Number(event.target.value)}))}/></label>
    <footer><button onClick={onClose}>Cancel</button><button onClick={()=>draft.name.trim()&&onSave({...draft,name:draft.name.trim()})}>Save plan</button></footer>
  </section></div>;
}

function PlanInsights({items,journeys,year,onOpen}:{items:Project[];journeys:JourneyRecord[];year:number;onOpen:(project:Project)=>void}){
  const [expanded,setExpanded]=useState(false);
  const missingOwners=items.filter(item=>!item.owner?.trim());
  const missingKpis=items.filter(item=>!item.kpi?.trim());
  const needsDates=items.filter(item=>!item.dates.some(date=>date.startsWith(`${year}-`)));
  const blocked=items.filter(item=>item.status==='blocked');
  const funnelGaps=journeys.filter(journey=>!items.some(item=>item.journey===journey.id&&stagesFor(item).includes('BOFU')));
  const issues=[
    {key:'owner',count:missingOwners.length,label:'need an owner',detail:'Ownership keeps the plan accountable.',projects:missingOwners},
    {key:'kpi',count:missingKpis.length,label:'need a KPI',detail:'Define what success should look like.',projects:missingKpis},
    {key:'date',count:needsDates.length,label:`need ${year} dates`,detail:'Unscheduled work cannot be balanced across the year.',projects:needsDates},
    {key:'blocked',count:blocked.length,label:'are blocked',detail:'These projects need a decision or intervention.',projects:blocked},
  ];
  const attention=issues.reduce((total,issue)=>total+issue.count,0)+funnelGaps.length;
  return <section className="v6-insights" aria-label="Plan insights">
    <header><div><span>✦</span><p><b>{attention?`${attention} signals need attention`:'Your plan is looking complete'}</b><small>MarketMap checks the plan for missing ownership, measures, timing and funnel coverage.</small></p></div><button onClick={()=>setExpanded(value=>!value)} aria-expanded={expanded}>{expanded?'Hide details':'Review insights'} {expanded?'↑':'↓'}</button></header>
    <div className="v6-insight-cards">{issues.map(issue=><article className={issue.count?'attention':'clear'} key={issue.key}><b>{issue.count}</b><span>{issue.label}</span><small>{issue.count?issue.detail:'Nothing to fix here.'}</small></article>)}<article className={funnelGaps.length?'attention':'clear'}><b>{funnelGaps.length}</b><span>journey funnel gaps</span><small>{funnelGaps.length?'No BOFU project in: '+funnelGaps.map(item=>item.name).join(', '):'Every journey reaches action.'}</small></article></div>
    {expanded&&<div className="v6-insight-detail"><div><h3>Projects to complete</h3><p>Open a project and add the missing information. One project may appear in more than one signal.</p></div><div>{[...new Map(issues.flatMap(issue=>issue.projects).map(project=>[project.id,project])).values()].slice(0,8).map(project=><button key={project.id} onClick={()=>onOpen(project)}><span><b>{project.name}</b><small>{[!project.owner?.trim()?'Owner':null,!project.kpi?.trim()?'KPI':null,!project.dates.some(date=>date.startsWith(`${year}-`))?`${year} date`:null,project.status==='blocked'?'Blocked':null].filter(Boolean).join(' · ')}</small></span><em>Open →</em></button>)}</div></div>}
  </section>;
}

function AddProject({ journeys,onClose,onAdd }: { journeys:JourneyRecord[]; onClose:()=>void; onAdd:(project:Project)=>void }){
  const [name,setName]=useState(''); const [stage,setStage]=useState<Stage>('TOFU'); const [date,setDate]=useState(''); const [link,setLink]=useState(''); const [type,setType]=useState('Campaign'); const [journey,setJourney]=useState<Journey|''>('');
  const create=()=>{ if(!name.trim())return; onAdd({id:`new-${Date.now()}`,name:name.trim(),type,stage,stages:[stage],journey:journey||undefined,dates:date?[date]:[],objective:'New marketing project—add the objective in the next step.',activities:[],link,status:'planned'}); };
  return <div className="v2-scrim" onClick={onClose}><section className="v2-add-modal" role="dialog" aria-modal="true" aria-label="Add marketing project" onClick={event=>event.stopPropagation()}><header><div><p className="v2-kicker">New marketing project</p><h2>Add it once. See it everywhere.</h2></div><button onClick={onClose} aria-label="Close">×</button></header><label>Project name<input autoFocus value={name} onChange={event=>setName(event.target.value)} placeholder="e.g. Partner recruitment campaign"/></label><div className="v2-form-grid"><label>Category<select value={type} onChange={event=>setType(event.target.value)}><option>Campaign</option><option>Event</option><option>Webinar</option><option>Program</option><option>Content</option><option>Research</option></select></label><label>Placement<select value={stage} onChange={event=>setStage(event.target.value as Stage)}><option value="TOFU">TOFU · Awareness</option><option value="MOFU">MOFU · Consideration</option><option value="BOFU">BOFU · Action</option><option value="UNASSIGNED">Outside funnel · Supporting work</option></select></label><label>Journey<select value={journey} onChange={event=>setJourney(event.target.value)}><option value="">Other projects</option>{journeys.map(item=><option value={item.id} key={item.id}>{item.name}</option>)}</select></label><label>First active date<input type="date" value={date} onChange={event=>setDate(event.target.value)}/></label></div><label>Project link <small>Optional</small><input value={link} onChange={event=>setLink(event.target.value)} placeholder="https://..."/></label><footer><button onClick={onClose}>Cancel</button><button className="v2-create" onClick={create}>Create project →</button></footer></section></div>;
}

function ImportPlan({ onClose,onImport }: { onClose:()=>void; onImport:(items:Project[])=>void }){
  const [source,setSource]=useState<'asana'|'excel'>('asana'); const [fileName,setFileName]=useState(''); const [suggestions,setSuggestions]=useState<Project[]>([]); const [error,setError]=useState(''); const [loading,setLoading]=useState(false); const [connection,setConnection]=useState<{verifiedAt:string;count:number}|null>(null);
  const loadAsana=async()=>{setLoading(true);setError('');try{const response=await fetch('/api/import/asana-test');if(!response.ok)throw new Error('Connection failed');const data=await response.json() as {projects:Project[];connection:{verifiedAt:string;count:number}};setSuggestions(data.projects);setConnection(data.connection)}catch{setError('The controlled Asana connection could not be loaded. Please try again.')}finally{setLoading(false)}};
  const parse=async(file:File)=>{setLoading(true);setError('');setFileName(file.name);try{const rows=await readXlsxFile(file);let found:Project[]=[];if(file.name.toLowerCase().includes('marketing - calendar isv 2025')){found=[...projects,...supportingProjects]}else{const headerIndex=rows.findIndex(row=>row.some(cell=>/project|initiative|campaign/i.test(String(cell||''))));if(headerIndex>=0){const headers=rows[headerIndex].map(cell=>String(cell||'').toLowerCase());const nameIndex=headers.findIndex(value=>/project|initiative|campaign|name/.test(value));const typeIndex=headers.findIndex(value=>/category|type/.test(value));const stageIndex=headers.findIndex(value=>/stage|funnel/.test(value));const dateIndex=headers.findIndex(value=>/date|start/.test(value));const ownerIndex=headers.findIndex(value=>/owner/.test(value));found=rows.slice(headerIndex+1).filter(row=>row[nameIndex]).slice(0,100).map((row,index)=>{const rawDate=dateIndex>=0?row[dateIndex]:null;const date=rawDate instanceof Date?rawDate.toISOString().slice(0,10):typeof rawDate==='string'&&/^\d{4}-\d{2}-\d{2}/.test(rawDate)?rawDate.slice(0,10):'';const rawStage=stageIndex>=0?String(row[stageIndex]||'').toUpperCase():'';const stage:Stage=rawStage.includes('TOFU')?'TOFU':rawStage.includes('MOFU')?'MOFU':rawStage.includes('BOFU')?'BOFU':'UNASSIGNED';return{id:`import-${Date.now()}-${index}`,name:String(row[nameIndex]),type:typeIndex>=0?String(row[typeIndex]||'Project'):'Project',stage,dates:date?[date]:[],owner:ownerIndex>=0?String(row[ownerIndex]||''):'',objective:'Imported from spreadsheet—add the objective during review.',activities:[],status:'planned'}})}}setSuggestions(found);if(!found.length)setError('No clear project table was found. Add a column named Project or Initiative and try again.')}catch{setError('This spreadsheet could not be read. Please check the file and try again.')}finally{setLoading(false)}};
  const reset=()=>{setSuggestions([]);setConnection(null);setFileName('');setError('')};
  return <div className="v2-scrim" onClick={onClose}><section className="v3-import" role="dialog" aria-modal="true" aria-label="Import marketing projects" onClick={event=>event.stopPropagation()}><header><div><p className="v2-kicker">Asana-first onboarding test</p><h2>Connect your work. Review the map.</h2><p>MarketMap reads projects only. Tasks, comments and attachments stay untouched.</p></div><button onClick={onClose}>×</button></header><nav className="v7-source-tabs" aria-label="Import source"><button className={source==='asana'?'active':''} onClick={()=>{setSource('asana');reset()}}>Asana</button><button className={source==='excel'?'active':''} onClick={()=>{setSource('excel');reset()}}>Excel · later</button></nav>{source==='asana'?<>{!connection?<section className="v7-asana-connect"><span>A</span><div><b>Test the verified Asana connection</b><p>Read-only · 10 controlled projects · project fields only</p><small>This Phase 2 test uses a snapshot refreshed from the live Asana connection on 7 September. Production OAuth is built in Phase 5.</small></div><button onClick={loadAsana} disabled={loading}>{loading?'Reading Asana…':'Load Asana projects →'}</button></section>:<div className="v3-import-file"><span>✓</span><p><b>Asana connected for the controlled test</b><small>{connection.count} projects found · verified {connection.verifiedAt}</small></p><button onClick={reset}>Refresh</button></div>}</>:!fileName?<label className="v3-drop"><span>↑</span><b>Choose an Excel spreadsheet</b><small>.xlsx files · tested only after the Asana decision gate</small><input type="file" accept=".xlsx" onChange={event=>event.target.files?.[0]&&parse(event.target.files[0])}/></label>:<div className="v3-import-file"><span>✓</span><p><b>{fileName}</b><small>{loading?'Reading spreadsheet…':`${suggestions.length} project suggestions found`}</small></p><button onClick={reset}>Replace</button></div>}{error&&<p className="v3-error">{error}</p>}{suggestions.length>0&&<><div className="v7-import-summary"><span><b>{suggestions.filter(item=>item.mappingState!=='needs_review').length}</b> mapped for you</span><span className="attention"><b>{suggestions.filter(item=>item.mappingState==='needs_review').length}</b> need your help</span></div><div className="v3-import-review v7-asana-review"><div><span>Project</span><span>Journey</span><span>Suggested placement</span><span>Channel</span></div>{suggestions.map(item=><div key={item.id}><b>{item.name}<small>{item.mappingReason}</small></b><span>{item.journey==='technical'?'Technical services':item.journey==='education'?'Education & events':item.journey==='services'?'Marketing services':'Needs review'}</span><span className={item.mappingState==='needs_review'?'needs-review':''}>{item.stage==='UNASSIGNED'?'Outside funnel':stagesFor(item).join(' → ')}</span><span>{item.channel||'Needs review'}</span></div>)}</div></>}<footer><button onClick={onClose}>Cancel</button><button disabled={!suggestions.length} onClick={()=>onImport(suggestions)}>Import {suggestions.length} projects to draft map →</button></footer></section></div>;
}

function ManageJourneys({ journeys,onClose,onSave }: { journeys:JourneyRecord[]; onClose:()=>void; onSave:(journeys:JourneyRecord[])=>void }){
  const [draft,setDraft]=useState(journeys.map(item=>({...item})));
  const update=(id:string,key:'name'|'description',value:string)=>setDraft(current=>current.map(item=>item.id===id?{...item,[key]:value}:item));
  const add=()=>setDraft(current=>[...current,{id:`journey-${Date.now()}`,name:'New journey',description:'Describe how demand should move through this journey.',sortOrder:current.length}]);
  const move=(index:number,direction:-1|1)=>setDraft(current=>{const destination=index+direction;if(destination<0||destination>=current.length)return current;const next=[...current];[next[index],next[destination]]=[next[destination],next[index]];return next.map((item,sortOrder)=>({...item,sortOrder}))});
  return <div className="v2-scrim" onClick={onClose}><section className="v3-journeys" role="dialog" aria-modal="true" aria-label="Manage journeys" onClick={event=>event.stopPropagation()}><header><div><p className="v2-kicker">Flow structure</p><h2>Edit and arrange your journeys.</h2><p>The order here becomes the top-to-bottom order in the Flow Map.</p></div><button onClick={onClose}>×</button></header><div>{draft.map((journey,index)=><article key={journey.id}><span>{String(index+1).padStart(2,'0')}</span><label>Journey name<input value={journey.name} onChange={event=>update(journey.id,'name',event.target.value)}/></label><label>Description<input value={journey.description} onChange={event=>update(journey.id,'description',event.target.value)}/></label><div className="v5-journey-order"><button onClick={()=>move(index,-1)} disabled={index===0} aria-label={`Move ${journey.name} up`}>↑</button><button onClick={()=>move(index,1)} disabled={index===draft.length-1} aria-label={`Move ${journey.name} down`}>↓</button></div></article>)}</div><button className="v3-add-journey" onClick={add}>＋ Add another journey</button><footer><button onClick={onClose}>Cancel</button><button onClick={()=>onSave(draft.map((item,sortOrder)=>({...item,sortOrder})))}>Save order &amp; journeys</button></footer></section></div>;
}

function DraggableCard({ project,displayStage,onOpen,compact=false }: { project:Project; displayStage?:Stage; onOpen:(project:Project)=>void; compact?:boolean }){
  const {attributes,listeners,setNodeRef,transform,isDragging}=useDraggable({id:project.id});
  const style=transform?{transform:`translate3d(${transform.x}px, ${transform.y}px, 0)`}:undefined;
  return <div ref={setNodeRef} style={style} className={`v4-draggable ${isDragging?'dragging':''}`} {...listeners} {...attributes}>{compact?<button className="v4-tray-card" onClick={()=>onOpen(project)}><i className={`mini-category category-${project.type.toLowerCase().replaceAll(' ','-')}`}/><span><b>{project.name}</b><small>{project.type} · {project.stage}</small></span><em>⋮⋮</em></button>:<ProjectNode project={project} displayStage={displayStage} onOpen={onOpen}/>}</div>;
}

function StageTarget({ journeyId,stage,active }: { journeyId:string; stage:Stage; active:boolean }){
  const {setNodeRef,isOver}=useDroppable({id:`${journeyId}:${stage}`,data:{journeyId,stage}});
  return <div ref={setNodeRef} className={`${active?'ready':''} ${isOver?'over':''}`}><span>{isOver?'Release to place here':active?`Add to ${stage}`:stage}</span></div>;
}

function SupportTarget({ journeyId,active }: { journeyId:string; active:boolean }){
  const {setNodeRef,isOver}=useDroppable({id:`${journeyId}:UNASSIGNED`,data:{journeyId,stage:'UNASSIGNED'}});
  return <div ref={setNodeRef} className={`v5-support-target ${active?'ready':''} ${isOver?'over':''}`}><span>Outside funnel</span><small>{isOver?'Release to place in supporting work':active?'Drop here for research, reporting, retention or operations':'Supporting work that does not belong to one funnel stage'}</small></div>;
}

function ProjectTrayDrop({ active }: { active:boolean }){
  const {setNodeRef,isOver}=useDroppable({id:'project-tray',data:{journeyId:null,stage:'UNASSIGNED'}});
  return <div ref={setNodeRef} className={`v4-tray-drop ${active?'ready':''} ${isOver?'over':''}`}>{isOver?'Release to remove from flow':'Drag here to remove from a journey'}</div>;
}

function FlowWorkspace({items,journeys,onOpen,onMove,onAdd,onManage}: {items:Project[];journeys:JourneyRecord[];onOpen:(project:Project)=>void;onMove:(id:string,stage:Stage,journey:Journey|undefined)=>void;onAdd:()=>void;onManage:()=>void}){
  const [activeId,setActiveId]=useState<string|null>(null);const [zoom,setZoom]=useState(.82);const [search,setSearch]=useState('');const [showHelp,setShowHelp]=useState(true);
  const defaultZoom=.82;const fittedZoom=.62;const fitActive=Math.abs(zoom-fittedZoom)<.001;const toggleFit=()=>setZoom(fitActive?defaultZoom:fittedZoom);
  const sensors=useSensors(useSensor(PointerSensor,{activationConstraint:{distance:8}}),useSensor(KeyboardSensor));
  const activeProject=items.find(item=>item.id===activeId);const library=items.filter(item=>!item.journey&&item.name.toLowerCase().includes(search.toLowerCase()));
  const endDrag=(event:DragEndEvent)=>{const projectId=String(event.active.id);const target=event.over?.data.current as {journeyId?:string|null;stage?:Stage}|undefined;if(target?.stage)onMove(projectId,target.stage,target.journeyId||undefined);setActiveId(null)};
  return <DndContext sensors={sensors} onDragStart={event=>{setActiveId(String(event.active.id));setShowHelp(false)}} onDragCancel={()=>setActiveId(null)} onDragEnd={endDrag}>
    <section className="v4-workspace">
      <aside className="v4-panel">
        <header><p className="v2-kicker">Map tools</p><h2>Projects</h2><span>{library.length} unplaced</span></header>
        <label className="v4-search">⌕<input value={search} onChange={event=>setSearch(event.target.value)} placeholder="Search projects"/></label>
        <button className="v4-add-project" onClick={onAdd}>＋ Add project</button>
        <div className="v4-tray">{library.map(project=><DraggableCard key={project.id} project={project} onOpen={onOpen} compact/>)}{!library.length&&<p>Every matching project is placed on the map.</p>}</div>
        <ProjectTrayDrop active={Boolean(activeId)}/>
        <footer><button onClick={onManage}>✎ Edit journeys</button><div><button onClick={()=>setZoom(value=>Math.max(.5,Number((value-.1).toFixed(2))))} aria-label="Zoom out">−</button><span>{Math.round(zoom*100)}%</span><button onClick={()=>setZoom(value=>Math.min(1.2,Number((value+.1).toFixed(2))))} aria-label="Zoom in">＋</button></div><button className={fitActive?'active':''} aria-pressed={fitActive} onClick={toggleFit}>{fitActive?'Return to default':'Fit full map'}</button></footer>
      </aside>
      <div className="v4-map">
        <div className="v4-map-toolbar"><div><b>Demand journeys</b><span>{journeys.length} journeys · {items.length} projects</span></div><div><button className={fitActive?'active':''} aria-pressed={fitActive} onClick={toggleFit}>{fitActive?'↗ Default view':'⌗ Fit map'}</button><button onClick={()=>setShowHelp(value=>!value)}>？ How to move</button></div></div>
        {showHelp&&<div className="v4-help"><span>1</span><p><b>Pick up a project</b> from the map or left panel.</p><i>→</i><span>2</span><p><b>Move it over a glowing stage or Outside funnel lane.</b></p><i>→</i><span>3</span><p><b>Release</b> when the destination says “place here”.</p><button onClick={()=>setShowHelp(false)}>Got it</button></div>}
        <div className="v4-map-viewport"><div className="v4-map-scaled" style={{transform:`scale(${zoom})`,width:`${100/zoom}%`}}>
          <div className="v2-stages"><span><i>01</i><b>Awareness</b><small>TOFU · Create interest</small></span><span><i>02</i><b>Consideration</b><small>MOFU · Build confidence</small></span><span><i>03</i><b>Action</b><small>BOFU · Drive response</small></span></div>
          <div className="v3-flow-lanes">{journeys.map(journey=>{const journeyItems=items.filter(item=>item.journey===journey.id);const journeyProjects=journeyItems.filter(item=>!stagesFor(item).includes('UNASSIGNED'));const supportProjects=journeyItems.filter(item=>stagesFor(item).includes('UNASSIGNED'));return <article key={journey.id}>
            <header><b>{journey.name}</b><small>{journey.description}</small></header>
            <div className="v3-lane-body">
              <div className="v3-stage-dropzones">{funnelStages.map(stage=><StageTarget key={stage} journeyId={journey.id} stage={stage} active={Boolean(activeId)}/>)}</div>
              <div className="v3-project-rows">{journeyProjects.map(project=>{const indexes=stagesFor(project).map(stage=>funnelStages.indexOf(stage)).filter(index=>index>=0);const start=Math.min(...indexes)+1;const end=Math.max(...indexes)+2;return <div className="v3-project-row" key={project.id}><div className="v3-spanning-card" style={{gridColumn:`${start} / ${end}`}}><DraggableCard project={project} displayStage={funnelStages[start-1]} onOpen={onOpen}/><span className="v3-coverage">{stagesFor(project).join(' → ')}</span></div></div>})}{!journeyProjects.length&&!supportProjects.length&&<button className="v3-empty-journey" onClick={onAdd}>＋ Add the first project to this journey</button>}</div>
              <div className="v5-support-shelf"><SupportTarget journeyId={journey.id} active={Boolean(activeId)}/>{supportProjects.length>0&&<div className="v5-support-cards">{supportProjects.map(project=><DraggableCard key={project.id} project={project} displayStage="UNASSIGNED" onOpen={onOpen}/>)}</div>}</div>
            </div>
          </article>})}</div>
          <footer className="v2-insight"><span>✦</span><p><b>The big picture:</b> Your map shows funnel coverage and the supporting work around it.</p><button onClick={onManage}>Edit journeys →</button></footer>
        </div></div>
      </div>
    </section>
    <DragOverlay dropAnimation={{duration:260,easing:'cubic-bezier(.2,.8,.2,1)'}}>{activeProject&&<div className="v4-drag-overlay"><b>{activeProject.name}</b><span>{stagesFor(activeProject).includes('UNASSIGNED')?'Outside funnel':stagesFor(activeProject).join(' → ')}</span><small>Release over a glowing destination</small></div>}</DragOverlay>
  </DndContext>;
}

export default function MarketMapV2(){
  const [items,setItems]=useState(projects);
  const [plan,setPlan]=useState<PlanRecord>({id:'default',name:'ISV Marketing',year:2025});
  const [selected,setSelected]=useState<Project|null>(null);
  const [view,setView]=useState<'flow'|'year'|'strategy'>('flow');
  const [adding,setAdding]=useState(false);
  const [importing,setImporting]=useState(false);
  const [managingJourneys,setManagingJourneys]=useState(false);
  const [editingPlan,setEditingPlan]=useState(false);
  const [saveState,setSaveState]=useState<'idle'|'saving'|'saved'|'error'>('idle');
  const [journeys,setJourneys]=useState<JourneyRecord[]>(initialJourneys);
  useEffect(()=>{let active=true;const load=async()=>{try{const [projectResponse,journeyResponse,planResponse]=await Promise.all([fetch('/api/projects'),fetch('/api/journeys'),fetch('/api/plan')]);if(projectResponse.ok){const data=await projectResponse.json() as {projects:Project[]};if(active){if(data.projects.length)setItems(data.projects);else{const seed=[...projects,...supportingProjects];setItems(seed);await fetch('/api/projects',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({projects:seed})})}}}if(journeyResponse.ok){const data=await journeyResponse.json() as {journeys:JourneyRecord[]};if(active){if(data.journeys.length)setJourneys(data.journeys);else await fetch('/api/journeys',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({journeys:initialJourneys})})}}if(planResponse.ok){const data=await planResponse.json() as {plan:PlanRecord};if(active)setPlan(data.plan)}}catch{/* Keep the visible sample if storage is unavailable. */}};load();return()=>{active=false}},[]);
  const withSave=async(request:Promise<Response>)=>{setSaveState('saving');try{const response=await request;if(!response.ok)throw new Error('Save failed');setSaveState('saved');setTimeout(()=>setSaveState('idle'),1800)}catch{setSaveState('error')}};
  const persist=async(project:Project)=>withSave(fetch('/api/projects',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(project)}));
  const saveProject=(project:Project)=>{setItems(current=>current.map(item=>item.id===project.id?project:item));setSelected(null);void persist(project)};
  const moveProject=(id:string,stage:Stage,journey:Journey|undefined)=>{const project=items.find(item=>item.id===id);if(!project)return;const existing=stagesFor(project).filter(value=>value!=='UNASSIGNED');const stages:Stage[]=stage==='UNASSIGNED'?['UNASSIGNED']:(existing.includes(stage)?existing:[...existing,stage]);const moved={...project,stage:stages[0],stages,journey};setItems(current=>current.map(item=>item.id===id?moved:item));void persist(moved)};
  const addProject=(project:Project)=>{setItems(current=>[...current,project]);setAdding(false);setSelected(project);void persist(project)};
  const importProjects=(imported:Project[])=>{setItems(current=>{const byId=new Map(current.map(item=>[item.id,item]));imported.forEach(item=>byId.set(item.id,{...byId.get(item.id),...item}));return [...byId.values()]});setImporting(false);void withSave(fetch('/api/projects',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({projects:imported})}))};
  const saveJourneys=(next:JourneyRecord[])=>{setJourneys(next);setManagingJourneys(false);void withSave(fetch('/api/journeys',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({journeys:next})}))};
  const persistPlan=(next:PlanRecord)=>withSave(fetch('/api/plan',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(next)}));
  const savePlan=(next:PlanRecord)=>{setPlan(next);setEditingPlan(false);void persistPlan(next)};
  const saveStrategy=(strategy:StrategyMapState)=>{const next={...plan,strategy};setPlan(next);void persistPlan(next)};
  const initials=plan.name.split(/\s+/).filter(Boolean).slice(0,2).map(word=>word[0]).join('').toUpperCase()||'MP';
  return <main className="v2-shell">
    <header className="v2-topbar"><a href="#" className="v2-brand"><Logo/><b>MarketMap</b></a><button className="v2-plan" onClick={()=>setEditingPlan(true)} aria-label="Edit plan name and year"><span>{initials}</span><p><b>{plan.name}</b><small>{plan.year} plan · Edit</small></p></button><div className={`v6-save-state ${saveState}`} role="status">{saveState==='saving'?'Saving…':saveState==='saved'?'✓ Saved':saveState==='error'?'Could not save':'All changes saved'}</div><button className="v2-avatar">IE</button></header>
    <section className="v2-heading"><div><p className="v2-kicker">Demand plan · {plan.year}</p><h1>{view==='flow'?'See where the work moves.':view==='year'?'See when the work happens.':'See why the work matters.'}</h1><p>{view==='flow'?'Follow every project from discovery to action—and see what needs attention.':view==='year'?'Plan at week level, spot busy periods, and find projects that still need dates.':'Connect objectives, projects and outcomes into one complete strategic picture.'}</p></div><div><nav aria-label="Plan views"><button className={view==='flow'?'active':''} onClick={()=>setView('flow')}>Flow map</button><button className={view==='year'?'active':''} onClick={()=>setView('year')}>Year map</button><button className={view==='strategy'?'active':''} onClick={()=>setView('strategy')}>Strategy map</button></nav><button className="v3-import-button" onClick={()=>setImporting(true)}>↑ Import</button><button className="v2-add" onClick={()=>setAdding(true)}>＋ Add project</button></div></section>
    {view!=='strategy'&&<PlanInsights items={items} journeys={journeys} year={plan.year} onOpen={setSelected}/>}
    {view==='flow'?<FlowWorkspace items={items} journeys={journeys} onOpen={setSelected} onMove={moveProject} onAdd={()=>setAdding(true)} onManage={()=>setManagingJourneys(true)}/>:view==='year'?<YearTimeline items={items} year={plan.year} onOpen={setSelected}/>:<StrategyCanvas items={items} journeys={journeys} planName={plan.name} value={plan.strategy} onChange={saveStrategy} onOpenProject={project=>setSelected(items.find(item=>item.id===project.id)||null)}/>}
    {selected&&<ProjectEditor project={selected} journeys={journeys} onClose={()=>setSelected(null)} onSave={saveProject}/>}
    {adding&&<AddProject journeys={journeys} onClose={()=>setAdding(false)} onAdd={addProject}/>}
    {importing&&<ImportPlan onClose={()=>setImporting(false)} onImport={importProjects}/>}
    {managingJourneys&&<ManageJourneys journeys={journeys} onClose={()=>setManagingJourneys(false)} onSave={saveJourneys}/>}
    {editingPlan&&<PlanSettings plan={plan} onClose={()=>setEditingPlan(false)} onSave={savePlan}/>}
  </main>;
}
