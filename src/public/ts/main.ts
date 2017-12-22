import * as moment from "moment";

const $header = $("#js-header"),
    $body = $(document.body),
    $html = $("html"),
    $headerTitle = $("#js-header-title"),
    $headerH1 = $("#js-header-title h1");

// ranges for header animation
let animateRange = { start: 30, end: 340 },
    headerHeight: {start: number, end: number},
    headerTitleBottom: {start: number, end: number},
    headerTitleAngle: {start: number, end: number},
    headerTitleHeight: {start: number, end: number},
    headerH1Scaling: {start: number, end: number},
    headerH1Top: {start: number, end: number},
    socialOffset: number,
    publicationsOffset: number
;

$(window).resize(function () {

    // Get scroll position for sections
    socialOffset = $(".js-nav-social").first().offset().top;
    publicationsOffset = $(".js-nav-publications").first().offset().top;

    // Change animation settings and state of nav menu
    if ($(this).width() >= 1120) {
        animateRange = { start: 10, end: 340 };
        headerHeight = { start: 440, end: 55 };
        headerTitleBottom = { start: -120, end: -15 };
        if ($(this).width() > 1920) {
            headerTitleAngle = { start: -5, end: 0 };
        } else {
            headerTitleAngle = { start: -7, end: 0 };
        }
        headerTitleHeight = { start: 240, end: 0 };
        headerH1Scaling = { start: 1, end: 0.2 };
        headerH1Top = { start: -107, end: -107 };

        $(".js-nav-menu-btn").removeClass("active");
        $(".js-nav-menu").show();

    } else if ($(this).width() >= 750) {
        animateRange = { start: 15, end: 200 };
        headerHeight = { start: 300, end: 55 };
        headerTitleBottom = { start: -120, end: -3 };
        headerTitleAngle = { start: -7, end: 0 };
        headerTitleHeight = { start: 240, end: 0 };
        headerH1Scaling = { start: 1, end: 0.3 };
        headerH1Top = { start: -72, end: -72 };

        $(".js-nav-menu-btn").removeClass("active");
        $(".js-nav-menu").hide();

    } else {
        animateRange = { start: 10, end: 120 };
        headerHeight = { start: 150, end: 55 };
        headerTitleBottom = { start: -240, end: -5 };
        headerTitleAngle = { start: -7, end: 0 };
        headerTitleHeight = { start: 300, end: 0 };
        headerH1Scaling = { start: 1, end: 0.4 };
        headerH1Top = { start: -45, end: -58 };

        $(".js-nav-menu-btn").removeClass("active");
        $(".js-nav-menu").hide();
    }

    $(window).trigger("scroll");

}).trigger("resize");


function interpolate(range: {start: number, end: number}, scrollRatio: number) {
    if (scrollRatio <= 0) {
        return range.start;
    } else if (scrollRatio >= 1) {
        return range.end;
    } else {
        return range.start + ((range.end - range.start) * scrollRatio);
    }
}

// Handle animations on scroll
$(window).scroll(function () {

    // 1. Handle header animation on scroll
    const scrollTop = $body.scrollTop() || $html.scrollTop();
    const scrollRatio = (scrollTop - animateRange.start) / (animateRange.end - animateRange.start);

    $header.css({
        height: interpolate(headerHeight, scrollRatio) + "px"
    });
    $headerTitle.css({
        transform: "rotate(" + interpolate(headerTitleAngle, scrollRatio) + "deg)",
        height: interpolate(headerTitleHeight, scrollRatio) + "px",
        bottom: interpolate(headerTitleBottom, scrollRatio) + "px"
    });
    $headerH1.css({
        transform: "scale(" + interpolate(headerH1Scaling, scrollRatio) + "," + interpolate(headerH1Scaling, scrollRatio) + ")",
        top: interpolate(headerH1Top, scrollRatio)
    });

    // 2. Handle hilighting of menu items on scroll
    if (scrollTop > socialOffset - 40) {
        $(".js-nav-link").removeClass("active");
        $(".js-nav-link-social").addClass("active");
    } else if (scrollTop > publicationsOffset - 80) {
        $(".js-nav-link").removeClass("active");
        $(".js-nav-link-publications").addClass("active");
    } else if (scrollTop > 350) {
        $(".js-nav-link").removeClass("active");
        $(".js-nav-link-profile").addClass("active");
    } else {
        $(".js-nav-link").removeClass("active");
    }
}).trigger("scroll");

