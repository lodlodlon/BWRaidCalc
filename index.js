import { LZString } from "./lz-string.js";


document.addEventListener("DOMContentLoaded", function () {
	addEventListeners();
});

let saveString;
let game;

function addEventListeners() {
	document
		.getElementById("LoadSaveButton")
		.addEventListener("click", loadAndCalc);
	document
		.getElementById("CalculateBWButton")
		.addEventListener("click", calcBW);
}

function verboseLog() {
	return document.getElementById("verboseLogCheck").checked;
}

function verboseAttack() {
	return document.getElementById("verboseAttackCheck").checked;
}

function loadAndCalc() {
	logToPage("Doing Stuff");
	if (!loadSave()) return;
	populateInputs();
	calcBW();
	if (verboseAttack()) {
		console.log(game);
	}
}

function populateInputs() {
	logToPage("Populating Inputs");
	document.getElementById("PlaguebringerText").value =
		getPlagueShield();

	document.getElementById("ChargedCritsText").checked =
		game.talents.crit.purchased;

	document.getElementById("FlufffinityText").checked =
		game.talents.fluffyAbility.purchased;

	document.getElementById("SMMMText").checked =
		game.talents.stillMagmamancer.purchased;

	document.getElementById("MMMText").value =
		game.jobs.Magmamancer.owned;

	document.getElementById("PoisonTransferText").value =
		getPoisonTransfer();

	document.getElementById("PoisonLevelText").value =
		getPoisonLevel();

	document.getElementById("WorldZoneText").value =
		game.global.world;

	document.getElementById("BWLevelText").value =
		getCurrentMapObject().level;

	document.getElementById("SpireRowsText").value =
		game.global.spireRows;

	document.getElementById("MinOnZoneText").value =
		getTimeOnZone();

	document.getElementById("FluffyEvolutionText").value =
		game.global.fluffyPrestige;

	document.getElementById("FluffyLevelText").value =
		calculateFluffyLevel();

	document.getElementById("CritChanceText").value =
		getPlayerCritChance();

	document.getElementById("DamageValueText").value =
		calculateDamage();

	if (verboseLog()) {
		logToPage("Plague = " + getPlagueShield());
		logToPage("Charged Crits = " + game.talents.crit.purchased);
		logToPage(
			"Flufffinity = " + game.talents.fluffyAbility.purchased
		);
		logToPage(
			"SMMM = " + game.talents.stillMagmamancer.purchased
		);
		logToPage("MMM = " + game.jobs.Magmamancer.owned);
		logToPage("Poison Transfer = " + getPoisonTransfer());
		logToPage("Poison Level = " + getPoisonLevel());
		logToPage("World Zone = " + game.global.world);
		logToPage("BW Level = " + getCurrentMapObject().level);
		logToPage("Spire Rows = " + game.global.spireRows);
		logToPage("Minutes on zone = " + getTimeOnZone());
		logToPage(
			"Fluffy Evolution = " + game.global.fluffyPrestige
		);
		logToPage("Fluffy Level = " + calculateFluffyLevel());
		logToPage("Crit Chance = " + getPlayerCritChance());
		// logToPage("Trimp Min Attack = " + calculateDamage());
	}
}

function calcBW() {
	pullFromInputs();
	logToPage("Calculating BW");

	logToPage("Finished");
	logToPage("");
}

function pullFromInputs() {
	logToPage("Pulling data from Inputs");
}

function saveSave() {
	if (
		!game.global.mapsActive ||
		!(getCurrentMapObject().location == "Bionic")
	) {
		logToPage("Please load a BW map");
		return false;
	} else if (verboseLog()) {
		logToPage("Running Bionic Map");
	}
	if (getEmpowerment() != "Poison") {
		logToPage("Run BWs in Poison you jabroni");
		return false;
	} else if (verboseLog()) {
		logToPage("Currently in poison");
	}
	return true;
}

function loadSave() {
	saveString = document.getElementById("SaveImportText").value;
	let sg = saveString.replace(/(\r\n|\n|\r|\s)/gm, "");
	game = JSON.parse(LZString.decompressFromBase64(sg));

	if (!game) {
		logToPage("Save failed to load");
		return false;
	} else if (verboseLog()) {
		logToPage("Save loaded");
	}
	if (!saveSave()) {
		if (verboseLog()) {
			logToPage("Fix your save");
		}
		return false;
	}
	return true;
}

