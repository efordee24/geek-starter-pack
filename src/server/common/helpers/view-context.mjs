import { loadProjectConfig } from '../../../config/index.mjs'

export const baseViewContext = (extra = {}) => {
  const config = loadProjectConfig()
  return {
    serviceName: config.service.name,
    departmentName: config.department.name,
    departmentFullName: config.department.fullName,
    audience: config.service.audience,
    audienceNote: config.service.audienceNote,
    ...extra
  }
}
