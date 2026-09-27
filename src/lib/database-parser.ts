import fs from 'fs';
import path from 'path';

export type {
  DbColumn,
  DbTable,
  DbRelationship,
  DatabaseDesignResult,
} from './database-types';
export { getDatabaseTemplate } from './database-types';
import type { DbColumn, DbTable, DbRelationship } from './database-types';

/**
 * Searches local filesystem for schema files (Prisma, SQL, SQLite)
 */
export function findProjectDatabaseFiles(
  folderPath?: string | null,
  slug?: string | null,
  backendPath?: string | null
): { filePath: string; format: 'prisma' | 'sql' | 'sqlite'; content: string } | null {
  const workspaceRoot = 'D:\\FOR RENDO (ONLY )\\Personal Project';

  const knownPaths: Record<string, string[]> = {
    'stackgen': [
      path.join(workspaceRoot, 'Stackgen', 'backend', 'prisma', 'schema.prisma'),
      path.join(workspaceRoot, 'Stackgen', 'prisma', 'schema.prisma'),
    ],
    'cv-gen': [
      path.join(workspaceRoot, 'CV-Gen', 'backend', 'prisma', 'schema.prisma'),
      path.join(workspaceRoot, 'CV-Gen', 'prisma', 'schema.prisma'),
    ],
    'service-finder': [
      path.join(workspaceRoot, 'Service_Finder', 'backend-nest', 'prisma', 'schema.prisma'),
      path.join(workspaceRoot, 'Service_Finder', 'backend-nest', 'database_schema.sql'),
    ],
    'estatex': [
      path.join(workspaceRoot, 'Real-Estate', 'prisma', 'schema.prisma'),
    ],
    'pos-system': [
      path.join(workspaceRoot, 'POS_SYSTEM', 'backend', 'src', 'database', 'migrate.js'),
      path.join(workspaceRoot, 'POS_SYSTEM', 'backend', 'prisma', 'schema.prisma'),
    ],
    'orchestrator': [
      path.join(workspaceRoot, 'Orchestrator', 'backend', 'prisma', 'schema.prisma'),
      path.join(workspaceRoot, 'Orchestrator', 'prisma', 'schema.prisma'),
    ],
    'journex': [
      path.join(workspaceRoot, 'Dashboard', 'backend', 'prisma', 'schema.prisma'),
      path.join(workspaceRoot, 'Dashboard', 'prisma', 'schema.prisma'),
    ],
    'atelier-ecommerce': [
      'D:\\FOR RENDO (ONLY )\\Ecommerce\\Ecommerce\\prisma\\schema.prisma',
    ],
    'jarvis': [
      'D:\\FOR RENDO (ONLY )\\JARVIS\\data\\jarvis.db',
    ],
    'techtune-healer': [
      'D:\\CamtechUniversity\\ProgrammingYearIII\\techtune-healer\\prisma\\schema.prisma',
    ],
    'rendoos': [
      path.join(process.cwd(), 'prisma', 'schema.prisma'),
    ],
  };

  const candidates: string[] = [];

  if (slug && knownPaths[slug]) {
    candidates.push(...knownPaths[slug]);
  }

  // Scan folderPath & backendPath
  const searchDirs = [backendPath, folderPath].filter(Boolean) as string[];
  for (const dir of searchDirs) {
    candidates.push(path.join(dir, 'prisma', 'schema.prisma'));
    candidates.push(path.join(dir, 'schema.prisma'));
    candidates.push(path.join(dir, 'database_schema.sql'));
    candidates.push(path.join(dir, 'schema.sql'));
    candidates.push(path.join(dir, 'src', 'database', 'migrate.js'));

    const parent = path.dirname(dir);
    candidates.push(path.join(parent, 'prisma', 'schema.prisma'));
    candidates.push(path.join(parent, 'backend', 'prisma', 'schema.prisma'));
    candidates.push(path.join(parent, 'server', 'prisma', 'schema.prisma'));
    candidates.push(path.join(parent, 'schema.sql'));
  }

  for (const c of candidates) {
    if (fs.existsSync(c)) {
      const ext = path.extname(c).toLowerCase();
      if (ext === '.prisma') {
        const content = fs.readFileSync(c, 'utf8');
        return { filePath: c, format: 'prisma', content };
      } else if (ext === '.sql' || c.endsWith('migrate.js')) {
        const content = fs.readFileSync(c, 'utf8');
        return { filePath: c, format: 'sql', content };
      } else if (ext === '.db' || ext === '.sqlite') {
        return {
          filePath: c,
          format: 'sqlite',
          content: `-- SQLite Database File: ${c}\n-- Binary file inspected via local client.`,
        };
      }
    }
  }

  return null;
}

