/**
 * 环境变量常量定义
 */

// 从Vite环境变量中获取base路径
export const VITE_PUBLIC_PATH = import.meta.env.VITE_PUBLIC_PATH || "/"

// 从Vite环境变量中获取路由历史模式
export const VITE_ROUTER_HISTORY = import.meta.env.VITE_ROUTER_HISTORY || "hash"

// 导出其他常用环境变量（如果需要）
export const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api"
export const VITE_APP_TITLE = import.meta.env.VITE_APP_TITLE || "游戏H5平台"
export const VITE_APP_ENV = import.meta.env.NODE_ENV || "development"
