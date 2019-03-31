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
   * props的value作为初始的码值
   */
  getOccValue = () => {
  	let jd = this.props.injectData
  	let val = this.state.value || this.props.injectData.value
  	if(!val){
  		val = jd.commonCarrer[0]['code']
  	}
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
  	if(val == '-1'){
  		let temp = dict[0]
  		while(temp['item']){
  			temp = temp['item'][0]
  		}
  		result = this.screenCarrer(temp['key'] , 0)
  		this.setState({value:temp['key'] ,genaralCarrer: result})
  	}else{
  		this.setState({value:val})
  	}
  	
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
  	this.setState({value:result.value , genaralCarrer:result.genaralCarrer})
  }
  /**
   * 根据index筛选出新的value和genaralCarrer
   * 返回{value：’‘，genaralCarrer:[]}
   */
  screenCarrer = (val , index) => {
  	let dict = this.getGenaralDict()
  	let valArr = this.splitOccupationValue(this.getOccValue())
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
  			<select className="occupation-select" value={commonVal} onChange={ this.changeCommerCarrer}>
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
  	</div>)
  }
}

export default Occupations
