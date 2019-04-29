import FUNC from 'src/utils/func'
import Dict from 'src/utils/dict'
import VD from 'src/utils/validate';

let data = {
	'baseInfo':[
	{
		label : '照片',
  		name : 'baseInfo.imgUrl',
  		type : 'PortriatImg',
  		value : '',
	},
	{
  		label : '姓名',
  		name : 'baseInfo.name',
  		type : 'input',
  		value : '',
  		required:'required',
  		placeholder:'请输入姓名',
  		validate : 'required|name',
  		validateFunc:{name:VD.isName},
		errorMsg : ['请输入姓名','请输入正确的姓名']
  	},
	{
		label : '出生日期',
		name : 'baseInfo.birthday',
		type : 'calendar',
		value : '',
		dataExtent:FUNC.handleDate(131, -1) + ',' + FUNC.handleDate(0),
	},{
  		label : '性别',
  		name : 'baseInfo.genderCode',
  		type : 'sex',
  		value : '',
  		enumOption : [{key:'1',value:'男'},{key:'2',value:'女'}]
  	},
    	{
  		label : '证件类型',
  		name : 'baseInfo.certType',
  		placeholder:'请选择证件类型',
  		type : 'select',
  		readOnly:false,
  		value : '',
  		enumOption : Dict.certTypeRegister
  	},
  	{
  		label : '证件号码',
  		name : 'baseInfo.certNo',
  		type : 'input',
  		maxLength:18,
  		value : '',
  		placeholder:'请输入证件号码'
  	},
  	{
  		label : '有效期',
  		name : 'baseInfo.certValidity',
  		type : 'longtime',
  		value : '',
  		placeholder:'请选择有效期',
  		dataExtent:FUNC.handleDate(131, -1) + ',2099-12-31',
  		isShowLongTime:true,
  		longTimeValue:false
  	},
  	{
  		label : '国籍',
  		name : 'baseInfo.citizenship',
  		type : 'select',
  		value : '',
  		placeholder:'请选择国籍',
  		enumOption : Dict.citizenList
  	}
    ]
	,
	'connectWay':[{
  		label : '手机号码',
  		name : 'connectWay.mobile',
  		type : 'input',
  		maxLength:11,
  		value : '',
  		required:'required',
  		placeholder:'请输入手机号码',
  		validate : 'required|cellphone',
		errorMsg : ['请输入手机号码','请输入正确的手机号码']
  	},
	{
		label : '工作电话',
		name : 'connectWay.businessPhone',
		type : 'input',
		value : '',
		maxLength:18,
		placeholder:'请输入工作电话',
  		validate : 'validateFunc',
  		validateFunc:{validateFunc:VD.isMobileOrPhone},
		errorMsg : ['请输入正确的工作电话']
	},{
		label : '家庭电话',
		name : 'connectWay.telphone',
		type : 'input',
		value : '',
		maxLength:18,
		placeholder:'请输入家庭电话',
		validate : 'validateFunc',
  		validateFunc:{validateFunc:VD.isMobileOrPhone},
  		errorMsg : ['请输入正确的家庭电话']
	},{
		label : '电子邮箱',
		name : 'connectWay.email',
		type : 'input',
		value : '',
		placeholder:'请输入电子邮箱',
  		validate : 'email',
		errorMsg : ['请输入正确的电子邮箱']
	},{
  		label : '地址',
  		name : 'connectWay.addr',
  		type : 'scroll',
  		value : '',
  		column:3,
  		cascade:true,
  		enumOption:Dict.provinceCityList,
  		placeholder:'省／市／区'
  	},{
		label : '详细地址',
		name : 'connectWay.detail',
		type : 'input',
		value : '',
		placeholder:'请输入街道门牌信息',
		validate : 'address',
  		validateFunc:{address:VD.isAddress},
		errorMsg : ['详细地址字数不可少于9个字']
	},{
		label : '邮编',
		name : 'connectWay.zipcode',
		type : 'input',
		maxLength:6,
		value : '',
		placeholder:'请输入邮编',
  		validate : 'isZipcode',
  		validateFunc:{isZipcode:VD.isZipcode},
		errorMsg : ['邮编填写有误']
	}
    ]
	,
	'supplementInfo':[{
  		label : '工作单位',
  		name : 'supplementInfo.companyName',
  		type : 'input',
  		value : '',
  		placeholder:'请输入工作单位',
  		validate : 'address',
  		validateFunc:{address:VD.isWork},
		errorMsg : ['工作单位不可少于2个字']
  		
  	},
	{
		label : '职业',
		name : 'supplementInfo.occupation',
		type : 'occupation',
		value : '',
		placeholder:'请选择职业',
		tips:'职业列表会根据您录入的性别和年龄动态加载',
		enumOption : Dict.occupationList,
		commonCarrer:Dict.commonOccupation
	},{
		label : '婚姻状况',
		name : 'supplementInfo.marrige',
		type : 'select',
		value : '',
		placeholder:'请选择婚姻状况',
  		enumOption : Dict.marriageList
	},{
		label : '年收入',
		name : 'supplementInfo.salary',
		type : 'input',
		value : '',
		placeholder:'请输入年收入',
  		unit : '万元',
  		validate:'money',
  		errorMsg:['年收入格式错误']
	},{
  		label : '学历',
  		name : 'supplementInfo.degree',
  		type : 'select',
  		value : '',
  		enumOption:Dict.education,
  		placeholder:'请选择学历'
  	},{
		label : '客户来源',
		name : 'supplementInfo.customerSource',
		type : 'select',
		value : '',
		placeholder:'请选择客户来源',
		enumOption : Dict.customerSource
	},{
		label : '家人是否买过保险',
		name : 'supplementInfo.isBuyInsured',
		type : 'radio',
		value : '',
		enumOption : [{key:'0',value:'没有'},{key:'1',value:'买过其他保司保险'},{key:'2',value:'买过我司保险'},{key:'3',value:'我司和其他保司保险都买过'}]
	},{
		label : '住宅情况',
		name : 'supplementInfo.housingSituation',
		type : 'checkbox',
		checkClass: 'signal',
		value : '',
		enumOption:Dict.houseInfo
	},{
		label : '交通工具',
		name : 'supplementInfo.vehicle',
		type : 'checkbox',
		checkClass: 'signal',
		value : '',
		enumOption:Dict.communicationTool
	},{
		label : '兴趣爱好',
		name : 'supplementInfo.hobbies',
		type : 'checkbox',
		checkClass: 'signal',
		value : '',
		enumOption:Dict.personalInterest
	},{
		label : '备注',
		name : 'supplementInfo.remark',
		type : 'textarea',
		value : '',
		maxLength:50,
		height:'100px'
	}
	
    ]
}

export default data
