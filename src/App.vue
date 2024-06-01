<script setup>
import {onMounted, onUnmounted, ref, toRaw} from "vue";

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
let basepath = ref(null);
const totalDz = ref(null);
const totalCh = ref(null);
const totalYf = ref(null);
const totalCpyl = ref(null);

onMounted(async () => {
  window.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      search();
    }
  });

  try {
    config.value = await window.config.getConfig();
    basepath.value = await window.helper.getBasePath();

    params = {
      dbfile: `${basepath.value}${config.value.db_file}`
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
    totalDz.value = Object.values(overall.value).reduce((sum, item) => {
      return sum + item.dz
    }, 0);
    totalCh.value = Object.values(overall.value).reduce((sum, item) => {
      return sum + item.ch
    }, 0);
    totalYf.value = Object.values(overall.value).reduce((sum, item) => {
      return sum + item.yf
    }, 0);
    totalCpyl.value = Object.values(overall.value).reduce((sum, item) => {
      return sum + item.cpyl
    }, 0);

  } catch (error) {
    console.error(error);
  }
})

onUnmounted(async () => {
  window.removeEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      search();
    }
  });
});

async function search() {
  try {
    config.value = await window.config.getConfig();
    basepath.value = await window.helper.getBasePath();

    params = {
      zone: toRaw(zone.value),
      type: toRaw(type.value),
      keyword: keyword.value,
      dbfile: `${basepath.value}${config.value.db_file}`
    };

    console.log('search:', params);

    result.value = await window.db.getRecords(params);
    Object.values(result.value).forEach(item => {
      item.path = `file:///${basepath.value}${config.value.resource_dir}${item.path}`;
    })

    console.log('result:', result.value);
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <div
      class="lg:fixed top-0 w-full z-50 pb-6 bg-sky-300 bg-[url('../img/logo.png')] bg-fixed bg-no-repeat bg-contain">
    <div>
      <h1 class="text-center text-5xl/loose xl:text-7xl/loose font-black font-qi text-slate-100 drop-shadow-lg text-transparent bg-gradient-to-b from-white to-gray-300 bg-clip-text gradient">
        桂北平话（土话）有声语料库</h1>
    </div>
    <div class="container mx-auto backdrop-blur-sm bg-white/30 shadow-2xl rounded-lg">
      <div class="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div class="col-span-full">
          <!--        <label for="keyword" class="block text-sm font-bold leading-6 text-gray-900">检索词</label>-->
          <!--        <div class="mt-2">-->
          <div class="relative flex w-full flex-wrap items-stretch">
            <input type="text" name="keyword" v-model="keyword" placeholder="请输入有声语料例字词进行检索"
                   autocomplete="keyword"
                   class="relative block flex-auto rounded-s border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6">
            <button type="button" @click="search"
                    class="inline-block rounded-e bg-sky-600 px-3 py-2 text-base text-white shadow-lg hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600">
              检索
            </button>
          </div>
        </div>
        <div class="col-span-full">
          <div class="grid grid-cols-12">
            <div
                class="lg:col-span-1 md:col-span-2 px-4 mr-6 text-right text-lg font-bold leading-6 text-gray-900">
              方言点
            </div>
            <div class="lg:col-span-11 md:col-span-10 px-4">
              <div class="flex flex-wrap gap-x-5">
                <div class="relative flex items-center gap-x-3 pb-2 w-32" v-for="(item,index) in zones"
                     :key="index">
                  <input :id="item.zone" name="zone" v-model="zone" type="checkbox" :value="item.zone"
                         class="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600"/>
                  <label :for="item.zone"
                         class="text-gray-900 hover:cursor-pointer font-semibold">{{ item.zone }}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-span-full pb-6">
          <div class="grid grid-cols-12">
            <div
                class="lg:col-span-1 md:col-span-2 px-4 mr-6 text-right text-lg font-bold leading-6 text-gray-900">
              类型
            </div>
            <div class="lg:col-span-11 md:col-span-10 px-4">
              <div class="flex flex-wrap gap-x-5">
                <div class="relative flex items-center gap-x-3 pb-2 w-32" v-for="(item,index) in types" :key="index">
                  <input :id="item.type" name="type" v-model="type" type="checkbox" :value="item.type"
                         class="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600"/>
                  <label :for="item.type" class="text-gray-900 hover:cursor-pointer font-semibold">{{
                      item.type
                    }}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container mx-auto md:mt-2 lg:mt-[26rem]">
    <div class="text-sm text-center text-gray-600 px-4 pb-3" v-if="result">
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
          <tr class="text-gray-700 hover:bg-blue-100 hover:font-semibold" v-for="(row,index) in result" :key="index">
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
                  <source :src="row.path" type="audio/wav"/>
                </audio>
              </p>
            </td>
          </tr>
          </tbody>
        </table>
        <table class="w-full" v-else-if="overall">
          <caption class="caption-top text-gray-600 px-4 pb-3">桂北平话（土话）有声语料库语料数据统计表</caption>
          <thead>
          <tr class="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b">
            <th class="px-4 py-3">方言点</th>
            <th class="px-4 py-3">单字</th>
            <th class="px-4 py-3">词汇</th>
            <th class="px-4 py-3">语法</th>
            <th class="px-4 py-3">长篇语料</th>
            <th class="px-4 py-3">合计</th>
          </tr>
          </thead>
          <tbody class="bg-white">
          <tr class="text-gray-700 hover:bg-blue-100 hover:font-semibold" v-for="(row,index) in overall" :key="index">
            <td class="px-4 py-3 border-b">
              <p><strong>{{ row.zone }}</strong></p>
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
              <p>{{ row.cpyl }}</p>
            </td>
            <td class="px-4 py-3 border-b">
              <p>{{ row.dz + row.ch + row.yf + row.cpyl }}</p>
            </td>
          </tr>
          </tbody>
          <tfoot>
          <tr class="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase">
            <th class="px-4 py-3">总计</th>
            <th class="px-4 py-3">{{ totalDz }}</th>
            <th class="px-4 py-3">{{ totalCh }}</th>
            <th class="px-4 py-3">{{ totalYf }}</th>
            <th class="px-4 py-3">{{ totalCpyl }}</th>
            <th class="px-4 py-3">{{ totalDz + totalCh + totalYf + totalCpyl }}</th>
          </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
  <blockquote
      class="container relative mt-12 p-8 text-xl rounded-2xl border-dashed border-2 bg-sky-100 text-gray-900 border-sky-500 quote"
      v-if="overall">
    <h2 class="text-center text-2xl/loose font-bold">桂北平话（土话）有声语料库系统使用说明</h2>
    <ol class="list-decimal px-8">
      <li class="py-2">
        本检索系统仅提供方言点和类型检索，方言点共12个，类型共4种。
      </li>
      <li class="py-2">
        查询关键字为有声语料例字。
      </li>
      <li class="py-2">
        查询系统为模糊查询，只要例字中包含查询关键字都能在结果中显示出来。若不输入关键字，则默认为对应方言点和类型的全部有声语料查询。
      </li>
      <li class="py-2">
        查询结果为列表形式，可直接播放有声语料。
      </li>
    </ol>
  </blockquote>
</template>

<style scoped>

</style>