'use client';

import { useState } from 'react';

type Stage = 'TOFU' | 'MOFU' | 'BOFU';
export type Project = {
  id: string;
  name: string;
  type: string;
  stage: Stage;
  dates: string[];
  objective: string;
  activities: string[];
  link?: string;
};

export const projects: Project[] = [
  { id:'002', name:'Technical services awareness', type:'Campaign', stage:'TOFU', dates:['2025-01-27','2025-02-17','2025-06-23','2025-07-07','2025-07-18','2025-07-24'], objective:'Build awareness and prospect interest in ISV development and technical services.', activities:['LinkedIn posts','Email content','Services landing page'] },
  { id:'004', name:'Let me introduce myself', type:'Campaign', stage:'TOFU', dates:[], objective:'Introduce the offer and create initial awareness.', activities:[] },
  { id:'006', name:'ISV Connect', type:'Event', stage:'MOFU', dates:['2025-04-23','2025-04-24'], objective:'Engage invited ISV prospects or partners through the ISV Connect event.', activities:['Invitee list','Invitation campaign'] },
  { id:'008', name:'Marketing services', type:'Program', stage:'MOFU', dates:['2025-01-20','2025-06-02'], objective:'Promote and deliver marketing services across channels.', activities:['Webinars','Portal content','Social posts','Email','Website'] },
  { id:'009', name:'Global reach with Companial + Seer 365', type:'Webinar', stage:'MOFU', dates:['2025-06-17'], objective:'Educate members on accelerating global reach.', activities:[] },
  { id:'010', name:'B2B Software Growth Academy', type:'Webinar', stage:'MOFU', dates:['2025-07-01'], objective:'Explain the value of the B2B Software Growth Academy.', activities:[] },
  { id:'011', name:'Strategy & action plan', type:'Webinar', stage:'MOFU', dates:['2025-09-15'], objective:'Help members develop and execute a strategy and action plan.', activities:[] },
  { id:'012', name:'LinkedIn strategy', type:'Webinar', stage:'MOFU', dates:['2025-10-20'], objective:'Educate members on working strategically with LinkedIn.', activities:[] },
  { id:'013', name:'Product management', type:'Webinar idea', stage:'MOFU', dates:[], objective:'Potential educational webinar about product management.', activities:[] },
  { id:'003', name:'Technical services partner recruitment', type:'Campaign', stage:'BOFU', dates:[], objective:'Recruit prospective partners for technical services.', activities:['Define target audience'] },
];

const lanes = [
  { name:'Technical services', description:'Prospecting to partner recruitment', nodes:['002', null, '003'] },
  { name:'Education & events', description:'Turn learning into qualified interest', nodes:[null, '006', null] },
  { name:'Marketing services', description:'Always-on promotion and delivery', nodes:[null, '008', null] },
];

function Logo(){ return <span className="v2-logo" aria-hidden="true"><i/><i/><i/></span>; }

function ProjectNode({ project, onOpen }: { project: Project; onOpen: (project:Project)=>void }){
  const dateLabel = project.dates.length ? new Date(`${project.dates[0]}T12:00:00`).toLocaleDateString('en-GB',{day:'numeric',month:'short'}) : 'Date needed';
  return <button className={`v2-project node-${project.stage.toLowerCase()}`} onClick={()=>onOpen(project)}>
    <span className="v2-node-top"><i>{project.type}</i><em aria-label={project.link ? 'Project link added' : 'No project link'}>{project.link ? '↗' : '＋'}</em></span>
    <strong>{project.name}</strong>
    <span className="v2-node-meta"><b>{dateLabel}</b><small>Open project</small></span>
  </button>;
}

