import request from "@/utils/request"

const privilegeApi = {

    getPrivilegeByRoleId(role_id:number) {
        return request({
            url: '/privileges_tree',
            method: 'post',
            data: {
                role_id
            }
        })
    },

    getPrivilegeByPrivilegeId(privilege_id:number) {
        return request({
            url: `/privilege/${privilege_id}`,
            method: 'get',
        })
    },

    getPrivilegeTree(){
        return request({
            url: '/privileges_tree',
            method: 'get'
        })
    },

    submitPrivilege(role_id:number, role_privilege:number[]) {
        return request({
            url: '/reset_role_privileges',
            method: 'post',
            data: {
                role_id,
                role_privilege
            }
        })
    },

    isPrivilegeExist(privilege_name:string) {
        return request({
            url: '/is_privilege_name_exist',
            method: 'post',
            data: {
                privilege_name
            }
        })
    },

    addPrivilege(form: any){
        return request({
            url: '/privilege',
            method: 'post',
            data: {
                form
            }
        })
    },

    deletePrivilegeById(privilege_id:number) {
        return request({
            url: `/privilege/${privilege_id}`,
            method: 'delete'
        })
    },

    editPrivilege(form: any) {
        return request({
            url: '/privilege',
            method: 'put',
            data: {
                form
            }
        })
    }
}

export default privilegeApi;
