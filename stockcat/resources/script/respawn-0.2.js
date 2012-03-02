// 
//  respawn-0.2.js
//  Respawn Javascript Game Framework
//  
//  Created by Luke Smith (lukesmithis@gmail.com)
//  (C)opyright 2012 Luke Smith

(function() {

	var KeyDefinitions = {
		8: "backSpace",
		9: "tab",
		13: "enter",
		16: "shift",
		17: "ctrl",
		18: "alt",
		19: "pauseBreak",
		20: "capsLock",
		27: "escape",
		32: "space",
		33: "pageUp",
		34: "pageDown",
		35: "end",
		36: "home",
		37: "leftArrow",
		38: "upArrow",
		39: "rightArrow",
		40: "downArrow",
		45: "insert",
		46: "delete",
		48: "0",
		49: "1",
		50: "2",
		51: "3",
		52: "4",
		53: "5",
		54: "6",
		55: "7",
		56: "8",
		57: "9",
		65: "a",
		66: "b",
		67: "c",
		68: "d",
		69: "e",
		70: "f",
		71: "g",
		72: "h",
		73: "i",
		74: "j",
		75: "k",
		76: "l",
		77: "m",
		78: "n",
		79: "o",
		80: "p",
		81: "q",
		82: "r",
		83: "s",
		84: "t",
		85: "u",
		86: "v",
		87: "w",
		88: "x",
		89: "y",
		90: "z",
		96: "#0",
		97: "#1",
		98: "#2",
		99: "#3",
		100: "#4",
		101: "#5",
		102: "#6",
		103: "#7",
		104: "#8",
		105: "#9",
		106: "multiply",
		107: "add",
		109: "subtract",
		110: "point",
		111: "divide",
		112: "f1",
		113: "f2",
		114: "f3",
		115: "f4",
		116: "f5",
		117: "f6",
		118: "f7",
		119: "f8",
		120: "f9",
		121: "f10",
		122: "f11",
		123: "f12",
		144: "numLock",
		145: "scrollLock",
		186: "semicolon",
		187: "equalSign",
		188: "comma",
		189: "dash",
		190: "period",
		191: "forwardSlash",
		192: "graveAccent",
		219: "openBracket",
		220: "backSlash",
		221: "closeBracket",
		222: "singleQuote"
	},
	
	Collisions = {
		isPointInRect: function(p, r) { return p.x>r.x&&p.x<r.x+r.w&&p.y>r.y&&p.y<r.y+r.h; },
		isLineInRect: function(l, r) { return false; }, //TODO
		isRectInRect: function(r1, r2) { return r1.x<r2.x+r2.w&&r1.x+r1.w>r2.x&&r1.y<r2.y+r2.h&&r1.y+r1.h>r2.y; }
	},

	Utils = {
		arrayAverage: function(Ar) {
			var al = Ar.length,
				ac = 0,
				as = 0;
			while(ac < al) {
				as += Ar[ac];
				ac++;
			};
			return as/al;
		},
		arrayFlatten: function(Ar) {
			var newAr = [];
			var a = Ar,
				al = a.length,
				ac = 0;
			while(ac < al) {
				var aa = a[ac];
				if(aa instanceof Array) {
					var af = Utils.arrayFlatten(aa),
						afl = af.length,
						afc = 0;
					while(afc < afl) {
						newAr.push(af[afc]);
						afc++;
					};
				} else {
					newAr.push(aa);
				};
				ac++;
			};
			return newAr;
		},
		arrayContains: function(Ar, Subject) {
			var a = Ar,
				al = a.length,
				ac = 0;
			while(ac < al) {
				if(a[ac] == Subject) {
					return true;
				};
				ac++;
			};
			return false;
		},
		arrayDifference: function(Ar1, Ar2) {
			return Ar1.filter(function(i) {
				return Ar2.indexOf(i) == -1;
			});
		},
		convertObjectToArray: function(Obj) {
			var ar = [];
			for(var o in Obj) {
				ar.push({
					key: o,
					value: Obj[o]
				});
			};
			return ar;
		}
	};





	this.Class = function Class(Name, Definition) {

		function _findNamespace(NamespaceArray) {
			var na = NamespaceArray, nal = na.length - 1, c = 0, context = this;
			while(c < nal) { context = (context[na[c]] = context[na[c]] || {}); c++; };
			return context;
		};

		var splitName = Name.replace(/\s/g, "").split(":"),

			classPath = splitName[0],
			inheritPath = splitName[1],

			classNamespaceArray = classPath.split("."),
			inheritNamespaceArray = inheritPath ? inheritPath.split(".") : [],

			className = classNamespaceArray[classNamespaceArray.length-1],
			inheritName = inheritNamespaceArray[inheritNamespaceArray.length-1],

			classNamespace = _findNamespace(classNamespaceArray),
			inheritNamespace = _findNamespace(inheritNamespaceArray),

			constructor = Definition[className],
			inherit = inheritNamespace[inheritName];

		if(!constructor) console.warn(["Cannot find a constructor with a name of ",classPath,"."].join(""));
		if(!inherit && inheritName) console.warn(["Cannot find inheriting class ",inheritPath," for class ",classPath,"."].join(""));

		for(var d in Definition) {
			if(typeof Definition[d] == "function" && inherit) {
				Object.defineProperty(Definition[d], "inheritMethod", { value: inherit.prototype[d == className ? "constructor" : d] });
			};
		};

		var f = Function("return function "+className+"() {if(arguments[0]!=\"BYPASS_CONSTRUCTOR\")this.constructor.apply(this,arguments)};")();

		f.prototype = inherit ? (function(a, b) {
			var o = new a("BYPASS_CONSTRUCTOR");
			for(var p in b) o[p] = b[p];
			return o;
		})(inherit, Definition) : Definition;

		f.prototype.className = className;
		f.prototype.constructor = constructor;
		delete f.prototype[className];

		if(!f.prototype.super) f.prototype.super = function() { arguments.callee.caller.inheritMethod.apply(this, arguments); };

		classNamespace[className] = f;
	};





	///////////////////////////////////////////////////////////////////////////
	// Base
	Class("Respawn.Base", {
		globals: {},
		Base: function() {
			this.parent;
			this.children = [];
			this.eventListeners = this.eventListeners || [];
		},
		addChild: function(Child) {
			Child.parent = this;
			if(!this.hasOwnProperty("children")) {
				this.children = [Child];
			} else {
				this.children.push(Child);
			};
			return Child;
		},
		removeChild: function(Child) {
			if(this.hasOwnProperty("children")) {
				var c = this.children,
					cl = c.length,
					cc = 0;
				while(cc < cl) {
					if(c[cc] === Child) {
						c.splice(cc, 1);
					};
					cc++;
				};
			};
		},
		on: function(EventName, Callback) {
			var e = {
				context: this,
				name: EventName,
				callback: Callback
			};
			if(!this.hasOwnProperty("eventListeners")) {
				this.eventListeners = [e];
			} else {
				this.eventListeners.push(e);
			};
			return this;
		},
		trigger: function(EventName, EventParams) {
			if(this.hasOwnProperty("eventListeners")) {
				var el = this.eventListeners,
					ell = el.length,
					elc = 0;	
				while(elc < ell) {
					if(el[elc].name == EventName) {
						el[elc].callback.call(this, EventParams);
					};
					elc++;
				};
			};
		},
		traverse: function(fn) {
			fn.call(this);
			var c = this.children,
				cl = c.length,
				cc = 0;
			while(cc < cl) {
				c[cc].traverse(fn);
				cc++;
			};
		}
	});





	///////////////////////////////////////////////////////////////////////////
	// Logical
	Class("Respawn.Logical : Respawn.Base", {
		Logical: function() {
			this.super();
		},
		/*override*/ update: function() {}
	});





	///////////////////////////////////////////////////////////////////////////
	// Entity
	Class("Respawn.Entity : Respawn.Logical", {
		Entity: function() {
			this.super();

			this.z = this.w = this.h = 0;
			this.relativePosition = true;

			//private
			var _x = 0,
				_y = 0,
				_visible = true;

			//expose properties relative to parent
			Object.defineProperties(this, {
				x: {
					get: function() {
						if(this.relativePosition && this.parent && this.parent.x) return _x + this.parent.x;
						return _x;
					},
					set: function(x) { _x = x; }
				},
				y: {
					get: function() {
						if(this.relativePosition && this.parent && this.parent.y) return _y + this.parent.y;
						return _y;
					},
					set: function(y) { _y = y; }
				},
				visible: {
					get: function() {
						return this.parent && _visible !== false ? this.parent.visible : _visible;
					},
					set: function(visible) { _visible = visible; }
				}
			});
		},
		/*override*/ draw: function() {}
	});





	///////////////////////////////////////////////////////////////////////////
	// Resource
	Class("Respawn.Resource : Respawn.Base", {
		Resource: function() {
			this.super();
			this.ready = false;
		},
		/*override*/ load: function() {}
	});





	///////////////////////////////////////////////////////////////////////////
	// Audio
	Class("Respawn.Audio : Respawn.Resource", {
		Audio: function() {
			this.super();
		}
	});





	///////////////////////////////////////////////////////////////////////////
	// Image
	Class("Respawn.Image : Respawn.Resource", {
		Image: function(ImageSrc) {
			this.super();

			this.DOMImage = new Image();
			this.DOMImageSrc = ImageSrc;
		},
		load: function() {
			var _self = this;
			this.DOMImage.addEventListener("load", function() {
				_self.ready = true;
			});
			this.DOMImage.src = this.DOMImageSrc;
		}
	});





	///////////////////////////////////////////////////////////////////////////
	// Sprite
	Class("Respawn.Sprite : Respawn.Entity", {
		Sprite: function(ImageSrc) {
			this.super();

			this.image = new Respawn.Image(ImageSrc);
			this.addChild(this.image);

			this.playing = false;
			this.repeat = false;
			this.currentAnimation;
			this.lastFrameTime = Date.now();

			this.frames = {};
			this.animations = {};

			return this;
		},
		setFrame: function(FrameNumber, X, Y, W, H) {
			this.frames[FrameNumber] = {
				x: X,
				y: Y,
				w: W || this.w,
				h: H || this.h
			};

			return this;
		},
		setAnimation: function(AnimationName, Animation) {
			var frameSequence = [],
				timeSequence = [];

			var a = Animation,
				al = a.length,
				ac = 0;
			while(ac < al) {

				frameSequence.push(a[ac]);
				timeSequence.push(a[ac+1]);

				ac+=2;
			};

			this.animations[AnimationName] = {
				name: AnimationName,
				frameSequence: frameSequence,
				timeSequence: timeSequence,
				index: 0
			};

			return this;
		},
		play: function(AnimationName, Repeat, Callback) {
			this.currentAnimation = this.animations[AnimationName];
			if(!this.currentAnimation) {
				console.warn("There is not an animation with a name of \"" +AnimationName+ "\"!");
			};
			this.currentAnimation.index = 0;
			this.currentAnimation.repeat = Repeat || false;
			this.currentAnimation.callback = Callback;
			this.playing = true;
		},
		stop: function() {
			this.playing = false;
		},
		goToNextFrame: function() {
			if(this.currentAnimation.index + 1 < this.currentAnimation.frameSequence.length) {
				this.currentAnimation.index++;
			} else {
				if(this.currentAnimation.repeat) {
					this.currentAnimation.index = 0;
				} else if(this.currentAnimation.callback) {
					this.currentAnimation.callback.call(this);
				};
			};
			this.lastFrameTime = Date.now();
		},
		drawFrame: function(FrameNumber, X, Y) {
			var ctx = this.globals["canvasContext"],
				frame = this.frames[FrameNumber];

			ctx.drawImage(this.image.DOMImage,
				frame.x, frame.y,
				frame.w, frame.h,
				X, Y,
				frame.w, frame.h
			);
		},
		update: function(time) {
			if(this.playing) {
				
				//TODO use time variable here
				var	index = this.currentAnimation.index,
					now = Date.now(),
					last = this.lastFrameTime,
					delta = now - last;

				if(delta > this.currentAnimation.timeSequence[index]) {
					this.goToNextFrame();
				};
			};
		},
		draw: function(ctx) {
			if(this.playing) {
				var frame = this.frames[this.currentAnimation.frameSequence[this.currentAnimation.index]];
				ctx.drawImage(this.image.DOMImage,
					frame.x, frame.y,
					frame.w, frame.h,
					this.x, this.y,
					frame.w, frame.h
				);
			};
		}
	});





	///////////////////////////////////////////////////////////////////////////
	// Tween
	Class("Respawn.Tween : Respawn.Entity", {
		Tween: function() {}
	});





	///////////////////////////////////////////////////////////////////////////
	// TextField
	Class("Respawn.TextField : Respawn.Entity", {
		TextField: function(Options) {
			this.super();

			Options = Options || {};

			this.x = Options.x || 0;
			this.y = Options.y || 0;
			this.w = Options.w || 100;
			this.align = Options.align || "left";
			this.color = Options.color || "#000";
			this.font = Options.font || "normal 12px sans-serif";
			this.fontStyleHeight = +this.font.match(/(\d+)px/)[1] || 12;
			this.h = Options.h || this.fontStyleHeight;
			this.readOnly = Options.readOnly === false ? Options.readOnly : true;
			this.z = Options.z || this.z;

			this.focus = false;
			this.alignXOffset = 0;
			this.selection = {
				x: 0,
				w: 0
			};

			this.ip = this.globals["inputProxy"];

			var _self = this,
				_value = Options.value || "";

			//hook in valueChange event
			Object.defineProperty(this, "value", {
				get: function() { return _value; },
				set: function(value) {
					var oldValue = _value;
					_value = value.toString();
					_self.trigger("valueChange", {
						newValue: _value,
						oldValue: oldValue
					});
				}
			});

			this.on("valueChange", function(e) {
				_self.selectionLogic();
			});

			this.on("focus", function(e) {
				if(!this.readOnly) {
					_self.focus = true;
					_self.ip.value = _self.value;
					_self.ip.selectionStart = _self.ip.selectionEnd = _self.translateXCoordToIndex(e.offsetX);
					_self.selectionLogic();
				};
			}).on("blur", function(e) {
				if(!this.readOnly) {
					_self.focus = false;
					_self.globals["focus"] = _self.parent;
				};
			}).on("keydown", function(e) {
				if(!this.readOnly) {
					setTimeout(function() { //this timeout is needed to wait for the dom
		                if(e.keyIdentifier == "Enter") {
		                    _self.trigger("blur", e);
		                    _self.value = "";
		                } else {
							_self.value = _self.ip.value;
							_self.selectionLogic();
		                };
					});
				};
			}).on("click", function(e) {
				if(!this.readOnly) {
					_self.ip.selectionStart = _self.ip.selectionEnd = _self.translateXCoordToIndex(e.offsetX);
					_self.selectionLogic();
				};
			});

			this.selectionLogic();
		},
		draw: function(ctx) {

			//save before clipping
			ctx.save();

			//clipping region
			ctx.beginPath();
			ctx.rect(this.x, this.y, this.w, this.h);
			ctx.clip();

			//draw selection
			if(this.focus && ~~(Date.now()/500 % 2)) {
				ctx.fillStyle = this.color;
				ctx.fillRect(this.x + this.selection.x + this.alignXOffset, this.y, this.selection.w, this.h);
			};

			//draw text
			ctx.font = this.font;
			ctx.fillStyle = this.color;
			ctx.fillText(this.value, this.x + this.alignXOffset, this.y + this.fontStyleHeight);

			//get rid of clipping region
			ctx.restore();
		},
		selectionLogic: function() {
			var ctx = this.globals["canvasContext"];
			ctx.font = this.font; //reinstate font style for accurate measurments

			//calc xoffset for alignment
			if(this.align == "left") {
				this.alignXOffset = 0;
			} else if(this.align == "right") {
				this.alignXOffset = this.w - ctx.measureText(this.value).width;
			} else if(this.align == "center") {
				this.alignXOffset = this.w/2 - ctx.measureText(this.value).width/2;
			};

			//measure selection size
			this.selection.x = ctx.measureText(this.value.slice(0, this.ip.selectionStart)).width;
			this.selection.w = ctx.measureText(this.value.slice(this.ip.selectionStart, this.ip.selectionEnd)).width || 1;
		},
		translateXCoordToIndex: function(XCoord) {
			var relativeXCoord = XCoord - this.x - this.alignXOffset,
				v = this.value,
				vl = v.length,
				vc = 0,
				stringBuffer = "";
			while(vc < vl) {
				stringBuffer += this.value.substring(vc, vc+1);
				var stringBufferWidth = this.globals["canvasContext"].measureText(stringBuffer).width,
					characterWidth = this.globals["canvasContext"].measureText(v[vc]).width;
				if(stringBufferWidth - characterWidth/2 > relativeXCoord) {
					return vc;
				};
				vc++;
			};
			return vl;
		}
	});





	///////////////////////////////////////////////////////////////////////////
	// QuadTree
	Class("Respawn.QuadTree : Respawn.Entity", {
		QuadTree: function(X, Y, W, H, QuadDepth) {
			this.super();

			this.x = X;
			this.y = Y;
			this.w = W;
			this.h = H;
			this.quadDepth = QuadDepth;
			this.members = [];

			if(this.quadDepth > 0) {
				var x = this.x,
					y = this.y,
					w = this.w,
					h = this.h,
					w2 = w/2,
					h2 = h/2,
					qd = this.quadDepth - 1;

				this.addChild(new Respawn.QuadTree(x, y, w2, h2, qd));
				this.addChild(new Respawn.QuadTree(x+w2, y, w2, h2, qd));
				this.addChild(new Respawn.QuadTree(x+w2, y+h2, w2, h2, qd));
				this.addChild(new Respawn.QuadTree(x, y+h2, w2, h2, qd));
			};
		},
		findCollidingQuads: function(Subject) {
			if(this.quadDepth > 0) {
				var m = this.children,
					ml = m.length,
					mc = 0,
					collidingQuads = [];
				while(mc < ml) {
					var thisQuad = m[mc];
					if(Collisions.rectInRect(Subject, thisQuad)) {
						collidingQuads.push(thisQuad.findCollidingQuads(Subject));
					};
					mc++;
				};
				return Utils.arrayFlatten(collidingQuads);
			} else {
				return this;
			};
		},
		populate: function(SubjectList) {
			var c = SubjectList,
				cl = c.length,
				cc = 0;
			while(cc < cl) {
				var cq = this.findCollidingQuads(c[cc]),
					cql = cq.length,
					cqc = 0;
				while(cqc < cql) {
					cq[cqc].members.push(c[cc]);
					cqc++;
				};
				cc++;
			};
		}
	});





	///////////////////////////////////////////////////////////////////////////
	// State
	Class("Respawn.State : Respawn.Base", {
		State: function() {
			this.super();

			this.ready = false;
			this.loading = false;
			this.loadingPercentage = 0;
		},
		getResourceCounts: function() {
			var totalCount = 0,
				readyCount = 0;
			this.traverse(function() {
				if(this instanceof Respawn.Resource) {
					totalCount++;
					if(this.ready) {
						readyCount++;
					};
				};
			});
			return {
				totalCount: totalCount,
				readyCount: readyCount
			};
		},
		update: function(time) {
			if(!this.ready) {
				var counts = this.getResourceCounts(),
					readyPercentage = (counts.readyCount / counts.totalCount),
					noResources = counts.totalCount == 0;

				this.loadingPercentage = readyPercentage;

				if(readyPercentage == 1 || noResources) {
					this.ready = true;
					this.loading = false;
					console.log("Everything has loaded. Running "+this.className+"...");
				};
			};
		},
		draw: function(ctx) {
			if(!this.loading) {
				this.loading = true;
				this.load();
			} else {
				//loading animation
				ctx.fillStyle = "black";
				ctx.fillRect(0, 0, this.globals["canvasWidth"] * this.loadingPercentage, 2);
			};
		},
		load: function() {
			//trigger resources to load
			this.traverse(function() {
				if(this instanceof Respawn.Resource) {
					this.load();
				};
			});
		}
	});





	///////////////////////////////////////////////////////////////////////////
	// Core
	Class("Respawn.Core : Respawn.Base", {
		Core: function(Options) {
			this.canvas = Options.canvas;
			this.canvasContext = this.canvas.getContext("2d");

			this.globals["canvasContext"] = this.canvasContext;
			this.globals["canvasWidth"] = this.canvas.width;
			this.globals["canvasHeight"] = this.canvas.height;
			this.globals["focus"] = this;

			this.requestAnimationFrame = 
				window.requestAnimationFrame || 
				window.webkitRequestAnimationFrame || 
				window.mozRequestAnimationFrame || 
				window.oRequestAnimationFrame || 
				window.msRequestAnimationFrame || 
				function(Callback, Element) { window.setTimeout(Callback, 1000 / 60); };

			this.createInputProxy();
			this.addCanvasEventListeners();
			this.addKeyboardEventListeners();
		},
		createInputProxy: function() {
			this.inputProxy = document.createElement("input");
			this.inputProxy.setAttribute("id", "respawnInternalInputProxy");
			this.inputProxy.setAttribute("style", "position:absolute;left:0;top:-100px;");
			document.body.appendChild(this.inputProxy);
			this.globals["inputProxy"] = this.inputProxy;
		},
		addCanvasEventListeners: function() {
			var handle = this.handleCanvasEvent.bind(this);
			this.canvas.addEventListener("click", handle, false);
			this.canvas.addEventListener("dblclick", handle, false);
			this.canvas.addEventListener("contextmenu", handle, false);
			this.canvas.addEventListener("mousemove", handle, false);
			this.canvas.addEventListener("mousedown", handle, false);
			this.canvas.addEventListener("mouseup", handle, false);
			this.canvas.addEventListener("mousewheel", handle, false);
		},
		handleCanvasEvent: function(e) {
			var target = this.findCanvasMouseEventTarget({
					x: e.offsetX,
					y: e.offsetY
				});

			if(target) {
				target.trigger(e.type, e);

				//piggy back on click event for focus event
				if(e.type == "click" && this.globals["focus"] != target) {
					this.globals["focus"].trigger("blur");
					this.globals["focus"] = target;
					target.trigger("focus", e);
				};
			};
		},
		findCanvasMouseEventTarget: function(MouseLocation) {
			var collidingObjectList = [];

			this.traverse(function() {
				if(this instanceof Respawn.Entity && Collisions.isPointInRect(MouseLocation, this)) {
					collidingObjectList.push(this);
				};
			});

			collidingObjectList.sort(function(a, b) {
				return a.z - b.z;
			});

			return collidingObjectList.length ? collidingObjectList.pop() : false;
		},
		addKeyboardEventListeners: function() {
			window.addEventListener("keydown", this.handleKeyDownEvent.bind(this), false);
			window.addEventListener("keyup", this.handleKeyUpEvent.bind(this), false);
			window.addEventListener("keypress", this.handleKeyPressEvent.bind(this), false);
		},
		handleKeyDownEvent: function(e) {
			this.globals["focus"].trigger("keydown", e);
		},
		handleKeyPressEvent: function(e) {
			this.globals["focus"].trigger("keypress", e);
		},
		handleKeyUpEvent: function(e) {
			this.globals["focus"].trigger("keyup", e);
		}
	});





	///////////////////////////////////////////////////////////////////////////
	// Engine
	Class("Respawn.Engine : Respawn.Core", {
		Engine: function(Options) {
			this.super(Options);

			this.state = new Options.state();
			this.addChild(this.state);

			this.running = false;
			this.lastLoopTime = 0;
		},
		loop: function() {

			//some inits and time calc
			var _self = this,
				thisLoopTime = Date.now(),
				lastLoopTime = this.lastLoopTime || thisLoopTime,
				loopTimeDifference = thisLoopTime - lastLoopTime;

			//save this time for next loop
			this.lastLoopTime = thisLoopTime;

			//some containers
			var objectList = [];

			//check state
			if(!_self.state.ready) {
				objectList.push(_self.state);

			} else {
				//state is ready, get all objects on the chain
				this.traverse(function() {
					if(this instanceof Respawn.Logical || this instanceof Respawn.Entity) {
						objectList.push(this);
					};
				});

				//sort objects
				objectList.sort(function(a, b) {
					return a.z - b.z;
				});
			};

			var ol = objectList,
				oll = ol.length,
				olc = 0;
			while(olc < oll) {
				if(ol[olc].update) {
					ol[olc].update(
						loopTimeDifference / 1000
					);
				};
				if(ol[olc].draw && ol[olc].visible !== false) {
					ol[olc].draw(
						_self.canvasContext
					);
				};
				olc++;
			};

			//run again
			if(this.running) {
				this.requestAnimationFrame.call(window, function() {
					_self.loop();
				}, this.canvasElement);
			};
		},
		start: function() {
			if(!this.running) {
				this.running = true;
				this.loop();
			};
		},
		stop: function() {
			this.running = false;
		}
	});
	
})();