//domain, twitter
var total_steps = 36;
var step_counter = 0;

$( "#submit-name" ).click(function() {
    if ($('#name-input').val()) {
      processName();
    }
});

function processName() {
    var word = $('#name-input').val().replace(/ /g,'');
    $("#display-name").text(word);
    $("#form-box").hide();
    $("#name-box").show();
    for (var i = 1; i < 30; i++) fakeProgress();
    checkDomainNames(word);
    socialChecker(word, 'facebook');
    socialChecker(word, 'github');
    socialChecker(word, 'instagram');
    socialChecker(word, 'medium');
    socialChecker(word, 'twitter');
}

function increaseProgress() {
    step_counter++;
    percent_done = Math.round((step_counter/total_steps) * 100);
    $('#name-progress').attr('aria-valuenow', percent_done).css('width', percent_done + "%");
    if (percent_done >= 100){
        $("#name-progress").hide();
    }
}

function fakeProgress(){
    var wait =  Math.floor(Math.random() * (10000 - 1) + 1);
    setTimeout(increaseProgress, wait);
}


function createAvailabilityBox(status, text, url) {
    var template = `<div class="alert alert-${status}" role="alert">
                        <a href="${url}" class="alert-link">${text}</a>
                    </div>`
    return template;
}

function createAvailabilityBoxToggle(status, text, url) {
    var template = `<div class="alert alert-${status}" role="alert">
                        <a href="${url}" data-toggle="modal" class="alert-link">${text}</a>
                    </div>`
    return template;
}

//////////////////////////////////////////
// Domains
//////////////////////////////////////////
function checkDomainNames(word) {
    $.post( "https://namechecker2000.azurewebsites.net/api/DomainNameChecker", JSON.stringify({ "word": word })).done(function( data ) {
        increaseProgress()
        displayAvailableDomains(data.available);
        displayUnavailableDomains(data.unavailable);
    });
}

function displayAvailableDomains(domains) {
    domains.forEach(function(domain){
        var tld = domain.split('.').pop()
        var snippet = createAvailabilityBoxToggle('success', tld, '#buy-modal');
        $("#available-domains").append(snippet);
        increaseProgress();
        $("#available-box").show();
        //$("#available-domains-header").show();
    });
}

function displayUnavailableDomains(domains) {
    domains.forEach(function(domain){
        console.log(domain);
        var tld = domain.split('.').pop()
        var url = "http://" + domain;
        var snippet = createAvailabilityBox('danger', tld, url);
        $("#unavailable-domains").append(snippet);
        increaseProgress();
        $("#unavailable-box").show();
        //$("#unavailable-domains-header").show();
    });
}


//////////////////////////////////////////
// Social Check
//////////////////////////////////////////

function socialBaseURL(service) {
    switch (service) {
        case 'facebook':
            return 'https://www.facebook.com';

        case 'github':
            return 'https://github.com';

        case 'github':
            return 'https://github.com';

        case 'instagram':
            return 'https://www.instagram.com';

        case 'medium':
            return 'https://medium.com';

        case 'twitter':
            return 'https://twitter.com';
    }
}

function socialUserURL(word, service) {
    switch (service) {
        case 'facebook':
            return 'https://www.facebook.com/' + word;

        case 'github':
            return 'https://github.com/' + word;

        case 'github':
            return 'https://github.com/' + word;

        case 'instagram':
            return 'https://www.instagram.com/' + word;

        case 'medium':
            return 'https://medium.com/@' + word;

        case 'twitter':
            return 'https://twitter.com/' + word;
    }
}

function socialIconSnippet(service) {
    return '<i class="fa fa-' + service + '" aria-hidden="true"></i>';
}

function socialChecker(word, service) {
    $.post("https://namechecker2000.azurewebsites.net/api/SocialChecker", JSON.stringify({ "word": word, "service": service })).done(function( data ) {
        console.log(data);
        if (data.available) {
            displayServiceAvailable(word, service);
        } else {
            displayServiceUnavailable(word, service);
        }
    });
}

function displayServiceAvailable(word, service) {
    var snippet = createAvailabilityBox('success', socialIconSnippet(service), socialBaseURL(service));
    $("#available-social").append(snippet);
    $("#available-box").show();
    //$("#available-social-header").show();
    increaseProgress();
}

function displayServiceUnavailable(word, service) {
    var snippet = createAvailabilityBox('danger', socialIconSnippet(service), socialUserURL(word, service));
    $("#unavailable-social").append(snippet);
    $("#unavailable-box").show();
    //$("#unavailable-social-header").show();
    increaseProgress();
}
