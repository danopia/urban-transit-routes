#!/usr/bin/env -S deno run --allow-read=/dev/stdin

import type {FeatureCollection, BBox, Position} from 'npm:@types/geojson';
import proj4 from 'npm:proj4';

// https://epsg.io/25833.proj4js
proj4.defs("EPSG:25833","+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");

// Convert a coord pair from Euro to global
// e.g. when the xml includes <wfs:DefaultCRS>urn:ogc:def:crs:EPSG:6.9:25833</wfs:DefaultCRS>
function transformPoint(coord: Position): [number, number] {
  return proj4('EPSG:25833', 'EPSG:4326', coord);
}

// TODO: better way of grabbing the whole input
const original = JSON.parse(await Deno.readTextFile('/dev/stdin')) as FeatureCollection;

// json.crs.properties.name = "EPSG:25833";
const newDoc: FeatureCollection = {
  ...original,
  //@ts-expect-error untyped
  crs: undefined,
  bbox: original.bbox ? [
    ...transformPoint([original.bbox[0], original.bbox[1]]),
    ...transformPoint([original.bbox[2], original.bbox[3]]),
  ] : undefined,
  features: original.features.map(feature => {
    if (feature.geometry.type == 'Point') {
      return {
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates: transformPoint(feature.geometry.coordinates),
        },
      };
    }
    if (feature.geometry.type == 'LineString') {
      return {
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates: feature.geometry.coordinates.map(point => transformPoint(point)),
        },
      };
    }
    throw new Error(`TODO: ${feature.geometry.type}`);
  }),
};

console.log(JSON.stringify(newDoc)
  .replace('[{', '[\n{')
  .replace('}]', '}\n]')
  .replaceAll('},{', '},\n{'));
