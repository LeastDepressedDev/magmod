async function dynamicTranslate(text) {
  const result = await fetch("http://127.0.0.1:7195", {
      "body": text,
      "method": "POST"
  });

  return (await result.text());
}



class AutoTranslator {

    constructor(x, y, width, height) {
        this.textRenderer = new PIXI.Text("Блок перевода:", {
            fontFamily: "Arial",
            fontSize: 16,
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
        this.textRenderer.text = `Блок перевода:\n${text}`;
    }
};

const InstanceTranslator = new AutoTranslator(0, 0, 600, 120);

Window_Base.prototype.OriginalDrawTextProto = Window_Base.prototype.drawText;
Window_Base.prototype.OriginalDrawTextExProto = Window_Base.prototype.drawTextEx;
Game_Message.prototype.OriginalAllTextProto = Game_Message.prototype.allText;
Scene_Base.prototype.OriginalStart = Scene_Base.prototype.start;

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

Scene_Base.prototype.start = function() {
    this.OriginalStart();
    this.addChild(InstanceTranslator.background);
    this.addChild(InstanceTranslator.textRenderer);
};





    
