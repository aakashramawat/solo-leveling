import { usePlayer } from '../hooks/usePlayer';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';
import PlayerBanner from '../components/ui/PlayerBanner';
import { LEVEL_MAP } from '@solo-leveling/shared';

export default function Profile() {
  const { player, loading } = usePlayer();

  if (loading || !player) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="font-mono text-gray-500 animate-pulse">Loading...</p>
      </div>
    );
  }

  const statEntries = [
    { key: 'intelligence', label: 'Intelligence', icon: '🧠', color: 'neon' as const },
    { key: 'charisma', label: 'Charisma', icon: '✨', color: 'arcane' as const },
    { key: 'willPower', label: 'Will Power', icon: '🔥', color: 'hp' as const },
  ];

  return (
    <div>
      <PageHeader title="PROFILE" subtitle="Hunter Information" />

      {/* Player Banner */}
      <PlayerBanner
        name={player.name}
        rank={player.rank}
        title={player.title}
        xp={player.xp}
        xpToEnter={player.xpToEnter}
        xpToPass={player.xpToPass}
        className="mb-6"
      />

      {/* Stats */}
      <h4 className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-3">
        Stats
      </h4>
      <Card className="mb-6">
        <div className="space-y-4">
          {statEntries.map(({ key, label, icon, color }) => {
            const value = player.stats[key as keyof typeof player.stats];
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-mono text-gray-300">
                    {icon} {label}
                  </span>
                  <span className="text-sm font-mono font-bold text-gray-200">
                    {value}%
                  </span>
                </div>
                <ProgressBar value={value} max={100} color={color} showLabel={false} size="md" />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Rank Progression */}
      <h4 className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-3">
        Rank Progression
      </h4>
      <Card>
        <div className="space-y-2">
          {LEVEL_MAP.map((info) => (
            <div
              key={info.level}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                info.level === player.level
                  ? 'bg-void-700 ring-1 ring-neon-500/30'
                  : info.level < player.level
                    ? 'opacity-50'
                    : 'opacity-25'
              }`}
            >
              <Badge rank={info.rank} size="sm" />
              <span className="text-sm text-gray-300 flex-1">{info.title}</span>
              {info.level < player.level && (
                <span className="text-xs text-green-400 font-mono">CLEARED</span>
              )}
              {info.level === player.level && (
                <span className="text-xs text-neon-400 font-mono">CURRENT</span>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
