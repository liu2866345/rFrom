启动命令 `npm start`
react-form组件基本功能：
   根据用户配置的model文件渲染表单页面，
         组件提供方法：changeModelData--将用户改变的数据设置到interfaceData并且返回,改方法需要2个参数interfaceData--页面容器接口数据,obj--需要合并到接口里的数据对象，如果有联动修改可以传入数组
   基本流程说明：
     用户配置好modelData后引入ReactForm组件，改组件需要配置3个属性
   modelData--用户配置的表单文件，ui根据此配置的顺序进行渲染 --必填
   --modeldata里的name可能含有.号（如果有.号那么表示在重新设置数据集时的数据层级结构如：name:app.name表示数据在reduce中为{app:{name:'xxx'}}）
   interfaceData--从接口获取的数据 --必填
   action -- 用户操作组件后统一调用的事件，改事件返回一个结果obj包含{keyName--字段在modelData中的name,value--操作后的值,eventType--事件类型如：change、blur} --不必填
   parent -- 将父组件的对象传入子组件（子组件将自己注册到父组件），以便于父组件调用子组件的校验方法，如果需要调用校验方法那么改属性--必填
   用户操作表单：
        用户操作表单后，子组件会触发事件回调，然后将操作结果通过action传给父组件，父组件处理后重新调起render进行重新渲染，如果不配置action那么用户操作是改变不了界面ui的
   用户提交表单：
        用户在录入完数据后，提交表单，此时提交方法可以先去遍历调用预先注册进父组件的子组件的校验方法，检验通过后获取结果数据对象提交数据
   this.childForm--改属性是子组件将自己注册在父容器中，改对象拥有一个校验方法validateSubmitForm
   

    组件使用说明：
   scroll：
         滚动组件，支持1-3列的联动和非联动滚动，传入的入参需要滚动数据。如果为联动的那么结构为[{key:'',value:'',subList:[]}],
         如果为非联动的那么传入一个数组[[数组一],[数组二],[数组三]]，传入的初始值为每个slide的value，，
         传入默认值格式为[value1-value2-value3],返回选择后的值也为[value1-value2-value3]，
   cascade--控制是否为联动，默认为不联动，cascade:true表示联动，
   slide列数控制：传入column：number列的个数为数字
      其中，column与传入的value.split('-').length必须一致，同时联动数组的length也必须一致
   触发事件action后，回传对象：{keyName:'longTimeValue' , value: val , eventType:'click',modalKey:'longTimeValue'}
     如果modalKey：存在那么表示修改modalData里的modalKey对应的值而并非修改value，如果不存在那么表示修改value
      
打包配置需要添加
	{
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
            	{
                    loader: 'css-loader',
                    options: {
                        importLoaders: 2,
                        sourceMap: true
                    }
                },
                {
                    loader: 'less-loader',
                    options: {
                        sourceMap: true
                    }
                }
            ]
        })
    },
    
   配置数据modalData：
   {
  		label : '左边标签名，字符串',
  		name : '字段在接口数据中的层级结构如：baseInfo.name',
  		type : '表单类型{Input , Radio , Sex , Checkbox  , Select , Scroll , Calendar , LongTime--长期有效期 ',
  		value : '表单值：如liu',
  		required:'是否是必输字段，控制每行是否带星号，出现值为：required',
  		placeholder:'请输入姓名',
  		readOnly:是否是只读的，布尔型false,
  		validate : '校验规则，针对该字段需要进行的格式校验以|分隔校验规则，如：required|name',
		validateFunc:{校验规则函数，如果组件默认规则没有需要自己注入规则函数如：cellphone:function(val){}}
		errorMsg : [错误信息针对validate配置的校验规则逐次去改数组里的错误信息弹出'请输入姓名','请输入正确的姓名']，
		isShowLongTime:控制是否显示长期true,
  		longTimeValue:控制长期的radio是选中还是不选中，不选中为：false,
  		cascade：控制是否级联，在用scroll时控制是否为级联
  		column:传入scroll的列数最大为3，此时value格式为YYYY-xx-xx,
  		enumOption：传入枚举值，如果cascade为true那么传入有层级的数据，否则传入数组,如果类型为occupation那么该项为一般职业列表
  		commonCarrer：常见职业列表
  		type : 'checkbox',checkClass: 'signal',这2个属性公用表示是方块的多选项，否则为前面带checkbox的多选框
		
  	}
  	说明：name是配置接口数据的层级关系，从接口数据的根开始算起如果多层下面就是xxx.xxx.name,在配置是传入的是最后一层的对象
  	然后在name中用.分隔层级关系便于用户修改后回塞到接口数据中
  传入自定义组件：
  使用方法：<slot tagName="Occupation" as={Occupation}></slot> as为自定义的组件，tagname必须为配置的modal数据里的type值
  as的组件会被注入injectData（配置的该项modaldata对象）和action--向外发射的action