$(function(){
  ptGame.init();
})

var ptGame = {
    num: 4,
    lst: null,
    //gird: null,
    time: 40,
    st: 0,
    arrs:['a','b','c','d','e','f','g','h','i'],
    mod: [1,2,3,4,5,6,7,8,9],
    init: function(){
         $('.msk,.page,.selMod,.wrap').css({ width:$(document).width(),height:$(document).height() });

        //load
        $('.wrap').imagesLoaded( function(){
            console.log("图片加载完成");
            $(".load").css({ display: 'none' });
        });

        this.selMod();

        $('.modBtn').click(function(){
            var Ths = ptGame;
            Ths.showGame();
            Ths.scGird(Ths.num);
            Ths.timeLine(Ths.st);
        })
    },
    selMod: function(){
        $('.modLst li').click(function(){
            if($(this).hasClass('on')){
               $(this).removeClass('on');
            }else{
                $(this).addClass('on').siblings('li').removeClass('on')
            }

            ptGame.num = $('.modLst li[class="on"]').index();
        })
    },
    showGame: function(){
        $('.selMod').hide();
        $('.wrap').show();
    },
    scGird: function(num){
        var ac = this.ranEle(this.mod);
        for(var i=0; i<9; i++){
            this.lst += '<img class="js-drag" id="drag'+ac[i]+'" src="images/pk/mode'+this.arrs[this.num]+'0'+ac[i]+'.png">';
        }
        $('.lstIn').html(this.lst);
    },
    timeLine: function(t){
        $('.time').text(t);

        var timer = setInterval(function(){
            /*if(t>0){
                t--;
                if(t<=5){
                    $('.time').css('color','red')
                }
            }else{
                clearInterval(timer);
            }*/
            t++;
            $('.time').text(t);
        },1000)
    },
    ranEle: function(array){
        for(var i=array.length; i>0;){
            var x = array[--i]
            var j = parseInt(Math.random()*i);

            array[i] = array[j];
            array[j] = x;
        }

        return array;
    }
    
}


;(function (interact) {
    'use strict';

    var transformProp;

    interact.maxInteractions(Infinity);

    // setup draggable elements.
    interact('.js-drag')
        .draggable({ 
			max: Infinity,
			inertia: true,
			
			// keep the element within the area of it's parent
			restrict: {
			  //restriction: "parent",
			  endOnly: true,
			  elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
			}
		})
        .on('dragstart', function (event) {
            event.interaction.x = 0;
            event.interaction.y = 0;

        })
        .on('dragmove', function (event) {
            event.interaction.x += event.dx;
            event.interaction.y += event.dy;

            if (transformProp) {
                event.target.style[transformProp] =
                    'translate(' + event.interaction.x + 'px, ' + event.interaction.y + 'px)';
            }
            else {
                event.target.style.left = event.interaction.x + 'px';
                event.target.style.top  = event.interaction.y + 'px';
            }
        })
        .on('dragend', function (event) {
            event.target.setAttribute('data-x', event.interaction.x);
            event.target.setAttribute('data-y', event.interaction.y);

            if($('.lstIn img').length==0){
                clearInterval(et);
            }            
        });


    //调用
    for(var i=1; i<10; i++){
        setupDropzone('#drop'+i, '#drag'+i);
    }



    /**
     * Setup a given element as a dropzone.
     *
     * @param {HTMLElement|String} el
     * @param {String} accept
     */
	 var isderg=false;
    function setupDropzone(el, accept) {
        interact(el)
            .dropzone({
                accept: accept,
				overlap: 0.75,
                ondropactivate: function (event) {
                    addClass(event.relatedTarget, '-drop-possible');
                    event.target.classList.add('drop-active');
                },
                ondropdeactivate: function (event) {
					if(isderg){
                        removeClass(event.relatedTarget, '-drop-possible');
					 }else{
						//此处执行拖动时选择错误事件
                        //alert('a')
                        //console.log(event.relatedTarget)
                        event.relatedTarget.style.top = '0';
                        event.relatedTarget.style.left = '0';

                        console.log(event.relatedTarget.id)
                        console.log(event.relatedTarget.getAttribute('data-x'))
                        console.info(event.interaction.x)

					 }
					
					 isderg=false;
                },
				ondrop: function (event) {
                  // 拖动移动正确格子时提示 alert(0);   	
                    isderg=true;
                    var a= event.relatedTarget;
                    event.target.innerHTML= '<img class="addImg" id="a'+event.relatedTarget.id+'" src="'+a.src+'" alt="" />';
                    event.relatedTarget.parentNode.removeChild(event.relatedTarget);
                },
				ondragenter: function (event) {
                   // 拖动移动正确格子边缘时提示 
                   //alert(1);   
                },
				ondragleave: function (event) {
                   // 拖动移动正确格子边缘时然后离开时提示 
                   //alert(2); 
					 	
                },
				ondropmove: function (event) {
                   // 拖动到正确格子边缘时然后时提示  
                  // alert(3); 
				  
                }
		    
            })
            .on('dropactivate', function (event) {
                var active = event.target.getAttribute('active')|0;

                // change style if it was previously not active
                if (active === 0) {
                    addClass(event.target, '-drop-possible');
                    //event.target.textContent = 'Drop me here!';
                }

                event.target.setAttribute('active', active + 1);
            })
            .on('dropdeactivate', function (event) {
                var active = event.target.getAttribute('active')|0;

                // change style if it was previously active
                // but will no longer be active
                if (active === 1) {
                    removeClass(event.target, '-drop-possible');
                    //event.target.textContent = 'Dropzone';
                }

                event.target.setAttribute('active', active - 1);
				
				//event.target.id
				
				
				
            })
            .on('dragenter', function (event) {
                addClass(event.target, '-drop-over');
                event.relatedTarget.textContent = 'I\'m in';
            })
            .on('dragleave', function (event) {
                removeClass(event.target, '-drop-over');
                event.relatedTarget.textContent = 'Drag me…';
            })
            .on('drop', function (event) {
                removeClass(event.target, '-drop-over');
                event.relatedTarget.textContent = 'Dropped';
				//console.log(event.target.offsetTop+','+event.target.offsetWidth)
                console.log(event.target)
            });
    }

    function addClass (element, className) {
        if (element.classList) {
            return element.classList.add(className);
        }
        else {
            element.className += ' ' + className;
        }
    }

    function removeClass (element, className) {
        if (element.classList) {
            return element.classList.remove(className);
        }
        else {
            element.className = element.className.replace(new RegExp(className + ' *', 'g'), '');
        }
    }

    interact(document).on('ready', function () {
        transformProp = 'transform' in document.body.style
            ? 'transform': 'webkitTransform' in document.body.style
            ? 'webkitTransform': 'mozTransform' in document.body.style
            ? 'mozTransform': 'oTransform' in document.body.style
            ? 'oTransform': 'msTransform' in document.body.style
            ? 'msTransform': null;
    });

}(window.interact));


