<template>
  <div class="user-box">

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="user_name" label="Name" width="180" />
      <el-table-column prop="add_time_str" label="Add Time" width="180" />
      <el-table-column label="Stauts">
        <template prop="status" v-slot="scope1">
          <el-switch v-model="scope1.row.status" :inactive-value="0" :active-value="1"
            v-on:change="changeUse(scope1.row.id)" size="small"></el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Operations" width="100">
        <template v-slot="scope2">
          <el-button link type="default" size="small"  @click="handleRole(scope2.row.id)"><el-icon>
              <User />
            </el-icon></el-button>
          <el-button link type="danger" size="small" @click="handleDelete(scope2.row.id)"><el-icon>
              <Delete />
            </el-icon></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 翻页 -->
    <div class="pagination-block" v-if="isNeedPage">
      <el-pagination layout="prev, pager, next" :page-size="limit" :total="total" @current-change="handleCurrentChange"/>
    </div>

    <!-- 分配用户角色 -->
    <el-dialog title="选择用户角色" v-model="dialogRoleFormVisible">
      <el-checkbox-group v-model="checkedRoleList">
        <el-checkbox v-for="role in roleList" :key="role.id" :label="role.id">{{role.role_name}}</el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRoleForm()">提交</el-button>
        <el-button @click="resetRoleForm()">重置</el-button>
        <el-button @click="dialogRoleFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>
  
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import userApi from '@/api/user';
import { dayjs } from "element-plus";
import { ElMessage, ElMessageBox } from 'element-plus';


onMounted(() => {
  getUsersList(limit, offset)
});

//以下表格相关
let tableData = ref()
const getUsersList = (limit: number, offset: number) => {
  console.log('getUsersList!');

  userApi
    .getUsersList(limit, offset)
    .then(res => {
      console.log(res);
      let usersList = [];
      total.value = res.data.users_count;
      if(total.value > limit){
        isNeedPage.value = true;
      }
      
      for (let ul of res.data.users_list) {
        ul['add_time_str'] = dayjs(ul.add_time * 1000).format("YYYY-MM-DD")
        usersList.push(ul)
      }

      tableData.value = usersList;
    })
};

const handleDelete = (index:number) => {
  console.log('handleDelete');
  console.log(index);

  ElMessageBox.confirm(
    '用户即将被删除！ 是否继续?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(() => {
      userApi
  .deleteUserById(index)
  .then(res=>{
    console.log(res);
    if('err' in res){

    }else{
      getUsersList(limit, offset)
    }
  })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已放弃删除用户！',
      })
    })

}

const changeUse = (id: number) => {
  console.log(id);
  userApi
    .changeUserStatus(id)
    .then(res => {
      console.log(res);
    })
}

//以下角色分配需要
const dialogRoleFormVisible = ref(false);
const checkedRoleList = ref([]);
const roleList = ref();
let changed_user_id:number;

const submitRoleForm = ()=>{
  userApi
  .changeUserRole(changed_user_id, checkedRoleList.value)
  .then(res=>{
    console.log(res);
    dialogRoleFormVisible.value = false;
  })
};

const resetRoleForm = ()=>{
  checkedRoleList.value = [];
};

const handleRole = (user_id:number)=>{
  changed_user_id = user_id;
  userApi
  .getRoleByUserId(user_id)
  .then(res=>{
    roleList.value = res.data.roleList;
    checkedRoleList.value = res.data.checkedRoleList;
    dialogRoleFormVisible.value = true;
  })
}

//以下为翻页需要
const isNeedPage = ref(false);
const total = ref(0);
const limit: number = 10;
let offset: number = 0;

const handleCurrentChange = (val:number)=>{
  console.log(val);
  offset = val - 1;
  getUsersList(limit, offset);
}

</script>
<style scope>
.user-box {
  padding-top: 2em;
  padding-left: 10em;
  padding-right: 10em;
}

.pagination-block {
  text-align: center;
  margin: auto;
  margin-top: 1em;
}
</style>
  