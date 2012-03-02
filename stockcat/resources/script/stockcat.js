(function() {

    var Utils = {
            getRandomInt: function(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
        },
        Urls = {
            quote: "http://dev.markitondemand.com/Api/Quote/jsonp",
            lookup: "http://dev.markitondemand.com/Api/Lookup/jsonp"
        };

    Class("StockCat.QuoteService", {
        QuoteService: function() {
            this.xhr;
            this.DATA_SRC = Urls.quote;
        },
        makeRequest: function(sSymbol, fSuccess, fError) {
            //Abort any open requests
            if (this.xhr) { this.xhr.abort(); }
            //Start a new request
            this.xhr = $.ajax({
                data: { symbol: sSymbol },
                url: this.DATA_SRC,
                dataType: "jsonp",
                success: fSuccess,
                error: fError,
                context: this
            });
        }
    });

    Class("StockCat.SymbolLookup", {
        SymbolLookup: function() {
            this.xhr;
            this.DATA_SRC = Urls.lookup;
        },
        makeRequest: function(searchString, fSuccess, fError) {
            //Abort any open requests
            if (this.xhr) { this.xhr.abort(); }
            //Start a new request
            this.xhr = $.ajax({
                data: { input: searchString },
                url: this.DATA_SRC,
                dataType: "jsonp",
                success: fSuccess,
                error: fError,
                context: this
            });
        }
    });

    Class("StockCat.SpeechBubble : Respawn.Entity", {
        SpeechBubble: function() {
            this.super();

            var basicFontStyle = "bold 14px Arial",
                plc = 24;

            this.sprite = new Respawn.Sprite("resources/images/bubbleSprite.png");
            this.sprite.setFrame(0, 0, 0, 280, 243);
            this.addChild(this.sprite);

            this.symbolTextField = new Respawn.TextField({ font: "bold 26px Arial", color: "#40536b", x: 20, y: 14, h: 26, z: 2 });
            this.addChild(this.symbolTextField);

            this.companyNameTextField = new Respawn.TextField({ font: "bold 16px Arial", color: "#63a7fc", x: 20, y: plc += 20, w: 230, h: 30, z: 2 });
            this.addChild(this.companyNameTextField);

            this.changesTextField = new Respawn.TextField({ font: basicFontStyle, x: 20, y: plc += 25, w: 200, h: 30, z: 2 });
            this.addChild(this.changesTextField);

            this.openTextField = new Respawn.TextField({ font: basicFontStyle, color: "#40536b", x: 20, y: plc += 25, w: 120, h: 20, z: 2 });
            this.addChild(this.openTextField);
            this.openTextFieldData = new Respawn.TextField({ font: basicFontStyle, color: "#63a7fc", x: 70, y: plc, w: 120, h: 20, z: 2 });
            this.addChild(this.openTextFieldData);

            this.lastTextField = new Respawn.TextField({ font: basicFontStyle, color: "#40536b", x: 140, y: plc, w: 120, h: 20, z: 2 });
            this.addChild(this.lastTextField);
            this.lastTextFieldData = new Respawn.TextField({ font: basicFontStyle, color: "#63a7fc", x: 180, y: plc, w: 120, h: 20, z: 2 });
            this.addChild(this.lastTextFieldData);

            this.highTextField = new Respawn.TextField({ font: basicFontStyle, color: "#40536b", x: 20, y: plc += 20, w: 120, h: 20, z: 2 });
            this.addChild(this.highTextField);
            this.highTextFieldData = new Respawn.TextField({ font: basicFontStyle, color: "#63a7fc", x: 70, y: plc, w: 120, h: 20, z: 2 });
            this.addChild(this.highTextFieldData);

            this.lowTextField = new Respawn.TextField({ font: basicFontStyle, color: "#40536b", x: 140, y: plc, w: 120, h: 20, z: 2 });
            this.addChild(this.lowTextField);
            this.lowTextFieldData = new Respawn.TextField({ font: basicFontStyle, color: "#63a7fc", x: 180, y: plc, w: 120, h: 20, z: 2 });
            this.addChild(this.lowTextFieldData);

            this.mktCapTextField = new Respawn.TextField({ font: basicFontStyle, color: "#40536b", x: 20, y: plc += 20, w: 200, h: 20, z: 2 });
            this.addChild(this.mktCapTextField);
            this.mktCapTextFieldData = new Respawn.TextField({ font: basicFontStyle, color: "#63a7fc", x: 90, y: plc, w: 200, h: 20, z: 2 });
            this.addChild(this.mktCapTextFieldData);

            this.volumeTextField = new Respawn.TextField({ font: basicFontStyle, color: "#40536b", x: 20, y: plc += 20, w: 200, h: 20, z: 2 });
            this.addChild(this.volumeTextField);
            this.volumeTextFieldData = new Respawn.TextField({ font: basicFontStyle, color: "#63a7fc", x: 90, y: plc, w: 200, h: 20, z: 2 });
            this.addChild(this.volumeTextFieldData);

            this.timestampTextField = new Respawn.TextField({ font: "normal 10px Arial", color: "#666", align: "right", x: 20, y: 180, w: 232, h: 14, z: 2 });
            this.addChild(this.timestampTextField);
        },
        show: function(Data) {

            this.symbolTextField.value = Data.Symbol;
            this.companyNameTextField.value = Data.Name;

            var sign = "";
            if (Data.Change == 0) {
                this.changesTextField.color = "#666";
            } else if (Data.Change > 0) {
                sign = "+";
                this.changesTextField.color = "#61bd9f";
            } else if (Data.Change < 0) {
                this.changesTextField.color = "#c05d5d";
            };
            this.changesTextField.value = sign + Data.Change.toFixed(2) + " (" + sign + Data.ChangePercent.toFixed(3) + "%)";

            this.openTextField.value = "Open: ";
            this.openTextFieldData.value = "$" + Data.Open;
            this.lastTextField.value = "Last: ";
            this.lastTextFieldData.value = "$" + Data.LastPrice;
            this.highTextField.value = "High: ";
            this.highTextFieldData.value = "$" + Data.High;
            this.mktCapTextField.value = "Mkt Cap: ";
            this.mktCapTextFieldData.value = Data.MarketCap;
            this.volumeTextField.value = "Volume: ";
            this.volumeTextFieldData.value = Data.Volume;
            this.timestampTextField.value = "As of: " + Data.Timestamp;
            this.lowTextField.value = "Low: ";
            this.lowTextFieldData.value = "$" + Data.Low;

            this.visible = true;
        },
        hide: function() {
            this.visible = false;
        },
        draw: function(ctx) {
            this.sprite.drawFrame(0, this.x, this.y);
        }
    });

    Class("StockCat.CatMouth : Respawn.Entity", {
        CatMouth: function() {
            this.super();

            this.w = 80;
            this.h = 30;

            this.textField = new Respawn.TextField({
                font: "normal 20px Arial",
                w: this.w,
                h: this.h,
                align: "center",
                readOnly: false
            });
            this.textField.z = 2;
            this.addChild(this.textField);

            this.quoteService = new StockCat.QuoteService();

            var _self = this;
            this.textField.on("click", function(e) {
                _self.parent.speechBubble.hide();
                _self.parent.openMouth();
            });
            this.textField.on("keydown", function(e) {
                if (e.keyIdentifier == "Enter") {
                    _self.parent.munch();

                    var value = this.value;
                    setTimeout(function() {
                        _self.quoteService.makeRequest(value, function(JsonResult) {
                            //success
                            _self.parent.react(JsonResult);
                        }, function() {
                            //error
                            _self.parent.barf();
                            console.log("ajax error");
                        });
                    }, 2000);
                };
            });
        }
    });

    Class("StockCat.Cat : Respawn.Entity", {
        Cat: function() {
            this.super();

            var _self = this;

            this.x = 260;
            this.y = 100;
            this.z = 0;
            this.w = 300;
            this.h = 600;
            this.status = "idle";

            this.bodySprite = new Respawn.Sprite("resources/images/cat-parts-Sprite.png")
                .setFrame(1, 0, 0, 262, 185) //head
                .setFrame(2, 0, 185, 154, 270) //body
                .setFrame(3, 154, 191, 92, 187); //tail
            this.addChild(this.bodySprite);

            this.expressionSprite = new Respawn.Sprite("resources/images/Expressions.png")
                .setFrame(1, 0, 0, 323, 152)       //Super Sad
                .setFrame(2, 0, 456, 323, 152)     //Mouth Open
                .setFrame(3, 0, 610, 323, 151)     //Neutral Face
                .setFrame(4, 323, 0, 323, 152)     //Nom 1
                .setFrame(5, 323, 152, 323, 152)   //Nom 2
                .setFrame(6, 323, 305, 323, 152)   //Nom 3
                .setFrame(7, 323, 458, 323, 152)   //Nom 4
                .setFrame(8, 646, 0, 323, 152)     //Sad
                .setFrame(9, 646, 152, 323, 152)   //Happy
                .setFrame(10, 646, 304, 323, 152)  //Super Happy 1
                .setFrame(11, 646, 455, 323, 152)  //Super Happy 2
                .setAnimation("openMouth", [2, 0])
                .setAnimation("idle", [3, 0])
                .setAnimation("sad", [8, 0])
                .setAnimation("happy", [9, 0])
                .setAnimation("superSad", [1, 0])
                .setAnimation("glimmerEyes", [10, 100, 11, 100])
                .setAnimation("munching", [4, 200, 5, 200, 4, 200, 5, 200, 6, 200, 7, 200, 6, 200, 7, 200]);
            this.expressionSprite.x = -36;
            this.expressionSprite.y = 33;
            this.expressionSprite.z = 1;
            this.addChild(this.expressionSprite);

            this.blinkSprite = new Respawn.Sprite("resources/images/Expressions.png")
                .setFrame(0, 323, 609, 323, 152)    //blank
                .setFrame(1, 0, 152, 323, 152)      //Blink 1
                .setFrame(2, 0, 304, 323, 152)      //Blink 2
                .setAnimation("idle", false)
                .setAnimation("blink", [1, 50, 2, 50, 1, 50, 0, 0]);
            this.blinkSprite.x = -36;
            this.blinkSprite.y = 33;
            this.blinkSprite.z = 2;
            this.addChild(this.blinkSprite);

            this.barfSprite = new Respawn.Sprite("resources/images/BadTickerSprite.png")
                .setFrame(1, 0, 0, 260, 289) //Start
                .setFrame(2, 258, 0, 260, 289)
                .setFrame(3, 517, 0, 260, 289)
                .setFrame(4, 774, 0, 260, 289)
                .setFrame(5, 1031, 0, 259, 289) // Start Puke
                .setFrame(6, 0, 279, 260, 283)
                .setFrame(7, 258, 279, 260, 283) //Puke can cycle from here to the end
                .setFrame(8, 516, 279, 260, 283)
                .setFrame(9, 774, 279, 260, 283)
                .setFrame(10, 1032, 279, 258, 283)
                .setAnimation("beginningBarf", [1, 2000, 2, 200, 3, 200, 4, 200, 5, 100, 6, 100])
                .setAnimation("cycleBarf", [7, 100, 8, 100, 9, 100, 10, 100]);
            this.barfSprite.x = -2;
            this.barfSprite.y = 64;
            this.barfSprite.z = 1;
            this.addChild(this.barfSprite);

            //click area for the mouth
            this.mouth = new StockCat.CatMouth();
            this.mouth.x = 90;
            this.mouth.y = 140;
            this.addChild(this.mouth);

            this.speechBubble = new StockCat.SpeechBubble();
            this.speechBubble.x = 270;
            this.speechBubble.y = -100;
            this.speechBubble.visible = false;
            this.addChild(this.speechBubble);

            this.expressionSprite.play("idle");

            //start up the blinking
            this.blink();
        },
        blink: function() {
            var _self = this;

            if (this.status == "idle" || this.status == "munching") {
                this.blinkSprite.play("blink");
            };

            //loop this function on a random interval
            setTimeout(function() {
                _self.blink();
            }, Utils.getRandomInt(500, 7000));
        },
        barf: function() {
            var _self = this;
            this.status = "barfing";
            this.expressionSprite.visible = false;
            this.barfSprite.play("beginningBarf", false, function() {
                this.play("cycleBarf", true);
                setTimeout(function() {
                    _self.stopBarfing();
                }, 3000);
            });
        },
        stopBarfing: function() {
            this.expressionSprite.visible = true;
            this.barfSprite.stop();
            this.closeMouth();
        },
        openMouth: function() {
            this.status = "mouthOpen";
            this.expressionSprite.play("openMouth");
        },
        closeMouth: function() {
            this.status = "idle";
            this.expressionSprite.play("idle");
        },
        munch: function() {
            this.status = "munching";
            this.expressionSprite.play("munching", true);
        },
        smile: function() {
            this.status = "smiling";
            this.expressionSprite.play("happy");
        },
        glimmer: function() {
            this.status = "glimmering";
            this.expressionSprite.play("glimmerEyes", true);
        },
        frown: function() {
            this.status = "frowning";
            this.expressionSprite.play("sad", true);
        },
        superFrown: function() {
            this.status = "superFrowning";
            this.expressionSprite.play("superSad", true);
        },
        react: function(JsonResult) {
			var success = false;
			var matches = !!JsonResult.Matches;
			if(matches){
				var status = JsonResult.Data.Status;
				if(status == "SUCCESS"){success = true;}
			} 
            if (success) {
                var changePercent = JsonResult.Data.ChangePercent;
                if (changePercent == 0) {
                    //no change
                    this.closeMouth();
                } else if (changePercent > 0) {
                    //positive change
                    if (changePercent > 5) {
                        this.glimmer();
                    } else {
                        this.smile();
                    };
                } else if (changePercent < 0) {
                    //negative change
                    if (changePercent < -5) {
                        this.superFrown();
                    } else {
                        this.frown();
                    };
                };

                this.speechBubble.show(JsonResult.Data);

            } else {
                this.barf();
            };
        },

        draw: function(ctx) {

            //draw tail
            this.bodySprite.drawFrame(3, this.x + 10, this.y + 144);

            //draw body
            this.bodySprite.drawFrame(2, this.x + 50, this.y + 164);

            //draw head
            this.bodySprite.drawFrame(1, this.x + 0, this.y + 0);
        }
    });

    Class("StockCat.Clear : Respawn.Entity", {
        Clear: function() {
            this.super();

            this.w = this.globals["canvasWidth"];
            this.h = this.globals["canvasHeight"];
        },
        draw: function(ctx) {
            ctx.clearRect(this.x, this.y, this.w, this.h);
        }
    });

    Class("StockCat.DefaultState : Respawn.State", {
        DefaultState: function() {
            this.super();

            this.clear = new StockCat.Clear();
            this.addChild(this.clear);

            this.cat = new StockCat.Cat();
            this.addChild(this.cat);
        }
    });

    Class("StockCat.StockCat : Respawn.Engine", {
        StockCat: function() {
            this.super({
                canvas: document.getElementById("canvas"),
                state: StockCat.DefaultState
            });
            this.start();
        }
    });

    window.addEventListener("load", function() {
        window.g = new StockCat.StockCat();
    });

})();

var stockcat = function() {
    this.symbolLookup = new StockCat.SymbolLookup();
    this._listeners();
};
stockcat.prototype._listeners = function() {
    var _self = this;
    $('#catFood').click(function() {
        $('#lookupPopUpContainer').removeClass("hide").addClass("show");
        $('div.darkenBackground').removeClass("hide").addClass("show");
    });
    $('#close').click(function() {
        $('#lookupPopUpContainer').removeClass("show").addClass("hide");
        $('div.darkenBackground').removeClass("show").addClass("hide");
     });
    $("form").bind("submit", function() { _self._symbolLookupSubmit(); return false; });
};
stockcat.prototype._symbolLookupSubmit = function() {
    var _self = this;
    var input = $('input[name~="companyName"]').val();
    _self.symbolLookup.makeRequest(input, function(JsonResult) {
        //success
        var html = _self._buildResults(JsonResult);
        $('div.symbolLookupResults').html(html).ready(_self._bindResults());
        
    }, function() {
        //error
        console.log("ajax error");
    });
};
stockcat.prototype._buildResults = function(object) {
    var resultsTable = [];
    if (object != undefined && object.length != 0) {
        resultsTable.push("<table id=\'resultsTable\'><thead><tr><th class=\"symbol\">Ticker Symbol</th><th>Company Name</th></tr></thead><tbody>");
        for (var i = 0; i < object.length; i++) {
            resultsTable.push("<tr>");
                resultsTable.push("<td class=\"symbol\">" + object[i].Symbol + "</td>");
                resultsTable.push("<td>" + object[i].Name + "</td>");
            resultsTable.push("</tr>");
        }
        resultsTable.push("</tbody></table>");
    } else {
        resultsTable.push("<span class=\'noResults\'>There are no results</span>");
    };

    return resultsTable.join('');
};
stockcat.prototype._bindResults = function() {
    $("td.symbol").hover(
        function(){$(this).addClass("hover");},
        function(){$(this).removeClass("hover");}
    );
    $("td.symbol").click(function() {
        var symbol = $(this).text(); // the symbol clicked on.
        //close fish
        $('#lookupPopUpContainer').removeClass("show").addClass("hide");
        $('div.darkenBackground').removeClass("show").addClass("hide");
        window.g.state.cat.speechBubble.hide();
        window.g.state.cat.munch();
        setTimeout(function() {
            window.g.state.cat.mouth.quoteService.makeRequest(symbol, function(JsonResult) {
                //success
                window.g.state.cat.react(JsonResult);
            }, function() {
                //error
                window.g.state.cat.barf();
                console.log("ajax error");
            });
        }, 2000);
    });
};
$(document).ready(function() {
    var sc = new stockcat();
});