function logToPage(t) {
	document.getElementById("plog").innerHTML =
		t + "<br>" + document.getElementById("plog").innerHTML;
}

// Stolen code from Trimps

//Checking for BW
function getCurrentMapObject() {
	return game.global.mapsOwnedArray[
		getMapIndex(game.global.currentMapId)
	];
}

function getMapIndex(mapId) {
	for (var x = 0; x < game.global.mapsOwnedArray.length; x++) {
		if (game.global.mapsOwnedArray[x].id == mapId) return x;
	}
}

//Checking for Poison
function getEmpowerment(adjust, getNaming) {
	var natureStartingZone = getNatureStartZone();
	var adjWorld = game.global.world;
	if (typeof adjust !== "undefined") adjWorld += adjust;
	if (adjWorld < natureStartingZone) return false;
	var activeEmpowerments = ["Poison", "Wind", "Ice"];
	var naming = ["Toxic", "Gusty", "Frozen"];
	adjWorld = Math.floor((adjWorld - natureStartingZone) / 5);
	adjWorld = adjWorld % activeEmpowerments.length;
	if (getNaming) return naming[adjWorld];
	return activeEmpowerments[adjWorld];
}

function getNatureStartZone() {
	if (game.global.universe == 2) return 9999;
	return game.global.challengeActive == "Eradicated" ? 1 : 236;
}

//Get loom value
function getPlagueShield() {
	return (
		getHeirloomBonusModified("Shield", "plaguebringer") / 100
	);
}

function getCritChanceShield() {
	return getHeirloomBonusModified("Shield", "critChance") / 100;
}

function getTrimpAttackShield() {
	return getHeirloomBonusModified("Shield", "trimpAttack") / 100;
}

function getHeirloomBonusModified(type, mod) {
	if (!game.heirlooms[type] || !game.heirlooms[type][mod]) {
		logToPage("oh noes" + type + mod);
	}
	var bonus = game.heirlooms[type][mod].currentBonus;

	return bonus;
}

function getPoisonTransfer() {
	var transferOnNatureScreen =
		game.empowerments.Poison.retainLevel;
	if (game.talents.nature2.purchased) transferOnNatureScreen += 5;
	return transferOnNatureScreen;
}

function getPoisonLevel() {
	var levelOnNatureScreen = game.empowerments.Poison.level;
	if (game.talents.nature2.purchased) levelOnNatureScreen += 5;
	return levelOnNatureScreen;
}

function getTimeOnZone() {
	return (
		(game.global.lastOnline - game.global.zoneStarted) / 60000
	);
}

function calculateFluffyLevel() {
	var capableLevels = game.portal.Capable.level;
	var currentExp = game.global.fluffyExp;

	var level = Math.floor(
		Math.log10(
			(currentExp /
				(1000 * Math.pow(5, game.global.fluffyPrestige))) *
				(4 - 1) +
				1
		) / Math.log10(4)
	);

	if (capableLevels < level) level = capableLevels;

	return level;
}

function getFluffyPerkLevelFromSave() {
	return (
		game.global.fluffyPrestige +
		calculateFluffyLevel() +
		game.talents.fluffyAbility.purchased
	);
}

function getPlayerCritChance() {
	//returns decimal: 1 = 100%
	if (game.global.challengeActive == "Duel")
		return game.challenges.Duel.enemyStacks / 100;
	var critChance = 0;
	critChance += 0.05 * game.portal.Relentlessness.level;
	critChance += getCritChanceShield();
	if (game.talents.crit.purchased && getCritChanceShield() * 100)
		critChance += getCritChanceShield() * 100 * 0.005;
	if (getFluffyPerkLevelFromSave() > 13) critChance += 0.5;

	//if (Fluffy.isRewardActive("critChance")) critChance += (0.5 * Fluffy.isRewardActive("critChance"));
	//if (game.challenges.Nurture.boostsActive() && game.challenges.Nurture.getLevel() >= 5) critChance += 0.35;
	//if (game.global.challengeActive == "Daily"){
	//	if (typeof game.global.dailyChallenge.trimpCritChanceUp !== 'undefined'){
	//		critChance += dailyModifiers.trimpCritChanceUp.getMult(game.global.dailyChallenge.trimpCritChanceUp.strength);
	//	}
	//	if (typeof game.global.dailyChallenge.trimpCritChanceDown !== 'undefined'){
	//		critChance -= dailyModifiers.trimpCritChanceDown.getMult(game.global.dailyChallenge.trimpCritChanceDown.strength);
	//	}
	//}
	//if (critChance > 6) critChance = 6;
	return critChance;
}

