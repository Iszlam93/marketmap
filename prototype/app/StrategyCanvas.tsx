'use client';

import { useEffect, useRef, useState } from 'react';

type ProjectItem={id:string;name:string;type:string;objective:string;kpi?:string;journey?:string;status?:string;stage:string;stages?:string[]};
type JourneyItem={id:string;name:string;description:string;sortOrder:number};
export type StrategyNodeType='direction'|'phase'|'project'|'outcome'|'note';
export type StrategyNode={id:string;type:StrategyNodeType;title:string;body:string;x:number;y:number;projectId?:string};
export type StrategyEdge={id:string;source:string;target:string;label?:string};
export type StrategyMapState={nodes:StrategyNode[];edges:StrategyEdge[]};

const nodeWidth=220;
const nodeHeight=104;

function starterMap(items:ProjectItem[],journeys:JourneyItem[],planName:string):StrategyMapState{
  const groups=[...journeys.map(item=>({id:item.id,name:item.name,description:item.description,projects:items.filter(project=>project.journey===item.id)})),{id:'other',name:'Cross-plan work',description:'Supporting projects across the complete plan',projects:items.filter(project=>!project.journey)}].filter(group=>group.projects.length);
  const nodes:StrategyNode[]=[
    {id:'direction',type:'direction',title:'DIRECTION',body:planName,x:975,y:40},
    {id:'phase-understand',type:'phase',title:'UNDERSTAND THE PLAN',body:'Clarify the audience, priorities and measures before execution.',x:975,y:190},
  ];
  const edges:StrategyEdge[]=[{id:'edge-direction-understand',source:'direction',target:'phase-understand'}];
  groups.forEach((group,groupIndex)=>{
    const baseX=70+groupIndex*510;
    const hubId=`pillar-${group.id}`;
    nodes.push({id:hubId,type:'phase',title:group.name.toUpperCase(),body:group.description,x:baseX+120,y:370});
    edges.push({id:`edge-understand-${group.id}`,source:'phase-understand',target:hubId});
    group.projects.forEach((project,index)=>{
      const projectNodeId=`project-${project.id}`;
      nodes.push({id:projectNodeId,type:'project',title:project.name,body:project.objective,x:baseX+(index%2)*240,y:540+Math.floor(index/2)*145,projectId:project.id});
      edges.push({id:`edge-${group.id}-${project.id}`,source:hubId,target:projectNodeId});
    });
  });
  return {nodes,edges};
}

function pathFor(source:StrategyNode,target:StrategyNode){
  const sx=source.x+nodeWidth/2;const sy=source.y+nodeHeight;const tx=target.x+nodeWidth/2;const ty=target.y;const bend=sy+(ty-sy)/2;
  return `M ${sx} ${sy} C ${sx} ${bend}, ${tx} ${bend}, ${tx} ${ty}`;
}

function projectStageLabel(project:ProjectItem){const stages=project.stages?.length?project.stages:[project.stage];if(stages.includes('UNASSIGNED'))return 'Outside funnel';if(stages.length>1)return stages.join(' → ');return stages[0]==='TOFU'?'TOFU · Awareness':stages[0]==='MOFU'?'MOFU · Consideration':'BOFU · Action'}

