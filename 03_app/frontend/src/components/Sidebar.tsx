'use strict';
import React from 'react';
import { 
  LayoutDashboard, 
  TableProperties, 
  Bot, 
  UserCheck, 
  FileText, 
  Settings,
  HelpCircle
} from 'lucide-react';

export type TabKey = 'dashboard' | 'audit' | 'ai_assistant' | 'profiles' | 'research' | 'rules';

interface SidebarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  unresolvedCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, unresolvedCount }) => {
  const menuItems: { id: TabKey; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'dashboard',
      label: 'Tổng quan lớp',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      id: 'audit',
      label: 'Bảng thi đua & Rà soát',
      icon: <TableProperties className="w-5 h-5" />,
      badge: unresolvedCount
    },
    {
      id: 'ai_assistant',
      label: 'Trợ lý nhận xét AI',
      icon: <Bot className="w-5 h-5" />
    },
    {
      id: 'profiles',
      label: 'Hồ sơ tiến bộ học sinh',
      icon: <UserCheck className="w-5 h-5" />
    },
    {
      id: 'research',
      label: 'Minh chứng NCKH & Báo cáo',
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 'rules',
      label: 'Quy tắc nghiệp vụ (BR)',
      icon: <Settings className="w-5 h-5" />
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Phân hệ chức năng
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-xs border border-indigo-100 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={isActive ? 'text-indigo-600' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info box for Research / Guidance */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/70 m-3 rounded-2xl">
        <div className="flex items-start space-x-2.5">
          <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600">
            <p className="font-semibold text-slate-800">Đề tài NCKH Lớp 2G3</p>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Vòng lặp: Ghi nhận → Rà soát số → AI phân tích → Giáo viên phê duyệt.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
