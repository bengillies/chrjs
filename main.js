/*
 * TiddlyWeb adaptor
 * v0.5.0
 *
 * TODO:
 * * error handling in callbacks
 * * use Crockford's Prototypal Inheritance to avoid "new" operator
 * * remove localAjax (higher-level applications' responsibility)
 * * search support
 */

(function($) {

TiddlyWeb = {
	routes: {
		// host is URL of TiddlyWeb instance (including server_prefix)
		// placeholders "type" & "name" refer to the respective bag/recipe
		root     : "{host}/",
		bags     : "{host}/bags",
		bag      : "{host}/bags/{name}",
		recipes  : "{host}/recipes",
		recipe   : "{host}/recipes/{name}",
		tiddlers : "{host}/{type}s/{name}/tiddlers",
		tiddler  : "{host}/{type}s/{name}/tiddlers/{title}",
		revisions: "{host}/{type}s/{name}/tiddlers/{title}/revisions",
		revision : "{host}/{type}s/{name}/tiddlers/{title}/revisions/{id}",
		search   : "{host}/search?q={query}"
	}
};

var Resource = function() {};
$.extend(Resource.prototype, {
	get: function() {
		localAjax({
			url: this.route(),
			type: "GET",
			dataType: "json",
			success: this.processData,
			error: this.handleError
		});
	},
	processData: function(data, status, xhr) {},
	handleError: function(xhr, error, exc) {},
	route: function() {
		return supplant(TiddlyWeb.routes[this.type], this);
	}
});

var Container = function(type) {
	this.type = type;
};
Container.prototype = new Resource();
$.extend(Container.prototype, {
	listTiddlers: function() {
		// XXX: hacky!?
		var collection = new Container(this.type); // XXX: not a container!?
		collection.container = this; // XXX: unused
		collection.route = function() {
			return supplant(TiddlyWeb.routes[this.type + "s"], this);
		};
		collection.get(); // TODO: adjusted callbacks
	}
});

/*
 * Tiddler
 */

// title is the name of the tiddler
// bag (optional) is the name of the containing bag
// host (optional) is the URI of the originating TiddlyWeb instance
TiddlyWeb.Tiddler = function(title, bag, host) {
	this.title = title;
	this.bag = bag || null;
	this.host = host !== undefined ? host : null;
};
TiddlyWeb.Tiddler.prototype = new Resource();

/*
 * Bag
 */

TiddlyWeb.Bag = function(name) {
	this.name = name;
};
TiddlyWeb.Bag.prototype = new Container("bag");

/*
 * Recipe
 */

TiddlyWeb.Recipe = function(name) {
	this.name = name;
};
TiddlyWeb.Recipe.prototype = new Container("recipe");

/*
 * utilities
 */

// adapted from Crockford (http://javascript.crockford.com/remedial.html)
var supplant = function(str, obj) {
	return str.replace(/{([^{}]*)}/g, function (a, b) { return obj[b] || a; });
};

// enables AJAX calls from a local file
// triggers regular jQuery.ajax call after requesting enhanced privileges
var localAjax = function(args) { // XXX: for debugging purposes only!?
	if(document.location.protocol.indexOf("file") == 0 && window.Components &&
		window.netscape && window.netscape.security) {
		window.netscape.security.PrivilegeManager.
			enablePrivilege("UniversalBrowserRead");
	}
	return jQuery.ajax(args);
};

})(jQuery);
