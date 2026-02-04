import type { NamedRoles } from '../../types';

enum RoleIcon {
  entity = 'building',
  lobbyist = 'briefcase',
  official = 'landmark',
}

export const getIconName = (role: keyof NamedRoles) => RoleIcon[role];
