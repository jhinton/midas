// Base Controller Class
// The $this reference in this base class is always
// the controller being extended off of it at any given time.
//
//
// PROBLEM: This class is highly dependent on controllers
// whose purpose is to do nothing but boot up other controllers.
// It doesn't yet work with controllers booting up views and passing in
// live data.
//
// SOLUTION: That is a paramater passed in on the delegate method,
// and then it is just referenced in the new instantiation of the object function
// like below ( Reference: new child({ ... }) )
define([
	'jquery',
	'underscore',
	'backbone'
], function ($, _, Backbone) {

	Application.Controller.BaseController = Backbone.View.extend({

    // This holds a pointer from the child that is active to the parent (this).
    // __childReferences: {
    //  cid: viewInstance, <= This is the instance itself (full obj.)
    //  cid: viewInstance
    // }
    __childReferences: {},

    initialize: function () {
      // Abstract init.
    },

    delegate: function (children) {
      this.children = children;

      // Init
      this.bootupChildren();
    },

    bootupChildren: function () {
      var self = this;

      if (!_.isEmpty(this.__childReferences)) {
        for (var i in this.__childReferences) {
          if (this.__childReferences[i] !== 'undefined') {
            this.__childReferences[i].cleanup();
            delete this.__childReferences[i];
          } else {
            self.initializeChildControllers();
          }
        }
      } else {
        self.initializeChildControllers();
      }
    },

    initializeChildControllers: function () {
      var self = this;

      _.each(this.children, function (child) {
        // Hold a two way reference to the parent and child.
        // First we store parentCid on the child, then we push the child into the parent's reference
        // of child classes for use later.
        var child = new child({ projectId: self.model.id, parentCid: self.cid });
        self.__childReferences[child.cid] = child;
        console.log(child);
      });

      console.log(self.__childReferences);

    },

	});

	return Application.Controller.BaseController;

});