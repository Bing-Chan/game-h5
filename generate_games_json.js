import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

// 获取当前目录路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 游戏目录路径
const gamesDir = path.join(__dirname, "public", "games", "yxmb")

// 游戏分类
const categories = ["动作", "益智", "休闲", "射击", "策略", "冒险"]

// 游戏数据数组
const gamesData = []

// 从index.html中提取游戏名称的函数
function extractGameName(dirPath) {
  const indexPath = path.join(dirPath, "index.html")
  try {
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, "utf8")
      // 尝试从title标签中提取
      const titleMatch = content.match(/<title>([^<]+)<\/title>/i)
      if (titleMatch && titleMatch[1].trim()) {
        return titleMatch[1].trim()
      }
      // 尝试从h1-h3标签中提取
      const headingMatch = content.match(/<h[1-3][^>]*>([^<]+)<\/h[1-3]>/i)
      if (headingMatch && headingMatch[1].trim()) {
        return headingMatch[1].trim()
      }
    }
  } catch (error) {
    console.error(`读取 ${indexPath} 时出错:`, error)
  }
  return ""
}

// 查找游戏图片的函数
function findGameImage(dirPath) {
  const possibleImageDirs = ["images", "img", "imgs", "bitmap", "_img", "picture"]

  // 先在根目录查找常见图片
  const rootFiles = fs.readdirSync(dirPath)
  for (const file of rootFiles) {
    const ext = path.extname(file).toLowerCase()
    if ([".jpg", ".jpeg", ".png", ".gif"].includes(ext)) {
      // 优先选择logo或icon
      if (file.toLowerCase().includes("logo") || file.toLowerCase().includes("icon")) {
        return `/games/yxmb/${path.basename(dirPath)}/${file}`
      }
    }
  }

  // 然后在图片目录中查找
  for (const imgDir of possibleImageDirs) {
    const imgDirPath = path.join(dirPath, imgDir)
    if (fs.existsSync(imgDirPath) && fs.statSync(imgDirPath).isDirectory()) {
      const imgFiles = fs.readdirSync(imgDirPath)
      for (const file of imgFiles) {
        const ext = path.extname(file).toLowerCase()
        if ([".jpg", ".jpeg", ".png", ".gif"].includes(ext)) {
          // 优先选择logo、icon或较大的图片
          if (file.toLowerCase().includes("logo")
            || file.toLowerCase().includes("icon")
            || file.toLowerCase().includes("cover")
            || file.toLowerCase().includes("banner")) {
            return `/games/yxmb/${path.basename(dirPath)}/${imgDir}/${file}`
          }
        }
      }
      // 如果找到图片目录但没有特殊命名的图片，返回第一张
      if (imgFiles.length > 0) {
        const firstImg = imgFiles.find(file =>
          [".jpg", ".jpeg", ".png", ".gif"].includes(path.extname(file).toLowerCase())
        )
        if (firstImg) {
          return `/games/yxmb/${path.basename(dirPath)}/${imgDir}/${firstImg}`
        }
      }
    }
  }

  // 如果找不到图片，使用默认图片
  return `/games/images/logo.png`
}

// 生成游戏描述
function generateDescription(category) {
  const descriptions = {
    动作: "这是一款刺激的动作游戏，操作简单但富有挑战性，快来体验吧！",
    益智: "这款益智游戏能够锻炼你的思维能力，多种关卡等你来挑战！",
    休闲: "轻松愉快的休闲游戏，适合在碎片时间玩耍，放松心情！",
    射击: "紧张刺激的射击游戏，精准的操作和反应速度是获胜的关键！",
    策略: "考验你策略思维的游戏，合理规划才能取得胜利！",
    冒险: "踏上奇幻冒险之旅，探索未知的世界，解锁更多精彩内容！"
  }
  return descriptions[category] || "这是一款有趣的小游戏，快来体验吧！"
}

// 主函数
function generateGamesJSON() {
  try {
    // 读取游戏目录
    const dirs = fs.readdirSync(gamesDir)

    // 过滤出数字目录
    const gameDirs = dirs.filter((dir) => {
      const dirPath = path.join(gamesDir, dir)
      return fs.statSync(dirPath).isDirectory() && !isNaN(Number.parseInt(dir))
    }).sort((a, b) => Number.parseInt(a) - Number.parseInt(b))

    console.log(`找到 ${gameDirs.length} 个游戏目录`)

    // 遍历每个游戏目录
    gameDirs.forEach((dir, index) => {
      const dirPath = path.join(gamesDir, dir)
      const gameId = Number.parseInt(dir)

      // 提取游戏名称
      let gameName = extractGameName(dirPath)
      if (!gameName) {
        gameName = `游戏 ${gameId}`
      }

      // 随机分配分类
      const category = categories[Math.floor(Math.random() * categories.length)]

      // 查找游戏图片
      const image = findGameImage(dirPath)

      // 生成描述
      const description = generateDescription(category)

      // 添加游戏数据
      gamesData.push({
        id: gameId,
        name: gameName,
        category,
        image,
        description
      })

      console.log(`处理游戏 ${index + 1}/${gameDirs.length}: ${gameName} (${gameId})`)
    })

    // 将数据写入JSON文件
    const outputPath = path.join(__dirname, "public", "games", "games_data.json")
    fs.writeFileSync(outputPath, JSON.stringify(gamesData, null, 2))

    console.log(`\n游戏数据生成完成！`)
    console.log(`共生成 ${gamesData.length} 个游戏数据`)
    console.log(`数据已保存到: ${outputPath}`)

    // 同时输出简化版本供Vue组件使用
    const vueOutputPath = path.join(__dirname, "src", "common", "constants", "games.ts")
    const tsContent = `// 游戏数据常量\nexport const gamesData = ${JSON.stringify(gamesData, null, 2)};\n`

    // 确保目录存在
    const tsDir = path.dirname(vueOutputPath)
    if (!fs.existsSync(tsDir)) {
      fs.mkdirSync(tsDir, { recursive: true })
    }

    fs.writeFileSync(vueOutputPath, tsContent)
    console.log(`TypeScript常量已保存到: ${vueOutputPath}`)
  } catch (error) {
    console.error("生成游戏数据时出错:", error)
  }
}

// 执行脚本
generateGamesJSON()
