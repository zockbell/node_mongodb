# 用Node+MongoDB实现登录系统

安装依赖
```
npm i install
```

启动项目
```
npm run dev
```

## 一、结构目录

```
node_mongodb:
│  .http						// 用来做接口测试，类似postman
│  app.js						
│  nodemon.json
│  package.json
│  yarn.lock
│  
├─libs
│      db.js			// 来做数据库的连接(mongoose)
│      
├─middleware
│      error.js		// 自定义中间件，收集错误信息（线上版本，不建议使用）
│      
├─models
│      user.js		// 对数据库的一些操作
│      
├─routers
│      user.js	 	// 接口定义
│      
└─src
    │  
    └─assets
        │  
        └─images
                1.png
                2.png
                3.png
                4.png
                5.png
```



## 二、了解 MongoDB 简介

MongoDB 是由C++语言编写的，是一个基于分布式文件存储的开源数据库系统。

MongoDB 旨在为WEB应用提供可扩展的高性能数据存储解决方案。

MongoDB 将数据存储为一个文档，数据结构由键值(key=>value)对组成。MongoDB 文档类似于 JSON 对象。字段值可以包含其他文档，数组及文档数组。

## MongoDB 概念解析

| SQL术语/概念 | MongoDB术语/概念 | 解释/说明                              |
| ------------ | ---------------- | -------------------------------------- |
| database     | database         | 数据库                                 |
| table        | collection       | 数据库表/集合                          |
| row          | document         | 数据记录行/文档                        |
| column       | field            | 数据字段/域                            |
| index        | index            | 索引                                   |
| table jins   |                  | 表连接，MongoDB不支持                  |
| primary key  | primary key      | 主键，MongoDB自动将 _id 字段设置为主键 |

下表列出了 RDBMS 关系型数据库管理系统（Relational Database Management System）与 MongoDB 对应的术语：

| RDBMS  | MongoDB                           |
| ------ | --------------------------------- |
| 数据库 | 数据库                            |
| 表格   | 集合                              |
| 行     | 文档                              |
| 列     | 字段                              |
| 表联合 | 嵌入文档                          |
| 主键   | 主键（MongoDB 提供了 key 为 _id） |

### MongoDB 数据类型

| 数据类型           | 描述                                                         |
| ------------------ | ------------------------------------------------------------ |
| String             | 字符串。存储数据常用的数据类型。在 MongoDB 中，UTF-8 编码的字符串才是合法的。 |
| Integer            | 整型数值。用于存储数值。根据你所采用的服务器，可分为 32 位或 64 位。 |
| Boolean            | 布尔值。用于存储布尔值（真/假）。                            |
| Double             | 双精度浮点值。用于存储浮点值。                               |
| Min/Max keys       | 将一个值与 BSON（二进制的 JSON）元素的最低值和最高值相对比。 |
| Array              | 用于将数组或列表或多个值存储为一个键。                       |
| Timestamp          | 时间戳。记录文档修改或添加的具体时间。                       |
| Object             | 用于内嵌文档。                                               |
| Null               | 用于创建空值。                                               |
| Symbol             | 符号。该数据类型基本上等同于字符串类型，但不同的是，它一般用于采用特殊符号类型的语言。 |
| Date               | 日期时间。用 UNIX 时间格式来存储当前日期或时间。你可以指定自己的日期时间：创建 Date 对象，传入年月日信息。 |
| Object ID          | 对象 ID。用于创建文档的 ID。                                 |
| Binary Data        | 二进制数据。用于存储二进制数据。                             |
| Code               | 代码类型。用于在文档中存储 JavaScript 代码。                 |
| Regular expression | 正则表达式类型。用于存储正则表达式。                         |



下表为MongoDB中常用的几种数据类型。



## MongoDB 语法

### 1. MongoDb--连接

可以使用 MongoDB shell 来连接 MongoDB 服务器

标准 URI 连接语法：

```mysql
mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]
```

- **mongodb://** 这是固定的格式，必须要指定。
- **username:password@** 可选项，如果设置，在连接数据库服务器之后，驱动都会尝试登陆这个数据库
- **host1** 必须的指定至少一个host, host1 是这个URI唯一要填写的。它指定了要连接服务器的地址。如果要连接复制集，请指定多个主机地址。
- **portX** 可选的指定端口，如果不填，默认为27017
- **/database** 如果指定username:password@，连接并验证登陆指定数据库。若不指定，默认打开 test 数据库。
- **?options** 是连接选项。如果不使用/database，则前面需要加上/。所有连接选项都是键值对name=value，键值对之间通过&或;（分号）隔开

**实例：**

1. 使用默认端口来连接 MongoDB 的服务。

   ```
   mongodb://localhost
   ```

   

