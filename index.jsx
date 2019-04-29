import React, { Component } from 'react'
import {Input , Textarea , Radio , Sex , Checkbox  , Select , Scroll , Calendar , LongTime } from './formunit/index'
import Occupation from './occupation/index'
import Validate from './formunit/validate'
import './index.less'
//import { Input , Radio , Select , Checkbox , Calendar } from './formunit/index'
/**
 * 根据type渲染出各种表单组件，
 * 支持传入header（表单前面）和footer（表单后面）静态元素块
 * @author simon
 * @datte 2019-01-01
 */
class ReactFomer extends Component {
  
  componentDidMount () {
  	// 注册子组件到父组件
  	if (!this.props.parent.childForm){
	  this.props.parent.childForm = []
    }
    this.props.parent.childForm.push(this)
  }
  
  componentAction = ( resultObj ) => {
  	if (this.props.action) {
  		this.props.action ( resultObj )
  	}
  }
  
  /**
   * 校验需要提交的表单，输出校验错误结果，如果校验通过返回空
   * validate : 'required'
   */
  validateSubmitForm = () => {
  	let modelData = this.transferPortData(this.props.modelData, this.props.interfaceData)
  	let errorMsg = []
  	for (var i = 0 ; i < modelData.length ; i++) {
  		if (modelData[i].validate) {
  			//如果没有配置校验规则，那么调过
  			if(!modelData[i].validate){
  				continue
  			}
  			let vArr = modelData[i].validate.split('|')
  			vArr.map( ( sItem , sKey) => {
  				let validataFunc = modelData[i]['validateFunc']&&modelData[i]['validateFunc'][sItem] ||Validate[sItem] || null
  				if(!validataFunc){
  					console.error('字段['+modelData[i].label+']的校验规则['+sItem+']没有配置校验函数')
  					return null
  				}
  				if (!validataFunc(modelData[i].value)) {
  					if(modelData[i].errorMsg){
  						if (modelData[i].errorMsg[sKey]){ //如果校验的顺序和错误信息的顺序一致那么直接取错误信息
	  						errorMsg.push( modelData[i].errorMsg[sKey] )
	  					}else{ //否则取错误信息最后一项
	  						errorMsg.push( modelData[i].errorMsg[modelData[i].errorMsg.length-1] )
	  					}
  					}else{
  						console.warn('请配置【'+modelData[i].label+'】的校验错误信息配置属性errorMsg默认弹出请输入校验结果')
  						errorMsg.push('请输入'+modelData[i].label)
  					}
  					
  				}
  			})
  		}
  	}
  	return errorMsg
  }
  
  /**
   * 将接口返回的数据，或者state修改的数据map到数据模型中，如果数据模型的name含有.号那么说明传入的接口数据是在根节点数据的孙子级
   * 那么直接取点号split后的最后一项
   */
  transferPortData = (modelData, interfaceData) => {
  	if(!interfaceData){
  		return modelData
  	}
  	modelData.map((item , key) => {
  		let temp = ''
  		if (item.name.indexOf('.') !== -1){
  			temp = item.name.split('.').pop()
  		} else {
  			temp = item.name
  		}
  		//如果接口数据为空并且接口对象中不存在改建，那么取model预先配置的值
  		item.value = interfaceData.hasOwnProperty(temp) ? interfaceData[temp] : item.value
  		if(!interfaceData[temp]){
  			console.warn('接口数据'+item.name+'属性值为空,取modal里的value='+item.value)
  		}
  	})
  	return modelData
  }

