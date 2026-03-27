import { Router } from 'express';
import { getLevelInfo, getLevelForXp, getLevelXpRates } from '@solo-leveling/shared';
import { prisma } from '../index.js';

export const questRouter = Router();

function getTodayDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

async function getOrCreatePlayer() {
  let player = await prisma.player.findFirst();
  if (!player) {
    const info = getLevelInfo(1);
    player = await prisma.player.create({ data: { title: info.title } });
  }
  return player;
}

async function updatePlayerXp(playerId: string, newXp: number) {
  const xp = Math.max(0, newXp);
  const level = getLevelForXp(xp);
  const info = getLevelInfo(level);
  return prisma.player.update({
    where: { id: playerId },
    data: { xp, level, title: info.title },
  });
}

// GET /api/quests — get today's quest (rolls once per day, 10% chance)
questRouter.get('/', async (_req, res) => {
  const player = await getOrCreatePlayer();
  const today = getTodayDate();

  // Check if we already rolled today
  let activeQuest = await prisma.activeQuest.findUnique({ where: { date: today } });

  if (!activeQuest) {
    // Roll the dice — 10% chance
    const hit = Math.random() < 0.1;

    if (hit) {
      // Pick a random quest from the pool
      const poolCount = await prisma.quest.count({ where: { playerId: player.id } });

      if (poolCount > 0) {
        const skip = Math.floor(Math.random() * poolCount);
        const [quest] = await prisma.quest.findMany({
          where: { playerId: player.id },
          skip,
          take: 1,
        });

        activeQuest = await prisma.activeQuest.create({
          data: {
            date: today,
            questId: quest.id,
            title: quest.title,
            status: 'active',
            playerId: player.id,
          },
        });
      } else {
        // 10% hit but pool is empty — no quest
        activeQuest = await prisma.activeQuest.create({
          data: {
            date: today,
            questId: null,
            title: null,
            status: 'failed',
            playerId: player.id,
          },
        });
      }
    } else {
      // No quest today
      activeQuest = await prisma.activeQuest.create({
        data: {
          date: today,
          questId: null,
          title: null,
          status: 'failed',
          playerId: player.id,
        },
      });
    }
  }

  // Return the active quest if one exists
  const hasQuest = activeQuest.questId !== null && activeQuest.status === 'active';

  // Calculate reward/penalty info for display
  const rates = getLevelXpRates(player.level);
  const rewardXp = rates.baseGain * 20;
  const penaltyXp = rates.baseLoss * 30;

  res.json({
    success: true,
    data: {
      date: today,
      hasQuest,
      quest: hasQuest
        ? { id: activeQuest.id, title: activeQuest.title, status: activeQuest.status }
        : null,
      rewardXp,
      penaltyXp,
    },
  });
});

// POST /api/quests — add a quest to the pool
questRouter.post('/', async (req, res) => {
  const player = await getOrCreatePlayer();
  const { title } = req.body as { title: string };

  if (!title || !title.trim()) {
    res.status(400).json({ success: false, error: 'title is required' });
    return;
  }

  const quest = await prisma.quest.create({
    data: {
      title: title.trim(),
      playerId: player.id,
    },
  });

  res.json({ success: true, data: quest });
});

// POST /api/quests/:id/complete — complete today's active quest
questRouter.post('/:id/complete', async (req, res) => {
  const { id } = req.params;

  const activeQuest = await prisma.activeQuest.findUnique({ where: { id } });
  if (!activeQuest || activeQuest.status !== 'active') {
    res.status(404).json({ success: false, error: 'Active quest not found' });
    return;
  }

  const player = await prisma.player.findUnique({ where: { id: activeQuest.playerId } });
  if (!player) {
    res.status(404).json({ success: false, error: 'Player not found' });
    return;
  }

  // Mark as completed
  await prisma.activeQuest.update({
    where: { id },
    data: { status: 'completed' },
  });

  // Remove the quest from the pool
  if (activeQuest.questId) {
    await prisma.quest.delete({ where: { id: activeQuest.questId } }).catch(() => {});
  }

  // Reward: +20x baseGain XP + 1 skip pass
  const rates = getLevelXpRates(player.level);
  const rewardXp = rates.baseGain * 20;
  await updatePlayerXp(player.id, player.xp + rewardXp);
  await prisma.player.update({
    where: { id: player.id },
    data: { skipPasses: player.skipPasses + 1 },
  });

  res.json({ success: true, data: { xpGained: rewardXp, skipPassEarned: true } });
});

// POST /api/quests/:id/fail — give up on today's active quest
questRouter.post('/:id/fail', async (req, res) => {
  const { id } = req.params;

  const activeQuest = await prisma.activeQuest.findUnique({ where: { id } });
  if (!activeQuest || activeQuest.status !== 'active') {
    res.status(404).json({ success: false, error: 'Active quest not found' });
    return;
  }

  const player = await prisma.player.findUnique({ where: { id: activeQuest.playerId } });
  if (!player) {
    res.status(404).json({ success: false, error: 'Player not found' });
    return;
  }

  // Mark as failed
  await prisma.activeQuest.update({
    where: { id },
    data: { status: 'failed' },
  });

  // Penalty: -30x baseLoss XP
  const rates = getLevelXpRates(player.level);
  const penaltyXp = rates.baseLoss * 30;
  await updatePlayerXp(player.id, player.xp - penaltyXp);

  res.json({ success: true, data: { xpLost: penaltyXp } });
});