2. 使用用户 admin 使用密码 123456 连接到本地的 MongoDB 服务上。输出结果如下所示：

   ```
   mongodb://admin:123456@localhost/
   ```

3. 使用用户名fred，密码foobar登录localhost的baz数据库。

   ```
   mongodb://fred:foobar@localhost/baz
   ```

---

### 2. MongoDB 创建数据库

MongoDB 创建数据库的语法格式如下：

```mongodb
use zock
```

如果数据库不存在，则创建数据库，否则切换到指定数据库。

查看所有数据库，可以使用 **show dbs** 命令：

```mongodb
show dbs
```

我们刚创建的数据库默认是不显示的， 要显示它，我们需要向 zock 数据库插入一些数据。

```mongodb
> db.runoob.insert({"name":"zock"})
WriteResult({ "nInserted" : 1 })
```

此时再用 `show dbs`即可显示`zock`数据库。

---

### 3. MongoDB 删除数据库

MongoDB 删除数据库的语法格式如下：

```mongodb
db.dropDatabase()
```

删除当前数据库，默认为 test，你可以使用 db 命令查看当前数据库名。

**实例：**

以下实例删除数据库`zock`

1. 首先，查看所有数据库，`show dbs`

2. 切换到数据库`zock`，使用命令：`use zock`

3. 执行删除命令：

   ```mongodb
   db.dropDatabase()
   { "dropped" : "zock", "ok" : 1 }
   ```

---

### 4. MongoDB 创建集合

MongoDB 中使用 **createCollection()** 方法来创建集合。

语法格式：

```mongodb
db.createCollection(name, options)
```

参数说明：

- name: 要创建的集合名称
- options: 可选参数, 指定有关内存大小及索引的选项

options 可以是如下参数：

| 字段        | 类型 | 描述                                                         |
| :---------- | :--- | :----------------------------------------------------------- |
| capped      | 布尔 | （可选）如果为 true，则创建固定集合。固定集合是指有着固定大小的集合，当达到最大值时，它会自动覆盖最早的文档。 **当该值为 true 时，必须指定 size 参数。** |
| autoIndexId | 布尔 | （可选）如为 true，自动在 _id 字段创建索引。默认为 false。   |
| size        | 数值 | （可选）为固定集合指定一个最大值，以千字节计（KB）。 **如果 capped 为 true，也需要指定该字段。** |
| max         | 数值 | （可选）指定固定集合中包含文档的最大数量。                   |

在插入文档时，MongoDB 首先检查固定集合的 size 字段，然后检查 max 字段。

**实例**

在`zock`数据库中创建`comment`集合：

```mongodb
> use zock
switched to db zock
> db.createCollection("comment")
{ "ok" : 1 }
>
```

如果要查看已有集合，可以使用 **show collections** 或 **show tables** 命令：

```mongodb
> show collections
comment
system.indexes
```

在 MongoDB 中，你不需要创建集合。当你插入一些文档时，MongoDB 会自动创建集合。

```mongodb
> db.mycol2.insert({"name" : "zhangsan"})
> show collections
mycol2
...
```

---

### 5. MongoDb 删除集合

MongoDB中使用`drop()`方法来删除集合。

```mongodb
db.collectionName.drop()
```

**返回值**

如果成功删除选定集合，则 drop() 方法返回 true，否则返回 false。

**实例**1

在数据库 `zock` 中，我们可以先通过`show collections`命令查看已存在的集合：

```mongodb
>use zock
switched to db zock
>show collections
mycol
mycol2
system.indexes
comment
>
```

接着删除集合`mycol2`：

```mongodb
>db.mycol2.drop()
true
>
```

以上即可删除集合成功。

**实例2**

以下实例删除了 zock 数据库中的集合 mycol：

```mongodb
> use zock
switched to db zock
> db.createCollection("mycol")     # 先创建集合，类似数据库中的表
> show tables             # show collections 命令会更加准确点
mycol
> db.mycol.drop()
true
> show tables
> 
```

---

### 6. MongoDB 插入文档

文档的数据结构和 JSON 基本一样。

所有存储在集合中的数据都是 BSON 格式。

BSON 是一种类似 JSON 的二进制形式的存储格式，是 Binary JSON 的简称。

#### 插入文档

MongoDB 使用 insert() 或 save() 方法向集合中插入文档，语法如下：

```mongodb
db.COLLECTION_NAME.insert(document)
```

**实例**

以下文档可以存储在 MongoDB 的`zock`  数据库 的 `col` 集合中：

```
>db.col.insert({title: 'MongoDB 教程', 
    description: 'MongoDB 是一个 Nosql 数据库',
    by: '菜鸟教程',
    url: 'http://www.runoob.com',
    tags: ['mongodb', 'database', 'NoSQL'],
    likes: 100
})
```

