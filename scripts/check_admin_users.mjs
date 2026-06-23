import { prisma } from '../src/lib/prisma.ts';

async function main() {
  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { email: true, name: true, role: true },
  });

  console.log(JSON.stringify(admins, null, 2));
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