/**
 * Sanitizes type names for Mermaid ERD
 */
function sanitizeMermaidType(rawType: string): string {
  const clean = rawType
    .replace(/[\[\]\?]/g, '')
    .replace(/\(.*?\)/g, '')
    .trim();
  return clean || 'string';
}

/**
 * Parses Prisma schema into structured tables and generates an interactive Mermaid ERD
 */
export function parsePrismaSchema(prismaCode: string): {
  tables: DbTable[];
  engine: string;
  erdMermaid: string;
} {
  const tables: DbTable[] = [];
  const relationships: DbRelationship[] = [];

  // Detect Engine
  let engine = 'Prisma ORM';
  const providerMatch = prismaCode.match(/provider\s*=\s*["']([^"']+)["']/);
  if (providerMatch) {
    const prov = providerMatch[1].toLowerCase();
    if (prov.includes('postgre')) engine = 'PostgreSQL (Prisma)';
    else if (prov.includes('mysql')) engine = 'MySQL (Prisma)';
    else if (prov.includes('sqlite')) engine = 'SQLite (Prisma)';
    else if (prov.includes('mongodb')) engine = 'MongoDB (Prisma)';
    else if (prov.includes('cockroach')) engine = 'CockroachDB';
    else if (prov.includes('sqlserver')) engine = 'SQL Server';
  }

  // Extract Models
  const modelRegex = /model\s+([A-Za-z0-9_]+)\s*\{([\s\S]*?)\}/g;
  let modelMatch;
  const knownModelNames = new Set<string>();

  // Pass 1: Collect Model Names
  const modelNamesRegex = /model\s+([A-Za-z0-9_]+)\s*\{/g;
  let nameMatch;
  while ((nameMatch = modelNamesRegex.exec(prismaCode)) !== null) {
    knownModelNames.add(nameMatch[1]);
  }

  // Pass 2: Extract Columns & Relations
  while ((modelMatch = modelRegex.exec(prismaCode)) !== null) {
    const tableName = modelMatch[1];
    const body = modelMatch[2];
    const lines = body
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('//') && !l.startsWith('@@'));

    const columns: DbColumn[] = [];

    for (const line of lines) {
      const parts = line.split(/\s+/);
      if (parts.length < 2) continue;

      const colName = parts[0];
      const rawType = parts[1];

      // Check if this field is a relation to another model
      const baseType = rawType.replace(/[\[\]\?]/g, '');
      const isRelation = knownModelNames.has(baseType);

      if (isRelation) {
        // Collect relationship if list or foreign key relation
        if (rawType.includes('[]')) {
          relationships.push({
            sourceTable: tableName,
            targetTable: baseType,
            relationship: '||--o{',
            label: colName,
          });
        }
        continue; // Don't list virtual relation fields as columns in DB schema
      }

      const isPk = line.includes('@id');
      const isFk = line.includes('@relation');
      const isNullable = rawType.endsWith('?');
      const isUnique = line.includes('@unique');

      const attrs: string[] = [];
      if (isPk) attrs.push('PK');
      if (isUnique) attrs.push('UNIQUE');
      if (line.includes('@default')) {
        const defMatch = line.match(/@default\(([^)]+)\)/);
        if (defMatch) attrs.push(`default: ${defMatch[1]}`);
      }

      columns.push({
        name: colName,
        type: rawType,
        isPrimaryKey: isPk,
        isForeignKey: isFk,
        isNullable,
        attributes: attrs,
      });
    }

    tables.push({ name: tableName, columns });
  }

  // Generate Mermaid ERD
  const erdMermaid = generateErdMermaid(tables, relationships);

  return { tables, engine, erdMermaid };
}

/**
 * Parses SQL (CREATE TABLE / migrations) into structured tables & Mermaid ERD
 */
