// TinyMCE 5 Font Awesome (5) plugin 
// Copyright (c) Jan Borovicka, TINYMCE-FAICONS.COM
// For license information see Licence.txt in root of this project 
// This plugin allow you to insert Font Awesome free icons trought tinymce editor 
// https://www.tinymce-faicons.com
(function () {
  "use strict";
  var faicons = function () {
    
    tinymce.PluginManager.add('faicons', function (editor, url) {
      tinymce.PluginManager.requireLangPack('faicons');
      var fai_jsonPath = url + '/json/faicons.json';
      var fai_selectedIconType;
      var fai_selectedIconName;
      var fai_selectedIconSize = editor.getParam('faicons_default_size', 'fa-3x');
      var fai_selectedIconID = -1;
      var fai_selectedIconColor = '#' + editor.getParam('faicons_default_color', '858796');
      var fai_dialog = false;
      var fai_html = '';
      var fai_htmlSettings = '<i class="fasizing fa-camera fa-xs" data-faicon-size="fa-xs" style="font-family: \'Font Awesome 5 Free\'; font-weight: 900; font-size: .75em; cursor: pointer; margin: 2px;"></i>';
      fai_htmlSettings = fai_htmlSettings + '<i class="fasizing fa-camera fa-sm" data-faicon-size="fa-sm" style="font-family: \'Font Awesome 5 Free\'; font-weight: 900; font-size: .875em; cursor: pointer; margin: 2px;"></i>';
      fai_htmlSettings = fai_htmlSettings + '<i class="fasizing fa-camera fa-lg" data-faicon-size="fa-lg" style="font-family: \'Font Awesome 5 Free\'; font-weight: 900; font-size: 1.33333em; cursor: pointer; margin: 2px;"></i>';
      fai_htmlSettings = fai_htmlSettings + '<i class="fasizing fa-camera fa-2x" data-faicon-size="fa-2x" style="font-family: \'Font Awesome 5 Free\'; font-weight: 900; font-size: 2em; cursor: pointer; margin: 2px;"></i>';
      fai_htmlSettings = fai_htmlSettings + '<i class="fasizing fa-camera fa-3x" data-faicon-size="fa-3x" style="font-family: \'Font Awesome 5 Free\'; font-weight: 900; font-size: 3em; cursor: pointer; margin: 2px;"></i>';
      fai_htmlSettings = fai_htmlSettings + '<i class="fasizing fa-camera fa-5x" data-faicon-size="fa-5x" style="font-family: \'Font Awesome 5 Free\'; font-weight: 900; font-size: 5em; cursor: pointer; margin: 2px;"></i>';
      fai_htmlSettings = fai_htmlSettings + '<i class="fasizing fa-camera fa-7x" data-faicon-size="fa-7x" style="font-family: \'Font Awesome 5 Free\'; font-weight: 900; font-size: 7em; cursor: pointer; margin: 2px;"></i>';
      fai_htmlSettings = fai_htmlSettings + '<i class="fasizing fa-camera fa-10x" data-faicon-size="fa-10x" style="font-family: \'Font Awesome 5 Free\'; font-weight: 900; font-size: 10em; cursor: pointer; margin: 2px;"></i>';
      var fai_dialogApi;
      var faSVGIcon = '<svg width="24" height="24" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="font-awesome-flag" class="svg-inline--fa fa-font-awesome-flag fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M444.373 359.424c0 7.168-6.144 10.24-13.312 13.312-28.672 12.288-59.392 23.552-92.16 23.552-46.08 0-67.584-28.672-122.88-28.672-39.936 0-81.92 14.336-115.712 29.696-2.048 1.024-4.096 1.024-6.144 2.048v77.824c0 21.405-16.122 34.816-33.792 34.816-19.456 0-34.816-15.36-34.816-34.816V102.4C12.245 92.16 3.029 75.776 3.029 57.344 3.029 25.6 28.629 0 60.373 0s57.344 25.6 57.344 57.344c0 18.432-8.192 34.816-22.528 45.056v31.744c4.124-1.374 58.768-28.672 114.688-28.672 65.27 0 97.676 27.648 126.976 27.648 38.912 0 81.92-27.648 92.16-27.648 8.192 0 15.36 6.144 15.36 13.312v240.64z"></path></svg>';
      editor.ui.registry.addIcon('faicons', faSVGIcon);
      
      editor.on('PreInit', function () {
        editor.schema.addValidElements('i[class|contenteditable|style]');
      });

      function fai_getDialogConfig() {
        return {
          title: 'Font Awesome icons',
          size: 'medium',
          body: {
            type: 'tabpanel',
            tabs: [
              {
                name: 'icons',
                title: 'Icon selection',
                items: [
                  {
                    type: 'bar',
                    items: [
                      {
                        type: 'checkbox',
                        name: 'fai_ch_solid',
                        label: 'Solid',
                      },
                      {
                        type: 'checkbox',
                        name: 'fai_ch_regular',
                        label: 'Regular',
                      },
                      {
                        type: 'checkbox',
                        name: 'fai_ch_brand',
                        label: 'Brand',
                      },
                    ]
                  },
                  {
                  type: 'input',
                  name: 'searchinput',                
                  label: 'Search',
                  inputMode: 'text',                
                  },
                  {
                  type: 'htmlpanel',
                  html: fai_html,                
                  }
                ]
              },
              {
                name: 'settings',
                title: 'Settings',
                items: [
                  {
                    type: 'label',
                    label: 'Icon size',
                    items: []
                  },
                  {
                  type: 'htmlpanel',
                  html: fai_htmlSettings,                
                  },
                  {
                    type: 'label',
                    label: 'Icon color',
                    items: [
                      {
                        type: 'colorpicker',
                        name: 'colorpicker',
                      }
                    ]
                  }
                ]
              }
            ]
          },
          buttons: [
            {
              name: 'cancelbutt',
              type: 'cancel',
              text: 'Close'
            },
            {
              name: 'insertbutt',
              type: 'submit',
              text: 'Insert',
              primary: true,
              disabled: true
            }
          ],
          onSubmit: function (api) {
            var dataX = api.getData();
            fai_selectedIconColor = dataX.colorpicker;
            if (fai_selectedIconID != -1) editor.insertContent('<i class="' + fai_selectedIconType + ' ' + fai_selectedIconName + ' ' + fai_selectedIconSize + '" style="color: ' + fai_selectedIconColor + '" contenteditable="false"><!-- icon --></i>');
            fai_selectedIconID = -1;
            api.close();
          },
          onTabChange: function (dialogApi, details) {
            fai_dialogApi = dialogApi;
            if (details.newTabName == 'settings') {
              var dataX = fai_dialogApi.getData();
              fai_dialogApi.setData({colorpicker: fai_selectedIconColor});
              var els = document.querySelectorAll('.fasizing');
              for (var i = 0; i < els.length; i++) {
                var e = els[i];
                e.style.color = fai_selectedIconColor;
              }              
              selectIconSize(fai_selectedIconSize);
              if (fai_selectedIconID != -1) {
                var els = document.querySelectorAll('[aria-label="Hex color code"]');
                for (var i = 0; i < els.length; i++) {
                  var e = els[i];
                  document.getElementById(e.getAttribute('for')).classList.add('fai_pickerColorInput');
                }              
                els = document.querySelectorAll('[aria-label="Red component"]');
                for (var i = 0; i < els.length; i++) {
                  var e = els[i];
                  document.getElementById(e.getAttribute('for')).classList.add('fai_pickerColorInput');
                }              
                els = document.querySelectorAll('[aria-label="Green component"]');
                for (var i = 0; i < els.length; i++) {
                  var e = els[i];
                  document.getElementById(e.getAttribute('for')).classList.add('fai_pickerColorInput');
                }              
                els = document.querySelectorAll('[aria-label="Blue component"]');
                for (var i = 0; i < els.length; i++) {
                  var e = els[i];
                  document.getElementById(e.getAttribute('for')).classList.add('fai_pickerColorInput');
                }              
                els = document.querySelectorAll('.fasizing');
                for (var i = 0; i < els.length; i++) {
                  var e = els[i];
                  e.classList.remove('fa-camera');
                  e.classList.add(fai_selectedIconName);
                }              
                if (fai_selectedIconType == 'fas') {
                  els = document.querySelectorAll('.fasizing');
                  for (var i = 0; i < els.length; i++) {
                    var e = els[i];
                    e.style.fontFamily = "\'Font Awesome 5 Free\'";
                    e.style.fontWeight = '900';
                  }              
                }
                else if (fai_selectedIconType == 'far') {
                  els = document.querySelectorAll('.fasizing');
                  for (var i = 0; i < els.length; i++) {
                    var e = els[i];
                    e.style.fontFamily = "\'Font Awesome 5 Free\'";
                    e.style.fontWeight = '400';
                  }              
                }
                else {
                  els = document.querySelectorAll('.fasizing');
                  for (var i = 0; i < els.length; i++) {
                    var e = els[i];
                    e.style.fontFamily = "\'Font Awesome 5 Brands\'";
                    e.style.fontWeight = '900';
                  }              
                }
              }
            }
          else {
            fai_dialogApi.setData({fai_ch_brand: true, fai_ch_solid: true, fai_ch_regular: true});
          } 
          },
          onCancel: function (api) {
            fai_selectedIconID = -1;
          },
          onChange: function (api, details) {
            if (details.name == 'searchinput' || details.name == 'fai_ch_brand' || details.name == 'fai_ch_solid' || details.name == 'fai_ch_regular') {
              var dataX = api.getData();
              if (!dataX.fai_ch_brand && !dataX.fai_ch_solid && !dataX.fai_ch_regular) {
                if (details.name == 'fai_ch_brand') api.setData({fai_ch_brand: true});
                if (details.name == 'fai_ch_solid') api.setData({fai_ch_solid: true});
                if (details.name == 'fai_ch_regular') api.setData({fai_ch_regular: true});
                return;
              } 
              var els = document.querySelectorAll('.faicon');
              for (var i = 0; i < els.length; i++) {
                var e = els[i];
                if (!dataX.fai_ch_regular && e.getAttribute('data-faicon-type') == 'far'){
                  e.style.display = 'none';
                }
                else if (!dataX.fai_ch_solid && e.getAttribute('data-faicon-type') == 'fas'){
                  e.style.display = 'none';
                }
                else if (!dataX.fai_ch_brand && e.getAttribute('data-faicon-type') == 'fab'){
                  e.style.display = 'none';
                  var testttt = 10;
                }
                else if (e.getAttribute('data-faicon-name').indexOf(dataX.searchinput.toLowerCase()) == -1) {
                  e.style.display = 'none';
                }
                else {
                  e.style.display = 'inline-flex';
                }
              }              
            }
          },
          initialData: {
            'fai_ch_regular' : true,             
            'fai_ch_solid' : true,
            'fai_ch_brand' : true,
          }, 
        };
      }

      function fai_generateHtml(data) {
        fai_html = '<div id="iconsHtmlDiv" style="text-align: center !important;">';
        var els = data.icons;
        for (var i = 0; i < els.length; i++) {
          var item = els[i];
          fai_html = fai_html + '<div id="faicon_' + i + '" data-faicon-id="' + i + '" data-faicon-type="' + item.type + '" data-faicon-name="' + item.name + '" class="faicon" style="margin: .2rem !important; display: inline-flex; flex-direction:column; width:84px; height:70px; cursor: pointer; border: 1px solid #ccc; border-radius: .35rem;" title="' + item.name + '"><span style="margin: .25rem !important; text-align: center !important;">';
          if (item.type == 'fas') {
            fai_html = fai_html + '<i class="fa-' + item.name + '" style="font-family: \'Font Awesome 5 Free\'; font-weight: 900; font-size: 3em;"></i>';
          }
          else if (item.type == 'far') {
            fai_html = fai_html + '<i class="fa-' + item.name + '" style="font-family: \'Font Awesome 5 Free\'; font-weight: 400; font-size: 3em;"></i>';
          } 
          else if (item.type == 'fab') {
            fai_html = fai_html + '<i class="fa-' + item.name + '" style="font-family: \'Font Awesome 5 Brands\'; font-weight: 900; font-size: 3em;"></i>';
          } 
          fai_html = fai_html + '</span></div>';
        }              
        fai_html = fai_html + '</div>';
      }
      
      document.addEventListener("click", function (e) {
          if (e.target.parentElement.classList.contains('faicon')) {
            selectIcon(e.target.parentElement.getAttribute('data-faicon-id'));
          }
          else if (e.target.parentElement.parentElement.classList.contains('faicon')) {
            selectIcon(e.target.parentElement.parentElement.getAttribute('data-faicon-id'));
          } 

          if (e.target.classList.contains('fasizing')) {
            selectIconSize(e.target.getAttribute('data-faicon-size'));
          }

          if (e.target.classList.contains('tox-sv-palette') || e.target.classList.contains('tox-hue-slider')) {
            var dataX = fai_dialogApi.getData();
            var els = document.querySelectorAll('.fasizing');
            for (var i = 0; i < els.length; i++) {
              var e = els[i];
              e.style.color = dataX.colorpicker;
            }              
          }
      });
            
      document.addEventListener("change", function (e) {
        if (e.target.classList.contains('fai_pickerColorInput')) {
          var dataX = fai_dialogApi.getData();
          var els = document.querySelectorAll('.fasizing');
          for (var i = 0; i < els.length; i++) {
            var e = els[i];
            e.style.color = dataX.colorpicker;
          }              
        }
      });      

      function selectIcon(icon) {
        var els = document.querySelectorAll('.faicon');
        for (var i = 0; i < els.length; i++) {
          var e = els[i];
          e.classList.remove('selectedIcon');
        }              
        document.getElementById('faicon_' + icon).classList.add('selectedIcon');
        fai_selectedIconType = document.getElementById('faicon_' + icon).getAttribute("data-faicon-type");
        fai_selectedIconName = 'fa-' + document.getElementById('faicon_' + icon).getAttribute("data-faicon-name");
        fai_selectedIconID = document.getElementById('faicon_' + icon).getAttribute("data-faicon-id");
        fai_dialogApi.enable('insertbutt');
        fai_dialogApi.showTab('settings');
      }
      
      function selectIconSize(size) {
        fai_selectedIconSize = size;             
        var els = document.querySelectorAll('.fasizing');
        for (var i = 0; i < els.length; i++) {
          var e = els[i];
          e.style.border = '2px solid #ffffff';
          e.style.border = '2px solid #ffffff00';
        }              
        els = document.querySelectorAll('.fasizing.'+size);
        for (var i = 0; i < els.length; i++) {
          var e = els[i];
          e.style.border = '2px solid #207ab7';
        }              
      }
      
      var fai_getJSON = function(url, callback) {
        var xhr = new XMLHttpRequest();
        //xhr.open('GET', url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime(), true);
        xhr.open('GET', url, true);
        //xhr.responseType = 'json'; //not supported in IE
        xhr.onload = function() {
          //callback(xhr.response);
          callback(JSON.parse(xhr.responseText));
        };
        xhr.send();
      };
      
      function fai_onAction() {
        fai_dialog = editor.windowManager.open(fai_getDialogConfig());
        fai_dialog.block('Loading...');
        fai_getJSON(fai_jsonPath, function(data) {
          fai_generateHtml(data);
          fai_dialog.redial(fai_getDialogConfig());
          fai_dialog.unblock();
        });
      }
      
      editor.ui.registry.addButton('faicons', {
        icon: 'faicons', 
        tooltip: 'Font Awesome icons',
        onAction: fai_onAction
      });
      
      editor.ui.registry.addMenuItem('faicons', {
        text: 'Font Awesome icons',
        icon: 'faicons', 
        context: 'insert',
        onAction: fai_onAction
      });

      return {
        getMetadata: function () {
          return {
            name: "Font Awesome icons",
            url: "https://www.tinymce-faicons.com"
          };
        }
      };      

    });
  }();
})();
