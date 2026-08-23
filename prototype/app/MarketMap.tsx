'use client';

import { useState } from 'react';

type Stage = 'TOFU' | 'MOFU' | 'BOFU';
type Initiative = { id: string; name: string; type: string; stage: Stage; quarters: string[]; confidence: 'high' | 'medium' | 'low' };

const initiatives: Initiative[] = [
  { id: '002', name: 'Technical services awareness', type: 'Campaign', stage: 'TOFU', quarters: ['Q1', 'Q2', 'Q3'], confidence: 'high' },
  { id: '004', name: 'Let me introduce myself', type: 'Campaign', stage: 'TOFU', quarters: ['Q3'], confidence: 'low' },
  { id: '006', name: 'ISV Connect', type: 'Event', stage: 'MOFU', quarters: ['Q1', 'Q2'], confidence: 'high' },
  { id: '008', name: 'Marketing services', type: 'Program', stage: 'MOFU', quarters: ['Q1', 'Q2', 'Q3', 'Q4'], confidence: 'medium' },
  { id: '009', name: 'Global reach · Companial + Seer 365', type: 'Webinar', stage: 'MOFU', quarters: ['Q2'], confidence: 'high' },
  { id: '010', name: 'B2B Software Growth Academy', type: 'Webinar', stage: 'MOFU', quarters: ['Q3'], confidence: 'high' },
  { id: '011', name: 'Strategy & action plan', type: 'Webinar', stage: 'MOFU', quarters: ['Q3'], confidence: 'high' },
  { id: '012', name: 'LinkedIn strategy', type: 'Webinar', stage: 'MOFU', quarters: ['Q4'], confidence: 'high' },
  { id: '013', name: 'Product management', type: 'Webinar idea', stage: 'MOFU', quarters: [], confidence: 'medium' },
  { id: '003', name: 'Technical services partner recruitment', type: 'Campaign', stage: 'BOFU', quarters: ['Q3'], confidence: 'medium' },
];

const stageMeta: Record<Stage, { label: string; question: string; count: number }> = {
  TOFU: { label: 'Create awareness', question: 'Are enough people discovering us?', count: 2 },
  MOFU: { label: 'Build consideration', question: 'Are we helping interest grow?', count: 7 },
  BOFU: { label: 'Drive action', question: 'Are we converting demand?', count: 1 },
};

function MarkLogo() {
  return <span className="mark-logo" aria-hidden="true"><i /><i /><i /></span>;
}

const supporting = [
  { name: 'Price increase campaign', motion: 'Retention / expansion', quarters: ['Q1'] },
  { name: 'Solution Marketplace adoption', motion: 'Partner activation', quarters: ['Q1'] },
  { name: 'Partner Portal expansion', motion: 'Partner enablement', quarters: ['Q2', 'Q3'] },
  { name: 'Partner education content', motion: 'Partner enablement', quarters: ['Q3'] },
  { name: 'Partner & services survey', motion: 'Research / insight', quarters: ['Q3'] },
  { name: 'Marketplace reporting', motion: 'Measurement', quarters: ['Q2', 'Q3', 'Q4'] },
  { name: '2026 delivery planning', motion: 'Marketing operations', quarters: ['Q3', 'Q4'] },
];

function YearMap({ onSelect }: { onSelect: (initiative: Initiative) => void }) {
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  return <section className="year-map" aria-labelledby="year-title">
    <div className="map-heading"><div><p className="eyebrow">Your year at a glance</p><h2 id="year-title">When the work comes to life</h2></div><p className="year-note">An initiative appears in every quarter where it is active.</p></div>
    <div className="quarter-grid">{quarters.map((quarter, index) => {
      const items = initiatives.filter((item) => item.quarters.includes(quarter));
      return <article className="quarter" key={quarter}><header><span>{quarter}</span><small>{['Jan — Mar', 'Apr — Jun', 'Jul — Sep', 'Oct — Dec'][index]}</small><b>{items.length.toString().padStart(2, '0')}</b></header><div>{items.map((item) => <button key={`${quarter}-${item.id}`} onClick={() => onSelect(item)}><i className={`quarter-stage q-${item.stage.toLowerCase()}`} /><span>{item.name}</span><small>{item.stage}</small></button>)}</div>{items.length === 0 && <p>No initiatives mapped</p>}</article>;
    })}</div>
    <div className="year-insight"><span aria-hidden="true">↳</span><p><b>Q3 carries 8 of 10 initiatives.</b> This is your busiest period and may need a capacity check.</p></div>
  </section>;
}

function ImportReview({ onClose }: { onClose: () => void }) {
  return <div className="review-scrim"><section className="review-panel" role="dialog" aria-modal="true" aria-label="Review imported initiatives">
    <header className="review-header"><div><p className="eyebrow">Spreadsheet import</p><h2>Your plan is ready to review</h2><p>AI found 17 initiatives in <b>Marketing – Calendar ISV 2025.xlsx</b>. Confirm the interpretation before creating your map.</p></div><button onClick={onClose} aria-label="Close review">×</button></header>
    <div className="import-progress"><span className="done"><i>✓</i>Upload</span><b /><span className="active"><i>2</i>Review</span><b /><span><i>3</i>Map</span></div>
    <div className="review-summary"><article><strong>17</strong><span>initiatives found</span></article><article><strong>10</strong><span>in the demand funnel</span></article><article><strong>7</strong><span>supporting motions</span></article><article className="attention"><strong>4</strong><span>need attention</span></article></div>
    <div className="review-list">
      <div className="review-list-head"><span>Suggested initiative</span><span>AI classification</span><span>Timing</span><span>Review</span></div>
      {initiatives.slice(0, 5).map((item) => <div className="review-row" key={item.id}><span><b>{item.name}</b><small>{item.type}</small></span><span><i className={`quarter-stage q-${item.stage.toLowerCase()}`} />{item.stage}</span><span>{item.quarters.join(', ') || '—'}</span><span className={item.confidence === 'high' ? 'ready' : 'check'}>{item.confidence === 'high' ? 'Looks good' : 'Check this'}</span></div>)}
      <button className="show-all">Show all 17 initiatives</button>
    </div>
    <footer><button className="secondary-button">Replace spreadsheet</button><button className="drawer-primary" onClick={onClose}>Create my map <span aria-hidden="true">→</span></button></footer>
  </section></div>;
}

