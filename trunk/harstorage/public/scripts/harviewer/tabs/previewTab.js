require.def("tabs/previewTab",["domplate/domplate","domplate/tabView","core/lib","i18n!nls/previewTab","domplate/toolbar","tabs/pageTimeline","tabs/pageStats","preview/pageList","core/cookies","downloadify/js/swfobject","downloadify/src/downloadify"],function(Domplate,TabView,Lib,Strings,Toolbar,Timeline,Stats,PageList,Cookies){with(Domplate){function PreviewTab(a){this.model=a,this.toolbar=new Toolbar,this.timeline=new Timeline,this.stats=new Stats(a,this.timeline),this.toolbar.addButtons(this.getToolbarButtons())}PreviewTab.prototype=Lib.extend(TabView.Tab.prototype,{id:"Preview",label:Strings.previewTabLabel,tabBodyTag:DIV({"class":"tab$tab.id\\Body tabBody",_repObject:"$tab"},DIV({"class":"previewToolbar"}),DIV({"class":"previewTimeline"}),DIV({"class":"previewStats"}),DIV({"class":"previewList"})),errorTable:TABLE({"class":"errorTable",cellpadding:0,cellspacing:5},TBODY(FOR("error","$errors",TR({"class":"errorRow",_repObject:"$error"},TD({"class":"errorProperty"},SPAN("$error.property")),TD("&nbsp;"),TD({"class":"errorMessage"},SPAN("$error.message")))))),onUpdateBody:function(a,b){this.toolbar.render(Lib.$(b,"previewToolbar")),this.stats.render(Lib.$(b,"previewStats")),this.timeline.render(Lib.$(b,"previewTimeline"));var c=this.model.input;c&&Cookies.getCookie("timeline")=="true"&&this.onTimeline(!1),c&&Cookies.getCookie("stats")=="true"&&this.onStats(!1),this.updateDownloadifyButton()},updateDownloadifyButton:function(){var a=this.model;$(".harDownloadButton").downloadify({filename:function(){return"netData.har"},data:function(){return a?a.toJSON():""},onComplete:function(){},onCancel:function(){},onError:function(){alert(Strings.downloadError)},swf:"scripts/downloadify/media/downloadify.swf",downloadImage:"css/images/download-sprites.png",width:16,height:16,transparent:!0,append:!1})},getToolbarButtons:function(){var a=[{id:"showTimeline",label:Strings.showTimelineButton,tooltiptext:Strings.showTimelineTooltip,command:Lib.bindFixed(this.onTimeline,this,!0)},{id:"showStats",label:Strings.showStatsButton,tooltiptext:Strings.showStatsTooltip,command:Lib.bindFixed(this.onStats,this,!0)},{id:"clear",label:Strings.clearButton,tooltiptext:Strings.clearTooltip,command:Lib.bindFixed(this.onClear,this)}];$.browser.mozilla&&a.push({id:"download",tooltiptext:Strings.downloadTooltip,className:"harDownloadButton"});return a},onTimeline:function(a){var b=this.toolbar.getButton("showTimeline");if(b){this.timeline.toggle(a);var c=this.timeline.isVisible();b.label=Strings[c?"hideTimelineButton":"showTimelineButton"],this.toolbar.render(),this.updateDownloadifyButton(),Cookies.setCookie("timeline",c)}},onStats:function(a){var b=this.toolbar.getButton("showStats");if(b){this.stats.toggle(a);var c=this.stats.isVisible();b.label=Strings[c?"hideStatsButton":"showStatsButton"],this.toolbar.render(),this.updateDownloadifyButton(),Cookies.setCookie("stats",c)}},onClear:function(){var a=document.location.href,b=a.indexOf("?");document.location=a.substr(0,b)},showStats:function(a){Cookies.setCookie("stats",a)},showTimeline:function(a){Cookies.setCookie("timeline",a)},append:function(a){var b=new PageList(a);b.append(Lib.$(this._body,"previewList")),this.timeline.append(a),b.addListener(this)},appendError:function(a){a.errors&&this.errorTable.append(a,Lib.$(this._body,"previewList"))},addPageTiming:function(a){PageList.prototype.pageTimings.push(a)},getMenuItems:function(a,b,c,d){d&&(b.push("-"),b.push({label:Strings.menuShowHARSource,command:Lib.bind(this.showHARSource,this,d)}))},showHARSource:function(a,b){var c=this.tabView.getTab("DOM");c&&(c.select("DOM"),c.highlightFile(this.model.input,b))}});return PreviewTab}})