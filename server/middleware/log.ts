export default defineEventHandler((event) => {
  console.log(`\u001b[34m[${new Date().toLocaleTimeString()}] \u001b[0m${event.node.req.url}`)
})
