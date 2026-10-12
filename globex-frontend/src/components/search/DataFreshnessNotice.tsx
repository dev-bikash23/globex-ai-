interface Props {
  isTestData: boolean;
  dataNotice: string | null;
  type: 'flight' | 'hotel' | 'activity';
}

export default function DataFreshnessNotice({ isTestData, dataNotice, type }: Props) {
  if (!isTestData || !dataNotice) return null;

  const config = {
    flight: {
      icon: '🧪',
      badge: 'Sandbox Data',
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    },
    hotel: {
      icon: '🎭',
      badge: 'Demo Data',
      color: 'from-purple-500/20 to-violet-500/10 border-purple-500/30 text-purple-300',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    },
    activity: {
      icon: '🎭',
      badge: 'Demo Data',
      color: 'from-purple-500/20 to-violet-500/10 border-purple-500/30 text-purple-300',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    },
  }[type];

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border bg-gradient-to-r ${config.color} mb-4`}>
      <span className="text-xl shrink-0 mt-0.5">{config.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${config.badgeColor}`}>
            {config.badge}
          </span>
        </div>
        <p className="text-xs leading-relaxed opacity-90">{dataNotice}</p>
      </div>
    </div>
  );
}
