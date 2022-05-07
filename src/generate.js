const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

function generate(el) {
    let children = geChildren(el);
    let code = `_c('${el.tag}', ${el.attrs.length > 0 ? `${formatProps(el.attrs)}`: 'undefined'}${children ? `,${children}`: ''})`;
    console.log(code, 'code');
    return code;
}

function formatProps(attrs) {
    let attrStr = '';
    for (var i = 0; i < attrs.length; i++) {
        let attr = attrs[i];
        if (attr.name === 'style') {
            let styleAttrs = {};
            attr.value.split(';').map((styleAttr) => {
                let [key, value] = styleAttr.split(':');
                // 解决属性间的间隔情况
                styleAttrs[key.trim()] = value.trim();
            });
            attr.value = styleAttrs;
        }
        attrStr += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    // 删除最后一个,
    return `{${attrStr.slice(0, -1)}}`
}

function geChildren(el) {
    const children = el.children;
    if (children.length) {
        return children.map(c => generateChild(c)).join(',')
    }
}


// 主要处理文本节点
function generateChild(node) {
    if (node.type === 1) {
        return generate(node);
    } else if(node.type === 3) {
        let text = node.text;
        // 没有{{}}情况最简单
        if (!defaultTagRE.test(text)) {
            return `_v(${JSON.stringify(text)})`
        }

        let match,
            index,
            lastIndex = defaultTagRE.lastIndex = 0,
            textArr = [];

        while (match = defaultTagRE.exec(text)) {
            index = match.index;
            if (index > lastIndex) {
                textArr.push(JSON.stringify(text.slice(lastIndex, index)))
            }
            textArr.push(`_s(${match[1].trim()})`);
            lastIndex = index + match[0].length;
        }

        if (lastIndex < text.length) {
            textArr.push(JSON.stringify(text.slice(lastIndex)));
        }

        return `_v(${textArr.join('+')})`
    }
}


export {
    generate
}
