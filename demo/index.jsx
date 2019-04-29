import React, { Component, PropTypes } from 'react'
import API from 'src/utils/api'
import { fetchJson } from 'src/utils/fetch'
import FUNC from 'src/utils/func'
import VAL from 'src/utils/validate'
import BUS from 'src/utils/businessValidate.js'
import Dict from 'src/utils/dict'
import StaticToast from 'src/components/common/Toast'
import formData from './modalData.js'
import ReactForm, { changeModelData } from 'src/components/rformer/index'
import PortriatImg from '../component/portriatImg'
import { getCitizenByCerttype } from 'src/utils/met';
import './index.scss'

class Add extends Component {
  constructor(props) {
    super(props)
    this.state = {
    	interfaceData:{
    		baseInfo:{},
    		connectWay:{},
    		supplementInfo:{}
    	},
    	formData:formData,
    	resultUpload:[],
    	id: this.props.location.query.id,
    	commonOccupation:Dict.commonOccupation
    }
  }
  
  componentDidMount () {
  	if(!this.state.id){
  		document.title = '新增客户'
  		return
  	}else{
  		document.title = '详细资料'
  	}
		fetchJson({
			type: "POST",
			url: API.CUSTOMERCENTER.POST_LOAD_CUSTOMER_CENTER,
			data: {
				id : this.state.id*1
			},
			success:(res) => {
				this.state['originData'] = res
				let data = this.transferData(res , formData)
				
				this.setState({ interfaceData:data , formData:this.setReadOnlyInfo(formData , res.customer)},()=>{
					//加载完数据后重置国籍下拉数据，certType、certNo、birthday、genderCode
					
					if(res.customer&&res.customer['birthday']){
						this.handlerEvent({keyName:'baseInfo.birthday' , value:res.customer['birthday']} , res.customer['occupation'] ,true)
					}
					if(res.customer&&res.customer['genderCode']){
						this.handlerEvent({keyName:'baseInfo.genderCode' , value:res.customer['genderCode']} , res.customer['occupation'] ,true)
					}
					if(res.customer&&res.customer['certType']){
						this.handlerEvent({keyName:'baseInfo.certType' , value:res.customer['certType']},res.customer['occupation'] ,true)
					}
					if(res.customer&&res.customer['certNo']){
						this.handlerEvent({keyName:'baseInfo.certNo' , value:res.customer['certNo']},res.customer['occupation'] ,true)
					}
					if(res.customer&&res.customer['certValidity']){
						this.handlerEvent({keyName:'baseInfo.certValidity' , value:res.customer['certValidity']},res.customer['occupation'] ,true)
					}
				})
			}
		});
  }
	
	/**
	 * 根据obj对象触发修改接口数据和联动字段修改
	 * 也可以手动调用改方法主动触发联动字段修改（如接口获取数据后需要动态联动）
	 * obj--{keyName:'键名称'，value：‘值’，eventType：‘事件类型’，formData：‘存在表示修改modal对象的除value外的其它键的值’}
	 * isInit--true初始接口数据写入，职业码值去接口数据
	 * isLoad -- 是否是加载接口数据，加载接口数据不进行国籍职业剩余一个自动选中
	 */
	handlerEvent = (obj , isInit , isLoad)=>{
		if(obj.eventType == 'uploadImage'){
			this.upLoading(obj.value , (res)=>{
				let idata = this.state.interfaceData
				idata['baseInfo']['imgUrl'] = res
				this.setState({interfaceData:idata})
			})
			return null
		}
		if(obj.eventType == 'deleteImg'){
			let idata = this.state.interfaceData
			idata['baseInfo']['imgUrl'] = ''
			idata['baseInfo']['customerId'] = ''
			this.setState({interfaceData:idata})
			return null
		}
		//处理有效期和长期
		let modObj = [obj]
		if(obj['keyName'] == 'baseInfo.certValidity' && obj['modalKey']=='longTimeValue'){
			if(obj['value']){
				modObj.push({keyName:obj['keyName'],value:'9999-12-31'})
			}else{
				modObj.push({keyName:obj['keyName'],value:''})
			}
		}
		//如果证件类型需要字母变大写
		let certType = this.state.interfaceData.baseInfo&&this.state.interfaceData.baseInfo.certType || ''
		if(certType && (certType=='1'||certType=='7'||certType=='H'||certType=='G'||certType=='I')){
			if(obj['keyName'] == 'baseInfo.certNo'){
				obj['value'] = obj['value'].toUpperCase()
			}
		}
		modObj = modObj.concat(this.businessCascade(obj , isInit ,isLoad))
		let interfaceData = changeModelData(this.state.interfaceData,this.state.formData , modObj)
		this.setState({'interfaceData':interfaceData.interfaceData,formData:interfaceData.modalData})
	}
	
