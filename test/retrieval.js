(function($) {

var _response, _status, _xhr, _error, _exc;
var _ajax = $.ajax;

var XHR = function(headers) {
	this._headers = headers || {};
};
XHR.prototype.getResponseHeader = function(name) {
	return this._headers[name.toLowerCase()];
};

module("retrieval", {
	setup: function() {
		_xhr = new XHR();
		$.ajax = function(options) {
			options.success && options.success(_response, _status, _xhr);
			options.error && options.error(_xhr, _error, _exc);
			options.complete && options.complete(_response, _status, _xhr);
		};
	},
	teardown: function() {
		$.ajax = _ajax;
	}
});

test("Tiddler", function() {
	var tiddler, _tiddler, _tiddler_orig;
	var host = "localhost";

	var callback = function(tiddler, status, xhr) {
		_tiddler = tiddler;
	};
	var errback = function(xhr, error, exc, tiddler) {
		_tiddler_orig = tiddler;
	};

	_tiddler = null;
	_tiddler_orig = null;
	_response = {
		bag: "Alpha",
		created: "20100930104000",
		modified: "20100930104130"
	};
	tiddler = new tiddlyweb.Tiddler("Foo");
	tiddler.bag = new tiddlyweb.Bag("Alpha", host);
	tiddler.get(callback, errback);
	strictEqual(_tiddler._type, "tiddler");
	strictEqual(_tiddler.title, "Foo");
	strictEqual(_tiddler.bag._type, "bag");
	strictEqual(_tiddler.bag.name, "Alpha");
	strictEqual(_tiddler.created instanceof Date, true);
	strictEqual(_tiddler.modified instanceof Date, true);
	strictEqual(_tiddler.modified.getUTCFullYear(), 2010);
	strictEqual(_tiddler.modified.getUTCMonth(), 8);
	strictEqual(_tiddler.modified.getUTCDate(), 30);
	strictEqual(_tiddler.modified.getUTCHours(), 10);
	strictEqual(_tiddler.modified.getUTCMinutes(), 41);
	strictEqual(_tiddler.modified.getUTCSeconds(), 30);
	strictEqual(_tiddler.modified.getUTCMilliseconds(), 0);
	strictEqual(_tiddler.bag.host, "localhost");
	strictEqual(_tiddler_orig, tiddler);

	_tiddler = null;
	_tiddler_orig = null;
	_response = {
		bag: "Bravo",
		created: "00000000000000",
		modified: "00000000000000"
	};
	tiddler = new tiddlyweb.Tiddler("Bar");
	tiddler.recipe = new tiddlyweb.Recipe("Omega", host);
	tiddler.get(callback, errback);
	strictEqual(_tiddler._type, "tiddler");
	strictEqual(_tiddler.title, "Bar");
	strictEqual(_tiddler.bag._type, "bag");
	strictEqual(_tiddler.bag.name, "Bravo");
	strictEqual(_tiddler.bag.host, "localhost");
	strictEqual(_tiddler.recipe._type, "recipe");
	strictEqual(_tiddler.recipe.name, "Omega");
	strictEqual(_tiddler.recipe.host, "localhost");
	strictEqual(_tiddler_orig, tiddler);
});

test("Bag", function() {
	var bag, _bag, _bag_orig;
	var host = "localhost";
	var callback = function(bag, status, xhr) {
		_bag = bag;
	};
	var errback = function(xhr, error, exc, bag) {
		_bag_orig = bag;
	};

	_bag = null;
	_bag_orig = null;
	_response = {
		desc: "lorem ipsum",
		policy: {
			"read": [],
			"write": ["ANY"],
			"create": ["ANY"],
			"delete": ["R:ADMIN"],
			"manage": ["R:ADMIN"],
			"accept": ["R:ADMIN"],
			"owner": "administrator"
		}
	};
	bag = new tiddlyweb.Bag("Alpha", host);
	bag.get(callback, errback);
	strictEqual(_bag._type, "bag");
	strictEqual(_bag.name, "Alpha");
	strictEqual(_bag.host, "localhost");
	strictEqual(_bag.desc, "lorem ipsum");
	strictEqual(_bag.policy.read.length, 0);
	strictEqual(_bag.policy.accept.length, 1);
	strictEqual(_bag.policy.accept[0], "R:ADMIN");
	strictEqual(_bag.policy.owner, "administrator");
	strictEqual(_bag_orig, bag);
});

test("Recipe", function() {
	var recipe, _recipe;
	var host = "localhost";
	var callback = function(recipe, status, xhr) {
		_recipe = recipe;
	};
	var errback = function(xhr, error, exc, recipe) {
		_recipe_orig = recipe;
	};

	_recipe = null;
	_recipe_orig = null;
	_response = {
		desc: "lorem ipsum",
		policy: {
			"read": [],
			"manage": ["R:ADMIN"],
			"owner": "administrator"
		},
		recipe: [["foo", ""], ["bar", ""]]
	};
	recipe = new tiddlyweb.Recipe("Omega", host);
	recipe.get(callback, errback);
	strictEqual(_recipe._type, "recipe");
	strictEqual(_recipe.name, "Omega");
	strictEqual(_recipe.host, "localhost");
	strictEqual(_recipe.desc, "lorem ipsum");
	strictEqual(_recipe.policy.read.length, 0);
	strictEqual(_recipe.policy.manage.length, 1);
	strictEqual(_recipe.policy.manage[0], "R:ADMIN");
	strictEqual(_recipe.policy.owner, "administrator");
	strictEqual(_recipe.recipe.length, 2);
	strictEqual(_recipe.recipe[0].length, 2);
	strictEqual(_recipe.recipe[1][0], "bar");
	strictEqual(_recipe_orig, recipe);
});

test("Collection: Bags", function() {
	// TODO
});

test("Collection: Recipes", function() {
	// TODO
});

test("Collection: Bag Tiddlers", function() {
	// TODO
});

test("Collection: Recipe Tiddlers", function() {
	// TODO
});

test("Collection: Tiddler Revisions", function() {
	// TODO
});

test("ETag", function() {
	var tiddler, _tiddler;
	var host = "localhost";
	_xhr._headers.etag = '"..."';

	var callback = function(tiddler, status, xhr) {
		_tiddler = tiddler;
	};
	var errback = function(xhr, error, exc, tiddler) {};

	_tiddler = null;
	_response = {
		bag: "Alpha",
		created: "00000000000000",
		modified: "00000000000000"
	};
	tiddler = new tiddlyweb.Tiddler("Foo");
	tiddler.bag = new tiddlyweb.Bag("Alpha", host);
	tiddler.get(callback, errback);
	strictEqual(tiddler.etag, undefined);
	strictEqual(_tiddler.etag, '"..."');
});

})(jQuery);
