<?php

    $aRaw = file('http://ws.spotify.com/search/1/track?q='.urlencode($_GET['q']));
    $oXml = simplexml_load_string(implode('', $aRaw));
    $aData = (array) $oXml;

    $returnData = array();

    if (isset($aData['track']) && $aData['track']) {
        if (is_array($aData['track'])) {
            $aTrack = (array) array_shift($aData['track']);
        } else {
            $aTrack = (array) $aData['track'];
        }

        $aArtist = (array) $aTrack['artist'];

        $returnData = array(
            'uri' => $aTrack['@attributes']['href'],
            'name' => $aTrack['name'],
            'artist' => $aArtist['name'],
            'length' => $aTrack['length'],
        );

    }

    echo $_GET['callback'].'('.json_encode($returnData).');';
