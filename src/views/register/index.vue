<template>
    <div class="register-box">
        <h1>Register</h1>
        <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="120px"
            class="register-ruleForm">
            <el-form-item label="Username" prop="username">
                <el-input v-model.number="ruleForm.username" />
            </el-form-item>
            <el-form-item label="Password" prop="pass">
                <el-input v-model="ruleForm.pass" type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Confirm" prop="checkPass">
                <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off" />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm(ruleFormRef)">Submit</el-button>
                <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
  
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import loginApi from '@/api/login';
import { useRouter } from 'vue-router';

const ruleFormRef = ref<FormInstance>()
const router = useRouter()
const checkUsername = (rule: any, value: any, callback: any) => {
    console.log(rule);
    if (!value) {
        return callback(new Error('Please input the username'))
    }
    if (value.length < 6) {
            callback(new Error('Username length must be greater than 6'))
        } else {
            loginApi
            .isUerExist(value)
            .then(res=>{
                console.log(res);
                
                if(res.data.user_id != 0){
                    callback(new Error('Username is Exist!'))
                }else{
                    callback()
                }
            })
        }
}

const validatePass = (rule: any, value: any, callback: any) => {
    console.log(rule);
    if (value === '') {
        callback(new Error('Please input the password'))
    } else if (value.length < 6) {
        callback(new Error('Username length must be greater than 6'))
    } else {
        if (ruleForm.checkPass !== '') {
            if (!ruleFormRef.value) return
            ruleFormRef.value.validateField('checkPass', () => null)
        }
        callback()
    }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
    console.log(rule);
    if (value === '') {
        callback(new Error('Please input the password again'))
    } else if (value !== ruleForm.pass) {
        callback(new Error("Two inputs don't match!"))
    } else {
        callback()
    }
}

const ruleForm = reactive({
    pass: '',
    checkPass: '',
    username: '',
})

const rules = reactive<FormRules<typeof ruleForm>>({
    pass: [{ validator: validatePass, trigger: 'blur' }],
    checkPass: [{ validator: validatePass2, trigger: 'blur' }],
    username: [{ validator: checkUsername, trigger: 'blur' }],
})

const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            console.log('submit!')
            console.log(ruleForm);
            loginApi
                .register(ruleForm.username, ruleForm.pass)
                .then(res => {
                    console.log(res)
                    if('err' in res){
                        resetForm(formEl);
                    }else{
                        router.push('/login')
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
</script>
<style scoped>
.register-box {
    width: 400px;
    margin: 0 auto;
    padding: 30px;
    border-radius: 10px;
    text-align: center;
    margin-top: 10em;
}

.register-ruleForm {
    /* margin-top: 20em; */
}
</style>
  