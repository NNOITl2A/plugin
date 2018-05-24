// Utility
if ( typeof Object.create !== 'function' ) {
	Object.create = function( obj ) {
		function F() {};
		F.prototype = obj;
		return new F();
	};
}

(function( $, window, document, undefined ) {

	var LiveSearch = {
		init: function ( options, elem ) {
			var self = this;

			self.options = $.extend( {}, $.fn.livesearch.defaults, options );;
			self.is_focus = false;
			self._focus = true;
			self.selected = '';


			self.$elem = $('<div>', {class: "livesearch-wrapper"});
			self.$remove = $('<div>', {class: "livesearch-remove"}).html( '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 224.512 224.512" xml:space="preserve"><g><polygon style="fill:#010002;" points="224.507,6.997 217.521,0 112.256,105.258 6.998,0 0.005,6.997 105.263,112.254    0.005,217.512 6.998,224.512 112.256,119.24 217.521,224.512 224.507,217.512 119.249,112.254"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>' );

			self.$inputField = $(elem);
			self.setFlyout();

			self.$inputField.wrap( self.$elem );
			self.$inputField.addClass('livesearch-input');
			self.$inputField.parent()
				.append( '<div class="livesearch-loader loader-spin-wrap"><div class="loader-spin"></div></div>' )
				.append( self.$remove );

			// Event
			self.$inputField.focus(function() {
				self.show();

			}).blur(function() {
				
				if( !self.is_focus ){
					self.hide();
				}

				self.$inputField.val( $.trim( $(this).val() ) )

			}).keyup(function() {

				var val = $.trim( $(this).val() ); 
				if( val=='' ){
					self.$inputField.parent().removeClass('has-data');
				}
				else{
					self.search();
				}
			});

			self.$remove.click(function() {
				
				self.$inputField.val('').focus().parent().removeClass('has-data');
			});


			self.$listbox.mouseenter(function(){
				self.is_focus = true;
			}).mouseleave(function(event) {
				self.is_focus = false;
			});

			self.$listbox.delegate('>li', 'mouseenter', function(event) {
				$(this).addClass('active').siblings().removeClass('active');
			});

			self.$listbox.delegate('>li', 'click', function(event) {
				var data = $(this).data();
				self.$inputField.val( data.text ).parent().addClass('has-data');
				self.hide();
			});
			
		},

		setFlyout: function () {
			var self = this;

			self.$flyout = $('<div>', {class: 'ui-flyout'});
			self.$listbox = $('<ul>', {class: 'list-menu'});

			self.$flyout.append( self.$listbox );
		},

		search: function () {
			var self = this;

			console.log( 'search' );

			setTimeout(function () {
				self.$listbox.empty();

				$.each( self.options.items, function(i, obj) {
					self.$listbox.append( self.setItem( obj ) );
				});

				self.$flyout.addClass('open');
			}, 1);
		},

		getOffset: function () {
			var self = this, 
				style = {}, 
				offset = self.$inputField.offset();

			var style = {
				top: offset.top + self.$inputField.outerHeight(),
				left: offset.left
			};

			self.$flyout.css( style );
		},

		show: function () {
			var self = this;

			console.log( self.options );

			$( self.options.container ).append( self.$flyout );
			self.getOffset();

			self.search();
		},
		getOffset: function () {
			var self = this, 
				style = {}, 
				offset = self.$inputField.offset();

			var style = {
				top: offset.top + self.$inputField.outerHeight(),
				left: offset.left
			};

			style.minWidth = self.$inputField.outerWidth();
			self.$flyout.css( style );
		},

		setItem: function (data) {
			var self = this;

			var li = $('<li>').append( 
				  $('<div>', {class: 'text'}).text( data.text )
				, (data.category ? $('<div>', {class: 'category'}).text( data.category ): '' ) 
			);

			li.data( data );

			return li;
		},

		hide: function () {
			var self = this;

			if( self.$flyout ){

				self.$flyout.removeClass('open');
				// self.$flyout.remove();
			}
			
		},
	};


	$.fn.livesearch = function( options ) {
		return this.each(function() {
			var $this = Object.create( LiveSearch );
			$this.init( options, this );
			$.data( this, 'livesearch', $this );
		});
	};

	$.fn.livesearch.defaults = {
		container: 'body',
		items: [
			  { text: 'A1' }
			, { text: 'B1' }
			, { text: 'C1' }
			, { text: 'D2' }
			, { text: 'E2' }
		]
	};
	
})( jQuery, window, document );

