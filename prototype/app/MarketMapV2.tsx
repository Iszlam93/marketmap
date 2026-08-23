'use client';

import { useState } from 'react';

type Stage = 'TOFU' | 'MOFU' | 'BOFU';
type Journey = 'technical' | 'education' | 'services';
export type Project = {
  id: string;
  name: string;
  type: string;
  stage: Stage;
  dates: string[];
  objective: string;
  activities: string[];
  link?: string;
  journey?: Journey;
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

const lanes: { key:Journey; name:string; description:string }[] = [
  { key:'technical', name:'Technical services', description:'Prospecting to partner recruitment' },
  { key:'education', name:'Education & events', description:'Turn learning into qualified interest' },
  { key:'services', name:'Marketing services', description:'Always-on promotion and delivery' },
];

function Logo(){ return <span className="v2-logo" aria-hidden="true"><i/><i/><i/></span>; }

function ProjectNode({ project, onOpen }: { project: Project; onOpen: (project:Project)=>void }){
  const dateLabel = project.dates.length ? new Date(`${project.dates[0]}T12:00:00`).toLocaleDateString('en-GB',{day:'numeric',month:'short'}) : 'Date needed';
  return <button className={`v2-project node-${project.stage.toLowerCase()}`} onClick={()=>onOpen(project)}>
    <span className="v2-node-top"><i className={`category-${project.type.toLowerCase().replaceAll(' ','-')}`}><b aria-hidden="true"/>{project.type}</i><em aria-label={project.link ? 'Project link added' : 'No project link'}>{project.link ? '↗' : '＋'}</em></span>
    <strong>{project.name}</strong>
    <span className="v2-node-meta"><b>{dateLabel}</b><small>Open project</small></span>
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
  const create=()=>{ if(!name.trim())return; onAdd({id:`new-${Date.now()}`,name:name.trim(),type,stage,journey:journey||undefined,dates:date?[date]:[],objective:'New marketing project—add the objective in the next step.',activities:[],link}); };
  return <div className="v2-scrim" onClick={onClose}><section className="v2-add-modal" role="dialog" aria-modal="true" aria-label="Add marketing project" onClick={event=>event.stopPropagation()}><header><div><p className="v2-kicker">New marketing project</p><h2>Add it once. See it everywhere.</h2></div><button onClick={onClose} aria-label="Close">×</button></header><label>Project name<input autoFocus value={name} onChange={event=>setName(event.target.value)} placeholder="e.g. Partner recruitment campaign"/></label><div className="v2-form-grid"><label>Category<select value={type} onChange={event=>setType(event.target.value)}><option>Campaign</option><option>Event</option><option>Webinar</option><option>Program</option><option>Content</option><option>Research</option></select></label><label>Funnel stage<select value={stage} onChange={event=>setStage(event.target.value as Stage)}><option value="TOFU">TOFU · Awareness</option><option value="MOFU">MOFU · Consideration</option><option value="BOFU">BOFU · Action</option></select></label><label>Journey<select value={journey} onChange={event=>setJourney(event.target.value as Journey|'')}><option value="">Other projects</option>{lanes.map(lane=><option value={lane.key} key={lane.key}>{lane.name}</option>)}</select></label><label>First active date<input type="date" value={date} onChange={event=>setDate(event.target.value)}/></label></div><label>Project link <small>Optional</small><input value={link} onChange={event=>setLink(event.target.value)} placeholder="https://..."/></label><footer><button onClick={onClose}>Cancel</button><button className="v2-create" onClick={create}>Create project →</button></footer></section></div>;
}

export default function MarketMapV2(){
  const [items,setItems]=useState(projects);
  const [selected,setSelected]=useState<Project|null>(null);
  const [view,setView]=useState<'flow'|'year'>('flow');
  const [adding,setAdding]=useState(false);
  const saveLink=(link:string)=>{ if(!selected)return; setItems(current=>current.map(item=>item.id===selected.id?{...item,link}:item)); setSelected(current=>current?{...current,link}:current); };
  const placeProject=(stage:Stage,journey:Journey|undefined)=>{if(!selected)return;setItems(current=>current.map(item=>item.id===selected.id?{...item,stage,journey}:item));setSelected(current=>current?{...current,stage,journey}:current)};
  const library=items.filter(item=>!item.journey);
  const addProject=(project:Project)=>{ setItems(current=>[...current,project]); setAdding(false); setSelected(project); };
  return <main className="v2-shell">
    <header className="v2-topbar"><a href="#" className="v2-brand"><Logo/><b>MarketMap</b></a><div className="v2-plan"><span>IS</span><p><b>ISV Marketing</b><small>2025 plan</small></p></div><button className="v2-avatar">IE</button></header>
    <section className="v2-heading"><div><p className="v2-kicker">Demand plan · 2025</p><h1>{view==='flow'?'See how the work connects.':'See when the work happens.'}</h1><p>{view==='flow'?'Follow every project from discovery to action—and open the card when you need the working details.':'Plan at week level, spot busy periods, and find projects that still need dates.'}</p></div><div><nav aria-label="Plan views"><button className={view==='flow'?'active':''} onClick={()=>setView('flow')}>Flow map</button><button className={view==='year'?'active':''} onClick={()=>setView('year')}>Year map</button></nav><button className="v2-add" onClick={()=>setAdding(true)}>＋ Add project</button></div></section>
    {view==='flow'?<section className="v2-canvas">
      <header className="v2-canvas-head"><div><h2>Demand journeys</h2><p>3 journeys · 10 projects · 5 missing connections</p></div><div className="v2-category-key"><span><i className="cat-campaign"/>Campaign</span><span><i className="cat-event"/>Event</span><span><i className="cat-webinar"/>Webinar</span><span><i className="cat-program"/>Program</span><span className="gap-key"><i/>Suggested gap</span></div></header>
      <div className="v2-stages"><span><i>01</i><b>Awareness</b><small>TOFU · Create interest</small></span><span><i>02</i><b>Consideration</b><small>MOFU · Build confidence</small></span><span><i>03</i><b>Action</b><small>BOFU · Drive response</small></span></div>
      <div className="v2-lanes">{lanes.map(lane=><article key={lane.key}><header><b>{lane.name}</b><small>{lane.description}</small></header><div className="v2-path">{(['TOFU','MOFU','BOFU'] as Stage[]).map((stage,index)=>{const stageProjects=items.filter(item=>item.journey===lane.key&&item.stage===stage);return <div className="v2-step" key={`${lane.key}-${stage}`}>{stageProjects.length?<div className="v2-stage-stack">{stageProjects.map(project=><ProjectNode key={project.id} project={project} onOpen={setSelected}/>)}</div>:<button className="v2-empty" onClick={()=>setAdding(true)}><span>＋</span><b>{index===0?'Add discovery project':index===1?'Add nurture project':'Add action project'}</b><small>Close this journey gap</small></button>}{index<2&&<span className="v2-connector"><i>→</i></span>}</div>})}</div></article>)}</div>
      <section className="v2-library"><header><div><h3>Other projects in your plan</h3><p>Projects not yet connected to a journey.</p></div><b>{library.length}</b></header><div>{library.map(project=><ProjectNode key={project.id} project={project} onOpen={setSelected}/>)}</div></section>
      <footer className="v2-insight"><span>✦</span><p><b>The big picture:</b> 70% of your funnel projects build consideration, but only one project drives a final action.</p><button>Review the gap →</button></footer>
    </section>:<YearTimeline items={items} onOpen={setSelected}/>} 
    {selected&&<ProjectDrawer project={selected} onClose={()=>setSelected(null)} onSaveLink={saveLink} onPlace={placeProject}/>} 
    {adding&&<AddProject onClose={()=>setAdding(false)} onAdd={addProject}/>} 
  </main>;
}
