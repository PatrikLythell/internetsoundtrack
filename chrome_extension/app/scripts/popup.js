/*global $:false */
/*global SC:false */
'use strict';
$('#signup').hide();
$('#info-wrapper').hide();

var urlMatch = new RegExp('^(http|https):\/\/([da-z.-]+)(.exposure)');

SC.initialize({
    /*jshint camelcase: false */
    client_id: '8602754b7e631dee78add76ddd5169a2'
});



chrome.cookies.get({url: 'http://soundcloud.com', name: 'soundtracker'}, function(cookie) {
    if (cookie) {
        $('#info-wrapper').show();
    } else {
        var random = Math.random().toString(36).substring(7);
        $('#signup').show();
        $('#signup-button').on('click', function(e) {
            chrome.cookies.set({url: 'http://soundcloud.com', name: 'soundtracker', value: random, expirationDate: Date.now() + 1000000});
            window.open('http://soundcloud.labs.lythell.com/signup?user=' + random);
            e.preventDefault();
        });
    }
});

chrome.runtime.sendMessage({message: 'none'}, function(data) {
    if (data) {
        $('#info').html(data);
        $('#search-wrapper').hide();
    } else {
        $('#info').html('Add a song to this page:');
        $('#search-wrapper').show();
    }
});

chrome.tabs.getSelected(null, function(tab) {
    if (!urlMatch.test(tab.url)) {
        $('#search-wrapper').hide();
    }
});

$('input').on('keyup', function() {
    var inputVal = $(this).val();
    chrome.tabs.getSelected(null,function(tab) {
        if (urlMatch.test(tab.url)) {
            $('#search-wrapper').show();
            $('#list').empty();
            SC.get('/tracks/', {q: inputVal, license: 'cc-by-sa'}, function(sound, err) {
                if (err) {
                    console.log(err);
                }
                for (var i = 0; i < 4; i++) {
                    console.log(sound);
                    $('#list').append('<li data-id="' + sound[i].id + '">' + sound[i].user.username + ' ' + sound[i].title + '</li>');
                }
            });
        } else {
            $('#search-wrapper').hide();
        }
    });
});

$('body').on('click', '#list li', function() {
    var data = $(this).data('id');
    chrome.tabs.getSelected(null,function(tab) {
        if (urlMatch.test(tab.url)) {
            $('#search-wrapper').show();
            $.post('http://soundcloud.labs.lythell.com/save', {url: tab.url, value: data}, function() {
                window.close();
                chrome.runtime.sendMessage({track: data});
            });
        }
    });
});


