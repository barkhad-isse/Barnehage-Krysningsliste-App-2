import { ChevronRight, Users, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { Department, useLanguage } from '../App';

type DepartmentListProps = {
  departments: Department[];
  onSelectDepartment: (department: Department) => void;
  onLogout: () => void;
  onOpenSettings: () => void;
};

const departmentColors: Record<string, string> = {
  'Blåbær': 'bg-blue-100 text-blue-700',
  'Jordbær': 'bg-red-100 text-red-700',
  'Solstrålen': 'bg-amber-100 text-amber-700',
};

export function DepartmentList({ departments, onSelectDepartment, onLogout, onOpenSettings }: DepartmentListProps) {
  const { t } = useLanguage();
  
  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white px-6 py-8 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-slate-800">{t('departments')}</h1>
          <div className="flex gap-2">
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="text-slate-600 mt-1">{t('selectDepartment')}</p>
      </div>

      <div className="flex-1 p-6 space-y-4 overflow-y-auto pb-24">
        {departments.map((department) => {
          const presentCount = department.children.filter(child => child.status === 'present').length;
          const totalCount = department.children.length;
          const colorClass = departmentColors[department.name] || 'bg-slate-100 text-slate-700';
          
          return (
            <button
              key={department.id}
              onClick={() => onSelectDepartment(department)}
              className="w-full bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl ${colorClass} flex items-center justify-center`}>
                    <Users className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-slate-800">{department.name}</h2>
                    <p className="text-slate-600 mt-1">
                      {presentCount} {t('of')} {totalCount} {t('present').toLowerCase()}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-400" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}