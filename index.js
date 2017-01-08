/* eslint-env node */
'use strict';
var path = require('path');
var BasePlugin = require('ember-cli-deploy-plugin');
var fbTools = require('firebase-tools');

module.exports = {
  name: 'ember-cli-deploy-firebase',

  createDeployPlugin: function(options) {
    var DeployPlugin = BasePlugin.extend({
      name: options.name,

      upload: function(context) {
        var outer = this;
        var publicSource;

        try {
          var firebaseConfig = require(this.project.root + path.sep + 'firebase.json');
          publicSource = firebaseConfig.hosting.public;
        } catch (ex) {
          console.warn(ex);
        }

        var options = {
          project: context.config.fireBaseAppName,
          public: publicSource || context.config.build.outputPath,
          message: (context.revisionData || {}).revisionKey
        };
        return fbTools.deploy(options).then(function() {
          // outer.log('it worked yay');
        }).catch(function(err) {
          // handle error
          outer.log('something bad happened oh no', { color: 'red' });
          outer.log(err, { color: 'red' });
        });
      }
    });

    return new DeployPlugin();
  }
};