	/**
	 * 处理业务相关联动修改,在用户修改表单中，
	 * certType、certNo、birthday、genderCode
	 */
	businessCascade =(obj , isInit , isLoad ) => {
		let modRes = []
		let certType = this.state.interfaceData.baseInfo&&this.state.interfaceData.baseInfo.certType || ''
		let certNo = this.state.interfaceData.baseInfo&&this.state.interfaceData.baseInfo.certNo || ''
		let birthday = this.state.interfaceData.baseInfo&&this.state.interfaceData.baseInfo.birthday || ''
		//修改证件类型，联动修改国籍
		if(obj.keyName == 'baseInfo.certType'){
			// 切换玩证件类型后清空有效期
			modRes.push({keyName:'baseInfo.certValidity',value:''})
			//户口本的有效期是  客户出生日期+17年-1天     出生证的有效期是  客户出生日期+3年-1天
			this.handlerCertValidateByBirthType(birthday , obj.value , modRes)
			//联动国籍
			let choiceCitizen = getCitizenByCerttype(obj.value , certNo)
			if(!isLoad){
				if(choiceCitizen.length == 1){
					modRes.push({keyName:'baseInfo.citizenship',value:choiceCitizen[0]['key'] })
				}else{
					modRes.push({keyName:'baseInfo.citizenship',value:'' })
				}
			}
			modRes.push({keyName:'baseInfo.citizenship',value:choiceCitizen , modalKey:'enumOption'})
			//证件类型隐藏长期,--外国公民护照、港澳居民来往大陆通行证、台港居民来往大陆通行证、港澳居民居住证、台湾居民居住证、外国人永久居留身份证
			//客户投保年龄大于等于46周岁时，可选择长期
			this.handlerCertValidateByBirthType(birthday , obj.value , modRes)
		}
		//证件号码联动填充
		if(obj.keyName == 'baseInfo.certNo'){
			if(obj.eventType == 'blur'){
				// 输入完证件号码后清空有效期
				modRes.push({keyName:'baseInfo.certValidity',value:''})
				if(obj.value){
					if( VAL.isIdCard(obj.value,'num')){
						let res = VAL.isIdCard(obj.value,'num')
						modRes.push({keyName:'baseInfo.birthday',value:res.birthday})
						this.handlerOccupationByAge(res.birthday , modRes)
						modRes.push({keyName:'baseInfo.genderCode',value:res.sex=='M'?'1':'2'})
						//户口本的有效期是  客户出生日期+17年-1天     出生证的有效期是  客户出生日期+3年-1天
					  this.handlerCertValidateByBirthType(res.birthday , certType , modRes)
					}else if(VAL.isHongKongMNew(obj.value) || VAL.isTWN(obj.value)){
						//如果证件号码为 810000、820000、830000+8位出生日期+4位数字或字母，重置出生日期
						var year =  obj.value.slice(6,10),
	          month = obj.value.slice(10,12),
	          day = obj.value.slice(12,14)
	          modRes.push({keyName:'baseInfo.birthday',value:`${year}-${month}-${day}`})
					}
					//联动国籍
					let choiceCitizen = getCitizenByCerttype(certType , obj.value)
					if(!isLoad){
						if(choiceCitizen.length == 1){
							modRes.push({keyName:'baseInfo.citizenship',value:choiceCitizen[0]['key'] })
						}else{
							modRes.push({keyName:'baseInfo.citizenship',value:'' })
						}
					}
			    modRes.push({keyName:'baseInfo.citizenship',value:getCitizenByCerttype(certType , obj.value) , modalKey:'enumOption'})
				}else{
					//户口本的有效期是  客户出生日期+17年-1天     出生证的有效期是  客户出生日期+3年-1天
					this.handlerCertValidateByBirthType(birthday , certType , modRes)
				}
			}else if(obj.eventType == 'change'){
				let val = obj.value.toUpperCase()
				if(certType == 'B'){
					if(!(val.charAt(0) == 'H' || val.charAt(0) == 'M')){
						modRes.push({keyName:'baseInfo.certNo',value:''})
					}else{
						val = val.substr(0,9)
						modRes.push({keyName:'baseInfo.certNo',value:val})
					}
				}
			}
		}
		if(obj.keyName == 'baseInfo.birthday' && obj.value){
			this.handlerCertValidateByBirthType(obj.value , certType , modRes)
			this.handlerOccupationByAge(obj.value , modRes , isInit)
		}
		if(obj.keyName == 'baseInfo.genderCode' && obj.value){
			this.handlerOccupationBygenderCode(obj.value , modRes , isInit)
		}
		return modRes
	}
	
