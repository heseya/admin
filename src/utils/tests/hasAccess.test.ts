import { PERMISSIONS_TREE as P } from '@/consts/permissions'
import { hasAccess } from '../hasAccess'

// write test for hasAccess
describe('hasAccess', () => {
  it('should return true if user has permission all required permissions', () => {
    expect(hasAccess(P.Settings.Show)([P.Settings.Show])).toBe(true)
    expect(hasAccess([P.Settings.Show, P.Admin.Login])([P.Settings.Show, P.Admin.Login])).toBe(true)
    expect(hasAccess([P.Settings.Show])([P.Settings.Show, P.Admin.Login])).toBe(true)
  })

  it('should return true if user has permission any of required permissions', () => {
    expect(hasAccess([P.Settings.Show, P.Admin.Login], true)([P.Admin.Login])).toBe(true)
    expect(hasAccess([P.Settings.Show, P.Settings.Add], true)([P.Settings.Show])).toBe(true)
  })

  it('should return false if user dont have permission', () => {
    expect(hasAccess(P.Settings.Show, true)([P.Settings.Add])).toBe(false)
    expect(hasAccess([P.Admin.Login, P.Settings.Add], true)([P.Settings.Show])).toBe(false)

    expect(hasAccess(P.Settings.Show)([P.Settings.Add])).toBe(false)
    expect(hasAccess([P.Admin.Login, P.Settings.Add])([P.Settings.Show])).toBe(false)
    expect(hasAccess([P.Admin.Login, P.Settings.Show])([P.Settings.Show])).toBe(false)
    expect(
      hasAccess([P.Settings.Show, P.Settings.Add, P.Admin.Login])([P.Settings.Show, P.Admin.Login]),
    ).toBe(false)
    expect(hasAccess([P.Settings.Show])([P.Settings.Edit, P.Admin.Login])).toBe(false)
  })

  it('should return false if invalid input', () => {
    expect(hasAccess({} as any)([null as any])).toBe(false)
    expect(hasAccess(null as any, true)([P.Settings.Add])).toBe(false)
    expect(hasAccess([{} as any], true)([{} as any])).toBe(false)
  })
})