export function parseSqlSchema(sqlCode: string): {
  tables: DbTable[];
  engine: string;
  erdMermaid: string;
} {
  const tables: DbTable[] = [];
  const relationships: DbRelationship[] = [];

  let engine = 'SQL Database';
  if (/SERIAL|TIMESTAMP WITH TIME ZONE|uuid_generate/i.test(sqlCode)) engine = 'PostgreSQL';
  else if (/AUTO_INCREMENT|ENGINE=InnoDB/i.test(sqlCode)) engine = 'MySQL / MariaDB';
  else if (/AUTOINCREMENT/i.test(sqlCode)) engine = 'SQLite';

  const tableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([A-Za-z0-9_"`]+)\s*\(([\s\S]*?)\);/gi;
  let match;

  while ((match = tableRegex.exec(sqlCode)) !== null) {
    const rawTableName = match[1].replace(/["`]/g, '');
    const body = match[2];

    const lines = body
      .split('\n')
      .map((l) => l.trim().replace(/,$/, ''))
      .filter((l) => l && !l.startsWith('--') && !l.startsWith('/*'));

    const columns: DbColumn[] = [];

    for (const line of lines) {
      // Table-level foreign key: CONSTRAINT fk_... FOREIGN KEY (col) REFERENCES other_table(id)
      const fkMatch = line.match(/FOREIGN\s+KEY\s*\(([^)]+)\)\s*REFERENCES\s+([A-Za-z0-9_"`]+)\s*\(([^)]+)\)/i);
      if (fkMatch) {
        const fkCol = fkMatch[1].replace(/["`]/g, '').trim();
        const refTable = fkMatch[2].replace(/["`]/g, '').trim();
        relationships.push({
          sourceTable: refTable,
          targetTable: rawTableName,
          relationship: '||--o{',
          label: fkCol,
        });
        continue;
      }

      if (/^(PRIMARY\s+KEY|CONSTRAINT|UNIQUE|KEY|INDEX)/i.test(line)) continue;

      const parts = line.split(/\s+/);
      if (parts.length >= 2) {
        const colName = parts[0].replace(/["`]/g, '');
        const colType = parts[1];
        const isPk = /PRIMARY\s+KEY/i.test(line);
        const inlineFkMatch = line.match(/REFERENCES\s+([A-Za-z0-9_"`]+)/i);
        const isFk = Boolean(inlineFkMatch);
        const isNullable = !/NOT\s+NULL/i.test(line);

        if (inlineFkMatch) {
          const refTable = inlineFkMatch[1].replace(/["`]/g, '');
          relationships.push({
            sourceTable: refTable,
            targetTable: rawTableName,
            relationship: '||--o{',
            label: colName,
          });
        }

        const attrs: string[] = [];
        if (isPk) attrs.push('PK');
        if (/UNIQUE/i.test(line)) attrs.push('UNIQUE');

        columns.push({
          name: colName,
          type: colType,
          isPrimaryKey: isPk,
          isForeignKey: isFk,
          isNullable,
          attributes: attrs,
        });
      }
    }

    tables.push({ name: rawTableName, columns });
  }

  const erdMermaid = generateErdMermaid(tables, relationships);
  return { tables, engine, erdMermaid };
}

/**
 * Builds valid Mermaid ER Diagram code
 */
export function generateErdMermaid(tables: DbTable[], relationships: DbRelationship[] = []): string {
  if (tables.length === 0) {
    return `erDiagram
    NO_TABLES {
      string status "No schema defined yet"
    }`;
  }

  const lines: string[] = ['erDiagram'];

  // 1. Relationships
  const seenRels = new Set<string>();
  for (const rel of relationships) {
    const key = `${rel.sourceTable}-${rel.targetTable}-${rel.label}`;
    if (!seenRels.has(key)) {
      seenRels.add(key);
      const safeLabel = (rel.label || 'has').replace(/[^a-zA-Z0-9_-]/g, '_');
      lines.push(`    ${rel.sourceTable} ${rel.relationship} ${rel.targetTable} : "${safeLabel}"`);
    }
  }

  // 2. Tables & Attributes
  for (const table of tables) {
    lines.push(`    ${table.name} {`);
    for (const col of table.columns.slice(0, 15)) {
      const safeType = sanitizeMermaidType(col.type);
      const keyFlag = col.isPrimaryKey ? 'PK' : col.isForeignKey ? 'FK' : '';
      lines.push(`        ${safeType} ${col.name} ${keyFlag}`);
    }
    lines.push('    }');
  }

  return lines.join('\n');
}