	// 根据生日和证件类型触发证件有效期的值和长期是否显示
	handlerCertValidateByBirthType = (birthday , certType , modRes)=>{
		  if(certType=='0'){
				let age = FUNC.jsGetAge(birthday)
				if(age >= 46){
					modRes.push({keyName:'baseInfo.certValidity',value:true , modalKey:'isShowLongTime'})
				}else{
					modRes.push({keyName:'baseInfo.certValidity',value:false , modalKey:'isShowLongTime'})
				}
			}else if(certType=='1'||certType=='B'||certType=='E'||certType=='G'||certType=='H'||certType=='I'){
				modRes.push({keyName:'baseInfo.certValidity',value:false , modalKey:'isShowLongTime'})
			}else if(certType=='4'){
				//证件类型选择户口本/出生证 证件有效期为客户出生日期+17-1年  生日期+3-1年
				if(birthday){
					modRes.push({keyName:'baseInfo.certValidity',value:FUNC.operationDate(birthday,17,'',1) })
					modRes.push({keyName:'baseInfo.certValidity',value:false , modalKey:'isShowLongTime'})
				}
			}else if(certType=='7'){
				//证件类型选择户口本/出生证 证件有效期为客户出生日期+16年  生日期+2年
				if(birthday){
					modRes.push({keyName:'baseInfo.certValidity',value:FUNC.operationDate(birthday,3,'',1) })
					modRes.push({keyName:'baseInfo.certValidity',value:false , modalKey:'isShowLongTime'})
				}
			}else{
				modRes.push({keyName:'baseInfo.certValidity',value:true , modalKey:'isShowLongTime'})
			}
	}
	
