Atlas = {};
Atlas.loaded = false;
Atlas.loadedCount = 0;

Atlas.xmls = [
    "assets/tiles/sprites.xml", 
    "assets/hero/sprites.xml", 
    "assets/enemies/sprites.xml",
    "assets/gui/sprites.xml"
];

Atlas.keys = [
    "tiles", 
    "hero", 
    "enemies", 
    "gui"
];

Atlas.getLoadedRatio = function() {
    return Atlas.loadedCount / Atlas.xmls.length;
};

Atlas.loadAll = function(callback) {
    for (var i = 0; i < Atlas.keys.length; i++) {
        Atlas[Atlas.keys[i]] = {};
    }
    Atlas.load(0, callback);
};

Atlas.load = function(index, callback) {
    var xmlRequest = new XMLHttpRequest();
    xmlRequest.open("GET", Atlas.xmls[index], true);
    xmlRequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
           var xml = xmlRequest.responseXML;
           var elements = xml.getElementsByTagName("SubTexture");
           for (var i = 0; i < elements.length; i++) {
               var name = elements[i].getAttribute("name");
               name = name.replace(".png", "");
               var x = elements[i].getAttribute("x");
               var y = elements[i].getAttribute("y");
               var width = elements[i].getAttribute("width");
               var height = elements[i].getAttribute("height");
               Atlas[Atlas.keys[index]][name] = {x: x, y: y, width: width, height: height};
           }
           if (index + 1 >= Atlas.xmls.length) {
                Atlas.loadedCount++;
                Atlas.loaded = true;
                if (callback !== null) {
                    callback();
                }
            } else {
                Atlas.loadedCount++;
                Atlas.load(index + 1, callback);
            }
        }
    };
    xmlRequest.send();
};