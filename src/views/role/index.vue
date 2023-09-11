<template>
  <div class="role-box">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="role_name" label="Name" />

      <el-table-column fixed="right" label="Operations" width="150">
        <template v-slot="scope2">
          <el-button link type="default" size="small" @click="handlePrivilege(scope2.row.id)"><el-icon>
              <Connection />
            </el-icon></el-button>
            <el-button link type="default" size="small" @click="handleEdit(scope2.row)"><el-icon>
              <Edit />
            </el-icon></el-button>
          <el-button link type="danger" size="small" @click="handleDelete(scope2.row.id)"><el-icon>
              <Delete />
            </el-icon></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增角色 -->
    <div class="add-role">
      <ElButton type="danger" size="small" @click="addRole"><el-icon>
          <Plus />
        </el-icon>
        添加新角色</ElButton>
    </div>
    <el-dialog v-model="dialogAddRoleVisible" title="新增角色" width="50%">
      <el-form ref="ruleAddRoleFormRef" :model="addRoleForm" status-icon :rules="addRoleRules" label-width="120px"
        class="demo-ruleForm">
        <el-form-item label="角色名称" prop="role_name">
          <el-input v-model="addRoleForm.role_name" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmitAddRole(ruleAddRoleFormRef)">Submit</el-button>
          <el-button @click="cancelAddRole">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 编辑角色 -->
    <el-dialog v-model="dialogEditRoleVisible" title="编辑角色" width="50%">
      <el-form ref="ruleEditRoleFormRef" :model="editRoleForm" status-icon :rules="editRoleRules" label-width="120px"
        class="demo-ruleForm">
        <el-input v-model="editRoleForm.id" type="hidden"/>
        <el-form-item label="角色名称" prop="role_name">
          <el-input v-model="editRoleForm.role_name" placeholder="editRoleForm.role_name"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmitEditRole(ruleEditRoleFormRef)">Submit</el-button>
          <el-button @click="cancelEditRole(ruleEditRoleFormRef)">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 一个app的角色不会很多，不设置翻页 -->

    <!-- 权限设置对话框 -->
    <el-dialog v-model="dialogPrivilegeVisible" title="Tips" width="50%">
      <div class="custom-tree-container">
        <el-tree ref="tree" :data="data" :props="defaultProps" node-key="id" show-checkbox default-expand-all
          :default-checked-keys="rolePrivilege" @check-change="handleCheckChange" />
        <div class="privilege-sumbit">
          <el-button-group>
            <el-button type="danger" size="small" @click="submitPrivilege">提交<el-icon>
                <Upload />
              </el-icon></el-button>
            <el-button size="small" @click="resetPrivilege">
              重置<el-icon>
                <Refresh />
              </el-icon>
            </el-button>
            <el-button size="small" @click="cancelPrivilege">
              取消<el-icon>
                <Close />
              </el-icon>
            </el-button>
          </el-button-group>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, reactive } from "vue";
import roleApi from "@/api/role";
import privilegeApi from "@/api/privilege";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage, ElMessageBox } from 'element-plus';

let currentRoleId: number;

onMounted(() => {
  getRolesList(limit, offset);
});

//以下表格相关
let tableData = ref();
const getRolesList = (limit: number, offset: number) => {
  console.log("getRolesList!");

  roleApi.getRolesList(limit, offset).then((res) => {
    console.log(res);

    total.value = res.data.roles_count;
    if (total.value > limit) {
      isNeedPage.value = true;
    }

    tableData.value = res.data.roles_list;
  });
};

const handleDelete = (index: number) => {
  console.log("handleDelete");
  console.log(index);

  ElMessageBox.confirm(
    '角色即将被删除！ 是否继续?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(() => {
      roleApi
        .deleteRoleById(index)
        .then(res => {
          console.log(res);
          if ('err' in res) {

          } else {
            getRolesList(limit, offset)
          }
        })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已放弃删除角色！',
      })
    })

};

const handlePrivilege = (role_id: number) => {
  console.log(role_id);
  currentRoleId = role_id;
  getPrivilegeTree(role_id);
};

//以下为翻页需要
const isNeedPage = ref(false);
const total = ref(0);
const limit: number = 1000;
let offset: number = 0;

//以下为新增角色需要
const ruleAddRoleFormRef = ref<FormInstance>();
const addRoleForm = reactive({
  role_name: "",
});

const dialogAddRoleVisible = ref(false);
const addRole = () => {
  dialogAddRoleVisible.value = true;
};

const checkRoleName = (rule: any, value: any, callback: any) => {
  console.log("check");
  console.log(rule);
  if (!value) {
    return callback(new Error("Please input the role name!"));
  }
  roleApi.isRoleExist(value).then((res) => {
    if (res.data.is_exist == 1) {
      callback(new Error("This role name is Exist!"));
    } else {
      callback();
    }
  });
};
const addRoleRules = reactive<FormRules<typeof addRoleForm>>({
  role_name: [{ validator: checkRoleName, trigger: "blur" }]
});

