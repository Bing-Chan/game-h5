<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue"
import { useRouter } from "vue-router"
import { formatDateTime } from "@/common/utils/datetime"

// 定义聊天会话类型
interface ChatSession {
  id: string
  name: string
  avatar: string
  lastMessage: string
  lastMessageTime: Date
  lastSender: string
  unreadCount: number
  isOnline: boolean
  isGroup: boolean
  memberCount?: number
  tags?: string[]
}

// 响应式数据
const router = useRouter()
const loading = ref(true)
const searchKeyword = ref("")
const activeTab = ref("all")
const showFab = ref(false)

// 聊天列表数据
const chats = ref<ChatSession[]>([])

// 过滤后的聊天列表
const filteredChats = computed(() => {
  let result = chats.value

  // 标签过滤
  if (activeTab.value === "unread") {
    result = result.filter(chat => chat.unreadCount > 0)
  } else if (activeTab.value === "group") {
    result = result.filter(chat => chat.isGroup)
  }

  // 搜索过滤
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(chat =>
      chat.name.toLowerCase().includes(keyword)
      || chat.lastMessage.toLowerCase().includes(keyword)
      || (chat.tags && chat.tags.some(tag => tag.toLowerCase().includes(keyword)))
    )
  }

  // 按最后消息时间排序
  return result.sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime())
})

// 未读消息总数
const unreadCount = computed(() => {
  return chats.value.reduce((total, chat) => total + chat.unreadCount, 0)
})

// 模拟获取聊天列表数据
function fetchChats() {
  loading.value = true

  // 模拟网络请求延迟
  setTimeout(() => {
    chats.value = [
      {
        id: "1",
        name: "小明",
        avatar: "https://img.yzcdn.cn/vant/cat.jpeg",
        lastMessage: "好的，明天见！",
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
        lastSender: "小明",
        unreadCount: 2,
        isOnline: true,
        isGroup: false,
        tags: ["朋友", "工作"]
      },
      {
        id: "2",
        name: "项目讨论群",
        avatar: "https://img.yzcdn.cn/vant/apple-1.jpg",
        lastMessage: "我们需要在周五前完成这个任务",
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
        lastSender: "项目经理",
        unreadCount: 5,
        isOnline: false,
        isGroup: true,
        memberCount: 12,
        tags: ["工作", "项目"]
      },
      {
        id: "3",
        name: "小红",
        avatar: "https://img.yzcdn.cn/vant/apple-2.jpg",
        lastMessage: "谢谢分享！",
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
        lastSender: "我",
        unreadCount: 0,
        isOnline: true,
        isGroup: false,
        tags: ["朋友"]
      },
      {
        id: "4",
        name: "家庭群",
        avatar: "https://img.yzcdn.cn/vant/apple-3.jpg",
        lastMessage: "周末一起吃饭吗？",
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 5),
        lastSender: "妈妈",
        unreadCount: 1,
        isOnline: false,
        isGroup: true,
        memberCount: 6,
        tags: ["家人"]
      },
      {
        id: "5",
        name: "张三",
        avatar: "https://img.yzcdn.cn/vant/apple-4.jpg",
        lastMessage: "请问这个问题怎么解决？",
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
        lastSender: "张三",
        unreadCount: 0,
        isOnline: false,
        isGroup: false,
        tags: ["客户"]
      }
    ]
    loading.value = false
  }, 1000)
}

// 格式化聊天时间
function formatChatTime(date: Date) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const messageDate = new Date(date)

  if (messageDate >= today) {
    return formatDateTime(messageDate, "HH:mm")
  } else if (messageDate >= yesterday) {
    return "昨天"
  } else if (messageDate.getFullYear() === now.getFullYear()) {
    return formatDateTime(messageDate, "MM-DD")
  } else {
    return formatDateTime(messageDate, "YYYY-MM-DD")
  }
}

// 处理搜索
function handleSearch() {
  // 搜索逻辑已在computed属性中处理
}

// 清空搜索
function clearSearch() {
  searchKeyword.value = ""
}

// 切换标签
function switchTab(tab: string) {
  activeTab.value = tab
}

// 打开聊天
function openChat(chat: ChatSession) {
  // 实际项目中应跳转到聊天详情页
  console.log("打开聊天:", chat.id)

  // 模拟清除未读消息
  const chatIndex = chats.value.findIndex(c => c.id === chat.id)
  if (chatIndex !== -1) {
    chats.value[chatIndex].unreadCount = 0
  }

  // 这里可以添加导航逻辑
  // router.push(`/chat/detail/${chat.id}`);
}

// 显示创建聊天界面
function showCreateChat() {
  console.log("显示创建聊天界面")
  // 实际项目中应跳转到选择联系人页面或显示对话框
  // router.push('/chat/select-contact');
}

// 处理滚动显示/隐藏浮动按钮
function handleScroll() {
  showFab.value = window.scrollY > 300
}

// 组件挂载
onMounted(() => {
  fetchChats()
  window.addEventListener("scroll", handleScroll)
})

// 组件卸载
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll)
})
</script>

