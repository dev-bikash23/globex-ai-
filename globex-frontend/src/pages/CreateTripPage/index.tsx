import { Link } from 'react-router-dom';
import { CreateTripWizard } from '../../features/trips/components/CreateTripWizard';

export default function CreateTripPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/trips" className="text-slate-400 hover:text-white transition-colors text-sm">← My Trips</Link>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300 text-sm">New Trip</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-8">Plan a New Trip</h1>
        <CreateTripWizard />
      </div>
    </div>
  );
}
