[TOC]

# LineEditor
一个简易的web文本编辑器，可以显示每行的行数，兼容ie9+，以及现代浏览器

## Features
1. 支持行号显示

2. 编辑器复制粘贴内容不会混乱

3. 支持多个编辑器共存

## Using
>引用 ***lineEditor.css***、***jquery.js***、***lineEditor.js*** 即可生成一个编辑器。

```html
<!DOCTYPE html>
<html lang="zh-cn">
	<head>
		<meta charset="utf-8" />
		<title>编辑器</title>
		<link rel="stylesheet" type="text/css" href="lineEditor.css">
		<style type="text/css">
			.title{
			color: gray;
			text-align: center;
			}
			.ed{
			width: 40%;
			float: left;
			margin:0 4%;
			}
		</style>
	</head>
	<body>
		<h1 class="title">lineEditor</h1>
		<div id="easyCon" class="ed">
		</div>
		<div id="easyCon2" class="ed">
		</div>
		<script src="jquery.min.js"></script>		
		<script type="text/javascript" src="lineEditor.js"></script>
		<script type="text/javascript">
			var editor = lineEditor("#easyCon");
			editor.init();
			var editor2 = lineEditor("#easyCon2");
			editor2.init();
		</script>
	</body>
</html>
```

## Api
* getText

	描述：获取编辑器的纯文本内容,行与行之间使用字符串'\n'分隔。

	使用方法：

	    var editor=lineEditor("#easyCon");
	    editor.init();

	    //调用getText方法
		var content=editor.getText();

* getHtml

	描述：获取编辑器的html文本,每行都使用<p class="lineContext"></p>

	使用方法：

	    var editor=lineEditor("#easyCon");
	    editor.init();

	    //调用getHtml方法
		var content=editor.getHtml();

	tips:p标签的类名一定有lineContext,但是不是只有lineContext这个类名


# [Demo](https://hlerenow.github.io/lineEditor/)
