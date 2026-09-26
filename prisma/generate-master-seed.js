const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
  const projects = await prisma.project.findMany({
    include: { tasks: true, blockers: true, ideas: true, links: true }
  });
  console.log('Exporting', projects.length, 'projects to master prisma/seed.js');

  const serialized = JSON.stringify(projects, null, 2);

  const fileContent = `const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const projectsData = ${serialized};

async function main() {
  console.log('Seeding Rendo Hub with all ' + projectsData.length + ' projects...');

  await prisma.user.upsert({
    where: { id: 'user-rendo' },
    update: {},
    create: {
      id: 'user-rendo',
      name: 'Rendo',
      handle: '@rendo',
      avatar: '/avatars/rendo.png',
      bio: 'Software Engineer & Builder — Personal Command Center',
    },
  });

  for (const p of projectsData) {
    const { id, tasks, blockers, ideas, links, createdAt, updatedAt, ...scalarFields } = p;

    const project = await prisma.project.upsert({
      where: { slug: scalarFields.slug },
      update: scalarFields,
      create: scalarFields,
    });

    if (tasks && tasks.length > 0) {
      await prisma.task.deleteMany({ where: { projectId: project.id } });
      for (const t of tasks) {
        const { id, projectId, createdAt, updatedAt, ...tData } = t;
        await prisma.task.create({ data: { ...tData, projectId: project.id } });
      }
    }

    if (links && links.length > 0) {
      await prisma.link.deleteMany({ where: { projectId: project.id } });
      for (const l of links) {
        const { id, projectId, createdAt, updatedAt, ...lData } = l;
        await prisma.link.create({ data: { ...lData, projectId: project.id } });
      }
    }
  }

  console.log('Master seed complete! All ' + projectsData.length + ' projects are registered.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
`;

  fs.writeFileSync('prisma/seed.js', fileContent, 'utf8');
  console.log('Successfully wrote master seed.js with all 13 projects!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