	//处理生日与职业联动关系，年龄大于6周岁时不显示“2099908-学龄前儿童/婴幼儿； 0-6周岁儿童职业仅限于“2099908-学龄前儿童/婴幼儿；年龄为7-16周岁的未成年人时仅可选择为“2099907-一般学生”、“3020109-警校学生”、“8000101-特殊运动班学生（拳击、摔跤、跆拳道等）”、“8000102-武术学校学生
	handlerOccupationByAge = (birth , modRes , isInit) => {
		  let sex = this.state.interfaceData.baseInfo&&this.state.interfaceData.baseInfo.genderCode || ''
			let age = FUNC.jsGetAge(birth)
			let commonCarrer = []
			let enumOption = []
			if(age>=0 && age <= 6){
				commonCarrer = [{ name: '请选择', code: '' },{ name: '学龄前儿童', code: '2099908' }]
			}else if(age >=7 && age <= 16){
				commonCarrer = [{ name: '请选择', code: '' },{ name: '一般学生', code: '2099907' },{ name: '警校学生', code: '3020109' },{ name: '特殊运动班学生（拳击、摔跤、跆拳道等）', code: '8000101' },{ name: '武术学校学生', code: '8000102' }]
			}else{
				commonCarrer = FUNC.deepCopy(Dict.commonOccupation)
				enumOption = this.deleteOccuBySex(Dict.occupationList , sex)
				
				commonCarrer.map((item,key) => {
					if(item.code == '2099908'){
						commonCarrer.splice(key,1)
					}
				})
			}
			// 如果职业code存在
			let occInterface = this.state.interfaceData.baseInfo&&this.state.interfaceData.baseInfo.certType || ''
			let occuCode = isInit || occInterface
			if(!(BUS.isCommonCarrer(occuCode,commonCarrer) || BUS.queryOccuCodeIsInList(occuCode,enumOption))){
				occuCode = commonCarrer[0]['code']
			}
			this.state.commonOccupation= commonCarrer
			modRes.push({keyName:'supplementInfo.occupation',value:occuCode })
			modRes.push({keyName:'supplementInfo.occupation',value:commonCarrer , modalKey:'commonCarrer'})
			modRes.push({keyName:'supplementInfo.occupation',value:enumOption , modalKey:'enumOption'})
	}
	/**
	 * 根据性别过滤职业列表,如果性别为男那么过滤掉4071203-家庭主妇
	 * 如果切换性别，过滤职业枚举值后，职业code均不在这2个列表中那么将职业code置位默认第一个常见职业
	 */
	handlerOccupationBygenderCode = (sex , modRes , isInit) => {
		let enumOption = this.deleteOccuBySex(Dict.occupationList , sex)
		if(enumOption.length > 0){
			// 如果职业code存在
			let commonCarrer = FUNC.deepCopy(this.state.commonOccupation)
			let occInterface = this.state.interfaceData.baseInfo&&this.state.interfaceData.baseInfo.certType || ''
			let occuCode = isInit || occInterface
			if(!(BUS.isCommonCarrer(occuCode,commonCarrer) || BUS.queryOccuCodeIsInList(occuCode,enumOption))){
				occuCode = commonCarrer[0]['code']
			}
			modRes.push({keyName:'supplementInfo.occupation',value:occuCode })
			modRes.push({keyName:'supplementInfo.occupation',value:enumOption , modalKey:'enumOption'})
		}
	}
	
	/**
	 * 根据性别删除职业列表里的家庭妇女
	 */
	deleteOccuBySex = (occList , sex)=>{
		let enumOption = FUNC.deepCopy(occList)
		enumOption.map((item,key) => {
			if(item.key == '4'){
				item.item.map((sItem)=>{
					if(sItem.key == '407'){
						sItem.item.map((ssItem)=>{
							if(ssItem.key == '40712'){
								let isZhufu = false
								ssItem.item.map((sssItem,sKey)=>{
									if(sssItem.key == '4071203'){
										if(sex == '1'){
											ssItem.item.splice(sKey,1)
									  }
										isZhufu = true
									}
								})
								if(sex == '2' && !isZhufu){
										sItem.item.push({ value: '家庭主妇', key: '4071203' })
								}
							}
						})
					}
				})
			}
		})
		return enumOption
	}
	
