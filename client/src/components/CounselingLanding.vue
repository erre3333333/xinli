<script setup>
import { ref } from 'vue'

const emit = defineEmits(['start-service'])

const icons = {
  depression: '<svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="24" stroke="rgba(255,255,255,0.25)" stroke-width="2"/><path d="M30 46s4 6 10 6 10-6 10-6" stroke="rgba(255,255,255,0.4)" stroke-width="2" stroke-linecap="round"/><circle cx="34" cy="36" r="2" fill="rgba(255,255,255,0.5)"/><circle cx="46" cy="36" r="2" fill="rgba(255,255,255,0.5)"/></svg>',
  anxiety: '<svg viewBox="0 0 80 80" fill="none"><path d="M24 44c0-8 6-12 16-12s16 4 16 12" stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-linecap="round"/><path d="M40 16v4M40 60v4M18 24l3 3M59 24l-3 3M14 44h4M62 44h4" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" stroke-linecap="round"/><circle cx="40" cy="44" r="14" stroke="rgba(255,255,255,0.25)" stroke-width="2"/></svg>',
  couple: '<svg viewBox="0 0 80 80" fill="none"><circle cx="28" cy="30" r="10" stroke="rgba(255,255,255,0.3)" stroke-width="2"/><circle cx="52" cy="30" r="10" stroke="rgba(255,255,255,0.3)" stroke-width="2"/><path d="M18 56c0-8 6-14 14-14h16c8 0 14 6 14 14" stroke="rgba(255,255,255,0.25)" stroke-width="2"/><path d="M40 44l-6 8h12l-6-8z" fill="rgba(255,255,255,0.2)"/></svg>',
  ocd: '<svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="30" r="14" stroke="rgba(255,255,255,0.3)" stroke-width="2"/><path d="M40 22v16M32 30h16" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-linecap="round"/><circle cx="40" cy="52" r="4" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/><circle cx="26" cy="52" r="2.5" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/><circle cx="54" cy="52" r="2.5" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/></svg>',
  child: '<svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="28" r="12" stroke="rgba(255,255,255,0.3)" stroke-width="2"/><path d="M28 44c0-6 5-10 12-10s12 4 12 10" stroke="rgba(255,255,255,0.25)" stroke-width="2" stroke-linecap="round"/><path d="M32 50l-6-4M48 50l6-4" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-linecap="round"/><circle cx="35" cy="26" r="1.5" fill="rgba(255,255,255,0.5)"/><circle cx="45" cy="26" r="1.5" fill="rgba(255,255,255,0.5)"/></svg>',
  trauma: '<svg viewBox="0 0 80 80" fill="none"><path d="M40 18v24M30 28l10-10 10 10" stroke="rgba(255,255,255,0.25)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 44c0-6 6-10 16-10s16 4 16 10" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-linecap="round"/><path d="M28 52c-4 3-4 8 0 10" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/><path d="M52 52c4 3 4 8 0 10" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/></svg>',
  bipolar: '<svg viewBox="0 0 80 80" fill="none"><path d="M20 52c4-12 10-12 14 0s10 12 14 0 10-12 14 0" stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-linecap="round" fill="none"/><circle cx="40" cy="28" r="2" fill="rgba(255,255,255,0.4)"/><path d="M40 22v12" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" stroke-linecap="round"/></svg>',
  eating: '<svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="22" stroke="rgba(255,255,255,0.25)" stroke-width="2"/><path d="M32 38s4-4 8-4 8 4 8 4" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" stroke-linecap="round"/><circle cx="35" cy="33" r="1.5" fill="rgba(255,255,255,0.4)"/><circle cx="45" cy="33" r="1.5" fill="rgba(255,255,255,0.4)"/><path d="M34 48l6 4 6-4" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" stroke-linecap="round"/></svg>',
  adhd: '<svg viewBox="0 0 80 80" fill="none"><circle cx="32" cy="28" r="3" fill="rgba(255,255,255,0.3)"/><circle cx="52" cy="22" r="2.5" fill="rgba(255,255,255,0.2)"/><circle cx="24" cy="42" r="2" fill="rgba(255,255,255,0.2)"/><circle cx="48" cy="38" r="3.5" fill="rgba(255,255,255,0.25)"/><circle cx="56" cy="50" r="2" fill="rgba(255,255,255,0.15)"/><path d="M34 32l10-8M28 40l12-4M44 42l8 6" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" stroke-linecap="round"/></svg>',
  teen: '<svg viewBox="0 0 80 80" fill="none"><path d="M40 16c-6 0-10 4-8 12 1 4 3 6 8 6s7-2 8-6c2-8-2-12-8-12z" stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-linejoin="round"/><path d="M22 60c0-10 8-16 18-16s18 6 18 16" stroke="rgba(255,255,255,0.25)" stroke-width="2" stroke-linecap="round"/><path d="M28 52s4-6 12-6 12 6 12 6" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/><path d="M52 42l6 16" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-linecap="round"/></svg>',
  mindfulness: '<svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="20" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/><circle cx="40" cy="40" r="12" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/><circle cx="40" cy="40" r="5" fill="rgba(255,255,255,0.25)"/><path d="M40 20v4M40 56v4M20 40h4M56 40h4" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" stroke-linecap="round"/></svg>',
  sleep: '<svg viewBox="0 0 80 80" fill="none"><path d="M52 22c-12 0-22 10-22 22s10 22 22 22" stroke="rgba(255,255,255,0.25)" stroke-width="2" stroke-linecap="round"/><path d="M52 22c10 0 18 8 18 18s-8 18-18 18" stroke="rgba(255,255,255,0.35)" stroke-width="2" stroke-linecap="round"/><circle cx="46" cy="40" r="2" fill="rgba(255,255,255,0.4)"/><circle cx="56" cy="34" r="2.5" fill="rgba(255,255,255,0.35)"/><circle cx="54" cy="46" r="1.5" fill="rgba(255,255,255,0.3)"/><path d="M28 28l-3-2M28 52l-3 2" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/></svg>',
  burnout: '<svg viewBox="0 0 80 80" fill="none"><rect x="28" y="18" width="24" height="36" rx="4" stroke="rgba(255,255,255,0.3)" stroke-width="2"/><path d="M34 18V8h12v10" stroke="rgba(255,255,255,0.2)" stroke-width="2"/><rect x="34" y="26" width="12" height="4" rx="1" fill="rgba(255,255,255,0.2)"/><rect x="34" y="34" width="12" height="4" rx="1" fill="rgba(255,255,255,0.15)"/><rect x="34" y="42" width="8" height="4" rx="1" fill="rgba(255,255,255,0.2)"/></svg>',
  social: '<svg viewBox="0 0 80 80" fill="none"><circle cx="32" cy="30" r="10" stroke="rgba(255,255,255,0.3)" stroke-width="2"/><circle cx="56" cy="24" r="7" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/><circle cx="22" cy="50" r="6" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/><circle cx="52" cy="48" r="8" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/><path d="M20 64c0-6 5-10 12-10h16c7 0 12 4 12 10" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/></svg>',
}

