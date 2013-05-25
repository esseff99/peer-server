// Generated by CoffeeScript 1.6.2
(function() {
  'Handles outgoing and incoming AJAx Requests. \n\nOnly implements a subset of ajax.\n\nTODO put in support for jsonp cross-domain requests';
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.AjaxClient = (function() {
    function AjaxClient(sendEvent, socketIdFcn) {
      this.sendEvent = sendEvent;
      this.socketIdFcn = socketIdFcn;
      this.receiveAjax = __bind(this.receiveAjax, this);
      this.requestAjax = __bind(this.requestAjax, this);
      this.outstandingRequests = {};
    }

    AjaxClient.prototype.requestAjax = function(path, options, successCallback, errorCallback) {
      var data, requestId;

      console.log("sending ajax request for path: " + path + " on socket id " + this.socketIdFcn());
      requestId = Math.random().toString(36).substr(2, 14);
      if (typeof callback !== "undefined" && typeof callback !== "function") {
        console.error("error: callback is not a function!");
        return;
      }
      this.outstandingRequests[requestId] = {
        "successCallback": successCallback,
        "errorCallback": errorCallback,
        "timestamp": new Date().getTime()
      };
      data = {
        "filename": path,
        "socketId": this.socketIdFcn(),
        "requestId": requestId,
        "options": options,
        "type": "ajax"
      };
      console.log("options: ");
      console.log(options);
      console.log("sending ajax request:");
      console.log(data);
      return this.sendEvent("requestFile", data);
    };

    AjaxClient.prototype.receiveAjax = function(data) {
      var request;

      console.log("Received ajax response:" + data.requestId);
      console.log(data);
      if (!data.requestId) {
        console.error("received AJAX response with no request ID");
        return;
      }
      request = this.outstandingRequests[data.requestId];
      if (!request || typeof request === "undefined") {
        console.error("received ajax response for a nonexistent request id");
        return;
      }
      delete this.outstandingRequests[data.requestId];
      if (!data.errorThrown) {
        return request.successCallback(data.fileContents);
      } else {
        return request.errorCallback({}, data.textStatus, data.errorThrown);
      }
    };

    return AjaxClient;

  })();

}).call(this);
