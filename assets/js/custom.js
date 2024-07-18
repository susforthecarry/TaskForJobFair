(function ($) {
	
	"use strict";

	// Page loading animation
	$(window).on('load', function() {

        $('#js-preloader').addClass('loaded');

    });


	$(window).scroll(function() {
	  var scroll = $(window).scrollTop();
	  var box = $('.header-text').height();
	  var header = $('header').height();

	  if (scroll >= box - header) {
	    $("header").addClass("background-header");
	  } else {
	    $("header").removeClass("background-header");
	  }
	})

	var width = $(window).width();
		$(window).resize(function() {
		if (width > 767 && $(window).width() < 767) {
			location.reload();
		}
		else if (width < 767 && $(window).width() > 767) {
			location.reload();
		}
	})

	const elem = document.querySelector('.event_box');
	const filtersElem = document.querySelector('.event_filter');
	if (elem) {
		const rdn_events_list = new Isotope(elem, {
			itemSelector: '.event_outer',
			layoutMode: 'masonry'
		});
		if (filtersElem) {
			filtersElem.addEventListener('click', function(event) {
				if (!matchesSelector(event.target, 'a')) {
					return;
				}
				const filterValue = event.target.getAttribute('data-filter');
				rdn_events_list.arrange({
					filter: filterValue
				});
				filtersElem.querySelector('.is_active').classList.remove('is_active');
				event.target.classList.add('is_active');
				event.preventDefault();
			});
		}
	}


	$('.owl-banner').owlCarousel({
		center: true,
      items:1,
      loop:true,
      nav: true,
	  navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>','<i class="fa fa-angle-right" aria-hidden="true"></i>'],
      margin:30,
      responsive:{
        992:{
            items:1
        },
		1200:{
			items:1
		}
      }
	});

	$('.owl-testimonials').owlCarousel({
	  center: true,
      items:1,
      loop:true,
      nav: true,
	  navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>','<i class="fa fa-angle-right" aria-hidden="true"></i>'],
      margin:30,
      responsive:{
        992:{
            items:1
        },
		1200:{
			items:1
		}
      }
	});


	// Menu Dropdown Toggle
	if($('.menu-trigger').length){
		$(".menu-trigger").on('click', function() {	
			$(this).toggleClass('active');
			$('.header-area .nav').slideToggle(200);
		});
	}


	// Menu elevator animation
	$('.scroll-to-section a[href*=\\#]:not([href=\\#])').on('click', function() {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			if (target.length) {
				var width = $(window).width();
				if(width < 767) {
					$('.menu-trigger').removeClass('active');
					$('.header-area .nav').slideUp(200);	
				}				
				$('html,body').animate({
					scrollTop: (target.offset().top) - 80
				}, 700);
				return false;
			}
		}
	});

	$(document).ready(function () {
	    $(document).on("scroll", onScroll);
	    
	    //smoothscroll
	    $('.scroll-to-section a[href^="#"]').on('click', function (e) {
	        e.preventDefault();
	        $(document).off("scroll");
	        
	        $('.scroll-to-section a').each(function () {
	            $(this).removeClass('active');
	        })
	        $(this).addClass('active');
	      
	        var target = this.hash,
	        menu = target;
	       	var target = $(this.hash);
	        $('html, body').stop().animate({
	            scrollTop: (target.offset().top) - 79
	        }, 500, 'swing', function () {
	            window.location.hash = target;
	            $(document).on("scroll", onScroll);
	        });
	    });
	});

	function onScroll(event){
	    var scrollPos = $(document).scrollTop();
	    $('.nav a').each(function () {
	        var currLink = $(this);
	        var refElement = $(currLink.attr("href"));
	        if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
	            $('.nav ul li a').removeClass("active");
	            currLink.addClass("active");
	        }
	        else{
	            currLink.removeClass("active");
	        }
	    });
	}


	// Page loading animation
	$(window).on('load', function() {
		if($('.cover').length){
			$('.cover').parallax({
				imageSrc: $('.cover').data('image'),
				zIndex: '1'
			});
		}

		$("#preloader").animate({
			'opacity': '0'
		}, 600, function(){
			setTimeout(function(){
				$("#preloader").css("visibility", "hidden").fadeOut();
			}, 300);
		});
	});

	const dropdownOpener = $('.main-nav ul.nav .has-sub > a');

    // Open/Close Submenus
    if (dropdownOpener.length) {
        dropdownOpener.each(function () {
            var _this = $(this);

            _this.on('tap click', function (e) {
                var thisItemParent = _this.parent('li'),
                    thisItemParentSiblingsWithDrop = thisItemParent.siblings('.has-sub');

                if (thisItemParent.hasClass('has-sub')) {
                    var submenu = thisItemParent.find('> ul.sub-menu');

                    if (submenu.is(':visible')) {
                        submenu.slideUp(450, 'easeInOutQuad');
                        thisItemParent.removeClass('is-open-sub');
                    } else {
                        thisItemParent.addClass('is-open-sub');

                        if (thisItemParentSiblingsWithDrop.length === 0) {
                            thisItemParent.find('.sub-menu').slideUp(400, 'easeInOutQuad', function () {
                                submenu.slideDown(250, 'easeInOutQuad');
                            });
                        } else {
                            thisItemParent.siblings().removeClass('is-open-sub').find('.sub-menu').slideUp(250, 'easeInOutQuad', function () {
                                submenu.slideDown(250, 'easeInOutQuad');
                            });
                        }
                    }
                }

                e.preventDefault();
            });
        });
    }

})(window.jQuery);
document.addEventListener('DOMContentLoaded', () => {
	const customerTable = document.getElementById('customerTable').getElementsByTagName('tbody')[0];
	const searchName = document.getElementById('searchName');
	const searchAmount = document.getElementById('searchAmount');
	const transactionChartCtx = document.getElementById('transactionChart').getContext('2d');
	let transactionChart;
  
	let customers = [];
	let transactions = [];
	let filteredTransactions = [];
  
	const fetchData = async () => {
	  try {
		const response = await fetch('./db.json');
		const data = await response.json();
		customers = data.customers;
		transactions = data.transactions;
		filteredTransactions = transactions;
		displayData();
	  } catch (error) {
		console.error('Error fetching data:', error);
	  }
	};
  
	const displayData = () => {
	  customerTable.innerHTML = '';
	  filteredTransactions.forEach(transaction => {
		const customer = customers.find(cust => cust.id === transaction.customer_id);
		if (customer) {
		  const row = customerTable.insertRow();
		  row.insertCell(0).innerText = customer.name;
		  row.insertCell(1).innerText = transaction.date;
		  row.insertCell(2).innerText = transaction.amount;
		}
	  });
	};
  
	const filterData = () => {
	  const nameFilter = searchName.value.toLowerCase();
	  const amountFilter = searchAmount.value;
  
	  filteredTransactions = transactions.filter(transaction => {
		const customer = customers.find(cust => cust.id === transaction.customer_id);
		if (!customer) {
		  return false;
		}
		const matchesName = customer.name.toLowerCase().includes(nameFilter);
		const matchesAmount = !amountFilter || transaction.amount === Number(amountFilter);
		return matchesName && matchesAmount;
	  });
  
	  displayData();
	};
  
	searchName.addEventListener('input', filterData);
	searchAmount.addEventListener('input', filterData);
  
	const createChart = (customerId) => {
	  const customerTransactions = transactions.filter(transaction => transaction.customer_id === customerId);
	  const dates = [...new Set(customerTransactions.map(trans => trans.date))];
	  const totalAmounts = dates.map(date => {
		return customerTransactions
		  .filter(trans => trans.date === date)
		  .reduce((total, trans) => total + trans.amount, 0);
	  });
  
	  if (transactionChart) {
		transactionChart.destroy();
	  }
  
	  transactionChart = new Chart(transactionChartCtx, {
		type: 'line',
		data: {
		  labels: dates,
		  datasets: [{
			label: 'Total Transaction Amount',
			data: totalAmounts,
			borderColor: 'rgba(75, 192, 192, 1)',
			borderWidth: 1
		  }]
		},
		options: {
		  scales: {
			y: {
			  beginAtZero: true
			}
		  }
		}
	  });
	};
  
	customerTable.addEventListener('click', (event) => {
	  const customerName = event.target.closest('tr').cells[0].innerText;
	  const customer = customers.find(cust => cust.name === customerName);
	  if (customer) {
		createChart(customer.id);
	  }
	});
  
	fetchData();
  });
  