export default function MarketMap() {
  const [selected, setSelected] = useState<Initiative | null>(null);
  const [view, setView] = useState<'funnel' | 'year'>('funnel');
  const [reviewing, setReviewing] = useState(false);

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="MarketMap home"><MarkLogo /><span>MarketMap</span></a>
        <div className="workspace-switcher"><span className="workspace-dot">IS</span><span><b>ISV marketing</b><small>2025 plan</small></span><span aria-hidden="true">⌄</span></div>
        <div className="top-actions"><button className="icon-button" aria-label="Search">⌕</button><button className="avatar" aria-label="Open profile">IE</button></div>
      </header>

      <section className="page-intro">
        <div><p className="eyebrow">Marketing landscape · 2025</p><h1>See the whole plan.<br />Spot what is missing.</h1><p className="intro-copy">Ten demand initiatives, arranged by the role they play in your funnel.</p></div>
        <div className="intro-actions"><div className="view-toggle" aria-label="Choose a view"><button className={view === 'funnel' ? 'active' : ''} onClick={() => setView('funnel')}>Funnel map</button><button className={view === 'year' ? 'active' : ''} onClick={() => setView('year')}>Year map</button></div><button className="primary-button" onClick={() => setReviewing(true)}><span aria-hidden="true">↑</span> Import plan</button></div>
      </section>

      <section className="signal-strip" aria-label="Plan summary">
        <div><span className="signal-number">10</span><span>funnel initiatives</span></div><div><span className="signal-number">7</span><span>supporting motions</span></div><div className="signal-alert"><span className="signal-number">01</span><span>conversion initiative</span><em>Potential gap</em></div><button className="review-link" onClick={() => setReviewing(true)}>Review 17 imported items <span aria-hidden="true">→</span></button>
      </section>

      {view === 'funnel' ? <><section className="map-wrap" aria-labelledby="map-title">
        <div className="map-heading"><div><p className="eyebrow">Your demand funnel</p><h2 id="map-title">Where the work is concentrated</h2></div><div className="map-legend"><span><i className="dot solid" />Ready to map</span><span><i className="dot ring" />Needs review</span></div></div>
        <div className="funnel-map">
          {(Object.keys(stageMeta) as Stage[]).map((stage) => {
            const meta = stageMeta[stage];
            const items = initiatives.filter((item) => item.stage === stage);
            return <article className={`stage stage-${stage.toLowerCase()}`} key={stage}>
              <header className="stage-header"><div><span className="stage-code">{stage}</span><h3>{meta.label}</h3></div><span className="stage-count">{meta.count.toString().padStart(2, '0')}</span></header>
              <p className="stage-question">{meta.question}</p>
              <div className="initiative-list">{items.map((item) => <button className="initiative" key={item.id} onClick={() => setSelected(item)}><span className={`confidence confidence-${item.confidence}`} aria-label={`${item.confidence} confidence`} /><span className="initiative-copy"><b>{item.name}</b><small>{item.type} · {item.quarters.join('–') || 'Unscheduled'}</small></span><span className="open-arrow" aria-hidden="true">↗</span></button>)}</div>
            </article>;
          })}
        </div>
      </section>

      <section className="supporting-strip"><div><span className="support-icon" aria-hidden="true">◎</span><span><b>7 supporting motions</b><small>{supporting.map((item) => item.motion).filter((value, index, self) => self.indexOf(value) === index).slice(0, 4).join(', ')} & more</small></span></div><button onClick={() => setReviewing(true)}>Explore beyond the funnel <span aria-hidden="true">→</span></button></section></> : <YearMap onSelect={setSelected} />}

      {selected && <div className="drawer-scrim" role="presentation" onClick={() => setSelected(null)}><aside className="detail-drawer" role="dialog" aria-modal="true" aria-label={`${selected.name} details`} onClick={(event) => event.stopPropagation()}><button className="drawer-close" onClick={() => setSelected(null)} aria-label="Close details">×</button><p className="eyebrow">Initiative overview</p><span className={`detail-stage detail-${selected.stage.toLowerCase()}`}>{selected.stage}</span><h2>{selected.name}</h2><p className="drawer-summary">This imported initiative is part of the <b>{stageMeta[selected.stage].label.toLowerCase()}</b> stage of your plan.</p><dl><div><dt>Type</dt><dd>{selected.type}</dd></div><div><dt>Active</dt><dd>{selected.quarters.join(', ') || 'Not scheduled'}</dd></div><div><dt>AI confidence</dt><dd className="capitalize">{selected.confidence}</dd></div><div><dt>Status</dt><dd>Needs your review</dd></div></dl><div className="drawer-note"><b>Why review?</b><p>MarketMap inferred this placement from your spreadsheet. You stay in control of the final map.</p></div><button className="drawer-primary">Review initiative</button></aside></div>}
      {reviewing && <ImportReview onClose={() => setReviewing(false)} />}
    </main>
  );
}
