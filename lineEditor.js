lineEditor=(function($){
        var _editorCount=0;
        var _nowEditor=-1;

        var lineEditor=function(obj){

            if(!$){
                throw Error("该插件需要jquery支持");
                return;
            }

            if(!(this instanceof lineEditor)){
                return new lineEditor(obj);
            }

            this.editorContainer=$(obj);

            this.id=_editorCount;
            _editorCount++;

            this.nowLine=0;

            this.domHtml=this.getDomTemplate();

        };

        lineEditor.prototype={
            maxLine:555,
            getDomTemplate:function(){
                return ''+
                        '      <div id="lineNumberCon_'+this.id+'" class="lineNumberCon">'+
                        '        <div id="lineNumber_'+this.id+'" class="lineNumber">1</div>'+
                        '      </div>'+
                        '      <div id="contextEassy_'+this.id+'" class="contextEassy">'+
                        '            <p class="lineContext">请输入内容...</p>'+
                        '      </div>';            
            },
            init:function(){
                if(!this.editorContainer){
                    throw Error("编辑器容器不存。");
                    return;
                }else{

                }

                $(this.editorContainer).addClass("easyCon");

                this.editorContainer.html(this.domHtml);

                this.bodyEvent();

                this.bodyEvent=function(){};

                this.windowResize();

                this.windowResize=function(){

                };

                this.bindEvent();

                $(this.editorContainer.find(".contextEassy")).attr("contenteditable","true");
            },
            bindEvent:function(){
                var self=this;
                //激活编辑器事件
                this.activeEditor();
                //窗口大小改变

                //阻止文本内容拖拽事件
                $(this.editorContainer).on("dragover",function(e){
                    // console.log("dragover");
                    e.preventDefault();
                    return false;
                });
                $(this.editorContainer).on("drop",function(e){
                    // console.log("drop");
                    e.preventDefault();
                    return false;
                });                

                // 浏览器粘贴事件
                $(this.editorContainer).on("paste",function(e){
                    // console.log("浏览器粘贴事件");
                    setTimeout(function(){
                        self.wrapLine(_nowEditor);
                        self.alignLine(_nowEditor);
                        self.alignHeight(_nowEditor);                                
                    });
                });

                //按键事件
                $(this.editorContainer).keydown(function(e) {

                    if(_nowEditor===-1){
                        return ;
                    }
                    // console.log(e.keyCode);
                    // 屏蔽delte键
                    if(e.keyCode===46){
                        e.preventDefault();
                        return false;
                    }
                    //确保页面不会乱
                    var arryCoedCal=[33,34,35,36,37,38,39,40];
                    if(arryCoedCal.indexOf(e.keyCode)===-1){
                       self.reDrawAll();
                    };
                    

                    var nowLineNumber=self.getNowLine();

                    // 回车键
                    if (e.keyCode == 13) {
                        var lines = $("#contextEassy_"+_nowEditor+" .lineContext");

                        var lineNumers = $("#lineNumberCon_"+_nowEditor+" .lineNumber");

                        // if (lines.length < self.maxLine) {

                            // $("#lineNumberCon_"+_nowEditor).append("<div class=\"lineNumber\" >" + (lineNumers.length + 1) + "</div>");

                            nowLineNumber++;

                            setTimeout(function(){
                                self.wrapLine(_nowEditor,3);
                            });

                        // } else {
                        //     //达到最大行数              
                        //     e.preventDefault();
                        //     return false;
                        // }
                    }

                    // 删除键
                    if (e.keyCode == 8) {
                        // console.log(_nowEditor);

                        var lines = $("#contextEassy_"+_nowEditor+" .lineContext");
                        var lineNumers = $("#lineNumberCon_"+_nowEditor+" .lineNumber");
                        var nowLineText = lines[nowLineNumber].textContent || lines[nowLineNumber].innerText;
                        var pointerPos = window.getSelection().anchorOffset;

                        //如果是第一行并且内容为空，拒绝删除
                        // console.log("当前行数: "+nowLineNumber);
                        if (nowLineNumber === 0 && (pointerPos === 0 || (pointerPos === 1 && $.trim(nowLineText) == ""))) {
                            // console.log("如果是第一行并且内容为空，拒绝删除");
                            e.preventDefault();
                            return false;

                        }

                        //如果光标在一行的首部
                        if (pointerPos === 0 || (pointerPos === 1 && $.trim(nowLineText) == "")) {
                            // console.log("//如果光标在一行的首部");
                            $(lineNumers[lineNumers.length - 1]).remove();
                            nowLineNumber--;
                            return;
                        }
                    }
                });            
            },
            activeEditor:function(){
                var self=this;
                $(this.editorContainer).on("click", function(e) {
                    // 阻止冒泡
                    if (e.stopPropagation) {
                        e.stopPropagation();
                    } else {
                        e.cancelBubble = true;
                    }
                    _nowEditor = self.id;
                    // console.log("当前编辑器："+_nowEditor);               
                });            
            },
            closeEditor:function(){
                _nowEditor=-1;
            },
            bodyEvent:function(){
                $(document.body).on("click", function(e) {
                    _nowEditor = -1;
                    // console.log("当前编辑器："+_nowEditor);                    

                    // alert(editorState);
                });            
            },
            getNowLine: function() {

                var selectionNode = window.getSelection().anchorNode;
                var nowLineNumber = 0;
                var temp=0;

                if($("#contextEassy_"+_nowEditor+" .lineContext").length==0){
                    $("#contextEassy_"+_nowEditor).append("<p class=\"lineContext\"><br></p>");
                }else{
                    try{                        
                        while (!(selectionNode.nodeType === 1&&selectionNode.nodeName.toLowerCase()=="p")) {
                            selectionNode = $(selectionNode).parent()[0];
                        }    
                        temp = $("#contextEassy_"+_nowEditor+" .lineContext").index(selectionNode);                                    
                    } catch(e){

                    }
                }


                // console.log("当前选中的 元素",selectionNode);



                // console.log(temp);
                if (temp >= 0) {
                    nowLineNumber = temp;
                }

                return nowLineNumber;
            },
            getNowEditor:function(){
                var node=this.getNowLine();

                var tid=$($("#contextEassy_"+_nowEditor+" .lineContext")[node]).parent()[0].id;
                // console.log(tid);
                _nowEditor=parseInt(tid.split("_")[1]);

            },
            alignHeight:function(eid,offset){
                // console.log(eid);

                // if(_nowEditor==-1){
                //     return;
                // }                
                //对齐行高
                // console.log("对齐行高");
                lines = $("#contextEassy_"+eid+" .lineContext");
                lineNumers = $("#lineNumberCon_"+eid+" .lineNumber");    

                var nowLineNumber=this.getNowLine();
                var allLines=lines.length;  

                if(offset){
                   allLines=nowLineNumber+parseInt(offset);
                }
     
                for(var i=nowLineNumber;i<allLines;i++){
                    // console.log()
                    if($(lineNumers[i]).height()!=$(lines[i]).height()){
                        $(lineNumers[i]).css("height",$(lines[i]).height());                    
                    }
                }
                //为了解决fox,ie9偶尔顶部会有空节点
                var cnode = document.getElementById("contextEassy_"+eid).childNodes;
                // console.log(document.getElementById("contextEassy_"+_nowEditor));
                for(var i=nowLineNumber;i<5;i++){
                    if (cnode[i]&&cnode[i].nodeType == 3&&$.trim(cnode[i].textContent)=="") {
                        $(cnode[i]).remove();
                    }                    
                }
            },
            alignLine:function(eid,offset){
                // console.log("对齐一次哈");
                // console.log(_nowEditor);
                // if(_nowEditor==-1){
                //     return;
                // }

                var lines = $("#contextEassy_"+eid+" .lineContext");
                var lineNumers = $("#lineNumberCon_"+eid+" .lineNumber");        


                //对齐行号
                //
                var htmlFragment=document.createDocumentFragment();

                if(lines.length!=lineNumers.length){
                    // console.log("需要对齐")
                    if(lines.length>lineNumers.length){
                        for(var i=lineNumers.length;i<lines.length;i++){
                            var tdiv=document.createElement("div");
                            tdiv.className="lineNumber";
                            tdiv.textContent=(i+1);

                            htmlFragment.appendChild(tdiv);
                        }

                        $("#lineNumberCon_"+eid).append(htmlFragment);

                        return;
                    }

                    if(lines.length<lineNumers.length){
                        for(var i=lineNumers.length;i>lines.length;i--){
                            $(lineNumers[i-1]).remove();
                        }

                        return;
                    }

                }           
            },
            getText:function(){
                var lines=this.editorContainer.find(".lineContext");
                var text="";
                for(var i=0;i<lines.length;i++){
                    text+=$(lines[i]).text()+"\n";
                }

                return text;
                // console.log($(this.editorContainer.find(".contextEassy")[0]).text());
            },
            getHtml:function(){
                return $(this.editorContainer.find(".contextEassy")[0]).html();
            },
            wrapLine:function(){
                var cnode = document.getElementById("contextEassy_"+_nowEditor).childNodes;
                // console.log("包裹行");
                var nleng=cnode.length;
                var nowLineNumber=this.getNowLine();
                for (var i = nowLineNumber; i < nleng; i++) {

                    // console.log("\n");                    
                    // console.log("第几个节点"+i);
                    // console.log(cnode[i].nodeType);
                    // console.log(cnode[i].nodeName);
                    // console.log(cnode[i]);
                    // console.log("\n");


                    if (cnode[i].nodeType === 3 && cnode[i].textContent && $.trim(cnode[i].textContent)) {
                        // console.log("包裹元素"+i);
                        $(cnode[i]).wrap("<p class=\"lineContext\"/>");
                        continue;
                    } 

                    if(cnode[i].nodeType === 3 &&  $.trim(cnode[i].textContent)=="")
                    {
                        $(cnode[i]).remove();
                        i--;
                        nleng--;
                        continue;
                    }

                    // console.log(cnode[i],cnode[i].nodeType ===1&&cnode[i].nodeName.toLowerCase()!="p");
                    // console.log(" ");

                    if(cnode[i].nodeType ===1&&cnode[i].nodeName.toLowerCase()!="p")
                     {
                            // console.log("包裹不合法的标签1");
                            $(cnode[i]).replaceWith("<p class=\"lineContext\">"+$(cnode[i]).text()+"</p>");
                            continue;
                    }

                    if(cnode[i].nodeType ===1&&cnode[i].nodeName.toLowerCase()=="p"&&!$(cnode[i]).hasClass("lineContext"))
                     {
                            // console.log("包裹不合法的标签2");
                            $(cnode[i]).addClass("lineContext");
                            continue;
                    }                    
                }                
            },
            windowResize:function(){
                var self=this;
                $(window).on("resize",function(){
                    // console.log("窗口改变");
                        for(var i=0;i<_editorCount;i++){
                            // console.log("改变的编辑器"+i);
                            self.alignLine(i);
                            self.alignHeight(i);
                        }
                });             
            },
            reDrawAll:function(){
                var self=this;
                setTimeout(function(){
                    self.alignLine(_nowEditor);
                    self.alignHeight(_nowEditor);
                    self.getNowEditor(_nowEditor);
                });                  
            }
        }

        return lineEditor;
    })($);