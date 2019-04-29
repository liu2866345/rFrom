import React, { Component } from 'react'
/**
 * 根据传入的value和dict转换出select。option
 * commonCarrer:[{key:'',value}]常见职业
 * genaralCarrer:[[],[],[],[]] 不常见职业
 */

class Occupations extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  
  /**
   * 获取当前的职业码值
   * 优先从state中获取，如果state没值那么表示是初始化由父级传入
   * props的value作为初始的码值，props也可能是其它组件联动后的值那么必须传入确定的码值，不能为空
   */
  getOccValue = () => {
  	let val = this.props.injectData.value
  	return val
  }
  /**
   * 获取非常见职业字典
   */
  getGenaralDict = () => {
  	let dict = this.props.injectData&&this.props.injectData['enumOption'] || ''
  	if(!dict){
  		console.error('enumOption配置值为空！')
  	}
  	return dict
  }
  
  /**
   * 根据dict转换出不常见职业数组，
   * 返回一个二维4项数组[1,101,10100,1010001]
   */
  transferDict = (dict , value) => {
  	if(!value || !dict)return null;
  	let valArr = this.splitOccupationValue(value)
  	let resultArr = []
  	let currentArr = dict
  	valArr.map((item , key) => {
  		let tempArr = []
  		currentArr.map((sItem , sKey) => {
  			tempArr.push({key:sItem.key,value:sItem.value})
  			if(sItem.key == item){
  				currentArr = sItem.item
  			}
  		})
  		resultArr.push(tempArr)
  	})
  	return resultArr
  }
  
  /**
   * 将value从后向前逐次按2位取数拆分成n/2个职业子值
   * 返回【1，2，3，4】
   */
  splitOccupationValue = (value) => {
  	if(!value)return value
  	let arr = []
  	for (var i=value.length ; i >= 1 ;) {
  		arr.unshift(value.substr(0,i))
  		var start = i-2
  		if(start <= 0){
  			start = 0
  		}
  		i = i - 2
  	}
  	return arr
  }
  
  /**
   * 判断val是否是常见职业，
   * 如果是返回true否则返回false
   */
  isCommonCarrer = (val , commonArr) => {
  	let result = false
  	if(!val){
  		//如果职业值为空那么表示是常见职业的请选择
  		return true
  	}
  	commonArr.map((item,key) => {
  		if(item.code == val){
  			result = true
  		}
  	})
  	return result
  }
  /**
   * 当前常见职业change触发
   */
  changeCommerCarrer = (e) => {
  	let val = e.currentTarget.value
  	let dict = this.getGenaralDict()
  	let result = null
  	let temp = dict[0]
  	let value = ''
  	if(val == '-1'){
  		while(temp['item']){
  			temp = temp['item'][0]
  		}
  		result = this.screenCarrer(dict[0]['key'] , 0 , temp['key'])
  		value = temp['key']
  		this.state.genaralCarrer = result
  	}else{
  		value = val
  	}
  	this.triggerAction(value)
  }
  /**
   * 根据val触发action，向外发射内部改变的值
   */
  triggerAction = (val) => {
  	this.props.action&&this.props.action({
  		keyName:this.props.injectData.name,
  		value:val,
  		eventType:'change'
  	})
  }
  /**
   * 当前非常见职业change触发
   * e--当前操作对象,index -- 当前是第几个职业
   * 操作结果，改变value和genaralCarrer的值
   */
  changeGenaralCarrer = (e,index) => {
  	console.log('trigger genaral change event ',index)
  	let val = e.currentTarget.value
  	
  	let result = this.screenCarrer(val , index)
  	this.state.genaralCarrer = result.genaralCarrer
  	this.triggerAction(result.value)
  }
  /**
   * 根据index和index层级对应的code筛选出新的value和genaralCarrer
   * 如果insertCode存在那么表示是常见职业切换到其它insertCode为一般职业的默认第一个值，否则取用户切换的值
   * 返回{value：’‘，genaralCarrer:[]}
   */
  screenCarrer = (val , index , insertCode) => {
  	let dict = this.getGenaralDict()
  	let valArr = this.splitOccupationValue(insertCode||this.getOccValue())
  	let genaralCarrer = []
  	let loopDict = JSON.parse(JSON.stringify(dict))
  	valArr.map((item, key) => {
  		let tempArr =  JSON.parse(JSON.stringify(loopDict))
  		let eachArr = []
  		let flagVal = ''
  		if(key < index){
  			flagVal = item
  		}else if(index == key){ //chang当前列和后序列
  			valArr[key] = val
  			flagVal = val
  		}else if(key > index){
  			valArr[key] = tempArr[0]['key']
  			flagVal = tempArr[0]['key']
  		}
  		tempArr&&tempArr.map((dItem , dKey) => {
	  		eachArr.push({key:dItem.key , value:dItem.value})
	  		if(dItem.key == flagVal){
	  			loopDict = dItem['item']
	  		}
  		})
  		genaralCarrer.push(eachArr)
  	})
  	return {value:valArr.pop(),genaralCarrer:genaralCarrer}
  }

  render() {
  	let injectData = this.props.injectData || ''
  	let occVal = this.getOccValue()
  	if(!injectData)return null
  	// 常见职业枚举数组
  	let commonArr = injectData.commonCarrer
  	// 普通职业枚举数组
  	let genaralCarrer = []
  	// 常见职业选择值
  	let commonVal = occVal
  	// 普通职业选择值
  	let genaralVal = null
  	//val为非常见职业
  	if(!this.isCommonCarrer(occVal , commonArr)){
  		commonVal = '-1'
  		genaralVal = this.splitOccupationValue(occVal)
  		genaralCarrer = this.transferDict(injectData.enumOption , occVal)
  	}
  	return (<div className="occupation-model">
  		<div className="common-row">
  			<label  className="occupation-label">常见职业</label>
  			<select className={"occupation-select"+(commonVal?'':' init')} value={commonVal} onChange={ this.changeCommerCarrer}>
  				{/* <option  value=''>请选择</option> */}
  				{
  					commonArr.map((item,key)=>{
  						return (<option key={key} value={item.code}>{item.name}</option>)
  					})
  				}
  			</select>
  		</div>
	  		{
	  			genaralVal?
	  			(<div className="detail-occupation-modal">
		  			<div className="detail-row">
		  				<label  className="occupation-label">职业大类</label>
			  			<select className="occupation-select" value={genaralVal[0]} onChange={ (e)=>this.changeGenaralCarrer(e,0)}>
			  				{
			  					genaralCarrer[0].map((item,key)=>{
			  						return (<option key={key} value={item.key}>{item.value}</option>)
			  					})
			  				}
			  			</select>
		  			</div>
		  			<div className="detail-row">
		  				<label  className="occupation-label">职业中类</label>
			  			<select className="occupation-select" value={genaralVal[1]} onChange={ (e)=>this.changeGenaralCarrer(e,1)}>
			  				{
			  					genaralCarrer[1].map((item,key)=>{
			  						return (<option key={key} value={item.key}>{item.value}</option>)
			  					})
			  				}
			  			</select>
		  			</div>
		  			<div className="detail-row">
		  				<label  className="occupation-label">职业小类</label>
			  			<select className="occupation-select" value={genaralVal[2]} onChange={ (e)=>this.changeGenaralCarrer(e,2)}>
			  				{
			  					genaralCarrer[2].map((item,key)=>{
			  						return (<option key={key} value={item.key}>{item.value}</option>)
			  					})
			  				}
			  			</select>
		  			</div>
		  			<div className="detail-row">
		  				<label  className="occupation-label">详细职业</label>
			  			<select className="occupation-select" value={genaralVal[3]} onChange={ (e)=>this.changeGenaralCarrer(e,3)}>
			  				{
			  					genaralCarrer[3].map((item,key)=>{
			  						return (<option key={key} value={item.key}>{item.value}</option>)
			  					})
			  				}
			  			</select>
		  			</div>
		  		</div>):(null)
	  			}
	  	{injectData.tips?(<div className="occ-tip">{injectData.tips}</div>):(null)}
  	</div>)
  }
}

export default Occupations
