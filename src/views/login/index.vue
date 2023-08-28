<template>
    <div class="login-box">
        <el-form :model="form" ref="ruleFormRef" label-width="120px" status-icon :rules="rules" class="login-form">
            <el-form-item label="UserName" prop="userName">
                <el-input v-model="form.userName" />
            </el-form-item>
            <el-form-item label="PassWord" prop="passWord">
                <el-input v-model="form.passWord" type="password" @keyup.enter.native="submitForm(ruleFormRef)"/>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm(ruleFormRef)">Submit</el-button>
                <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
                <el-button type="danger" @click="goRegister()">Register</el-button>
            </el-form-item>
        </el-form>
    </div>
</template> 
  
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import loginApi from '@/api/login'
import { onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user'; 

const router = useRouter()
const ruleFormRef = ref<FormInstance>()
const userStore = useUserStore()

const checkName = (rule: any, value: any, callback: any) => {
    console.log(rule);
    if (!value) {
        return callback(new Error('Please input the username'))
    } else {
        callback()
    }
}

const validatePass = (rule: any, value: any, callback: any) => {
    console.log(rule);
    if (value === '') {
        callback(new Error('Please input the password'))
    } else {
        callback()
    }
}

// do not use same name with ref
const form = reactive({
    userName: '',
    passWord: ''
})

const rules = reactive<FormRules<typeof form>>({
    userName: [{ validator: checkName, trigger: 'blur' }],
    passWord: [{ validator: validatePass, trigger: 'blur' }]
})

const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            console.log('submit!')
            loginApi
            .login(form.userName, form.passWord)
            .then(res=>{
                console.log(res);
                if('err' in res){
                    resetForm(formEl);
                }else{
                    userStore.setUserName(res.data.user_name);
                    userStore.setAccessToken(res.data.access_token);
                    userStore.setUserId(Number(res.data.user_id));
                    userStore.setExpires(Number(res.data.expires));
                    
                    router.push('/home');
                }
            })


        } else {
            console.log('error submit!')
            return false
        }
    })
}


const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}

const goRegister = () => {
    console.log('register!');
    
    router.push('/register');
}

onMounted(() => {
    console.log(`the component is now mounted.`)
})


</script>

<style>
.login-box {
    width: 400px;
    margin: 0 auto;
    padding: 30px;
    border-radius: 10px;
    text-align: center;
}

.login-form {
    margin-top: 20em;
}
</style>
  