import { getTrailHub, getDecisions, getReviews } from './controller.js'

export default {
  name: 'trail',
  register: async (server) => {
    server.route([
      { method: 'GET', path: '/trail', handler: getTrailHub },
      { method: 'GET', path: '/trail/decisions', handler: getDecisions },
      { method: 'GET', path: '/trail/reviews', handler: getReviews }
    ])
  }
}
