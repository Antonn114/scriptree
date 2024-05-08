$(function(){
  $('#treeview-add-child-text').hide();

  var relationshipValue, anyValue;

  var datasource = {
    'id': 'root',
    'title': 'New Tree',
    'relationship': '001',
    'children': []
  };
  var nodeTemplate = function(data) {
    return `
<div class="title"></div>
<div class="content">${data.title}</div>
`;
  };

  var getId = function() {
    return (new Date().getTime()) * 1000 + Math.floor(Math.random() * 1001);
  };

  var oc = $('#treeview-content').orgchart({
    'data' : datasource,
    'nodeContent': 'title',
    'nodeTemplate': nodeTemplate,
    'pan': true,
    'zoom': true
  });

  var $selectedNode;
  
  var $nodeAction_pending = false;


  $('.orgchart').addClass('noncollapsable'); // deactivate

  $('#treeview-reset').on('click', function(event){
    $('.orgchart').css('transform','');
  });

  oc.$chartContainer.on('touchmove', function(event) {
    event.preventDefault();
  }); 

  oc.$chartContainer.on('click', '.node', function() {
    $selectedNode = $(this);
  });

  oc.$chartContainer.on('click', '.orgchart', function(event) {
    if (!$(event.target).closest('.node').length) {
      $selectedNode = null;
    }
  });



  $('#treeview-delete-node').on('click', function() {
    var $node = $selectedNode;
    if (!$node) {
      alert("No node selected! Please try again.");
      return;
    } else if ($node[0] === $('.orgchart').find('.node:first')[0]) {
      if (!window.confirm('Are you sure you want to delete the whole tree?')) {
        return;
      }
    }
    oc.removeNodes($node);
    $selectedNode = null;
  });

  $('#treeview-new-tree').on('click', function() {
    oc = $('#treeview-content').orgchart({
      'data' : datasource,
      'nodeContent': 'title',
      'nodeTemplate': nodeTemplate,
      'pan': true,
      'zoom': true
    });

  });
  var $addChild_Text = null;
  var 
  $('#treeview-add-child').on('click', function() {
    var $node = $selectedNode;
    if (!$node) {
      alert("No node selected! Please try again.");
      return;
    }
    if ($nodeAction_pending){
      return;
    }
    $nodeAction_pending = true;
    $('#treeview-add-child-text').show();
  });
  $(document).on('keypress',function(e) {
    if(e.which == 13 && $addChild_pending) {
      var $node = $selectedNode;
      if (!$node) {
        alert("No node selected! Please try again.");
        return;
      }
      var $addChild_Text = null;
      if ($('#treeview-node-field').val()){
        $addChild_Text = $('#treeview-node-field').val();
      }else{
        alert("Input field is empty! Please try again.");
      }
      if (!$node.siblings('.nodes').length) {
        oc.addChildren($node, [{'title': $addChild_Text, 'relationship': '110', 'id': getId() }]);
        // Be careful! Orgchart doesn't sort a node's children.
        // If the intended array of children is something like [1, 2, 3, 4, 5]
        // Then Orgchart makes it [2, 1, 3, 4, 5]
        // I have already had various ideas to fix this, but since this is a prototype,
        // My attention lies elsewhere!
      }else{
        oc.addSiblings($node.siblings('.nodes').find('.node:first'), [{ 'title': $addChild_Text, 'relationship': '110', 'id': getId() }]);
      }
      $('#treeview-node-field').val("");
      $('#treeview-node-field').hide();

      $addChild_pending = false;
    }
    return;
  });
});

