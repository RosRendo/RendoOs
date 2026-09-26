import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { folderPath } = body;

    if (!folderPath || typeof folderPath !== 'string') {
      return NextResponse.json({ error: 'Folder path is required' }, { status: 400 });
    }

    const cleanPath = path.resolve(folderPath.trim());

    if (!fs.existsSync(cleanPath)) {
      return NextResponse.json(
        { error: `Directory does not exist at: ${cleanPath}` },
        { status: 404 }
      );
    }

    const stats = fs.statSync(cleanPath);
    if (!stats.isDirectory()) {
      return NextResponse.json(
        { error: `Specified path is a file, not a directory: ${cleanPath}` },
        { status: 400 }
      );
    }

    // Scanned data structure
    let name = path.basename(cleanPath);
    let description = '';
    let repoUrl = '';
    let devScript = 'npm run dev';
    let port = 3000;
    const frontendTech = new Set<string>();
    const backendTech = new Set<string>();
    const databaseTech = new Set<string>();
    const infraTech = new Set<string>();
    let overview = '';

    // Backend specific runner settings
    let backendPath = '';
    let backendScript = '';
    let backendPort: number | null = null;

    // Helper to inspect a node/js package.json
    const inspectPackageJson = (pkgPath: string, isBackendTarget = false) => {
      try {
        const pkgContent = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        const genericNames = ['ui', 'frontend', 'backend', 'client', 'server', 'web', 'app'];
        if (!name || name === path.basename(cleanPath)) {
          if (pkgContent.name && !genericNames.includes(pkgContent.name.toLowerCase().trim())) {
            name = pkgContent.name;
          }
        }
        if (!description && pkgContent.description) {
          description = pkgContent.description;
        }

        const allDeps = {
          ...(pkgContent.dependencies || {}),
          ...(pkgContent.devDependencies || {}),
        };

        // Detect Frontend
        if (allDeps['next']) frontendTech.add('Next.js');
        if (allDeps['react']) frontendTech.add('React');
        if (allDeps['vue']) frontendTech.add('Vue');
        if (allDeps['svelte']) frontendTech.add('Svelte');
        if (allDeps['tailwindcss']) frontendTech.add('Tailwind CSS');
        if (allDeps['vite']) frontendTech.add('Vite');
        if (allDeps['typescript']) frontendTech.add('TypeScript');
        if (allDeps['three'] || allDeps['@react-three/fiber']) frontendTech.add('Three.js');
        if (allDeps['xterm']) frontendTech.add('xterm.js');
        if (allDeps['@monaco-editor/react']) frontendTech.add('Monaco Editor');

        // Detect Backend & Cloud
        if (allDeps['@nestjs/core'] || allDeps['@nestjs/common']) backendTech.add('NestJS');
        if (allDeps['express']) backendTech.add('Express');
        if (allDeps['fastify']) backendTech.add('Fastify');
        if (allDeps['socket.io'] || allDeps['socket.io-client']) backendTech.add('Socket.io');
        if (allDeps['@supabase/supabase-js']) backendTech.add('Supabase');
        if (allDeps['firebase'] || allDeps['firebase-admin']) backendTech.add('Firebase');
        if (allDeps['graphql'] || allDeps['@apollo/client']) backendTech.add('GraphQL');
        if (allDeps['electron']) frontendTech.add('Electron');

        // Detect Database & ORM
        if (allDeps['@prisma/client'] || allDeps['prisma']) databaseTech.add('Prisma');
        if (allDeps['pg'] || allDeps['postgres']) databaseTech.add('PostgreSQL');
        if (allDeps['better-sqlite3'] || allDeps['sqlite3']) databaseTech.add('SQLite');
        if (allDeps['mysql'] || allDeps['mysql2']) databaseTech.add('MySQL');
        if (allDeps['mongoose'] || allDeps['mongodb']) databaseTech.add('MongoDB');
        if (allDeps['ioredis'] || allDeps['redis']) databaseTech.add('Redis');

        // Determine scripts & ports
        if (pkgContent.scripts) {
          const scripts = pkgContent.scripts;
          let cmd = '';
          if (scripts['start:dev']) cmd = 'npm run start:dev';
          else if (scripts['dev']) cmd = 'npm run dev';
          else if (scripts['start']) cmd = 'npm start';

          // Extract port
          const scriptText = scripts['dev'] || scripts['start:dev'] || scripts['start'] || '';
          const portMatch = scriptText.match(/-p\s+(\d+)/) || scriptText.match(/PORT=(\d+)/);
          let extractedPort = portMatch && portMatch[1] ? parseInt(portMatch[1], 10) : null;

          if (isBackendTarget) {
            backendScript = cmd || 'npm run start:dev';
            backendPort = extractedPort || (backendTech.has('NestJS') ? 4000 : 8000);
          } else {
            if (cmd) devScript = cmd;
            if (extractedPort) port = extractedPort;
          }
        }
      } catch (err) {
        console.error('Failed to parse package.json at', pkgPath, err);
      }
    };

    // 1. Check Root package.json
    const rootPkgPath = path.join(cleanPath, 'package.json');
    if (fs.existsSync(rootPkgPath)) {
      inspectPackageJson(rootPkgPath, false);
    }

    // 2. Monorepo Subfolder Detection (frontend/, client/, web/, app/ui)
    const feSubdirs = ['frontend', 'client', 'web', 'ui', 'app/ui', 'app/frontend', 'app/client'];
    let frontendPath = '';
    for (const sub of feSubdirs) {
      const subPath = path.join(cleanPath, sub);
      const subPkg = path.join(subPath, 'package.json');
      if (fs.existsSync(subPkg)) {
        inspectPackageJson(subPkg, false);
        frontendPath = subPath;
        break;
      }
    }

    // 3. Monorepo Subfolder Detection (backend/, server/, api/)
    const beSubdirs = ['backend', 'server', 'api'];
    for (const sub of beSubdirs) {
      const subPath = path.join(cleanPath, sub);
      if (fs.existsSync(subPath) && fs.statSync(subPath).isDirectory()) {
        backendPath = subPath;

        // Check package.json in backend
        const subPkg = path.join(subPath, 'package.json');
        if (fs.existsSync(subPkg)) {
          inspectPackageJson(subPkg, true);
        }

        // Check Go in backend
        if (fs.existsSync(path.join(subPath, 'go.mod'))) {
          backendTech.add('Go (Golang)');
          backendScript = 'go run main.go';
          backendPort = backendPort || 8080;
        }

        // Check Python in backend
        if (
          fs.existsSync(path.join(subPath, 'requirements.txt')) ||
          fs.existsSync(path.join(subPath, 'pyproject.toml'))
        ) {
          backendTech.add('Python');
          backendScript = 'python main.py';
          backendPort = backendPort || 8000;
        }

        break;
      }
    }

    // 4. Root Go module check
    const goModPath = path.join(cleanPath, 'go.mod');
    if (fs.existsSync(goModPath)) {
      backendTech.add('Go (Golang)');
      backendPath = backendPath || cleanPath;
      backendScript = backendScript || 'go run main.go';
      backendPort = backendPort || 8080;
    }

    // 5. Root Python & FastAPI check
    const reqPath = path.join(cleanPath, 'requirements.txt');
    const pyprojectPath = path.join(cleanPath, 'pyproject.toml');
    const runPyPath = path.join(cleanPath, 'run.py');
    const assistantPath = path.join(cleanPath, 'assistant');

    if (fs.existsSync(reqPath) || fs.existsSync(pyprojectPath) || fs.existsSync(runPyPath) || fs.existsSync(assistantPath)) {
      backendTech.add('Python');
      backendPath = backendPath || cleanPath;
      
      if (fs.existsSync(runPyPath)) {
        backendScript = backendScript || 'python run.py';
      } else {
        backendScript = backendScript || 'python main.py';
      }
      backendPort = backendPort || 8000;

      // Check if FastAPI or Uvicorn is present
      if (fs.existsSync(path.join(assistantPath, 'app.py')) || fs.existsSync(path.join(cleanPath, 'main.py'))) {
        backendTech.add('FastAPI');
      }
    }

    // 6. If Root itself is a backend Node project (e.g. NestJS / Express) and no backendPath set
    if (!backendPath && (backendTech.has('NestJS') || backendTech.has('Express') || backendTech.has('Fastify'))) {
      backendPath = cleanPath;
      backendScript = backendScript || 'npm run start:dev';
      backendPort = backendPort || (backendTech.has('NestJS') ? 4000 : 5000);
    }

    // 7. Check for Docker
    if (
      fs.existsSync(path.join(cleanPath, 'Dockerfile')) ||
      fs.existsSync(path.join(cleanPath, 'docker-compose.yml'))
    ) {
      infraTech.add('Docker');
    }

    // 8. Check for Git Remote repository in .git/config
    const gitConfigPath = path.join(cleanPath, '.git', 'config');
    if (fs.existsSync(gitConfigPath)) {
      try {
        const gitConfig = fs.readFileSync(gitConfigPath, 'utf-8');
        const urlMatch = gitConfig.match(/url\s*=\s*(.+)/);
        if (urlMatch && urlMatch[1]) {
          let rawUrl = urlMatch[1].trim();
          if (rawUrl.startsWith('git@github.com:')) {
            rawUrl = rawUrl.replace('git@github.com:', 'https://github.com/').replace(/\.git$/, '');
          }
          repoUrl = rawUrl;
        }
      } catch (err) {
        console.error('Failed to read git config:', err);
      }
    }

    // 9. Check for README.md for overview
    const readmePath = path.join(cleanPath, 'README.md');
    if (fs.existsSync(readmePath)) {
      try {
        const readme = fs.readFileSync(readmePath, 'utf-8');
        const lines = readme.split('\n').filter((l) => l.trim() && !l.startsWith('#') && !l.startsWith('!'));
        if (lines.length > 0) {
          overview = lines.slice(0, 3).join(' ');
          if (!description) {
            description = lines[0].slice(0, 160);
          }
        }
      } catch (err) {
        console.error('Failed to read README:', err);
      }
    }

    const techStack = {
      frontend: Array.from(frontendTech),
      backend: Array.from(backendTech),
      database: Array.from(databaseTech),
      infrastructure: Array.from(infraTech),
    };

    return NextResponse.json({
      folderPath: frontendPath || cleanPath,
      name,
      description,
      overview,
      repoUrl,
      runScript: devScript,
      port,
      backendPath: backendPath || null,
      backendScript: backendScript || null,
      backendPort: backendPort || null,
      techStack,
    });
  } catch (error: any) {
    console.error('Folder scan error:', error);
    return NextResponse.json({ error: error.message || 'Folder scan failed' }, { status: 500 });
  }
}
