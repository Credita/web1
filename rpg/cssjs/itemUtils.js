(function (exports) {

  var modules = function (items, translate) {
    var module = {};

    module.getItemTree = function (itemId, quantity) {
      var item = items[itemId]
      quantity = quantity || 1;
      var materials = (item.materials || []).reduce(function(all, current) {
          all[current] = all[current] || 0;
          all[current] += 1;
          return all;
        }, {});
      return {
        innerHTML : module.getItemHtml(item, quantity),
        children : Object.keys(materials).map(key => module.getItemTree(key, materials[key]))
      }
    }

    module.getItemHtml = function (item, quantity, lang){
      quantity = quantity || 1;
      var itemInfo = module.getItemInfo(item, lang);
      var dropInfo = module.getDropInfo(item);
      var txt = itemInfo + (itemInfo.trim() && dropInfo.trim() ? "<br/><br/>" : "") + dropInfo;
      return `<span class="${item.color} item-tooltip" data-placement="bottom" data-toggle="tooltip" data-html="true" title="${txt}">${item.label + (quantity > 1 ? ' x' + quantity : '')}</span>`;
    }

    module.toArr = function (smth) {
      if (smth == null) return []
      if (smth instanceof Array == false) return [smth]
      return smth
    }

    module.getItemInfo = function (item, lang) {
      var template = "";

      if (item.stats) {
        for (var stat in item.stats) {
          template += module.formatStat(stat, item.stats[stat], lang) + "<br/>";
        }
      }

      template += module.toArr(item.effects).join("<br/>");

      if(item.stats_points) {
        template += "<br/>" + translate("Gives") + " " + item.stats_points + " "  + translate("stats points")
      }

      return template.endsWith("<br/>") ? template.substring(0, template.lastIndexOf("<br/>")) : template
    }

    module.getDropInfo = function (item) {
      var from = module.toArr(item.raid).concat(module.toArr(item.boss)).concat(module.toArr(item.chest)).filter(v => !!v);
      var chances = module.toArr(item.chances);

      if (!from[0]) return "";

      return from.map((f, i) => f + " (" + chances[i] + "% " + translate("chance") + ")").join("<br/> ")
    }

    module.formatStat = function (stat, val, lang) {
      if (stat == "atk") return translate("Attack", lang) + " : +" + val;
      else if (stat == "int") return translate("Intelligence", lang) + " : +" + val;
      else if (stat == "agi") return translate("Agility", lang) + " : +" + val;
      else if (stat == "str") return translate("Strength", lang) + " : +" + val;
      else if (stat == "damage_taken") return translate("Damage Taken", lang) + " : " + (val >= 0 ? "+" : "") + val + "%";
      else if (stat == "attack_speed") return translate("Attack Speed", lang) + " : +" + val + "%";
      else if (stat == "damage_increase") return translate("Damage Increase", lang) + " : +" + val + "%";
      else if (stat == "hp") return translate("Hit Points", lang) + " : +"+val;
      else if (stat == "mp") return translate("Mana Points", lang) + " : +"+val;
      else if (stat == "movement_speed") return translate("Movement Speed", lang) + " : +"+val+ "%";
      else if (stat == "hp_regen") return translate("Hit Point Regeneration", lang) + " : +"+val + " " + translate("per second", lang);
      else if (stat == "hp_regen_percent") return translate("Hit Point Regeneration", lang) + ": +"+val + "% " + translate("MAX HP per second", lang);
      else if (stat == "armor") return translate("Armor", lang) +" : +" +val;
      else if (stat == "max_health") return translate("Max Hit Points", lang) + " : +" + val + "%";
      else if (stat == "enemy_armor") return translate("Enemy Armor", lang) + " : " + val + "%";
      else if (stat == "enemy_speed") return translate("Enemy Speed", lang) + " : " + val + "%";
      else if (stat == "magic_resistance") return translate("Magic Resistance", lang) + " : +" + val + "%";
      else if (stat == "max_int") return translate("Intelligence increase", lang) + " : +" + val + "%";

      else console.warn("stat not defined : " + stat)
    }

    return module;

  }

  if (typeof window === 'undefined') {
    exports.load = modules;
  } else {
    var module = modules(window.items, window.translate);
    for (var mod in module) window[mod] = module[mod];
  }

})(typeof exports === 'undefined'? this: exports);
