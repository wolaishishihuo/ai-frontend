<script setup lang="ts">
import type { ConversationStats } from '@/api';
import type { ChartConfig } from '@/components/ui/chart';
import { VisDonut, VisSingleContainer } from '@unovis/vue';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  componentToString
} from '@/components/ui/chart';

interface Props {
  stats: ConversationStats | null
}

const props = defineProps<Props>();
const open = defineModel<boolean>('open', { default: false });

interface ChartData {
  key: string
  name: string
  value: number
}

// 预定义颜色
const COLORS = {
  input: 'hsl(221 83% 53%)',
  output: 'hsl(142 71% 45%)'
};

const MODEL_COLORS = [
  'hsl(221 83% 53%)',
  'hsl(142 71% 45%)',
  'hsl(38 92% 50%)',
  'hsl(0 84% 60%)',
  'hsl(262 83% 58%)',
  'hsl(330 81% 60%)'
];

// Token 分布数据
const tokenData = computed<ChartData[]>(() => {
  if (!props.stats)
    return [];
  return [
    { key: 'input', name: '输入 Tokens', value: props.stats.inputTokens },
    { key: 'output', name: '输出 Tokens', value: props.stats.outputTokens }
  ];
});

// Token 图表配置
const tokenChartConfig = computed<ChartConfig>(() => ({
  input: { label: '输入 Tokens', color: COLORS.input },
  output: { label: '输出 Tokens', color: COLORS.output }
}));

// 模型使用数据
const modelData = computed<ChartData[]>(() => {
  if (!props.stats?.byModel?.length)
    return [];
  return props.stats.byModel.map(item => ({
    key: item.model,
    name: item.model,
    value: item.totalTokens
  }));
});

// 模型图表配置
const modelChartConfig = computed<ChartConfig>(() => {
  const config: ChartConfig = {};
  props.stats?.byModel?.forEach((item, index) => {
    config[item.model] = {
      label: item.model,
      color: MODEL_COLORS[index % MODEL_COLORS.length]
    };
  });
  return config;
});

// Donut 图表属性
const getValue = (d: ChartData) => d.value;
const getTokenColor = (d: ChartData) => tokenChartConfig.value[d.key]?.color || COLORS.input;
const getModelColor = (d: ChartData, i: number) => modelChartConfig.value[d.key]?.color || MODEL_COLORS[i % MODEL_COLORS.length];

function formatNumber(num: number) {
  return num.toLocaleString();
}

function formatTokens(tokens: number) {
  if (tokens >= 1000000)
    return `${(tokens / 1000000).toFixed(2)}M`;
  if (tokens >= 1000)
    return `${(tokens / 1000).toFixed(1)}k`;
  return tokens.toString();
}

function formatCost(cost: number) {
  return `${cost.toFixed(6)}`;
}
</script>

