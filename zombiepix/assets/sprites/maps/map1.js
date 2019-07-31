(function(name,data){
 if(typeof onTileMapLoaded === 'undefined') {
  if(typeof TileMaps === 'undefined') TileMaps = {};
  TileMaps[name] = data;
 } else {
  onTileMapLoaded(name,data);
 }
 if(typeof module === 'object' && module && module.exports) {
  module.exports = data;
 }})("map1",
{ "height":20,
 "layers":[
        {
         "data":[21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 11, 7, 8, 21, 21, 21, 31, 29, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 7, 7, 7, 45, 13, 13, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 2, 21, 21, 21, 21, 21, 21, 21, 31, 30, 26, 21, 21, 21, 21, 21, 21, 21, 21, 21, 7, 7, 6, 21, 33, 34, 40, 21, 13, 13, 13, 21, 21, 21, 21, 21, 21, 21, 21, 21, 7, 23, 23, 23, 43, 46, 42, 23, 23, 7, 23, 23, 21, 21, 21, 21, 21, 21, 21, 21, 7, 7, 7, 22, 32, 35, 41, 7, 7, 1, 22, 22, 21, 21, 21, 21, 21, 21, 21, 21, 7, 6, 7, 7, 13, 19, 13, 2, 22, 22, 22, 22, 21, 21, 21, 21, 21, 21, 21, 21, 7, 44, 44, 7, 13, 20, 13, 7, 22, 22, 22, 22, 23, 23, 21, 21, 21, 21, 21, 21, 7, 7, 3, 6, 7, 12, 44, 7, 7, 4, 22, 33, 34, 40, 21, 21, 21, 21, 21, 21, 44, 45, 7, 7, 44, 7, 7, 7, 45, 7, 22, 32, 35, 41, 22, 22, 22, 22, 22, 22, 7, 10, 45, 44, 24, 30, 26, 7, 45, 5, 2, 13, 14, 13, 22, 22, 22, 22, 7, 7, 7, 7, 8, 7, 13, 13, 13, 2, 1, 6, 6, 8, 8, 23, 22, 22, 22, 22, 2, 23, 23, 23, 23, 23, 13, 17, 13, 7, 8, 8, 10, 6, 2, 22, 22, 22, 22, 22, 7, 22, 22, 22, 22, 22, 4, 3, 7, 7, 8, 1, 8, 8, 10, 22, 22, 22, 22, 22, 23, 22, 22, 22, 22, 22, 23, 23, 23, 23, 8, 6, 8, 3, 8, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 4, 6, 4, 8, 57, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22],
         "height":20,
         "name":"Capa de Patrones 1",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":20,
         "x":0,
         "y":0
        }],
 "nextobjectid":1,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tiledversion":"1.0.3",
 "tileheight":32,
 "tilesets":[
        {
         "firstgid":1,
         "source":"zombiepix.tsx"
        }],
 "tilewidth":32,
 "type":"map",
 "version":1,
 "width":20
});