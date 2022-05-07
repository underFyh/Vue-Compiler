const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/  // 结束标签必须是 />来结束
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)


function parseHtmlToAst(html) {
    let text;

    // 拼接树需要的参数
    let root,
        currentParent,
        stack = [];

    // 函数主逻辑 - 一定是html没有截取完的时候一直循环处理
    while (html) {
        // 尝试找这个开始标签
        let textEnd = html.indexOf('<');

        // 开始标签处理事情
        if(textEnd === 0) {
            // 交付给parseStartTag开始解析并且返回一个match对象记录AST数据
            const startTagMatch = parseStartTag();

            if(startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs);
                continue; // 后面不走重新循环
            }

            // 匹配结束标签后的处理
            const endTagMatch = html.match(endTag);
            if (endTagMatch) {
                advance(endTagMatch[0].length);
                end(endTagMatch[1]);
                continue;
            }
        }

        // < 不是字符串的第一个标签的情况
        if(textEnd > 0) {
            text = html.substring(0, textEnd);
        }

        if (text) {
            advance(text.length);
            chars(text);
        }
    }




    function parseStartTag() {
        // 匹配 <div
        const start = html.match(startTagOpen);

        // 是否是结束或者匹配到attr没有
        let end,
            attr;

        // 先匹配标签 然后匹配属性 然后匹配开始标签的结束标签
        if (start) {
            const match = {
                tagName: start[1],
                attrs: [], // 属性还没有处理
            }
            advance(start[0].length); // 删除匹配出来的

            // 没有匹配到结束标签但是匹配到了额属性
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute)) ) {
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5], // id=app id='app' id="app" 几个情况
                })
                //   id='app' style="color: red;"> 删除包含空格的地方 id='app'
                advance(attr[0].length);
            }

            // 如果匹配到了结束标签  <div id='app' style: "color: red"> 这里只是开始标签的结束标签,并非结束标签
            if(end) { // 这里的end在上面的while判断中已经赋值了
                advance(end[0].length);
                return match;
            }
        }
    }

    function start(tagName, attrs) {
        console.log('开始', tagName);
        const element = createASTElement(tagName, attrs);
        // 如果root没有值并且匹配到了第一个标签则将root赋值为第一个创建的AST对象树
        if(!root) {
            root = element;
        }

        currentParent = element;
        stack.push(element);


    }


    function end(tagName) {
        console.log('结束', tagName);
        // 第一次触发时候 走到了 </span> 这里 stack = [div, span]
        // 通过下面的方式将span的父级设置为了div
        const element = stack.pop();
       currentParent = stack[stack.length - 1];
       if (currentParent) {
           element.parent = currentParent;
           currentParent.children.push(element);
       }
    }

    function chars(text) {
        console.log('文本', text);
       text = text.trim();
       if (text.length > 0) {
           currentParent.children.push({
               type: 3,
               text
           })
       }
    }

    // 创建元素节点
    function createASTElement(tagName, attrs) {
        return {
            tag: tagName,
            type: 1, // 创建元素节点(主要处理元素)
            attrs,
            children: [],
        }
    }

    // 截取模板字符串
    function advance(n) {
        html = html.substring(n);
    }

    console.log(root, 'ast');
    return root;

}







export function compileToRenderFunction(template) {
    parseHtmlToAst(template);
    return template;
}


export {
    parseHtmlToAst
}
