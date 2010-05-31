Overhere
=========

A hack for San Francisco Music Hack Day.

Overhere solves the problem of wanting to listen to your friends music. Simply
point it at the last.fm account of any person and Overhere will play back whatever
they listen to (with a ~10m delay) in Spotify.

It runs entirely in the browser, no local software is needed.

Spotify is the first supported playback engine, I'll add support for Playdar and
hopefully Grooveshark in a future version.

Notes
-----

* This is completely untested in anything other than firefox.
* Yes, I know, Spotify is only available in Europe. Sucks to be you.
* My javascript is so evil it should be imprisoned. Frontend is not my day job.

Known Bugs
----------

* Sporadically you might get tracks playing back in the wrong order, this is because the resolution callbacks are async and very occasionally return in the wrong order.
* Occasionally a track might fail to play due to country restrictions. This is because I've not actually implemented them - very VERY few tracks are not available in all current territories.
