<script setup lang="ts">
import { showNotify } from "vant"
import { computed, onMounted, ref } from "vue"
import { gamesData } from "@/common/constants/games"
import { router } from "@/router"

// 游戏数据类型
interface Game {
  id: number
  name: string
  category: string
  image: string
  description: string
}

// 状态管理
const searchQuery = ref("")
const selectedCategory = ref("全部")
const isLoading = ref(false)
const gameList = ref<Game[]>([])

// 获取所有游戏分类（包含"全部"）
const categories = computed(() => {
  const uniqueCategories = [...new Set(gamesData.map(game => game.category))]
  return ["全部", ...uniqueCategories].sort()
})

// 过滤后的游戏列表
const filteredGames = computed(() => {
  let filtered = gameList.value

  // 分类过滤
  if (selectedCategory.value !== "全部") {
    filtered = filtered.filter(game => game.category === selectedCategory.value)
  }

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      game => game.name.toLowerCase().includes(query)
        || game.description.toLowerCase().includes(query)
    )
  }

  return filtered
})

// 切换分类
function changeCategory(category: string) {
  selectedCategory.value = category
}

// 搜索游戏
function searchGames() {
  if (!searchQuery.value.trim()) {
    showNotify({
      type: "warning",
      message: "请输入搜索内容"
    })
  }
}

// 进入游戏
function enterGame(game: Game) {
  showNotify({
    type: "success",
    message: `即将进入 ${game.name}`
  })
  // 打开游戏页面
  const gameUrl = `/games/yxmb/${game.id}/index.html`
  window.open(gameUrl, "_blank")
}

// 页面加载时初始化
onMounted(() => {
  isLoading.value = true

  // 模拟API请求延迟，让用户看到加载效果
  setTimeout(() => {
    gameList.value = gamesData
    isLoading.value = false
  }, 300)
})
</script>

<template>
  <div class="game-list-container" un-min-h-screen un-bg-body-bg-color un-py-12px un-px-16px>
    <!-- 搜索区域 -->
    <div class="search-section" un-mb-16px>
      <div class="search-bar" un-flex un-items-center un-bg-bg-color un-rounded-20px un-px-16px un-h-40px>
        <van-icon name="search" color="#B6C3D2" un-mr-8px />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索游戏名称或描述"
          un-flex-1 un-h-full un-bg-transparent un-border-none un-outline-none un-text-base un-color-body-text-color
          @keyup.enter="searchGames"
        >
      </div>
    </div>

    <!-- 分类标签 -->
    <div class="category-section" un-mb-16px>
      <div class="category-scroll" un-overflow-x-auto un-whitespace-nowrap un-pb-8px>
        <div
          v-for="category in categories"
          :key="category"
          class="category-tag"
          :class="{ active: selectedCategory === category }"
          un-inline-block un-px-16px un-py-6px un-mr-12px un-rounded-99px un-text-sm
          :un-bg="selectedCategory === category ? 'primary-color' : 'bg-color'"
          :un-color="selectedCategory === category ? '#fff' : 'body-text-color'"
          @click="changeCategory(category)"
        >
          {{ category }}
        </div>
      </div>
    </div>

    <!-- 游戏列表 -->
    <div v-if="!isLoading" class="game-grid" un-grid-cols-2 un-gap-12px>
      <div
        v-for="game in filteredGames"
        :key="game.id"
        class="game-card"
        un-bg-bg-color un-rounded-12px un-overflow-hidden un-transition-all-300 un-shadow-md un-active-scale-98
        @click="enterGame(game)"
      >
        <!-- 游戏图片 -->
        <div class="game-image-container" un-relative un-w-full un-h-120px un-overflow-hidden un-bg-gray-100>
          <img
            :src="game.image"
            :alt="game.name"
            class="game-image"
            un-w-full un-h-full un-object-cover un-transition-transform-300
            @error="(e: Event) => { (e.target as HTMLImageElement).src = '/games/images/logo.png' }"
          >
          <!-- 分类标签 -->
          <div class="game-category" un-absolute un-top-8px un-left-8px un-px-8px un-py-2px un-text-white un-text-xs un-rounded-4px>
            {{ game.category }}
          </div>
        </div>

        <!-- 游戏信息 -->
        <div class="game-info" un-p-12px>
          <h3 class="game-name" un-font-bold un-text-base un-mb-4px un-line-clamp-1>
            {{ game.name }}
          </h3>
          <p class="game-description" un-text-xs un-color-gray-500 un-line-clamp-2>
            {{ game.description }}
          </p>
        </div>

        <!-- 进入按钮 -->
        <div class="game-action" un-p-12px un-pt-0>
          <div class="enter-button" un-w-full un-h-32px un-bg-primary un-flex un-items-center un-justify-center un-text-white un-text-sm un-rounded-99px un-transition-all-300>
            开始游戏
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="filteredGames.length === 0 && !isLoading" class="empty-state" un-flex un-flex-col un-items-center un-justify-center un-py-60px>
      <van-icon name="search-fail" size="64" color="#B6C3D2" />
      <p class="empty-text" un-mt-16px un-text-gray-500>
        未找到符合条件的游戏
      </p>
    </div>

    <!-- 加载状态 -->
    <div v-else class="loading-state" un-flex un-flex-col un-items-center un-justify-center un-py-60px>
      <van-loading type="spinner" color="#1989fa" />
      <p class="loading-text" un-mt-16px un-text-gray-500>
        正在加载游戏列表...
      </p>
    </div>

    <!-- 底部提示 -->
    <div v-if="filteredGames.length > 0 && !isLoading" class="footer-tip" un-text-center un-mt-24px un-text-xs un-color-gray-400>
      共找到 {{ filteredGames.length }} 款游戏
    </div>
  </div>
</template>

<style scoped>
/* 自定义滚动条 */
.category-scroll::-webkit-scrollbar {
  display: none;
}
.category-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 游戏卡片悬停效果 */
.game-card {
  will-change: transform;
  margin-bottom: 15px;
}

/* 图片加载过渡 */
.game-image {
  will-change: transform;
}
.game-image-container:hover .game-image {
  transform: scale(1.05);
}

/* 骨架屏动画 */
@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}
</style>
