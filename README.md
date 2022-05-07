### 目的:
通过小的案例来实现一下Vue如何分析模板字符串转化为真实dom的过程;


### 过程:
1. 获取模板字符串
2. 分析模板字符串转化为AST树 (所用到的正则是犹大那里直接复制的)
3. AST树转化为生成虚拟dom的render函数
4. render函数执行返回虚拟dom
5. 通过patch函数将虚拟dom转化为真实dom


