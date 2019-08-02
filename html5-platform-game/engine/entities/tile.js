// Static class members
Tile.WALL_TYPE = 1;
Tile.PLATFORM_TYPE = 2;
Tile.TEXTURE_TYPE = 4;
Tile.LADDER_TYPE = 8;
Tile.LADDER_TOP_TYPE = 16;

Tile.TYPE = [];
Tile.TYPE[1] = {asset: "rock", type: Tile.WALL_TYPE};
Tile.TYPE[2] = {asset: "rock_left_grass", type: Tile.WALL_TYPE};
Tile.TYPE[3] = {asset: "rock_right_grass", type: Tile.WALL_TYPE};
Tile.TYPE[4] = {asset: "ice_center", type: Tile.WALL_TYPE};
Tile.TYPE[5] = {asset: "grass_left_ice", type: Tile.WALL_TYPE};
Tile.TYPE[6] = {asset: "grass_right_ice", type: Tile.WALL_TYPE};
Tile.TYPE[7] = {asset: "grass_left_lava", type: Tile.WALL_TYPE};
Tile.TYPE[8] = {asset: "grass_right_lava", type: Tile.WALL_TYPE};
Tile.TYPE[9] = {asset: "rock_left_lava", type: Tile.WALL_TYPE};
Tile.TYPE[10] = {asset: "rock_right_lava", type: Tile.WALL_TYPE};
Tile.TYPE[11] = {asset: "grass_right_platform", type: Tile.PLATFORM_TYPE};
Tile.TYPE[12] = {asset: "grass_center_platform", type: Tile.PLATFORM_TYPE};
Tile.TYPE[13] = {asset: "grass_left_platform", type: Tile.PLATFORM_TYPE};
Tile.TYPE[14] = {asset: "rock_right", type: Tile.WALL_TYPE};
Tile.TYPE[15] = {asset: "rock_center", type: Tile.WALL_TYPE};
Tile.TYPE[16] = {asset: "rock_left", type: Tile.WALL_TYPE};
Tile.TYPE[17] = {asset: "grass_left", type: Tile.WALL_TYPE};
Tile.TYPE[18] = {asset: "grass_center", type: Tile.WALL_TYPE};
Tile.TYPE[19] = {asset: "grass_right", type: Tile.WALL_TYPE};
Tile.TYPE[20] = {asset: "flower", type: Tile.TEXTURE};
Tile.TYPE[21] = {asset: "mushroom", type: Tile.TEXTURE};
Tile.TYPE[22] = {asset: "grass", type: Tile.TEXTURE};
Tile.TYPE[23] = {asset: "rocks", type: Tile.TEXTURE};
Tile.TYPE[24] = {asset: "top_shadow_round_left", type: Tile.TEXTURE};
Tile.TYPE[25] = {asset: "top_shadow_round_center", type: Tile.TEXTURE};
Tile.TYPE[26] = {asset: "top_shadow_round_right", type: Tile.TEXTURE};
Tile.TYPE[27] = {asset: "center_shadow_right", type: Tile.TEXTURE};
Tile.TYPE[28] = {asset: "center_shadow_center", type: Tile.TEXTURE};
Tile.TYPE[29] = {asset: "center_shadow_left", type: Tile.TEXTURE};
Tile.TYPE[30] = {asset: "bottom_shadow_round_left", type: Tile.TEXTURE};
Tile.TYPE[31] = {asset: "bottom_shadow_round_center", type: Tile.TEXTURE};
Tile.TYPE[32] = {asset: "bottom_shadow_round_right", type: Tile.TEXTURE};
Tile.TYPE[33] = {asset: "shadow_right", type: Tile.TEXTURE};
Tile.TYPE[34] = {asset: "shadow_center", type: Tile.TEXTURE};
Tile.TYPE[35] = {asset: "shadow_left", type: Tile.TEXTURE};
Tile.TYPE[36] = {asset: "set2_ladder", type: Tile.LADDER_TYPE};
Tile.TYPE[37] = {asset: "set2_ladder", type: Tile.LADDER_TOP_TYPE};
Tile.TYPE[38] = {asset: "set2_ladder2", type: Tile.LADDER_TYPE};
Tile.TYPE[39] = {asset: "set2_ladder2", type: Tile.LADDER_TOP_TYPE};
Tile.TYPE[40] = {asset: "set2_black_brick1", type: Tile.TEXTURE};
Tile.TYPE[41] = {asset: "set2_black_brick2", type: Tile.TEXTURE};
Tile.TYPE[42] = {asset: "set2_black_brick3", type: Tile.TEXTURE};
Tile.TYPE[43] = {asset: "set2_blue_brick1", type: Tile.WALL_TYPE};
Tile.TYPE[44] = {asset: "set2_blue_brick2", type: Tile.WALL_TYPE};
Tile.TYPE[45] = {asset: "set2_blue_brick3", type: Tile.WALL_TYPE};
Tile.TYPE[46] = {asset: "set2_blue_brick4", type: Tile.WALL_TYPE};
Tile.TYPE[47] = {asset: "set2_blue_brick5", type: Tile.WALL_TYPE};
Tile.TYPE[48] = {asset: "set2_brick_border", type: Tile.WALL_TYPE};
Tile.TYPE[49] = {asset: "set2_black", type: Tile.TEXTURE};
Tile.TYPE[50] = {asset: "set2_brown", type: Tile.TEXTURE};
Tile.TYPE[51] = {asset: "set2_cloud1", type: Tile.TEXTURE};
Tile.TYPE[52] = {asset: "set2_cloud2", type: Tile.TEXTURE};
Tile.TYPE[53] = {asset: "set2_cloud3", type: Tile.TEXTURE};
Tile.TYPE[54] = {asset: "set2_cloud4", type: Tile.TEXTURE};
Tile.TYPE[55] = {asset: "set2_cloud5", type: Tile.TEXTURE};
Tile.TYPE[56] = {asset: "set2_cloud6", type: Tile.TEXTURE};
Tile.TYPE[57] = {asset: "set2_door_1", type: Tile.TEXTURE};
Tile.TYPE[58] = {asset: "set2_door_2", type: Tile.TEXTURE};
Tile.TYPE[59] = {asset: "set2_door_3", type: Tile.TEXTURE};
Tile.TYPE[60] = {asset: "set2_door_4", type: Tile.TEXTURE};
Tile.TYPE[61] = {asset: "set2_golden_brick1", type: Tile.WALL_TYPE};
Tile.TYPE[62] = {asset: "set2_golden_brick2", type: Tile.WALL_TYPE};
Tile.TYPE[63] = {asset: "set2_golden_brick3", type: Tile.WALL_TYPE};
Tile.TYPE[64] = {asset: "set2_golden_brick4", type: Tile.WALL_TYPE};
Tile.TYPE[65] = {asset: "set2_golden_brick5", type: Tile.WALL_TYPE};
Tile.TYPE[66] = {asset: "set2_goldenblock_right", type: Tile.PLATFORM_TYPE};
Tile.TYPE[67] = {asset: "set2_goldenblock", type: Tile.WALL_TYPE};
Tile.TYPE[68] = {asset: "set2_goldenblock_left", type: Tile.PLATFORM_TYPE};
Tile.TYPE[69] = {asset: "set2_line_bottom", type: Tile.TEXTURE};
Tile.TYPE[70] = {asset: "set2_line_top", type: Tile.TEXTURE};
Tile.TYPE[71] = {asset: "set2_pink_brick1", type: Tile.WALL_TYPE};
Tile.TYPE[72] = {asset: "set2_pink_brick2", type: Tile.WALL_TYPE};
Tile.TYPE[73] = {asset: "set2_pink_brick3", type: Tile.WALL_TYPE};
Tile.TYPE[74] = {asset: "set2_pink_brick4", type: Tile.WALL_TYPE};
Tile.TYPE[75] = {asset: "set2_pink_brick5", type: Tile.WALL_TYPE};
Tile.TYPE[76] = {asset: "set2_purple_brick1", type: Tile.WALL_TYPE};
Tile.TYPE[77] = {asset: "set2_purple_brick2", type: Tile.WALL_TYPE};
Tile.TYPE[78] = {asset: "set2_purple_brick3", type: Tile.WALL_TYPE};
Tile.TYPE[79] = {asset: "set2_purple_brick4", type: Tile.WALL_TYPE};
Tile.TYPE[80] = {asset: "set2_purple_brick5", type: Tile.WALL_TYPE};
Tile.TYPE[81] = {asset: "set2_red", type: Tile.TEXTURE};
Tile.TYPE[82] = {asset: "set2_rock1_left", type: Tile.PLATFORM_TYPE};
Tile.TYPE[83] = {asset: "set2_rock1_right", type: Tile.PLATFORM_TYPE};
Tile.TYPE[84] = {asset: "set2_rock2_left", type: Tile.PLATFORM_TYPE};
Tile.TYPE[85] = {asset: "set2_rock2_right", type: Tile.PLATFORM_TYPE};
Tile.TYPE[86] = {asset: "set2_tree_big_bottom", type: Tile.TEXTURE};
Tile.TYPE[87] = {asset: "set2_tree_big_top", type: Tile.TEXTURE};
Tile.TYPE[88] = {asset: "set2_tree_med", type: Tile.TEXTURE};
Tile.TYPE[89] = {asset: "set2_tree_small", type: Tile.TEXTURE};
Tile.TYPE[90] = {asset: "set2_tube_bottom", type: Tile.WALL_TYPE};
Tile.TYPE[91] = {asset: "set2_tube_mid", type: Tile.WALL_TYPE};
Tile.TYPE[92] = {asset: "set2_tube_top", type: Tile.WALL_TYPE};
Tile.TYPE[93] = {asset: "set2_win_1", type: Tile.TEXTURE};
Tile.TYPE[94] = {asset: "set2_win_2", type: Tile.TEXTURE};
Tile.TYPE[95] = {asset: "set2_win_3", type: Tile.TEXTURE};
Tile.TYPE[96] = {asset: "set2_win_4", type: Tile.TEXTURE};
Tile.TYPE[97] = {asset: "set2_goldenblock_left", type: Tile.WALL_TYPE};
Tile.TYPE[98] = {asset: "set2_goldenblock_right", type: Tile.WALL_TYPE};
Tile.TYPE[99] = {asset: "set2_pick1", type: Tile.TEXTURE};
Tile.TYPE[100] = {asset: "set2_fire", type: Tile.TEXTURE};
Tile.TYPE[101] = {asset: "set2_buoy", type: Tile.TEXTURE};
Tile.TYPE[102] = {asset: "set2_blue_brick1", type: Tile.TEXTURE};
Tile.TYPE[103] = {asset: "set2_blue_brick2", type: Tile.TEXTURE};
Tile.TYPE[104] = {asset: "set2_blue_brick3", type: Tile.TEXTURE};
Tile.TYPE[105] = {asset: "set2_blue_brick4", type: Tile.TEXTURE};
Tile.TYPE[106] = {asset: "set2_blue_brick5", type: Tile.TEXTURE};
Tile.TYPE[107] = {asset: "pick", type: Tile.TEXTURE};
Tile.TYPE[108] = {asset: "lava1", type: Tile.TEXTURE};
Tile.TYPE[109] = {asset: "rock", type: Tile.PLATFORM_TYPE};