  render() {
  	if(!this.props.modelData)return null
  	let modelData = this.transferPortData(this.props.modelData, this.props.interfaceData)
  	let children = this.props.children
  	let header = []
  	let footer = []
  	let slotComponent = {}
  	if(children){
  		if(Array.isArray(children)){
  			children.map((item,key) => {
  				if(Object.prototype.toString.call(item.type) === '[object String]'){
  					if(item.type === 'header'){
			  			header.push(item)
			  		}else if(item.type === 'footer'){
			  			footer.push(item)
			  		}else if(item.type === 'slot'){
			  			slotComponent[item.props.tagName] = item
			  		}
  				} 
  			})
  		}else{
  			if(Object.prototype.toString.call(children.type) === '[object String]'){
				if(children.type === 'header'){
		  			header = children
		  		}else if(children.type === 'footer'){
		  			footer = children
		  		}else if(children.type === 'slot'){
		  			slotComponent[children.props.tagName] = children
		  		}
			} 
  		}
  		
  	}
    return (
    	<div className="r-form-model">
	    	<div className="r-form-title">{ header }</div>
	    	<div className="r-form-cotent">
	    		{
	    			modelData.map((item, key) => {
	    				if (item.type === 'input'){
	    					return (<Input key={key}   injectData = {item}  action = { this.componentAction } ></Input>)
	    				}
	    				if (item.type === 'textarea'){
	    					return (<Textarea key={key}   injectData = {item}  action = { this.componentAction } ></Textarea>)
	    				}
		  				if (item.type === 'radio'){
		  					return (<Radio  key={key}  injectData = {item}  action = { this.componentAction } ></Radio>)
		  				}
		  				if (item.type === 'sex'){
		  					return (<Sex  key={key}  injectData = {item}  action = { this.componentAction } ></Sex>)
		  				}
		  				if (item.type === 'select'){
		  					return (<Select key={key}  injectData = {item}  action = { this.componentAction } ></Select>)
		  				}
		  				if (item.type === 'checkbox'){
		  					return (<Checkbox key={key} injectData = {item}  action = { this.componentAction } ></Checkbox>)
		  				}
		  				if (item.type === 'calendar'){
		  					return (<Calendar key={key} injectData = {item}  action = { this.componentAction } ></Calendar>)
		  				}
		  				if (item.type === 'scroll'){
		  					return (<Scroll key={key} injectData = {item}  action = { this.componentAction } ></Scroll>)
		  				}
		  				if(item.type === 'longtime'){
		  					return (<LongTime key={key} injectData = {item}  action = { this.componentAction } ></LongTime>)
		  				}
		  				if(item.type === 'occupation'){
		  					return (<Occupation key key={key} injectData = {item}  action = { this.componentAction } ></Occupation>)
		  				}
		  				//自定义插入的组件
		  				if (Object.prototype.hasOwnProperty.call(slotComponent,item.type)){
		  					let Self = slotComponent[item.type].props.as
		  					let selfProps = slotComponent[item.type].props
		  					return (<Self key={key} {...selfProps} injectData = {item}  action = { this.componentAction }></Self>)
		  				}
	  				
	    			})
	    		}
	    	</div>
	    	<div className="r-form-footer">{ footer }</div>
	    </div>
    )
  }
}

export default ReactFomer

/**
 * 静态设置参数方法
 * @interfaceData 接口注入数据
 * @obj 用户组件返回的改变后的对象--{keyName,value,eventType,modalKey}，如果是数组那个表示要修改多个值,如果modalKey存在那么修改的是modaldata里的modalKey的值
 * 将用户修改后的数据传入数据模型中
 */
export function changeModelData(interfaceData,modalData , obj){
	let resultData = {}
	if (Array.isArray(obj)){
		obj.map( (item,key) => {
			resultData = transferData(interfaceData,modalData,item)
		})
	}else{
		resultData = transferData(interfaceData,modalData,obj)
	}
	return resultData
}

/**
 * 根据obj修改接口数据和模型数据
 * @param {Object} interfaceData 接口数据，总的接口外层数据
 * @param {Object} modalData 模型数据，总的模型外层数据
 * @param {Object} obj 如果obj.modalKey存在那么修改modalKey对应的值，否则修改value
 */
function transferData(interfaceData,modalData,obj){
	let keyArray = obj.keyName.split('.')
	let lastKey = keyArray.pop()
	let temp = interfaceData
	if(obj.modalKey){
		//改变modaldata里的modalKey对应的值
		temp = modalData
		keyArray.map((item, key)=>{
			temp = temp[item]
		})
		if(!temp){
			console.error('接口数据结构与modalData配置的name层级属性值不匹配name='+obj.keyName+' 接口数据 = ',interfaceData)
			return null
		}
		temp.map((tItem , tKey) => {
			if(tItem['name'] == obj['keyName']){
				tItem[obj['modalKey']] = obj.value
			}
		})
	}else{
		//改变接口数据
		keyArray.map((item, key)=>{
			if(!temp[item]){
				temp[item] = {}
			}
			temp = temp[item]
		})
		if(!temp){
			console.error('接口数据结构与modalData配置的name层级属性值不匹配name='+obj.keyName+' 接口数据 = ',interfaceData)
			return null
		}
		temp[lastKey] = obj.value
	}
	
	return {interfaceData,modalData}
}
