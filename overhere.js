var pathToProxy = 'http://jonty.co.uk/bits/overhere/';
var lastfmApiKey = 'b25b959554ed76058ac220b7b2e0a026';

var user = '';
var queue = Array();
var tracksSeen = Array();
var playing = false;

function getTracks () {
    $.getJSON('http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=' + 
            user + '&api_key=' + lastfmApiKey + '&format=json&callback=?',

        function (data) {
            if (data.recenttracks) {
                tracks = data.recenttracks.track.reverse();
                addTracksToQueue(tracks);
            }
        }
    );

    setTimeout('getTracks()', 30*1000);
}

function addTracksToQueue (tracks) {
    $.each (tracks, function(i, track) {
        if ('date' in track) {

            var tenMinsAgo = Date.now().add(-20).minutes();
            var trackTime = Date.parse(track.date['#text']).add(1).hour();

            if (trackTime.compareTo(tenMinsAgo) == 1 && !(track['date'].uts in tracksSeen)) {

                tracksSeen[track['date'].uts] = 1;

                $.getJSON(pathToProxy + 'spotiproxy.php?q=' + 
                        escape(track.artist['#text'] + ' ' + track.name) + '&callback=?',

                    function (data) {
                        if ('uri' in data) {
                            queue.push(data);
                            if (playing == false) {
                                nextTrack();
                            }
                        }
                    });
            }
        }
    });

    if (tracksSeen.length == 0) {
        $('#status').text(
            'It looks like that user isn\'t listening right now, try another user?'
        );
        $('#status').show();
        showUserInput();
    }
}

function nextTrack () {
    $('#userInput').hide();

    if (queue.length) {

        playing = true;
        track = queue.shift();

        $('#status').hide();
        $('#playStatus').show();
        $('#nowPlaying').text(track['artist'] + ' - ' + track['name']);

        oldFrame = $('#musicFrame');
        if (oldFrame) {
            oldFrame.remove();
        }

        if (document.createElement && (iframe = document.createElement('iframe'))) {
            iframe.src = track['uri'];
            iframe.name = 'musicFrame';
            iframe.id = 'musicFrame';
            iframe.height = 1;
            iframe.width = 1;
            document.body.appendChild(iframe);
        }

        setTimeout('nextTrack()', (track['length'] * 1000));

    } else {

        playing = false;
        $('#playStatus').hide();
        $('#status').show();
        $('#status').text('Run out of tracks to play, wait a minute...');

    }
}

function play () {
    getTracks();

    if (playing == false) {
        $('#playStatus').hide();
        $('#status').text('Looking for recent tracks to play...');
        setTimeout('play()', 10*1000);
    }
}

function start() {
    user = $('#username').val();
    
    if (!user) {
        return;
    }

    $('#usertext').text(user);
    $('#note').hide();

    play();
    hideUserInput();

    return false;
}

function showUserInput () {
    $('#switchUser').hide();
    $('#userInput').show();
}

function hideUserInput () {
    $('#switchUser').show();
    $('#userInput').hide();
}
