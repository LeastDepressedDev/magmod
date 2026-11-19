async function translateEnToRu(text) {
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ru&dt=t&q=${text}`);
    console.log(response);
    if (!response.ok) {
      throw new Error(`Request failed, status code: ${response.status}`);
    }

    const data = await response.json();

    // The unofficial interface returns a nested array, where the translated text is located at data[0][0][0]
    if (Array.isArray(data) && data[0] && Array.isArray(data[0][0])) {
        console.log(data);
      return data[0].map(item => item[0]).join('');
    } else {
      throw new Error('Failed to parse response format');
    }
}

async function trans(text) {
  const result = await fetch("https://duckduckgo.com/translation.js?vqd=4-216018031417291374384266240303774919029&query=google%20translator&to=ru&jsa=eyJ2IjoxLCJoIjozNDYyOH0%3D&jsa_hash=eyJoIjoiOGY3NTQ1ZGU3MTM2YmNkYWUzM2ZiOWFiNzJlM2E2OTEiLCJ2IjoxfQ%3D%3D&dp=34mNbpUabRFTRh6-ruFajDm5PulbsjnDDUcSEi2DAEzYUswK1Dqp8UFZ2Sfsb0lK62Vm46iW17FQi6R1TMZuN0MPQvBWuX0nLgzDjxSKB-NOPJA8zEDC4hYfrgeBeukUoUK3jqYUqZOnN8yhPb_BbCqqoSIMUSwnYDEXUsvzJipQ2K60uqdJ8WLuSpX-zzQu_JQdYh7sD5rIbb2yZmcJXA.Ri_OIV8_Ep2xNMYakDZ7OA", {
      "body": text,
      "method": "POST"
  });

  return (await result.json())["translated"];
}

const http = require('http');

const server = http.createServer(async (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const blockRegex = /(\<.+\>)/g;

    let body = "";
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      if (body.length > 1) {
        body = body
          .replaceAll("\\|", "")
          .replaceAll("\\^", "")
          .replaceAll("|", "")
          .replaceAll("^", "")
          .replaceAll("\\", "")
          .replaceAll("\n", "");
        let trst = await trans(body);
        console.log(`${body} -> ${trst}`);

        res.end(trst);
      } else {
        res.end(body);
      }
    }); 
  } catch (e) {
    console.log(e);
    res.end("Failed to translate!");
  }
});

const PORT = 7195;
server.listen(PORT, () => console.log(`127.0.0.1:${PORT}`));
