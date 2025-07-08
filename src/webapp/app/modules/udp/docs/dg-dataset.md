## 数据格式

无论何种类型的数据集，其查询结果都要返回统一的数据格式
```
{
    "total":number,
    "records":[object]
}
```

## 前端数据集配置

- 一般数据集（code或空）：通过代码来查找定义好的数据集。适用于普通用户。
- 动态数据集（datax）：通过数据转换器（函数、YAML、JSON）来生成数据。适用于IT专业用户。
- 关联数据集（joinx）：将多个数据集进行关联，组成一个新的数据集。适用于非IT的高级用户。

Widget的数据集配置放置在`uw-props`的`dataset`属性下面，如下：

```javascript
uwProps = {
   dataset: {
       // 用于一般的数据集, 普通用户使用
      id: "code_of_dataset",
      params:[{name:"param1",type:"string"},{name:"param2",type:"number"}],
      // 数据集类型
      _type:"code,joinx,datax",
      // datax用于动态数据集, for IT developer
      datax:{
        expr:"dataex_expression",
        // metafields可以手工输入，也可以测试expr，将结果自动填入
        metafields:"dataex_expression_in_yaml"   
        // 不支持参数
      },
      // joinx用于数据集聚合, for non-IT pro user
      joinx: {
          dses: [
              // code：数据集的code
              // relations：本数据集(right)和前数据集(left)的字段关联关系，relation之间是AND的关系
              // fields: 对该数据集的字段定义（可选），key是字段名，value是`{excluded:true|false, rename:string}`
              // fields.excluded: 是否将该字段从结果集中排除
              // fields.rename：字段重命名。如果和前一个数据集有重名字段，而没有定义重命名，该字段将忽略
              {
                  code: "dataset_1"
                  // NOTE：第一个数据集不支持relations，如果有也会被忽略
              },
              {
                  code: "dataset_2", 
                  relations:[{left:"left_field",right:"right_field"}],
                  fields:{"user_id":{excluded:true}}
              },
              {
                  code: "dataset_3", 
                  relations:[{left:"left_field",right:"right_field"},{left:"left_field2",right:"right_field3"}]
              }
          ]
      }
   } 
}

```

```
queryJoinx(config)
```

```javascript
ctrl.datasets = [
    {id:'ds1', fields:[{name:'field_name',type:'field_type'}]}
    
]
```