以上实例中 `col` 是我们的集合名，如果该集合不在该数据库中， MongoDB 会自动创建该集合并插入文档。

查看已插入文档：

```mongodb
db.COLLECTION_NAME.find()
```

```
> db.col.find()
{ "_id" : ObjectId("56064886ade2f21f36b03134"), "title" : "MongoDB 教程", "description" : "MongoDB 是一个 Nosql 数据库", "by" : "菜鸟教程", "url" : "http://www.runoob.com", "tags" : [ "mongodb", "database", "NoSQL" ], "likes" : 100 }
> 
```

我们也可以将数据定义为一个变量，如下所示：

```mongodb
> document=({title: 'MongoDB 教程', 
    description: 'MongoDB 是一个 Nosql 数据库',
    by: '菜鸟教程',
    url: 'http://www.runoob.com',
    tags: ['mongodb', 'database', 'NoSQL'],
    likes: 100
});
```

执行后显示结果如下：

```mongodb
{
        "title" : "MongoDB 教程",
        "description" : "MongoDB 是一个 Nosql 数据库",
        "by" : "菜鸟教程",
        "url" : "http://www.runoob.com",
        "tags" : [
                "mongodb",
                "database",
                "NoSQL"
        ],
        "likes" : 100
}
```

执行插入操作：

```mongodb
> db.col.insert(document)
WriteResult({ "nInserted" : 1 })
> 
```

插入文档也可以使用 db.col.save(document) 命令。如果不指定 _id 字段 save() 方法类似于 insert() 方法。如果指定 _id 字段，则会更新该 _id 的数据。

* 3.2 版本后还有以下几种语法可用于插入文档:

  *  db.collection.insertOne():向指定集合中插入一条文档数据
  *  db.collection.insertMany():向指定集合中插入多条文档数据

  ```mongodb
  #  插入单条数据
  
  > var document = db.collection.insertOne({"a": 3})
  > document
  {
          "acknowledged" : true,
          "insertedId" : ObjectId("571a218011a82a1d94c02333")
  }
  
  #  插入多条数据
  > var res = db.collection.insertMany([{"b": 3}, {'c': 4}])
  > res
  {
          "acknowledged" : true,
          "insertedIds" : [
                  ObjectId("571a22a911a82a1d94c02337"),
                  ObjectId("571a22a911a82a1d94c02338")
          ]
  }
  ```

  

---

**一次插入多条数据**

1、先创建数组

2、将数据放在数组中

3、一次 insert 到集合中

```mongodb
var arr = [];

for(var i=1 ; i<=20000 ; i++){
    arr.push({num:i});
}

db.numbers.insert(arr);
```

---

### 7. MongoDB 更新文档

MongoDB 使用 **update()** 和 **save()** 方法来更新集合中的文档。接下来让我们详细来看下两个函数的应用及其区别。

#### update() 方法

update() 方法用于更新已存在的文档。语法格式如下：

```mongodb
db.collection.update(
   <query>,
   <update>,
   {
     upsert: <boolean>,
     multi: <boolean>,
     writeConcern: <document>
   }
)
```

**参数说明：**

- **query** : update的查询条件，类似sql update查询内where后面的。
- **update** : update的对象和一些更新的操作符（如$,$inc...）等，也可以理解为sql update查询内set后面的
- **upsert** : 可选，这个参数的意思是，如果不存在update的记录，是否插入objNew,true为插入，默认是false，不插入。
- **multi** : 可选，mongodb 默认是false,只更新找到的第一条记录，如果这个参数为true,就把按条件查出来多条记录全部更新。
- **writeConcern** :可选，抛出异常的级别。

**实例**

我们在集合 col 中插入如下数据：

```mongodb
>db.col.insert({
    title: 'MongoDB 教程', 
    description: 'MongoDB 是一个 Nosql 数据库',
    by: '菜鸟教程',
    url: 'http://www.runoob.com',
    tags: ['mongodb', 'database', 'NoSQL'],
    likes: 100
})
```

接着我们通过 update() 方法来更新标题(title):

```mongodb
>db.col.update({'title':'MongoDB 教程'},{$set:{'title':'MongoDB'}})
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })   # 输出信息
> db.col.find().pretty()
{
        "_id" : ObjectId("56064f89ade2f21f36b03136"),
        "title" : "MongoDB",
        "description" : "MongoDB 是一个 Nosql 数据库",
        "by" : "菜鸟教程",
        "url" : "http://www.runoob.com",
        "tags" : [
                "mongodb",
                "database",
                "NoSQL"
        ],
        "likes" : 100
}
>
```

可以看到标题(title)由原来的 "MongoDB 教程" 更新为了 "MongoDB"。

以上语句只会修改第一条发现的文档，如果你要修改多条相同的文档，则需要设置 multi 参数为 true。

