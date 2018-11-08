module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
      rsyncDrive: "/c",
      workspace: '/shipitworkspace/karkio/',
      deployTo: '/tinygame/karkio',
      repositoryUrl: 'https://gamestill@bitbucket.org/gameteam_multiplayer/karkio.git',
      ignores: ['.git', 'node_modules'],
      keepReleases: 2,
      deleteOnRollback: false,
       key : "C:/keys/windows/karkio/karkio_main_nginx/public_key",
      shallowClone: true
    },
    staging: {
      servers: '50.116.27.93'
    },
     production: {
      servers: '50.116.27.93'
    }
  });
};

    