// Feed builders
const feedBuilders: any = {
    pocketAdd: function (data: any) {

        let html = "<h3>" + data.title + "</h3>";
        if (data.excerpt) {
            html += "<p>" + data.excerpt + "</p>";
        }
        if (data.tags.length) {
            html += "<p class=\"tags\">";
            for (let i = 0; i < data.tags.length; i++) {
                html += "<span><span class=\"fa fa-circle-o\"></span> " + data.tags[i];
            }
            html += "</p>";
        }

        return {
            icon: "get-pocket",
            className: "pocket",
            action: "marque-page ajouté à pocket",
            html: html
        };
    },

    githubPush: function (data: any) {

        let html = "<h3>Push dans la branche " + data.branch + " de " + data.repoName + "</h3>";
        for (let i = 0; i < Math.min(3, data.messages.length); i++) {
            html += "<p class=\"commit\">" + data.messages[i] + "</p>";
        }
        if (data.messages.length > 3) {
            html += "<p class=\"more\">…et " + (data.messages.length - 3) + " de plus.</p>";
        }

        return {
            icon: "github",
            className: "github",
            action: "push de " + data.messages.length + " commit"
                + (data.messages.length > 1 ? "s" : "") + " sur github.com",
            html: html
        };
    },

    githubCreate: function (data: any) {
        return {
            icon: "github",
            className: "github",
            action: "dépôt github.com crée",
            html: "<h3>Dépôt " + data.repoName + " crée</h3>"
        };
    },

    stackoverflowAnswer: function (data: any) {
        return {
            icon: "stack-overflow",
            className: "stackoverflow",
            action: "réponse à une question stackoverflow",
            html: "<h3>Réponse à \"" + data.questionTitle + "\"</h3><p>" + data.answerDescription + "</p>"
        };
    },

    stackoverflowBadge: function (data: any) {
        return {
            icon: "trophy",
            className: "stackoverflow-badge",
            action: "badge stackoverflow obtenu",
            html: "<h3>Bagde \"" + data.badgeTitle + "\" obtenu</h3><p>sur stackoverflow</p>"
        };
    },

    mediumArticle: function (data: any) {
        return {
            icon: "medium",
            className: "medium",
            action: "nouvel article publié sur medium.com",
            html: "<h3>" + data.title + "</h3>"
        };
    },

    instagramPicture: function (data: any) {

        let html = "";
        data.images.forEach((image: any) => {

            let title = "";
            if (image.title) {
                title = image.title;
                if (image.location) {
                    title += "<span class=\"location\"><i class=\"fa fa-map-marker\"></i> " + image.location + "</span>";
                }
            } else if (image.location) {
                title = image.location;
            }
            if (title) {
                title = "<h3>" + title + "</h3>";
            }

            html += "<div class=\"instagram-picture\">" + title
                + "<p><img src=\"" + image.url + "\" width=\"" + Math.floor(image.width / 2) + "\" height=\"" + Math.floor(image.height / 2) + "\" alt=\"" + (image.location ? image.location : "") + "\" /></p></div>";
        });

        return {
            icon: "instagram",
            className: "instagram",
            action: "photo" + (data.images.length > 1 ? "s" : "") + " publiée" + (data.images.length > 1 ? "s" : "") + " sur instagram",
            html: html + "<div class=\"clearfix\"></div>"
        };
    }
};

$(function () {

    // Manage nav menu button
    $(".js-nav-menu-btn").click(function (e) {
        e.stopPropagation();
        $(this).addClass("active");
        $(".js-nav-menu").show();
    });
    $(window).click(function () {
        if ($(".js-nav-menu-btn:visible").length) {
            $(".js-nav-menu-btn").removeClass("active");
            $(".js-nav-menu").hide();
        }
    });

    // Load feed
    try {
        $.getJSON("feed.json").then(function (data) {
            const feedItems: any[] = [];
            data.forEach(function (element: any) {
                if (typeof feedBuilders[element.type] != "undefined") {
                    const feedItem = feedBuilders[element.type](element.data);
                    feedItems.push(
                        "<li class=\"feed-item js-feed-item\">"
                        + "<div class=\"feed-icon " + feedItem.className + "\"><span class=\"fa fa-" + feedItem.icon + "\"></span></div>"
                        + "<div class=\"date\"><span title=\"" + (new Date(element.date)).toLocaleString() + "\">" + moment(element.date).fromNow() + "</span>"
                        + " — " + feedItem.action + "</div>"
                        + feedItem.html
                        + "</li>"
                    );
                }
            }, this);
            if (feedItems.length) {
                $(".js-feed-placeholder").first().html("<ul><li class=\"feed-end\"></li>"
                    + feedItems.join("") + "<li class=\"feed-end hidden\"></li></ul><a id=\"js-feed-show-all\" class=\"feed-show-all\">Afficher plus...</a>");
                $(".js-feed-item").slice(15).hide();

                // show all feed entries
                $("#js-feed-show-all").click(function () {
                    $(".js-feed-item").show();
                    $(".feed-end").removeClass("hidden");
                    $(this).hide();
                });
            }

            // Update scroll position for sections
            socialOffset = $(".js-nav-social").first().offset().top;
            publicationsOffset = $(".js-nav-publications").first().offset().top;
        });
    } catch (e) {
        console.log(e);
    }

    // send message form
    $("#js-contact-form").submit(function (e) {
        e.preventDefault();

        $("#js-contact-form-loading").removeClass("hidden");
        $("#js-contact").addClass("hidden");

        $.post("/send-message", {
            name: $("#name").val(),
            email: $("#email").val(),
            message: $("#message").val()
        }).done(function (data) {
            if (data.success) {
                $("#js-contact-form-loading").addClass("hidden");
                $("#js-contact-form-success").removeClass("hidden");
                setTimeout(function () {
                    $("#js-contact-modal").modal("hide");
                }, 3000);
            } else {
                $("#js-contact-form-loading").addClass("hidden");
                $("#js-contact-form-error").removeClass("hidden");
            }
        }).fail(function (err) {
            $("#js-contact-form-loading").addClass("hidden");
            $("#js-contact-form-error").removeClass("hidden");
        });
    });
    $("#js-contact-modal").on("show.bs.modal", function (e) {
        $("#js-contact-form-loading, #js-contact-form-error, #js-contact-form-success").addClass("hidden");
        $("#js-contact").removeClass("hidden");
    });
});