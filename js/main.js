/**
 * Created by ghassaei on 11/3/16.
 */


$(function() {

     $("#logo").mouseenter(function(){
        $("#activeLogo").show();
        $("#inactiveLogo").hide();
    });
    $("#logo").mouseleave(function(){
        $("#inactiveLogo").show();
        $("#activeLogo").hide();
    });

    var myEvent = window.attachEvent || window.addEventListener;
    var chkevent = window.attachEvent ? 'onbeforeunload' : 'beforeunload'; /// make IE7, IE8 compitable

    myEvent(chkevent, function(e) { // For >=IE7, Chrome, Firefox
        var confirmationMessage = 'Are you sure to leave the page?';  // a space
        (e || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
    });

    var three = initThreeView();

    scene = three.scene;

    var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        matchBrackets: true,
        mode:  "javascript"
    });

    $("#editor").keyup(function(e) {
        runCode();
    });
    $(window).bind('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.keyCode == 83) {
            e.preventDefault();
            var js = editor.getValue();
            var blob = new Blob([js], {type: "text/plain;charset=utf-8"});
            saveAs(blob, "MeshWriter.js");
        }
    });
    var $editor = $("#editor");

    var $error = $("#error");
    function runCode(){
        try{
            var js = editor.getValue();
            eval(js);
            scene.children = [];
            eval(js);
            three.renderer.render(scene, three.camera);
            $error.hide();
        } catch(err){
            var fileName = err.fileName;
            var lineNum = err.lineNumber;
            if (fileName === undefined){
                if (err.stack){
                    var stack = err.stack.split("\n");
                    if (stack.length > 1){
                        var data = stack[1];
                        var checkUserError = data.split("<anonymous>:");
                        if (checkUserError.length>1){
                            fileName = undefined;
                            lineNum = checkUserError[1].split(":")[0];
                        } else {
                            fileName = data.substr(4);
                            if (fileName.includes("/js/main.js")){
                                fileName = undefined;
                                lineNum = "unknown";
                            }
                        }
                    }
                }
            } else if (fileName.includes("/js/main.js")) fileName = undefined;
            if (fileName !== undefined) fileName = " " + fileName;
            else fileName = "";
            if (lineNum !== undefined) lineNum = "line " + lineNum;
            else lineNum = "";
            $error.html(err.name + ": " + err.message + "<br/><b>" + lineNum + fileName + "</b>");
            $error.show();
        }
    }
    runCode();

    $("#about").click(function(e){
        e.preventDefault();
        $("#aboutModal").modal('show');
    });

    $("#saveSTL").click(function(e){
        e.preventDefault();
        var stl = new THREE.STLExporter().parse(scene);
        if (!stl) return;
        var blob = new Blob([stl], {type: 'application/octet-binary'});
        saveAs(blob, "mesh.stl");
    });

    $("#saveOBJ").click(function(){
        var obj = new THREE.OBJExporter().parse(scene);
        var blob = new Blob([obj], {type: 'application/octet-binary'});
        saveAs(blob, "mesh.obj");
    });

    var dragging = false;
    $('#draggable').mousedown(function(e){
       e.preventDefault();
       dragging = true;
    });
    $(document).mouseup(function(e){
       dragging = false;
    });
    $(document).mousemove(function(e){
       if (dragging){
           var width = $("body").innerWidth()-e.pageX;
           if (width<10) width = 10;
           $editor.css({width:width});
       }
    });
});