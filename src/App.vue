<script setup>
import {onMounted, ref, toRaw} from "vue";

let params = {
  zone: null,
  type: null,
  keyword: null,
  dbfile: null,
};
let result = ref(null);
let zones = ref([]);
let types = ref([]);
let overall = ref([]);
let zone = ref([]);
let type = ref([]);
const keyword = ref(null);
let config = ref(null);

onMounted(async () => {
  try {
    config.value = await window.config.getConfig();
    // console.log(config.value)
    params = {
      dbfile: config.value.db_file
    };

    zones.value = await window.db.getZones(params);
    Object.values(zones.value).forEach(item => {
      zone.value.push(item.zone);
    });

    types.value = await window.db.getTypes(params);
    Object.values(types.value).forEach(item => {
      type.value.push(item.type)
    });

    overall.value = await window.db.getOverall(params);
  } catch (error) {
    console.error(error);
  }
})

async function search() {
  try {
    params = {
      zone: toRaw(zone.value),
      type: toRaw(type.value),
      keyword: keyword.value,
      dbfile: config.value.db_file
    };

    console.log('search:', params);

    result.value = await window.db.getRecords(params);
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <div class="bg-[url('../img/logo.png')] bg-no-repeat bg-cover bg-center">
    <h1 class="text-center text-5xl leading-loose font-bold">桂林平话土话有声语料库检索系统</h1>
  </div>
  <div class="container mx-auto">
    <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
      <div class="col-span-full">
        <!--        <label for="keyword" class="block text-sm font-bold leading-6 text-gray-900">检索词</label>-->
        <!--        <div class="mt-2">-->
        <div class="relative mt-2 flex w-full flex-wrap items-stretch">
          <input type="text" name="keyword" v-model="keyword" placeholder="请输入检索词" autocomplete="keyword"
                 class="relative block flex-auto rounded-s border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6">
          <button type="button" @click="search"
                  class="inline-block rounded-e bg-cyan-600 px-3 py-2 text-base text-white shadow-lg hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600">
            检索
          </button>
        </div>
      </div>
      <div class="col-span-full">
        <div class="grid grid-cols-12">
          <div
              class="lg:col-span-1 md:col-span-2 px-4 mr-6 text-right text-base font-bold leading-6 text-gray-900">
            方言点
          </div>
          <div class="lg:col-span-11 md:col-span-10 px-4">
            <div class="flex flex-wrap gap-x-5">
              <div class="relative flex items-center gap-x-3 pb-2 w-40" v-for="(item,index) in zones"
                   :key="index">
                <input :id="item.zone" name="zone" v-model="zone" type="checkbox" :value="item.zone"
                       class="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-600"/>
                <label :for="item.zone"
                       class="text-gray-900 hover:cursor-pointer">{{ item.zone }}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-full">
        <div class="grid grid-cols-12">
          <div
              class="lg:col-span-1 md:col-span-2 px-4 mr-6 text-right text-base font-bold leading-6 text-gray-900">
            类型
          </div>
          <div class="lg:col-span-11 md:col-span-10 px-4">
            <div class="flex flex-wrap gap-x-5">
              <div class="relative flex items-center gap-x-3 pb-2 w-40" v-for="(item,index) in types" :key="index">
                <input :id="item.type" name="type" v-model="type" type="checkbox" :value="item.type"
                       class="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-600"/>
                <label :for="item.type" class="text-gray-900 hover:cursor-pointer">{{ item.type }}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container mx-auto mt-12">
    <div class="text-sm text-center text-gray-600 px-4 py-3" v-if="result">
      <h4>共检索到 <span class="font-semibold text-red-600">{{ result.length }}</span> 条符合条件的有声语料数据</h4>
    </div>
    <div class="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
      <div class="w-full overflow-x-auto">
        <table class="w-full" v-if="result">
          <thead>
          <tr class="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b">
            <th class="px-4 py-3">编号</th>
            <th class="px-4 py-3">方言点</th>
            <th class="px-4 py-3">类型</th>
            <th class="px-4 py-3">关键词</th>
            <th class="px-4 py-3">有声语料</th>
          </tr>
          </thead>
          <tbody class="bg-white">
          <tr class="text-gray-700" v-for="(row,index) in result" :key="index">
            <td class="px-4 py-3 border-b">
              <p>{{ row.id }}</p>
            </td>
            <td class="px-4 py-3 border-b">
              <p>{{ row.zone }}</p>
            </td>
            <td class="px-4 py-3 border-b">
              <p>{{ row.type }}</p>
            </td>
            <td class="px-4 py-3 border-b">
              <p>{{ row.keyword }}</p>
            </td>
            <td class="px-4 py-3 border-b">
              <p>
                <audio preload="auto" controls>
                  <source :src="`${config.resource_dir+row.path}`" type="audio/wav"/>
                </audio>
              </p>
            </td>
          </tr>
          </tbody>
        </table>
        <table class="w-full" v-else-if="overall">
          <caption class="caption-top text-gray-600 px-4 py-3">桂林平话土话有声语料库语料数据统计表</caption>
          <thead>
          <tr class="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b">
            <th class="px-4 py-3">方言点</th>
            <th class="px-4 py-3">单字</th>
            <th class="px-4 py-3">词汇</th>
            <th class="px-4 py-3">语法</th>
            <th class="px-4 py-3">口头文化</th>
          </tr>
          </thead>
          <tbody class="bg-white">
          <tr class="text-gray-700" v-for="(row,index) in overall" :key="index">
            <td class="px-4 py-3 border-b">
              <p>{{ row.zone }}</p>
            </td>
            <td class="px-4 py-3 border-b">
              <p>{{ row.dz }}</p>
            </td>
            <td class="px-4 py-3 border-b">
              <p>{{ row.ch }}</p>
            </td>
            <td class="px-4 py-3 border-b">
              <p>{{ row.yf }}</p>
            </td>
            <td class="px-4 py-3 border-b">
              <p>{{ row.ktwh }}</p>
            </td>
          </tr>
          </tbody>
        </table>
        <blockquote
            class="container relative mt-12 p-8 text-xl rounded-lg border-dashed border-2 bg-cyan-100 text-cyan-600 border-cyan-500 quote"
            v-else>
          <h2 class="text-center text-2xl leading-loose font-bold">桂林平话土话有声语料库检索系统使用说明</h2>
          <ol class="list-decimal">
            <li>
              本检索系统仅提供方言点和类型检索，方言点共12个，类型共4种。
            </li>
            <li>
              查询关键字为有声语料例字。
            </li>
            <li>
              查询系统为模糊查询，只要例字中包含查询关键字都能在结果中显示出来。若不输入关键字，则默认为对应方言点和类型的全部有声语料查询。
            </li>
            <li>
              查询结果为列表形式，可直接播放有声语料。
            </li>
          </ol>
        </blockquote>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>