import { Users, User, Heart } from 'lucide-react';
import { UserType } from '../App';

type UserTypeSelectionProps = {
  onSelectUserType: (type: UserType) => void;
};

export function UserTypeSelection({ onSelectUserType }: UserTypeSelectionProps) {
  return (
    <div className="h-full flex flex-col justify-between p-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <Heart className="w-10 h-10 text-blue-600" fill="currentColor" />
          </div>
          <h1 className="text-slate-800 mb-2">Barnehage Kryssliste</h1>
          <p className="text-slate-600">Hvem er du?</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onSelectUserType('staff')}
            className="w-full bg-white border-2 border-slate-200 rounded-2xl p-6 hover:border-blue-400 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-left">
                <h2 className="text-slate-800">Ansatt</h2>
                <p className="text-slate-600 mt-1">
                  Se alle avdelinger og barn
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onSelectUserType('parent')}
            className="w-full bg-white border-2 border-slate-200 rounded-2xl p-6 hover:border-blue-400 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
                <User className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-left">
                <h2 className="text-slate-800">Forelder</h2>
                <p className="text-slate-600 mt-1">
                  Se ditt barn
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
