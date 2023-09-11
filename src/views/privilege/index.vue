<template>
    <div class="tree-box">
        <div class="custom-tree-container">
            <p>权限树</p>
            <el-tree :data="dataSource" node-key="id" default-expand-all :expand-on-click-node="false">
                <template #default="{ node, data }">
                    <span class="custom-tree-node">

                        <span icon="Menu">{{ node.label }}</span>
                        <span>
                            <a @click="append(data)"> <el-icon size="large">
                                    <Plus />
                                </el-icon> </a>
                            <a @click="handleEdit(data)" style="margin-left: 8px;"> <el-icon size="large">
                                    <Edit />
                                </el-icon> </a>
                            <a style="margin-left: 8px; color: darkred" @click="handleDelete(data)">
                                <el-icon size="large">
                                    <Close />
                                </el-icon>
                            </a>
                        </span>

                    </span>
                </template>
            </el-tree>
            <!-- 新增角色 -->
            <div class="add-root">
                <ElButton type="danger" size="small" @click="addRootPrivilege"><el-icon>
                        <Plus />
                    </el-icon>
                    添加根权限</ElButton>
            </div>
        </div>
    </div>

    <!-- 新增权限弹出窗口 -->
    <el-dialog v-model="dialogAddPrivilegeVisible" title="新增权限" width="50%">
        <el-form ref="ruleAddPrivilegeFormRef" :model="addPrivilegeForm" status-icon :rules="addPrivilegeRules"
            label-width="120px" class="demo-ruleForm">
            <el-form-item label="权限名称" prop="privilege_name">
                <el-input v-model="addPrivilegeForm.privilege_name" />
            </el-form-item>
            <el-form-item label="控制器名称" prop="controller_name" v-if="addPrivilegeForm.is_menu == 0">
                <el-input v-model="addPrivilegeForm.controller_name" />
            </el-form-item>
            <el-form-item label="按钮名称" prop="button_name" v-if="addPrivilegeForm.is_menu == 1">
                <el-input v-model="addPrivilegeForm.button_name" />
            </el-form-item>
            <el-form-item label="路径名称" prop="path_name" v-if="addPrivilegeForm.is_menu == 1">
                <el-input v-model="addPrivilegeForm.path_name" />
            </el-form-item>
            <el-form-item label="是否菜单项" prop="is_menu">
                <el-switch v-model="addPrivilegeForm.is_menu" active-value="1" inactive-value="0" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmitAddPrivilege(ruleAddPrivilegeFormRef)">Submit</el-button>
                <el-button @click="cancelAddPrivilege(ruleAddPrivilegeFormRef)">Cancel</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>

    <!-- 编辑权限弹出窗口 -->
    <el-dialog v-model="dialogEditPrivilegeVisible" title="编辑权限" width="50%">
        <el-form ref="ruleEditPrivilegeFormRef" :model="editPrivilegeForm" status-icon :rules="editPrivilegeRules"
            label-width="120px" class="demo-ruleForm">
            <el-input v-model="editPrivilegeForm.id" type="hidden" />
            <el-input v-model="editPrivilegeForm.parent_id" type="hidden" />
            <el-form-item label="权限名称" prop="privilege_name">
                <el-input v-model="editPrivilegeForm.privilege_name" />
            </el-form-item>
            <el-form-item label="控制器名称" prop="controller_name" v-if="editPrivilegeForm.is_menu == 0">
                <el-input v-model="editPrivilegeForm.controller_name" />
            </el-form-item>
            <el-form-item label="按钮名称" prop="button_name" v-if="editPrivilegeForm.is_menu == 1">
                <el-input v-model="editPrivilegeForm.button_name" />
            </el-form-item>
            <el-form-item label="路径名称" prop="path_name" v-if="editPrivilegeForm.is_menu == 1">
                <el-input v-model="editPrivilegeForm.path_name" />
            </el-form-item>
            <el-form-item label="是否菜单项" prop="is_menu">
                <el-switch v-model="editPrivilegeForm.is_menu" :active-value="1" :inactive-value="0"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmitEditPrivilege(ruleEditPrivilegeFormRef)">Submit</el-button>
                <el-button @click="cancelEditPrivilege(ruleEditPrivilegeFormRef)">Cancel</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue";
import privilegeApi from "@/api/privilege";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessageBox, ElMessage } from "element-plus"


interface Tree {
    id: number;
    label: string;
    children?: Tree[];
}

const append = (data: Tree) => {
    console.log(data);
    addPrivilegeForm.parent_id = data.id;
    dialogAddPrivilegeVisible.value = true;
};

const addRootPrivilege = () => {
    addPrivilegeForm.parent_id = 0;
    dialogAddPrivilegeVisible.value = true;
}


const handleDelete = (data: Tree) => {
    console.log("handleDelete");

    const id = data.id;
    ElMessageBox.confirm(
        '权限及其子权限即将被删除！ 是否继续?',
        'Warning',
        {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
        }
    )
        .then(() => {
            privilegeApi
                .deletePrivilegeById(id)
                .then(res => {
                    console.log(res);
                    if ('err' in res) {

                    } else {
                        loadPrivilegeTree();
                    }
                })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已放弃删除权限！',
            })
        })
};

const dataSource = ref<Tree[]>([]);
const loadPrivilegeTree = () => {
    console.log("loading...");
    privilegeApi.getPrivilegeTree().then((res) => {
        console.log(res);

        if ("err" in res) {
        } else {
            dataSource.value = res.data;
        }
    });
};

onMounted(() => {
    loadPrivilegeTree();
});

