<script setup>
import { ref, onMounted } from 'vue'

defineProps({
  patients: { type: Array, required: true },
})
const emit = defineEmits(['select', 'back'])

const featured = [
  { id: 'depression', label: '抑郁症', desc: '一对一深度对话，协助你探索情绪模式、缓解焦虑与压力', color: '#FB7299', tag: '个体咨询' },
  { id: 'anxiety', label: '焦虑症', desc: '学习与焦虑共处的方法，重建内在平静与安全感的专业指导', color: '#F5A623', tag: '个体咨询' },
  { id: 'ocd', label: '强迫症', desc: '专业认知行为疗法，帮助你识别和改变强迫思维与行为模式', color: '#F25A5A', tag: '个体咨询' },
  { id: 'ptsd', label: '创伤后应激', desc: '在安全的空间中处理创伤经历，一步步重建对生活的掌控感', color: '#D98A6A', tag: '个体咨询' },
]

const scrollY = ref(0)
onMounted(() => {
  const el = document.querySelector('.cl-body')
  if (el) el.addEventListener('scroll', e => scrollY.value = e.target.scrollTop)
})

const icons = {
  depression: '<svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="24" stroke="rgba(255,255,255,0.25)" stroke-width="2"/><path d="M30 46s4 6 10 6 10-6 10-6" stroke="rgba(255,255,255,0.4)" stroke-width="2" stroke-linecap="round"/><circle cx="34" cy="36" r="2" fill="rgba(255,255,255,0.5)"/><circle cx="46" cy="36" r="2" fill="rgba(255,255,255,0.5)"/></svg>',
  anxiety: '<svg viewBox="0 0 80 80" fill="none"><path d="M24 44c0-8 6-12 16-12s16 4 16 12" stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-linecap="round"/><path d="M40 16v4M40 60v4M18 24l3 3M59 24l-3 3M14 44h4M62 44h4" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" stroke-linecap="round"/><circle cx="40" cy="44" r="14" stroke="rgba(255,255,255,0.25)" stroke-width="2"/></svg>',
  ocd: '<svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="30" r="14" stroke="rgba(255,255,255,0.3)" stroke-width="2"/><path d="M40 22v16M32 30h16" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-linecap="round"/><circle cx="40" cy="52" r="4" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/><circle cx="26" cy="52" r="2.5" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/><circle cx="54" cy="52" r="2.5" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/></svg>',
  ptsd: '<svg viewBox="0 0 80 80" fill="none"><path d="M40 18v24M30 28l10-10 10 10" stroke="rgba(255,255,255,0.25)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 44c0-6 6-10 16-10s16 4 16 10" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-linecap="round"/><path d="M28 52c-4 3-4 8 0 10" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/><path d="M52 52c4 3 4 8 0 10" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/></svg>',
  bipolar: '<svg viewBox="0 0 80 80" fill="none"><path d="M20 52c4-12 10-12 14 0s10 12 14 0 10-12 14 0" stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-linecap="round" fill="none"/><circle cx="40" cy="28" r="2" fill="rgba(255,255,255,0.4)"/><path d="M40 22v12" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" stroke-linecap="round"/></svg>',
  eating: '<svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="22" stroke="rgba(255,255,255,0.25)" stroke-width="2"/><path d="M32 38s4-4 8-4 8 4 8 4" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" stroke-linecap="round"/><circle cx="35" cy="33" r="1.5" fill="rgba(255,255,255,0.4)"/><circle cx="45" cy="33" r="1.5" fill="rgba(255,255,255,0.4)"/><path d="M34 48l6 4 6-4" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" stroke-linecap="round"/></svg>',
  adhd: '<svg viewBox="0 0 80 80" fill="none"><circle cx="32" cy="28" r="3" fill="rgba(255,255,255,0.3)"/><circle cx="52" cy="22" r="2.5" fill="rgba(255,255,255,0.2)"/><circle cx="24" cy="42" r="2" fill="rgba(255,255,255,0.2)"/><circle cx="48" cy="38" r="3.5" fill="rgba(255,255,255,0.25)"/><circle cx="56" cy="50" r="2" fill="rgba(255,255,255,0.15)"/><path d="M34 32l10-8M28 40l12-4M44 42l8 6" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" stroke-linecap="round"/></svg>',
  child: '<svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="28" r="12" stroke="rgba(255,255,255,0.3)" stroke-width="2"/><path d="M28 44c0-6 5-10 12-10s12 4 12 10" stroke="rgba(255,255,255,0.25)" stroke-width="2" stroke-linecap="round"/><path d="M32 50l-6-4M48 50l6-4" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-linecap="round"/><circle cx="35" cy="26" r="1.5" fill="rgba(255,255,255,0.5)"/><circle cx="45" cy="26" r="1.5" fill="rgba(255,255,255,0.5)"/></svg>',
  adolescent: '<svg viewBox="0 0 80 80" fill="none"><path d="M40 16c-6 0-10 4-8 12 1 4 3 6 8 6s7-2 8-6c2-8-2-12-8-12z" stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-linejoin="round"/><path d="M22 60c0-10 8-16 18-16s18 6 18 16" stroke="rgba(255,255,255,0.25)" stroke-width="2" stroke-linecap="round"/><path d="M28 52s4-6 12-6 12 6 12 6" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/><path d="M52 42l6 16" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-linecap="round"/></svg>',
  mindfulness: '<svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="20" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/><circle cx="40" cy="40" r="12" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/><circle cx="40" cy="40" r="5" fill="rgba(255,255,255,0.25)"/><path d="M40 20v4M40 56v4M20 40h4M56 40h4" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" stroke-linecap="round"/></svg>',
  social: '<svg viewBox="0 0 80 80" fill="none"><circle cx="32" cy="30" r="10" stroke="rgba(255,255,255,0.3)" stroke-width="2"/><circle cx="56" cy="24" r="7" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/><circle cx="22" cy="50" r="6" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/><circle cx="52" cy="48" r="8" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/><path d="M20 64c0-6 5-10 12-10h16c7 0 12 4 12 10" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/></svg>',
  psychosis: '<svg viewBox="0 0 80 80" fill="none"><path d="M40 16v8M40 44v8M24 28l6 4M50 40l6 4" stroke="rgba(255,255,255,0.25)" stroke-width="2" stroke-linecap="round"/><circle cx="40" cy="36" r="16" stroke="rgba(255,255,255,0.2)" stroke-width="2"/><path d="M30 44s3 6 10 6 10-6 10-6" stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-linecap="round"/></svg>',
  'social-anxiety': '<svg viewBox="0 0 80 80" fill="none"><circle cx="32" cy="30" r="10" stroke="rgba(255,255,255,0.3)" stroke-width="2"/><circle cx="56" cy="24" r="7" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/><circle cx="22" cy="50" r="6" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/><circle cx="52" cy="48" r="8" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/><path d="M20 64c0-6 5-10 12-10h16c7 0 12 4 12 10" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/></svg>',
}
</script>

