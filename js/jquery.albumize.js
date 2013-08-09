
(function ($, document, window){

	win = $(window); doc = $(document);						

	// *******************************************************************************
				
	//start of Albumize object

	function Albumize(){
			
				var a_pane = $('#albumize-pane');
				var a_olay = $('#albumize-olay');
				var a_a_olay = $('#albumize-album-overlay');
				var a_win = $('#albumize-album-window');
				var a_button = $('#albumize-album-list-button');
				var i_win = $('#albumize-i-window');
				
				var dst = doc.scrollTop();
				var dsl = doc.scrollLeft();
			
				// *******************************************************************************
				
				//start of Album object
				
				var albums = []; //array of Album objects
				
				function Album(id, total_images, title, imgs){
					
					this.id = id; //album id 
					this.title = title; //title of the album
					this.total_images = total_images; //total images in this album
					
					this.image_loaded = []; //array of image loaded status
					this.images = []; //array of image objects
					
					this.thumbs_loaded = false; 
					this.thumb_strip = '';
					
					imgs.each(function(index, elem){
						$(this).attr({"data-albumize-image-id" : index, "data-albumize-album-id" : id});
					});
					
					for(var i = 0; i < total_images; i++){
						this.image_loaded[i] = false;
					}
					 	
				}
				
				function AP(){
				
					this.show_image = function(image_id, link){
					
						var doc_height = $(document).height();
						var doc_width = $(document).width();
		
						var win_height = $(window).height();
						var win_width = $(window).width();
					
						var pane_height = (doc_height/win_height)*100 + '%';
						var pane_width = (doc_width/win_width)*100 + '%';
						
						var x = this.images[image_id];
						
						if(!this.image_loaded[image_id]){
						
							console.log('image is freshly loaded');
							
							//this.image_loaded[image_id] = true;
							
							var _this = this;
						
							//image is loaded for first time
							
							//******************************
							
							var img_width, img_height;
							var ref_width = 682; var ref_height = 542;
						
							var img = new Image();
							img.src = link;
							img.onload = function(){
							
								if(this.width < 500){
									img_width = this.width;
								}else{
									img_width = 500;
								}
							
								if(img_height < 500){
									img_height = this.height;	
								}else{
									img_height = 500;
								}
							
								var i_width = (img_width/ref_width)*100;
								var i_height = (img_height/ref_height)*100;
							
								var i_top = (100 - i_height)/2;
								var i_left = (100 - i_width)/2;
							
								var jim = $(this);
								jim.css({"width" : i_width+"%", "height" : i_height+"%", "position" : "absolute", "top" : i_top+"%", "left" : i_left+"%"});
							
								//x = $(this);
								_this.images[image_id] = $(this);
								_this.image_loaded[image_id] = true;
							
								i_win.html(jim);
								
								dst = doc.scrollTop();
								dsl = doc.scrollLeft();
							
								a_olay.css({'width' : pane_width, 'height' : pane_height}).fadeIn('slow');
								a_pane.css({'top' : dst + 'px', 'left' : dsl + 'px'}).slideDown('slow');
								
								};
							
							//*******************************
						
						}else{
						
							console.log('showing cached copy');
							
							i_win.html(this.images[image_id]);
								
							dst = doc.scrollTop();
							dsl = doc.scrollLeft();
							
							a_olay.css({'width' : pane_width, 'height' : pane_height}).fadeIn('slow');
							a_pane.css({'top' : dst + 'px', 'left' : dsl + 'px'}).slideDown('slow');
							
						
						}
								
					};
					
					
				}
				
				Album.prototype = new AP();
				
				//end of Album object
				
				// ********************************************************************************
				
				this.show_albums = function(){
					dst = doc.scrollTop();
					dsl = doc.scrollLeft();
					a_olay.fadeIn('slow');
					a_pane.css({'top' : dst + 'px', 'left' : dsl + 'px'}).slideDown('slow');
					a_button.click();
				};
				
				this.methods = {
				
					init: function(total_albums, albumize){
						
						albumize.each(function(index, elem){
			
							$(this).attr("data-albumize-album-id", index);
							
							var title = $(this).attr("title");
							
							if(title == undefined)
								title = '';
							
							//console.log("title is :"+title);
				
							var album_id = index;
				
							var imgs = $(this).children('a');
							var total_images = imgs.length;
							
							//create album objects
							
							albums[index] = new Album(album_id, total_images, title, imgs);
				
						});
						
					},
				
					show : function(album_id, image_id, link){
						
						albums[album_id].show_image(image_id, link);	
						
					}//end of show
					
				}; //end of methods
	
			}
			
	//end of albumize object
			
	
	// *******************************************************************************
				
	
	var a; //our main albumize object

	//prepare the DOM and attach events for added DOM elements

	$(document).ready(function(){
	
		var doc_height = $(document).height();
		var doc_width = $(document).width();
		
		var win_height = $(window).height();
		var win_width = $(window).width();
		
		var pane_height = (doc_height/win_height)*100 + '%';
		var pane_width = (doc_width/win_width)*100 + '%';
		
		var dst = $(window).scrollTop();
		var dsl = $(window).scrollLeft();
		
		var body = $(document.body); 
		
		var b_width = body.width();
		var b_height = body.height();
		
		var albumize = $('.albumize');
		
		var total_albums = albumize.length;
		
	
		initDOM();
		
		processDOM();		
		
		function processDOM(){
		
			var a = $('#albumize-pane');
			var b = $('#albumize-olay');
			var c = $('#albumize-album-overlay');
			var d = $('#albumize-album-window');
			var e = $('#albumize-album-list-button');
		
			a = new Albumize();
			
			//define the albumize utility plugin
			
			$.albumize = function(){
			
					if(arguments.length == 0){
						a.show_albums();
					}else if(typeof arguments[0] === "string" && a.methods[arguments[0]]){
						var as = [];
							for(var i = 1, al = arguments.length; i < al; i++){
								as.push(arguments[i]);
							}
						a.methods[arguments[0]].apply(a, as);
					}
			
			
			};
		
			$.albumize('init', total_albums, albumize);
		}
		
		function initDOM(){
			
				var a_olay = $('<div></div>').addClass('albumize-overlay').attr('id', 'albumize-olay').css({'width' : pane_width, 'height' : pane_height});
				var a_pane = $('<div></div>').addClass('albumize-pane').attr('id', 'albumize-pane');
				var a_a_olay = $('<div><div id = "loading"></div></div>').addClass('albumize-album-overlay').attr('id', 'albumize-album-overlay');
				var a_header = $('<div></div>').addClass('albumize-header').attr('id', 'albumize-header');
				
				var a_close = $('<button>&times;</button>').addClass('albumize-close').attr('id', 'albumize-close');
				a_close.appendTo(a_header);
				
				var a_control = $('<div></div>').addClass('albumize-control-pane').attr('id', 'albumize-control-pane');
				
				//control elements
				var a_prev = $('<div></div>').addClass('albumize-prev inactive').attr('id', 'albumize-prev');
				var a_alist = $('<div></div>').addClass('albumize-album-list').attr('id', 'albumize-album-list-button');
				var a_next = $('<div></div>').addClass('albumize-next').attr('id', 'albumize-next');
				
				//albums list pane
				
				var a_album_pane = $('<div><div class = "albumize-modal-header" \
				id = "albumize-album-pane-header"><button class = "albumize-albums-close" \
				id = "albumize-album-window-close">&times;</button><h3>Albums</h3></div>\
				<div class = "albumize-modal-body" id = "albumize-album-pane-body"></div>\
				<div class = "albumize-modal-footer" id = "albumize-album-pane-footer">a footer</div>\
				</div>').addClass('albumize-album-window albumize-modal fade').attr('id', 'albumize-album-window');
				
				var a_thumb_div = $('<div>\
									<div class = "albumize-t-slider" id = "albumize-t-slider">\
										\
									</div>\
									<div class = "albumize-t-pane" id = "albumize-t-pane">\
										<div class = "albumize-t-header" id = "albumize-t-header"></div>\
										<div class = "albumize-t-body" id = "albumize-t-body"></div>\
									</div>\
								</div>').addClass('albumize-t-window').attr('id', 'albumize-t-window');
								
				var a_i_win = $('<div></div>').addClass('albumize-i-window').attr('id', 'albumize-i-window');
				
				//append the structures
				
				a_control.append(a_prev, a_alist, a_next);
				
				a_pane.append(a_header);
				a_pane.append(a_i_win);
				a_pane.append(a_control);
				a_pane.append(a_thumb_div);
				
				a_olay.appendTo(body);
				a_pane.appendTo(body);
				//a_a_olay.appendTo(a_pane);
				a_pane.append(a_a_olay);
				//a_album_pane.appendTo(a_pane);
				a_pane.append(a_album_pane);
				
				
				//temp
				
				var a_t_i = '<img class = "albumize-thumb" src = "sample/thumb-4.jpg"><img class = "albumize-thumb" src = "sample/thumb-1.jpg"><img class = "albumize-thumb" src = "sample/thumb-5.jpg"><img class = "albumize-thumb" src = "sample/thumb-2.jpg"><img class = "albumize-thumb" src = "sample/thumb-6.jpg"><img class = "albumize-thumb" src = "sample/thumb-3.jpg">';
				
				$('#albumize-t-body').append(a_t_i);
				
				//temp structure
				
				//init variables here 
				
				var album_body = $('#albumize-album-pane-body');
				
				var a_a_pane = $('#albumize-album-window');
				
				var a_w_close = $('#albumize-album-window-close');
				
				var aao = $('#albumize-album-overlay');
				
				var slider = $('#albumize-t-slider');
				var t_div = $('#albumize-t-window');
				
				var slider_open = true;
		
				//end of variable init
				
				//temp structure
				var album_info = $('<div></div>').addClass('albumize-album-info');
				album_body.append(album_info);
				album_body.append(album_info.clone());
				album_body.append(album_info.clone());
				album_body.append(album_info.clone());
				album_body.append(album_info.clone());
				//temp structure
				
				//add event listeners
				
				body.on('click', '#albumize-olay', function(){
					a_pane.slideUp('slow');
					a_olay.fadeOut('slow');
				});
				
				body.on('click', '#albumize-pane #albumize-close', function(){
					a_a_pane.hide();
					a_pane.slideUp('fast');
					a_olay.fadeOut('fast');
				});
				
				body.on('click', '#albumize-album-list-button', function(){
					a_album_pane.fadeIn().addClass('in');
					aao.fadeIn();
				});
				
				body.on('click', '#albumize-album-window-close', function(){
					a_album_pane.removeClass('in').fadeOut();
					aao.fadeOut();
				});
				
				body.on('click', '#albumize-t-slider', function(){
					
					slider_open = !slider_open;
					
						if(slider_open)
							slider.removeClass('out');
						else
							slider.addClass('out');
							
					t_div.toggleClass('t-hide');
					
				});
				
				body.on('click', '.albumize a', function(){
				
					var album_id = $(this).attr('data-albumize-album-id');
					var image_id = $(this).attr('data-albumize-image-id');
					var link = $(this).attr("href");
					
					
					$.albumize('show', album_id, image_id, link);
					
					return false;
				});
				
				
			
		}
	
	}); // end of document ready


})(jQuery, document, window);