//以下新增权限相关
const ruleAddPrivilegeFormRef = ref<FormInstance>();
const dialogAddPrivilegeVisible = ref(false);
const addPrivilegeForm = reactive({
    privilege_name: "",
    parent_id: 0,
    controller_name: "no",
    button_name: "",
    path_name: "",
    is_menu: 0,
});
const checkPrivilegeName = (rule: any, value: any, callback: any) => {
    console.log(rule);
    if (!value) {
        return callback(new Error("Please input the Privilege Name!"));
    }
    privilegeApi.isPrivilegeExist(value).then((res) => {
        if (res.data.is_exist == 1) {
            callback(new Error("This Privilege name is Exist!"));
        } else {
            callback();
        }
    });
};

const checkControllerName = (rule: any, value: any, callback: any) => {
    console.log(rule);
    if (!value && addPrivilegeForm.is_menu == 0) {
        return callback(new Error("请填写控制器名称!"));
    } else {
        callback();
    }
};

const checkButtonName = (rule: any, value: any, callback: any) => {
    console.log(rule);
    if (!value && addPrivilegeForm.is_menu == 1) {
        return callback(new Error("菜单项权限必须填写菜单按钮名称!"));
    } else {
        callback();
    }
};

const checkPathName = (rule: any, value: any, callback: any) => {
    console.log(rule);
    if (!value && addPrivilegeForm.is_menu == 1) {
        return callback(new Error("菜单项权限必须填写路径名称!"));
    } else {
        callback();
    }
};

const addPrivilegeRules = reactive<FormRules<typeof addPrivilegeForm>>({
    privilege_name: [{ validator: checkPrivilegeName, trigger: "blur" }],
    controller_name: [{ validator: checkControllerName, trigger: "blur" }],
    button_name: [{ validator: checkButtonName, trigger: "blur" }],
    path_name: [{ validator: checkPathName, trigger: "blur" }],
});

const cancelAddPrivilege = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
    dialogAddPrivilegeVisible.value = false;
    loadPrivilegeTree();
};

const onSubmitAddPrivilege = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid) => {
        if (valid) {
            console.log("submit!");
            privilegeApi.addPrivilege(addPrivilegeForm).then((res) => {
                if ("err" in res) {
                } else {
                    dialogAddPrivilegeVisible.value = false;
                    loadPrivilegeTree();
                }
            });
        } else {
            console.log("error submit!");
            return false;
        }
    });
};

// 以下编辑权限相关
const dialogEditPrivilegeVisible = ref(false);
const ruleEditPrivilegeFormRef = ref<FormInstance>();
const editPrivilegeForm = reactive({
    id: 0,
    privilege_name: "",
    parent_id: 0,
    controller_name: "no",
    button_name: "",
    path_name: "",
    is_menu: 0,
});

const checkPrivilegeNameEdit = (rule: any, value: any, callback: any) => {
    console.log(rule);
    if (!value) {
        return callback(new Error("Please input the Privilege Name!"));
    }else{
        callback();
    }
};

const checkControllerNameEdit = (rule: any, value: any, callback: any) => {
    console.log(rule);
    if (!value && editPrivilegeForm.is_menu == 0) {
        return callback(new Error("请填写控制器名称!"));
    } else {
        callback();
    }
};

const checkButtonNameEdit = (rule: any, value: any, callback: any) => {
    console.log(rule);
    if (!value && editPrivilegeForm.is_menu == 1) {
        return callback(new Error("菜单项权限必须填写菜单按钮名称!"));
    } else {
        callback();
    }
};

const checkPathNameEdit = (rule: any, value: any, callback: any) => {
    console.log(rule);
    if (!value && editPrivilegeForm.is_menu == 1) {
        return callback(new Error("菜单项权限必须填写路径名称!"));
    } else {
        callback();
    }
};

const editPrivilegeRules = reactive<FormRules<typeof editPrivilegeForm>>({
    privilege_name: [{ validator: checkPrivilegeNameEdit, trigger: "blur" }],
    controller_name: [{ validator: checkControllerNameEdit, trigger: "blur" }],
    button_name: [{ validator: checkButtonNameEdit, trigger: "blur" }],
    path_name: [{ validator: checkPathNameEdit, trigger: "blur" }],
});

const onSubmitEditPrivilege = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid) => {
        if (valid) {
            console.log("submit!");
            privilegeApi.editPrivilege(editPrivilegeForm).then((res) => {
                if ("err" in res) {
                } else {
                    dialogEditPrivilegeVisible.value = false;
                    loadPrivilegeTree();
                }
            });
        } else {
            console.log("error submit!");
            return false;
        }
    });
}

const cancelEditPrivilege = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
    dialogEditPrivilegeVisible.value = false;
    loadPrivilegeTree();
};

const handleEdit = (data: Tree) => {
    privilegeApi
        .getPrivilegeByPrivilegeId(data.id)
        .then(res => {
            console.log();
            
            editPrivilegeForm.id = res.data.id;
            editPrivilegeForm.privilege_name = res.data.privilege_name;
            editPrivilegeForm.parent_id = res.data.parent_id;
            editPrivilegeForm.controller_name = res.data.controller_name;
            editPrivilegeForm.button_name = res.data.button_name;
            editPrivilegeForm.path_name = res.data.path_name;
            editPrivilegeForm.is_menu = res.data.is_menu;
            console.log(editPrivilegeForm);

            dialogEditPrivilegeVisible.value = true;
        })
}
</script>

<style scoped>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}

.tree-box {
    margin-left: 10em;
    margin-right: 10em;
    margin-top: 1em;
}

.add-root {
    padding: 1em;
    text-align: right;
}
</style>
