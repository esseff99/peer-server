// Generated by CoffeeScript 1.6.2
(function() {
  'Display and organization of the user-uploaded file collection.\nEdit/Done modes for saving.\n\nTODO handle bug of initial non-index, non-404 html files saved in localstorage returining a 404\n  due to there being no initial production version of them formed.';
  var _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.ClientServerCollectionView = (function(_super) {
    __extends(ClientServerCollectionView, _super);

    function ClientServerCollectionView() {
      this.selectRoute = __bind(this.selectRoute, this);
      this.selectServerFile = __bind(this.selectServerFile, this);
      this.select = __bind(this.select, this);
      this.appendServerFileToFileList = __bind(this.appendServerFileToFileList, this);
      this.editableFileName = __bind(this.editableFileName, this);
      this.eventKeypressWhileRenaming = __bind(this.eventKeypressWhileRenaming, this);
      this.eventDoneNamingFile = __bind(this.eventDoneNamingFile, this);
      this.eventCreateDynamic = __bind(this.eventCreateDynamic, this);
      this.createFile = __bind(this.createFile, this);
      this.eventCreateCSS = __bind(this.eventCreateCSS, this);
      this.eventCreateJS = __bind(this.eventCreateJS, this);
      this.eventCreateHTML = __bind(this.eventCreateHTML, this);
      this.handleFileDeleted = __bind(this.handleFileDeleted, this);
      this.handleRouteNameChange = __bind(this.handleRouteNameChange, this);
      this.handleFileChanged = __bind(this.handleFileChanged, this);
      this.handleFile = __bind(this.handleFile, this);
      this.eventDropFiles = __bind(this.eventDropFiles, this);
      this.eventUploadFiles = __bind(this.eventUploadFiles, this);
      this.preventDefault = __bind(this.preventDefault, this);
      this.eventSaveChanges = __bind(this.eventSaveChanges, this);
      this.eventKeyDown = __bind(this.eventKeyDown, this);
      this.eventDeleteFileConfirmed = __bind(this.eventDeleteFileConfirmed, this);
      this.eventDeleteFile = __bind(this.eventDeleteFile, this);
      this.eventRenameFile = __bind(this.eventRenameFile, this);
      this.eventSelectFile = __bind(this.eventSelectFile, this);
      this.addOneRoute = __bind(this.addOneRoute, this);
      this.addOneServerFile = __bind(this.addOneServerFile, this);
      this.addAll = __bind(this.addAll, this);
      this.showInitialSaveNotification = __bind(this.showInitialSaveNotification, this);
      this.render = __bind(this.render, this);      _ref = ClientServerCollectionView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ClientServerCollectionView.prototype.el = "#client-server-collection-view";

    ClientServerCollectionView.prototype.initialize = function(options) {
      this.serverFileCollection = options.serverFileCollection;
      this.routeCollection = options.routeCollection;
      this.activeView = null;
      this.fileViewContainer = this.$("#file-view-container");
      this.routeViewContainer = this.$("#route-view-container");
      this.uploadFilesRegion = this.$(".file-drop");
      this.saveNotification = $("#save-notification").miniNotification({
        show: false
      });
      this.fileLists = this.$(".file-list");
      this.requiredFileList = this.$(".file-list.required");
      this.htmlFileList = this.$(".file-list.html");
      this.cssFileList = this.$(".file-list.css");
      this.jsFileList = this.$(".file-list.js");
      this.imageFileList = this.$(".file-list.img");
      this.dynamicFileList = this.$(".file-list.dynamic");
      this.tmplServerFileListItem = Handlebars.compile($("#file-list-item-template").html());
      this.tmplRouteListItem = Handlebars.compile($("#route-list-item-template").html());
      this.tmplFileDeleteConfirmation = Handlebars.compile($("#file-delete-confirmation-template").html());
      this.tmplEditableFileListItem = Handlebars.compile($("#editable-file-list-item-template").html());
      this.addAll();
      this.serverFileCollection.bind("add", this.addOneServerFile);
      this.serverFileCollection.bind("reset", this.addAll);
      this.serverFileCollection.bind("change:contents", this.handleFileChanged);
      this.serverFileCollection.bind("destroy", this.handleFileDeleted);
      this.routeCollection.bind("add", this.addOneRoute);
      this.routeCollection.bind("reset", this.addAll);
      this.routeCollection.bind("change:routePath", this.handleFileChanged);
      this.routeCollection.bind("change:routeCode", this.handleFileChanged);
      this.routeCollection.bind("change:name", this.handleFileChanged);
      this.routeCollection.bind("change:name", this.handleRouteNameChange);
      this.routeCollection.bind("destroy", this.handleFileDeleted);
      $(window).keydown(this.eventKeyDown);
      $(window).resize(this.render);
      this.render();
      return this.showInitialSaveNotification();
    };

    ClientServerCollectionView.prototype.events = {
      "dragover .file-drop": "preventDefault",
      "drop .file-drop": "eventDropFiles",
      "click .file-list li[data-cid] input": "preventDefault",
      "blur .file-list li[data-cid] input": "eventDoneNamingFile",
      "keypress .file-list li[data-cid] input": "eventKeypressWhileRenaming",
      "click .file-list li[data-cid]": "eventSelectFile",
      "click .file-list li[data-cid] .dropdown-menu .rename": "eventRenameFile",
      "click .file-list li[data-cid] .dropdown-menu .delete": "eventDeleteFile",
      "click .file-delete-confirmation .deletion-confirmed": "eventDeleteFileConfirmed",
      "click .upload-files": "eventUploadFiles",
      "click .save-changes": "eventSaveChanges",
      "click .create-menu .html": "eventCreateHTML",
      "click .create-menu .js": "eventCreateJS",
      "click .create-menu .css": "eventCreateCSS",
      "click .create-menu .dynamic": "eventCreateDynamic"
    };

    ClientServerCollectionView.prototype.render = function() {
      this.mainPane = this.$(".main-pane");
      this.$(".left-sidebar-container").outerHeight($(window).height());
      this.$(".left-sidebar").outerHeight($(window).height());
      this.mainPane.height($(window).height() - this.mainPane.position().top);
      return this.mainPane.width($(window).width() - this.mainPane.position().left);
    };

    ClientServerCollectionView.prototype.showInitialSaveNotification = function() {
      var shouldShow;

      shouldShow = false;
      this.serverFileCollection.forEachDevelopmentFile(function(devFile) {
        if (devFile.get("hasBeenEdited")) {
          return shouldShow = true;
        }
      });
      if (shouldShow) {
        return this.saveNotification.show();
      }
    };

    ClientServerCollectionView.prototype.addAll = function() {
      this.serverFileCollection.each(this.addOneServerFile);
      return this.routeCollection.each(this.addOneRoute);
    };

    ClientServerCollectionView.prototype.addOneServerFile = function(serverFile) {
      var listEl;

      if (serverFile.get("isProductionVersion")) {
        return;
      }
      listEl = this.tmplServerFileListItem({
        cid: serverFile.cid,
        name: serverFile.get("name"),
        isRequired: serverFile.get("isRequired")
      });
      return this.appendServerFileToFileList(serverFile, listEl);
    };

    ClientServerCollectionView.prototype.addOneRoute = function(route) {
      var listEl;

      if (route.get("isProductionVersion")) {
        return;
      }
      listEl = this.tmplRouteListItem({
        cid: route.cid,
        name: route.get("name")
      });
      return this.dynamicFileList.append(listEl);
    };

    ClientServerCollectionView.prototype.eventSelectFile = function(event) {
      var cid, route, serverFile, target;

      target = $(event.currentTarget);
      cid = target.attr("data-cid");
      serverFile = this.serverFileCollection.get(cid);
      route = this.routeCollection.get(cid);
      if (serverFile) {
        if (this.activeView && this.activeView.model === serverFile) {
          target.find(".dropdown-menu").removeAttr("style");
          target.addClass("open");
        } else {
          this.fileLists.find(".dropdown-menu").hide();
          this.fileLists.find(".caret").hide();
          this.uploadFilesRegion.hide();
          this.routeViewContainer.hide();
          this.fileViewContainer.show();
          this.selectServerFile(serverFile, target);
        }
      } else if (route) {
        this.uploadFilesRegion.hide();
        this.fileViewContainer.hide();
        this.routeViewContainer.show();
        this.selectRoute(route, target);
      }
      return false;
    };

    ClientServerCollectionView.prototype.eventRenameFile = function(event) {
      var serverFile, target;

      target = $(event.currentTarget).parents("li[data-cid]");
      serverFile = this.serverFileCollection.get(target.attr("data-cid"));
      return this.editableFileName(serverFile, target);
    };

    ClientServerCollectionView.prototype.eventDeleteFile = function(event) {
      var modal, serverFile, target;

      target = $(event.currentTarget).parents("li[data-cid]");
      serverFile = this.serverFileCollection.get(target.attr("data-cid"));
      modal = this.tmplFileDeleteConfirmation({
        cid: serverFile.cid,
        name: serverFile.get("name")
      });
      modal = $($.parseHTML(modal));
      modal.appendTo(this.el);
      modal.modal({
        backdrop: true,
        show: true
      });
      return modal.on("hide", function() {
        modal.data("modal", null);
        modal.remove();
        return $(".modal-backdrop").remove();
      });
    };

    ClientServerCollectionView.prototype.eventDeleteFileConfirmed = function(event) {
      var serverFile, target;

      target = $(event.currentTarget).parents(".file-delete-confirmation[data-cid]");
      target.modal("hide");
      serverFile = this.serverFileCollection.get(target.attr("data-cid"));
      serverFile.destroy();
      if (this.activeView) {
        this.activeView.remove();
      }
      return this.activeView = null;
    };

    ClientServerCollectionView.prototype.eventKeyDown = function(event) {
      if (event.which === 83 && (event.ctrlKey || event.metaKey)) {
        this.eventSaveChanges();
        return false;
      }
    };

    ClientServerCollectionView.prototype.eventSaveChanges = function() {
      console.log("changes saved");
      this.serverFileCollection.forEachDevelopmentFile(function(devFile) {
        return devFile.save({
          hasBeenEdited: false
        });
      });
      this.saveNotification.hide();
      this.serverFileCollection.createProductionVersion();
      return this.routeCollection.createProductionVersion();
    };

    ClientServerCollectionView.prototype.preventDefault = function(event) {
      event.preventDefault();
      return false;
    };

    ClientServerCollectionView.prototype.eventUploadFiles = function() {
      if (this.activeView) {
        this.activeView.remove();
      }
      this.activeView = null;
      this.fileLists.find(".dropdown-menu").hide();
      this.fileLists.find(".caret").hide();
      this.$(".file-list li").removeClass("active");
      this.fileViewContainer.hide();
      return this.uploadFilesRegion.show();
    };

    ClientServerCollectionView.prototype.eventDropFiles = function(event) {
      var droppedFiles, file, _i, _len;

      event.preventDefault();
      droppedFiles = event.originalEvent.dataTransfer.files;
      for (_i = 0, _len = droppedFiles.length; _i < _len; _i++) {
        file = droppedFiles[_i];
        this.handleFile(file);
      }
      return false;
    };

    ClientServerCollectionView.prototype.handleFile = function(file) {
      var fileType, reader,
        _this = this;

      reader = new FileReader();
      fileType = ServerFile.rawTypeToFileType(file.type);
      if (fileType === ServerFile.fileTypeEnum.IMG) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
      return reader.onload = function(evt) {
        var contents, serverFile;

        contents = evt.target.result;
        serverFile = new ServerFile({
          name: file.name,
          size: file.size,
          type: file.type,
          contents: contents
        });
        _this.serverFileCollection.add(serverFile);
        return serverFile.save();
      };
    };

    ClientServerCollectionView.prototype.handleFileChanged = function(model) {
      model.save({
        hasBeenEdited: true
      });
      return this.saveNotification.show();
    };

    ClientServerCollectionView.prototype.handleRouteNameChange = function(route) {
      return this.$("li[data-cid=" + route.cid + "] a").text(route.get("name"));
    };

    ClientServerCollectionView.prototype.handleFileDeleted = function(model) {
      return this.$("[data-cid=" + model.cid + "]").remove();
    };

    ClientServerCollectionView.prototype.eventCreateHTML = function() {
      var serverFile;

      serverFile = new ServerFile({
        type: "text/html"
      });
      return this.createFile(serverFile);
    };

    ClientServerCollectionView.prototype.eventCreateJS = function() {
      var serverFile;

      serverFile = new ServerFile({
        type: "application/x-javascript"
      });
      return this.createFile(serverFile);
    };

    ClientServerCollectionView.prototype.eventCreateCSS = function() {
      var serverFile;

      serverFile = new ServerFile({
        type: "text/css"
      });
      return this.createFile(serverFile);
    };

    ClientServerCollectionView.prototype.createFile = function(serverFile) {
      this.serverFileCollection.add(serverFile, {
        silent: true
      });
      return this.editableFileName(serverFile, null);
    };

    ClientServerCollectionView.prototype.eventCreateDynamic = function() {
      return this.routeCollection.add(new Route());
    };

    ClientServerCollectionView.prototype.eventDoneNamingFile = function(event) {
      var listEl, newListEl, serverFile, target;

      target = $(event.currentTarget);
      listEl = target.parents("li[data-cid]");
      serverFile = this.serverFileCollection.get(listEl.attr("data-cid"));
      serverFile.save({
        name: target.val()
      });
      newListEl = this.tmplServerFileListItem({
        cid: serverFile.cid,
        name: serverFile.get("name"),
        isRequired: serverFile.get("isRequired")
      });
      newListEl = $($.parseHTML(newListEl));
      listEl.replaceWith(newListEl);
      return this.selectServerFile(serverFile, newListEl);
    };

    ClientServerCollectionView.prototype.eventKeypressWhileRenaming = function(event) {
      if (event.keyCode === 13) {
        return this.eventDoneNamingFile(event);
      }
    };

    ClientServerCollectionView.prototype.editableFileName = function(serverFile, listElToReplace) {
      var listEl;

      listEl = this.tmplEditableFileListItem({
        cid: serverFile.cid,
        name: serverFile.get("name")
      });
      if (listElToReplace) {
        listEl = $($.parseHTML(listEl));
        listElToReplace.replaceWith(listEl);
      } else {
        listEl = this.appendServerFileToFileList(serverFile, listEl);
      }
      return listEl.find("input").focus();
    };

    ClientServerCollectionView.prototype.appendServerFileToFileList = function(serverFile, listEl) {
      var section;

      section = null;
      if (serverFile.get("isRequired")) {
        section = this.requiredFileList;
      } else {
        switch (serverFile.get("fileType")) {
          case ServerFile.fileTypeEnum.HTML:
            section = this.htmlFileList;
            break;
          case ServerFile.fileTypeEnum.CSS:
            section = this.cssFileList;
            break;
          case ServerFile.fileTypeEnum.JS:
            section = this.jsFileList;
            break;
          case ServerFile.fileTypeEnum.IMG:
            section = this.imageFileList;
            break;
          default:
            console.error("Error: Could not find proper place for file. " + serverFile.get("name"));
        }
      }
      if (section) {
        return section.append(listEl);
      }
      return null;
    };

    ClientServerCollectionView.prototype.select = function(listEl, view) {
      this.$(".file-list li").removeClass("active");
      listEl.addClass("active");
      listEl.find(".caret").show();
      if (this.activeView) {
        this.activeView.remove();
      }
      return this.activeView = view;
    };

    ClientServerCollectionView.prototype.selectServerFile = function(serverFile, listEl) {
      var serverFileView;

      serverFileView = new ServerFileView({
        model: serverFile
      });
      this.select(listEl, serverFileView);
      return this.fileViewContainer.append(serverFileView.render().el);
    };

    ClientServerCollectionView.prototype.selectRoute = function(route, listEl) {
      var routeView;

      routeView = new RouteView({
        model: route
      });
      this.select(listEl, routeView);
      return this.routeViewContainer.append(routeView.render().el);
    };

    return ClientServerCollectionView;

  })(Backbone.View);

}).call(this);
