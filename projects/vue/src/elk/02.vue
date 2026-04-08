<script setup>
import { ref, onMounted } from "vue";
import ELK from "elkjs/lib/elk.bundled.js";

const elk = new ELK();
const layoutResult = ref(null);

const graph = {
  id: "root",
  layoutOptions: {
    "elk.algorithm": "layered",
    "elk.direction": "DOWN",
    "elk.spacing.nodeNode": 100, // 同一层内 Node2 和 Node3 的间距
    "elk.layered.spacing.nodeNodeBetweenLayers": 80, // 👈 关键配置：控制上层(Node1)到下层(Node2/3)的距离
    "elk.alignment": "CENTER",
    "elk.layered.spacing.nodeNodeLayered": "100",
    "elk.spacing.edgeNode": "20",
    "elk.layered.spacing.edgeNodeLayered": "20",
    "elk.layered.nodePlacement.strategy": "BRANDES_KOEPF", // 对称布局策略
    "elk.layered.nodePlacement.bk.fixedAlignment": "BALANCED", // 自动寻找平衡点实现对称
  },
  children: [
    { id: "n1-1", width: 50, height: 50, label: "RJ1" ,
      layoutOptions: { "elk.portConstraints": "FIXED_SIDE" }, // 关键：允许固定端口位置
      ports:[
        {
          id: 'L1-1', 
          width: 10, 
          height: 10,
          // 你不需要关心端口是"进入"还是"离开"，ELK 也不区分这个。elk.port.side 只描述物理位置，不描述流向。
          properties: { "elk.port.side": "SOUTH" } // side 表示边从哪个方向进入/离开这个端口。
        }
      ]
    },
    { 
      id: "n1-2", 
      width: 50, 
      height: 50, 
      label: "RJ2",
      // 固定在指定边，位置自动优化
      layoutOptions: { "elk.portConstraints": "FIXED_SIDE" },
      ports: [
        // 需要指定端口的大小，可以指定端口从那端输入/输出，具体位置计算得出
        {
          id: 'L2-1',
          width: 10,
          height: 10,
          properties: {
            "elk.port.side": "SOUTH"  // 强制在左侧（输入）
          }
        }
      ]
    },
    { 
      id: "n2-1", 
      width: 50, 
      height: 50, 
      label: "CLX",
      layoutOptions: { "elk.portConstraints": "FIXED_SIDE" },
      ports: [
        {
          id: 'L3-1',
          width: 10,
          height: 10,
          properties: {
            "elk.port.side": "NORTH"  // 强制在顶部（输入）
          }
        },
        {
          id: 'L3-2',
          width: 10,
          height: 10,
          properties: {
            "elk.port.side": "SOUTH"  // 强制在顶部（输入）
          }
        },
        {
          id: 'L3-3',
          width: 10,
          height: 10,
          properties: {
            "elk.port.side": "WEST"  // 强制在顶部（输入）
          }
        },
        {
          id: 'L3-4',
          width: 10,
          height: 10,
          properties: {
            "elk.port.side": "EAST"  // 强制在顶部（输入）
          }
        },
      ]
    },

    {
        id: 'n3-1',
      width: 50,
      height: 50,
      label: "JZ1",
      layoutOptions: { "elk.portConstraints": "FIXED_SIDE" },
      ports: [
        {
          id: 'L4-1',
          width: 10,
          height: 10,
          properties: {
            "elk.port.side": "NORTH"  // 强制在顶部（输入）
          }
        },
      ]
    },
    {
        id: 'n3-2',
      width: 50,
      height: 50,
      label: "JZ2",
      layoutOptions: { "elk.portConstraints": "FIXED_SIDE" },
      ports: [
        {
          id: 'L4-2',
      
          width: 10,
          height: 10,
          properties: {
            "elk.port.side": "NORTH"  // 强制在顶部（输入）
          }
        },
      ]
    }
  ],
  edges: [
    { id: "e1", sources: ["L1-1"], targets: ["L3-1"] },
    { id: "e2", sources: ["L2-1"], targets: ["L3-4"] },
    { id: "e3", sources: ["L4-1"], targets: ["L3-3"] },
    { id: "e4", sources: ["L4-2"], targets: ["L3-2"] },
  ],
};

onMounted(async () => {
  try {
    const result = await elk.layout(graph);
    layoutResult.value = result;
    console.log("ELK Layout result:", result);
  } catch (error) {
    console.error("ELK Layout error:", error);
  }
});

