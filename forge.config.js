const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require('node:path');

module.exports = {
  packagerConfig: {
    asar: true,
    name: "electron_app",
    executableName: 'electron_app',
    icon: './icons/icon',
    appBundleId: 'com.electron_app',
    // 核心配置：强制包含所有 YAML 文件
    extraResource: [
      './app-update.yml' // 直接使用相对路径
    ],
    // 关键：生成完整的更新元数据
    generateUpdatesFilesForAllChannels: true,
    protocols: [
      {
        name: 'electron_app',
        schemes: ['electron_app']
      }
    ]
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        icon: './icons/icon.ico',
        setupIcon: './icons/icon.ico'
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'Lambert520',
          name: 'electron-application'
        },
        prerelease: false,   // 非预发布
        draft: false,        // 非草稿
        releaseType: 'release', // 明确指定发布类型
        generateReleaseNotes: true, // 自动生成发布说明
        forceRuntimeDependencies: true, // 强制上传元数据文件
      }
    }
  ]
};
