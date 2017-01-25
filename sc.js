
const fs        = require('fs'),
      dataurl   = require('dataurl'),
      Nightmare = require('nightmare'),
      Prism     = require('prismjs');

const nm        = new Nightmare({show: false});





const noOp = () => {};



function get_language(fname) {
  return 'javascript';
}



function light({code, fname='foo.md', theme, language, suppressBorder=true}) {
    if (!language) { language = get_language(fname); }
    const uclass = language? ` class=" language-${language}"`:''
    return `<!doctype html>
<html>
  <head>
${ suppressBorder? '<style type="text/css">html pre[class*="language-"] { padding: 0; margin: 0; border-radius: 0; }</style>' : '' }
    <style type="text/css">
      html, body { margin: 0; padding: 0; border: 0; font-size: 4px; }
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



// item format is {code:'var i = 1;', name:'foo.js', lang:'javascript'}
function shot({ to_html=[], theme='okaidia', disk_path='./output/', fname='output.png', width=1024, height=768, cb = noOp }) {

    // make the directory if it doesn't exist
    fs.stat(disk_path, (err, stats) => { if (err) { fs.mkdirSync(disk_path); }});

    // appropriately size the browser
    nm.viewport(width, height);


    to_html.map( (item,i) => {

      const f = `${disk_path}${i}.png`;

      // delete the screenshot if it already exists
      fs.stat(f, (err, stats) => { if (!err) { fs.unlinkSync(f); }});

      nm
        .goto( dataurl.format({data:light({code:item.code, suppressBorder: item.suppressBorder}), mimetype:'text/html'}) )
        .inject( 'css', 'node_modules/prismjs/themes/prism.css' );

      if (theme) { nm.inject('css', themepath(theme)); }

      nm
        .wait()
        .screenshot(f);

    });

    return nm.end()
        .run( () => cb(), 1 );

}





module.exports = { shot };
