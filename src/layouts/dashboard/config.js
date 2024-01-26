import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import FolderIcon from '@heroicons/react/24/solid/FolderIcon';
import LockClosedIcon from '@heroicons/react/24/solid/LockClosedIcon';
import PlusCircleIcon from '@heroicons/react/24/solid/PlusCircleIcon';
import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import UserPlusIcon from '@heroicons/react/24/solid/UserPlusIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import XCircleIcon from '@heroicons/react/24/solid/XCircleIcon';
import { SvgIcon } from '@mui/material';

export const items = [
  {
    title: 'Nouveau projet',
    path: '/new_project',
    icon: (
      <SvgIcon fontSize="small">
        <PlusCircleIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Mes projets',
    path: '/my_projects',
    icon: (
      <SvgIcon fontSize="small">
        <FolderIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Mon profil',
    path: '/account',
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    )
  }
];