```mongodb
>db.col.update({'title':'MongoDB 教程'},{$set:{'title':'MongoDB'}},{multi:true})
```

#### save() 方法

save() 方法通过传入的文档来替换已有文档。语法格式如下：

```mongodb
db.collection.save(
   <document>,
   {
     writeConcern: <document>
   }
)
```

**参数说明：**

- **document** : 文档数据。
- **writeConcern** :可选，抛出异常的级别。

**实例**

以下实例中我们替换了 _id 为 56064f89ade2f21f36b03136 的文档数据：

```mongodb
>db.col.save({
    "_id" : ObjectId("56064f89ade2f21f36b03136"),
    "title" : "MongoDB",
    "description" : "MongoDB 是一个 Nosql 数据库",
    "by" : "Runoob",
    "url" : "http://www.runoob.com",
    "tags" : [
            "mongodb",
            "NoSQL"
    ],
    "likes" : 110
})
```

替换成功后，我们可以通过 find() 命令来查看替换后的数据

```mongodb
>db.col.find().pretty()
{
        "_id" : ObjectId("56064f89ade2f21f36b03136"),
        "title" : "MongoDB",
        "description" : "MongoDB 是一个 Nosql 数据库",
        "by" : "Runoob",
        "url" : "http://www.runoob.com",
        "tags" : [
                "mongodb",
                "NoSQL"
        ],
        "likes" : 110
}
> 
```

**更多实例**

只更新第一条记录：

```mongodb
db.col.update( { "count" : { $gt : 1 } } , { $set : { "test2" : "OK"} } );
```

全部更新：

```mongodb
db.col.update( { "count" : { $gt : 3 } } , { $set : { "test2" : "OK"} },false,true );
```

只添加第一条：

```mongodb
db.col.update( { "count" : { $gt : 4 } } , { $set : { "test5" : "OK"} },true,false );
```

全部添加进去:

```mongodb
db.col.update( { "count" : { $gt : 5 } } , { $set : { "test5" : "OK"} },true,true );
```

全部更新：

```monggodb
db.col.update( { "count" : { $gt : 15 } } , { $inc : { "count" : 1} },false,true );
```

只更新第一条记录：

```mongodb
db.col.update( { "count" : { $gt : 10 } } , { $inc : { "count" : 1} },false,false );
```

---

### 8. MongoDB 删除文档

MongoDB remove()函数是用来移除集合中的数据。

MongoDB数据更新可以使用update()函数。在执行remove()函数前先执行find()命令来判断执行的条件是否正确，这是一个比较好的习惯。

### 语法

remove() 方法的基本语法格式如下所示：

```mongodb
db.collection.remove(
   <query>,
   {
     justOne: <boolean>,
     writeConcern: <document>
   }
)
```

**参数说明：**

- **query** :（可选）删除的文档的条件。
- **justOne** : （可选）如果设为 true 或 1，则只删除一个文档，如果不设置该参数，或使用默认值 false，则删除所有匹配条件的文档。
- **writeConcern** :（可选）抛出异常的级别。

**实例：**

以下文档执行两次插入操作：

```mongodb
>db.col.insert({title: 'MongoDB 教程', 
    description: 'MongoDB 是一个 Nosql 数据库',
    by: '菜鸟教程',
    url: 'http://www.runoob.com',
    tags: ['mongodb', 'database', 'NoSQL'],
    likes: 100
})
```

使用 find() 函数查询数据：

```mongodb
> db.col.find()
{ "_id" : ObjectId("56066169ade2f21f36b03137"), "title" : "MongoDB 教程", "description" : "MongoDB 是一个 Nosql 数据库", "by" : "菜鸟教程", "url" : "http://www.runoob.com", "tags" : [ "mongodb", "database", "NoSQL" ], "likes" : 100 }
{ "_id" : ObjectId("5606616dade2f21f36b03138"), "title" : "MongoDB 教程", "description" : "MongoDB 是一个 Nosql 数据库", "by" : "菜鸟教程", "url" : "http://www.runoob.com", "tags" : [ "mongodb", "database", "NoSQL" ], "likes" : 100 }
```

接下来我们移除 title 为 'MongoDB 教程' 的文档：

```mongodb
>db.col.remove({'title':'MongoDB 教程'})
WriteResult({ "nRemoved" : 2 })           # 删除了两条数据
>db.col.find()
……                                        # 没有数据
```

如果你只想删除第一条找到的记录可以设置 justOne 为 1，如下所示：

```mongodb
>db.COLLECTION_NAME.remove(DELETION_CRITERIA,1)
```

如果你想删除所有数据，可以使用以下方式（类似常规 SQL 的 truncate 命令）：

```mongodb
>db.col.remove({})
>db.col.find()
>
```

