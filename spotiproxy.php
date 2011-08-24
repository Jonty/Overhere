<?php

    $aRaw = file('http://ws.spotify.com/search/1/track?q='.urlencode($_GET['q']));
    $oXml = simplexml_load_string(implode('', $aRaw));
    $aData = (array) $oXml;

    $returnData = array();

    $country = geoip_country_code_by_name($_SERVER['REMOTE_ADDR']);

    if (isset($aData['track']) && $aData['track']) {
        if (is_array($aData['track'])) {
            $aTracks = $aData['track'];
        } else {
            $aTracks = array($aData['track']);
        }

        foreach ($aTracks as $track) {

            $aTerritories = explode(' ', (string) $track->album->availability->territories);

            if (in_array($country, $aTerritories)){

                $aArtist = $track->artist;
                $artistName = '';

                if ($track->artist->count() > 1) {
                    $aArtists = array();
                    foreach ($track->artist as $artist) {
                        $aArtists []= $artist->name;
                    }

                    $artistName = implode(', ', $aArtists);
                } else {
                    $artistName = $track->artist->name;
                }

                $returnData = array(
                    'uri' => (string) $track['href'],
                    'name' => (string) $track->name,
                    'artist' => (string) $artistName,
                    'length' => (int) $track->length,
                );

                break;
            }
        }

    }

    echo $_GET['callback'].'('.json_encode($returnData).');';
