const SwipeNavigation = new class SwipeNavigation {};

SwipeNavigation.AppState = {
    version: 'v1.0.1',
    swipeScrollPosition: 0
}

SwipeNavigation.init = () => {

    if (!window.jQuery) return console.error("This version of Swipe Navigation requires jQuery to function.")
    // else console.info(`Running Swipe Navigation ${SwipeNavigation.AppState.version}`);

    var dashboardSwiper = $('[swipe-navigation-pages]');

    SwipeNavigation.setContentStyles();
    SwipeNavigation.setSwipeEvent(dashboardSwiper);
}

SwipeNavigation.setSwipeEvent = (dashboardSwiper) => {
    return dashboardSwiper.on('touchstart', function(e) {

        var swipe = e.originalEvent.touches,
        start = swipe[0].pageX;
        
        $(this).on('touchmove', function(e) {
    
            var contact = e.originalEvent.touches,
            end = contact[0].pageX,
            distance = end - start;
    
            if (distance < -150)  {
                $(this).off('touchmove');
                return SwipeNavigation.triggerSwipeNavigation('right');
            }
            if (distance > 150)  {
                $(this).off('touchmove');
                return SwipeNavigation.triggerSwipeNavigation('left');
            }
        })
        .on('touchend', function() {
            $(this).off('touchmove touchend');
        });
  
    });
}

SwipeNavigation.setContentStyles = () => {
    const swipeNavPages = document.querySelectorAll('[swipe-navigation-page]');
    const navScrollBar = document.querySelector('[nav-scrollbar]');
    const swipeNavPagesAll = document.querySelector('[swipe-navigation-pages]');
    const swipeNavPageWrapper = document.querySelector('[swipe-navigation-page-wrapper]');

    if (navScrollBar != null) {
        navScrollBar.style.position = "absolute";
        navScrollBar.style.height = "2px";
        navScrollBar.style.bottom = "0";
        navScrollBar.style.left = "0";
        navScrollBar.style.scrollBehavior = "smooth";
        navScrollBar.style.background = "#4c70e2";
        navScrollBar.style.width = `${100/swipeNavPages.length}%`;
    }

    if (swipeNavPagesAll != null) {
        swipeNavPagesAll.style.overflow = "hidden";
        swipeNavPagesAll.style.scrollBehavior = "smooth";
    } 

    if (swipeNavPageWrapper != null) {
        swipeNavPageWrapper.style.width = "max-content";
        swipeNavPageWrapper.style.scrollBehavior = "smooth";
        swipeNavPageWrapper.style.display = "flex";
    }

    if (swipeNavPages != null) swipeNavPages.forEach(page => page.style.width = `${window.screen.width}px`);
}

SwipeNavigation.triggerSwipeNavigation = (direction) => {
    const currentPosition = SwipeNavigation.AppState.swipeScrollPosition;
    const swipeNavPages = document.querySelectorAll('[swipe-navigation-page]');
    const dashboardSwiper = document.querySelector('[swipe-navigation-pages]');
    const dashboardSwiperWrapper = document.querySelector('[swipe-navigation-page-wrapper]');

    let scrollOffset = 0;
    let offset = dashboardSwiperWrapper.offsetWidth / swipeNavPages.length;

    if (direction == 'right' && currentPosition < (dashboardSwiperWrapper.offsetWidth - offset)) {
        scrollOffset = currentPosition + offset;
        SwipeNavigation.AppState.swipeScrollPosition += offset;
        dashboardSwiper.scrollTo(scrollOffset, 0);
        SwipeNavigation.scrollNavBar(swipeNavPages.length, {scrollOffset, offset});
    }
    else if (direction == 'left' && currentPosition > 0) {
        scrollOffset = currentPosition - offset;
        SwipeNavigation.AppState.swipeScrollPosition -= offset;
        dashboardSwiper.scrollTo(scrollOffset, 0);
        SwipeNavigation.scrollNavBar(swipeNavPages.length, {scrollOffset, offset});
    }
    else {
        dashboardSwiper.scrollTo(currentPosition, 0);
    }

    SwipeNavigation.scrollToTop();
}

SwipeNavigation.scrollNavBar = (navPageLength, offsetObj) => {
    $('[nav-scrollbar]').animate({left: `${(100/navPageLength) * (offsetObj.scrollOffset/offsetObj.offset)}%`});
}

SwipeNavigation.scrollToTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

SwipeNavigation.init();