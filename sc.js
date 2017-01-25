
const fs        = require('fs'),
      dataurl   = require('dataurl'),
      Nightmare = require('nightmare'),
      Prism     = require('prismjs');




const noOp = () => {};



function get_language(fname) {
  return 'javascript';
}



function light({code, fname='foo.md', theme, language, suppressBorder=true, size=3}) {
    if (!language) { language = get_language(fname); }
    const uclass = language? ` class=" language-${language}"`:''
    return `<!doctype html>
<html>
  <head>
${ suppressBorder? '<style type="text/css">html pre[class*="language-"] { padding: 0; margin: 0; border-radius: 0; }</style>' : '' }
    <style type="text/css">
      html, body { margin: 0; padding: 0; border: 0; font-size: ${size}px; }
    </style>
  </head>
  <body>
    <pre${uclass}><code${uclass}>${Prism.highlight(code, Prism.languages.javascript)}</code></pre>
  </body>
</html>`;
}



function themepath(theme) {
  const bases = ['node_modules/prismjs/themes/prism-', 'node_modules/prism-themes/themes/prism-'];
  for (var i=0, iC=bases.length; i<iC; ++i) {
    const file = `${bases[i]}${theme}.css`;
    try { if (fs.accessSync(file) === undefined) { return file; } } catch (e) { }
  }
  return 2;
}



function from_u_item(u_item) {
  if (typeof u_item === 'string') {
    const cd = fs.readFileSync(u_item, 'utf-8');
    return {
      code: cd.trim(),
      name: u_item,
      lang: get_language(u_item)
    };
  } else {
    return u_item;
  }
}



function shot(opts) {
  if (typeof opts === 'string') { return shot({ to_html: [opts] }); }
  if (Array.isArray(opts))      { return shot({ to_html: opts });   }
  return q_shot(opts);
}

// item format is {code:'var i = 1;', name:'foo.js', lang:'javascript'}
function q_shot({ to_html=[], theme='okaidia', disk_path='./output/', fname='output.png', width=1024, height=768, cb = noOp, size }) {

    // make the directory if it doesn't exist
    fs.stat(disk_path, (err, stats) => { if (err) { fs.mkdirSync(disk_path); }});

    to_html.map( (u_item,i) => {

      const nm   = new Nightmare({show: false}),
            item = from_u_item(u_item),
            f    = `${disk_path}${i}.png`;

      // appropriately size the browser
      nm.viewport(width, height);

      // delete the screenshot if it already exists
      fs.stat(f, (err, stats) => { if (!err) { fs.unlinkSync(f); }});

      nm
        .goto( dataurl.format({data:light({code:item.code, suppressBorder: item.suppressBorder, size:size}), mimetype:'text/html'}) )
        .inject( 'css', 'node_modules/prismjs/themes/prism.css' )
        .wait();

      if (theme) { nm.inject('css', themepath(theme)).wait(); }

      nm.evaluate(function () {
        const r = document.querySelector('body>pre>code');
              w = r.offsetWidth,
              h = r.offsetHeight;
        return [ w, h ];
      }).then( res => {
        return nm.viewport(res[0], res[1])
          .wait()
          .screenshot(f, {x:0, y:0, width:res[0], height:res[1]});
      }).then( res => {
        nm
          .end()
          .run( () => cb() );
      });

    });

}





module.exports = { shot };
