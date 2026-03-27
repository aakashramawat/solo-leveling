import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.player.findFirst();
  if (existing) {
    console.log(`System already initialized. Hunter: ${existing.name} [${existing.level > 1 ? 'Level ' + existing.level : 'E-Rank'}]`);
    return;
  }

  const player = await prisma.player.create({
    data: {
      name: 'Sung Jin-Woo',
      title: 'The Ordinary Human',
      level: 1,
      xp: 0,
      skipPasses: 0,
    },
  });

  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  THE SYSTEM HAS CHOSEN YOU.');
  console.log('');
  console.log(`  Hunter: ${player.name}`);
  console.log(`  Rank:   E`);
  console.log(`  Title:  ${player.title}`);
  console.log(`  XP:     0`);
  console.log('');
  console.log('  Your journey begins now.');
  console.log('  Arise.');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
