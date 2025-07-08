### REST数据源 {docsify-ignore}

REST API数据源可以远程调用[REST](https://en.wikipedia.org/wiki/Representational_state_transfer) 服务获取数据。REST服务应返回JSON类型的数据格式。  

#### 数据源配置
在【数据服务】模块，点击【新建数据源】，数据源类型选择【REST API】。

填写数据源相关属性。

  - **名称**：数据源的名称，在系统中必须唯一

#### 数据集配置

数据集属性
  - **代码**：标识此数据集的唯一代码，数据集保存之后不能修改。数据集代码只能用大写字母`A-Z`，下划线`_`，数字`0-9`。
  - **名称**：可供阅读的名称，保存之后可以修改。
  - **说明**：可选，数据集用途、使用等备注信息。
  - **数据源**：该数据集对应的数据源
  - **编码格式**：
  - **是否转换为unicode**：
  - **查询语句**：用于查询数据的curl语句
  - **查询参数**：REST支持参数化查询，在这里可以给每个参数添加更详细的信息，例如类型、默认值、说明。
    * 【获取参数】：可以解析查询语句中的参数，自动列出
  - **字段说明**：可选，为数据集的字段（查询结果）添加描述，一般数据库的结果字段都是英文，可以通过字段说明为字段添加字段对应的中文名称，方便使用者理解。这样在自助页面选择数据集字段的时候，可以看到中文名称。
  - **是否取指定结果**：
  - **数组结果key**：

#### 查询语言

REST API数据集采用curl作为查询语言。

查询语句中支持参数，参数采用`${参数名}`的格式。

#### curl参考

- http://www.codingpedia.org/ama/how-to-test-a-rest-api-from-command-line-with-curl/
- http://www.ruanyifeng.com/blog/2011/09/curl.html
- https://curl.haxx.se/docs/httpscripting.html