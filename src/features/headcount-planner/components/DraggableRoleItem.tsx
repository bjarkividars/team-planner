import { useDraggable } from '@dnd-kit/core';
import type { Role, LocationKey } from '../types';
import { RoleCard } from './RoleCard';

interface DraggableRoleItemProps {
  role: Role;
  location: LocationKey;
}

export function DraggableRoleItem({ role, location }: DraggableRoleItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } =
    useDraggable({
      id: `palette-${role.id}`,
      data: {
        role,
        type: 'palette-role',
      },
    });

  return (
    <div
      ref={setNodeRef}
      data-draggable-id={`palette-${role.id}`}
      {...listeners}
      {...attributes}
      className={`
        cursor-grab active:cursor-grabbing
        transition-all duration-150
        ${isDragging ? 'opacity-70' : ''}
      `}
    >
      <div className="relative group">
        <RoleCard role={role} location={location} />
        <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-black/5 transition-colors pointer-events-none" />
      </div>
    </div>
  );
}
