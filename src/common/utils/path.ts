import { VITE_PUBLIC_PATH } from "@/common/constants/env"

/**
 * 获取带有base路径前缀的public资源路径
 * @param path public目录下的相对路径
 * @returns 完整的带base路径的资源路径
 * @example getPublicPath('images/logo.png') // 返回 '/game-h5/images/logo.png'
 */
export function getPublicPath(path: string): string {
  // 确保path不以/开头
  const cleanPath = path.startsWith("/") ? path.slice(1) : path
  // 确保VITE_PUBLIC_PATH以/结尾
  const basePath = VITE_PUBLIC_PATH.endsWith("/") ? VITE_PUBLIC_PATH : `${VITE_PUBLIC_PATH}/`

  return `${basePath}${cleanPath}`
}

/**
 * 获取游戏资源的完整路径
 * @param gamePath 游戏相对路径
 * @returns 完整的游戏资源路径
 */
export function getGamePath(gamePath: string): string {
  return getPublicPath(`games/${gamePath}`)
}

/**
 * 获取图片资源的完整路径
 * @param imagePath 图片相对路径
 * @returns 完整的图片资源路径
 */
export function getImagePath(imagePath: string): string {
  return getPublicPath(`images/${imagePath}`)
}
