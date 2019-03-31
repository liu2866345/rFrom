import React, { Component } from 'react'
import './index.css'
import ScrollComponent from './scroll.jsx'
/**
 * 单个滚动组件
 * @author simon
 * @datte 2019-01-01
 * 控制ScrollComponent组件显示与隐藏
 */
class Scroll extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {showSlide:false}
  }
  
  changeHandler = ( result ) => {
  	let injectData = this.props.injectData || {}
  	if(injectData.readOnly){
  		return null
  	}
  	if (this.props.action) {
  		let resultObj = {}
  		let name = injectData['name']
  		let val = result.join('-')
  		resultObj['eventType'] = 'click'
  		resultObj['keyName'] = name
  		resultObj['value'] = val
  		this.props.action ( resultObj )
  	}
  	this.close()
  }
  openSlide = (e) => {
  	let injectData = this.props.injectData || {}
  	if(injectData.readOnly){
  		return null
  	}
  	//打开slide组件前调用组件的初始化top方法
//	console.log('init componet ui...')
  	this.state.setChildDefaultValue && this.state.setChildDefaultValue()
  	document.activeElement.blur()
  	this.refs.componentUI.style['display'] = 'block'
  	this.refs.componentChildUI.refs['scrollComponent'].style['left'] = '0'
  }
  close = () => {
  	this.refs.componentUI.style['display'] = 'none'
  }
  
  registerFun = (callback) => {
  	this.state.setChildDefaultValue = callback
  }
  
  /**
   * 将模型数据和value转换为 
   * modalData为模型数据 [[第一个列数据]，[第n个列数据]]
   * value--为初始值[1990,09,20]
   * 这种格式
   */
  transferData = () => {
  	let injectData = this.props.injectData || {}
  	let slideData = injectData.enumOption
  	let value = []
  	if(injectData.value){
  		value = injectData.value.split('-')
  	}
  	return {
  		data : slideData,
  		value : value
  	}
  }
  
  /**
   * 根据value 1990-09-20 查找对应的文本
   */
  queryTextByKey = ( dict , value , cascade) => {
  	if(!value || value.indexOf('-')==-1){
//		console.error('传入默认value'+value+'为空或者value格式错误，正确格式为：xxxx-xx-xxx')
  		return null
  	}
  	let arr = value.split('-')
  	let resultText = ''
  	if(cascade){
  		let loopArr = JSON.parse(JSON.stringify(dict))
  		arr.map((item , key)=>{
  			let tempArr = []
  			loopArr.map((sItem , sKey) => {
	  			if(sItem.key == item){
	  				resultText = resultText + sItem['value']
	  				tempArr = sItem.subList
	  			}
	  		})
  			loopArr = tempArr
  		})
  	}else{
  		arr.map((item , key)=>{
  			dict[key].map((sItem , sKey) => {
  				if(sItem.key == item){
  					resultText = resultText + sItem['value']
  				}
  			})
  			
  		})
  	}
  	return resultText
  }
  
  /**
   * 如果传入的value有值那么直接返回，否则取dict里面的第一项的值作为滚动的初始值
   */
  getValue = (val , dict ,cascade) => {
  	if(!val){
  		//如果val不存在那么取dict里的第一个值
  		if(cascade){
  			let flag = []
  			flag.push(dict[0]['key'])
  			flag.push(dict[0]['subList'][0]['key'])
  			flag.push(dict[0]['subList'][0]['subList'][0]['key'])
  			return flag
  		}else{
  			return [dict[0][0]['key'] , dict[1][0]['key'] , dict[2][0]['key']]
  		}
  	}else{
  		if(Array.isArray(val)){
  			return val
  		}else{
  			return val.split('-')
  		}
  	}
  }

  render() {
  	let injectData = this.props.injectData || {}
  	let column = injectData.column || 1
  	let cascade = injectData.cascade || false
  	let slideData = injectData.enumOption
  	let showText = this.queryTextByKey(injectData.enumOption , injectData.value , cascade)
  	let value = this.getValue(injectData.value , injectData.enumOption , cascade)
  	if(value.length !== column){
  		console.error('传入组件的值'+injectData.value+'经过split后数组为['+value+']的length:'+value.length+'与传入的column:'+column+'值不相等')
  		return null
  	}
    return (
    	<div className={"scroll-row "+injectData.required}>
    		<label  className="scroll-row-label">{ injectData.label }</label>
    		<div className={injectData.readOnly?"read-only scroll-right":"scroll-right"} onClick= { this.openSlide }>
    			<span>{showText?showText:(injectData.placeholder||'请选择')}</span>
    			<div className="common-right-icon"></div>
    		</div>
    		<div className="component-container" ref="componentUI">
    		{
    			!injectData.readOnly?(
    				<ScrollComponent 
    				ref="componentChildUI"
    				modalData = {slideData}
    				column = {column} 
    				value =  { value } 
    				cascade = {cascade}
    				action={this.changeHandler}
    				cancel = { this.close }
    				registerInitFunc = { this.registerFun }
    				></ScrollComponent>):(null)
    		}
    		</div>
    	</div>
    )
  }
}

export default Scroll

