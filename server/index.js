import staticFolder from 'koa-static-folder'
import koa from 'koa'
import Router from 'koa-router'
import handlebars from 'koa-handlebars'
import gzip from 'koa-gzip'

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
  .use(staticFolder("./client/assets/styles",'root', {maxage: 5 * 60 * 1000}))
  .use(staticFolder("./client/assets/images",'root', {maxage: 5 * 60 * 1000}))
  .use(gzip())
  
app.listen(process.env.PORT || 3000)