function calculateDamage() {
	var number = game.global.attack;

	if (game.playerSpire.traps.Strength.owned) {
		number *= getStrengthTwrDamageMult();
		if (verboseAttack()) {
			logToPage(
				"StrTwr Mult : " + getStrengthTwrDamageMult()
			);
		}
	}

	if (game.jobs.Amalgamator.owned > 0) {
		number *= getGatorDamageMult();
		if (verboseAttack()) {
			logToPage("Gator Mult : " + getGatorDamageMult());
		}
	}

	if (!(game.global.universe == 2)) {
		let magbegin =
			(game.global.challengeActive == "Eradicated", 1, 230);
		if (magbegin <= game.global.world) {
			number *= Math.pow(
				0.8,
				game.global.world - magbegin + 1
			);
			if (verboseAttack()) {
				logToPage(
					"Magma Mult : " +
						Math.pow(
							0.8,
							game.global.world - magbegin + 1
						)
				);
			}
		}
	}

	if (
		game.global.spireRows >= 15 ||
		game.portal.Capable.level > 0
	) {
		/*number *= Fluffy.getDamageModifier();
getDamageModifier: function () {
var exp = this.getExp();
var prestigeBonus = Math.pow(this.prestigeDamageModifier, this.getCurrentPrestige());
var minLevel = (game.talents.fluffyAbility.purchased) ? 0 : 1;
if (exp[0] < minLevel || exp.length != 3) return 1;
var damageModifiers = this.getDamageModifiers();
var bonus = damageModifiers[exp[0]];
if (exp[0] >= damageModifiers.length || (exp[0] == this.getCapableLevel() && !(game.global.universe == 2 && this.getCapableLevel() == 10))) return 1 + ((bonus - 1) * prestigeBonus);
var remaining = (damageModifiers[exp[0] + 1] - bonus);
bonus += ((exp[1] / exp[2]) * remaining);
return 1 + ((bonus - 1) * prestigeBonus);
*/
	}

	if (game.global.totalSquaredReward > 0) {
		number *= game.global.totalSquaredReward / 100 + 1;
		if (verboseAttack()) {
			logToPage(
				"C2 Mult : " +
					(game.global.totalSquaredReward / 100 + 1)
			);
		}
	}

	if (
		game.global.mapsActive &&
		game.talents.bionic2.purchased &&
		getCurrentMapObject().level > game.global.world
	) {
		number *= 1.5;
		if (verboseAttack()) {
			logToPage("BM2 Mult : " + 1.5);
		}
	}

	if (game.talents.healthStrength.purchased) {
		number *= getStrHealthDamageMult();
		if (verboseAttack()) {
			logToPage("StrHlth Mult : " + getStrHealthDamageMult());
		}
	}

	if (game.talents.stillRowing2.purchased) {
		number *= game.global.spireRows * 0.06 + 1;
		if (verboseAttack()) {
			logToPage(
				"SR2 Mult : " + (game.global.spireRows * 0.06 + 1)
			);
		}
	}

	if (game.talents.magmamancer.purchased) {
		number *= getMMMDamageMult();
		if (verboseAttack()) {
			logToPage("MMM Mult : " + getMMMDamageMult());
		}
	}

	if (game.talents.herbalist.purchased) {
		let herbMult = 1;
		if (game.resources.food.owned > 1) {
			herbMult =
				1 + Math.log10(game.resources.food.owned) / 83.3;
			if (herbMult < 1 || isNumberBad(herbMult)) herbMult = 1;
		}
		number *= herbMult;
		if (verboseAttack()) {
			logToPage("Herb Mult : " + herbMult);
		}
	}

	number *= getTrimpAttackShield() + 1;
	if (verboseAttack()) {
		logToPage(
			"Shield attack Mult : " + (getTrimpAttackShield() + 1)
		);
	}

	if (game.global.roboTrimpLevel > 0) {
		number *= 0.2 * game.global.roboTrimpLevel + 1;
		if (verboseAttack()) {
			logToPage(
				"Robotrimp Mult : " +
					(0.2 * game.global.roboTrimpLevel + 1)
			);
		}
	}

	if (game.global.formation == 2) {
		number *= 4;
		if (verboseAttack()) {
			logToPage("D Formation Mult : " + 4);
		}
	}

	if (game.global.antiStacks > 0) {
		number *= getAntiDamageMult();
		if (verboseAttack()) {
			logToPage("Antic Mult : " + getAntiDamageMult());
		}
	}

	if (game.portal.Power_II.level > 0) {
		number *= 1 + game.portal.Power_II.level * 0.01;
		if (verboseAttack()) {
			logToPage(
				"Power_II Mult : " +
					(1 + game.portal.Power_II.level * 0.01)
			);
		}
	}

	if (game.portal.Power.level > 0) {
		number *= 1 + game.portal.Power.level * 0.05;
		if (verboseAttack()) {
			logToPage(
				"Power Mult : " +
					(1 + game.portal.Power.level * 0.05)
			);
		}
	}

	if (game.global.achievementBonus > 0) {
		number *= 1 + game.global.achievementBonus / 100;
		if (verboseAttack()) {
			logToPage(
				"Achieve Mult : " +
					(1 + game.global.achievementBonus / 100)
			);
		}
	}

	//Not sure order

	if (game.singleRunBonuses.sharpTrimps.owned) {
		number *= 1.5;
		if (verboseAttack()) {
			logToPage("Sharp Mult : " + 1.5);
		}
	}

	if (
		game.talents.daily.purchased &&
		game.global.challengeActive == "Daily"
	) {
		number *= 1.5;
		if (verboseAttack()) {
			logToPage("Legs Mult : " + 1.5);
		}
	}

	if (
		game.global.challengeActive == "Lead" &&
		game.global.world % 2 == 1
	) {
		number *= 1.5;
		if (verboseAttack()) {
			logToPage("Lead Mult : " + 1.5);
		}
	}

	if (game.goldenUpgrades.Battle.currentBonus > 0) {
		number *= game.goldenUpgrades.Battle.currentBonus + 1;
		if (verboseAttack()) {
			logToPage(
				"Gattle Mult : " +
					(game.goldenUpgrades.Battle.currentBonus + 1)
			);
		}
	}

	if (game.upgrades.Coordination.done > 0) {
		number *= Math.pow(1.25, game.upgrades.Coordination.done);
		if (verboseAttack()) {
			logToPage(
				"Coords mult : " +
					Math.pow(1.25, game.upgrades.Coordination.done)
			);
		}
	}

	if (verboseAttack()) {
		logToPage("Damage start : " + game.global.attack);
	}

	if (verboseAttack()) {
		logToPage("Damage final : " + number);
	}

	return number;
}

