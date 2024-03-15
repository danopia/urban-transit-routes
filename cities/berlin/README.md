# Berlin

The U-Bahn, S-Bahn, and Tram route lines were pulled from this open dataset:

[Strukturkarte Berlin und Umland (SBU) - [WMS]](https://daten.berlin.de/datensaetze/strukturkarte-berlin-und-umland-sbu-wms)

There is one file for the route lines, and another file for the station points.
Beyond distinguishing U/S/Tram, no further information about route numbers or station names is included.

The WFS GetCapabilities calls for these datasets are here:

* [ÖPNV-Bahnnetz](https://fbinter.stadt-berlin.de/fb/wfs/data/senstadt/s_sbu_oepnv_l?REQUEST=GetCapabilities&SERVICE=wfs) with `Point` features
* [ÖPNV-Bahnhöfe](https://fbinter.stadt-berlin.de/fb/wfs/data/senstadt/s_sbu_oepnv_p?REQUEST=GetCapabilities&SERVICE=wfs) with `LineString` features

## GeoJSON

Fortunately for modern use, the WFS endpoints are capable of giving GeoJSON:

* `https://fbinter.stadt-berlin.de/fb/wfs/data/senstadt/s_sbu_oepnv_l?service=wfs&version=2.0.0&request=GetFeature&typeNames=s_sbu_oepnv_l&outputFormat=application/geo%2Bjson`
* `https://fbinter.stadt-berlin.de/fb/wfs/data/senstadt/s_sbu_oepnv_p?service=wfs&version=2.0.0&request=GetFeature&typeNames=s_sbu_oepnv_p&outputFormat=application/geo%2Bjson`

Unfortunately, the dataset is given in the [EPSG:25833](https://epsg.io/25833) coordinate system, so a translation must be done in order for services like Mapbox to accept the coordinates. A `process.ts` script is included for this purpose.

## Properties

* `Bahn_Typ_kurz`: `U`, `S_R`, `T`, etc
* `Bahn_Typ`: `U-Bahn`, `S-, Regionalbahn`, `Tram`, etc
