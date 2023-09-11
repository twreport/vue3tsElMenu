import request from "@/utils/request"

const userApi = {
    getUsersList(limit:number, offset:number) {
        return request({
            url: '/users_list',
            method: 'post',
            data: {
                limit,
                offset
            }
        })
    },

    deleteUserById(user_id:number){
        return request({
            url: `/user/${user_id}`,
            method: 'delete'
        })
    },

    changeUserStatus(user_id: number) {
        return request({
            url: '/user_status',
            method: 'post',
            data: {
                user_id
            }
        })
    },

    getRoleByUserId(user_id:number) {
        return request({
            url: '/get_role_by_user_id',
            method: 'post',
            data: {
                user_id
            }
        })
    },

    changeUserRole(changed_user_id:number, checkedRoleList:number[]) {
        return request({
            url: '/change_user_role',
            method: 'post',
            data: {
                changed_user_id,
                checkedRoleList
            }
        })
    }
}


export default userApi;