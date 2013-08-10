
(function ($, document, window){

	win = $(window); doc = $(document);						

	// *******************************************************************************
				
	//start of Albumize object

	function Albumize(){
			
				var a_pane = $('#albumize-pane');
				var a_olay = $('#albumize-olay');
				var a_a_olay = $('#albumize-album-overlay');
				var a_win = $('#albumize-album-window');
				var a_win_close = $('#albumize-album-window-close');
				var a_button = $('#albumize-album-list-button');
				var i_win = $('#albumize-i-window');
				var loading = $('#albumize-loading');
				var load_error = $('#albumize-loading-error');
				
				var prev_image = $('#albumize-prev');
				var next_image = $('#albumize-next');
				
				var album_pane = $('#albumize-album-pane-body');
				var a_t_pane = $('#albumize-t-pane');
				
				var doc_height = $(document).height();
				var doc_width = $(document).width();
		
				var win_height = $(window).height();
				var win_width = $(window).width();
					
				var pane_height = (doc_height/win_height)*100 + '%';
				var pane_width = (doc_width/win_width)*100 + '%';
				
				var dst = doc.scrollTop();
				var dsl = doc.scrollLeft();
				
				this.current_album = 0; //keeps track of current album
			
				// *******************************************************************************
				
				//start of Album object
				
				var albums = []; //array of Album objects
				
				function Album(id, total_images, title, imgs){
					
					this.id = id; //album id 
					this.title = title; //title of the album
					this.total_images = total_images; //total images in this album
					
					this.current_image = 0; //keeps track of current image
					
					this.image_loaded = []; //array of image loaded status
					this.images = []; //array of image objects
					this.image_links = [];
					
					this.thumbs_loaded = false; 
					this.thumb_strip = $('<div></div>');
					this.thumb_loaded = [];
					this.thumbs_src = [];
					
					var covers = [];
					
					var _this = this;
					
					imgs.each(function(index, elem){
					
						$(this).attr({"data-albumize-image-id" : index, "data-albumize-album-id" : id});
						_this.image_links.push($(this).attr("href"));
						
						var im = $(this).children('img');
						
						_this.thumbs_src.push(im.attr("src"));
						
						if(im.attr("class") == 'albumize-cover'){
							covers.push(im.attr("src"));	
						}
						
					});
					
					for(var i = 0; i < total_images; i++){
						this.image_loaded[i] = false;
					}
					
					//construct album list
					
					var ainfo = $('<div></div>').addClass("albumize-album-info").attr("data-albumize-album-id" , id);
					
					var cinfo = $('<div></div>').addClass("albumize-album-cover-info");
					
					var cimg = $('<img></img>').attr({"class" : "albumize-album-cover-img", "src" : covers[0]});
					
					var ctitle = $('<div></div>').addClass("albumize-cover-title").text(title);
					var t = (total_images > 1) ? "images" : "image";
					var ccount = $('<div></div>').addClass("albumize-cover-count").text(total_images + " " + t);
					
					cinfo.append(ctitle, ccount);
					
					ainfo.append(cinfo);
					
					cimg.load(function(){
						ainfo.append(cimg);
					});
					
					
					album_pane.append(ainfo);
					 	
				}
				
				function AP(){
				
					this.handle_nav = function(image_id){
					
						next_image.removeClass('albumize-inactive');
						prev_image.removeClass('albumize-inactive');
					
						if(image_id == (this.total_images-1) || image_id == 0){
						
							if(image_id == (this.total_images-1)){
								next_image.addClass('albumize-inactive');
							}
						
							if(image_id == 0){
								prev_image.addClass('albumize-inactive');
							}
							
							if(image_id == (this.total_images-1) && image_id == 0){
								next_image.addClass('albumize-inactive');
								prev_image.addClass('albumize-inactive');
							}
						
						}
					
					};
				
					this.prev = function(){
						
						if(this.current_image > 0){
							
							var now = parseInt(this.current_image) - 1;
							console.log('now is '+now);
							this.show_image(now, this.image_links[now]);

						}
						
					};
					
					this.next = function(){
					
						if(this.current_image < (this.total_images-1)){
						
							var now = parseInt(this.current_image) + 1;
							console.log('now is '+now);
							this.show_image(now, this.image_links[now]);
						
						}
					
					};
				
					this.get_image_link = function(image_id){
						return this.image_links[image_id];
					};
				
					this.show_image = function(image_id, link){
					
						doc_height = $(document).height();
						doc_width = $(document).width();
		
						win_height = $(window).height();
						win_width = $(window).width();
					
						pane_height = (doc_height/win_height)*100 + '%';
						pane_width = (doc_width/win_width)*100 + '%';
						
						//var x = this.images[image_id];
						
						if(!this.image_loaded[image_id]){
						
							console.log('image is freshly loaded');
							
							//show loading status
							
							loading.show();
							a_a_olay.show();
							
							
							//this.image_loaded[image_id] = true;
							
							var _this = this;
						
							//image is loaded for first time
							
							//******************************
							
							var img_width, img_height;
							var ref_width = 682; var ref_height = 542;
						
							var img = new Image();
							img.src = link;
							
							img.onerror = function(){
							
								i_win.html(''); 
								a_a_olay.stop().show();
								load_error.html('Error loading image . . . <span id = "albumize-error-dismiss">Dismiss</span>').show();
								loading.show();
								_this.current_image = image_id;
								_this.handle_nav(image_id);
								
							};
							
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
								_this.current_image = image_id;
								_this.handle_nav(image_id);
								
								if(!load_error.is(":visible")){
								
									load_error.hide();
									loading.hide();
									a_a_olay.hide();
								
								}
				
								i_win.hide().html(jim).fadeIn(1000);
								
								dst = doc.scrollTop();
								dsl = doc.scrollLeft();
							
								a_olay.css({'width' : pane_width, 'height' : pane_height}).fadeIn('slow');
								a_pane.css({'top' : dst + 'px', 'left' : dsl + 'px'}).slideDown('slow');
								
								};
							
							//*******************************
						
						}else{
						
							if(this.current_image != image_id){
								
								//a different image is requested
								
								console.log('showing cached copy');
							
								this.current_image = image_id;
								this.handle_nav(image_id);
								i_win.hide().html(this.images[image_id]).fadeIn(1000);
								
								dst = doc.scrollTop();
								dsl = doc.scrollLeft();
							
								a_olay.css({'width' : pane_width, 'height' : pane_height}).fadeIn('slow');
								a_pane.css({'top' : dst + 'px', 'left' : dsl + 'px'}).slideDown('slow');
								
							}else{
								console.log("same image is requested");
							}
						
						}
								
					};
					
					this.show = function(){
					
						if(!this.thumbs_loaded){
							//thumbnail strips are not loaded yet
							
							console.log("Album show request for "+this.id+"Thumbs loaded "+this.thumbs_loaded);
							
								a_a_olay.fadeIn();
								loading.show();
								a_win.removeClass('in').fadeOut();
								
								var loaded = 0;
								var error_images = 0;
								var tim = [];
								var _this = this;
							
								for(var i = 0; i < this.total_images; i++){
									//construct the thumbnail strip
									
									tim[i] = new Image();
									tim[i].src = this.thumbs_src[i];
									tim[i].setAttribute("data-albumize-album-id", this.id);
									tim[i].setAttribute("data-albumize-image-id", i);
									
									
									tim[i].onload = function(){
										
										this.className = "albumize-thumb";
										_this.thumb_strip.append(this);
										
										if(++loaded == _this.total_images){
											
											console.log("error images "+error_images);
											
											_this.thumb_strip = _this.thumb_strip.html();
											a_t_pane.html(_this.thumb_strip);
											
											if(error_images > 0 && error_images != _this.total_images){
													
													load_error.html('Error loading some thumbnails . . . <span id = "albumize-error-dismiss">Dismiss</span>').fadeIn();
													a_a_olay.delay('7000').fadeOut(function(){
													
														loading.hide();
														load_error.hide();
													
														_this.thumbs_loaded = true;
													
													});
												
												
											}else if(error_images == _this.total_images){
												load_error.html('Error loading images . . . <span id = "albumize-error-dismiss">Dismiss</span>').fadeIn();
												_this.thumbs_loaded = false;
												_this.thumb_strip = 0;
												_this.thumb_strip = $('<div></div>');
											}else if(error_images == 0){
												_this.thumbs_loaded = true;
												loading.hide();
												a_a_olay.fadeOut();
											}
											
											//show the first image
											_this.show_image(0, _this.image_links[0]);
											_this.current_image = 0;
												
											
										}
										
										
									};
									
									tim[i].onerror = function(){
										error_images++;
										this.style.display = "none"; 
										this.onload();
									};
										
								}
							
						}else{
							
							console.log('thumbs already loaded');	
							a_t_pane.html(this.thumb_strip);
							
							//show the first image
							this.show_image(0, this.image_links[0]);
							this.current_image = 0;
							
							a_win.removeClass('in').fadeOut();
							loading.hide();
							a_a_olay.fadeOut();
							
						}
					
					};
					
					
				}
				
				Album.prototype = new AP();
				
				//end of Album object
				
				// ********************************************************************************
				
				//initializes the album
				
				this.init = function(total_albums, albumize){
						
						albumize.each(function(index, elem){
			
							$(this).attr("data-albumize-album-id", index);
							
							var title = $(this).attr("title");
							
							if(title == undefined)
								title = '';
				
							var album_id = index;
				
							var imgs = $(this).children('a');
							var total_images = imgs.length;
							
							//create album objects
							
							albums[index] = new Album(album_id, total_images, title, imgs);
				
						});
						
				}
				
				//shows the particular image
				
				this.show = function(album_id, image_id, link){
						
					albums[album_id].show_image(image_id, link);	
						
				};
				
				//initializes the album and shows it
				this.show_album = function(album_id){
					
					this.current_album = album_id;
					albums[album_id].show();
					
				};
				
				//shows the image when the thumbnail is clicked
				
				this.show_image_from_thumb = function(album_id, image_id){
				
						var link = albums[album_id].get_image_link(image_id);
						albums[album_id].show_image(image_id, link);
						
				};
				
				//shows album window
				this.show_albums = function(){
				
					doc_height = $(document).height();
					doc_width = $(document).width();
		
					win_height = $(window).height();
					win_width = $(window).width();
					
					pane_height = (doc_height/win_height)*100 + '%';
					pane_width = (doc_width/win_width)*100 + '%';
				
					dst = doc.scrollTop();
					dsl = doc.scrollLeft();
					
					a_olay.css({'width' : pane_width, 'height' : pane_height}).fadeIn('slow');
					a_pane.css({'top' : dst + 'px', 'left' : dsl + 'px'}).slideDown('slow');
					a_button.click();
				};
				
				this.show_next = function(){
					
					albums[this.current_album].next();
					
				};
				
				this.show_prev = function(){
					
					albums[this.current_album].prev();
					
				};
				
				/*
				this.methods = {
				
					// an interface to call custom methods
					
					// currently not used
				
					show : function(album_id, image_id, link){
						
						albums[album_id].show_image(image_id, link);	
						
					},
					
					show_album: function(album_id){
						albums[album_id].show();
					}
					
				}; //end of methods 
				*/
	
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
		
			a = new Albumize();
			
			//define the albumize utility plugin
			
			$.albumize = function(){
			
					if(arguments.length == 0){
						a.show_albums();
					}
					
					/*
					
					//a way to call custom methods of $.albumize
					
					// methods are objects of 'methods' function
					
					// format is $.albumize("method name", arg1, arg2)
					
					// currently not used
					
					else if(typeof arguments[0] === "string" && a.methods[arguments[0]]){
						var as = [];
							for(var i = 1, al = arguments.length; i < al; i++){
								as.push(arguments[i]);
							}
						a.methods[arguments[0]].apply(a, as);
					}*/
			
			
			};
			
			a.init(total_albums, albumize);
			
			
			//*******************************************
			
			var a_olay = $('#albumize-olay');
			var a_pane = $('#albumize-pane');
			var a_album_pane = $('#albumize-album-window');
			
			var aao = $('#albumize-album-overlay');
			
			var a_w_close = $('#albumize-album-window-close');
				
			var slider = $('#albumize-t-slider');
			var t_div = $('#albumize-t-window');
			
			var loading = $('#albumize-loading');
			var load_error = $('#albumize-loading-error');
				
			var slider_open = true;
			
			// event listeners
				
				body.on('click', '#albumize-olay', function(){
					a_album_pane.hide();
					loading.hide(); load_error.hide();
					aao.hide();
					a_pane.slideUp('slow');
					a_olay.fadeOut('slow');
				});
				
				body.on('click', '#albumize-pane #albumize-close', function(){
					a_album_pane.hide();
					loading.hide(); load_error.hide();
					aao.hide();
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
				
					var album_id = parseInt($(this).attr('data-albumize-album-id'));
					var image_id = parseInt($(this).attr('data-albumize-image-id'));
					var link = $(this).attr("href");
					
					a.show(album_id, image_id, link);
					
					return false;
				});
				
				body.on('click', '.albumize-album-info', function(){
				
					var album_id = parseInt($(this).attr("data-albumize-album-id"));
					
					a.show_album(album_id);
					
				
				});
				
				body.on('click', '#albumize-error-dismiss', function(){
				
					aao.stop().fadeOut();
					loading.hide();
					load_error.hide();	
				
				});
				
				body.on('click', '.albumize-thumb', function(){
				
					var album_id = parseInt($(this).attr("data-albumize-album-id"));
					var image_id = parseInt($(this).attr("data-albumize-image-id"));
					a.show_image_from_thumb(album_id, image_id);
				
				});
				
				body.on('click', '#albumize-prev', function(){
					
					a.show_prev();
				
				});
				
				body.on('click', '#albumize-next', function(){

					a.show_next();
				
				});
				
			
			
			// event listeners
			
			//*******************************************
			
		}
		
		function initDOM(){
			
				var a_olay = $('<div></div>').addClass('albumize-overlay').attr('id', 'albumize-olay').css({'width' : pane_width, 'height' : pane_height});
				var a_pane = $('<div></div>').addClass('albumize-pane').attr('id', 'albumize-pane');
				var a_a_olay = $('<div><div id = "albumize-loading-error"></div><div id = "albumize-loading"></div></div>').addClass('albumize-album-overlay').attr('id', 'albumize-album-overlay');
				var a_header = $('<div></div>').addClass('albumize-header').attr('id', 'albumize-header');
				
				var a_close = $('<button>&times;</button>').addClass('albumize-close').attr('id', 'albumize-close');
				a_close.appendTo(a_header);
				
				var a_control = $('<div></div>').addClass('albumize-control-pane').attr('id', 'albumize-control-pane');
				
				//control elements
				var a_prev = $('<div></div>').addClass('albumize-prev').attr('id', 'albumize-prev');
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
				//a_pane.append('<div id = "albumize-loading-error">Error in loading images. Try again. </div>');
				
				a_olay.appendTo(body);
				a_pane.appendTo(body);
				//a_a_olay.appendTo(a_pane);
				a_pane.append(a_a_olay);
				//a_album_pane.appendTo(a_pane);
				a_pane.append(a_album_pane);
				
				
				var a_t_i = '<img class = "albumize-thumb" src = "sample/thumb-4.jpg"><img class = "albumize-thumb" src = "sample/thumb-1.jpg"><img class = "albumize-thumb" src = "sample/thumb-5.jpg"><img class = "albumize-thumb" src = "sample/thumb-2.jpg"><img class = "albumize-thumb" src = "sample/thumb-6.jpg"><img class = "albumize-thumb" src = "sample/thumb-3.jpg">';
				
				$('#albumize-t-body').append(a_t_i);
				
				
			
		}
	
	}); // end of document ready


})(jQuery, document, window);






