import request from "@/utils/request"

const roleApi = {

    getRolesList(limit:number, offset:number) {
        return request({
            url: '/roles_list',
            method: 'post',
            data: {
                limit,
                offset
            }
        })
    },

    addRole(role_name:string) {
        return request({
            url: '/role',
            method: 'post',
            data: {
                role_name
            }
        })
    },

    isRoleExist(role_name:string) {
        return request({
            url: '/is_role_name_exist',
            method: 'post',
            data: {
                role_name
            }
        })
    },

    deleteRoleById(role_id:number){
        return request({
            url: `/role/${role_id}`,
            method: 'delete'
        })
    },

    editRole(form:any){
        return request({
            url:'/role',
            method:'put',
            data:{
                form
            }
        })
    }
}

export default roleApi;


