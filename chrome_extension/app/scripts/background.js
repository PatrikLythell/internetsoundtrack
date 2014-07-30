/*global $:false */
/*global SC:false */
'use strict';

SC.initialize({
    /*jshint camelcase: false */
    client_id: '8602754b7e631dee78add76ddd5169a2'
});


//var AudioContext = window.AudioContext||window.webkitAudioContext;
//var audio = new Audio();

function Player() {
    this.isPlaying = false;
    this.currentUrl = false;
    this.audio = new Audio();
}

Player.prototype.setText = function(badgeText) {
    console.log('setText');
    chrome.browserAction.setBadgeText({text: badgeText});
};

Player.prototype.playTrack = function(track) {
    console.log('playTrack');
    console.log(track);
    var _that = this;
    SC.get('/tracks/' + track, function(sound) {
        console.log('response from soundcloud');

        var url = 'http://api.soundcloud.com/tracks/' + track + '/stream?client_id=8602754b7e631dee78add76ddd5169a2';
        _that.audio.pause();
        _that.audio.src = url;
        _that.audio.play();

        _that.isPlaying = sound.user.username + ' - ' + sound.title;

        // _that.setText('Playing');
    });
};

Player.prototype.checkURL = function(tab) {
    console.log('checkURL');
    var urlMatch = new RegExp('^(http|https):\/\/([da-z.-]+)(.exposure)');
    return urlMatch.test(tab.url) && this.currentUrl !== tab.url;

};

Player.prototype.checkDB = function(tab) {
    console.log('checkDB');
    var _that = this;
    $.post('http://soundcloud.labs.lythell.com', {url: tab.url}, function(data) {
        if (data) {
            console.log(data);
            _that.playTrack(data);
        } else {
            console.log('no tracks found add one');
            if (!_that.audio.paused) { _that.audio.pause(); }
            _that.isPlaying = false;
            _that.setText = '';
        }
    });
};

Player.prototype.prepareSound = function(tab){
    console.log('prepareSound');
    if (this.checkURL(tab)) {
        this.currentUrl = tab.url;
        this.checkDB(tab);
    }
};

var player = new Player();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (request.track) {
        player.playTrack(request.track);
    } else {
        sendResponse(player.isPlaying);
    }
});

chrome.tabs.onHighlighted.addListener(function() {
    chrome.tabs.getSelected(null,function(tab) {
        player.prepareSound(tab);
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    player.prepareSound(tab);
});



