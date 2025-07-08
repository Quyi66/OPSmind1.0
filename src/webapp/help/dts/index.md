# 数据服务 {docsify-ignore}

数据服务（Data Service，简称为dts）提供一个统一、高可用的数据访问接口，通过数据服务API，客户端可以方便的查询后端各种类型的数据源。

- **数据源**: 数据源定义了数据的源头，数据来自哪里。一个数据源可以是一个关系型数据库，一个NoSQL数据库，或者一个Web Service。
- **数据集**: 根据查询条件从一个数据源中查询的数据集合。数据集=数据源+查询语言
- **查询语言**: 数据源可以识别的语言，根据此语言所表达的查询条件，数据源可以给出相应的查询结果。查询语言和数据源类型相关，一种语言往往只支持一类数据源，例如SQL（Structured Query Language）只能用在关系型数据库上。

数据服务支持以下类型的数据源：

* JDBC：支持JDBC的各种关系型数据库，例如Oracle、MySQL、DB2、SQLServer
* ~~数据文件：上传CSV和Excel格式文件作为数据来源 -~~
* Web Service：调用外部的RESTful API获取数据
* MongoDB：MongoDB数据库
* HBase：HBase数据库
* ElasticSearch：[ElasticSearch](https://www.elastic.co/)搜索引擎

![统一数据源](src/main/webapp/help/dts/images/datasource-unified.png)


数据服务具有以下优点：

* 数据和展示分离，数据易于维护和复用
* 后端通过增强SQL查询，提供巨大的数据操作灵活性，并将学习成本降到最低。
* 对于NoSQL和ElasticSearch，同时支持强大的原生查询和易用的SQL查询。
* 前端提供数据转换函数，可以对数据进行各种形式的转换
* 支持不同数据集的数据聚合，可以完成动态基线等复杂场景
* 提供REST API，供其它系统集成和消费数据

![数据处理](src/main/webapp/help/dts/images/data-processing.png)