remove() 方法 并不会真正释放空间。

需要继续执行 db.repairDatabase() 来回收磁盘空间。

remove() 方法已经过时了，现在官方推荐使用 deleteOne() 和 deleteMany() 方法。

如删除集合下全部文档：

```
db.inventory.deleteMany({})
```

删除 status 等于 A 的全部文档：

```
db.inventory.deleteMany({ status : "A" })
```

删除 status 等于 D 的一个文档：

```
db.inventory.deleteOne( { status: "D" } )
```

---

### 9. MongoDB 查询文档

MongoDB 查询文档使用 find() 方法。

find() 方法以非结构化的方式来显示所有文档。

### 语法

MongoDB 查询数据的语法格式如下：

```
db.collection.find(query, projection)
```

- **query** ：可选，使用查询操作符指定查询条件
- **projection** ：可选，使用投影操作符指定返回的键。查询时返回文档中所有键值， 只需省略该参数即可（默认省略）。

如果你需要以易读的方式来读取数据，可以使用 pretty() 方法，语法格式如下：

```
>db.col.find().pretty()
```

pretty() 方法以格式化的方式来显示所有文档。

**实例**

以下实例我们查询了集合 col 中的数据：

```
> db.col.find().pretty()
{
        "_id" : ObjectId("56063f17ade2f21f36b03133"),
        "title" : "MongoDB 教程",
        "description" : "MongoDB 是一个 Nosql 数据库",
        "by" : "菜鸟教程",
        "url" : "http://www.runoob.com",
        "tags" : [
                "mongodb",
                "database",
                "NoSQL"
        ],
        "likes" : 100
}
```

除了 find() 方法之外，还有一个 findOne() 方法，它只返回一个文档。

#### MongoDB 与 RDBMS Where 语句比较

如果你熟悉常规的 SQL 数据，通过下表可以更好的理解 MongoDB 的条件语句查询：

| 操作       | 格式         | 范例                                        | RDBMS中的类似语句       |
| :--------- | :----------- | :------------------------------------------ | :---------------------- |
| 等于       | `{:`}        | `db.col.find({"by":"菜鸟教程"}).pretty()`   | `where by = '菜鸟教程'` |
| 小于       | `{:{$lt:}}`  | `db.col.find({"likes":{$lt:50}}).pretty()`  | `where likes < 50`      |
| 小于或等于 | `{:{$lte:}}` | `db.col.find({"likes":{$lte:50}}).pretty()` | `where likes <= 50`     |
| 大于       | `{:{$gt:}}`  | `db.col.find({"likes":{$gt:50}}).pretty()`  | `where likes > 50`      |
| 大于或等于 | `{:{$gte:}}` | `db.col.find({"likes":{$gte:50}}).pretty()` | `where likes >= 50`     |
| 不等于     | `{:{$ne:}}`  | `db.col.find({"likes":{$ne:50}}).pretty()`  | `where likes != 50`     |

#### MongoDB AND 条件

MongoDB 的 find() 方法可以传入多个键(key)，每个键(key)以逗号隔开，即常规 SQL 的 AND 条件。

语法格式如下：

```mongodb
>db.col.find({key1:value1, key2:value2}).pretty()
```



**实例**

以下实例通过 **by** 和 **title** 键来查询 **菜鸟教程** 中 **MongoDB 教程** 的数据

```mongodb
> db.col.find({"by":"菜鸟教程", "title":"MongoDB 教程"}).pretty()
{
        "_id" : ObjectId("56063f17ade2f21f36b03133"),
        "title" : "MongoDB 教程",
        "description" : "MongoDB 是一个 Nosql 数据库",
        "by" : "菜鸟教程",
        "url" : "http://www.runoob.com",
        "tags" : [
                "mongodb",
                "database",
                "NoSQL"
        ],
        "likes" : 100
}
```

以上实例中类似于 WHERE 语句：**WHERE by='菜鸟教程' AND title='MongoDB 教程'**

#### MongoDB OR 条件

MongoDB OR 条件语句使用了关键字 **$or**,语法格式如下：

```mongodb
>db.col.find(
   {
      $or: [
         {key1: value1}, {key2:value2}
      ]
   }
).pretty()
```

**实例**

以下实例中，我们演示了查询键 **by** 值为 菜鸟教程 或键 **title** 值为 **MongoDB 教程** 的文档。

```mongodb
>db.col.find({$or:[{"by":"菜鸟教程"},{"title": "MongoDB 教程"}]}).pretty()
{
        "_id" : ObjectId("56063f17ade2f21f36b03133"),
        "title" : "MongoDB 教程",
        "description" : "MongoDB 是一个 Nosql 数据库",
        "by" : "菜鸟教程",
        "url" : "http://www.runoob.com",
        "tags" : [
                "mongodb",
                "database",
                "NoSQL"
        ],
        "likes" : 100
}
>
```

