<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    <el-menu-item index="0">TANG SEEDS</el-menu-item>
    <div class="flex-grow" />
    <el-menu-item index="1">Processing Center</el-menu-item>
    <el-sub-menu index="2">
      <template #title>Workspace</template>
      <el-menu-item index="2-1">item one</el-menu-item>
      <el-menu-item index="2-2">item two</el-menu-item>
      <el-menu-item index="2-3">item three</el-menu-item>
      <el-sub-menu index="2-4">
        <template #title>item four</template>
        <el-menu-item index="2-4-1">item one</el-menu-item>
        <el-menu-item index="2-4-2">item two</el-menu-item>
        <el-menu-item index="2-4-3">item three</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-sub-menu index="9">
      <template #title>User: {{ user_name }}</template>
      <el-menu-item index="9-1">User Center</el-menu-item>
      <el-menu-item index="9-2">Logout</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>
  
  <script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useUserStore } from "@/store/user";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

const router = useRouter();
const userStore = useUserStore();
// const user_name = window.localStorage.getItem("user_name");
let { user_name } = storeToRefs(userStore);
// let user_name = computed(()=>{
//   return userStore.getUserName;
// })

const activeIndex = ref("1");
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
  if (key == "9-2") {
    logout();
  }
};

const logout = () => {
  userStore.setAccessToken("");
  userStore.setUserName("");
  userStore.setExpires(0);
  userStore.setUserId(0);
  userStore.$reset();
  router.push("/login");
};

onMounted(() => {

});
</script>
  
  <style>
.flex-grow {
  flex-grow: 1;
}
</style>
  