<template>
  <div class="chat-list-page">
    <!-- 导航栏 -->
    <div class="nav-bar">
      <h1 class="nav-title">
        消息
      </h1>
      <div class="nav-actions">
        <button class="nav-btn" @click="showCreateChat">
          <span class="icon-plus">+</span>
        </button>
      </div>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <div class="search-input-wrapper">
        <span class="icon-search">🔍</span>
        <input
          v-model="searchKeyword"
          type="text"
          class="search-input"
          placeholder="搜索聊天"
          @input="handleSearch"
        >
        <span v-if="searchKeyword" class="icon-clear" @click="clearSearch">✕</span>
      </div>
    </div>

    <!-- 标签栏 -->
    <div class="tabs">
      <div
        class="tab" :class="[{ active: activeTab === 'all' }]"
        @click="switchTab('all')"
      >
        全部
      </div>
      <div
        class="tab" :class="[{ active: activeTab === 'unread' }]"
        @click="switchTab('unread')"
      >
        未读 <span v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</span>
      </div>
      <div
        class="tab" :class="[{ active: activeTab === 'group' }]"
        @click="switchTab('group')"
      >
        群聊
      </div>
    </div>

    <!-- 聊天列表 -->
    <div class="chat-list">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <loading type="spinner" color="#1989fa" />
        <span>加载中...</span>
      </div>

      <!-- 聊天列表项 -->
      <div
        v-for="chat in filteredChats"
        :key="chat.id"
        class="chat-item"
        @click="openChat(chat)"
      >
        <!-- 头像 -->
        <div class="avatar-wrapper">
          <image :src="chat.avatar" class="avatar" fit="cover" />
          <div v-if="chat.isOnline" class="online-indicator" />
          <div v-if="chat.isGroup" class="group-badge">
            {{ chat.memberCount }}
          </div>
        </div>

        <!-- 聊天信息 -->
        <div class="chat-info">
          <div class="chat-header">
            <h3 class="chat-name">
              {{ chat.name }}
            </h3>
            <span class="chat-time">{{ formatChatTime(chat.lastMessageTime) }}</span>
          </div>
          <div class="chat-content">
            <span v-if="chat.lastSender !== 'me'" class="sender-name">{{ chat.lastSender }}: </span>
            <span class="last-message">{{ chat.lastMessage }}</span>
          </div>
        </div>

        <!-- 未读提示 -->
        <div v-if="chat.unreadCount > 0" class="unread-container">
          <badge :content="chat.unreadCount > 99 ? '99+' : chat.unreadCount" class="unread-badge-large" />
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="!loading && filteredChats.length === 0" class="empty-state">
        <empty description="暂无聊天记录" image-size="100" />
        <button class="create-chat-btn" @click="showCreateChat">
          开始聊天
        </button>
      </div>
    </div>

    <!-- 快速操作 -->
    <div v-if="showFab" class="floating-action-button" @click="showCreateChat">
      <span>+</span>
    </div>
  </div>
</template>

<style scoped>
.chat-list-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

/* 导航栏 */
.nav-bar {
  background-color: #fff;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.nav-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #1989fa;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav-btn:hover {
  background-color: #f0f0f0;
}

/* 搜索栏 */
.search-bar {
  padding: 12px 20px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 0 12px;
}

.icon-search,
.icon-clear {
  font-size: 16px;
  color: #999;
}

.icon-clear {
  cursor: pointer;
  margin-left: 8px;
}

.search-input {
  flex: 1;
  border: none;
  background: none;
  padding: 10px 8px;
  font-size: 14px;
  outline: none;
}

.search-input::placeholder {
  color: #999;
}

/* 标签栏 */
.tabs {
  display: flex;
  background-color: #fff;
  margin-bottom: 10px;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-size: 14px;
  position: relative;
  cursor: pointer;
  transition: color 0.2s;
}

.tab.active {
  color: #1989fa;
}

.tab.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 30%;
  width: 40%;
  height: 2px;
  background-color: #1989fa;
  border-radius: 1px;
}

.unread-badge {
  background-color: #ff4757;
  color: #fff;
  font-size: 10px;
  padding: 2px 5px;
  border-radius: 10px;
  margin-left: 4px;
}

/* 聊天列表 */
.chat-list {
  flex: 1;
  overflow-y: auto;
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.chat-item:hover {
  background-color: #f8f8f8;
}

/* 头像区域 */
.avatar-wrapper {
  position: relative;
  margin-right: 12px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #f0f0f0;
}

.online-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background-color: #07c160;
  border: 2px solid #fff;
  border-radius: 50%;
}

.group-badge {
  position: absolute;
  bottom: 0;
  right: -6px;
  background-color: #1989fa;
  color: #fff;
  font-size: 10px;
  padding: 2px 5px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

/* 聊天信息 */
.chat-info {
  flex: 1;
  min-width: 0;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.chat-name {
  font-size: 15px;
  font-weight: 500;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%;
}

.chat-time {
  font-size: 12px;
  color: #999;
}

.chat-content {
  font-size: 13px;
  color: #666;
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sender-name {
  color: #999;
  margin-right: 4px;
}

.last-message {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 未读提示 */
.unread-container {
  margin-left: 10px;
}

.unread-badge-large {
  --badge-size: 18px;
  --badge-font-size: 11px;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #999;
  font-size: 14px;
}

.loading-state span {
  margin-top: 10px;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #999;
}

.create-chat-btn {
  margin-top: 20px;
  padding: 8px 24px;
  background-color: #1989fa;
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-chat-btn:hover {
  background-color: #0e73d4;
}

/* 浮动操作按钮 */
.floating-action-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #1989fa;
  color: #fff;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transition:
    transform 0.2s,
    background-color 0.2s;
  z-index: 99;
}

.floating-action-button:hover {
  background-color: #0e73d4;
  transform: scale(1.05);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-title {
    font-size: 18px;
  }

  .chat-item {
    padding: 10px 16px;
  }

  .avatar {
    width: 44px;
    height: 44px;
  }

  .chat-name {
    font-size: 14px;
  }

  .chat-time,
  .chat-content {
    font-size: 12px;
  }

  .floating-action-button {
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    font-size: 22px;
  }
}

/* 美化滚动条 */
.chat-list::-webkit-scrollbar {
  width: 4px;
}

.chat-list::-webkit-scrollbar-track {
  background: transparent;
}

.chat-list::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 2px;
}

.chat-list::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style>