const cancelAddRole = () => {
  addRoleForm.role_name = ''
  dialogAddRoleVisible.value = false;
  getRolesList(limit, offset);
}

const onSubmitAddRole = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
      roleApi.addRole(addRoleForm.role_name).then((res) => {
        if ("err" in res) {
        } else {
          dialogAddRoleVisible.value = false;
          getRolesList(limit, offset);
        }
      });
    } else {
      console.log('error submit!')
      return false
    }
  })

};

// 以下为编辑角色需要
const dialogEditRoleVisible = ref(false);
const ruleEditRoleFormRef = ref<FormInstance>();
const editRoleForm = reactive({
  id: 0,
  role_name: ''
});
const editRoleRules = reactive<FormRules<typeof editRoleForm>>({
  role_name: [{ validator: checkRoleName, trigger: "blur" }]
});

const handleEdit = (row:any)=>{
  editRoleForm.id = row.id;
  editRoleForm.role_name = row.role_name;
  dialogEditRoleVisible.value = true;
}


const onSubmitEditRole = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
      roleApi.editRole(editRoleForm).then((res) => {
        if ("err" in res) {
        } else {
          dialogEditRoleVisible.value = false;
          getRolesList(limit, offset);
        }
      });
    } else {
      console.log('error submit!')
      return false
    }
  })

};

const cancelEditRole = (formEl: FormInstance | undefined)=>{
  if (!formEl) return;
    formEl.resetFields();
  dialogEditRoleVisible.value = false;
  getRolesList(limit, offset);
}


// 以下为权限设置需要
const dialogPrivilegeVisible = ref(false);
interface Tree {
  id: number;
  label: string;
  children?: Tree[];
}

const data = ref();
const rolePrivilege = ref();
const tree = ref();

const getPrivilegeTree = (role_id: number) => {
  privilegeApi.getPrivilegeByRoleId(role_id).then((res) => {
    console.log(res);
    data.value = res.data.wholePrivilegeTree;
    rolePrivilege.value = res.data.rolePrivilegeList;
    otherRolePrivilege = []; //清空临时数组
    nextTick(() => {
      tree.value.setCheckedKeys(res.data.rolePrivilegeList);
    });
    dialogPrivilegeVisible.value = true;
  });
};

const defaultProps = {
  children: "children",
  label: "label",
  value: "id",
};
let otherRolePrivilege: number[] = [];
let allRolePrivilege: number[];
// 定义一个数组，容纳RolePrivilege中本身没有被选中，但children中包含选中的节点
const handleCheckChange = (
  data: Tree,
  checked: boolean,
  indeterminate: boolean
) => {
  console.log("change!");
  console.log(data, checked, indeterminate);
  console.log(rolePrivilege.value);

  const i = rolePrivilege.value.indexOf(data.id);
  const j = otherRolePrivilege.indexOf(data.id);
  if (checked === false) {
    //如果节点被删除，无论如何先从两个数组中删除！
    if (i != -1) {
      rolePrivilege.value.splice(i, 1);
    }
    if (j != -1) {
      otherRolePrivilege.splice(j, 1);
    }
    //如果children中包含选中的节点，而且这个节点不在已选中数组中，则存入临时数组
    if (indeterminate === true) {
      otherRolePrivilege.push(data.id);
    }
  }
  if (checked === true) {
    // 如果该节点在临时数组中，则需要将该节点从临时数组删除，以保证唯一性
    if (j != -1) {
      otherRolePrivilege.splice(j, 1);
    }
    //如果节点显示被选中，则存入rolePrivilege
    if (i == -1) {
      rolePrivilege.value.push(data.id);
    }
  }
  nextTick(() => {
    tree.value.setCheckedKeys(rolePrivilege.value);
  });
  console.log("rolePrivilege:", rolePrivilege.value);
  console.log("otherRolePrivilege:", otherRolePrivilege);
  console.log("total:", rolePrivilege.value.concat(otherRolePrivilege));
  allRolePrivilege = rolePrivilege.value.concat(otherRolePrivilege);
};

const submitPrivilege = () => {
  console.log("submit!");
  privilegeApi.submitPrivilege(currentRoleId, allRolePrivilege).then((res) => {
    if ("err" in res) {
    } else {
      cancelPrivilege();
    }
  });
};

const resetPrivilege = () => {
  console.log("reset!");
  rolePrivilege.value = [];
  otherRolePrivilege = [];
  allRolePrivilege = [];
  nextTick(() => {
    tree.value.setCheckedKeys(rolePrivilege.value);
  });
};

const cancelPrivilege = () => {
  console.log("cancel!");
  rolePrivilege.value = [];
  otherRolePrivilege = [];
  allRolePrivilege = [];
  dialogPrivilegeVisible.value = false;
};
</script>

<style scoped>
.role-box {
  padding-top: 2em;
  padding-left: 10em;
  padding-right: 10em;
}

.privilege-sumbit {
  margin: 1em;
}

.add-role {
  padding: 1em;
  text-align: right;
}
</style>
