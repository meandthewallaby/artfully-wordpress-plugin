jQuery(document).ready(function() {
    $ = jQuery;
    artfully.configure({
        base_uri: 'https://www.artful.ly/api/v3/',
        store_uri: 'https://www.artful.ly/widget/v3/'
    });

    var monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"]
    var shortMonthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    var now = new Date();
    var selectedDate = getDate(artfully_events.month);

    var monthSelect = $("<select>").attr("id", "artfully-select-month").attr("name", "month");
    for(var i = 0; i < 12; i++) {
	monthSelect.append($("<option>").val(i+1).text(monthNames[i]));
    }

    var yearSelect = $("<select>").attr("id", "artfully-select-year");
    for(var i = now.getFullYear()-2; i <= now.getFullYear()+2; i++) {
	yearSelect.append($("<option>").val(i).text(i));
    }

    $("#artfully-this-month").append(monthSelect);
    $("#artfully-this-month").append(yearSelect);

    $("#artfully-select-month").change(function() {
	goToNewMonth(selectedDate.getFullYear(), $(this).val());
    });
    $("#artfully-select-year").change(function() {
	goToNewMonth($(this).val(), selectedDate.getMonth()+1);
    });
    $("#artfully-prev-month").click(function() {
	var currently = new Date($("#artfully-select-year").val(), parseInt($("#artfully-select-month").val())-1, 1);
	var prevMonth = addMonths(currently, -1);
	goToNewMonth(prevMonth.getFullYear(), prevMonth.getMonth()+1);
    });
    $("#artfully-next-month").click(function() {
	var currently = new Date($("#artfully-select-year").val(), parseInt($("#artfully-select-month").val())-1, 1);
	var nextMonth = addMonths(currently, 1);
	goToNewMonth(nextMonth.getFullYear(), nextMonth.getMonth()+1);
    });

    navigate(selectedDate);

    function navigate(date) {
	buildHeader(date);

	monthSelect.val(date.getMonth()+1);
	yearSelect.val(date.getFullYear());

	//Build the actual calendar
	clearCalendar();
	buildCalendar(date);

	//Populate the calendar with events
	artfully.widgets.artfully_events().display(artfully_events.organizationId, date.getYear(), date.getMonth(), artfully_events.domId);
    }

    function buildHeader(date) {
	//Build the calendar header
	$(".artfully-calendar-month").text(getMonthName(date.getMonth(), false) + ' ' + date.getFullYear());
	var prevMonth = addMonths(date, -1);
	$("#artfully-prev-month").text("\u2190 "+getMonthName(prevMonth.getMonth(), false));
	var nextMonth = addMonths(date, 1);
	$("#artfully-next-month").text(getMonthName(nextMonth.getMonth(), false)+" \u2192");
    }

    function buildCalendar(date) {
	var today = new Date();
	today.setHours(0,0,0,0);
	var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
	var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
	var dayOfWeek = firstDay.getDay();
	var cal = $(".artfully-calendar > tbody");
	if(dayOfWeek > 0) {
	    cal.append($("<tr>"));
	    for (var i = 0; i < dayOfWeek; i++) {
		cal.children("tr").last().append($("<td>"));
	    }
	}
	var currentDay = firstDay;
	while(currentDay <= lastDay) {
	    if(currentDay.getDay() == 0) {
		cal.append($("<tr>"));
	    }
	    var dayId = "art-day-"+getMonthName(currentDay.getMonth(), true)+"-"+currentDay.getDate();
	    var dayNum = $("<div>").addClass("art-day-num").text(currentDay.getDate());
	    if (currentDay >= today) {
		dayNum.addClass("future");
	    }
	    cal.children("tr").last().append($("<td>").attr("id", dayId).append(dayNum));
	    currentDay = addDays(currentDay, 1);
	}
	if(currentDay.getDay() > 0 ) {
	    for(var i = currentDay.getDay(); i < 7; i++) {
		cal.children("tr").last().append($("<td>"));
	    }
	}
    }

    function clearCalendar() {
	$(".artfully-calendar > tbody").children("tr").remove();
    }

    function getMonthName(monthNum, useShort) {
	return useShort ? shortMonthNames[monthNum] : monthNames[monthNum];
    }

    function addDays(date, days) {
	var result = new Date(date);
	result.setDate(date.getDate() + days);
	return result;
    }

    function addMonths(date, months) {
	var result = new Date(date);
	result.setMonth(date.getMonth() + months);
	return result;
    }

    function getDate(eventMonth) {
	return eventMonth != null && eventMonth.match(/^\d{4}-\d{1,2}$/) != null ? 
	    new Date(eventMonth.substr(0,4), parseInt(eventMonth.substr(5,2))-1, 1) : new Date();
    }

    function getTwoDigitMonth(month) {
	var paddedMonth = '00' + month;
	return paddedMonth.substr(paddedMonth.length-2,2);
    }

    function goToNewMonth(year, month) {
	var newDate = new Date(year, month-1, 1);
	var eventMonth = year + '-' + getTwoDigitMonth(month);
	var newUrl = '?event-month=' + eventMonth;
	window.history.pushState({month: eventMonth}, "", newUrl);
	navigate(newDate);
    }
    
    window.onpopstate = function(e) {
	if(e.state) {
	    navigate(getDate(e.state.month));
	} else {
	    navigate(new Date());
	}
    }
});

