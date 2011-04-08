var pathToProxy = '';
var lastfmApiKey = 'b310eee6bf595b01e4e07a9d78ff9609';

var user = '';
var queue = Array();
var tracksSeen = Array();
var playing = false;

function getTracks () {
    $.getJSON('http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=' + 
            user + '&api_key=' + lastfmApiKey + '&format=json&callback=?',

        function (data) {
            if ('recenttracks' in data && 'track' in data.recenttracks) {
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

            // Datejs timezone conversion is crack, so correct for it manually.
            var now = Date.now();
            var now = now.add(now.getTimezoneOffset()).minutes();

            var tenMinsAgo = now.add(-20).minutes();
            var trackTime = new Date();
            trackTime.setTime(track.date.uts*1000);

            if (trackTime.compareTo(tenMinsAgo) == 1 && !(track['date'].uts in tracksSeen)) {

                tracksSeen[track['date'].uts] = 1;

                $.getJSON(pathToProxy + 'spotiproxy.php?q=' + 
                        escape(track.artist.name + ' ' + track.name) + '&callback=?',

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

    window.location.hash = user;

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

function load () {
    hash = window.location.hash;
    user = hash.substring(1);
    $('#username').val(user);

    start();
}
