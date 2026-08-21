<script setup>
defineProps({
  headers: { type: Array, required: true },
  rows: { type: Array, required: true },
})
</script>

<template>
  <div class="overflow-x-auto mt-6">
    <table class="spec-table">
      <thead>
        <tr>
          <th v-for="h in headers" :key="h">{{ h }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in rows" :key="i">
          <td v-for="(cell, j) in row" :key="j" :class="{ 'text-gray-400 italic': cell === 'TBD' }">{{ cell }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