#### AND 和 OR 联合使用

以下实例演示了 AND 和 OR 联合使用，类似常规 SQL 语句为： **'where likes>50 AND (by = '菜鸟教程' OR title = 'MongoDB 教程')'**

```mongodb
>db.col.find({"likes": {$gt:50}, $or: [{"by": "菜鸟教程"},{"title": "MongoDB 教程"}]}).pretty()
{
        "_id" : ObjectId("56063f17ade2f21f36b03133"),
        "title" : "MongoDB 教程",
        "description" : "MongoDB 是一个 Nosql 数据库",
        "by" : "菜鸟教程",
        "url" : "http://www.runoob.com",
        "tags" : [
                "mongodb",
                "database",
                "NoSQL"
        ],
        "likes" : 100
}
```

---

### 10. MongoDB 排序

#### MongoDB sort() 方法

在 MongoDB 中使用 sort() 方法对数据进行排序，sort() 方法可以通过参数指定排序的字段，并使用 1 和 -1 来指定排序的方式，其中 1 为升序排列，而 -1 是用于降序排列。

### 语法

sort()方法基本语法如下所示：

```momgodb
>db.COLLECTION_NAME.find().sort({KEY:1})
```

**实例**

col 集合中的数据如下：

```mongodb
{ "_id" : ObjectId("56066542ade2f21f36b0313a"), "title" : "PHP 教程", "description" : "PHP 是一种创建动态交互性站点的强有力的服务器端脚本语言。", "by" : "菜鸟教程", "url" : "http://www.runoob.com", "tags" : [ "php" ], "likes" : 200 }
{ "_id" : ObjectId("56066549ade2f21f36b0313b"), "title" : "Java 教程", "description" : "Java 是由Sun Microsystems公司于1995年5月推出的高级程序设计语言。", "by" : "菜鸟教程", "url" : "http://www.runoob.com", "tags" : [ "java" ], "likes" : 150 }
{ "_id" : ObjectId("5606654fade2f21f36b0313c"), "title" : "MongoDB 教程", "description" : "MongoDB 是一个 Nosql 数据库", "by" : "菜鸟教程", "url" : "http://www.runoob.com", "tags" : [ "mongodb" ], "likes" : 100 }
```

以下实例演示了 col 集合中的数据按字段 likes 的降序排列：

```mongodb
>db.col.find({},{"title":1,_id:0}).sort({"likes":-1})
{ "title" : "PHP 教程" }
{ "title" : "Java 教程" }
{ "title" : "MongoDB 教程" }
>
```

---

## 三、Node.js 连接 MongoDB

### 1. 首先安装驱动

```node
$ npm install mongodb
```

接下来我们来实现增删改查功能。

### 2. 创建数据库

要在 MongoDB 中创建一个数据库，首先我们需要创建一个 MongoClient 对象，然后配置好指定的 URL 和 端口号。

如果数据库不存在，MongoDB 将创建数据库并建立连接。

```js
// 创建连接
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/runoob";
 
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  console.log("数据库已创建!");
  db.close();
});
```

### 3. 创建集合

我们可以使用 createCollection() 方法来创建集合：

```js
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/runoob';
MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    console.log('数据库已创建');
    var dbase = db.db("runoob");
    dbase.createCollection('site', function (err, res) {
        if (err) throw err;
        console.log("创建集合!");
        db.close();
    });
});
```

### 4. 数据库操作( CURD )

与 MySQL 不同的是 MongoDB 会自动创建数据库和集合，所以使用前我们不需要手动去创建。

#### 4.1 插入数据

以下实例我们连接数据库 runoob 的 site 表，**并插入一条数据条数据，使用 `insertOne()`**：

```js
// 插入一条数据
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
 
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("runoob");
    var myobj = { name: "菜鸟教程", url: "www.runoob" };
    dbo.collection("site").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("文档插入成功");
        db.close();
    });
});
```

执行以下命令输出就结果为：

```node
$ node test.js
文档插入成功
```

从输出结果来看，数据已插入成功。

我们也可以打开 MongoDB 的客户端查看数据，如：

```mongodb
> show dbs
runoob  0.000GB          # 自动创建了 runoob 数据库
> show tables
site                     # 自动创建了 site 集合（数据表）
> db.site.find()
{ "_id" : ObjectId("5a794e36763eb821b24db854"), "name" : "菜鸟教程", "url" : "www.runoob" }
> 
```

**如果要插入多条数据可以使用` insertMany()`：**

