import {
  listPrototypeVersions,
  listTrailFiles
} from '../common/helpers/prototype-registry.mjs'
import { baseViewContext } from '../common/helpers/view-context.mjs'

export const getDashboard = (request, h) => {
  const versions = listPrototypeVersions()
  return h.view('dashboard/dashboard.njk', baseViewContext({
    navActive: 'dashboard',
    pageTitle: 'Prototype dashboard',
    versions,
    decisionCount: listTrailFiles('decisions').length,
    reviewCount: listTrailFiles('reviews').length
  }))
}
