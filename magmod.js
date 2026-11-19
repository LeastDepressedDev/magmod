/*
* Paste this in www/js to use.
* Paste <script src="js/magmod.js"></script> on top of the main
*/

const MagmodGlobalConfig = {
    "AutoTranslator": {
        "enabled": true,
        "font-size": 16,
        "toggle-key": "k"
    }
}


async function dynamicTranslate(text) {

    const percentReg = /[0-9]*\%/;
    const numericReg = /([0-9]+)|(-[0-9]+)/;
    if (percentReg.exec(text) || numericReg.exec(text)) return text;

    const result = await fetch("http://127.0.0.1:7195", {
        "body": text,
        "method": "POST"
    });

    return (await result.text());
}

function getScenePart(component) {
    return SceneManager._scene.children.find((part) => (part == component));
}

class AutoTranslator {
    constructor(x, y, width, height) {
        this.tb = "Translation block(Starter):"
        dynamicTranslate("Translation block").then((res) => this.tb = `${res}:\n`);
        this.textRenderer = new PIXI.Text(this.tb, {
            fontFamily: "Arial",
            fontSize: MagmodGlobalConfig.AutoTranslator["font-size"],
            fill: "#ffffff",
            
        });
        this.textRenderer.x = x;
        this.textRenderer.y = y;

        this.background = new PIXI.Graphics();
        this.background.beginFill(0x000000, 0.5);
        this.background.drawRect(0, 0, width, height);
        this.background.endFill();
        this.background.x = x;
        this.background.y = y;        
    }

    update(text) {
        this.textRenderer.text = this.tb+text;
    }

    toggleVisibility() {
        let itr = getScenePart(this.textRenderer);
        itr.visible = !itr.visible;
        let ibg = getScenePart(this.background);
        ibg.visible = !ibg.visible;
    }
};

const InstanceTranslator = MagmodGlobalConfig.AutoTranslator.enabled ? new AutoTranslator(0, 0, 600, 120) : null;

addEventListener("keydown", function(event) {
    if (event.key == MagmodGlobalConfig.AutoTranslator["toggle-key"]) {
        InstanceTranslator.toggleVisibility();
    }
});

if (MagmodGlobalConfig.AutoTranslator.enabled) {
    Window_Base.prototype.OriginalDrawTextProto = Window_Base.prototype.drawText;
    Window_Base.prototype.OriginalDrawTextExProto = Window_Base.prototype.drawTextEx;
    Game_Message.prototype.OriginalAllTextProto = Game_Message.prototype.allText;

    Window_Base.prototype.drawText = async function(text, x, y, maxWidth, align) { 
        text = await dynamicTranslate(text);
        this.OriginalDrawTextProto(text, x, y, maxWidth, align);
    };

    Window_Base.prototype.drawTextEx = async function(text, x, y) {
        text = await dynamicTranslate(text);
        this.OriginalDrawTextExProto(text, x, y);
    };

    Game_Message.prototype.allText = function() {
        const res = this.OriginalAllTextProto();
        dynamicTranslate(res).then((text) => InstanceTranslator.update(text));
        return res;
    };
}


Scene_Base.prototype.OriginalStart = Scene_Base.prototype.start;
Scene_Base.prototype.start = function() {
    this.OriginalStart();
    if (MagmodGlobalConfig.AutoTranslator.enabled) {
        this.addChild(InstanceTranslator.background);
        this.addChild(InstanceTranslator.textRenderer);
    }
};





    