function ProjectDrawer({ project, onClose, onSaveLink }: { project:Project; onClose:()=>void; onSaveLink:(link:string)=>void }){
  const [link,setLink]=useState(project.link || '');
  return <div className="v2-scrim" onClick={onClose}><aside className="v2-drawer" role="dialog" aria-modal="true" aria-label={`${project.name} project card`} onClick={event=>event.stopPropagation()}>
    <header><span className={`v2-stage stage-${project.stage.toLowerCase()}`}>{project.stage}</span><button onClick={onClose} aria-label="Close project">×</button></header>
    <p className="v2-kicker">{project.type} · Project card</p><h2>{project.name}</h2><p className="v2-objective">{project.objective}</p>
    <section className="v2-link-box"><label htmlFor="project-link">Project link</label><p>Connect the working brief, folder, Asana project or campaign page.</p><div><span aria-hidden="true">↗</span><input id="project-link" value={link} onChange={event=>setLink(event.target.value)} placeholder="Paste a project URL here" /></div><button onClick={()=>onSaveLink(link)}>Save link</button></section>
    <dl><div><dt>Funnel stage</dt><dd>{project.stage}</dd></div><div><dt>Scheduled dates</dt><dd>{project.dates.length ? project.dates.map(date=>new Date(`${date}T12:00:00`).toLocaleDateString('en-GB',{day:'numeric',month:'short'})).join(', ') : 'Needs scheduling'}</dd></div></dl>
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
  const weeks=Array.from({length:52},(_,index)=>index+1);
  const scheduled=items.filter(item=>item.dates.length);
  const unscheduled=items.filter(item=>!item.dates.length);
  const months=[['Jan',1,5],['Feb',6,9],['Mar',10,13],['Apr',14,18],['May',19,22],['Jun',23,26],['Jul',27,31],['Aug',32,35],['Sep',36,40],['Oct',41,44],['Nov',45,48],['Dec',49,52]] as const;
  return <section className="v2-year">
    <header className="v2-year-head"><div><p className="v2-kicker">52-week planning view</p><h2>Every project, on the week it happens.</h2><p>Exact activity dates from your spreadsheet translated into a weekly marketing calendar.</p></div><div className="v2-year-stats"><span><b>{scheduled.length}</b> scheduled</span><span><b>{unscheduled.length}</b> need dates</span></div></header>
    <div className="v2-timeline-wrap"><div className="v2-timeline">
      <div className="v2-month-row"><span className="timeline-label"><b>2025 plan</b><small>Project schedule</small></span><div>{months.map(([name,start,end])=><span key={name} style={{gridColumn:`${start} / ${end+1}`}}>{name}</span>)}</div></div>
      <div className="v2-week-row"><span className="timeline-label"><b>Project</b><small>Stage · Type</small></span><div>{weeks.map(week=><span key={week} className={week%2===0?'even':''}>{week}</span>)}</div></div>
      {scheduled.map(project=>{ const activeWeeks=[...new Set(project.dates.map(weekNumber))]; return <button className="v2-timeline-row" key={project.id} onClick={()=>onOpen(project)}><span className="timeline-label"><b>{project.name}</b><small>{project.stage} · {project.type}</small></span><div>{weeks.map(week=><span key={week} className={activeWeeks.includes(week)?`active week-${project.stage.toLowerCase()}`:''}>{activeWeeks.includes(week)&&<i>W{week}</i>}</span>)}</div></button>})}
    </div></div>
    {unscheduled.length>0&&<section className="v2-unscheduled"><header><div><h3>Needs scheduling</h3><p>These projects are part of the plan but have no confirmed week.</p></div><b>{unscheduled.length}</b></header><div>{unscheduled.map(project=><button key={project.id} onClick={()=>onOpen(project)}><span className={`v2-stage stage-${project.stage.toLowerCase()}`}>{project.stage}</span><b>{project.name}</b><small>Open project card →</small></button>)}</div></section>}
  </section>;
}

function AddProject({ onClose,onAdd }: { onClose:()=>void; onAdd:(project:Project)=>void }){
  const [name,setName]=useState(''); const [stage,setStage]=useState<Stage>('TOFU'); const [date,setDate]=useState(''); const [link,setLink]=useState('');
  const create=()=>{ if(!name.trim())return; onAdd({id:`new-${Date.now()}`,name:name.trim(),type:'Project',stage,dates:date?[date]:[],objective:'New marketing project—add the objective in the next step.',activities:[],link}); };
  return <div className="v2-scrim" onClick={onClose}><section className="v2-add-modal" role="dialog" aria-modal="true" aria-label="Add marketing project" onClick={event=>event.stopPropagation()}><header><div><p className="v2-kicker">New marketing project</p><h2>Add it once. See it everywhere.</h2></div><button onClick={onClose} aria-label="Close">×</button></header><label>Project name<input autoFocus value={name} onChange={event=>setName(event.target.value)} placeholder="e.g. Partner recruitment campaign"/></label><div className="v2-form-grid"><label>Funnel stage<select value={stage} onChange={event=>setStage(event.target.value as Stage)}><option value="TOFU">TOFU · Awareness</option><option value="MOFU">MOFU · Consideration</option><option value="BOFU">BOFU · Action</option></select></label><label>First active date<input type="date" value={date} onChange={event=>setDate(event.target.value)}/></label></div><label>Project link <small>Optional</small><input value={link} onChange={event=>setLink(event.target.value)} placeholder="https://..."/></label><footer><button onClick={onClose}>Cancel</button><button className="v2-create" onClick={create}>Create project →</button></footer></section></div>;
}