<template>
  <Sheet v-model:open="open">
    <SheetContent side="right" class="w-[400px] sm:max-w-[400px] overflow-y-auto">
      <SheetHeader>
        <SheetTitle>会话用量统计</SheetTitle>
        <SheetDescription>当前会话的 Token 使用详情</SheetDescription>
      </SheetHeader>

      <div v-if="stats" class="mt-6 space-y-6 p-2">
        <!-- 总览卡片 -->
        <div class="grid grid-cols-2 gap-4">
          <Card class="p-4">
            <div class="text-sm text-muted-foreground">
              消息数
            </div>
            <div class="text-2xl font-bold">
              {{ stats.messageCount }}
            </div>
          </Card>
          <Card class="p-4">
            <div class="text-sm text-muted-foreground">
              请求数
            </div>
            <div class="text-2xl font-bold">
              {{ stats.requestCount }}
            </div>
          </Card>
          <Card class="p-4">
            <div class="text-sm text-muted-foreground">
              总 Tokens
            </div>
            <div class="text-2xl font-bold">
              {{ formatTokens(stats.totalTokens) }}
            </div>
          </Card>
          <Card class="p-4">
            <div class="text-sm text-muted-foreground">
              预估费用
            </div>
            <div class="text-2xl font-bold">
              {{ formatCost(stats.estimatedCost) }}
            </div>
          </Card>
        </div>

        <!-- Token 分布图 -->
        <Card class="p-4">
          <div class="mb-4 text-sm font-medium">
            Token 分布
          </div>
          <ChartContainer :config="tokenChartConfig" class="h-[200px]">
            <VisSingleContainer :data="tokenData">
              <VisDonut
                :value="getValue"
                :color="getTokenColor"
                :arc-width="50"
                :pad-angle="0.02"
                :corner-radius="4"
                :show-background="true"
              />
              <ChartTooltip
                :content="componentToString(tokenChartConfig, ChartTooltipContent)"
              />
            </VisSingleContainer>
          </ChartContainer>
          <!-- 图例 -->
          <div class="mt-4 flex justify-center gap-6">
            <div v-for="item in tokenData" :key="item.key" class="flex items-center gap-2">
              <div
                class="size-3 rounded-sm"
                :style="{ backgroundColor: tokenChartConfig[item.key]?.color }"
              />
              <span class="text-sm text-muted-foreground">{{ item.name }}</span>
              <span class="text-sm font-medium">{{ formatTokens(item.value) }}</span>
            </div>
          </div>
        </Card>

        <!-- 模型使用统计 -->
        <Card v-if="modelData.length" class="p-4">
          <div class="mb-4 text-sm font-medium">
            模型使用统计
          </div>
          <ChartContainer :config="modelChartConfig" class="h-[200px]">
            <VisSingleContainer :data="modelData">
              <VisDonut
                :value="getValue"
                :color="getModelColor"
                :arc-width="50"
                :pad-angle="0.02"
                :corner-radius="4"
                :show-background="true"
              />
              <ChartTooltip
                :content="componentToString(modelChartConfig, ChartTooltipContent)"
              />
            </VisSingleContainer>
          </ChartContainer>
          <!-- 图例 -->
          <div class="mt-4 space-y-2">
            <div
              v-for="(item, index) in modelData"
              :key="item.key"
              class="flex items-center justify-between"
            >
              <div class="flex items-center gap-2">
                <div
                  class="size-3 rounded-sm"
                  :style="{ backgroundColor: modelChartConfig[item.key]?.color || MODEL_COLORS[index] }"
                />
                <span class="text-sm">{{ item.name }}</span>
              </div>
              <span class="text-sm font-medium">{{ formatTokens(item.value) }}</span>
            </div>
          </div>
        </Card>

        <!-- 模型明细 -->
        <Card v-if="stats.byModel?.length" class="p-4">
          <div class="mb-4 text-sm font-medium">
            模型明细
          </div>
          <div class="space-y-3">
            <div
              v-for="(model, index) in stats.byModel"
              :key="model.model"
              class="rounded-lg border p-3"
            >
              <div class="mb-2 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div
                    class="size-2.5 rounded-sm"
                    :style="{ backgroundColor: MODEL_COLORS[index % MODEL_COLORS.length] }"
                  />
                  <span class="font-medium">{{ model.model }}</span>
                </div>
                <span class="text-xs text-muted-foreground">{{ formatCost(model.cost) }}</span>
              </div>
              <div class="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
                <div>
                  <div>请求数</div>
                  <div class="font-medium text-foreground">
                    {{ model.count }}
                  </div>
                </div>
                <div>
                  <div>输入</div>
                  <div class="font-medium text-foreground">
                    {{ formatNumber(model.inputTokens) }}
                  </div>
                </div>
                <div>
                  <div>输出</div>
                  <div class="font-medium text-foreground">
                    {{ formatNumber(model.outputTokens) }}
                  </div>
                </div>
                <div>
                  <div>总计</div>
                  <div class="font-medium text-foreground">
                    {{ formatNumber(model.totalTokens) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <!-- 汇总数据 -->
        <Card class="p-4">
          <div class="mb-4 text-sm font-medium">
            汇总数据
          </div>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">输入 Tokens</span>
              <span class="font-medium">{{ formatNumber(stats.inputTokens) }}</span>
            </div>
            <Separator />
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">输出 Tokens</span>
              <span class="font-medium">{{ formatNumber(stats.outputTokens) }}</span>
            </div>
            <Separator />
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">总计</span>
              <span class="font-bold">{{ formatNumber(stats.totalTokens) }}</span>
            </div>
            <Separator />
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">预估费用</span>
              <span class="font-bold text-primary">{{ formatCost(stats.estimatedCost) }}</span>
            </div>
          </div>
        </Card>
      </div>

      <div v-else class="mt-6 flex h-[200px] items-center justify-center text-muted-foreground">
        暂无统计数据
      </div>
    </SheetContent>
  </Sheet>
</template>
