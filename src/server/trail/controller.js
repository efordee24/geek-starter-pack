import { listTrailFiles, listPrototypeVersions } from '../common/helpers/prototype-registry.mjs'
import { baseViewContext } from '../common/helpers/view-context.mjs'

const filterByPrototype = (items, prototype) => {
  if (!prototype) return items
  return items.filter((item) => item.prototype === prototype)
}

export const getTrailHub = (request, h) => {
  const versions = listPrototypeVersions()
  const decisions = listTrailFiles('decisions')
  const reviews = listTrailFiles('reviews')
  return h.view('trail/trail-hub.njk', baseViewContext({
    pageTitle: 'Design trail',
    versions,
    decisionCount: decisions.length,
    reviewCount: reviews.length
  }))
}

export const getDecisions = (request, h) => {
  const prototype = request.query.prototype
  const items = filterByPrototype(listTrailFiles('decisions'), prototype)
  return h.view('trail/trail-list.njk', baseViewContext({
    pageTitle: 'Decision records',
    trailType: 'decisions',
    items,
    filterPrototype: prototype ?? '',
    versions: listPrototypeVersions()
  }))
}

export const getReviews = (request, h) => {
  const prototype = request.query.prototype
  const items = filterByPrototype(listTrailFiles('reviews'), prototype)
  return h.view('trail/trail-list.njk', baseViewContext({
    pageTitle: 'Review reports',
    trailType: 'reviews',
    items,
    filterPrototype: prototype ?? '',
    versions: listPrototypeVersions()
  }))
}