const bannerCards = [
  { title: '抑郁症心理咨询', desc: '一对一深度对话，协助你探索情绪模式、缓解焦虑与压力', color: '#FB7299', tag: '个体咨询', views: '12.3万', svg: icons.depression },
  { title: '焦虑症应对指南', desc: '学习与焦虑共处的方法，重建内在平静与安全感的专业指导', color: '#F5A623', tag: '个体咨询', views: '9.8万', svg: icons.anxiety },
  { title: '伴侣关系修复', desc: '帮助伴侣改善沟通模式、化解冲突、重建信任与亲密感', color: '#9B6BB5', tag: '伴侣咨询', views: '7.6万', svg: icons.couple },
  { title: '强迫症认知训练', desc: '专业认知行为疗法，帮助你识别和改变强迫思维与行为模式', color: '#F25A5A', tag: '个体咨询', views: '6.4万', svg: icons.ocd },
]

const gridCards = [
  { title: '儿童情绪管理', desc: '通过游戏治疗与艺术表达，帮助孩子学会表达和管理情绪', color: '#E8A0A0', tag: '儿童咨询', views: '5.2万', svg: icons.child },
  { title: '创伤后心理重建', desc: '在安全的空间中处理创伤经历，一步步重建对生活的掌控感', color: '#D98A6A', tag: '个体咨询', views: '4.8万', svg: icons.trauma },
  { title: '双相情感支持', desc: '了解双相情感障碍的波动规律，学习稳定情绪的生活策略', color: '#9B6BB5', tag: '个体咨询', views: '3.9万', svg: icons.bipolar },
  { title: '进食障碍康复', desc: '重建与食物和身体的健康关系，走出体重与体型的困扰', color: '#E8924A', tag: '个体咨询', views: '3.5万', svg: icons.eating },
  { title: 'ADHD 专注力训练', desc: '为注意力涣散、冲动控制提供系统的行为管理与认知训练', color: '#8A9AB5', tag: '儿童咨询', views: '3.1万', svg: icons.adhd },
  { title: '青少年成长咨询', desc: '帮助青少年应对学业压力、人际困扰与自我认同的探索期', color: '#FB7299', tag: '青少年咨询', views: '2.8万', svg: icons.teen },
  { title: '正念减压训练', desc: '通过正念冥想练习，培养觉察力与内在平静，缓解日常压力', color: '#A0D0B0', tag: '团体活动', views: '2.5万', svg: icons.mindfulness },
  { title: '睡眠改善计划', desc: '系统性的睡眠卫生指导与认知调整，帮你找回健康睡眠节律', color: '#8A9AB5', tag: '个体咨询', views: '2.2万', svg: icons.sleep },
  { title: '职业倦怠疏导', desc: '针对职场压力与职业倦怠提供专业心理疏导与应对策略', color: '#F5A623', tag: '个体咨询', views: '1.9万', svg: icons.burnout },
  { title: '社交焦虑突破', desc: '在安全环境中逐步练习社交技能，减轻社交场合中的焦虑感', color: '#FB7299', tag: '团体活动', views: '1.7万', svg: icons.social },
]
</script>

