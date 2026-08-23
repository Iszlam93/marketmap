export const createProjectsTable = `
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    stage TEXT NOT NULL,
    stages_json TEXT NOT NULL DEFAULT '[]',
    journey TEXT,
    dates_json TEXT NOT NULL DEFAULT '[]',
    objective TEXT NOT NULL DEFAULT '',
    activities_json TEXT NOT NULL DEFAULT '[]',
    project_link TEXT NOT NULL DEFAULT '',
    owner TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'planned',
    kpi TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL
  )
`;
export const createStageIndex = `CREATE INDEX IF NOT EXISTS idx_projects_stage ON projects(stage)`;
export const createJourneyIndex = `CREATE INDEX IF NOT EXISTS idx_projects_journey ON projects(journey)`;
export const createJourneysTable = `
  CREATE TABLE IF NOT EXISTS journeys (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL
  )
`;
