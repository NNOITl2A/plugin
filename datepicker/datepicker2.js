;(function( $, window, document, undefined ) {

	function UTCDate(){
		return new Date(Date.UTC.apply(Date, arguments));
	}
	function UTCToday(){
		var today = new Date();
		return UTCDate(today.getFullYear(), today.getMonth(), today.getDate());
	}

	$(window).click(function(event) {
				
		if( $(event.target).data('datepicker2') ){

			var data = $(event.target).data('datepicker2');

			console.log( data.is_focus );
			if( data.$flyout.hasClass('open') ){

				// data.hide();
			}
			else{

				// data.setCalendar();
				// data.show();
			}
			
			// console.log( data );
		}
		else{

			console.log( 1111 );
		}

		// else if( !self.is_focus ){
			// self.hide();
		// }
		// console.log( $(event.target).data('datepicker2') );
	});


	var DatePicker2 = {
		init: function (options, el ) {
			var self = this;

			self.$inputField = $(el);
			self.$inputField.addClass('js-datepicker2')
			self.settings =  $.extend( {}, $.fn.datepicker2.defaults, options );
			self.settings.dates = $.fn.datepicker2.dates[ self.settings.leng ];

			self.is_focus = false;
			var format = self.settings.format;
			self.validParts = /dd?|DD?|mm?|MM?|yy(?:yy)?/g;

			self.format = {
				separators: format.replace(this.validParts, '\0').split('\0'),
				parts: format.match(this.validParts)
			}


			self.date = new Date();
			self.template = 'month';


			self.setModel();

			// Event
			self.$inputField.focus(function() {

				console.log( 'focus' );

				if( !self.$flyout ){
					self.setModel();
				}

				$( self.settings.container ).append( self.$flyout );
				self.setCalendar();

				self.show();
			});


			/*.blur(function(event) {
				
				if( !self.is_focus ){
					self.hide();
				}
				
			});;*/


			// self.parseDate();
			/*.blur(function() {
				
				console.log( 'blur' );
				self.hide();
			});*/

			// console.log( self.$inputField );
			/*, self.settings, self.dates*/


			self.setValue();
		},

		formatDate: function(date, format, language){
			if (!date)
				return '';
			if (typeof format === 'string')
				format = DPGlobal.parseFormat(format);
			if (format.toDisplay)
                return format.toDisplay(date, format, language);

            var val = {
				d: date.getUTCDate(),
				D: dates[language].daysShort[date.getUTCDay()],
				DD: dates[language].days[date.getUTCDay()],
				m: date.getUTCMonth() + 1,
				M: dates[language].monthsShort[date.getUTCMonth()],
				MM: dates[language].months[date.getUTCMonth()],
				yy: date.getUTCFullYear().toString().substring(2),
				yyyy: date.getUTCFullYear()
			};

			val.dd = (val.d < 10 ? '0' : '') + val.d;
			val.mm = (val.m < 10 ? '0' : '') + val.m;
			date = [];
			var seps = $.extend([], format.separators);
			for (var i=0, cnt = format.parts.length; i <= cnt; i++){
				if (seps.length)
					date.push(seps.shift());
				date.push(val[format.parts[i]]);
			}
			return date.join('');
		},

		setModel: function () {
			var self = this;

			self.$flyout = $('<div>', {class: 'uiContextualPositioner'});
			self.$calendar = $('<div>', {class: 'toggleFlyout calendarGridTableSmall'});

			self.$flyout.html( self.$calendar );

			


			// Event 
			self.$flyout.delegate('[data-action-mode]', 'click', function(event) {
				
				self.template = $(this).attr('data-action-mode');
				self.setCalendar();
			}); 

			

			self.$flyout.mouseenter(function(event) {
				self.is_focus = true;
			}).mouseleave(function(event) {
				self.is_focus = false;
			});
		},

		
		setCalendar: function () {
			var self = this;

			self.$calendar.html( self.setTemplate[ self.template ]( self.date, self.settings ) );
		},
		updateCalendar: function () {
			var self = this;

		},
		
		show: function () {
			var self = this;

			console.log( 'show' );
			self.getOffset();
			self.$flyout.addClass('open');

		},
		hide: function () {
			var self = this;	

			self.$flyout.removeClass('open').remove();
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

		setTemplate: {
			month: function ( date, options ) {

				var today = new Date(); 
					today.setHours(0, 0, 0, 0);

				var theDate = date || new Date( today );

				var firstDate = new Date( theDate );
	        		firstDate.setDate(1);
	        	var firstTime = firstDate.getTime();

	        	var lastDate = new Date(firstDate);
	        		lastDate.setMonth(lastDate.getMonth() + 1);
	        		lastDate.setDate(0);
	        	var lastTime = lastDate.getTime();
	        	var lastDay = lastDate.getDate();

	        	// Calculate the last day in previous month
		        var prevDateLast = new Date(firstDate);
		        	prevDateLast.setDate(0);
		        var prevDateLastDay = prevDateLast.getDay();
		        var prevDateLastDate = prevDateLast.getDate();


	        	var prevweekDay = options.weekStart || 0;
	        		prevweekDay = prevweekDay>prevDateLastDay ? 7-prevweekDay: prevDateLastDay-prevweekDay;


	        	var lists = [];
	        	for (var y = 0, i = 0; y < 7; y++){

	        		var row = [];
					var weekInMonth = false;

					for (var x = 0; x < 7; x++, i++) {
						var p = ((prevDateLastDate - prevweekDay ) + i);

						var col = {};
						var n = p - prevDateLastDate;
						col.date = new Date( theDate ); 
						col.date.setHours(0, 0, 0, 0); 
						col.date.setDate( n );

						// If value is outside of bounds its likely previous and next months
						if (n >= 1 && n <= lastDay){
							weekInMonth = true;

		            		if( today.getTime()==col.date.getTime()){
		                    	col.today = true;
		                    }

		                    /*if( self.calendar.selectedDate.getTime()==col.date.getTime() ){
		                    	col.selected = true;
		                    }*/
						}
		            	else{
		            		col.noday = true;
		            	}

		            	row.push(col);
					}


					if( row.length>0 && weekInMonth ){
						lists.push(row);
					}
	        	}

	        	// title
				var year = theDate.getFullYear();

				var month = options.dates.months[ theDate.getMonth() ];

	        	var $title = $('<thead>').html( $("<tr>", {class: 'title'}).append(
					  $('<td>', {class: 'prevnext'}).append( $('<button>', {type: 'button', 'data-action': 'prev'}).html( '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 477.175 477.175" xml:space="preserve"><g>	<path d="M145.188,238.575l215.5-215.5c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-225.1,225.1c-5.3,5.3-5.3,13.8,0,19.1l225.1,225c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1L145.188,238.575z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>' ) )
					, $('<td>', {class: 'title', 'data-action-mode': 'year', colspan: 5, text: month + " " + year })
					, $('<td>', {class: 'prevnext'}).append( $('<button>', {type: 'button', 'data-action': 'next'}).html( '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 477.175 477.175" xml:space="preserve"><g><path d="M360.731,229.075l-225.1-225.1c-5.3-5.3-13.8-5.3-19.1,0s-5.3,13.8,0,19.1l215.5,215.5l-215.5,215.5c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-4l225.1-225.1C365.931,242.875,365.931,234.275,360.731,229.075z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>' ) )
				) );

				// header
				var $thead = $("<tr>", {class: 'header'});
				for (var x=0, i=options.weekStart; x<7; x++, i++) {
					if( i==7 ) i=0;
					$thead.append( $('<th>', {text: options.dates.daysMin[ i ]}) );
				};


				var $tbody = $('<tbody>');
				$.each(lists, function (i, row) {
					$tr = $('<tr>');
					$.each( row, function(j, call){

						call.cls = "";
						var m = call.date.getMonth()+1;
						m = m < 10 ? '0'+m:m;

						var d = call.date.getDate();
						d = d < 10 ? '0'+d:d;

						var datestr = call.date.getFullYear()+"-"+ m +"-"+d;

						if( options.start ){

							if( options.start.getTime() == call.date.getTime() ){
								call.cls += ' select-start';
							}

							if( options.start.getTime() > call.date.getTime() ){
								call.overtime = true;
							}
						}

						if( options.end ){

							if( options.end.getTime() == call.date.getTime() ){
								call.cls += ' select-end';
							}

							if( options.end.getTime() < call.date.getTime() ){
								call.overtime = true;
							}
						}

						$tr.append( 
							$('<td>',{'data-date': datestr })

								.addClass( call.empty?'empty':'' )
								.addClass( call.today?'today':'' )
								.addClass( call.selected?'selected':'' )
								.addClass( call.noday?'noday':'' )
								.addClass( call.overtime?'overtime':'' )
								.addClass( call.cls )
								// .addClass( call.date.getDay()==6 || call.date.getDay()==0?'weekHoliday':'' )
								.html( $('<span>', { text: call.date.getDate() }) )
						);
					});

					$tbody.append( $tr );			
				});

	        	return $('<table>', { class: 'calendarGridTable day' }).append( $title, $thead, $tbody );
			},

			year: function (date, options) {
				
				var today = new Date(); 
					today.setHours(0, 0, 0, 0);

				var theDate = date || new Date( today );

				// title
				var year = theDate.getFullYear();

	        	var $title = $('<thead>').html( $("<tr>", {class: 'title'}).append(
					  $('<td>', {class: 'prevnext'}).append( $('<button>', {type: 'button', 'data-action': 'prev'}).html( '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 477.175 477.175" xml:space="preserve"><g><path d="M145.188,238.575l215.5-215.5c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-225.1,225.1c-5.3,5.3-5.3,13.8,0,19.1l225.1,225c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1L145.188,238.575z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>' ) )
					, $('<td>', {class: 'title', 'data-action-mode': 'decade', colspan: 2, text:  year })
					, $('<td>', {class: 'prevnext tar'}).append( $('<button>', {type: 'button', 'data-action': 'next'}).html( '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 477.175 477.175" xml:space="preserve"><g><path d="M360.731,229.075l-225.1-225.1c-5.3-5.3-13.8-5.3-19.1,0s-5.3,13.8,0,19.1l215.5,215.5l-215.5,215.5c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-4l225.1-225.1C365.931,242.875,365.931,234.275,360.731,229.075z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>' ) )
				) );

				var $tbody = $('<tbody>'), n=0;
				for (var i = 0; i < 12; i++) {

					n ++;
					if( n==1 ){
						var $tr = $('<tr>');
					}

					$tr.append( $('<td>').append( $('<span>').text( options.dates.monthsShort[ i ] ) ) );

					if( n==4 ){
						n=0;
						$tbody.append( $tr );
					}
				}

				return $('<table>', { class: 'calendarGridTable month' }).append( $title, $tbody );
			},

			decade: function (date, options) {
				
				var today = new Date(); 
					today.setHours(0, 0, 0, 0);

				var theDate = date || new Date( today );

				var firstYear = new Date( theDate );
					year = firstYear.getFullYear();


				var factor = 10;
				var step = factor / 10;
				var startVal = Math.floor(year / factor) * factor;
				var endVal = startVal + step * 9;

				var $title = $('<thead>').html( $("<tr>", {class: 'title'}).append(
					  $('<td>', {class: 'prevnext'}).append( $('<button>', {type: 'button', 'data-action': 'prev'}).html( '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 477.175 477.175" xml:space="preserve"><g><path d="M145.188,238.575l215.5-215.5c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-225.1,225.1c-5.3,5.3-5.3,13.8,0,19.1l225.1,225c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1L145.188,238.575z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>' ) )
					, $('<td>', {class: 'title', colspan: 2, text:  startVal +" - "+ endVal })
					, $('<td>', {class: 'prevnext tar'}).append( $('<button>', {type: 'button', 'data-action': 'next'}).html( '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 477.175 477.175" xml:space="preserve"><g><path d="M360.731,229.075l-225.1-225.1c-5.3-5.3-13.8-5.3-19.1,0s-5.3,13.8,0,19.1l215.5,215.5l-215.5,215.5c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-4l225.1-225.1C365.931,242.875,365.931,234.275,360.731,229.075z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>' ) )
				) );


				var $tbody = $('<tbody>'), classes, n=0;
				for (var currVal = startVal - step; currVal <= endVal + step; currVal += step) {
					n ++; if( n==1 ){ var $tr = $('<tr>'); }

					if (currVal === startVal - step) {
						classes = 'old';
					} else if (currVal === endVal + step) {
						classes = 'new';
					}


					if( options.startYear && options.endYear ){
						if (currVal < options.startYear || currVal > options.endYear) {
							classes = 'disabled';
						}
					}

					$tr.append( $('<td>').append( $('<span>').text( currVal ) ) );

					if( n==4 ){ n=0; $tbody.append( $tr ); }
					// console.log( currVal, classes ); 
				}

				return $('<table>', { class: 'calendarGridTable decade' }).append( $title, $tbody );
			}
		},

		parseDate: function () {
			var self = this;


			/*function applyNearbyYear(year, threshold){
				if (threshold === true)
					threshold = 10;

				// if year is 2 digits or less, than the user most likely is trying to get a recent century
				if (year < 100){
					year += 2000;
					// if the new year is more than threshold years in advance, use last century
					if (year > ((new Date()).getFullYear()+threshold)){
						year -= 100;
					}
				}

				return year;
			}*/

			var parsed = {},
				setters_order = ['yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'd', 'dd'],
				/*setters_map = {
					yyyy: function(d,v){
						return d.setUTCFullYear(assumeNearby ? applyNearbyYear(v, assumeNearby) : v);
					},
					m: function(d,v){
						if (isNaN(d))
							return d;
						v -= 1;
						while (v < 0) v += 12;
						v %= 12;
						d.setUTCMonth(v);
						while (d.getUTCMonth() !== v)
							d.setUTCDate(d.getUTCDate()-1);
						return d;
					},
					d: function(d,v){
						return d.setUTCDate(v);
					}
				},*/
				val, filtered;


			/*setters_map['yy'] = setters_map['yyyy'];
			setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
			setters_map['dd'] = setters_map['d'];*/
		},

		setValue: function () {
			var self = this;

			var formatted = this.getFormattedDate();
			self.$inputField.val(formatted);
			return this;
		},
		getFormattedDate: function( format ) {
			var self = this;

			var val = {
				d: self.date.getDate(), // date.getUTCDate()
				D: self.settings.dates.daysShort[ self.date.getDate() ],
				DD: self.settings.dates.days[ self.date.getDate() ],
				m: self.date.getMonth() + 1, //date.getUTCMonth() + 1,
				M: self.settings.dates.monthsShort[self.date.getMonth()],
				MM: self.settings.dates.months[self.date.getMonth()],
				yy: self.date.getFullYear().toString().substring(2),
				yyyy: self.date.getFullYear()
			};


			val.dd = (val.d < 10 ? '0' : '') + val.d;
			val.mm = (val.m < 10 ? '0' : '') + val.m;

			self.$inputField.val( self.date.getFullYear() + '/' + val.mm + '/' + val.dd );

			var date = [];
			var seps = $.extend([], self.format.separators);
			for (var i=0, cnt = self.format.parts.length; i <= cnt; i++){
				if (seps.length)
					date.push(seps.shift());
				date.push(val[self.format.parts[i]]);
			}

			return date.join('');
		},
	}

	$.fn.datepicker2 = function( options ) {
		return this.each(function() {
			var $this = Object.create( DatePicker2 );
			$this.init( options, this );
			$.data( this, 'datepicker2', $this );
		});
	};
	$.fn.datepicker2.defaults = {
		leng: 'en',
		date: new Date(),

		container: 'body',
		weekStart: 1,
		format: "yyyy-mm-dd",

	};
	$.fn.datepicker2.dates = [];


	$.fn.datepicker2.dates['en'] = {
		days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],

		months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],		
	};

})( jQuery, window, document );