import type { NamedRoles } from '../../types';

import { iconName as entityIconName } from '../entities/icon';
import { iconName as sourceIconName } from '../sources/icon';

enum RoleIcon {
  entity = entityIconName,
  lobbyist = 'briefcase',
  official = 'landmark',
  source = sourceIconName,
}

export const getIconName = (role: keyof NamedRoles) => RoleIcon[role];
