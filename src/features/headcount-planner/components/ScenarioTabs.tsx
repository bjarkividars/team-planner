import { useState, useRef, useEffect } from 'react';
import { Plus, X, Pencil, MoreVertical, Trash2 } from 'lucide-react';
import { useScenarioContext } from '../hooks/useScenarioContext';
import { Menu, MenuTrigger, MenuContent, MenuItem } from '../../../components/ui/Menu';
import { Dialog, DialogContent, DialogTitle } from '../../../components/ui/Dialog';

interface ScenarioTabsProps {
  variant?: 'desktop' | 'mobile';
}

function DesktopScenarioTab({ index }: { index: number }) {
  const {
    scenarios,
    activeIndex,
    scenarioCount,
    switchScenario,
    deleteScenario,
    renameScenario,
  } = useScenarioContext();

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const scenario = scenarios[index];
  const isActive = activeIndex === index;
  const displayName = scenario.name || `Scenario ${index + 1}`;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditValue(scenario.name || '');
    setIsEditing(true);
  };

  const handleSave = () => {
    renameScenario(index, editValue.trim());
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="px-3 py-1.5 text-sm rounded-t-lg flex items-center bg-(--color-bg)">
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          placeholder={`Scenario ${index + 1}`}
          className="w-28 px-1 py-0 text-sm bg-transparent border-b border-(--g-60) outline-none"
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => switchScenario(index)}
      className={`
        group relative px-3 py-1.5 text-sm rounded-t-lg
        transition-colors duration-150 flex items-center
        ${isActive
          ? 'bg-(--color-bg) text-(--g-10) font-medium'
          : 'bg-(--g-92) text-(--g-40) hover:bg-(--g-88) hover:text-(--g-20)'
        }
      `}
    >
      <span>{displayName}</span>
      {isActive && (
        <span className="flex items-center">
          <span className="w-0 group-hover:w-6.5 transition-all">
            <span
              role="button"
              onClick={handleStartEdit}
              className="ml-1.5 w-5 h-5 opacity-0 group-hover:opacity-100  rounded flex items-center justify-center hover:bg-(--g-92) transition-all"
            >
              <Pencil size={12} className="text-(--g-40)" />
            </span>
          </span>
          {scenarioCount > 1 && (
            <span className="w-0 group-hover:w-6 transition-all">
              <span
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteScenario(index);
                }}
                className="ml-1 w-5 h-5 opacity-0 group-hover:opacity-100 rounded flex items-center justify-center hover:bg-(--g-92) transition-all text-red-500 hover:text-red-600"
              >
                <X size={14} className="text-(--g-40)" />
              </span>
            </span>
          )}
        </span>
      )}
    </button>
  );
}

function MobileScenarioTab({ index }: { index: number }) {
  const {
    scenarios,
    activeIndex,
    scenarioCount,
    switchScenario,
    deleteScenario,
    renameScenario,
  } = useScenarioContext();

  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const scenario = scenarios[index];
  const isActive = activeIndex === index;
  const displayName = scenario.name || `Scenario ${index + 1}`;

  useEffect(() => {
    if (showRenameDialog && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [showRenameDialog]);

  const handleOpenRename = () => {
    setEditValue(scenario.name || '');
    setShowRenameDialog(true);
  };

  const handleSaveRename = () => {
    renameScenario(index, editValue.trim());
    setShowRenameDialog(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveRename();
    } else if (e.key === 'Escape') {
      setShowRenameDialog(false);
    }
  };

  return (
    <>
      <button
        onClick={() => !isActive && switchScenario(index)}
        className={`chip shrink-0 text-sm ${isActive ? 'chip-active' : ''}`}
      >
        <span>{displayName}</span>
        {isActive && (
          <Menu>
            <MenuTrigger className="p-0.5 -mr-1 rounded hover:bg-(--g-80)/20">
              <MoreVertical size={14} />
            </MenuTrigger>
            <MenuContent>
              <MenuItem onClick={handleOpenRename}>
                <span className="flex items-center gap-2">
                  <Pencil size={14} />
                  Rename
                </span>
              </MenuItem>
              {scenarioCount > 1 && (
                <MenuItem onClick={() => deleteScenario(index)}>
                  <span className="flex items-center gap-2 text-red-500">
                    <Trash2 size={14} />
                    Delete
                  </span>
                </MenuItem>
              )}
            </MenuContent>
          </Menu>
        )}
      </button>

      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogTitle>Rename Scenario</DialogTitle>
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Scenario ${index + 1}`}
            className="w-full px-3 py-2 text-sm border border-(--g-88) rounded-lg outline-none focus:border-(--g-60)"
          />
          <div className="flex gap-2 justify-end mt-4">
            <button
              className="btn-ghost btn-sm"
              onClick={() => setShowRenameDialog(false)}
            >
              Cancel
            </button>
            <button
              className="btn-primary btn-sm"
              onClick={handleSaveRename}
            >
              Save
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function ScenarioTabs({ variant = 'desktop' }: ScenarioTabsProps) {
  const { scenarioCount, canAddScenario, addScenario } = useScenarioContext();

  if (variant === 'mobile') {
    return (
      <div className="flex items-center gap-2 px-3 py-2 overflow-x-auto scrollbar-hide">
        {Array.from({ length: scenarioCount }, (_, i) => (
          <MobileScenarioTab key={i} index={i} />
        ))}

        {canAddScenario && (
          <button
            onClick={addScenario}
            className="p-2 rounded-full bg-(--g-96) text-(--g-40) shrink-0"
            title="Add scenario"
          >
            <Plus size={16} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-end gap-0.5 pl-2 md:pl-4">
      {Array.from({ length: scenarioCount }, (_, i) => (
        <DesktopScenarioTab key={i} index={i} />
      ))}

      {canAddScenario && (
        <button
          onClick={addScenario}
          className="px-2 py-1.5 h-8 rounded-t-lg bg-(--g-92) hover:bg-(--g-88) text-(--g-40) hover:text-(--g-20) transition-colors"
          title="Add scenario"
        >
          <Plus size={16} />
        </button>
      )}
    </div>
  );
}
