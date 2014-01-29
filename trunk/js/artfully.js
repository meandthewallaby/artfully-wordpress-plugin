/*
 * maskMoney plugin for jQuery
 * http://plentz.github.com/jquery-maskmoney/
 * version: 2.1.1
 * Licensed under the MIT license
 */
(function ($) {
    $.browser || ($.browser = {}, $.browser.mozilla = /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase()), $.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase()), $.browser.opera = /opera/.test(navigator.userAgent.toLowerCase()), $.browser.msie = /msie/.test(navigator.userAgent.toLowerCase()));
    var methods = {
        destroy: function () {
            var input = $(this);
            return input.unbind(".maskMoney"), $.browser.msie && (this.onpaste = null), this
        },
        mask: function () {
            return this.trigger("mask")
        },
        init: function (settings) {
            return settings = $.extend({
                symbol: "",
                symbolStay: !1,
                thousands: ",",
                decimal: ".",
                precision: 2,
                defaultZero: !0,
                allowZero: !1,
                allowNegative: !1
            }, settings), this.each(function () {
                function markAsDirty() {
                    dirty = !0
                }

                function clearDirt() {
                    dirty = !1
                }

                function keypressEvent(e) {
                    e = e || window.event;
                    var k = e.which || e.charCode || e.keyCode;
                    if (k == undefined) return !1;
                    if (k < 48 || k > 57) return k == 45 ? (markAsDirty(), input.val(changeSign(input)), !1) : k == 43 ? (markAsDirty(), input.val(input.val().replace("-", "")), !1) : k == 13 || k == 9 ? (dirty && (clearDirt(), $(this).change()), !0) : !$.browser.mozilla || k != 37 && k != 39 || e.charCode != 0 ? (preventDefault(e), !0) : !0;
                    if (input.val().length >= input.attr("maxlength") && input.attr("maxlength") >= 0) return !1;
                    preventDefault(e);
                    var key = String.fromCharCode(k),
                        x = input.get(0),
                        selection = getInputSelection(x),
                        startPos = selection.start,
                        endPos = selection.end;
                    return x.value = x.value.substring(0, startPos) + key + x.value.substring(endPos, x.value.length), maskAndPosition(x, startPos + 1), markAsDirty(), !1
                }

                function keydownEvent(e) {
                    e = e || window.event;
                    var k = e.which || e.charCode || e.keyCode;
                    if (k == undefined) return !1;
                    var x = input.get(0),
                        selection = getInputSelection(x),
                        startPos = selection.start,
                        endPos = selection.end;
                    return k == 8 ? (preventDefault(e), startPos == endPos ? (x.value = x.value.substring(0, startPos - 1) + x.value.substring(endPos, x.value.length), startPos -= 1) : x.value = x.value.substring(0, startPos) + x.value.substring(endPos, x.value.length), maskAndPosition(x, startPos), markAsDirty(), !1) : k == 9 ? (dirty && ($(this).change(), clearDirt()), !0) : k == 46 || k == 63272 ? (preventDefault(e), x.selectionStart == x.selectionEnd ? x.value = x.value.substring(0, startPos) + x.value.substring(endPos + 1, x.value.length) : x.value = x.value.substring(0, startPos) + x.value.substring(endPos, x.value.length), maskAndPosition(x, startPos), markAsDirty(), !1) : !0
                }

                function focusEvent(e) {
                    var mask = getDefaultMask();
                    input.val() == mask ? input.val("") : input.val() == "" && settings.defaultZero ? input.val(setSymbol(mask)) : input.val(setSymbol(input.val()));
                    if (this.createTextRange) {
                        var textRange = this.createTextRange();
                        textRange.collapse(!1), textRange.select()
                    }
                }

                function blurEvent(e) {
                    $.browser.msie && keypressEvent(e), input.val() == "" || input.val() == setSymbol(getDefaultMask()) || input.val() == settings.symbol ? settings.allowZero ? settings.symbolStay ? input.val(setSymbol(getDefaultMask())) : input.val(getDefaultMask()) : input.val("") : settings.symbolStay ? settings.symbolStay && input.val() == settings.symbol && input.val(setSymbol(getDefaultMask())) : input.val(input.val().replace(settings.symbol, ""))
                }

                function preventDefault(e) {
                    e.preventDefault ? e.preventDefault() : e.returnValue = !1
                }

                function maskAndPosition(x, startPos) {
                    var originalLen = input.val().length;
                    input.val(maskValue(x.value));
                    var newLen = input.val().length;
                    startPos -= originalLen - newLen, setCursorPosition(input, startPos)
                }

                function mask() {
                    var value = input.val();
                    input.val(maskValue(value))
                }

                function maskValue(v) {
                    v = v.replace(settings.symbol, "");
                    var strCheck = "0123456789",
                        len = v.length,
                        a = "",
                        t = "",
                        neg = "";
                    len != 0 && v.charAt(0) == "-" && (v = v.replace("-", ""), settings.allowNegative && (neg = "-"));
                    if (len == 0) {
                        if (!settings.defaultZero) return t;
                        t = "0.00"
                    }
                    for (var i = 0; i < len; i++)
                        if (v.charAt(i) != "0" && v.charAt(i) != settings.decimal) break;
                    for (; i < len; i++) strCheck.indexOf(v.charAt(i)) != -1 && (a += v.charAt(i));
                    var n = parseFloat(a);
                    n = isNaN(n) ? 0 : n / Math.pow(10, settings.precision), t = n.toFixed(settings.precision), i = settings.precision == 0 ? 0 : 1;
                    var p, d = (t = t.split("."))[i].substr(0, settings.precision);
                    for (p = (t = t[0]).length;
                        (p -= 3) >= 1;) t = t.substr(0, p) + settings.thousands + t.substr(p);
                    return settings.precision > 0 ? setSymbol(neg + t + settings.decimal + d + Array(settings.precision + 1 - d.length).join(0)) : setSymbol(neg + t)
                }

                function getDefaultMask() {
                    var n = parseFloat("0") / Math.pow(10, settings.precision);
                    return n.toFixed(settings.precision).replace(new RegExp("\\.", "g"), settings.decimal)
                }

                function setSymbol(value) {
                    if (settings.symbol != "") {
                        var operator = "";
                        value.length != 0 && value.charAt(0) == "-" && (value = value.replace("-", ""), operator = "-"), value.substr(0, settings.symbol.length) != settings.symbol && (value = operator + settings.symbol + value)
                    }
                    return value
                }

                function changeSign(input) {
                    var inputValue = input.val();
                    return settings.allowNegative ? inputValue != "" && inputValue.charAt(0) == "-" ? inputValue.replace("-", "") : "-" + inputValue : inputValue
                }

                function setCursorPosition(input, pos) {
                    return $(input).each(function (index, elem) {
                        if (elem.setSelectionRange) elem.focus(), elem.setSelectionRange(pos, pos);
                        else if (elem.createTextRange) {
                            var range = elem.createTextRange();
                            range.collapse(!0), range.moveEnd("character", pos), range.moveStart("character", pos), range.select()
                        }
                    }), this
                }

                function getInputSelection(el) {
                    var start = 0,
                        end = 0,
                        normalizedValue, range, textInputRange, len, endRange;
                    return typeof el.selectionStart == "number" && typeof el.selectionEnd == "number" ? (start = el.selectionStart, end = el.selectionEnd) : (range = document.selection.createRange(), range && range.parentElement() == el && (len = el.value.length, normalizedValue = el.value.replace(/\r\n/g, "\n"), textInputRange = el.createTextRange(), textInputRange.moveToBookmark(range.getBookmark()), endRange = el.createTextRange(), endRange.collapse(!1), textInputRange.compareEndPoints("StartToEnd", endRange) > -1 ? start = end = len : (start = -textInputRange.moveStart("character", -len), start += normalizedValue.slice(0, start).split("\n").length - 1, textInputRange.compareEndPoints("EndToEnd", endRange) > -1 ? end = len : (end = -textInputRange.moveEnd("character", -len), end += normalizedValue.slice(0, end).split("\n").length - 1)))), {
                        start: start,
                        end: end
                    }
                }
                var input = $(this),
                    dirty = !1;
                input.attr("readonly") || (input.unbind(".maskMoney"), input.bind("keypress.maskMoney", keypressEvent), input.bind("keydown.maskMoney", keydownEvent), input.bind("blur.maskMoney", blurEvent), input.bind("focus.maskMoney", focusEvent), input.bind("mask.maskMoney", mask))
            })
        }
    };
    $.fn.maskMoney = function (method) {
        if (methods[method]) return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        if (typeof method == "object" || !method) return methods.init.apply(this, arguments);
        $.error("Method " + method + " does not exist on jQuery.maskMoney")
    }
})(jQuery),
function (window, document, undefined) {
    window.artfully = {}, window.artfully.config = {}, artfully.configure = function (obj) {
        obj != null && obj.store_uri != null && (obj.store_uri = obj.store_uri.replace("store", "widget"), obj.store_uri = obj.store_uri.replace("artfullyhq.com", "artful.ly")), obj != null && obj.base_uri != null && (obj.base_uri = obj.base_uri.replace("artfullyhq.com", "artful.ly")), jQuery.extend(artfully.config, obj)
    }, artfully.alert = function (msg) {
        jQuery("#artfully-alert").fadeOut("fast", function () {
            jQuery(this).html(msg), jQuery(this).fadeIn("slow")
        })
    }
}(this, document), artfully.config = {
    base_uri: "https://www.artful.ly/api/v3/",
    store_uri: "https://www.artful.ly/widget/v3/",
    maxHeight: "350",
    resellerId: undefined,
    cartLock: jQuery.Deferred()
}, artfully.reseller = function (resellerId) {
    if (resellerId === undefined) return artfully.config.resellerId;
    artfully.config.resellerId = resellerId
}, artfully.utils = function () {
    function ticket_uri(params) {
        var u = artfully.config.base_uri + "tickets.jsonp?callback=?";
        return jQuery.each(params, function (k, v) {
            u += "&" + k + "=" + v
        }), u
    }

    function event_uri(id) {
        return artfully.config.base_uri + "events/" + id + ".jsonp?callback=?"
    }

    function show_uri(id) {
        return uri = artfully.config.base_uri + "shows/" + id + ".jsonp?", artfully.reseller() !== undefined && (uri += "reseller_id=" + artfully.reseller() + "&"), uri += "callback=?", uri
    }

    function performance_uri(id) {
        return artfully.config.base_uri + "performances/" + id + ".jsonp?callback=?"
    }

    function order_uri() {
        return uri = artfully.config.store_uri + "order?reseller_id=", artfully.reseller() !== undefined && (uri += artfully.reseller()), uri
    }

    function donation_uri(id) {
        return artfully.config.base_uri + "organizations/" + id + "/authorization.jsonp?callback=?"
    }

    function cart_uri() {
        return uri = artfully.config.base_uri + "carts?reseller_id=", artfully.reseller() !== undefined && (uri += artfully.reseller()), uri
    }

    function next_events_uri(id) {
	return artfully.config.base_uri + "organizations/" + id + "/events.jsonp?callback=?";
    }

    function keyOnId(list) {
        var result = {};
        return jQuery.each(list, function (index, item) {
            result[item.id] = item
        }), result
    }

    function modelizeArray(data, model, callback) {
	return data && (jQuery.extend(data, model()), callback !== undefined && callback(data)), data;
    }

    function modelize(data, model, callback) {
        return data && (data instanceof Array ? jQuery.each(data, function (index, item) {
            modelize(item, model, callback)
        }) : (jQuery.extend(data, model()), callback !== undefined && callback(data))), data
    }

    return {
        ticket_uri: ticket_uri,
        performance_uri: performance_uri,
        event_uri: event_uri,
        show_uri: show_uri,
        donation_uri: donation_uri,
        order_uri: order_uri,
	next_events_uri: next_events_uri,
        keyOnId: keyOnId,
        modelize: modelize,
        modelizeArray: modelizeArray,
        cart_uri: cart_uri
    }
}(), artfully.widgets = function () {
    var artfully_event, cart, donation, next_events, artfully_events, widgetCache = {};
    return modelize_ticket_type = function (ticket_types, ticket_type_model, callback) {
        artfully.utils.modelize(ticket_types, ticket_type_model, callback)
    }, artfully_event = function () {
        function prep(data) {
	    artfully.utils.modelize(data.performances, artfully.models.performance, function (performance) {
                artfully.utils.modelize(performance.chart, artfully.models.chart, function (chart) {
                    jQuery.each(chart.sections, function (index, section) {
                        artfully.utils.modelize(section, artfully.models.section, modelize_ticket_type(section.ticket_types, artfully.models.ticket_type))
                    })
                })
            });
	    return artfully.utils.modelize(data, artfully.models.artfully_event);
        }

        function render(data, dom_id) {
            e = prep(data), e.render(jQuery(dom_id))
        }
        return widgetCache.artfully_event === undefined && (widgetCache.artfully_event = {
            display: function (id, target_dom_id) {
                var dom_id = target_dom_id ? target_dom_id : "#artfully-event";
                artfully.widgets.cart().display(), jQuery.getJSON(artfully.utils.event_uri(id), function (data) {
                    render(data, dom_id)
                })
            }
        }), widgetCache.artfully_event
    }, artfully_show = function () {
        function prep(data) {
	    artfully.utils.modelize(data.chart, artfully.models.chart, function (chart) {
                jQuery.each(chart.sections, function (index, section) {
                    artfully.utils.modelize(section, artfully.models.section, modelize_ticket_type(section.ticket_types, artfully.models.ticket_type))
                })
            });
            return artfully.utils.modelize(data.event, artfully.models.artfully_event), artfully.utils.modelize(data, artfully.models.performance), data
        }

        function render(data, domId) {
            var s = prep(data);
            s.render(jQuery(domId), !0, !0)
        }
        return widgetCache.artfully_show === undefined && (widgetCache.artfully_show = {
            display: function (id, targetDomId) {
                var domId = targetDomId || "#artfully-show";
                artfully.widgets.cart().display(), jQuery.getJSON(artfully.utils.show_uri(id), function (data) {
                    render(data, domId)
                })
            }
        }), widgetCache.artfully_show
    }, cart = function () {
        function hiddenFormFor(tickets, ticket_type_id) {
            var $form = jQuery(document.createElement("form")).attr({
                method: "post",
                target: artfully.widgets.cart().$iframe.attr("name"),
                action: artfully.utils.order_uri()
            });
            return jQuery.each(tickets, function (i, ticket) {
                jQuery(document.createElement("input")).attr({
                    type: "hidden",
                    name: "tickets[]",
                    value: ticket.id
                }).appendTo($form)
            }), jQuery(document.createElement("input")).attr({
                type: "hidden",
                name: "ticket_type_id",
                value: ticket_type_id
            }).appendTo($form), jQuery(document.createElement("input")).attr({
                type: "hidden",
                name: "cart[token]",
                value: artfully.widgets.cart().token
            }).appendTo($form), jQuery(document.createElement("input")).attr({
                type: "hidden",
                name: "reseller_id",
                value: artfully.reseller()
            }).appendTo($form), $form.appendTo(jQuery("body"))
        }
        var internal_cart = {
            init: function () {
                return this.$cart = jQuery("<div id='shopping-cart' class='hidden' />"), this.$controls = jQuery("<div id='shopping-cart-controls' />").appendTo(this.$cart), jQuery("<span class='cart-name' />").text("Shopping Cart").appendTo(this.$controls), that = this, jQuery.ajax({
                    dataType: "jsonp",
                    url: artfully.utils.cart_uri(),
                    success: function (json) {
                        artfully.widgets.cart().token = json.cart.token, that.$iframe = jQuery("<iframe name='shopping-cart-iframe' />").attr("src", artfully.utils.order_uri() + "&cart[token]=" + artfully.widgets.cart().token).height(artfully.config.maxHeight).hide().appendTo(that.$cart), artfully.config.cartLock.resolve()
                    }
                }), this.$cart
            },
            display: function () {
                this.$cart.appendTo("body")
            },
            add: function (tickets, ticket_type_id) {
                hiddenFormFor(tickets, ticket_type_id).submit().remove(), this.show()
            },
            show: function () {
                this.$cart.addClass("shown").removeClass("hidden"), this.$iframe.slideDown()
            },
            hide: function () {
                this.$cart.addClass("hidden").removeClass("shown"), this.$iframe.slideUp()
            },
            toggle: function () {
                this.$cart.hasClass("shown") ? this.hide() : this.show()
            }
        };
        return widgetCache.cart === undefined && (internal_cart.init(), internal_cart.$controls.click(function () {
            cart().toggle()
        }), widgetCache.cart = internal_cart), widgetCache.cart
    }, donation = function () {
        function prep(donation) {
            return artfully.utils.modelize(donation, artfully.models.donation)
        }

        function authorize(donation) {
            jQuery.getJSON(artfully.utils.donation_uri(donation.organizationId), function (data) {
                data.authorized && (donation.type = data.type, donation.fsp_name = data.fsp_name, artfully.config.cartLock.done(function () {
                    donation.render(jQuery("#donation"))
                }))
            })
        }

        function render(data) {
            var donation = prep(data);
            authorize(donation)
        }
        return widgetCache.donation === undefined && (widgetCache.donation = {
            display: function (id) {
                var data = {
                    organizationId: id
                };
                render(data)
            }
        }), widgetCache.donation
    }, next_events = function() {
        function prep(data) {
	    es = artfully.utils.modelizeArray(data, artfully.models.next_events);
            return es;
        }

        function render(data, numEvents, dom_id) {
            e = prep(data);
	    if(e.length > 0) {
		e.reduce(numEvents);
		e.render(jQuery(dom_id));
	    } else {
		jQuery(dom_id).append(jQuery("<div>").addClass("event-info").text("There are no upcoming events at this time."));
	    }
        }
        return widgetCache.next_events === undefined && (widgetCache.next_events = {
            display: function (id, numEvents, target_dom_id) {
                var dom_id = target_dom_id ? target_dom_id : "#artfully-next-events";
		var num_events = numEvents ? numEvents : 1;
                jQuery.getJSON(artfully.utils.next_events_uri(id), function (data) {
                    render(data, num_events, dom_id)
                })
            }
        }), widgetCache.next_events
    }, artfully_events = function() {
	var myData;

        function prep(data) {
	    return artfully.utils.modelizeArray(data, artfully.models.artfully_events);
        }

        function render(year, month, dom_id) {
	    var monthName = getMonthName(month, true);
	    for (var i = 0; i < myData.length; i++) {
		for(var j = 0; j < myData[i].shows.length; j++) {
		    var show = myData[i].shows[j];
		    var showDate = new Date();
		    showDate.setTime(Date.parse(show.datetime));
		    if(showDate.getYear() === year && showDate.getMonth() === month) {
			var hrs = showDate.getHours();
			var ampm = hrs >= 12 ? "pm" : "am";
			hrs = hrs % 12;
			hrs = hrs == 0 ? 12 : hrs;
			var min = showDate.getMinutes() == 0 ? "" : ":" + showDate.getMinutes();
			var time = hrs+min+ampm;
			var title = "<a href=https://www.artful.ly/store/events/"+myData[i].id+" target=\"artfully\">"+myData[i].name+"</a>";
			var eventDiv = jQuery("<div>").addClass("art-event").html(time+": "+title);
			jQuery("#art-day-" + monthName + "-" + showDate.getDate()).append(eventDiv);
		    }
		}
	    }
        }

	function getMonthName(monthNum, useShort) {
	    var monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"]
	    var shortMonthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
	    return useShort ? shortMonthNames[monthNum] : monthNames[monthNum];
	}

        return widgetCache.artfully_events === undefined && (widgetCache.artfully_events = {
            display: function (id, year, month, target_dom_id) {
                var dom_id = target_dom_id ? target_dom_id : ".artfully-calendar";
		if(myData === undefined) {
		    jQuery.getJSON(artfully.utils.next_events_uri(id), function (data) {
			myData = prep(data);
			render(year, month, dom_id);
		    });
		} else {
		    render(year, month, dom_id);
		}
            }
        }), widgetCache.artfully_events
    }, {
        event: artfully_event,
        show: artfully_show,
        cart: cart,
        donation: donation,
	next_events: next_events,
	artfully_events: artfully_events
    }
}(), artfully.models = function () {
    var chart, section, ticket_type, performance, artfully_event, donation, next_events, artfully_events;
    return modelCache = {}, chart = function () {
        return modelCache.chart === undefined && (modelCache.chart = {
            render: function ($target, expanded) {
                res = this.container().appendTo($target), expanded == 0 && res.hide()
            },
            container: function () {
                var $c = jQuery(document.createElement("ul")).addClass("ticket-types");
                return jQuery.each(this.sections, function (index, section) {
                    section.render($c)
                }), $c
            }
        }), modelCache.chart
    }, ticket_type = function () {
        return modelCache.ticket_type === undefined && (modelCache.ticket_type = {
            render: function ($t) {
                this.$target = this.container(), this.render_info(this.$target), this.render_form(this.$target), this.$target.appendTo($t)
            },
            container: function () {
                return jQuery(document.createElement("li"))
            },
            render_info: function ($target) {
                jQuery(document.createElement("span")).addClass("ticket-type-name").text(this.name).appendTo($target), jQuery(document.createElement("span")).addClass("ticket-type-price").text("$" + new Number(this.price) / 100).appendTo($target)
            },
            render_form: function ($target) {
                var $select, $form = jQuery(document.createElement("form")).appendTo($target),
                    obj = this,
                    i, available = Math.min(this.available, 10);
                $select = jQuery(document.createElement("select")).attr({
                    name: "ticket_count"
                }).addClass("ticket_count").appendTo($form);
                if (available > 0) {
                    jQuery(document.createElement("option")).text("1 Ticket").attr("value", 1).appendTo($select);
                    for (i = 2; i <= available; i++) jQuery(document.createElement("option")).text(i + " Tickets").attr("value", i).appendTo($select)
                } else jQuery(document.createElement("option")).text("No Tickets Available").attr("value", 0).appendTo($select);
                jQuery(document.createElement("input")).attr("type", "submit").val("Go").appendTo($form), $form.submit(function () {
                    var params = {
                        limit: $select.val(),
                        show_id: jQuery(this).closest(".performance").data("performance").id,
                        ticket_type_id: obj.id,
                        price: obj.price
                    };
                    return jQuery.getJSON(artfully.utils.ticket_uri(params), function (data) {
                        data !== null && data.length > 0 ? (data.length < $select.val() && artfully.alert("Only " + data.length + " ticket(s) could be found for this performance."), artfully.widgets.cart().add(data, obj.id)) : artfully.alert("Sorry! No tickets were available for purchase at this time.")
                    }), !1
                })
            }
        }), modelCache.ticket_type
    }, section = function () {
        return modelCache.section === undefined && (modelCache.section = {
            render: function ($target, expanded) {
                jQuery.each(this.ticket_types, function (index, ticket_type) {
                    ticket_type.render($target)
                }), expanded == 0 && res.hide()
            }
        }), modelCache.section
    }, performance = function () {
        return modelCache.performance === undefined && (modelCache.performance = {
            render: function (target, expanded, asRoot) {
                var $t, performance_link;
                asRoot === !0 ? ($t = target.addClass("performance"), jQuery("<h1>").addClass("event-name").text(this.event.name).appendTo($t), jQuery("<h2>").addClass("performance-datetime").text(this.show_time).appendTo($t)) : ($t = jQuery(document.createElement("li")).addClass("performance").appendTo(target), performance_link = jQuery(document.createElement("a")).addClass("performance-datetime").text(this.show_time).attr("href", "#").appendTo($t)), $t.data("performance", this), expanded == 0 && performance_link !== undefined && performance_link.click(function () {
                    return jQuery(this).closest(".performance").children(".ticket-types").slideToggle(), !1
                }), this.chart.render($t, expanded), this.$target = $t
            }
        }), modelCache.performance
    }, artfully_event = function () {
        return modelCache.artfully_event === undefined && (modelCache.artfully_event = {
            render: function ($target) {
                $target.data("event", this), $target.append(jQuery(document.createElement("h1")).addClass("event-name").text(this.name)).append(jQuery(document.createElement("h3")).addClass("event-producer").text(this.producer)), this.render_performances($target)
            },
            render_performances: function ($target) {
                $ul = jQuery(document.createElement("ul")).addClass("performances").appendTo($target), this.performances.length == 1 ? this.performances[0].render($ul, !0) : jQuery.each(this.performances, function (index, performance) {
                    performance.render($ul, !1)
                })
            }
        }), modelCache.artfully_event
    }, donation = function () {
        return modelCache.donation === undefined && (modelCache.donation = {
            message: function ($key) {
                var messages = {
                    regular: "Donate now and help support our work. Donations are tax-deductible to the extent permitted by law.",
                    sponsored: this.fsp_name + " is a fiscally sponsored project of Fractured Atlas, a non-profit arts service organization. Contributions for the purposes of " + this.fsp_name + " must be made payable to Fractured Atlas and are tax-deductible to the extent permitted by law."
                };
                return messages[$key] || ""
            },
            render: function ($t) {
                var $form = jQuery(document.createElement("form")).attr({
                    method: "post",
                    target: artfully.widgets.cart().$iframe.attr("name"),
                    action: artfully.utils.order_uri()
                }),
                    $producer = jQuery(document.createElement("input")).attr({
                        type: "hidden",
                        name: "donation[organization_id]",
                        value: this.organizationId
                    }),
                    $amount = jQuery(document.createElement("input")).attr({
                        type: "text",
                        name: "donation[amount]"
                    }).addClass("currency"),
                    $token = jQuery(document.createElement("input")).attr({
                        type: "hidden",
                        name: "cart[token]",
                        value: artfully.widgets.cart().token
                    }),
                    $submit = jQuery(document.createElement("input")).attr({
                        type: "submit",
                        value: "Make Donation"
                    }),
                    $notice = jQuery(document.createElement("p")).html(this.message(this.type));
                $form.submit(function () {
                    artfully.widgets.cart().show()
                }), $notice.appendTo($t), $form.append($amount).append($producer).append($token).append($submit).appendTo($t), jQuery(".currency").each(function (index, element) {
                    var name = jQuery(this).attr("name"),
                        input = jQuery(this),
                        form = jQuery(this).closest("form"),
                        hiddenCurrency = jQuery(document.createElement("input"));
                    input.maskMoney({
                        showSymbol: !0,
                        symbolStay: !0,
                        allowZero: !0,
                        symbol: "$"
                    }), input.attr({
                        id: "old_" + name,
                        name: "old_" + name
                    }), hiddenCurrency.attr({
                        name: name,
                        type: "hidden"
                    }).appendTo(form), form.submit(function () {
                        hiddenCurrency.val(Math.round(parseFloat(input.val().substr(1).replace(/,/, "")) * 100))
                    })
                })
            }
        }), modelCache.donation
    }, next_events = function () {
        return modelCache.next_events === undefined && (modelCache.next_events = {
            render: function ($target) {
                $target.data("next-events", this);
		if($target.hasClass("widget")) {
		    jQuery.each(this, function(index, upcoming_event) {
			var isSingleShow = upcoming_event.first_showtime == upcoming_event.last_showtime;
			var startDate = upcoming_event.first_showtime.substr(upcoming_event.first_showtime.indexOf(',')+2,6);
			var endDate = upcoming_event.last_showtime.substr(upcoming_event.last_showtime.indexOf(',')+2,6);
			var dates = isSingleShow ? upcoming_event.first_showtime : 
			    startDate + ' - ' + endDate + "<br/>Next Show: " + upcoming_event.next_showtime;
			var storeUrl = "http://artful.ly/store/events/" + upcoming_event.id;
			var infoText = upcoming_event.artfully_ticketed ? "Tickets and More Info" : "More Info";
			$target.append(
			    jQuery("<div>").addClass("event").text(upcoming_event.name)
			);
			$target.append(
			    jQuery("<div>").addClass("event-info")
				.html(dates + "<br /><a href=\"" + storeUrl + "\" target=\"artfully\">" + infoText + "</a>")
			);
		    });
		} else {
		    jQuery.each(this, function(index, upcoming_event) {
			$target.append(
			    jQuery(document.createElement("h1")).addClass("event-name").text(upcoming_event.name)
			);
		    });
		}
            },
	    reduce: function(numEvents) {
		var today = new Date();
		for(var i = this.length-1; i >=0; i--) {
		    var numShows = this[i].shows.length;
		    //Remove this event if it ends after today
		    if(numShows == 0 || Date.parse(this[i].shows[numShows-1].datetime)-today < 0) {
			this.splice(i, 1);
		    } else {
			//Run through the shows and add a "next_showtime" property
			var nextDatetime = 0;
			var nextShowtime = '';
			for(var j = 0; j < numShows; j++) {
			    var thisDatetime = Date.parse(this[i].shows[j].datetime);
			    nextDatetime = (nextDatetime === 0 && thisDatetime-today > 0) || 
				(thisDatetime !== undefined && thisDatetime-today > 0 && thisDatetime < nextDatetime) ? thisDatetime : nextDatetime;
			    nextShowtime = nextDatetime === thisDatetime ? this[i].shows[j].show_time : nextShowtime;
			}
			var showtimes = { 
			    first_showtime: this[i].shows[0].show_time,
			    last_showtime: this[i].shows[numShows-1].show_time,
			    next_showtime: nextShowtime,
			    next_datetime: nextDatetime
			};
			jQuery.extend(this[i], showtimes);
		    }
		}
		if(numEvents > 0 && this.length > 0) {
		    this.sort(function(a,b) { return a.next_datetime - b.next_datetime; });
		    var to_cut = this.length - numEvents;
		    this.splice(numEvents-1, to_cut);
		} else {
		    while(this.length > 0) {
			this.pop();
		    }
		}
	    }
        }), modelCache.next_events
    }, artfully_events = function () {
        return modelCache.artfully_events === undefined && (modelCache.artfully_events = {
        }), modelCache.artfully_events
    }, {
        chart: chart,
        section: section,
        ticket_type: ticket_type,
        performance: performance,
        artfully_event: artfully_event,
        donation: donation,
	next_events: next_events,
	artfully_events: artfully_events
    }
}();