function Tile(x, y, width, height, typeIndex, camera) {
    this.x = x * width;
    this.y = y * height;
    this.width = width;
    this.height = height;
    this.typeIndex = typeIndex;
    this.camera = camera;
    this.type = Tile.TYPE[typeIndex].type;
    this.asset = Tile.TYPE[typeIndex].asset; 
}

Tile.prototype.collide = function(entity) {
    // AABB Collision detection
    var diffX = Math.abs((this.left() + this.width / 2) - (entity.left() + entity.width / 2));
    var diffY = Math.abs((this.top() + this.height / 2) - (entity.top() + entity.height / 2));
    var sizeX = (this.width / 2 + entity.width / 2);
    var sizeY = (this.height / 2 + entity.height / 2);
    return diffX < sizeX && diffY < sizeY;
}

Tile.prototype.left = function() {
    return this.x - this.camera.x;
};

Tile.prototype.right = function() {
    return (this.x + this.width) - this.camera.x;
};

Tile.prototype.top = function() {
    return this.y - this.camera.y;
};

Tile.prototype.bottom = function() {
    return (this.y + this.height) - this.camera.y;
};

Tile.prototype.draw = function(context) {
    if (Config.debug) {
        context.fillStyle = "white";
        context.fillRect(this.x - this.camera.x, this.y - this.camera.y, this.width, this.height);
    } else {
        context.drawImage(Assets.tilesAtlas, Atlas.tiles[this.asset].x, Atlas.tiles[this.asset].y, Atlas.tiles[this.asset].width, Atlas.tiles[this.asset].height, this.x - this.camera.x, this.y - this.camera.y, this.width + 1, this.height + 1);
    }
};
