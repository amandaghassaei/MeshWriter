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

    var three = initThreeView();

    scene = three.scene;

    var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        matchBrackets: true,
        mode:  "javascript"
    });

    $( "body" ).keyup(function() {
      runCode();
    });

    function runCode(){
        try{
            var js = editor.getValue();
            eval(js);
            scene.children = [];
            eval(js);
            three.renderer.render(scene, three.camera);
        } catch(err){
            console.log(err);
        }
    }
    runCode();

    $("#saveSTL").click(function(e){
        e.preventDefault();

        var data = [];
        _.each(scene.children, function(child){
            if (!child.geometry) return;
            if (child.type !== "Mesh") return;
            var geo = child.geometry.clone();
            geo.applyMatrix(new THREE.Matrix4().makeScale(child.scale.x, child.scale.y, child.scale.z));
            geo.applyMatrix(new THREE.Matrix4().makeRotationFromQuaternion(child.quaternion));
            geo.applyMatrix(new THREE.Matrix4().makeTranslation(child.position.x, child.position.y, child.position.z));
            data.push({geo: geo, offset:new THREE.Vector3(0,0,0), orientation:new THREE.Quaternion(0,0,0,1)});
        });

        var stlBin = geometryToSTLBin(data);
        if (!stlBin) return;
        var blob = new Blob([stlBin], {type: 'application/octet-binary'});
        saveAs(blob, "mesh.stl");
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
           $("#editor").css({width:$("body").innerWidth()-e.pageX});
       }
    });
});