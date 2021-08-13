export enum AdminPermission {
  Login = 'admin.login',
}

export enum SettingsPermission {
  Show = 'settings.show',
  ShowHidden = 'settings.show_hidden',
  ShowDetails = 'settings.show_details',
  Add = 'settings.add',
  Edit = 'settings.edit',
  Remove = 'settings.remove',
}

export type Permission = AdminPermission | SettingsPermission

export const PERMISSIONS_TREE = {
  Admin: AdminPermission,
  Settings: SettingsPermission,
}

export type PermissionsTree = typeof PERMISSIONS_TREE