// Helper to format edge paths
const getEdgePath = (edge) => {
  if (!edge.sections || edge.sections.length === 0) return "";
  const section = edge.sections[0];
  let path = `M ${section.startPoint.x} ${section.startPoint.y}`;
  if (section.bendPoints) {
    section.bendPoints.forEach((p) => {
      path += ` L ${p.x} ${p.y}`;
    });
  }
  path += ` L ${section.endPoint.x} ${section.endPoint.y}`;
  return path;
};
</script>
<template>
  <div class="elk-container">
    <svg
      v-if="layoutResult"
      class="svg-canvas"
      :width="layoutResult.width + 100"
      :height="layoutResult.height + 100"
      :viewBox="`-50 -50 ${layoutResult.width + 100} ${
        layoutResult.height + 100
      }`"
    >
      <defs>
        <g id="node-template">
          <!-- 外圈圆 -->
          <circle
            cx="0"
            cy="0"
            r="20"
            fill="#f0f0f0"
            stroke="#333"
            stroke-width="2"
          ></circle>

          <!-- 8个小矩形 -->
          <rect
            x="-4"
            y="-24"
            width="8"
            height="8"
            fill="#f0f0f0"
            stroke="#333"
            transform="rotate(0)"
          ></rect>
          <rect
            x="-4"
            y="-24"
            width="8"
            height="8"
            fill="#f0f0f0"
            stroke="#333"
            transform="rotate(45)"
          ></rect>
          <rect
            x="-4"
            y="-24"
            width="8"
            height="8"
            fill="#f0f0f0"
            stroke="#333"
            transform="rotate(90)"
          ></rect>
          <rect
            x="-4"
            y="-24"
            width="8"
            height="8"
            fill="#f0f0f0"
            stroke="#333"
            transform="rotate(135)"
          ></rect>
          <rect
            x="-4"
            y="-24"
            width="8"
            height="8"
            fill="#f0f0f0"
            stroke="#333"
            transform="rotate(180)"
          ></rect>
          <rect
            x="-4"
            y="-24"
            width="8"
            height="8"
            fill="#f0f0f0"
            stroke="#333"
            transform="rotate(225)"
          ></rect>
          <rect
            x="-4"
            y="-24"
            width="8"
            height="8"
            fill="#f0f0f0"
            stroke="#333"
            transform="rotate(270)"
          ></rect>
          <rect
            x="-4"
            y="-24"
            width="8"
            height="8"
            fill="#f0f0f0"
            stroke="#333"
            transform="rotate(315)"
          ></rect>

          <!-- 内圈 -->
          <circle cx="0" cy="0" r="8" fill="#fff" stroke="#333"></circle>
        </g>

        <!-- 箭头定义 - 缩小尺寸 -->
        <marker
          id="arrowhead"
          markerWidth="6"
          markerHeight="5"
          refX="6"
          refY="2.5"
          orient="auto"
        >
          <polygon points="0 0, 6 2.5, 0 5" fill="#333" />
        </marker>
      </defs>

      <!-- 绘制连线 -->
      <g class="edges">
        <path
          v-for="edge in layoutResult.edges"
          :key="edge.id"
          :d="getEdgePath(edge)"
          fill="none"
          stroke="#333"
          stroke-width="2"
          marker-end="url(#arrowhead)"
        />
      </g>

      <!-- 绘制节点 -->
      <g
        v-for="node in layoutResult.children"
        :key="node.id"
        :transform="`translate(${node.x + node.width / 2}, ${
          node.y + node.height / 2
        })`"
        class="node-group"
      >
        <use href="#node-template"></use>
        <text x="0" y="45" text-anchor="middle" class="node-label">
          {{ node.label }}
        </text>
        
        <!-- 绘制端口 -->
        <rect
          v-for="port in node.ports"
          :key="port.id"
          :x="port.x - node.width / 2"
          :y="port.y - node.height / 2"
          :width="port.width"
          :height="port.height"
          fill="#FFC107"
          stroke="#FFA000"
          stroke-width="1"
        />
      </g>
    </svg>
    <div v-else>Loading layout...</div>
  </div>
</template>
<style scoped>
.node-label {
  font-size: 12px;
  fill: #333;
  font-weight: bold;
}
.elk-container {
  padding: 20px;
}
.svg-canvas {
  border: 1px solid #eee;
  background-color: #fafafa;
}
</style>
