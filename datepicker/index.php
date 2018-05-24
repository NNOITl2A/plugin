<!DOCTYPE html>
<html>
<head>
	<title>Datepicker</title>


	<link rel="stylesheet" type="text/css" href="../css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="caleran.min.css">

	<style type="text/css">
		body{font-family: "Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif;}
		table{width: 100%;}
	</style>
</head>
<body>

	<div class="pal mal">

		<table>
			
			<tr>
				<td><input type="text" name="f1" value="<?=date('d/m/Y')?>" class="inputtext js-datepicker"></td>
				<!-- <td><input type="text" name="f2" class="inputtext js-daterangepicker"></td> -->
				<td><input type="text" name="f3" class="inputtext" id="caleran-ex-1"></td>
			</tr>
		</table>
		

		
	</div>

	<script src="http://code.jquery.com/jquery-1.8.1.min.js"></script>
	<script type="text/javascript" src="moment.min.js"></script>

	
	<script src="datepicker.min.js"></script>
	<!-- <script src="datepicker2.js"></script> -->
	<!-- <script src="daterangepicker.js"></script> -->
	<script src="caleran.min.js"></script>

	<script type="text/javascript">
		

		$(function () {
			
			$(':input.js-datepicker').datepicker({
				// multidate: true
			});

			/*$(':input.js-daterangepicker').daterangepicker({
				format: 'DD/MM/YYYY',
			});*/

			$("#caleran-ex-1").caleran({
				format: 'DD/MM/YYYY',
				// rangeOrientation: "vertical",
        		showButtons: true,
        		// inline: true,
        		startOnMonday: true,
        		startEmpty: true,
        		showFooter: false,

        		// showWeekNumbers: true,
        		
        		minDate: moment(), //.subtract(1,"days")
        		/*ranges: [
		             
		              {
		                  title: "Today",
		                  startDate: moment(),
		                  endDate: moment()
		              },
		              {
		                  title: "Yesterday",
		                  startDate: moment().subtract(1,"days"),
		                  endDate: moment().subtract(1,"days")
		              },
		              {
		                  title: "This Week",
		                  startDate: moment().startOf("week"),
		                  endDate: moment().endOf("week")
		              },
		              {
		                  title: "This month",
		                  startDate: moment().startOf("month"),
		                  endDate: moment().endOf("month")
		              },
		              {
		                  title: "Last month",
		                  startDate: moment().subtract(1,"months").startOf("month"),
		                  endDate: moment().subtract(1,"months").endOf("month")
		              }
		        ]*/
		        /*disabledRanges: [
			          {
			            "start": moment("10/03/2017","DD/MM/YYYY"),
			            "end": moment("18/03/2017", "DD/MM/YYYY")
			          },
			          {
			            "start": moment("01/04/2017","DD/MM/YYYY"),
			            "end": moment("05/04/2017", "DD/MM/YYYY")
			          },
			          {
			            "start": moment("11/04/2017","DD/MM/YYYY"),
			            "end": moment("15/04/2017", "DD/MM/YYYY")
			          }
			    ],*/
			});
		})
	</script>
</body>
</html>