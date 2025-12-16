import React from 'react';
import logo from '../../../../resources/icon.png';

export const SidebarHeader: React.FC = React.memo(() => (
  <div className="flex items-center gap-3 pb-3 border-b p-4 border-border select-none">
    <img src={logo} alt="LB logo" className="w-12 h-12" draggable={false} />
    <div>
      <h1 className="text-lg font-head font-bold text-white">LB</h1>
      <p className="text-xs text-text-muted">Українізатори ігор</p>
    </div>
  </div>
));