```js
// 插入多条数据
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
 
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("runoob");
    var myobj =  [
        { name: '菜鸟工具', url: 'https://c.runoob.com', type: 'cn'},
        { name: 'Google', url: 'https://www.google.com', type: 'en'},
        { name: 'Facebook', url: 'https://www.google.com', type: 'en'}
       ];
    dbo.collection("site").insertMany(myobj, function(err, res) {
        if (err) throw err;
        console.log("插入的文档数量为: " + res.insertedCount);
        db.close();
    });
});
```

`res.insertedCount` 为插入的条数。

#### 4.2 查询数据

可以使用 find() 来查找数据, find() 可以返回匹配条件的所有数据。 如果未指定条件，find() 返回集合中的所有数据。

```js
// find()
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
 
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("runoob");
    dbo.collection("site"). find({}).toArray(function(err, result) { // 返回集合中所有数据
        if (err) throw err;
        console.log(result);
        db.close();
    });
});
```

以下实例检索 name 为 "菜鸟教程" 的实例：

```js
// 查询指定条件的数据
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
 
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("runoob");
     var whereStr = {"name":'菜鸟教程'};  // 查询条件
    dbo.collection("site").find(whereStr).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
    });
});
```

执行以下命令输出就结果为：

```node
[ { _id: 5a794e36763eb821b24db854,
    name: '菜鸟教程',
    url: 'www.runoob' } ]
```

#### 4.3 更新数据

我们也可以对数据库的数据进行修改，以下实例将 name 为 "菜鸟教程" 的 url 改为 https://www.runoob.com：

```js
// 更新一条数据
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
 
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("runoob");
    var whereStr = {"name":'菜鸟教程'};  // 查询条件
    var updateStr = {$set: { "url" : "https://www.runoob.com" }};
    dbo.collection("site").updateOne(whereStr, updateStr, function(err, res) {
        if (err) throw err;
        console.log("文档更新成功");
        db.close();
    });
});
```

执行成功后，进入 mongo 管理工具查看数据已修改：

```node
> db.site.find().pretty()
{
    "_id" : ObjectId("5a794e36763eb821b24db854"),
    "name" : "菜鸟教程",
    "url" : "https://www.runoob.com"     // 已修改为 https
}
```

如果要更新所有符合条的文档数据可以使用 **updateMany()**：

```js
// 更新多条数据
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
 
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("runoob");
    var whereStr = {"type":'en'};  // 查询条件
    var updateStr = {$set: { "url" : "https://www.runoob.com" }};
    dbo.collection("site").updateMany(whereStr, updateStr, function(err, res) {
        if (err) throw err;
         console.log(res.result.nModified + " 条文档被更新");
        db.close();
    });
});
```

`result.nModified` 为更新的条数。

#### 4.4 删除数据

以下实例将 name 为 "菜鸟教程" 的数据删除 :

```js
// 删除一条数据
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
 
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("runoob");
    var whereStr = {"name":'菜鸟教程'};  // 查询条件
    dbo.collection("site").deleteOne(whereStr, function(err, obj) {
        if (err) throw err;
        console.log("文档删除成功");
        db.close();
    });
});
```

执行成功后，进入 mongo 管理工具查看数据已删除：

```node
> db.site.find()
> 
```

如果要删除多条语句可以使用 **deleteMany()** 方法

以下实例将 type 为 en 的所有数据删除 :

```js
// 删除多条数据
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
 
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("runoob");
    var whereStr = { type: "en" };  // 查询条件
    dbo.collection("site").deleteMany(whereStr, function(err, obj) {
        if (err) throw err;
        console.log(obj.result.n + " 条文档被删除");
        db.close();
    });
});
```

`obj.result.n` 删除的条数。

#### 4.5 排序

排序 使用 sort() 方法，该方法接受一个参数，规定是升序(1)还是降序(-1)。

例如：

```js
{ type: 1 }  // 按 type 字段升序
{ type: -1 } // 按 type 字段降序
```

按 type 升序排列:

```js
// 排序
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
 
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("runoob");
    var mysort = { type: 1 };
    dbo.collection("site").find().sort(mysort).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
    });
});
```

#### 4.6  查询分页

如果要设置指定的返回条数可以使用 **limit()** 方法，该方法只接受一个参数，指定了返回的条数。

```js
// limit()：读取两条数据
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
 
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("runoob");
    dbo.collection("site").find().limit(2).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
  });
});
```

如果要指定跳过的条数，可以使用 **skip()** 方法。

```js
// skip(): 跳过前面两条数据，读取两条数据
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
 
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("runoob");
    dbo.collection("site").find().skip(2).limit(2).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
  });
});
```

#### 4.7 连接操作

mongoDB 不是一个关系型数据库，但我们可以使用 **$lookup** 来实现左连接。

例如我们有两个集合数据分别为：

集合1：orders

```mongodb
[
  { _id: 1, product_id: 154, status: 1 }
]
```

集合2：products

