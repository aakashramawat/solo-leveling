import { Router } from 'express';
import { calculateTaskXpGain, calculateTaskXpLoss, getLevelForXp, getLevelInfo } from '@solo-leveling/shared';
import type { TaskCategory } from '@solo-leveling/shared';
import { prisma } from '../index.js';

// Update player XP and recalculate level from total XP
async function updatePlayerXp(playerId: string, newXp: number) {
  const xp = Math.max(0, newXp);
  const level = getLevelForXp(xp);
  const info = getLevelInfo(level);

  return prisma.player.update({
    where: { id: playerId },
    data: { xp, level, title: info.title },
  });
}

export const taskRouter = Router();

// List tasks (optionally filter by status or category)
taskRouter.get('/', async (req, res) => {
  const { status, category } = req.query;
  const player = await prisma.player.findFirst();

  if (!player) {
    res.status(404).json({ success: false, error: 'Player not found' });
    return;
  }

  const tasks = await prisma.task.findMany({
    where: {
      playerId: player.id,
      ...(status ? { status: status as string } : {}),
      ...(category ? { category: category as string } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ success: true, data: tasks });
});

// Create task — XP gain/loss auto-calculated from player's current level + category
taskRouter.post('/', async (req, res) => {
  const player = await prisma.player.findFirst();
  if (!player) {
    res.status(404).json({ success: false, error: 'Player not found' });
    return;
  }

  const { title, description, category } = req.body as {
    title: string;
    description?: string;
    category: TaskCategory;
  };

  if (!title || !category) {
    res.status(400).json({ success: false, error: 'title and category are required' });
    return;
  }

  const xpGain = calculateTaskXpGain(player.level, category);
  const xpLoss = calculateTaskXpLoss(player.level, category);

  const task = await prisma.task.create({
    data: {
      title,
      description: description || '',
      category,
      xpGain,
      xpLoss,
      playerId: player.id,
    },
  });

  res.json({ success: true, data: task });
});

// Complete task → gain XP
taskRouter.put('/:id/complete', async (req, res) => {
  const task = await prisma.task.findUnique({ where: { id: req.params.id } });

  if (!task) {
    res.status(404).json({ success: false, error: 'Task not found' });
    return;
  }

  if (task.status !== 'active') {
    res.status(400).json({ success: false, error: 'Task is not active' });
    return;
  }

  const updatedTask = await prisma.task.update({
    where: { id: task.id },
    data: {
      status: 'completed',
      completedAt: new Date(),
    },
  });

  const player = await prisma.player.findUnique({ where: { id: task.playerId } });
  if (player) {
    await updatePlayerXp(player.id, player.xp + task.xpGain);
  }

  res.json({ success: true, data: updatedTask });
});

// Fail task → lose XP
taskRouter.put('/:id/fail', async (req, res) => {
  const task = await prisma.task.findUnique({ where: { id: req.params.id } });

  if (!task) {
    res.status(404).json({ success: false, error: 'Task not found' });
    return;
  }

  if (task.status !== 'active') {
    res.status(400).json({ success: false, error: 'Task is not active' });
    return;
  }

  const updatedTask = await prisma.task.update({
    where: { id: task.id },
    data: { status: 'failed' },
  });

  const player = await prisma.player.findUnique({ where: { id: task.playerId } });
  if (player) {
    await updatePlayerXp(player.id, player.xp - task.xpLoss);
  }

  res.json({ success: true, data: updatedTask });
});