export default function StrategyCanvas({items,journeys,planName,value,onChange,onOpenProject}:{items:ProjectItem[];journeys:JourneyItem[];planName:string;value?:StrategyMapState;onChange:(map:StrategyMapState)=>void;onOpenProject:(project:ProjectItem)=>void}){
  const [map,setMap]=useState<StrategyMapState>(()=>value?.nodes?.length?value:starterMap(items,journeys,planName));
  const mapRef=useRef(map);
  const [zoom,setZoom]=useState(.8);
  const [fullscreen,setFullscreen]=useState(false);
  const [connecting,setConnecting]=useState(false);
  const [connectionSource,setConnectionSource]=useState<string|null>(null);
  const [selectedNodeId,setSelectedNodeId]=useState<string|null>(null);
  const [selectedEdgeId,setSelectedEdgeId]=useState<string|null>(null);
  const [projectSearch,setProjectSearch]=useState('');
  const dragRef=useRef<{id:string;startX:number;startY:number;originX:number;originY:number;moved:boolean}|null>(null);
  const suppressClick=useRef(false);
  const idCounter=useRef(0);
  const viewportRef=useRef<HTMLDivElement>(null);
  const nextId=(prefix:string)=>{idCounter.current+=1;return `${prefix}-${mapRef.current.nodes.length}-${mapRef.current.edges.length}-${idCounter.current}`};
  const sync=(next:StrategyMapState,persist=true)=>{mapRef.current=next;setMap(next);if(persist)onChange(next)};
  const selectedNode=map.nodes.find(node=>node.id===selectedNodeId);
  const selectedEdge=map.edges.find(edge=>edge.id===selectedEdgeId);
  const mappedProjectIds=new Set(map.nodes.map(node=>node.projectId).filter(Boolean));
  const availableProjects=items.filter(project=>!mappedProjectIds.has(project.id)&&project.name.toLowerCase().includes(projectSearch.toLowerCase()));
  const addNode=(type:StrategyNodeType,title:string,body='')=>{const id=nextId(type);const offset=map.nodes.length%5;const node:StrategyNode={id,type,title,body,x:760+offset*45,y:260+offset*45};const next={...mapRef.current,nodes:[...mapRef.current.nodes,node]};sync(next);setSelectedNodeId(id);setSelectedEdgeId(null)};
  const addProject=(project:ProjectItem)=>{const id=`project-${project.id}`;const node:StrategyNode={id,type:'project',title:project.name,body:project.objective,x:760+(map.nodes.length%5)*45,y:300+(map.nodes.length%5)*45,projectId:project.id};sync({...mapRef.current,nodes:[...mapRef.current.nodes,node]});setSelectedNodeId(id)};
  const updateNode=(id:string,patch:Partial<StrategyNode>,persist=false)=>sync({...mapRef.current,nodes:mapRef.current.nodes.map(node=>node.id===id?{...node,...patch}:node)},persist);
  const deleteNode=(id:string)=>{sync({nodes:mapRef.current.nodes.filter(node=>node.id!==id),edges:mapRef.current.edges.filter(edge=>edge.source!==id&&edge.target!==id)});setSelectedNodeId(null)};
  const deleteEdge=(id:string)=>{sync({...mapRef.current,edges:mapRef.current.edges.filter(edge=>edge.id!==id)});setSelectedEdgeId(null)};
  const selectNode=(id:string)=>{if(suppressClick.current)return;if(connecting){if(!connectionSource){setConnectionSource(id);return}if(connectionSource!==id&&!mapRef.current.edges.some(edge=>edge.source===connectionSource&&edge.target===id)){sync({...mapRef.current,edges:[...mapRef.current.edges,{id:nextId('edge'),source:connectionSource,target:id}]})}setConnectionSource(null);setConnecting(false);return}setSelectedNodeId(id);setSelectedEdgeId(null)};
  const pointerDown=(event:React.PointerEvent<HTMLElement>,node:StrategyNode)=>{if(event.button!==0||(event.target as HTMLElement).closest('button,input,textarea,select'))return;event.currentTarget.setPointerCapture(event.pointerId);dragRef.current={id:node.id,startX:event.clientX,startY:event.clientY,originX:node.x,originY:node.y,moved:false}};
  const pointerMove=(event:React.PointerEvent<HTMLElement>)=>{const drag=dragRef.current;if(!drag)return;const dx=(event.clientX-drag.startX)/zoom;const dy=(event.clientY-drag.startY)/zoom;if(Math.abs(dx)+Math.abs(dy)>4)drag.moved=true;updateNode(drag.id,{x:Math.max(20,drag.originX+dx),y:Math.max(20,drag.originY+dy)})};
  const pointerUp=()=>{if(!dragRef.current)return;if(dragRef.current.moved){suppressClick.current=true;onChange(mapRef.current);setTimeout(()=>{suppressClick.current=false},0)}dragRef.current=null};
  const resetStarter=()=>sync(starterMap(items,journeys,planName));
  const changeZoom=(amount:number)=>setZoom(value=>Math.min(1.6,Math.max(.25,Number((value+amount).toFixed(2)))));
  const fitMap=()=>{const viewport=viewportRef.current;if(!viewport)return;const maxX=Math.max(...mapRef.current.nodes.map(node=>node.x+nodeWidth),1200)+80;const maxY=Math.max(...mapRef.current.nodes.map(node=>node.y+nodeHeight),700)+80;const fitted=Math.min(1,(viewport.clientWidth-42)/maxX,(viewport.clientHeight-42)/maxY);setZoom(Math.max(.25,Number(fitted.toFixed(2))));viewport.scrollTo({left:0,top:0,behavior:'smooth'})};
  const toggleFullscreen=()=>{setFullscreen(value=>!value);setTimeout(fitMap,80)};
  useEffect(()=>{if(!fullscreen)return;const previous=document.body.style.overflow;document.body.style.overflow='hidden';const escape=(event:KeyboardEvent)=>{if(event.key==='Escape')setFullscreen(false)};window.addEventListener('keydown',escape);return()=>{document.body.style.overflow=previous;window.removeEventListener('keydown',escape)}},[fullscreen]);
  const connectedNodeIds=new Set(connectionSource?[connectionSource,...map.edges.filter(edge=>edge.source===connectionSource).map(edge=>edge.target),...map.edges.filter(edge=>edge.target===connectionSource).map(edge=>edge.source)]:[]);
  return <section className={`s8-shell ${fullscreen?'fullscreen':''}`}>
    <header className="s8-header"><div><p className="v2-kicker">Strategy map · Freeform canvas</p><h2>Connect the complete marketing strategy.</h2><p>Build the story from direction to projects, actions and outcomes—then move every box until the logic is clear.</p></div><div><span><b>{map.nodes.length}</b> boxes</span><span><b>{map.edges.length}</b> connections</span></div></header>
    <div className="s8-toolbar"><div><button onClick={()=>addNode('direction','NEW DIRECTION','Describe the strategic direction.')}>＋ Direction</button><button onClick={()=>addNode('phase','NEW PHASE','Describe what happens in this phase.')}>＋ Phase</button><button onClick={()=>addNode('outcome','NEW OUTCOME','Define the measurable result.')}>＋ Outcome</button><button onClick={()=>addNode('note','NEW NOTE','Add useful context.')}>＋ Note</button></div><div><button className={connecting?'active':''} onClick={()=>{setConnecting(value=>!value);setConnectionSource(null)}}>↗ {connecting?(connectionSource?'Choose destination':'Choose first box'):'Connect boxes'}</button><button onClick={fitMap}>⌗ Fit map</button><button onClick={toggleFullscreen}>{fullscreen?'↙ Exit full screen':'↗ Full screen'}</button></div></div>
    <div className="s8-help"><span>1</span><p>Drag any box</p><i>→</i><span>2</span><p>Select <b>Connect boxes</b></p><i>→</i><span>3</span><p>Click the first and second boxes</p></div>
    <div className="s8-workspace">
      <aside className="s8-panel">{selectedNode?<><header><small>Selected box</small><button onClick={()=>setSelectedNodeId(null)}>×</button></header><label>Box type<select value={selectedNode.type} disabled={selectedNode.type==='project'} onChange={event=>updateNode(selectedNode.id,{type:event.target.value as StrategyNodeType},true)}><option value="direction">Direction</option><option value="phase">Phase</option><option value="outcome">Outcome</option><option value="note">Note</option><option value="project">Project</option></select></label><label>Title<input value={selectedNode.title} readOnly={selectedNode.type==='project'} onChange={event=>updateNode(selectedNode.id,{title:event.target.value})} onBlur={()=>onChange(mapRef.current)}/></label><label>Description<textarea value={selectedNode.body} readOnly={selectedNode.type==='project'} onChange={event=>updateNode(selectedNode.id,{body:event.target.value})} onBlur={()=>onChange(mapRef.current)}/></label>{selectedNode.projectId&&<button className="s8-open" onClick={()=>{const project=items.find(item=>item.id===selectedNode.projectId);if(project)onOpenProject(project)}}>Open project card →</button>}<button className="s8-delete" onClick={()=>deleteNode(selectedNode.id)}>Remove from map</button></>:selectedEdge?<><header><small>Selected arrow</small><button onClick={()=>setSelectedEdgeId(null)}>×</button></header><label>Connection label<input value={selectedEdge.label||''} onChange={event=>sync({...mapRef.current,edges:mapRef.current.edges.map(edge=>edge.id===selectedEdge.id?{...edge,label:event.target.value}:edge)},false)} onBlur={()=>onChange(mapRef.current)} placeholder="e.g. leads to"/></label><button className="s8-delete" onClick={()=>deleteEdge(selectedEdge.id)}>Delete connection</button></>:<><header><div><small>Project library</small><b>{availableProjects.length} available</b></div></header><label className="s8-search">⌕<input value={projectSearch} onChange={event=>setProjectSearch(event.target.value)} placeholder="Search projects"/></label><div className="s8-project-list">{availableProjects.map(project=><button key={project.id} onClick={()=>addProject(project)}><span><b>{project.name}</b><small>{project.type}</small></span><i>＋</i></button>)}{!availableProjects.length&&<p>Every matching project is already on the map.</p>}</div><button className="s8-reset" onClick={resetStarter}>Reset automatic layout</button></>}</aside>
      <div className="s8-viewport" ref={viewportRef} onWheel={event=>{event.preventDefault();changeZoom(event.deltaY>0?-.08:.08)}}><div className="s8-floating-zoom" aria-label="Map zoom controls"><button onClick={()=>changeZoom(-.1)} aria-label="Zoom out">−</button><button onClick={()=>setZoom(.8)} title="Return to 80%">{Math.round(zoom*100)}%</button><button onClick={()=>changeZoom(.1)} aria-label="Zoom in">＋</button><button onClick={fitMap}>Fit</button><button onClick={toggleFullscreen}>{fullscreen?'Exit':'Full'}</button></div><div className="s8-world" style={{transform:`scale(${zoom})`}}>
        <svg className="s8-lines" width="2200" height="1400" aria-hidden="true"><defs><marker id="s8-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"/></marker></defs>{map.edges.map(edge=>{const source=map.nodes.find(node=>node.id===edge.source);const target=map.nodes.find(node=>node.id===edge.target);if(!source||!target)return null;const path=pathFor(source,target);return <g key={edge.id} className={selectedEdgeId===edge.id?'selected':''} onClick={()=>{setSelectedEdgeId(edge.id);setSelectedNodeId(null)}}><path className="s8-line-hit" d={path}/><path className="s8-line" d={path} markerEnd="url(#s8-arrow)"/>{edge.label&&<text x={(source.x+target.x)/2+nodeWidth/2} y={(source.y+target.y)/2+nodeHeight/2}>{edge.label}</text>}</g>})}</svg>
        {map.nodes.map(node=>{const project=node.projectId?items.find(item=>item.id===node.projectId):undefined;return <article key={node.id} className={`s8-node type-${node.type} ${selectedNodeId===node.id?'selected':''} ${connectionSource===node.id?'source':''} ${connectionSource&&!connectedNodeIds.has(node.id)?'connectable':''}`} style={{left:node.x,top:node.y}} onPointerDown={event=>pointerDown(event,node)} onPointerMove={pointerMove} onPointerUp={pointerUp} onClick={()=>selectNode(node.id)}><header><span>{node.type==='project'?(project?.type||'Project'):node.type}</span><div>{project&&<em className={`s8-stage stage-${project.stage.toLowerCase()}`}>{projectStageLabel(project)}</em>}{project&&<button onClick={event=>{event.stopPropagation();onOpenProject(project)}} aria-label={`Open ${project.name}`}>↗</button>}</div></header><strong>{node.title}</strong><p>{node.body}</p><i className="s8-port top"/><i className="s8-port bottom"/></article>})}
      </div></div>
    </div>
  </section>;
}
