$(document).ready(function() {
    var cv = {
        init : function() {
            var me = this;

            me.highlightActiveLink();

            $(document).scroll(function(){
                me.highlightActiveLink();
            });

            $('.side-bar a').click(function(e) {
                e.preventDefault();
                var target = $(this.hash);
                me.scrollSlowly(target.offset().top - 40);
            });

            $('.go-top-btn').click(function() {
                me.scrollSlowly(0);
            });

            me.filterPortfolioItems('*');

            $('.portfolio-filter a').click(function(){
                me.swapClassActive($('.portfolio-filter .active'), $(this));
                var selector = $(this).attr('data-filter');
                me.filterPortfolioItems(selector);
                return false;
            });

            $('.open-edit-btn').click(function(){
                $('#skills-section form').slideToggle(300);
            });

            $('#skills-section form').submit(function(e){
                e.preventDefault();
                var skillName = $('#skill-name').val(),
                    skillRange = $('#skill-range').val(),
                    skillsContainer = $('.skills-container'),
                    newSkill = $("<div/>");
                newSkill.width(skillRange + '%');
                newSkill.text(skillName);
                newSkill.attr('data-skill', skillName.toLowerCase());
                newSkill.appendTo(skillsContainer);
                this.reset();
            });

            $('#skills-section').hover(function() {
                $('.open-edit-btn').css('visibility','visible');
            }, function() {
                $('.open-edit-btn').css('visibility','hidden');
            });

            me.loadMoreEducationItems();

            $('.edu-container ul').scroll(function(){
                if (me.isScrollAtTheBottom($(this))){
                    me.loadMoreEducationItems();
                }
            });
        },

        highlightActiveLink : function() {
            var scrollPos = $(document).scrollTop();
            $('.side-bar a').each(function () {
                var target = $(this.hash),
                    targetTop = target.position().top;
                if (targetTop - scrollPos <= 40) {
                    cv.swapClassActive($('.side-bar .active'), $(this));
                }
            });
        },

        swapClassActive : function(removeFrom, addTo) {
            $(removeFrom).removeClass("active");
            $(addTo).addClass("active");
        },

        filterPortfolioItems : function(selector) {
            $('.portfolio-container').isotope({
                filter: selector
            });
        },

        scrollSlowly : function(destination) {
            $('body').stop()
                .animate({'scrollTop' : destination}, 500, 'swing');
        },

        appendEducationLiItem : function(date, title, text) {
            var li = $("<li/>"),
                aside = $("<aside/>"),
                asideHeader = $("<h4/>"),
                article = $("<article/>"),
                articleHeader = $("<h4/>"),
                p = $("<p/>");
            asideHeader.text(date);
            asideHeader.appendTo(aside);
            articleHeader.text(title);
            p.text(text);
            articleHeader.appendTo(article);
            p.appendTo(article);
            aside.appendTo(li);
            article.appendTo(li);
            li.appendTo($('.edu-container ul'));
        },

        baseRef : new Firebase("https://cv-markup.firebaseio.com/education"),

        loadMoreEducationItems : function() {
            var nextKey = $('.edu-container ul').children().length,
                limit = 5;
            cv.baseRef
                .orderByKey()
                .startAt(nextKey.toString())
                .limitToFirst(limit)
                .once("value", function(snapshot) {

                snapshot.forEach(function(childSnapshot){
                    var child = childSnapshot.val(),
                        date = child.date,
                        title = child.title,
                        text = child.text;
                    cv.appendEducationLiItem(date, title, text);
                });
            },  function (errorObject) {
                console.log("The read failed: " + errorObject.code);
            });
        },

        isScrollAtTheBottom : function(container) {
           return container.scrollTop() + container.height() == container[0].scrollHeight;
        }
    };
    cv.init();
});