<template>
  <div class="cl-landing">
    <div class="cl-hero">
      <h1 class="cl-hero-title">欢迎来到心灵花园</h1>
      <p class="cl-hero-desc">在这里，每一个情绪都值得被温柔以待。选择适合你的咨询方向，让我们陪你一起成长。</p>
    </div>

    <div class="cl-feed">
      <div v-for="card in bannerCards" :key="card.title" class="cl-card" @click="emit('start-service')">
        <div class="cl-thumb" :style="{ background: `linear-gradient(135deg, ${card.color}cc, ${card.color}88)` }">
          <div class="cl-thumb-svg" v-html="card.svg"></div>
          <span class="cl-tag">{{ card.tag }}</span>
        </div>
        <div class="cl-info">
          <div class="cl-title">{{ card.title }}</div>
          <div class="cl-desc">{{ card.desc }}</div>
          <div class="cl-meta">
            <span>{{ card.views }} 播放</span>
            <span>心灵花园</span>
          </div>
        </div>
      </div>
    </div>

    <div class="cl-section-hd">
      <h3>全部服务</h3>
      <button class="cl-more" @click="emit('start-service')">查看更多</button>
    </div>

    <div class="cl-grid">
      <div v-for="card in gridCards" :key="card.title" class="cl-card-sm" @click="emit('start-service')">
        <div class="cl-thumb-sm" :style="{ background: `linear-gradient(135deg, ${card.color}cc, ${card.color}88)` }">
          <div class="cl-thumb-svg-sm" v-html="card.svg"></div>
          <span class="cl-tag-sm">{{ card.tag }}</span>
        </div>
        <div class="cl-info-sm">
          <div class="cl-title-sm">{{ card.title }}</div>
          <div class="cl-meta-sm">{{ card.views }} 播放</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cl-landing {
  --canvas: #FFF9F5;
  --surface: #FFFFFF;
  --ink: #4A3728;
  --ink-secondary: rgba(74, 55, 40, 0.8);
  --ink-muted: rgba(74, 55, 40, 0.48);
  --hairline: rgba(200, 150, 100, 0.12);
  --primary: #FB7299;
  --on-primary: #FFFFFF;
  flex: 1;
  overflow-y: auto;
  background: linear-gradient(180deg, #FFF9F5 0%, #FFF5EB 100%);
}

.cl-hero {
  text-align: center;
  padding: 32px 24px 16px;
  max-width: 600px;
  margin: 0 auto;
}
.cl-hero-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}
.cl-hero-desc {
  font-size: 14px;
  color: var(--ink-muted);
  line-height: 1.6;
}

