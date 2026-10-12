import { useState, useEffect } from 'react';
import type { LocalTimeInfo } from '../../types/phase4.types';

interface Props {
  timeInfo: LocalTimeInfo | null;
  loading?: boolean;
}

export function LocalTimeClock({ timeInfo, loading }: Props) {
  const [displayTime, setDisplayTime] = useState<string>('--:-- --');
  const [displayDate, setDisplayDate] = useState<string>('');

  useEffect(() => {
    if (!timeInfo) return;

    // Parse the timezone from the timeInfo and tick a live clock
    const tick = () => {
      try {
        const now = new Date();
        const opts: Intl.DateTimeFormatOptions = {
          timeZone: timeInfo.timezoneId,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        };
        const dateOpts: Intl.DateTimeFormatOptions = {
          timeZone: timeInfo.timezoneId,
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        };
        setDisplayTime(new Intl.DateTimeFormat('en-US', opts).format(now));
        setDisplayDate(new Intl.DateTimeFormat('en-US', dateOpts).format(now));
      } catch {
        setDisplayTime(timeInfo.timeFormatted);
        setDisplayDate(timeInfo.dateFormatted);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [timeInfo]);

  if (loading) {
    return (
      <div className="local-time-clock local-time-clock--loading">
        <div className="local-time-clock__time">--:-- --</div>
        <div className="local-time-clock__label">Loading local time...</div>
      </div>
    );
  }

  if (!timeInfo) return null;

  return (
    <div className="local-time-clock">
      <div className="local-time-clock__time">{displayTime}</div>
      <div className="local-time-clock__date">{displayDate}</div>
      <div className="local-time-clock__meta">
        <span className="local-time-clock__tz">{timeInfo.timezoneId}</span>
        <span className="local-time-clock__offset">{timeInfo.offsetFormatted}</span>
        {timeInfo.isDaylightSaving && (
          <span className="local-time-clock__dst">DST</span>
        )}
      </div>
    </div>
  );
}