export default function MarketMapV2(){
  const [items,setItems]=useState(projects);
  const [selected,setSelected]=useState<Project|null>(null);
  const [view,setView]=useState<'flow'|'year'>('flow');
  const [adding,setAdding]=useState(false);
  const get=(id:string)=>items.find(item=>item.id===id)!;
  const saveLink=(link:string)=>{ if(!selected)return; setItems(current=>current.map(item=>item.id===selected.id?{...item,link}:item)); setSelected(current=>current?{...current,link}:current); };
  const represented=new Set(lanes.flatMap(lane=>lane.nodes.filter(Boolean)));
  const library=items.filter(item=>!represented.has(item.id));
  const addProject=(project:Project)=>{ setItems(current=>[...current,project]); setAdding(false); setSelected(project); };
  return <main className="v2-shell">
    <header className="v2-topbar"><a href="#" className="v2-brand"><Logo/><b>MarketMap</b></a><div className="v2-plan"><span>IS</span><p><b>ISV Marketing</b><small>2025 plan</small></p></div><button className="v2-avatar">IE</button></header>
    <section className="v2-heading"><div><p className="v2-kicker">Demand plan · 2025</p><h1>{view==='flow'?'See how the work connects.':'See when the work happens.'}</h1><p>{view==='flow'?'Follow every project from discovery to action—and open the card when you need the working details.':'Plan at week level, spot busy periods, and find projects that still need dates.'}</p></div><div><nav aria-label="Plan views"><button className={view==='flow'?'active':''} onClick={()=>setView('flow')}>Flow map</button><button className={view==='year'?'active':''} onClick={()=>setView('year')}>Year map</button></nav><button className="v2-add" onClick={()=>setAdding(true)}>＋ Add project</button></div></section>
    {view==='flow'?<section className="v2-canvas">
      <header className="v2-canvas-head"><div><h2>Demand journeys</h2><p>3 journeys · 10 projects · 5 missing connections</p></div><span><i/>Suggested gap</span></header>
      <div className="v2-stages"><span><i>01</i><b>Awareness</b><small>TOFU · Create interest</small></span><span><i>02</i><b>Consideration</b><small>MOFU · Build confidence</small></span><span><i>03</i><b>Action</b><small>BOFU · Drive response</small></span></div>
      <div className="v2-lanes">{lanes.map(lane=><article key={lane.name}><header><b>{lane.name}</b><small>{lane.description}</small></header><div className="v2-path">{lane.nodes.map((id,index)=><div className="v2-step" key={`${lane.name}-${index}`}>{id?<ProjectNode project={get(id)} onOpen={setSelected}/>:<button className="v2-empty" onClick={()=>setAdding(true)}><span>＋</span><b>{index===0?'Add discovery project':index===1?'Add nurture project':'Add action project'}</b><small>Close this journey gap</small></button>}{index<2&&<span className="v2-connector"><i>→</i></span>}</div>)}</div></article>)}</div>
      <section className="v2-library"><header><div><h3>Other projects in your plan</h3><p>Projects not yet connected to a journey.</p></div><b>{library.length}</b></header><div>{library.map(project=><ProjectNode key={project.id} project={project} onOpen={setSelected}/>)}</div></section>
      <footer className="v2-insight"><span>✦</span><p><b>The big picture:</b> 70% of your funnel projects build consideration, but only one project drives a final action.</p><button>Review the gap →</button></footer>
    </section>:<YearTimeline items={items} onOpen={setSelected}/>} 
    {selected&&<ProjectDrawer project={selected} onClose={()=>setSelected(null)} onSaveLink={saveLink}/>} 
    {adding&&<AddProject onClose={()=>setAdding(false)} onAdd={addProject}/>} 
  </main>;
}