.cl-feed {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 16px 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.cl-card {
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  background: var(--surface);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  box-shadow: 0 2px 12px rgba(139, 94, 60, 0.08);
  border: 1px solid rgba(200, 150, 100, 0.08);
}
.cl-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(251, 114, 153, 0.15);
}

.cl-thumb {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 6px;
}
.cl-tag {
  background: rgba(0,0,0,0.5);
  color: white;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 500;
  z-index: 1;
}
.cl-thumb-svg {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.cl-thumb-svg svg {
  width: 64px;
  height: 64px;
}

.cl-info { padding: 12px; }

.cl-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
  line-height: 1.4;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cl-desc {
  font-size: 12px;
  color: var(--ink-muted);
  line-height: 1.5;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cl-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--ink-secondary);
}

.cl-section-hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 12px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}
.cl-section-hd h3 {
  font-size: 20px;
  font-weight: 700;
  color: var(--ink);
}
.cl-more {
  font-size: 13px;
  color: var(--ink-secondary);
  border: none;
  background: none;
  cursor: pointer;
}
.cl-more:hover { color: var(--primary); }

.cl-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  padding: 8px 24px 40px;
  max-width: 1400px;
  margin: 0 auto;
}

.cl-card-sm {
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  background: var(--surface);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  box-shadow: 0 2px 12px rgba(139, 94, 60, 0.08);
  border: 1px solid rgba(200, 150, 100, 0.08);
}
.cl-card-sm:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(251, 114, 153, 0.15);
}

.cl-thumb-sm {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 5px;
}
.cl-tag-sm {
  background: rgba(0,0,0,0.5);
  color: white;
  font-size: 10px;
  padding: 2px 5px;
  border-radius: 3px;
  font-weight: 500;
  z-index: 1;
}
.cl-thumb-svg-sm {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.cl-thumb-svg-sm svg {
  width: 52px;
  height: 52px;
}

.cl-info-sm { padding: 8px 10px; }
.cl-title-sm {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  line-height: 1.4;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.cl-meta-sm { font-size: 12px; color: var(--ink-muted); }

@media (max-width: 1200px) {
  .cl-feed { grid-template-columns: repeat(3, 1fr); }
  .cl-grid { grid-template-columns: repeat(4, 1fr); }
}
@media (max-width: 900px) {
  .cl-feed { grid-template-columns: repeat(2, 1fr); }
  .cl-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 640px) {
  .cl-feed { grid-template-columns: 1fr; }
  .cl-grid { grid-template-columns: repeat(2, 1fr); }
  .cl-feed, .cl-grid { padding-left: 12px; padding-right: 12px; }
}
</style>
