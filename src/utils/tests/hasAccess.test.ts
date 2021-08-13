import { AdminPermission, SettingsPermission } from '../../interfaces/Permissions'
import { hasAccess } from '../hasAccess'

// write test for hasAccess
describe('hasAccess', () => {
  it('should return true if user has permission', () => {
    expect(hasAccess(SettingsPermission.Show)([SettingsPermission.Show])).toBe(true)
    expect(
      hasAccess([SettingsPermission.Show, AdminPermission.Login])([
        SettingsPermission.Show,
        AdminPermission.Login,
      ]),
    ).toBe(true)
    expect(
      hasAccess([SettingsPermission.Show])([SettingsPermission.Show, AdminPermission.Login]),
    ).toBe(true)
  })

  it('should return false if user dont have permission', () => {
    expect(hasAccess(SettingsPermission.Show)([SettingsPermission.Add])).toBe(false)
    expect(
      hasAccess([AdminPermission.Login, SettingsPermission.Add])([SettingsPermission.Show]),
    ).toBe(false)
    expect(
      hasAccess([AdminPermission.Login, SettingsPermission.Show])([SettingsPermission.Show]),
    ).toBe(false)
    expect(
      hasAccess([SettingsPermission.Show, SettingsPermission.Add, AdminPermission.Login])([
        SettingsPermission.Show,
        AdminPermission.Login,
      ]),
    ).toBe(false)
    expect(
      hasAccess([SettingsPermission.Show])([SettingsPermission.Edit, AdminPermission.Login]),
    ).toBe(false)
  })
})
