export default {
    menus: [ // 菜单相关路由
		{ key: 'A', title: '用户权限', icon: 'bars', },
        { key: 'B', title: '机构管理', icon: 'bars', },
		{ key: 'C', title: '合同维护', icon: 'bars', },
        { key: 'D', title: '融资管理', icon: 'bars', },
		{ key: 'E', title: '签章管理', icon: 'bars', },

		{
			//key :[{ key: '', title: '', icon: 'bars', }],
            subs: [
				{ key: '/app/dashboard/index', title: '首页', icon: 'home', component: 'Dashboard' },
				{ key: '/app/dashboard/updateOldPwd', title: '修改密码', icon: 'home', component: 'UpdateOldPwd' },
                { key: '/app/systemManage/permissionRouter', title: '权限管理', icon: 'star-o', component: 'PermissionList'},
                { key: '/app/systemManage/roleRouter', title: '角色管理', icon: 'star-o', component: 'RoleList'},
                { key: '/app/systemManage/userRouter', title: '用户管理', icon: 'star-o', component: 'UserList'},
                { key: '/app/conFinRule/signtempalteRouter', title: '签章模板管理', icon: 'star-o', component: 'SignTempalteList'},
                { key: '/app/conFinRule/signParmRouter', title: '签章模板参数配置', icon: 'star-o', component: 'SignParmList'},
                { key: '/app/conFinRule/signConConfRouter', title: '签章模板启用', icon: 'star-o', component: 'SignConConfList'},

                { key: '/app/conFinRule/orgSignRouter', title: '机构签章认证', icon: 'star-o', component: 'OrgSignList'},
                { key: '/app/conFinRule/tfeeRateConfRouter', title: '富金服费率维护', icon: 'star-o', component: 'TfeeRateConfList'},

                { key: '/app/conFinRule/contractConfRouter', title: '合同配置维护', icon: 'star-o', component: 'ContractConfList'},
                { key: '/app/conFinRule/subCon', title: '供应合同表', icon: 'star-o', component: 'SubConList'},

				{ key: '/app/financeManage/supInfo', title: '供应商信息', icon: 'star-o', component: 'SupInfo'},
				
                { key: '/app/financeManage/financingBusinessInformation', title: '融资业务信息', icon: 'star-o', component: 'FinancingBusinessInformation'},
                { key: '/app/financeManage/AccountsReceivableManagement', title: '应收账款管理', icon: 'star-o', component: 'AccountsReceivableManagement'},

                { key: '/app/financeManage/legalnfo', title: '核心企业主体信息', icon: 'star-o', component: 'LegalnfoList'},

                { key: '/app/conFinRule/FunderInfoList', title: '资金方维护表', icon: 'star-o', component: 'FunderInfoList'},

                { key: '/app/financeManage/repayAccountLog', title: '融资业务回款账户', icon: 'star-o', component: 'RepayAccountLogList'},

			],
        },
    ],
    others: [] // 非菜单相关路由
}


export function selectButtonList(type, pageId, buttonId) {

    var list ={

        'buttonId' ://按钮ID
        [
            {pageId : '/app/conFinRule/orgConConfRouter', buttonId : 'editButt', buttonName : '编辑权限'},
            {pageId : '/app/conFinRule/orgConFileRouter', buttonId : 'editButt', buttonName : '编辑权限'},
            {pageId : '/app/conFinRule/signtempalteRouter', buttonId : 'editButt', buttonName : '编辑权限'},
            {pageId : '/app/conFinRule/signParmRouter', buttonId : 'editButt', buttonName : '编辑权限'},
            {pageId : '/app/conFinRule/signConConfRouter', buttonId : 'editButt', buttonName : '编辑权限'},
            {pageId : '/app/conFinRule/orgSignRouter', buttonId : 'editButt', buttonName : '编辑权限'},

            {pageId : '/app/systemManage/permissionRouter', buttonId : 'editButt', buttonName : '编辑权限'},
            {pageId : '/app/systemManage/roleRouter', buttonId : 'editButt', buttonName : '编辑权限'},
            {pageId : '/app/systemManage/userRouter', buttonId : 'editButt', buttonName : '编辑权限'},
            
            {pageId : '/app/conFinRule/contractConfRouter', buttonId : 'editButt', buttonName : '编辑权限'},

            {pageId : '/app/financeManage/supInfo', buttonId : 'addSup', buttonName : '新增权限'},
            {pageId : '/app/financeManage/supInfo', buttonId : 'editSup', buttonName : '编辑权限'},

            {pageId : '/app/conFinRule/FunderInfoList', buttonId : 'addFunder', buttonName : '新增权限'},
            {pageId : '/app/conFinRule/FunderInfoList', buttonId : 'editFunder', buttonName : '编辑权限'},
            {pageId : '/app/conFinRule/FunderInfoList', buttonId : 'deleteFunder', buttonName : '删除权限'},
            {pageId : '/app/conFinRule/FunderInfoList', buttonId : 'copyFunder', buttonName : '复制权限'},
			// 融资业务信息的编辑=>上传权限
			{ pageId: '/app/financeManage/financingBusinessInformation', buttonId: 'editButt', buttonName:'上传凭证权限'},

            {pageId : '/app/financeManage/AccountsReceivableManagement', buttonId : 'addButt', buttonName : '新增权限'},
            {pageId : '/app/financeManage/AccountsReceivableManagement', buttonId : 'editButt', buttonName : '编辑权限'},

            {pageId : '/app/conFinRule/subCon', buttonId : 'addButt', buttonName : '新增权限'},
            {pageId : '/app/conFinRule/subCon', buttonId : 'editButt', buttonName : '编辑权限'},

            {pageId : '/app/financeManage/legalnfo', buttonId : 'addButt', buttonName : '新增权限'},
            {pageId : '/app/financeManage/legalnfo', buttonId : 'editButt', buttonName : '编辑权限'},

            {pageId : '/app/financeManage/repayAccountLog', buttonId : 'addButt', buttonName : '新增权限'},
			{pageId : '/app/financeManage/repayAccountLog', buttonId : 'editButt', buttonName : '编辑权限'},
			
			
        ],


    }

    if(buttonId === null){
        return list[type];
    }

    var result_value = "未定义";

    list[type].forEach( (item) => {
        if(item['pageId'] === pageId && item['buttonId'] === buttonId){
                result_value = item['buttonName']
        }



    });

    return result_value
}