	/**
   *  ocr证件上传时间
   * @param {*} e event对象
   * @param {*} userType 标记投被保人
   */
  handleChange (e, userType) {
    let { files } = e.target;
    let { resultUpload } = this.state;
    const _this = this;

    if (files.length === 0) {
      return;
    }
    if (resultUpload.length >= 2) {
      StaticToast.confirm('最多上传两张图片')
      return;
    }

    if (!/image\/\w+/.test(files[0].type)) {
      StaticToast.confirm('只能选择图片哦');
      return false;
    }

    FUNC.Loading(true)
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = function () {
      let resultUpload = _this.state.resultUpload;
      resultUpload.push(this.result);
      if (resultUpload.length == 2) {
        _this.upLoading(_this.state.resultUpload, (res)=>{
        	let interfaceData = _this.state.interfaceData
        	let baseInfo = interfaceData['baseInfo']
        	baseInfo['name'] = res['name']
        	baseInfo['birthday'] = res['birthday']
        	baseInfo['genderCode'] = res['genderCode']=='M'?'1':'2'
        	baseInfo['certNo'] = res['certNum']
        	baseInfo['certType'] = res['certTypeCode']
        	baseInfo['certValidity'] = res['certExpire']
        	//设置联动根据ocr结果
        	_this.handlerEvent({keyName:'baseInfo.birthday' , value:res['birthday']})
        	_this.handlerEvent({keyName:'baseInfo.genderCode' , value:baseInfo['genderCode']})
        	_this.handlerEvent({keyName:'baseInfo.certNo' , value:res['certNum']})
        	_this.handlerEvent({keyName:'baseInfo.certType' , value:res['certTypeCode']})
        	_this.handlerEvent({keyName:'baseInfo.certValidity' , value:res['certExpire']})
        	_this.setState({'interfaceData':interfaceData})
        } , true);
        resultUpload = [];
      } else if (resultUpload.length == 1) {
        FUNC.Loading(false)
        StaticToast.confirm('请继续上传身份证反面');
      }
    };
    reader.onerror = function () {
      FUNC.Loading(false)
      StaticToast.confirm('上传出错，请重新上传');
      return false;
    };
    e.target.value = '';
  }
	
	/**
	 * 上传图片统一方法
	 * flag为true表示ocr识别
	 */
	upLoading(result,callback,flag){
		let url = ''
		let req = ''
		if(flag){
			url = API.CUSTOMERCENTER.POST_ID_CARD_OCR
			req = {
				frontImg :  result[1],//正
				backImg: result[0]
			}
		}else{
			url = API.CUSTOMERCENTER.POST_UPLOAD_POTRIATE
			req = {
				base64Image :  result//正
			}
		}
		fetchJson({
			type: "POST",
			url: url,
			data: req,
			success:(res) => {
				callback && callback(res);
			},error:(res) => {
				StaticToast.confirm(res.resultMsg);
			}
		});
	}
	
	/**
	 * 转换数据，如果modaldata存在那么将接口数据转为modaldata结构数据，返回接口数据结构，过滤掉不在modaldata里的字段
	 * 如果modaldata不存在那么将用户操作后的modal数据转为接口数据
	 */
	transferData = (interfaceData , modalData) => {
		let iData = Object.assign({},interfaceData)
		let result = {}
		if(modalData){
			Object.keys(modalData).map((item , key) => {
				result[item] = {}
				modalData[item].map((sItem , sKey) => {
					let name = sItem.name.split('.').pop()
					if(name == 'imgUrl'){
						if(iData['image']&&iData['image'][name]){
							result[item][name] = iData['image'][name]
						}
						if(iData['image']&&iData['image']['id']){
							result[item]['customerId'] = iData['customer']['id']
						}
					}else{
						if(iData['customer']&&iData['customer'].hasOwnProperty(name)){
							//地址字段转换，将一个字段addr改成2个字段detail、cityCode
							if(name == 'addr'){
								let code = iData['customer'][name]['cityCode']
								if(code){
									code = code.substr(0,2)+'-'+code.substr(2,2)+'-'+code
								}
								result[item]['detail'] = iData['customer'][name]['detail']
								result[item][name] = code
							}else if(name == 'genderCode'){
								if(iData['customer']['genderCode']){
									iData['customer']['genderCode'] = iData['customer']['genderCode'] == 'M'?'1':'2'
								}
								result[item][name] = iData['customer'][name]
							}else{
								result[item][name] = iData['customer'][name]
							}
						}
					}
				})
			})
			
			return result
		}else{
			let customer = Object.assign({} , interfaceData.baseInfo , interfaceData.connectWay , interfaceData.supplementInfo )
			if(this.state.id){
				customer['id'] = this.state.id*1
			}
			if(customer['genderCode']){
				customer['genderCode'] = customer['genderCode'] == '1'?'M':'F'
			}
			let code = ''
			if(customer['addr']){
				code = customer['addr'].split('-')[2]
			}
			customer['addr'] = { cityCode:code , detail:customer['detail']}
			let res = { image :  { imgUrl : customer.imgUrl} , customer : customer}
			delete customer.imgUrl
			delete customer.detail
			return res
		}
	}
	
