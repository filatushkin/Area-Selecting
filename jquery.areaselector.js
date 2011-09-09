/**
* 
* Area Mouse Move Selector
* @autor Vitaly Filatushkin
* 
*
* Simple selection function like in Windows 
*/

jQuery.fn.areaSelecting = function(options)
{
    //plugin options
    var options = jQuery.extend({
		//public
        items      	    : '.control',
        select          : select,
        unselect        : unselect,
        keyCode         : 18, //shift : 16, ctrl : 17, alt : 18
        useKey          : false,
		//protected
        areaId          : 'mms_item_selector',
        areaClass       : 'mms-item-selector',
        uiClass         : 'ui-widget-overlay',
        selectedClass   : 'selected-item',
        x0              : 0,
        y0              : 0
    },options);
    
    //plagin variables
    var px = 'px';
    var mouseDown = false;
    var $selector = null;
    var kDown = null;
    
    //use keyboard
    if(options.useKey) {
        $(document).keydown(function(e){
            if (e.keyCode == options.keyCode) kDown = true; 
        }).keyup(function(e){
            if (e.keyCode == options.keyCode) kDown = false; 
        });   
    }else {
		kDown = true;
	}
    
    //mouse handling functions
    function mouseDownHandler(e) {
       //check key
       if(!kDown) return;
       //create selector
       var $area = $('<div/>', {'id':options.areaId,'class':options.areaClass+' '+options.uiClass});
       $('body').append($area);
       
       //save
       $selector = $('#'+options.areaId);
       //fix chrome
       $selector.mouseup(mouseUpHandler);
       $selector.mousemove(mouseMoveHandler);
       var x0 = e.pageX;
       var y0 = e.pageY;
       //set position, width, height
       $selector.css({top:y0+px,left:x0+px,width:0+px,height:0+px});
       options.x0 = x0;
       options.y0 = y0;
       mouseDown = true;
	   $('body *').disableUserSelect();
    }

    function mouseMoveHandler(e) 
    {
       //check key
       if(!kDown || !mouseDown) return;
       //check selector
       if($selector == null) return;
       if($selector && $selector.length < 1) return;
       //Resize
       //get start point
       var x0 = options.x0;
       var y0 = options.y0;
       //get current point
       var y1 = e.pageY;
       var x1 = e.pageX;
       //calculate width, height
       var h  = y1 - y0;  
       var w  = x1 - x0;
       
       $selector.css({
               height:Math.abs(h)+px,
               width:Math.abs(w)+px
           })
       //check is (+) or (-)
       // | I  | II  |
       // -----------
       // | IV | III |
       // (I)
       if(w<0 && h<0) {
           $selector.css({top : y1 + px,left : x1 + px});
           
               //select items
           jQuery(options.items).each(function(key,item)
           {
               var x = $(this).offset().left;
               var y = $(this).offset().top;
               //select control if we on it
               (y>=y1 && y<=y0 && x>=x1 && x<=x0) ? options.select(this) : null;  
               //unselect if we goin back
               (y<y1 || x<x1) ? options.unselect(this) : null; 
                
           })
       // (IV)
       }else if(w<0 && h>=0){
           $selector.css({top : y0 + px,left : x1 + px});
                          //select items
           jQuery(options.items).each(function(key,item)
           {
               var x = $(this).offset().left;
               var y = $(this).offset().top;
               //select control if we on it
               (y<=y1 && y>y0 && x>=x1 && x<=x0) ? options.select(this) : null;
               //unselect if we goin back
               (y<y0 || x<x1) ? options.unselect(this) : null; 

           })
       // (II)    
       } else if(h<0 && w>=0){
           $selector.css({top : y1 + px,left : x0 + px})
           //select items
           jQuery(options.items).each(function(key,item)
           {
               var x = $(this).offset().left;
               var y = $(this).offset().top;
               //select control if we on it
               (y>=y1 && y<y0 && x<x1 && x>=x0) ? options.select(this) : null;  
               //unselect if we goin back
               (y<y1 || x<x0) ? options.unselect(this) : null; 
           })
       }
       // (III) 
       else{
           $selector.css({top:y0+px,left:x0+px});
           
               //select items
           jQuery(options.items).each(function(key,item)
           {
               var x = $(this).offset().left;
               var y = $(this).offset().top;
               //select control if we on it
               (y>=y0 && y<=y1 && x>=x0 && x<=x1) ? options.select(this) : null;  
               //unselect if we goin back
               (y>y1 || x>x1) ? options.unselect(this) : null; 

           })
       } 
    }

    function mouseUpHandler(e) 
    {
       if(!$selector) return;
       //remove
       $selector.remove();
       mouseDown = false;
	   $('body *').enableUserSelect();
    }
    
    function select(obj)
    {
        $(obj).addClass(options.selectedClass);
    }

    function unselect(obj)
    {
        $(obj).removeClass(options.selectedClass);
    }  
    
	$(document).mouseup(mouseUpHandler);
	
    //return jquery object
    return jQuery(this).each(function(){   
        $(this).mousedown(mouseDownHandler);
        $(this).mousemove(mouseMoveHandler);
    })
}

jQuery.fn.extend({
    disableUserSelect : function() {
            this.each(function() {
                    this.onselectstart = function() { return false; };
                    this.unselectable = "on";
                    jQuery(this).css('-moz-user-select', 'none');
                    jQuery(this).css('-webkit-user-select', 'none');
                    jQuery(this).css('user-select', 'none');
            });
    },
    enableUserSelect : function() {
            this.each(function() {
                    this.onselectstart = function() {};
                    this.unselectable = "off";
                    jQuery(this).css('-moz-user-select', 'auto');
                    jQuery(this).css('-webkit-user-select', 'auto');
                    jQuery(this).css('user-select', 'auto');
            });
    }
});