function getStrengthTwrDamageMult() {
	var level = game.playerSpire.traps.Strength.level;
	var qty = game.playerSpire.traps.Strength.owned;
	var singlebonus = 30;
	if (level > 1) singlebonus += (level - 1) * 15;

	return 1 + (singlebonus * qty) / 100;
}

function getStrHealthDamageMult() {
	if (game.global.universe != 1) return 1;
	if (game.global.lastSpireCleared < 2) return 1;

	return 0.15 * healthyCellCount() + 1;
}

function healthyCellCount() {
	var lastSpire = game.global.lastSpireCleared;
	var world = game.global.world;
	if (lastSpire < 2) return 0;
	lastSpire *= 100;
	if (world > lastSpire + 199) world = lastSpire + 199;
	var possible = Math.floor((world - 300) / 15) + 2;
	if (game.talents.healthStrength2.purchased)
		possible += game.global.lastSpireCleared;
	if (possible > 80) possible = 80;
	return possible;
}

function getMMMDamageMult() {
	//bug here with paused game time still ticking when it shouldn't, in real game
	var timeInMin = getTimeOnZone() + 5;
	var maxMMMStacks = 12;
	if (game.talents.stillMagmamancer.purchased) {
		timeInMin += game.global.spireRows;
		maxMMMStacks += Math.floor(game.global.spireRows / 20);
	}
	return (
		1 +
		3 *
			(1 - Math.pow(0.9999, game.jobs.Magmamancer.owned)) *
			(Math.pow(
				1.2,
				Math.min(Math.floor(timeInMin / 10), maxMMMStacks)
			) -
				1)
	);
}