	/**
	 * 设置modal数据，如果为老客户那么将5证改为只读
	 * 老客户和待承保客户：客户信息，除开五项基本信息以外，均可以修改
	 * 准客户：客户信息全部允许修改。
	 * //准客户(0)、老客户(1)、待承保客户(2)
	 */
	setReadOnlyInfo = (modal , interfaceData) => {
		if(this.state.id){
			if(interfaceData ){
				if(interfaceData.status == '1' || interfaceData.status == '2'){
					modal['baseInfo'].map((item, key)=>{
						//姓名、性别、出生日期、证件类型、证件号码
						if(item.name == 'baseInfo.name' || item.name == 'baseInfo.genderCode' || item.name == 'baseInfo.birthday'|| item.name == 'baseInfo.certType'|| item.name == 'baseInfo.certNo'){
							item['readOnly'] = true
						}
					})
				}
			}
		}
		return modal
	}
	
	submit = () =>{
		let interfaceData = Object.assign({},this.state.interfaceData) //获取提交数据
		let msg = []
		this.childForm.map((item,key)=>{
			msg = msg.concat( item.validateSubmitForm() )
			return msg
		})
		if(msg && msg.length>0){
			StaticToast.confirm(msg[0])
			return null
		}
		msg = BUS.validateCustomer(this.transferData(interfaceData).customer,'')
		if(msg){
			StaticToast.confirm(msg)
			return null
		}
		let url = API.CUSTOMERCENTER.POST_ADD_CUSTOMER
		if(this.state.id){
			url = API.CUSTOMERCENTER.POST_UPDATE_CUSTOMER
		}
		let subData = this.transferData(interfaceData)
		fetchJson({
			type: "POST",
			url: url,
			data: subData,
			success:(res) => {
				StaticToast.confirm('保存成功！',()=>{
					FUNC.hrefToHard('/service/list')
				});
			},error:(res) => {
				if(res&&res.resultCode == '66'){//弹出确定是否弹框
        	StaticToast.confirmCancelDialog(res.resultMsg,'','',()=>{
        		subData['saveFlag'] = 'save'
        		fetchJson({
							type: "POST",
							url: url,
							data: subData,
							success:(res) => {
								StaticToast.confirm('保存成功！',()=>{
									FUNC.hrefToHard('/service/list')
								});
							}
						});
					},'是','否')
        }else{
        	StaticToast.confirm(res.resultMsg);
        }
			}
		});
		console.log('result submit',interfaceData,msg)
	}

  render() {
  	
  	let modelData = this.state.formData
  	let interfaceData = this.state.interfaceData //只能一层
  	let originData = this.state['originData'] && this.state['originData']['customer'] || ''
    return (
      <div className="App">
        <ReactForm modelData = { formData.baseInfo } interfaceData = { interfaceData.baseInfo } parent = {this}  action = { this.handlerEvent }>
        	<header className="title">
        		<div className="label">基本信息</div>
        		<div className="scan">
        			{
        				(originData.status == '1' || originData.status == '2')?(null):(
        					<input className="up-btn"
		              type="file"
		              apture="camera"
		              accept="image/*"
		              name=""
		              id=""
		              onChange={ (e) => { this.handleChange(e, '0') } } />
	        			)
        			}
	          </div>
        	</header>
        	<slot tagName="PortriatImg" as={PortriatImg} customerId={ interfaceData.baseInfo&&interfaceData.baseInfo.customerId } sex={interfaceData.baseInfo&&interfaceData.baseInfo.genderCode}></slot>
        </ReactForm>
        <ReactForm modelData = { formData.connectWay } interfaceData = { interfaceData.connectWay } parent = {this}  action = { this.handlerEvent }>
        	<header className="title">联系方式</header>
        </ReactForm>
        <ReactForm modelData = { formData.supplementInfo } interfaceData = { interfaceData.supplementInfo } parent = {this}  action = { this.handlerEvent }>
        	<header className="title">补充信息</header>
        </ReactForm>
        <div className="submit-btn" onClick= { this.submit }>
        	保存
        </div>
      </div>
    )
  
  }
}

export default Add
