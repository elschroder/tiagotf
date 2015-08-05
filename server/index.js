import staticFolder from 'koa-static-folder'
import koa from 'koa'
import Router from 'koa-router'
import handlebars from 'koa-handlebars'

var app = module.exports = koa()
var router = new Router()

app.use(handlebars({
  viewsDir: 'server/views',
  defaultLayout: "template"
}))

app.use(function* (next) {
  try {
    yield* next
  } catch (err) {
    console.error('an error occured! writing a response')
    this.response.status = 500
    this.response.body = err.message
  }
})

router.get('/', function *(next) {
  yield this.render("home");
})

app
  .use(router.routes())
  .use(router.allowedMethods())

  app.use(staticFolder("./client/assets/styles",'path'))
  app.use(staticFolder("./client/assets/images",'path'))

app.listen(process.env.PORT || 3000)