function getAntiDamageMult() {
	return (
		game.global.antiStacks *
			0.02 *
			game.portal.Anticipation.level +
		1
	);
}

function getGatorDamageMult() {
	if (game.talents.amalg.purchased) {
		return Math.pow(1.5, game.jobs.Amalgamator.owned);
	} else {
		return game.jobs.Amalgamator.owned * 0.5 + 1;
	}
}

function isNumberBad(number) {
	return (
		isNaN(number) ||
		typeof number === "undefined" ||
		number < 0 ||
		!isFinite(number) ||
		number == null
	);
}

//Math.floor((game.global.lastOnline - game.global.zoneStarted) / 600000

//fluffy evo  = game.global.fluffyPrestige
//fluff perks	rewards: ["stickler", "helium", "liquid", "purifier", "lucky", "void", "helium", "liquid", "eliminator", "overkiller"],
//	prestigeRewards: ["dailies", "voidance", "overkiller", "critChance", "megaCrit", "superVoid", "voidelicious", "naturesWrath", "voidSiphon", "plaguebrought"],

/*
getLevel: function(ignoreCapable){
if (this.currentExp.length != 3) this.handleBox();
var level = this.currentLevel;
var capableLevels = this.getCapableLevel();
if (ignoreCapable){
level = Math.floor(log10(((this.getCurrentExp() / this.getFirstLevel()) * (this.growth - 1)) + 1) / log10(this.growth));
if (level >= this.getRewardList().length) level = this.getRewardList().length;
return level;
}
if (!this.isCapableHighEnough(level)) level = capableLevels;
return level;
},
*/

//---------------Hacked up---------------------

/*
function getHeirloomBonusOriginal(type, mod){
if (!game.heirlooms[type] || !game.heirlooms[type][mod]){
console.log('oh noes', type, mod)
}
var bonus = game.heirlooms[type][mod].currentBonus;
if (mod == "gammaBurst" && game.global.ShieldEquipped && game.global.ShieldEquipped.rarity >= 10){
bonus = getHazardGammaBonus();
}
return scaleHeirloomModUniverse(type, mod, bonus);
}

//Get crit chance%/100
function getPlayerCritChance(){ //returns decimal: 1 = 100%
if (game.global.challengeActive == "Duel") return (game.challenges.Duel.enemyStacks / 100);
var critChance = 0;
critChance += (game.portal.Relentlessness.modifier * getPerkLevel("Relentlessness"));
critChance += (getHeirloomBonus("Shield", "critChance") / 100);
if (game.talents.crit.purchased && getHeirloomBonus("Shield", "critChance")) critChance += (getHeirloomBonus("Shield", "critChance") * 0.005);
if (Fluffy.isRewardActive("critChance")) critChance += (0.5 * Fluffy.isRewardActive("critChance"));
if (game.challenges.Nurture.boostsActive() && game.challenges.Nurture.getLevel() >= 5) critChance += 0.35;
if (game.global.challengeActive == "Daily"){
if (typeof game.global.dailyChallenge.trimpCritChanceUp !== 'undefined'){
critChance += dailyModifiers.trimpCritChanceUp.getMult(game.global.dailyChallenge.trimpCritChanceUp.strength);
}
if (typeof game.global.dailyChallenge.trimpCritChanceDown !== 'undefined'){
critChance -= dailyModifiers.trimpCritChanceDown.getMult(game.global.dailyChallenge.trimpCritChanceDown.strength);
}
}
if (critChance > 6) critChance = 6;
return critChance;
}
*/

/*
-------------------------- KNOWN BUGS -------------------------

MMM ticks in game when game is paused, won't fix for now, most people will use immediately and game won't get out of sync

Not sure what happens if Shield fails to have mod looked up

*/