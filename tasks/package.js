var bozon = require('../lib/bozon');

bozon.task('package', function() {
  var platforms = bozon.settings().packaging.platforms;
  for (i = 0; i < platforms.length; i++) {
    var os = platforms[i].split('-')[0];
    var arch = platforms[i].split('-')[1];
    bozon.runGulp(['compile', "--env=" + bozon.packagingEnv(), "--platform=" + os])
    bozon.spawnSync(bozon.packagerPath(), bozon.productionPackagingOptions(os, arch))
  }
});

bozon.task('package:test', ['build:test'], function() {
  bozon.spawnSync(bozon.packagerPath(), bozon.testPackagingOptions())
});