<template>
  <div class="cl-body">
    <!-- Hero -->
    <div class="cl-hero" :class="{ 'cl-hero-compact': scrollY > 60 }">
      <div class="cl-hero-bg"></div>
      <div class="cl-hero-inner">
        <div class="cl-hero-badge">专业心理支持平台</div>
        <h1 class="cl-hero-title">选择适合你的<br/>咨询方向</h1>
        <p class="cl-hero-sub">每一个情绪都值得被温柔以待——选择与你的情况最接近的选项，让我们陪你一起成长。</p>
      </div>
    </div>

    <!-- 精选推荐 -->
    <div class="cl-section">
      <div class="cl-section-hd">
        <h3>精选推荐</h3>
        <span class="cl-section-meta">热门服务</span>
      </div>
      <div class="cl-featured">
        <div
          v-for="item in featured"
          :key="item.id"
          class="cl-card-banner"
          :style="{ '--accent': item.color }"
          @click="emit('select', { id: item.id })"
        >
          <div class="cl-card-svg" v-html="icons[item.id] || ''"></div>
          <div class="cl-card-body">
            <span class="cl-card-tag" :style="{ background: item.color + '20', color: item.color }">{{ item.tag }}</span>
            <div class="cl-card-title">{{ item.label }}</div>
            <div class="cl-card-desc">{{ item.desc }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 全部服务 -->
    <div class="cl-section">
      <div class="cl-section-hd">
        <h3>全部服务</h3>
        <span class="cl-section-count">{{ patients.length }} 项</span>
      </div>
      <div class="cl-grid">
        <div
          v-for="p in patients"
          :key="p.id"
          class="cl-card"
          :style="{ '--c': p.color }"
          @click="emit('select', p)"
        >
          <div class="cl-card-icon" :style="{ background: p.color + '15', color: p.color }">
            <div class="cl-card-icon-svg" v-html="icons[p.id] || ''"></div>
          </div>
          <div class="cl-card-info">
            <div class="cl-card-label">{{ p.label }}</div>
            <div class="cl-card-desc">{{ p.description }}</div>
          </div>
          <div class="cl-card-arrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          </div>
        </div>
      </div>
    </div>

    <div class="cl-footer">
      <span>心灵花园 · 专业心理支持平台</span>
    </div>
  </div>
</template>

<style scoped>
.cl-body {
  --ink: #3D2B1F; --ink-sec: rgba(61, 43, 31, 0.75);
  --ink-muted: rgba(61, 43, 31, 0.45);
  flex: 1; overflow-y: auto;
  background: linear-gradient(180deg, #FFFAF5 0%, #FFF5EB 100%);
}

/* Hero */
.cl-hero {
  position: relative; overflow: hidden;
  padding: 60px 24px 48px; text-align: center;
  transition: padding 0.3s;
}
.cl-hero-compact { padding: 32px 24px 24px; }
.cl-hero-bg {
  position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 600px 300px at 50% 0%, rgba(251, 114, 153, 0.08) 0%, transparent 70%),
    radial-gradient(ellipse 400px 200px at 20% 100%, rgba(245, 166, 35, 0.05) 0%, transparent 60%),
    radial-gradient(ellipse 400px 200px at 80% 100%, rgba(155, 107, 181, 0.05) 0%, transparent 60%);
}
.cl-hero-inner { position: relative; max-width: 600px; margin: 0 auto; }
.cl-hero-badge {
  display: inline-block; font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
  padding: 4px 14px; border-radius: 20px; margin-bottom: 20px;
  background: linear-gradient(135deg, #FB7299, #E85D75);
  color: #FFF5EB; text-transform: uppercase;
}
.cl-hero-title {
  font-size: 34px; font-weight: 800; line-height: 1.25;
  background: linear-gradient(135deg, #3D2B1F 0%, #8B5E3C 50%, #FB7299 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  margin: 0 0 14px; letter-spacing: -0.5px;
}
.cl-hero-sub {
  font-size: 14px; color: var(--ink-muted); line-height: 1.7; margin: 0;
  max-width: 460px; margin: 0 auto;
}

/* Sections */
.cl-section { max-width: 1000px; margin: 0 auto; padding: 0 24px 32px; }
.cl-section-hd {
  display: flex; align-items: baseline; gap: 12px;
  margin-bottom: 16px;
}
.cl-section-hd h3 {
  font-size: 18px; font-weight: 700; color: var(--ink); margin: 0;
}
.cl-section-meta, .cl-section-count {
  font-size: 12px; color: var(--ink-muted);
}

/* Featured row */
.cl-featured {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
}
.cl-card-banner {
  cursor: pointer; border-radius: 14px; overflow: hidden;
  background: #FFFFFF; position: relative;
  border: 1px solid rgba(200, 150, 100, 0.1);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 2px 12px rgba(139, 94, 60, 0.06);
}
.cl-card-banner:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 28px rgba(251, 114, 153, 0.13);
  border-color: var(--accent);
}
.cl-card-svg {
  aspect-ratio: 16/9;
  background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 25%, #FFF), color-mix(in srgb, var(--accent) 10%, #FFF));
  display: flex; align-items: center; justify-content: center;
}
.cl-card-svg svg { width: 54px; height: 54px; }
.cl-card-body { padding: 10px 14px 14px; }
.cl-card-tag {
  font-size: 10px; font-weight: 600;
  padding: 2px 8px; border-radius: 4px; display: inline-block;
  letter-spacing: 0.04em; margin-bottom: 6px;
}
.cl-card-title {
  font-size: 15px; font-weight: 700; color: var(--ink); margin-bottom: 3px;
}
.cl-card-desc {
  font-size: 12px; color: var(--ink-muted); line-height: 1.5;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

/* Grid */
.cl-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.cl-card {
  cursor: pointer; border-radius: 12px; padding: 14px;
  background: #FFFFFF; border: 1px solid rgba(200, 150, 100, 0.08);
  display: flex; align-items: center; gap: 14px;
  transition: all 0.25s ease;
  box-shadow: 0 1px 6px rgba(139, 94, 60, 0.04);
  position: relative;
}
.cl-card:hover {
  border-color: var(--c); transform: translateX(3px);
  box-shadow: 0 4px 16px rgba(251, 114, 153, 0.08);
}
.cl-card-icon {
  width: 48px; height: 48px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.cl-card-icon-svg svg { width: 30px; height: 30px; display: block; }
.cl-card-info { flex: 1; min-width: 0; }
.cl-card-label {
  font-size: 14px; font-weight: 600; color: var(--ink); margin-bottom: 2px;
}
.cl-card-desc {
  font-size: 12px; color: var(--ink-muted); line-height: 1.4;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.cl-card-arrow {
  color: var(--ink-muted); transition: color 0.2s; flex-shrink: 0;
}
.cl-card:hover .cl-card-arrow { color: var(--c); }

.cl-footer {
  text-align: center; padding: 8px 24px 32px;
  font-size: 12px; color: var(--ink-muted);
}

@media (max-width: 768px) {
  .cl-featured { grid-template-columns: repeat(2, 1fr); }
  .cl-grid { grid-template-columns: 1fr; }
  .cl-hero-title { font-size: 28px; }
}
@media (max-width: 480px) {
  .cl-featured { grid-template-columns: 1fr; }
  .cl-hero { padding: 40px 16px 32px; }
  .cl-section { padding: 0 16px 24px; }
}
</style>
