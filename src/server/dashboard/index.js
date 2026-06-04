import { getDashboard } from './controller.js'

export default {
  name: 'dashboard',
  register: async (server) => {
    server.route({
      method: 'GET',
      path: '/',
      handler: getDashboard
    })
  }
}