```mongodb
[
  { _id: 154, name: '笔记本电脑' },
  { _id: 155, name: '耳机' },
  { _id: 156, name: '台式电脑' }
]
```

```js
// $lookup 实现左连接
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/";
 
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("runoob");
  dbo.collection('orders').aggregate([
    { $lookup:
       {
         from: 'products',            // 右集合
         localField: 'product_id',    // 左集合 join 字段
         foreignField: '_id',         // 右集合 join 字段
         as: 'orderdetails'           // 新生成字段（类型array）
       }
     }
    ]).toArray(function(err, res) {
    if (err) throw err;
    console.log(JSON.stringify(res));
    db.close();
  });
});
```

#### 4.8 删除集合

我们可以使用 **drop()** 方法来删除集合：

```js
// drop()
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
 
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("runoob");
    // 删除 test 集合
    dbo.collection("test").drop(function(err, delOK) {  // 执行成功 delOK 返回 true，否则返回 false
        if (err) throw err;
        if (delOK) console.log("集合已删除");
        db.close();
    });
});
```

## 四、本系统所使用的连接数据库方式

1. `./libs/db.js`文件连接数据库

```js
// 连接数据库

const mongoose = require('mongoose');
// 连接mongodb数据库，如果没有数据库，则会自动创建
mongoose.connect('mongodb://localhost:27017/user', {
    useNewUrlParser: true,     // 新的解析器
    useUnifiedTopology: true,  // 新的引擎
    useCreateIndex: true,      // 定义索引
    poolSize: 5                // 连接池
});

module.exports = mongoose;
```



2. `./models/user.js`声明mogoose中的Schema

   [mogoose](http://www.mongoosejs.net/)

```js
// 对数据库的一些操作
const mongoose = require('../libs/db');
// const bcrypt = require('bcrypt');

// 定义规则
// var salt = bcrypt.genSaltSync(10);  //---散列10位长度，太长浪费性能没必要，过少的话，那么安全性又是个问题
// var hash = bcrypt.hashSync(val, salt);  //---获得加密的 hash 密码

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    }
})

// 使用规则
const User = mongoose.model('User', UserSchema);

module.exports = { User };
```



3. `./routers/user.js`中定义接口

```js
const Router = require('koa-router');
const router = new Router();
const { User } = require('../models/user');

// 路由前缀
router.prefix('/api/user');

router.get('/', ctx => {
    ctx.body = "用户主页";
})

// 查询用户
router.get('/refer', async ctx => {
    ctx.body = await User.find();
});

// 注册
router.post('/register', async ctx => {
    const { username, password } = ctx.request.body;
    if(password.length < 6) {
        // console.log('密码不能小于6位');
        return ctx.body = {
            retult: false,
            errcode: 102,
            errmsg: "密码不能小于6位"
        }
    } else {
        const user = await User.create({
            username,
            password
        })
    }
})

// 登录
router.post('/login', async ctx => {
    // ctx.body = '登录'
    const {username, password} = ctx.request.body;
    // console.log(username, password);
    // 登录逻辑先判断用户名是否存在，之后再比对密码
    const user = await User.findOne({
        username
    })

    // console.log(user);

    // 用户名不存在
    if(!user) {
        return ctx.body = {
            retult: false,
            errcode: 100,
            errmsg: "用户名不存在"
        }
    }

    // 用户名存在，并去查询数据库作密码比对
    const userPass = await User.findOne({
        username,
        password
    });

    // console.log(userPass);
    if(!userPass) {
        return ctx.body = {
            retult: false,
            errcode: 101,
            errmsg: "用户名或密码错误"
        }
    } else {
        return ctx.body = {
            retult: true,
            errcode: 110,
            errmsg: "登录成功"
        }
    }
})

module.exports = router;
```



4. `app.js`中定义koa服务器

```js
const Koa = require('koa');
const Router = require('koa-router');
const users = require('./routers/user');
const body = require('koa-bodyparser');
const error = require('./middleware/error');

const app = new Koa();
app.use(body());
app.use(error);

const router = new Router();
router.get('/', ctx => {
    ctx.body = '主页';
})

app.use(router.routes());

// 官方推荐，丰富响应头
app.use(users.routes(), users.allowedMethods());
app.listen(3000, () => {
    console.log('http://localhost:3000');
});
```



## 五、本项目中的一些过程图片



![](https://github.com/zockbell/node_mongodb/blob/master/src/assets/images/1.png)



![](https://github.com/zockbell/node_mongodb/blob/master/src/assets/images/2.png)



![](https://github.com/zockbell/node_mongodb/blob/master/src/assets/images/3.png)



![](https://github.com/zockbell/node_mongodb/blob/master/src/assets/images/4.png)



![](https://github.com/zockbell/node_mongodb/blob/master/src/assets/images/5.png)
