import React, { Component } from 'react'
/**
 * 文本输入组件
 * @author simon
 * @datte 2019-01-01
 */
class Input extends Component {
  constructor(props, context) {
    super(props, context)
  }
  
  changeHandler = ( element ) => {
  	let injectData = this.props.injectData || {}
  	if(injectData.readOnly){
  		return null
  	}
  	if (this.props.action) {
  		let resultObj = {}
  		let name = element.currentTarget.getAttribute('name')
  		let val = element.currentTarget.getAttribute('value')
  		resultObj['eventType'] = 'click'
  		resultObj['keyName'] = name
  		if(!injectData.value){
  			injectData.value = {check:[],text:''}
  		}
  		let checkVal = injectData.value.check
  		if(checkVal){
  			if(!Array.isArray(checkVal)){
  				console.error('类型错误：'+name+'的check值必须为数组类型！')
  				return null
  			}
  			let flag = checkVal.indexOf(val)
  			if(flag==-1){
  				checkVal.push(val)
  			}else{
  				checkVal.splice(flag,1)
  			}
  		}else{
  			checkVal = []
  			checkVal.push(val)
  		}
  		resultObj['value'] = {check:checkVal,text:injectData.value.text}
  		this.props.action ( resultObj )
  	}
  }
  
  changeHandlerT = (element) => {
  	let injectData = this.props.injectData || {}
  	if(injectData.readOnly){
  		return null
  	}
  	if (this.props.action) {
  		let resultObj = {}
  		if(!injectData.value){
  			injectData.value = {check:[],text:''}
  		}
  		let name = element.currentTarget.getAttribute('name')
  		let val = element.currentTarget.value
  		resultObj['eventType'] = 'change'
  		resultObj['keyName'] = name
  		injectData.value['text'] = val
  		resultObj['value'] = injectData.value
  		this.props.action ( resultObj )
  	}
  }

  render() {
  	let injectData = this.props.injectData || {}
  	if (!injectData.enumOption){
  		console.error('请配置'+injectData.label+'复选枚举文本:enumOption属性。')
  		return null
  	}
  	//value {check:[],text:''}
  	let value = injectData.value || {}
    return (
    	<div className={"checkbox-row "+injectData.required+' '+injectData.checkClass}>
    		<label  className={"checkbox-row-label "+injectData.checkClass}>{ injectData.label }</label>
    		<div className={injectData.readOnly?"checkbox-row-radio read-only":"checkbox-row-radio"}>
	    		{
	    			injectData.enumOption.map((item,key) =>{
	    				let flag = value.check&&(value.check.indexOf(item.key)!==-1)?true:false
						
						let checkClass = flag ? 'check-item cur ' : 'check-item '
						checkClass = checkClass + injectData.checkClass
	    				return (
	    					<div key={key} name = { injectData.name } value = {item.key} onClick = { this.changeHandler } className={ checkClass }>
		    					<span  className='item' ></span>
		    					<span  className='label'>{item.value}</span>
	    					</div>
	    				)
	    			})
	    		}
    		</div>
    		{
    			value.check&&value.check.indexOf('-1')!==-1?(<div className="textarea-row"><div className="textarea-row-content" style={{height:injectData.height}}>
	    			{
	    				injectData.readOnly?(<div className="only-text">{value.text}</div>):(
	    					<textarea name={injectData.name} onChange = { this.changeHandlerT } className="textarea" height={injectData.height}  value={value.text} placeholder={ injectData.placeholder }></textarea>
	    				)
	    			}
	    		</div></div>):(null)
	    		}
    	</div>
    )
  }
}

export default Input
