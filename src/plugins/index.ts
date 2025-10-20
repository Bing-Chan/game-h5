import type { App } from "vue"
import { Badge, Button, Cell, Empty, Loading, showNotify, Image as VanImage } from "vant"
import { installConsole } from "./console"
import { installI18n } from "./i18n"
import { installPermissionDirective } from "./permission-directive"
import "vant/lib/index.css"

// 安装Vant组件
export function installVant(app: App) {
  // 注册需要的组件
  app.use(Button)
  app.use(Cell)
  app.use(Badge)
  app.use(VanImage)
  app.use(Empty)
  app.use(Loading)

  // 注册全局属性
  app.config.globalProperties.$notify = showNotify
}

export function installPlugins(app: App) {
  installPermissionDirective(app)
  installConsole()
  installI18n(app)
  installVant(app)
}
