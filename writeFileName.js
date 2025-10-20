/**
 * 遍历指定目录下的所有MP3文件，生成songs.json文件
 */
import fs from 'fs'
import path from 'path'

// 要处理的目录列表
const directories = [
  './public/mp3/music',
  './public/mp3/book'
]

// Gitee 仓库基础URL
const GITEE_BASE_URL = 'https://gitee.com/duochan/ai-space/raw/master'

function generateSongsJson() {
  let totalFiles = 0
  
  directories.forEach(directory => {
    try {
      // 获取目录下的所有文件
      const files = fs.readdirSync(directory)
      
      // 过滤出MP3文件
      const mp3Files = files.filter(file => path.extname(file).toLowerCase() === '.mp3')
      
      if (mp3Files.length === 0) {
        console.log(`\x1b[33m 目录 ${directory} 中没有找到MP3文件 \x1b[0m`)
        return
      }
      
      // 生成songs.json内容
      const songsData = mp3Files.map(file => ({
        title: file,
        file: `${GITEE_BASE_URL}/${directory.replace('./', '')}/${encodeURIComponent(file)}`
      }))
      
      // 写入songs.json文件
      const outputPath = path.join(directory, 'songs.json')
      fs.writeFileSync(outputPath, JSON.stringify(songsData, null, 2), 'utf8')
      
      console.log(`\x1b[32m 成功生成 ${outputPath}，共包含 ${mp3Files.length} 个文件 \x1b[0m`)
      totalFiles += mp3Files.length
      
    } catch (error) {
      console.error(`\x1b[31m 处理目录 ${directory} 时出错: ${error.message} \x1b[0m`)
    }
  })
  
  console.log(`
\x1b[32m 所有目录处理完成，共生成 ${totalFiles} 个文件的信息 \x1b[0m`)
}

generateSongsJson()