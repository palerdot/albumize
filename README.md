Albumize
========

##Albumize is a jQuery plugin that lets you manage collection of images in the web page as albums. With albumize, you can browse albums, add cover image to albums and switch between albums.

**********************************************

[Download Albumize plugin](https://github.com/palerdot/albumize/archive/master.zip)

[Demo and Documentation](http://palerdot.github.io/albumize)

**********************************************

### Setting up Albumize plugin

1. Download and unzip the albumize plugin package. 

2. Add the jQuery library to the web page.

		```
			<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
		```
   This example uses jQuery library from the google CDN. You can also add your own copy of latest jQuery library or add from the `js` folder.
   
3. Add `albumize.js` file from the `js` folder.

		```
	 		<script src="js/albumize.js"></script>
	 	```
4. Add `albumize.css` file from the `css` folder. This is the stylesheet albumize plugin uses for styling its components.

		```
	 		 <link href="css/albumize.css" rel="stylesheet" /> 
	 	```
   The stylesheet `albumize.css` looks for image icons in the `img` folder by default.
   
**********************************************

## Activating Albumize

### Markup

		```
	 		 <div class="albumize" title="Album title"> 
	 		 
				<a href = "large-image-1.jpg" title="image title"> 
					<img src="thumbnail-1.jpg"> </img>
				</a>
				
				<a href = "large-image-2.jpg" title="image title"> 
					<img src="thumbnail-2.jpg" class="albumize-cover"> </img>
				</a>
				
			 </div>
	 	```

1. Add `class = "albumize"` to the div holding the collection of images to be shown as an album.

2. Add `title = "Album title"` to the div of `class = "albumize"` to add an album title. Album title is optional.

3. Add `title = "image title"` to the anchor element to add a title for the image. Image titles are optional.

4. Add `class = "albumize-cover"` to the image element within the anchor, to add the corresponding thumbnail as the cover for the album. If more than one image is given the `class = "albumize-cover"`, then the **first image** element with `class 'albumize-cover'` will be used for the album cover. In the given example markup, thumbnail of second image will be used as album cover. Album covers are optional.

The given markup is the required structure for a single album. For adding more than one album, repeat the same structure to other collection of images. For example, if you want to show 5 albums, then your HTML will have 5 divs of `class = "albumize"`.

### Activation

The above markup **automatically** activates albumize plugin when the images are clicked. However, if you would like to have a custom button to show the list of your albums (as shown in the examples previously), you should programatically trigger like this:

			```
				//Here, $ is the alias of jQuery. Replace '#show-my-albums-button' with your own button/element id. 
				
				 $('#show-my-albums-button').click(function(){
					$.albumize();
				 });
				 
		 	```
This method can be handy if you don't want to show images in your web page, and just want to have a single button to show all your albums. In such cases, you can hide the images and trigger the albumize plugin programatically with a button click.

****************************************************************************************************

Albumize uses CSS3 transitions for animations. Albumize displays thumbnails in a handy scrollable mini window to select images, which enables faster access of albums with large number of images. Check out the [live demo](http://palerdot.github.io/albumize).

****************************************************************************************************

Albumize is an open source project, free to use in personal and commercial projects. If you want to report a problem or an issue, please raise an [issue on GitHub.](https://github.com/palerdot/albumize/issues)































