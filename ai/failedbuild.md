Running 'gradlew :app:bundleRelease' in /home/expo/workingdir/build/android
Welcome to Gradle 8.10.2!
Here are the highlights of this release:

- Support for Java 23
- Faster configuration cache
- Better configuration cache reports
  For more details see https://docs.gradle.org/8.10.2/release-notes.html
  To honour the JVM settings for this build a single-use Daemon process will be forked. For more on this, please refer to https://docs.gradle.org/8.10.2/userguide/gradle_daemon.html#sec:disabling_the_daemon in the Gradle documentation.
  Daemon will be stopped at the end of the build
  > Task :gradle-plugin:settings-plugin:checkKotlinGradlePluginConfigurationErrors
  > Task :gradle-plugin:shared:checkKotlinGradlePluginConfigurationErrors
  > Task :gradle-plugin:settings-plugin:pluginDescriptors
  > Task :gradle-plugin:settings-plugin:processResources
  > Task :gradle-plugin:shared:processResources NO-SOURCE
  > Task :gradle-plugin:shared:compileKotlin
  > Task :gradle-plugin:shared:compileJava NO-SOURCE
  > Task :gradle-plugin:shared:classes UP-TO-DATE
  > Task :gradle-plugin:shared:jar
  > Task :gradle-plugin:settings-plugin:compileKotlin
  > Task :gradle-plugin:settings-plugin:compileJava NO-SOURCE
  > Task :gradle-plugin:settings-plugin:classes
  > Task :gradle-plugin:settings-plugin:jar
  > Task :gradle-plugin:react-native-gradle-plugin:checkKotlinGradlePluginConfigurationErrors
  > Task :expo-dev-launcher-gradle-plugin:checkKotlinGradlePluginConfigurationErrors
  > Task :expo-dev-launcher-gradle-plugin:pluginDescriptors
  > Task :expo-dev-launcher-gradle-plugin:processResources
  > Task :gradle-plugin:react-native-gradle-plugin:pluginDescriptors
  > Task :gradle-plugin:react-native-gradle-plugin:processResources
  > Task :gradle-plugin:react-native-gradle-plugin:compileKotlin
  > Task :gradle-plugin:react-native-gradle-plugin:compileJava NO-SOURCE
  > Task :gradle-plugin:react-native-gradle-plugin:classes
  > Task :gradle-plugin:react-native-gradle-plugin:jar
  > Task :expo-dev-launcher-gradle-plugin:compileKotlin
  > Task :expo-dev-launcher-gradle-plugin:compileJava NO-SOURCE
  > Task :expo-dev-launcher-gradle-plugin:classes
  > Task :expo-dev-launcher-gradle-plugin:jar
  > Configure project :app
  > ℹ️ [33mApplying gradle plugin[0m '[32mexpo-dev-launcher-gradle-plugin[0m' (expo-dev-launcher@5.0.29)
  > Configure project :expo
  > Using expo modules
- [32mexpo-application[0m (6.0.2)
- [32mexpo-asset[0m (11.0.3)
- [32mexpo-clipboard[0m (7.0.1)
- [32mexpo-constants[0m (17.0.8)
- [32mexpo-dev-client[0m (5.0.12)
- [32mexpo-dev-launcher[0m (5.0.29)
- [32mexpo-dev-menu[0m (6.0.19)
- [32mexpo-file-system[0m (18.0.10)
- [32mexpo-font[0m (13.0.3)
- [32mexpo-json-utils[0m (0.14.0)
- [32mexpo-keep-awake[0m (14.0.2)
- [32mexpo-linear-gradient[0m (14.0.2)
- [32mexpo-manifests[0m (0.15.5)
- [32mexpo-modules-core[0m (2.2.2)
- [32mexpo-notifications[0m (0.29.14)
  > Configure project :react-native-firebase_app
  > :react-native-firebase_app package.json found at /home/expo/workingdir/build/node_modules/@react-native-firebase/app/package.json
  > :react-native-firebase_app:firebase.bom using default value: 33.9.0
  > :react-native-firebase_app:play.play-services-auth using default value: 21.3.0
  > :react-native-firebase_app package.json found at /home/expo/workingdir/build/node_modules/@react-native-firebase/app/package.json
  > :react-native-firebase_app:version set from package.json: 21.12.0 (21,12,0 - 21012000)
  > :react-native-firebase_app:android.compileSdk using custom value: 35
  > :react-native-firebase_app:android.targetSdk using custom value: 34
  > :react-native-firebase_app:android.minSdk using custom value: 24
  > :react-native-firebase_app:reactNativeAndroidDir /home/expo/workingdir/build/node_modules/react-native/android
  > Configure project :react-native-firebase_messaging
  > :react-native-firebase_messaging package.json found at /home/expo/workingdir/build/node_modules/@react-native-firebase/messaging/package.json
  > :react-native-firebase_app package.json found at /home/expo/workingdir/build/node_modules/@react-native-firebase/app/package.json
  > :react-native-firebase_messaging:firebase.bom using default value: 33.9.0
  > :react-native-firebase_messaging package.json found at /home/expo/workingdir/build/node_modules/@react-native-firebase/messaging/package.json
  > :react-native-firebase_messaging:version set from package.json: 21.12.0 (21,12,0 - 21012000)
  > :react-native-firebase_messaging:android.compileSdk using custom value: 35
  > :react-native-firebase_messaging:android.targetSdk using custom value: 34
  > :react-native-firebase_messaging:android.minSdk using custom value: 24
  > :react-native-firebase_messaging:reactNativeAndroidDir /home/expo/workingdir/build/node_modules/react-native/android
  > Configure project :react-native-reanimated
  > Android gradle plugin: 8.6.0
  > Gradle: 8.10.2
  > Configure project :shopify_react-native-skia
  > react-native-skia: node_modules/ found at: /home/expo/workingdir/build/node_modules
  > react-native-skia: RN Version: 76 / 0.76.7
  > react-native-skia: isSourceBuild: false
  > react-native-skia: PrebuiltDir: /home/expo/workingdir/build/node_modules/@shopify/react-native-skia/android/build/react-native-0\*/jni
  > react-native-skia: buildType: release
  > react-native-skia: buildDir: /home/expo/workingdir/build/node_modules/@shopify/react-native-skia/android/build
  > react-native-skia: node_modules: /home/expo/workingdir/build/node_modules
  > react-native-skia: Enable Prefab: true
  > react-native-skia: aar state post 70, do nothing
  > Task :expo-application:preBuild UP-TO-DATE
  > Task :expo-application:preReleaseBuild UP-TO-DATE
  > Task :expo-asset:preBuild UP-TO-DATE
  > Task :expo-asset:preReleaseBuild UP-TO-DATE
  > Task :expo-application:generateReleaseResValues
  > Task :expo-asset:generateReleaseResValues
  > Task :expo-application:generateReleaseResources
  > Task :expo-asset:generateReleaseResources
  > Task :expo-asset:packageReleaseResources
  > Task :expo-application:packageReleaseResources
  > Task :expo-clipboard:preBuild UP-TO-DATE
  > Task :expo-clipboard:preReleaseBuild UP-TO-DATE
  > Task :expo-clipboard:generateReleaseResValues
  > Task :expo-clipboard:generateReleaseResources
  > Task :expo-clipboard:packageReleaseResources
  > Task :expo-dev-client:preBuild UP-TO-DATE
  > Task :expo-dev-client:preReleaseBuild UP-TO-DATE
  > Task :expo-dev-client:generateReleaseResValues
  > Task :expo-dev-client:generateReleaseResources
  > Task :expo-dev-client:packageReleaseResources
  > Task :expo-dev-launcher:preBuild UP-TO-DATE
  > Task :expo-dev-launcher:preReleaseBuild UP-TO-DATE
  > Task :expo-dev-launcher:generateReleaseResValues
  > Task :expo-dev-launcher:generateReleaseResources
  > Task :expo-constants:createExpoConfig
  > Task :expo-constants:preBuild
  > Task :expo-constants:preReleaseBuild
  > Task :expo-constants:generateReleaseResValues
  > Task :expo-constants:generateReleaseResources
  > Task :expo-constants:packageReleaseResources
  > Task :expo-dev-menu:preBuild UP-TO-DATE
  > Task :expo-dev-menu:preReleaseBuild UP-TO-DATE
  > The NODE_ENV environment variable is required but was not specified. Ensure the project is bundled with Expo CLI or NODE_ENV is set.
  > Proceeding without mode-specific .env
  > [33m[1mWarning: [22mRoot-level [1m"expo"[22m object found. Ignoring extra keys in Expo config: "dependencies", "newArchEnabled"
  > [90mLearn more: https://expo.fyi/root-expo-object[0m[0m
  > Task :expo-dev-menu:generateReleaseResValues
  > Task :expo-dev-menu:generateReleaseResources
  > Task :expo:generateExpoModulesPackageListTask
  > Task :expo:preBuild
  > Task :expo:preReleaseBuild
  > Task :expo:generateReleaseResValues
  > Task :expo:generateReleaseResources
  > Task :expo-dev-menu:packageReleaseResources
  > Task :expo-dev-menu-interface:preBuild UP-TO-DATE
  > Task :expo-dev-menu-interface:preReleaseBuild UP-TO-DATE
  > Task :expo:packageReleaseResources
  > Task :expo-file-system:preBuild UP-TO-DATE
  > Task :expo-file-system:preReleaseBuild UP-TO-DATE
  > Task :expo-dev-menu-interface:generateReleaseResValues
  > Task :expo-file-system:generateReleaseResValues
  > Task :expo-dev-menu-interface:generateReleaseResources
  > Task :expo-file-system:generateReleaseResources
  > Task :expo-dev-menu-interface:packageReleaseResources
  > Task :expo-font:preBuild UP-TO-DATE
  > Task :expo-font:preReleaseBuild UP-TO-DATE
  > Task :expo-font:generateReleaseResValues
  > Task :expo-file-system:packageReleaseResources
  > Task :expo-json-utils:preBuild UP-TO-DATE
  > Task :expo-font:generateReleaseResources
  > Task :expo-json-utils:preReleaseBuild UP-TO-DATE
  > Task :expo-json-utils:generateReleaseResValues
  > Task :expo-json-utils:generateReleaseResources
  > Task :expo-font:packageReleaseResources
  > Task :expo-keep-awake:preBuild UP-TO-DATE
  > Task :expo-keep-awake:preReleaseBuild UP-TO-DATE
  > Task :expo-keep-awake:generateReleaseResValues
  > Task :expo-json-utils:packageReleaseResources
  > Task :expo-linear-gradient:preBuild UP-TO-DATE
  > Task :expo-keep-awake:generateReleaseResources
  > Task :expo-linear-gradient:preReleaseBuild UP-TO-DATE
  > Task :expo-linear-gradient:generateReleaseResValues
  > Task :expo-keep-awake:packageReleaseResources
  > Task :expo-manifests:preBuild
  > UP-TO-DATE
  > Task :expo-linear-gradient:generateReleaseResources
  > Task :expo-manifests:preReleaseBuild UP-TO-DATE
  > Task :expo-manifests:generateReleaseResValues
  > Task :expo-manifests:generateReleaseResources
  > Task :expo-linear-gradient:packageReleaseResources
  > Task :expo-manifests:packageReleaseResources
  > Task :expo-notifications:preBuild UP-TO-DATE
  > Task :expo-modules-core:preBuild UP-TO-DATE
  > Task :expo-modules-core:preReleaseBuild UP-TO-DATE
  > Task :expo-notifications:preReleaseBuild UP-TO-DATE
  > Task :expo-modules-core:generateReleaseResValues
  > Task :expo-dev-launcher:packageReleaseResources
  > Task :expo-notifications:generateReleaseResValues
  > Task :expo-updates-interface:preBuild UP-TO-DATE
  > Task :expo-updates-interface:preReleaseBuild UP-TO-DATE
  > Task :expo-modules-core:generateReleaseResources
  > Task :expo-updates-interface:generateReleaseResValues
  > Task :expo-notifications:generateReleaseResources
  > Task :expo-modules-core:packageReleaseResources
  > Task :react-native-async-storage_async-storage:preBuild UP-TO-DATE
  > Task :react-native-async-storage_async-storage:preReleaseBuild UP-TO-DATE
  > Task :expo-updates-interface:generateReleaseResources
  > Task :react-native-async-storage_async-storage:generateReleaseResValues
  > Task :expo-notifications:packageReleaseResources
  > Task :react-native-clipboard_clipboard:preBuild UP-TO-DATE
  > Task :react-native-clipboard_clipboard:preReleaseBuild UP-TO-DATE
  > Task :react-native-async-storage_async-storage:generateReleaseResources
  > Task :react-native-clipboard_clipboard:generateReleaseResValues
  > Task :expo-updates-interface:packageReleaseResources
  > Task :react-native-firebase_app:preBuild UP-TO-DATE
  > Task :react-native-firebase_app:preReleaseBuild UP-TO-DATE
  > Task :react-native-firebase_app:generateReleaseResValues
  > Task :react-native-clipboard_clipboard:generateReleaseResources
  > Task :react-native-firebase_app:generateReleaseResources
  > Task :react-native-clipboard_clipboard:packageReleaseResources
  > Task :react-native-firebase_messaging:preBuild UP-TO-DATE
  > Task :react-native-async-storage_async-storage:packageReleaseResources
  > Task :react-native-firebase_messaging:preReleaseBuild UP-TO-DATE
  > Task :react-native-gesture-handler:preBuild UP-TO-DATE
  > Task :react-native-gesture-handler:preReleaseBuild UP-TO-DATE
  > Task :react-native-firebase_messaging:generateReleaseResValues
  > Task :react-native-gesture-handler:generateReleaseResValues
  > Task :react-native-firebase_app:packageReleaseResources
  > Task :react-native-reanimated:assertLatestReactNativeWithNewArchitectureTask SKIPPED
  > Task :react-native-reanimated:assertMinimalReactNativeVersionTask SKIPPED
  > Task :react-native-gesture-handler:generateReleaseResources
  > Task :react-native-firebase_messaging:generateReleaseResources
  > Task :react-native-gesture-handler:packageReleaseResources
  > Task :react-native-safe-area-context:preBuild UP-TO-DATE
  > Task :react-native-safe-area-context:preReleaseBuild UP-TO-DATE
  > Task :react-native-reanimated:prepareReanimatedHeadersForPrefabs
  > Task :react-native-safe-area-context:generateReleaseResValues
  > Task :react-native-safe-area-context:generateReleaseResources
  > Task :react-native-reanimated:prepareWorkletsHeadersForPrefabs
  > Task :react-native-reanimated:preBuild
  > Task :react-native-reanimated:preReleaseBuild
  > Task :react-native-firebase_messaging:packageReleaseResources
  > Task :react-native-screens:preBuild UP-TO-DATE
  > Task :react-native-screens:preReleaseBuild UP-TO-DATE
  > Task :react-native-reanimated:generateReleaseResValues
  > Task :react-native-safe-area-context:packageReleaseResources
  > Task :react-native-screens:generateReleaseResValues
  > Task :react-native-reanimated:generateReleaseResources
  > Task :react-native-screens:generateReleaseResources
  > Task :react-native-screens:packageReleaseResources
  > Task :expo:extractDeepLinksRelease
  > Task :react-native-reanimated:packageReleaseResources
  > Task :expo-application:extractDeepLinksRelease
  > Task :expo:processReleaseManifest
  > Task :expo-application:processReleaseManifest
  > Task :shopify_react-native-skia:prepareHeaders
  > Task :shopify_react-native-skia:preBuild
  > Task :shopify_react-native-skia:preReleaseBuild
  > Task :expo-clipboard:extractDeepLinksRelease
  > Task :expo-asset:extractDeepLinksRelease
  > Task :shopify_react-native-skia:generateReleaseResValues
  > Task :shopify_react-native-skia:generateReleaseResources
  > Task :expo-clipboard:processReleaseManifest
  > Task :shopify_react-native-skia:packageReleaseResources
  > Task :expo-constants:extractDeepLinksRelease
  > Task :expo-dev-client:extractDeepLinksRelease
  > Task :expo-asset:processReleaseManifest
  > Task :expo-constants:processReleaseManifest
  > Task :expo-dev-launcher:extractDeepLinksRelease
  > Task :expo-dev-client:processReleaseManifest
  > Task :expo-dev-menu:extractDeepLinksRelease
  > Task :expo-dev-menu-interface:extractDeepLinksRelease
  > Task :expo-dev-launcher:processReleaseManifest
  > Task :expo-file-system:extractDeepLinksRelease
  > Task :expo-dev-menu:processReleaseManifest
  > Task :expo-dev-menu-interface:processReleaseManifest
  > Task :expo-json-utils:extractDeepLinksRelease
  > Task :expo-font:extractDeepLinksRelease
  > Task :expo-font:processReleaseManifest
  > Task :expo-file-system:processReleaseManifest
  > /home/expo/workingdir/build/node_modules/expo-file-system/android/src/main/AndroidManifest.xml:6:9-8:20 Warning:
            provider#expo.modules.filesystem.FileSystemFileProvider@android:authorities was tagged at AndroidManifest.xml:6 to replace other declarations but no other declaration present
  > Task :expo-json-utils:processReleaseManifest
  > Task :expo-keep-awake:extractDeepLinksRelease
  > Task :expo-linear-gradient:extractDeepLinksRelease
  > Task :expo-manifests:extractDeepLinksRelease
  > Task :expo-keep-awake:processReleaseManifest
  > Task :expo-linear-gradient:processReleaseManifest
  > Task :expo-manifests:processReleaseManifest
  > Task :expo-modules-core:extractDeepLinksRelease
  > Task :expo-notifications:extractDeepLinksRelease
  > Task :expo-updates-interface:extractDeepLinksRelease
  > Task :expo-updates-interface:processReleaseManifest
  > Task :expo-modules-core:processReleaseManifest
  > /home/expo/workingdir/build/node_modules/expo-modules-core/android/src/main/AndroidManifest.xml:8:9-11:45 Warning:
            meta-data#com.facebook.soloader.enabled@android:value was tagged at AndroidManifest.xml:8 to replace other declarations but no other declaration present
  > Task :react-native-async-storage_async-storage:extractDeepLinksRelease
  > Task :expo-notifications:processReleaseManifest
  > Task :react-native-clipboard_clipboard:extractDeepLinksRelease
  > Task :react-native-firebase_app:extractDeepLinksRelease
  > Task :react-native-async-storage_async-storage:processReleaseManifest
  > package="com.reactnativecommunity.asyncstorage" found in source AndroidManifest.xml: /home/expo/workingdir/build/node_modules/@react-native-async-storage/async-storage/android/src/main/AndroidManifest.xml.
  > Setting the namespace via the package attribute in the source AndroidManifest.xml is no longer supported, and the value is ignored.
  > Recommendation: remove package="com.reactnativecommunity.asyncstorage" from the source AndroidManifest.xml: /home/expo/workingdir/build/node_modules/@react-native-async-storage/async-storage/android/src/main/AndroidManifest.xml.
  > Task :react-native-firebase_app:processReleaseManifest
  > package="io.invertase.firebase" found in source AndroidManifest.xml: /home/expo/workingdir/build/node_modules/@react-native-firebase/app/android/src/main/AndroidManifest.xml.
  > Setting the namespace via the package attribute in the source AndroidManifest.xml is no longer supported, and the value is ignored.
  > Recommendation: remove package="io.invertase.firebase" from the source AndroidManifest.xml: /home/expo/workingdir/build/node_modules/@react-native-firebase/app/android/src/main/AndroidManifest.xml.
  > Task :react-native-firebase_messaging:extractDeepLinksRelease
  > Task :react-native-clipboard_clipboard:processReleaseManifest
  > Task :react-native-gesture-handler:extractDeepLinksRelease
  > Task :react-native-reanimated:extractDeepLinksRelease
  > Task :react-native-gesture-handler:processReleaseManifest
  > Task :react-native-firebase_messaging:processReleaseManifest
  > package="io.invertase.firebase.messaging" found in source AndroidManifest.xml: /home/expo/workingdir/build/node_modules/@react-native-firebase/messaging/android/src/main/AndroidManifest.xml.
  > Setting the namespace via the package attribute in the source AndroidManifest.xml is no longer supported, and the value is ignored.
  > Recommendation: remove package="io.invertase.firebase.messaging" from the source AndroidManifest.xml: /home/expo/workingdir/build/node_modules/@react-native-firebase/messaging/android/src/main/AndroidManifest.xml.
  > Task :react-native-screens:extractDeepLinksRelease
  > Task :react-native-safe-area-context:extractDeepLinksRelease
  > Task :react-native-reanimated:processReleaseManifest
  > Task :react-native-screens:processReleaseManifest
  > package="com.swmansion.rnscreens" found in source AndroidManifest.xml: /home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/AndroidManifest.xml.
  > Setting the namespace via the package attribute in the source AndroidManifest.xml is no longer supported, and the value is ignored.
  > Recommendation: remove package="com.swmansion.rnscreens" from the source AndroidManifest.xml: /home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/AndroidManifest.xml.
  > Task :react-native-safe-area-context:processReleaseManifest
  > package="com.th3rdwave.safeareacontext" found in source AndroidManifest.xml: /home/expo/workingdir/build/node_modules/react-native-safe-area-context/android/src/main/AndroidManifest.xml.
  > Setting the namespace via the package attribute in the source AndroidManifest.xml is no longer supported, and the value is ignored.
  > Recommendation: remove package="com.th3rdwave.safeareacontext" from the source AndroidManifest.xml: /home/expo/workingdir/build/node_modules/react-native-safe-area-context/android/src/main/AndroidManifest.xml.
  > Task :shopify_react-native-skia:extractDeepLinksRelease
  > Task :shopify_react-native-skia:processReleaseManifest
  > package="com.shopify.reactnative.skia" found in source AndroidManifest.xml: /home/expo/workingdir/build/node_modules/@shopify/react-native-skia/android/src/main/AndroidManifest.xml.
  > Setting the namespace via the package attribute in the source AndroidManifest.xml is no longer supported, and the value is ignored.
  > Recommendation: remove package="com.shopify.reactnative.skia" from the source AndroidManifest.xml: /home/expo/workingdir/build/node_modules/@shopify/react-native-skia/android/src/main/AndroidManifest.xml.
  > Task :expo-asset:writeReleaseAarMetadata
  > Task :expo:writeReleaseAarMetadata
  > Task :expo-application:writeReleaseAarMetadata
  > Task :expo-clipboard:writeReleaseAarMetadata
  > Task :expo-dev-client:writeReleaseAarMetadata
  > Task :expo-constants:writeReleaseAarMetadata
  > Task :expo-dev-menu:writeReleaseAarMetadata
  > Task :expo-dev-launcher:writeReleaseAarMetadata
  > Task :expo-dev-menu-interface:writeReleaseAarMetadata
  > Task :expo-font:writeReleaseAarMetadata
  > Task :expo-file-system:writeReleaseAarMetadata
  > Task :expo-json-utils:writeReleaseAarMetadata
  > Task :expo-linear-gradient:writeReleaseAarMetadata
  > Task :expo-manifests:writeReleaseAarMetadata
  > Task :expo-keep-awake:writeReleaseAarMetadata
  > Task :expo-updates-interface:writeReleaseAarMetadata
  > Task :expo-modules-core:writeReleaseAarMetadata
  > Task :expo-notifications:writeReleaseAarMetadata
  > Task :react-native-async-storage_async-storage:writeReleaseAarMetadata
  > Task :react-native-clipboard_clipboard:writeReleaseAarMetadata
  > Task :react-native-firebase_app:writeReleaseAarMetadata
  > Task :react-native-gesture-handler:writeReleaseAarMetadata
  > Task :react-native-firebase_messaging:writeReleaseAarMetadata
  > Task :react-native-reanimated:writeReleaseAarMetadata
  > Task :react-native-safe-area-context:writeReleaseAarMetadata
  > Task :react-native-screens:writeReleaseAarMetadata
  > Task :shopify_react-native-skia:writeReleaseAarMetadata
  > Task :app:createBundleReleaseJsAndAssets
  > [33m[1mWarning: [22mRoot-level [1m"expo"[22m object found. Ignoring extra keys in Expo config: "dependencies", "newArchEnabled"
  > [90mLearn more: https://expo.fyi/root-expo-object[0m[0m
  > Starting Metro Bundler
  > Task :expo:compileReleaseLibraryResources
  > Task :expo-application:compileReleaseLibraryResources
  > Task :expo-asset:compileReleaseLibraryResources
  > Task :expo:parseReleaseLocalResources
  > Task :expo-asset:parseReleaseLocalResources
  > Task :expo-application:parseReleaseLocalResources
  > Task :expo-application:generateReleaseRFile
  > Task :expo-asset:generateReleaseRFile
  > Task :expo:generateReleaseRFile
  > Task :expo-dev-client:compileReleaseLibraryResources
  > Task :expo-constants:compileReleaseLibraryResources
  > Task :expo-constants:parseReleaseLocalResources
  > Task :expo-constants:generateReleaseRFile
  > Task :expo-clipboard:parseReleaseLocalResources
  > Task :expo-dev-client:parseReleaseLocalResources
  > Task :expo-clipboard:generateReleaseRFile
  > Task :expo-dev-client:generateReleaseRFile
  > Task :expo-dev-launcher:parseReleaseLocalResources
  > Task :expo-clipboard:compileReleaseLibraryResources
  > Task :expo-dev-launcher:generateReleaseRFile
  > Task :expo-dev-menu-interface:compileReleaseLibraryResources
  > Task :expo-dev-launcher:compileReleaseLibraryResources
  > Task :expo-dev-menu:parseReleaseLocalResources
  > Task :expo-dev-menu:generateReleaseRFile
  > Task :expo-dev-menu-interface:parseReleaseLocalResources
  > Task :expo-dev-menu-interface:generateReleaseRFile
  > Task :expo-file-system:compileReleaseLibraryResources
  > Task :expo-file-system:parseReleaseLocalResources
  > Task :expo-font:compileReleaseLibraryResources
  > Task :expo-font:parseReleaseLocalResources
  > Task :expo-file-system:generateReleaseRFile
  > Task :expo-json-utils:compileReleaseLibraryResources
  > Task :expo-font:generateReleaseRFile
  > Task :expo-json-utils:parseReleaseLocalResources
  > Task :expo-keep-awake:compileReleaseLibraryResources
  > Task :expo-keep-awake:parseReleaseLocalResources
  > Task :expo-dev-menu:compileReleaseLibraryResources
  > Task :expo-json-utils:generateReleaseRFile
  > Task :expo-keep-awake:generateReleaseRFile
  > Task :expo-linear-gradient:compileReleaseLibraryResources
  > Task :expo-manifests:compileReleaseLibraryResources
  > Task :expo-modules-core:compileReleaseLibraryResources
  > Task :expo-linear-gradient:parseReleaseLocalResources
  > Task :expo-manifests:parseReleaseLocalResources
  > Task :expo-modules-core:parseReleaseLocalResources
  > Task :expo-manifests:generateReleaseRFile
  > Task :expo-linear-gradient:generateReleaseRFile
  > Task :expo-updates-interface:compileReleaseLibraryResources
  > Task :expo-modules-core:generateReleaseRFile
  > Task :expo-notifications:compileReleaseLibraryResources
  > Task :react-native-async-storage_async-storage:compileReleaseLibraryResources
  > Task :expo-updates-interface:parseReleaseLocalResources
  > Task :expo-notifications:parseReleaseLocalResources
  > Task :react-native-async-storage_async-storage:parseReleaseLocalResources
  > Task :expo-updates-interface:generateReleaseRFile
  > Task :expo-notifications:generateReleaseRFile
  > Task :react-native-clipboard_clipboard:compileReleaseLibraryResources
  > Task :react-native-async-storage_async-storage:generateReleaseRFile
  > Task :react-native-firebase_app:compileReleaseLibraryResources
  > Task :react-native-clipboard_clipboard:parseReleaseLocalResources
  > Task :react-native-firebase_app:parseReleaseLocalResources
  > Task :react-native-firebase_messaging:compileReleaseLibraryResources
  > Task :react-native-firebase_messaging:parseReleaseLocalResources
  > Task :react-native-firebase_app:generateReleaseRFile
  > Task :react-native-clipboard_clipboard:generateReleaseRFile
  > Task :react-native-gesture-handler:compileReleaseLibraryResources
  > Task :react-native-reanimated:compileReleaseLibraryResources
  > Task :react-native-gesture-handler:parseReleaseLocalResources
  > Task :react-native-reanimated:parseReleaseLocalResources
  > Task :react-native-firebase_messaging:generateReleaseRFile
  > Task :react-native-reanimated:generateReleaseRFile
  > Task :react-native-safe-area-context:compileReleaseLibraryResources
  > Task :react-native-gesture-handler:generateReleaseRFile
  > Task :react-native-safe-area-context:parseReleaseLocalResources
  > Task :shopify_react-native-skia:compileReleaseLibraryResources
  > Task :react-native-safe-area-context:generateReleaseRFile
  > Task :react-native-screens:compileReleaseLibraryResources
  > Task :react-native-screens:parseReleaseLocalResources
  > Task :expo:checkKotlinGradlePluginConfigurationErrors
  > Task :shopify_react-native-skia:parseReleaseLocalResources
  > Task :shopify_react-native-skia:generateReleaseRFile
  > Task :expo-application:checkKotlinGradlePluginConfigurationErrors
  > Task :react-native-screens:generateReleaseRFile
  > Task :expo-modules-core:checkKotlinGradlePluginConfigurationErrors
  > Task :expo:generateReleaseBuildConfig
  > Task :expo-asset:checkKotlinGradlePluginConfigurationErrors
  > Task :expo-application:generateReleaseBuildConfig
  > Task :expo-modules-core:generateReleaseBuildConfig
  > Task :expo-asset:generateReleaseBuildConfig
  > Task :expo-asset:javaPreCompileRelease
  > Task :expo-application:javaPreCompileRelease
  > Task :expo-constants:checkKotlinGradlePluginConfigurationErrors
  > Task :expo-clipboard:checkKotlinGradlePluginConfigurationErrors
  > Task :expo-constants:generateReleaseBuildConfig
  > Task :expo-constants:javaPreCompileRelease
  > Task :expo-dev-client:checkKotlinGradlePluginConfigurationErrors
  > Task :expo-clipboard:generateReleaseBuildConfig
  > Task :expo-clipboard:javaPreCompileRelease
  > Task :expo-dev-launcher:checkKotlinGradlePluginConfigurationErrors
  > Task :app:createBundleReleaseJsAndAssets
  > Android Bundled 2226ms index.ts (1315 modules)
  > Writing bundle output to: /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle
  > Writing sourcemap output to: /home/expo/workingdir/build/android/app/build/intermediates/sourcemaps/react/release/index.android.bundle.packager.map
  > Copying 41 asset files
  > Done writing bundle output
  > Done writing sourcemap output
  > /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:1640:23: warning: the variable "DebuggerInternal" was not declared in function "\_\_shouldPauseOnThrow"
                return typeof DebuggerInternal !== 'undefined' && DebuggerInternal.sh...
                              ^~~~~~~~~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:12183:7: warning: the variable "setTimeout" was not declared in function "logCapturedError"
  setTimeout(function () {
  ^~~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:10417:31: warning: the variable "nativeFabricUIManager" was not declared in anonymous function " 289#"
  var \_nativeFabricUIManage = nativeFabricUIManager,
  ^~~~~~~~~~~~~~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:10445:21: warning: the variable "clearTimeout" was not declared in anonymous function " 289#"
  cancelTimeout = clearTimeout;
  ^~~~~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:10458:51: warning: the variable "RN$enableMicrotasksInReact" was not declared in anonymous function " 289#"
... "undefined" !== typeof RN$enableMicrotasksInReact && !!RN$enableMicrotask...
  ^~~~~~~~~~~~~~~~~~~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:10459:47: warning: the variable "queueMicrotask" was not declared in anonymous function " 289#"
  ...otask = "function" === typeof queueMicrotask ? queueMicrotask : scheduleTi...
  ^~~~~~~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:14880:30: warning: the variable "**REACT_DEVTOOLS_GLOBAL_HOOK**" was not declared in anonymous function " 289#"
  if ("undefined" !== typeof **REACT_DEVTOOLS_GLOBAL_HOOK**) {
  ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:16345:5: warning: the variable "setImmediate" was not declared in function "handleResolved"
  setImmediate(function () {
  ^~~~~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:19722:5: warning: the variable "fetch" was not declared in anonymous function " 514#"
  fetch,
  ^~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:19723:5: warning: the variable "Headers" was not declared in anonymous function " 514#"
  Headers,
  ^~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:19724:5: warning: the variable "Request" was not declared in anonymous function " 514#"
  Request,
  ^~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:19725:5: warning:
  the variable "Response" was not declared in anonymous function " 514#"
  Response
  ^~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:19882:24: warning: the variable "FileReader" was not declared in function "readBlobAsArrayBuffer"
  var reader = new FileReader();
  ^~~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:19933:36: warning: the variable "Blob" was not declared in anonymous function " 525#"
  } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
  ^~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:19935:40: warning: the variable "FormData" was not declared in anonymous function " 525#"
  } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
  ^~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:19937:44: warning: the variable "URLSearchParams" was not declared in anonymous function " 525#"
  ...e if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body...
  ^~~~~~~~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:20056:26: warning: the variable "AbortController" was not declared in anonymous function " 531#"
  var ctrl = new AbortController();
  ^~~~~~~~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:20190:23: warning: the variable "XMLHttpRequest" was not declared in anonymous function " 535#"
  var xhr = new XMLHttpRequest();
  ^~~~~~~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:19735:71: warning: the variable "self" was not declared in anonymous function " 517#"
  ...undefined' && globalThis || typeof self !== 'undefined' && self ||
  ^~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:22605:26: warning: the variable "navigator" was not declared in anonymous function " 694#"
  "undefined" !== typeof navigator && undefined !== navigator.scheduling && u...
  ^~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:22715:37: warning: the variable "MessageChannel" was not declared in anonymous function " 694#"
  };else if ("undefined" !== typeof MessageChannel) {
  ^~~~~~~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:22730:34: warning: the variable "nativeRuntimeScheduler" was not declared in anonymous function " 694#"
  ... = "undefined" !== typeof nativeRuntimeScheduler ? nativeRuntimeScheduler....
  ^~~~~~~~~~~~~~~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:32599:34: warning: the variable "requestAnimationFrame" was not declared in function "start 9#"
  ... this.\_animationFrame = requestAnimationFrame(this.onUpdate.bind(this));
  ^~~~~~~~~~~~~~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:48101:11: warning: the variable "\_WORKLET" was not declared in function "assertEasingIsWorklet"
  if (\_WORKLET) {
  ^~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:49882:94: warning: the variable "location" was not declared in function "registerSensor 1#"
  ...(0, \_PlatformChecker.isWeb)() && location.protocol !== 'https:' ? ' Make s...
  ^~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:50344:12: warning: the variable "**reanimatedLoggerConfig" was not declared in function "replaceLoggerImplementation"
  ...**reanimatedLoggerConfig,
  ^~~~~~~~~~~~~~~~~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:50945:26: warning: Direct call to eval(), but lexical scope is not supported.
  workletFun = eval('(' + initData.code + '\n)');
  ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:50968:112: warning: the variable "\_toString" was not declared in function "valueUnpacker"
  ...recognized by value unpacker: "${\_toString(objectToUnpack)}".`);
  ^~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle
  :67890:26: warning: the variable "structuredClone" was not declared in function "createAnimationWithInitialValues"
  var animationStyle = structuredClone(\_config.AnimationsData[animationName...
  ^~~~~~~~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:68210:5: warning: the variable "document" was not declared in function "configureWebLayoutAnimations"
  document.getElementById(PREDEFINED_WEB_ANIMATIONS_ID) !== null) {
  ^~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:68305:27: warning: the variable "HTMLElement" was not declared in function "findDescendantWithExitingAnimation"
  if (!(node instanceof HTMLElement)) {
  ^~~~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:68331:24: warning: the variable "MutationObserver" was not declared in function "addHTMLMutationObserver"
  var observer = new MutationObserver(mutationsList => {
  ^~~~~~~~~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:68376:41: warning: the variable "getComputedStyle" was not declared in function "fixElementPosition"
  ...entBorderTopValue = parseInt(getComputedStyle(parent).borderTopWidth);
  ^~~~~~~~~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:72328:5: warning: the variable "jest" was not declared in arrow function "beforeTest"
  jest.useFakeTimers();
  ^~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:72905:26: warning: the variable "_getAnimationTimestamp" was not declared in function "computeEasingProgress"
  var elapsedTime = (_getAnimationTimestamp() - startingTimestamp) / 1000;
  ^~~~~~~~~~~~~~~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:82592:16: warning: the variable "SharedArrayBuffer" was not declared in function "from 1#"
  if (typeof SharedArrayBuffer !== 'undefined' && (isInstance(value, Shared...
  ^~~~~~~~~~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:92578:29: warning: the variable "IDBDatabase" was not declared in function "getMethod"
  if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop =...
  ^~~~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:92587:37: warning: the variable "IDBIndex" was not declared in function "getMethod"
  !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || ...
  ^~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:92587:48: warning: the variable "IDBObjectStore" was not declared in function "getMethod"
  ...ame in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || r...
  ^~~~~~~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:92631:94: warning: the variable "IDBCursor" was not declared in function "getIdbProxyableTypes"
  ...abase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction]);
  ^~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:92631:105: warning: the variable "IDBTransaction" was not declared in function "getIdbProxyableTypes"
  ...ctStore, IDBIndex, IDBCursor, IDBTransaction]);
  ^~~~~~~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:92686:32: warning: the variable "DOMException" was not declared in arrow function "error 4#"
  reject(tx.error || new DOMException('AbortError', 'AbortError'));
  ^~~~~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:92778:26: warning: the variable "IDBRequest" was not declared in function "wrap 1#"
  if (value instanceof IDBRequest) return promisifyRequest(value);
  ^~~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle
  :139529:9: warning: the variable "REACT_NAVIGATION_DEVTOOLS" was not declared in anonymous arrow function " 5837#"
  REACT_NAVIGATION_DEVTOOLS.set(refContainer.current, {
  ^~~~~~~~~~~~~~~~~~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:145499:26: warning: the variable "ResizeObserver" was not declared in anonymous arrow function " 6047#"
  var observer = new ResizeObserver(entries => {
  ^~~~~~~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle
  :179377:25: warning: the variable "Atomics" was not declared in anonymous function " 6595#"
  '%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
  ^~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:179394:38: warning: the variable "FinalizationRegistry" was not declared in anonymous function " 6595#"
  ...lizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefine...
  ^~~~~~~~~~~~~~~~~~~~
  /home/expo/workingdir/build/android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle:179434:25: warning: the variable "WeakRef" was not declared in anonymous function " 6595#"
  '%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
  ^~~~~~~
  > Task :expo-dev-client:dataBindingMergeDependencyArtifactsRelease
  > Task :expo-modules-core:javaPreCompileRelease
  > Task :expo-dev-launcher:dataBindingMergeDependencyArtifactsRelease
  > Task :expo-dev-client:dataBindingGenBaseClassesRelease
  > Task :expo-dev-client:generateReleaseBuildConfig
  > Task :expo-dev-client:javaPreCompileRelease
  > Task :expo-dev-menu:checkKotlinGradlePluginConfigurationErrors
  > Task :expo-dev-menu:generateReleaseBuildConfig
  > Task :expo-dev-menu-interface:checkKotlinGradlePluginConfigurationErrors
  > Task :expo-dev-menu-interface:generateReleaseBuildConfig
  > Task :expo-dev-menu-interface:javaPreCompileRelease
  > Task :expo-json-utils:checkKotlinGradlePluginConfigurationErrors
  > Task :expo-json-utils:generateReleaseBuildConfig
  > Task :expo-json-utils:javaPreCompileRelease
  > Task :expo-manifests:checkKotlinGradlePluginConfigurationErrors
  > Task :expo-manifests:generateReleaseBuildConfig
  > Task :expo-manifests:javaPreCompileRelease
  > Task :expo-dev-menu:javaPreCompileRelease
  > Task :expo-updates-interface:checkKotlinGradlePluginConfigurationErrors
  > Task :expo-updates-interface:generateReleaseBuildConfig
  > Task :expo-updates-interface:javaPreCompileRelease
  > Task :expo-file-system:checkKotlinGradlePluginConfigurationErrors
  > Task :expo-file-system:generateReleaseBuildConfig
  > Task :expo-file-system:javaPreCompileRelease
  > Task :expo-font:checkKotlinGradlePluginConfigurationErrors
  > Task :expo-font:generateReleaseBuildConfig
  > Task :expo-font:javaPreCompileRelease
  > Task :expo-keep-awake:checkKotlinGradlePluginConfigurationErrors
  > Task :expo-dev-launcher:dataBindingGenBaseClassesRelease
  > Task :expo-dev-launcher:generateReleaseBuildConfig
  > Task :expo-keep-awake:generateReleaseBuildConfig
  > Task :expo-dev-launcher:javaPreCompileRelease
  > Task :expo-linear-gradient:checkKotlinGradlePluginConfigurationErrors
  > Task :expo-keep-awake:javaPreCompileRelease
  > Task :expo-notifications:checkKotlinGradlePluginConfigurationErrors
  > Task :expo-linear-gradient:generateReleaseBuildConfig
  > Task :expo-notifications:generateReleaseBuildConfig
  > Task :expo-notifications:javaPreCompileRelease
  > Task :expo-linear-gradient:javaPreCompileRelease
  > Task :react-native-gesture-handler:checkKotlinGradlePluginConfigurationErrors
  > Task :react-native-gesture-handler:generateReleaseBuildConfig
  > Task :expo:javaPreCompileRelease
  > Task :react-native-reanimated:generateReleaseBuildConfig
  > Task :react-native-gesture-handler:javaPreCompileRelease
  > Task :react-native-reanimated:javaPreCompileRelease
  > Task :react-native-reanimated:packageNdkLibs NO-SOURCE
  > Task :react-native-safe-area-context:checkKotlinGradlePluginConfigurationErrors
  > Task :react-native-safe-area-context:generateReleaseBuildConfig
  > Task :app:generateAutolinkingPackageList
  > Task :app:generateCodegenSchemaFromJavaScript SKIPPED
  > Task :app:generateCodegenArtifactsFromSchema SKIPPED
  > Task :app:preBuild
  > Task :app:preReleaseBuild
  > Task :app:generateReleaseResValues
  > Task :react-native-safe-area-context:compileReleaseKotlin
  > w: file:///home/expo/workingdir/build/node_modules/react-native-safe-area-context/android/src/main/java/com/th3rdwave/safeareacontext/SafeAreaContextPackage.kt:27:11 'constructor ReactModuleInfo(String, String, Boolean, Boolean, Boolean, Boolean, Boolean)' is deprecated. use ReactModuleInfo(String, String, boolean, boolean, boolean, boolean)]
  > w: file:///home/expo/workingdir/build/node_modules/react-native-safe-area-context/android/src/main/java/com/th3rdwave/safeareacontext/SafeAreaContextPackage.kt:33:27 'getter for hasConstants: Boolean' is deprecated. This property is unused and it's planning to be removed in a future version of
                React Native. Please refrain from using it.
  w: file:///home/expo/workingdir/build/node_modules/react-native-safe-area-context/android/src/main/java/com/th3rdwave/safeareacontext/SafeAreaView.kt:59:23 'getter for uiImplementation: UIImplementation!' is deprecated. Deprecated in Java
  > Task :react-native-safe-area-context:javaPreCompileRelease
  > Task :react-native-reanimated:compileReleaseJavaWithJavac
  > Note: Some input files use or override a deprecated API.
  > Note: Recompile with -Xlint:deprecation for details.
  > Note: Some input files use unchecked or unsafe operations.
  > Note: Recompile with -Xlint:unchecked for details.
  > Task :app:mapReleaseSourceSetPaths
  > Task :app:generateReleaseResources
  > Task :react-native-safe-area-context:compileReleaseJavaWithJavac
  > Note: /home/expo/workingdir/build/node_modules/react-native-safe-area-context/android/src/paper/java/com/th3rdwave/safeareacontext/NativeSafeAreaContextSpec.java uses or overrides a deprecated API.
  > Note: Recompile with -Xlint:deprecation for details.
  > Task :app:createReleaseCompatibleScreenManifests
  > Task :app:extractDeepLinksRelease
  > Task :react-native-reanimated:bundleLibCompileToJarRelease
  > Task :expo-modules-core:compileReleaseKotlin
  > Task :app:processReleaseMainManifest
  > package="com.moodsync.app" found in source AndroidManifest.xml: /home/expo/workingdir/build/android/app/src/main/AndroidManifest.xml.
  > Setting the namespace via the package attribute in the source AndroidManifest.xml is no longer supported, and the value is ignored.
  > Recommendation: remove package="com.moodsync.app" from the source AndroidManifest.xml: /home/expo/workingdir/build/android/app/src/main/AndroidManifest.xml.
  > /home/expo/workingdir/build/android/app/src/main/AndroidManifest.xml:28:3-140:17 Warning:
            application@android:allowBackup was tagged at AndroidManifest.xml:28 to replace other declarations but no other declaration present
  /home/expo/workingdir/build/android/app/src/main/AndroidManifest.xml Warning:
  provider#expo.modules.filesystem.FileSystemFileProvider@android:authorities was tagged at AndroidManifest.xml:0 to replace other declarations but no other declaration present
  > Task :app:processReleaseManifest
  > Task :app:processApplicationManifestReleaseForBundle
  > Task :app:checkReleaseAarMetadata
  > Task :app:mergeReleaseResources
  > Task :react-native-safe-area-context:bundleLibRuntimeToDirRelease
  > Task :app:packageReleaseResources
  > Task :app:parseReleaseLocalResources
  > Task :app:processReleaseManifestForPackage
  > Task :app:extractReleaseVersionControlInfo
  > Task :react-native-screens:checkKotlinGradlePluginConfigurationErrors
  > Task :react-native-screens:generateReleaseBuildConfig
  > Task :app:processReleaseResources
  > Task :app:bundleReleaseResources
  > Task :react-native-screens:javaPreCompileRelease
  > Task :react-native-async-storage_async-storage:generateReleaseBuildConfig
  > Task :react-native-async-storage_async-storage:javaPreCompileRelease
  > Task :react-native-async-storage_async-storage:compileReleaseJavaWithJavac
  > /home/expo/workingdir/build/node_modules/@react-native-async-storage/async-storage/android/src/main/java/com/reactnativecommunity/asyncstorage/AsyncStorageModule.java:84: warning: [removal] onCatalystInstanceDestroy() in NativeModule has been deprecated and marked for removal
  > public void onCatalystInstanceDestroy() {
  > ^
  > Note: Some input files use or override a deprecated API.
  > Note: Recompile with -Xlint:deprecation for details.
  > Note: /home/expo/workingdir/build/node_modules/@react-native-async-storage/async-storage/android/src/javaPackage/java/com/reactnativecommunity/asyncstorage/AsyncStoragePackage.java uses unchecked or unsafe operations.
  > Note: Recompile with -Xlint:unchecked for details.
  > 1 warning
  > Task :react-native-async-storage_async-storage:bundleLibRuntimeToDirRelease
  > Task :react-native-clipboard_clipboard:generateReleaseBuildConfig
  > Task :react-native-clipboard_clipboard:javaPreCompileRelease
  > Task :react-native-clipboard_clipboard:compileReleaseJavaWithJavac
  > Task :react-native-clipboard_clipboard:bundleLibRuntimeToDirRelease
  > Note: Some input files use or override a deprecated API.
  > Note: Recompile with -Xlint:deprecation for details.
  > Note: /home/expo/workingdir/build/node_modules/@react-native-clipboard/clipboard/android/src/main/java/com/reactnativecommunity/clipboard/ClipboardPackage.java uses unchecked or unsafe operations.
  > Note: Recompile with -Xlint:unchecked for details.
  > Task :react-native-firebase_app:generateReleaseBuildConfig
  > Task :react-native-firebase_app:javaPreCompileRelease
  > Task :react-native-firebase_app:compileReleaseJavaWithJavac
  > Note: Some input files use or override a deprecated API.
  > Note: Recompile with -Xlint:deprecation for details.
  > Task :react-native-firebase_app:bundleLibCompileToJarRelease
  > Task :react-native-firebase_messaging:generateReleaseBuildConfig
  > Task :react-native-firebase_messaging:javaPreCompileRelease
  > Task :react-native-gesture-handler:compileReleaseKotlin
  > w: file:///home/expo/workingdir/build/node_modules/react-native-gesture-handler/android/src/main/java/com/swmansion/gesturehandler/RNGestureHandlerPackage.kt:69:42 'constructor ReactModuleInfo(String, String, Boolean, Boolean, Boolean, Boolean, Boolean)' is deprecated. use ReactModuleInfo(String, String, boolean, boolean, boolean, boolean)]
  > w: file:///home/expo/workingdir/build/node_modules/react-native-gesture-handler/android/src/main/java/com/swmansion/gesturehandler/core/FlingGestureHandler.kt:25:26 Parameter 'event' is never used
  > w: file:///home/expo/workingdir/build/node_modules/react-native-gesture-handler/android/src/main/java/com/swmansion/gesturehandler/react/RNGestureHandlerButtonViewManager.kt:72:62 The corresponding parameter in the supertype 'ViewGroupManager' is named 'borderRadius'. This may cause problems when calling this function with named arguments.
  > w: file:///home/expo/workingdir/build/node_modules/react-native-gesture-handler/android/src/main/java/com/swmansion/gesturehandler/react/RNGestureHandlerButtonViewManager.kt:77:63 The corresponding parameter in the supertype 'ViewGroupManager' is named 'borderRadius'. This may cause problems when calling this function with named arguments.
  > w: file:///home/expo/workingdir/build/node_modules/react-native-gesture-handler/android/src/main/java/com/swmansion/gesturehandler/react/RNGestureHandlerButtonViewManager.kt:82:65 The corresponding parameter in the supertype 'ViewGroupManager' is named 'borderRadius'. This may cause problems when calling this function with named arguments.
  > w: file:///home/expo/workingdir/build/node_modules/react-native-gesture-handler/android/src/main/java/com/swmansion/gesturehandler/react/RNGestureHandlerButtonViewManager.kt:87:66 The corresponding parameter in the supertype 'ViewGroupManager' is named 'borderRadius'. This may cause problems when calling this function with named arguments.
  > Task :react-native-gesture-handler:compileReleaseJavaWithJavac
  > Task :react-native-gesture-handler:bundleLibRuntimeToDirRelease
  > Note: /home/expo/workingdir/build/node_modules/react-native-gesture-handler/android/paper/src/main/java/com/swmansion/gesturehandler/NativeRNGestureHandlerModuleSpec.java uses or overrides a deprecated API.
  > Note: Recompile with -Xlint:deprecation for details.
  > Task :react-native-firebase_messaging:compileReleaseJavaWithJavac
  > Note: Some input files use or override a deprecated API.
  > Note: Recompile with -Xlint:deprecation for details.
  > Task :react-native-firebase_messaging:bundleLibRuntimeToDirRelease
  > Task :react-native-firebase_app:bundleLibRuntimeToDirRelease
  > Task :shopify_react-native-skia:generateReleaseBuildConfig
  > Task :shopify_react-native-skia:javaPreCompileRelease
  > Task :shopify_react-native-skia:compileReleaseJavaWithJavac
  > Task :shopify_react-native-skia:bundleLibRuntimeToDirRelease
  > Note: Some input files use or override a deprecated API.
  > Note: Recompile with -Xlint:deprecation for details.
  > Note: Some input files use unchecked or unsafe operations.
  > Note: Recompile with -Xlint:unchecked for details.
  > Task :react-native-reanimated:bundleLibRuntimeToDirRelease
  > Task :react-native-async-storage_async-storage:bundleLibCompileToJarRelease
  > Task :react-native-clipboard_clipboard:bundleLibCompileToJarRelease
  > Task :react-native-firebase_messaging:bundleLibCompileToJarRelease
  > Task :react-native-gesture-handler:bundleLibCompileToJarRelease
  > Task :react-native-safe-area-context:bundleLibCompileToJarRelease
  > Task :shopify_react-native-skia:bundleLibCompileToJarRelease
  > Task :expo:mergeReleaseShaders
  > Task :app:checkReleaseDuplicateClasses
  > Task :expo:compileReleaseShaders
  > NO-SOURCE
  > Task :expo:generateReleaseAssets
  > UP-TO-DATE
  > Task :expo:packageReleaseAssets
  > Task :expo-application:mergeReleaseShaders
  > Task :expo-application:compileReleaseShaders
  > NO-SOURCE
  > Task :expo-application:generateReleaseAssets
  > UP-TO-DATE
  > Task :expo-application:packageReleaseAssets
  > Task :expo-asset:mergeReleaseShaders
  > Task :expo-asset:compileReleaseShaders
  > NO-SOURCE
  > Task :expo-asset:generateReleaseAssets UP-TO-DATE
  > Task :expo-asset:packageReleaseAssets
  > Task :expo-clipboard:mergeReleaseShaders
  > Task :expo-clipboard:compileReleaseShaders NO-SOURCE
  > Task :expo-clipboard:generateReleaseAssets UP-TO-DATE
  > Task :expo-clipboard:packageReleaseAssets
  > Task :expo-constants:mergeReleaseShaders
  > Task :expo-constants:compileReleaseShaders NO-SOURCE
  > Task :expo-constants:generateReleaseAssets UP-TO-DATE
  > Task :app:buildKotlinToolingMetadata
  > Task :app:checkKotlinGradlePluginConfigurationErrors
  > Task :expo-constants:packageReleaseAssets
  > Task :expo-dev-client:mergeReleaseShaders
  > Task :expo-dev-client:compileReleaseShaders NO-SOURCE
  > Task :expo-dev-client:generateReleaseAssets UP-TO-DATE
  > Task :expo-dev-client:packageReleaseAssets
  > Task :expo-dev-launcher:mergeReleaseShaders
  > Task :app:dataBindingMergeDependencyArtifactsRelease
  > Task :expo-dev-launcher:compileReleaseShaders NO-SOURCE
  > Task :expo-dev-launcher:generateReleaseAssets UP-TO-DATE
  > Task :expo-dev-launcher:packageReleaseAssets
  > Task :expo-dev-menu:mergeReleaseShaders
  > Task :expo-dev-menu:compileReleaseShaders
  > NO-SOURCE
  > Task :expo-dev-menu:generateReleaseAssets UP-TO-DATE
  > Task :expo-dev-menu:packageReleaseAssets
  > Task :expo-dev-menu-interface:mergeReleaseShaders
  > Task :expo-dev-menu-interface:compileReleaseShaders NO-SOURCE
  > Task :expo-dev-menu-interface:generateReleaseAssets UP-TO-DATE
  > Task :expo-dev-menu-interface:packageReleaseAssets
  > Task :expo-file-system:mergeReleaseShaders
  > Task :expo-file-system:compileReleaseShaders NO-SOURCE
  > Task :expo-file-system:generateReleaseAssets UP-TO-DATE
  > Task :expo-file-system:packageReleaseAssets
  > Task :expo-font:mergeReleaseShaders
  > Task :expo-font:compileReleaseShaders NO-SOURCE
  > Task :expo-font:generateReleaseAssets UP-TO-DATE
  > Task :app:dataBindingGenBaseClassesRelease
  > Task :app:generateReleaseBuildConfig
  > Task :expo-font:packageReleaseAssets
  > Task :expo-json-utils:mergeReleaseShaders
  > Task :app:javaPreCompileRelease
  > Task :expo-json-utils:compileReleaseShaders NO-SOURCE
  > Task :expo-json-utils:generateReleaseAssets UP-TO-DATE
  > Task :app:desugarReleaseFileDependencies
  > Task :app:mergeReleaseStartupProfile
  > Task :expo-json-utils:packageReleaseAssets
  > Task :expo-keep-awake:mergeReleaseShaders
  > Task :expo-keep-awake:compileReleaseShaders NO-SOURCE
  > Task :expo-keep-awake:generateReleaseAssets UP-TO-DATE
  > Task :expo-keep-awake:packageReleaseAssets
  > Task :react-native-screens:compileReleaseKotlin
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/CustomToolbar.kt:19:53 'FrameCallback' is deprecated. Use Choreographer.FrameCallback instead
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/CustomToolbar.kt:20:38 'FrameCallback' is deprecated. Use Choreographer.FrameCallback instead
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/RNScreensPackage.kt:64:17 'constructor ReactModuleInfo(String, String, Boolean, Boolean, Boolean, Boolean, Boolean)' is deprecated. use ReactModuleInfo(String, String, boolean, boolean, boolean, boolean)]
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/Screen.kt:45:77 Unchecked cast: CoordinatorLayout.Behavior<(raw) View!>? to BottomSheetBehavior<Screen>
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenContainer.kt:33:53 'FrameCallback' is deprecated. Use Choreographer.FrameCallback instead
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenContainer.kt:34:38 'FrameCallback' is deprecated. Use Choreographer.FrameCallback instead
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenFooter.kt:252:9 Parameter 'changed' is never used
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenFooter.kt:253:9 Parameter 'left' is never used
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenFooter.kt:254:9 Parameter 'top' is never used
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenFooter.kt:255:9 Parameter 'right' is never used
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenFooter.kt:256:9 Parameter 'bottom' is never used
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenStackFragment.kt:257:31 'setter for targetElevation: Float' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenStackFragment.kt:260:13 'setHasOptionsMenu(Boolean): Unit' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenStackFragment.kt:496:22 'onPrepareOptionsMenu(Menu): Unit' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenStackFragment.kt:504:22 'onCreateOptionsMenu(Menu, MenuInflater): Unit' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenStackHeaderConfig.kt:100:38 'getter for systemWindowInsetTop: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenStackHeaderConfigViewManager.kt:7:34 'MapBuilder' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenStackHeaderConfigViewManager.kt:209:9 'MapBuilder' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenStackHeaderConfigViewManager.kt:211:13 'MapBuilder' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenStackHeaderConfigViewManager.kt:213:13 'MapBuilder' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenViewManager.kt:7:34 'MapBuilder' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenViewManager.kt:375:48 'MapBuilder' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenViewManager.kt:376:49 'MapBuilder' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenViewManager.kt:377:45 'MapBuilder' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenViewManager.kt:378:52 'MapBuilder' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenViewManager.kt:379:48 'MapBuilder' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenViewManager.kt:380:51 'MapBuilder' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenViewManager.kt:381:56 'MapBuilder' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenViewManager.kt:382:57 'MapBuilder' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenViewManager.kt:383:51 'MapBuilder' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:55:42 'replaceSystemWindowInsets(Int, Int, Int, Int): WindowInsetsCompat' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:56:39 'getter for systemWindowInsetLeft: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:58:39 'getter for systemWindowInsetRight: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:59:39 'getter for systemWindowInsetBottom: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:98:53 'getter for statusBarColor: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:109:48 'getter for statusBarColor: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:112:32 'setter for statusBarColor: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:208:72 'getter for navigationBarColor: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:214:16 'setter for navigationBarColor: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/SearchBarManager.kt:5:34 'MapBuilder' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/SearchBarManager.kt:138:66 Elvis operator (?:) always returns the left operand of non-nullable type Boolean
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/SearchBarManager.kt:142:9 'MapBuilder' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/SearchBarManager.kt:144:13 'MapBuilder' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/SearchBarManager.kt:146:13 'MapBuilder' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/SearchBarManager.kt:148:13 'MapBuilder' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/SearchBarManager.kt:150:13 'MapBuilder' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/SearchBarManager.kt:152:13 'MapBuilder' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/SearchBarManager.kt:154:13 'MapBuilder' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/SearchBarView.kt:153:43 Parameter 'flag' is never used
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/bottomsheet/BottomSheetDialogRootView.kt:7:34 'ReactFeatureFlags' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/bottomsheet/BottomSheetDialogRootView.kt:25:13 'ReactFeatureFlags' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/paper/java/com/swmansion/rnscreens/FabricEnabledHeaderConfigViewGroup.kt:17:25 Parameter 'wrapper' is never used
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/paper/java/com/swmansion/rnscreens/FabricEnabledViewGroup.kt:10:25 Parameter 'wrapper' is never used
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/paper/java/com/swmansion/rnscreens/FabricEnabledViewGroup.kt:13:9 Parameter 'width' is never used
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/paper/java/com/swmansion/rnscreens/FabricEnabledViewGroup.kt:14:9 Parameter 'height' is never used
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/paper/java/com/swmansion/rnscreens/FabricEnabledViewGroup.kt:15:9 Parameter 'headerHeight' is never used
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/paper/java/com/swmansion/rnscreens/NativeProxy.kt:7:36 Parameter 'fabricUIManager' is never used
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/paper/java/com/swmansion/rnscreens/NativeProxy.kt:11:13 Parameter 'tag' is never used
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/paper/java/com/swmansion/rnscreens/NativeProxy.kt:12:13 Parameter 'view' is never used
  > w: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/paper/java/com/swmansion/rnscreens/NativeProxy.kt:15:33 Parameter 'tag' is never used
  > Task :expo-linear-gradient:mergeReleaseShaders
  > Task :expo-linear-gradient:compileReleaseShaders NO-SOURCE
  > Task :expo-linear-gradient:generateReleaseAssets UP-TO-DATE
  > Task :expo-linear-gradient:packageReleaseAssets
  > Task :react-native-screens:compileReleaseJavaWithJavac
  > Note: /home/expo/workingdir/build/node_modules/react-native-screens/android/src/paper/java/com/swmansion/rnscreens/NativeScreensModuleSpec.java uses or overrides a deprecated API.
  > Note: Recompile with -Xlint:deprecation for details.
  > Task :app:mergeExtDexRelease
  > Task :expo-manifests:mergeReleaseShaders
  > Task :react-native-screens:bundleLibRuntimeToDirRelease
  > Task :expo-modules-core:compileReleaseJavaWithJavac
  > Task :react-native-screens:bundleLibCompileToJarRelease
  > Task :expo-modules-core:bundleLibCompileToJarRelease
  > Task :expo-modules-core:bundleLibRuntimeToDirRelease
  > Task :expo-application:compileReleaseKotlin
  > Task :expo-asset:compileReleaseKotlin
  > Task :expo-asset:compileReleaseJavaWithJavac
  > Task :expo-application:compileReleaseJavaWithJavac
  > Task :expo-asset:bundleLibCompileToJarRelease
  > Task :expo-application:bundleLibCompileToJarRelease
  > Task :expo-dev-client:compileReleaseKotlin NO-SOURCE
  > Task :expo-dev-client:compileReleaseJavaWithJavac
  > Task :expo-dev-client:bundleLibCompileToJarRelease
  > Task :expo-constants:compileReleaseKotlin
  > Task :expo-dev-menu-interface:compileReleaseKotlin
  > Task :expo-constants:compileReleaseJavaWithJavac
  > Task :expo-constants:bundleLibCompileToJarRelease
  > Task :expo-dev-menu-interface:compileReleaseJavaWithJavac
  > Task :expo-dev-menu-interface:bundleLibCompileToJarRelease
  > Task :expo-json-utils:compileReleaseKotlin
  > Task :expo-json-utils:compileReleaseJavaWithJavac
  > Task :expo-json-utils:bundleLibCompileToJarRelease
  > Task :expo-clipboard:compileReleaseKotlin
  > Task :expo-clipboard:compileReleaseJavaWithJavac
  > Task :expo-clipboard:bundleLibCompileToJarRelease
  > Task :expo-updates-interface:compileReleaseKotlin
  > Task :expo-updates-interface:compileReleaseJavaWithJavac
  > Task :expo-updates-interface:bundleLibCompileToJarRelease
  > Task :expo-manifests:compileReleaseKotlin
  > w: file:///home/expo/workingdir/build/node_modules/expo-manifests/android/src/main/java/expo/modules/manifests/core/EmbeddedManifest.kt:19:16 This declaration overrides deprecated member but not marked as deprecated itself. Please add @Deprecated annotation or suppress. See https://youtrack.jetbrains.com/issue/KT-47902 for details
  > w: file:///home/expo/workingdir/build/node_modules/expo-manifests/android/src/main/java/expo/modules/manifests/core/EmbeddedManifest.kt:19:86 'getLegacyID(): String' is deprecated. Prefer scopeKey or projectId depending on use case
  > w: file:///home/expo/workingdir/build/node_modules/expo-manifests/android/src/main/java/expo/modules/manifests/core/ExpoUpdatesManifest.kt:16:16 This declaration overrides deprecated member but not marked as deprecated itself. Please add @Deprecated annotation or suppress. See https://youtrack.jetbrains.com/issue/KT-47902 for details
  > w: file:///home/expo/workingdir/build/node_modules/expo-manifests/android/src/main/java/expo/modules/manifests/core/Manifest.kt:15:12 'getRawJson(): JSONObject' is deprecated. Prefer to use specific field getters
  > Task :expo-manifests:compileReleaseJavaWithJavac
  > Task :expo-manifests:bundleLibCompileToJarRelease
  > Task :expo-font:compileReleaseKotlin
  > Task :expo-font:compileReleaseJavaWithJavac
  > Task :expo-font:bundleLibCompileToJarRelease
  > Task :expo-keep-awake:compileReleaseKotlin
  > Task :expo-keep-awake:compileReleaseJavaWithJavac
  > Task :expo-keep-awake:bundleLibCompileToJarRelease
  > Task :expo-file-system:compileReleaseKotlin
  > Task :expo-linear-gradient:compileReleaseKotlin
  > Task :expo-linear-gradient:compileReleaseJavaWithJavac
  > Task :expo-linear-gradient:bundleLibCompileToJarRelease
  > Task :expo-dev-client:bundleLibRuntimeToDirRelease
  > Task :expo-application:bundleLibRuntimeToDirRelease
  > Task :expo-file-system:compileReleaseJavaWithJavac
  > Task :expo-file-system:bundleLibCompileToJarRelease
  > Task :expo-asset:bundleLibRuntimeToDirRelease
  > Task :expo-clipboard:bundleLibRuntimeToDirRelease
  > Task :expo-constants:bundleLibRuntimeToDirRelease
  > Task :expo-file-system:bundleLibRuntimeToDirRelease
  > Task :expo-dev-menu:compileReleaseKotlin
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-menu/android/src/main/java/com/facebook/react/devsupport/DevMenuSettingsBase.kt:6:27 'PreferenceManager' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-menu/android/src/main/java/com/facebook/react/devsupport/DevMenuSettingsBase.kt:18:51 'PreferenceManager' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-menu/android/src/main/java/com/facebook/react/devsupport/DevMenuSettingsBase.kt:18:69 'getDefaultSharedPreferences(Context!): SharedPreferences!' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-menu/android/src/main/java/com/facebook/react/devsupport/DevMenuSettingsBase.kt:56:16 This declaration overrides deprecated member but not marked as deprecated itself. Please add @Deprecated annotation or suppress. See https://youtrack.jetbrains.com/issue/KT-47902 for details
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-menu/android/src/main/java/expo/modules/devmenu/fab/MovableFloatingActionButton.kt:173:17 'computeBounds(RectF, Boolean): Unit' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-menu/android/src/main/java/expo/modules/devmenu/helpers/DevMenuOkHttpExtension.kt:58:19 'create(MediaType?, String): RequestBody' is deprecated. Moved to extension function. Put the 'content' argument first to fix Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-menu/android/src/main/java/expo/modules/devmenu/modules/DevMenuModule.kt:33:44 Elvis operator (?:) always returns the left operand of non-nullable type ReadableMap
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-menu/android/src/react-native-74/main/expo/modules/devmenu/react/DevMenuPackagerConnectionSettings.kt:16:9 Parameter 'host' is never used
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-menu/android/src/release/java/expo/modules/devmenu/DevMenuManager.kt:40:42 Returning type parameter has been inferred to Nothing implicitly. Please specify type arguments explicitly to hide this warning. Nothing can produce an exception at runtime.
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-menu/android/src/release/java/expo/modules/devmenu/DevMenuManager.kt:82:43 The corresponding parameter in the supertype 'DevMenuManagerInterface' is named 'shouldAutoLaunch'. This may cause problems when calling this function with named arguments.
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-menu/android/src/release/java/expo/modules/devmenu/DevMenuManager.kt:94:17 Parameter 'context' is never used
  > Task :expo-font:bundleLibRuntimeToDirRelease
  > Task :expo-manifests:bundleLibRuntimeToDirRelease
  > Task :expo-json-utils:bundleLibRuntimeToDirRelease
  > Task :expo-keep-awake:bundleLibRuntimeToDirRelease
  > Task :expo-linear-gradient:bundleLibRuntimeToDirRelease
  > Task :expo-dev-menu-interface:bundleLibRuntimeToDirRelease
  > Task :expo-dev-menu:compileReleaseJavaWithJavac
  > Task :expo-dev-menu:bundleLibCompileToJarRelease
  > Task :expo-dev-menu:bundleLibRuntimeToDirRelease
  > Task :expo-updates-interface:bundleLibRuntimeToDirRelease
  > Task :app:mergeReleaseShaders
  > Task :app:compileReleaseShaders
  > NO-SOURCE
  > Task :app:generateReleaseAssets UP-TO-DATE
  > Task :expo-manifests:compileReleaseShaders NO-SOURCE
  > Task :expo-manifests:generateReleaseAssets UP-TO-DATE
  > Task :expo-manifests:packageReleaseAssets
  > Task :expo-modules-core:mergeReleaseShaders
  > Task :expo-modules-core:compileReleaseShaders NO-SOURCE
  > Task :expo-modules-core:generateReleaseAssets UP-TO-DATE
  > Task :expo-modules-core:packageReleaseAssets
  > Task :expo-notifications:mergeReleaseShaders
  > Task :expo-notifications:compileReleaseShaders NO-SOURCE
  > Task :expo-notifications:generateReleaseAssets UP-TO-DATE
  > Task :expo-notifications:packageReleaseAssets
  > Task :expo-updates-interface:mergeReleaseShaders
  > Task :expo-updates-interface:compileReleaseShaders
  > NO-SOURCE
  > Task :expo-updates-interface:generateReleaseAssets UP-TO-DATE
  > Task :expo-updates-interface:packageReleaseAssets
  > Task :react-native-async-storage_async-storage:mergeReleaseShaders
  > Task :react-native-async-storage_async-storage:compileReleaseShaders NO-SOURCE
  > Task :react-native-async-storage_async-storage:generateReleaseAssets UP-TO-DATE
  > Task :react-native-async-storage_async-storage:packageReleaseAssets
  > Task :react-native-clipboard_clipboard:mergeReleaseShaders
  > Task :react-native-clipboard_clipboard:compileReleaseShaders NO-SOURCE
  > Task :react-native-clipboard_clipboard:generateReleaseAssets UP-TO-DATE
  > Task :react-native-clipboard_clipboard:packageReleaseAssets
  > Task :react-native-firebase_app:mergeReleaseShaders
  > Task :react-native-firebase_app:compileReleaseShaders NO-SOURCE
  > Task :react-native-firebase_app:generateReleaseAssets UP-TO-DATE
  > Task :react-native-firebase_app:packageReleaseAssets
  > Task :react-native-firebase_messaging:mergeReleaseShaders
  > Task :react-native-firebase_messaging:compileReleaseShaders NO-SOURCE
  > Task :react-native-firebase_messaging:generateReleaseAssets UP-TO-DATE
  > Task :react-native-firebase_messaging:packageReleaseAssets
  > Task :react-native-gesture-handler:mergeReleaseShaders
  > Task :react-native-gesture-handler:compileReleaseShaders NO-SOURCE
  > Task :react-native-gesture-handler:generateReleaseAssets UP-TO-DATE
  > Task :react-native-gesture-handler:packageReleaseAssets
  > Task :react-native-reanimated:mergeReleaseShaders
  > Task :react-native-reanimated:compileReleaseShaders NO-SOURCE
  > Task :react-native-reanimated:generateReleaseAssets UP-TO-DATE
  > Task :react-native-reanimated:packageReleaseAssets
  > Task :react-native-safe-area-context:mergeReleaseShaders
  > Task :react-native-safe-area-context:compileReleaseShaders NO-SOURCE
  > Task :react-native-safe-area-context:generateReleaseAssets UP-TO-DATE
  > Task :react-native-safe-area-context:packageReleaseAssets
  > Task :react-native-screens:mergeReleaseShaders
  > Task :react-native-screens:compileReleaseShaders NO-SOURCE
  > Task :react-native-screens:generateReleaseAssets UP-TO-DATE
  > Task :react-native-screens:packageReleaseAssets
  > Task :shopify_react-native-skia:mergeReleaseShaders
  > Task :shopify_react-native-skia:compileReleaseShaders NO-SOURCE
  > Task :shopify_react-native-skia:generateReleaseAssets UP-TO-DATE
  > Task :shopify_react-native-skia:packageReleaseAssets
  > Task :app:mergeReleaseAssets
  > Task :expo-dev-client:bundleLibRuntimeToJarRelease
  > Task :react-native-gesture-handler:bundleLibRuntimeToJarRelease
  > Task :react-native-safe-area-context:bundleLibRuntimeToJarRelease
  > Task :react-native-screens:bundleLibRuntimeToJarRelease
  > Task :react-native-async-storage_async-storage:bundleLibRuntimeToJarRelease
  > Task :react-native-clipboard_clipboard:bundleLibRuntimeToJarRelease
  > Task :react-native-firebase_messaging:bundleLibRuntimeToJarRelease
  > Task :react-native-firebase_app:bundleLibRuntimeToJarRelease
  > Task :shopify_react-native-skia:bundleLibRuntimeToJarRelease
  > Task :react-native-reanimated:bundleLibRuntimeToJarRelease
  > Task :expo-application:bundleLibRuntimeToJarRelease
  > Task :expo-asset:bundleLibRuntimeToJarRelease
  > Task :expo-clipboard:bundleLibRuntimeToJarRelease
  > Task :expo-constants:bundleLibRuntimeToJarRelease
  > Task :expo-dev-menu:bundleLibRuntimeToJarRelease
  > Task :expo-font:bundleLibRuntimeToJarRelease
  > Task :expo-file-system:bundleLibRuntimeToJarRelease
  > Task :expo-manifests:bundleLibRuntimeToJarRelease
  > Task :expo-dev-launcher:compileReleaseKotlin
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/helpers/DevLauncherUpdatesHelper.kt:16:3 Parameter 'context' is never used
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/DevLauncherRecentlyOpenedAppsRegistry.kt:32:47 Unchecked cast: MutableMap<Any?, Any?> to MutableMap<String, Any>
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/DevLauncherRecentlyOpenedAppsRegistry.kt:50:27 'getRawJson(): JSONObject' is deprecated. Prefer to use specific field getters
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:37:23 'constructor TaskDescription(String!, Bitmap!, Int)' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:63:61 'FLAG_TRANSLUCENT_STATUS: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:90:33 Variable 'appliedStatusBarStyle' initializer is redundant
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:92:45 'getter for systemUiVisibility: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:95:68 'SYSTEM_UI_FLAG_LIGHT_STATUS_BAR: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:99:67 'SYSTEM_UI_FLAG_LIGHT_STATUS_BAR: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:103:67 'SYSTEM_UI_FLAG_LIGHT_STATUS_BAR: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:107:15 'setter for systemUiVisibility: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:115:59 'FLAG_FULLSCREEN: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:116:61 'FLAG_FORCE_NOT_FULLSCREEN: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:118:59 'FLAG_FORCE_NOT_FULLSCREEN: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:119:61 'FLAG_FULLSCREEN: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:131:23 'replaceSystemWindowInsets(Int, Int, Int, Int): WindowInsets' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:132:25 'getter for systemWindowInsetLeft: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:134:25 'getter for systemWindowInsetRight: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:135:25 'getter for systemWindowInsetBottom: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:150:15 'setter for statusBarColor: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:160:63 'FLAG_TRANSLUCENT_NAVIGATION: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:161:25 'setter for navigationBarColor: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:171:63 'FLAG_TRANSLUCENT_NAVIGATION: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:175:33 'getter for systemUiVisibility: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:176:33 'SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:177:21 'setter for systemUiVisibility: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:190:29 'getter for systemUiVisibility: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:191:62 'SYSTEM_UI_FLAG_HIDE_NAVIGATION: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:191:101 'SYSTEM_UI_FLAG_FULLSCREEN: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:192:63 'SYSTEM_UI_FLAG_HIDE_NAVIGATION: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:192:102 'SYSTEM_UI_FLAG_FULLSCREEN: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:192:136 'SYSTEM_UI_FLAG_IMMERSIVE: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:193:70 'SYSTEM_UI_FLAG_HIDE_NAVIGATION: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:193:109 'SYSTEM_UI_FLAG_FULLSCREEN: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:193:143 'SYSTEM_UI_FLAG_IMMERSIVE_STICKY: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/launcher/configurators/DevLauncherExpoActivityConfigurator.kt:196:17 'setter for systemUiVisibility: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/main/java/expo/modules/devlauncher/react/DevLauncherPackagerConnectionSettings.kt:12:9 Parameter 'value' is never used
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/release/java/expo/modules/devlauncher/DevLauncherController.kt:102:29 Parameter 'context' is never used
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/release/java/expo/modules/devlauncher/DevLauncherController.kt:102:47 Parameter 'reactHost' is never used
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/release/java/expo/modules/devlauncher/DevLauncherController.kt:108:67 Parameter 'launcherClass' is never used
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/release/java/expo/modules/devlauncher/DevLauncherController.kt:113:56 Parameter 'additionalPackages' is never used
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/release/java/expo/modules/devlauncher/DevLauncherController.kt:113:93 Parameter 'launcherClass' is never used
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/release/java/expo/modules/devlauncher/DevLauncherController.kt:118:35 Parameter 'reactActivity' is never used
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/release/java/expo/modules/devlauncher/DevLauncherController.kt:123:27 Parameter 'reactActivity' is never used
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/release/java/expo/modules/devlauncher/DevLauncherController.kt:123:57 Parameter 'intent' is never used
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/release/java/expo/modules/devlauncher/DevLauncherPackageDelegate.kt:12:27 Parameter 'reactContext' is never used
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/release/java/expo/modules/devlauncher/DevLauncherPackageDelegate.kt:13:43 Parameter 'context' is never used
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/release/java/expo/modules/devlauncher/DevLauncherPackageDelegate.kt:14:45 Parameter 'activityContext' is never used
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/release/java/expo/modules/devlauncher/DevLauncherPackageDelegate.kt:15:35 Parameter 'activityContext' is never used
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/release/java/expo/modules/devlauncher/DevLauncherPackageDelegate.kt:16:37 Parameter 'context' is never used
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/release/java/expo/modules/devlauncher/launcher/DevLauncherReactHost.kt:8:14 Parameter 'application' is never used
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/release/java/expo/modules/devlauncher/launcher/DevLauncherReactHost.kt:8:40 Parameter 'launcherIp' is never used
  > w: file:///home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/release/java/expo/modules/devlauncher/launcher/DevLauncherReactNativeHost.kt:8:60 Parameter 'launcherIp' is never used
  > Task :expo-json-utils:bundleLibRuntimeToJarRelease
  > Task :expo-keep-awake:bundleLibRuntimeToJarRelease
  > Task :expo-linear-gradient:bundleLibRuntimeToJarRelease
  > Task :expo-dev-menu-interface:bundleLibRuntimeToJarRelease
  > Task :expo-updates-interface:bundleLibRuntimeToJarRelease
  > Task :expo-modules-core:bundleLibRuntimeToJarRelease
  > Task :expo-dev-launcher:compileReleaseJavaWithJavac
  > Note: /home/expo/workingdir/build/node_modules/expo-dev-launcher/android/src/rn74/main/com/facebook/react/devsupport/NonFinalBridgeDevSupportManager.java uses or overrides a deprecated API.
  > Note: Recompile with -Xlint:deprecation for details.
  > Task :expo-dev-launcher:bundleLibCompileToJarRelease
  > Task :expo-dev-launcher:bundleLibRuntimeToDirRelease
  > Task :expo-dev-launcher:bundleLibRuntimeToJarRelease
  > Task :expo-application:processReleaseJavaRes
  > Task :expo-asset:processReleaseJavaRes
  > Task :expo-clipboard:processReleaseJavaRes
  > Task :expo-constants:processReleaseJavaRes
  > Task :expo-dev-client:processReleaseJavaRes
  > NO-SOURCE
  > Task :expo-dev-launcher:processReleaseJavaRes
  > Task :expo-dev-menu:processReleaseJavaRes
  > Task :expo-dev-menu-interface:processReleaseJavaRes
  > Task :expo-file-system:processReleaseJavaRes
  > Task :expo-font:processReleaseJavaRes
  > Task :expo-json-utils:processReleaseJavaRes
  > Task :expo-keep-awake:processReleaseJavaRes
  > Task :expo-linear-gradient:processReleaseJavaRes
  > Task :expo-manifests:processReleaseJavaRes
  > Task :expo-modules-core:processReleaseJavaRes
  > Task :expo-updates-interface:processReleaseJavaRes
  > Task :react-native-async-storage_async-storage:processReleaseJavaRes NO-SOURCE
  > Task :react-native-clipboard_clipboard:processReleaseJavaRes NO-SOURCE
  > Task :react-native-firebase_app:processReleaseJavaRes NO-SOURCE
  > Task :react-native-firebase_messaging:processReleaseJavaRes NO-SOURCE
  > Task :react-native-gesture-handler:processReleaseJavaRes
  > Task :react-native-reanimated:processReleaseJavaRes NO-SOURCE
  > Task :react-native-safe-area-context:processReleaseJavaRes
  > Task :react-native-screens:processReleaseJavaRes
  > Task :shopify_react-native-skia:processReleaseJavaRes NO-SOURCE
  > Task :app:mergeReleaseJniLibFolders
  > Task :expo:mergeReleaseJniLibFolders
  > Task :expo:mergeReleaseNativeLibs NO-SOURCE
  > Task :expo:copyReleaseJniLibsProjectOnly
  > Task :expo-application:mergeReleaseJniLibFolders
  > Task :expo-application:mergeReleaseNativeLibs NO-SOURCE
  > Task :expo-asset:mergeReleaseJniLibFolders
  > Task :expo-application:copyReleaseJniLibsProjectOnly
  > Task :expo-asset:mergeReleaseNativeLibs NO-SOURCE
  > Task :expo-asset:copyReleaseJniLibsProjectOnly
  > Task :expo-clipboard:mergeReleaseJniLibFolders
  > Task :expo-clipboard:mergeReleaseNativeLibs NO-SOURCE
  > Task :expo-constants:mergeReleaseJniLibFolders
  > Task :expo-clipboard:copyReleaseJniLibsProjectOnly
  > Task :expo-constants:mergeReleaseNativeLibs NO-SOURCE
  > Task :expo-constants:copyReleaseJniLibsProjectOnly
  > Task :expo-dev-client:mergeReleaseJniLibFolders
  > Task :expo-dev-client:mergeReleaseNativeLibs NO-SOURCE
  > Task :expo-dev-launcher:mergeReleaseJniLibFolders
  > Task :expo-dev-client:copyReleaseJniLibsProjectOnly
  > Task :expo-dev-launcher:mergeReleaseNativeLibs NO-SOURCE
  > Task :expo-dev-launcher:copyReleaseJniLibsProjectOnly
  > Task :expo-dev-menu:mergeReleaseJniLibFolders
  > Task :expo-dev-menu:mergeReleaseNativeLibs NO-SOURCE
  > Task :expo-dev-menu-interface:mergeReleaseJniLibFolders
  > Task :expo-dev-menu:copyReleaseJniLibsProjectOnly
  > Task :expo-dev-menu-interface:mergeReleaseNativeLibs NO-SOURCE
  > Task :expo-dev-menu-interface:copyReleaseJniLibsProjectOnly
  > Task :expo-file-system:mergeReleaseJniLibFolders
  > Task :expo-file-system:mergeReleaseNativeLibs NO-SOURCE
  > Task :expo-font:mergeReleaseJniLibFolders
  > Task :expo-font:mergeReleaseNativeLibs NO-SOURCE
  > Task :expo-file-system:copyReleaseJniLibsProjectOnly
  > Task :expo-font:copyReleaseJniLibsProjectOnly
  > Task :expo-json-utils:mergeReleaseJniLibFolders
  > Task :expo-json-utils:mergeReleaseNativeLibs NO-SOURCE
  > Task :expo-keep-awake:mergeReleaseJniLibFolders
  > Task :expo-keep-awake:mergeReleaseNativeLibs NO-SOURCE
  > Task :expo-json-utils:copyReleaseJniLibsProjectOnly
  > Task :expo-keep-awake:copyReleaseJniLibsProjectOnly
  > Task :expo-linear-gradient:mergeReleaseJniLibFolders
  > Task :expo-manifests:mergeReleaseJniLibFolders
  > Task :expo-linear-gradient:mergeReleaseNativeLibs NO-SOURCE
  > Task :expo-manifests:mergeReleaseNativeLibs NO-SOURCE
  > Task :expo-linear-gradient:copyReleaseJniLibsProjectOnly
  > Task :expo-manifests:copyReleaseJniLibsProjectOnly
  > Task :expo-notifications:mergeReleaseJniLibFolders
  > Task :expo-notifications:mergeReleaseNativeLibs NO-SOURCE
  > Task :expo-notifications:copyReleaseJniLibsProjectOnly
  > Task :expo-updates-interface:mergeReleaseJniLibFolders
  > Task :expo-updates-interface:mergeReleaseNativeLibs NO-SOURCE
  > Task :expo-updates-interface:copyReleaseJniLibsProjectOnly
  > Task :react-native-async-storage_async-storage:mergeReleaseJniLibFolders
  > Task :react-native-async-storage_async-storage:mergeReleaseNativeLibs NO-SOURCE
  > Task :react-native-async-storage_async-storage:copyReleaseJniLibsProjectOnly
  > Task :react-native-clipboard_clipboard:mergeReleaseJniLibFolders
  > Task :react-native-clipboard_clipboard:mergeReleaseNativeLibs NO-SOURCE
  > Task :react-native-clipboard_clipboard:copyReleaseJniLibsProjectOnly
  > Task :react-native-firebase_app:mergeReleaseJniLibFolders
  > Task :react-native-firebase_app:mergeReleaseNativeLibs NO-SOURCE
  > Task :react-native-firebase_app:copyReleaseJniLibsProjectOnly
  > Task :react-native-firebase_messaging:mergeReleaseJniLibFolders
  > Task :react-native-firebase_messaging:mergeReleaseNativeLibs NO-SOURCE
  > Task :react-native-firebase_messaging:copyReleaseJniLibsProjectOnly
  > Task :react-native-gesture-handler:mergeReleaseJniLibFolders
  > Task :react-native-gesture-handler:mergeReleaseNativeLibs NO-SOURCE
  > Task :react-native-gesture-handler:copyReleaseJniLibsProjectOnly
  > Task :expo-modules-core:configureCMakeRelWithDebInfo[arm64-v8a]
  > Warning: Errors during XML parse:
  > Warning: Additionally, the fallback loader failed to parse the XML.
  > Checking the license for package CMake 3.22.1 in /home/expo/Android/Sdk/licenses
  > License for package CMake 3.22.1 accepted.
  > Preparing "Install CMake 3.22.1 v.3.22.1".
  > Task :react-native-safe-area-context:mergeReleaseJniLibFolders
  > Task :react-native-safe-area-context:mergeReleaseNativeLibs NO-SOURCE
  > Task :react-native-safe-area-context:copyReleaseJniLibsProjectOnly
  > Task :expo-notifications:compileReleaseKotlin
  > w: file:///home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/Utils.kt:41:21 'get(String!): Any?' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/notifications/categories/ExpoNotificationCategoriesModule.kt:69:40 'getParcelableArrayList(String?): ArrayList<T!>?' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/notifications/categories/ExpoNotificationCategoriesModule.kt:122:36 'getParcelable(String?): T?' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/notifications/debug/DebugLogging.kt:30:23 'get(String!): Any?' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/notifications/model/RemoteNotificationContent.kt:21:45 'readParcelable(ClassLoader?): T?' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/notifications/model/triggers/FirebaseNotificationTrigger.kt:19:12 'readParcelable(ClassLoader?): T?' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/notifications/presentation/ExpoNotificationPresentationModule.kt:46:33 'getSerializable(String?): Serializable?' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/notifications/presentation/ExpoNotificationPresentationModule.kt:57:43 'getParcelableArrayList(String?): ArrayList<T!>?' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/notifications/presentation/ExpoNotificationPresentationModule.kt:61:33 'getSerializable(String?): Serializable?' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/notifications/presentation/ExpoNotificationPresentationModule.kt:81:31 'getSerializable(String?): Serializable?' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/notifications/presentation/ExpoNotificationPresentationModule.kt:95:31 'getSerializable(String?): Serializable?' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/notifications/presentation/builders/BaseNotificationBuilder.kt:35:100 'constructor Builder(Context)' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/notifications/scheduling/NotificationScheduler.kt:51:40 'getParcelableArrayList(String?): ArrayList<T!>?' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/notifications/scheduling/NotificationScheduler.kt:58:33 'getSerializable(String?): Serializable?' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/notifications/scheduling/NotificationScheduler.kt:81:35 'getSerializable(String?): Serializable?' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/notifications/scheduling/NotificationScheduler.kt:128:31 'getSerializable(String?): Serializable?' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/notifications/scheduling/NotificationScheduler.kt:142:31 'getSerializable(String?): Serializable?' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/service/NotificationsService.kt:480:34 'getParcelable(String?): T?' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/service/NotificationsService.kt:481:28 'getParcelable(String?): T?' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/service/NotificationsService.kt:505:33 'getParcelableExtra(String!): T?' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/service/NotificationsService.kt:506:27 'getParcelableExtra(String!): T?' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/service/NotificationsService.kt:609:54 'get(String!): Any?' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/service/NotificationsService.kt:676:22 'getParcelable(String?): T?' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/service/NotificationsService.kt:677:22 'getParcelable(String?): T?' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/service/NotificationsService.kt:704:14 'getParcelableExtra(String!): T?' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/service/NotificationsService.kt:734:18 'getParcelableExtra(String!): T?' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/service/NotificationsService.kt:774:22 'getParcelable(String?): T?' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/service/delegates/Base64Serialization.kt:26:45 Returning type parameter has been inferred to Nothing implicitly because Nothing is more specific than specified expected type. Please specify type arguments explicitly in accordance with expected type to hide this warning. Nothing can produce an exception at runtime. See KT-36776 for more details.
  > w: file:///home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/service/delegates/ExpoHandlingDelegate.kt:63:85 Parameter 'notificationResponse' is never used
  > w: file:///home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/service/delegates/ExpoPresentationDelegate.kt:194:70 'priority: Int' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/service/delegates/ExpoPresentationDelegate.kt:195:41 'vibrate: LongArray!' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/service/delegates/ExpoPresentationDelegate.kt:196:30 'sound: Uri!' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/service/delegates/ExpoPresentationDelegate.kt:207:41 'get(String!): Any?' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/service/delegates/ExpoPresentationDelegate.kt:210:124 'get(String!): Any?' is deprecated. Deprecated in Java
  > Task :expo-notifications:compileReleaseJavaWithJavac
  > Note: Some input files use or override a deprecated API.
  > Note: Recompile with -Xlint:deprecation for details.
  > Note: /home/expo/workingdir/build/node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/notifications/model/NotificationCategory.java uses unchecked or unsafe operations.
  > Note: Recompile with -Xlint:unchecked for details.
  > Task :expo-notifications:bundleLibCompileToJarRelease
  > Task :expo-modules-core:configureCMakeRelWithDebInfo[arm64-v8a]
  > "Install CMake 3.22.1 v.3.22.1" ready.
  > Installing CMake 3.22.1 in /home/expo/Android/Sdk/cmake/3.22.1
  > "Install CMake 3.22.1 v.3.22.1" complete.
  > "Install CMake 3.22.1 v.3.22.1" finished.
  > Task :expo:compileReleaseKotlin
  > w: file:///home/expo/workingdir/build/node_modules/expo/android/src/main/java/expo/modules/ReactActivityDelegateWrapper.kt:163:34 'constructor ReactDelegate(Activity!, ReactNativeHost!, String?, Bundle?)' is deprecated. Deprecated in Java
  > w: file:///home/expo/workingdir/build/node_modules/expo/android/src/main/java/expo/modules/fetch/NativeResponse.kt:40:16 This declaration overrides deprecated member but not marked as deprecated itself. Please add @Deprecated annotation or suppress. See https://youtrack.jetbrains.com/issue/KT-47902 for details
  > w: file:///home/expo/workingdir/build/node_modules/expo/android/src/main/java/expo/modules/fetch/NativeResponse.kt:42:11 'deallocate(): Unit' is deprecated. Use sharedObjectDidRelease() instead.
  > Task :expo:compileReleaseJavaWithJavac
  > Task :expo:bundleLibRuntimeToDirRelease
  > Task :react-native-screens:configureCMakeRelWithDebInfo[arm64-v8a]
  > Task :react-native-reanimated:configureCMakeRelWithDebInfo[arm64-v8a]
  > Task :expo:bundleLibCompileToJarRelease
  > Task :expo-notifications:bundleLibRuntimeToJarRelease
  > Task :expo:bundleLibRuntimeToJarRelease
  > Task :expo-notifications:bundleLibRuntimeToDirRelease
  > Task :expo:processReleaseJavaRes
  > Task :expo-notifications:processReleaseJavaRes
  > Task :react-native-screens:buildCMakeRelWithDebInfo[arm64-v8a]
  > Task :react-native-screens:configureCMakeRelWithDebInfo[armeabi-v7a]
  > Task :react-native-screens:buildCMakeRelWithDebInfo[armeabi-v7a]
  > Task :react-native-screens:configureCMakeRelWithDebInfo[x86]
  > Task :app:compileReleaseKotlin
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/CloudFunctionsModule.kt:5:38 Unresolved reference: FirebaseMessaging
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/CloudFunctionsModule.kt:6:38 Unresolved reference: RemoteMessage
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/CloudFunctionsModule.kt:60:39 Unresolved reference: RemoteMessage
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/CloudFunctionsModule.kt:66:25 Unresolved reference: FirebaseMessaging
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/CloudFunctionsModule.kt:109:13 Unresolved reference: FirebaseMessaging
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/CloudFunctionsModule.kt:109:75 Cannot infer a type for this parameter. Please specify it explicitly.
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/MainApplication.kt:6:17 Unresolved reference: multidex
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/MainApplication.kt:22:28 Unresolved reference: FirebaseApp
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/MainApplication.kt:23:38 Unresolved reference: FirebaseMessaging
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/MainApplication.kt:25:25 Unresolved reference: MultiDexApplication
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/MainApplication.kt:28:9 Type mismatch: inferred type is MainApplication but Application was expected
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/MainApplication.kt:29:41 Type mismatch: inferred type is MainApplication but Application was expected
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/MainApplication.kt:53:52 Unresolved reference: applicationContext
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/MainApplication.kt:55:3 'onCreate' overrides nothing
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/MainApplication.kt:56:11 Unresolved reference: onCreate
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/MainApplication.kt:57:14 None of the following functions can be called with the arguments supplied:
  > public open fun init(p0: Context!, p1: ExternalSoMapping?): Unit defined in com.facebook.soloader.SoLoader
  > public open fun init(p0: Context!, p1: Boolean): Unit defined in com.facebook.soloader.SoLoader
  > public open fun init(p0: Context!, p1: Int): Unit defined in com.facebook.soloader.SoLoader
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/MainApplication.kt:62:56 Type mismatch: inferred type is MainApplication but Application was expected
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/MainApplication.kt:69:3 'attachBaseContext' overrides nothing
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/MainApplication.kt:70:11 Unresolved reference: attachBaseContext
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/MainApplication.kt:71:14 Unresolved reference: multidex
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/MainApplication.kt:77:12 Unresolved reference: FirebaseApp
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/MainApplication.kt:78:9 Unresolved reference: FirebaseApp
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/MainApplication.kt:80:9 Unresolved reference: FirebaseMessaging
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/MainApplication.kt:80:41 Variable expected
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/MainApplication.kt:82:9 Unresolved reference: FirebaseMessaging
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/MainApplication.kt:82:71 Cannot infer a type for this parameter. Please specify it explicitly.
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/MainApplication.kt:93:27 Unresolved reference: getString
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/MainApplication.kt:95:37 Unresolved reference: getSystemService
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/MainApplication.kt:114:3 'onConfigurationChanged' overrides nothing
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/MainApplication.kt:115:11 Unresolved reference: onConfigurationChanged
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/MainApplication.kt:116:59 Type mismatch: inferred type is MainApplication but Application was expected
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/firebase/MoodSyncMessagingService.kt:11:38 Unresolved reference: FirebaseMessagingService
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/firebase/MoodSyncMessagingService.kt:12:38 Unresolved reference: RemoteMessage
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/firebase/MoodSyncMessagingService.kt:19:34 Unresolved reference: FirebaseMessagingService
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/firebase/MoodSyncMessagingService.kt:22:5 'onNewToken' overrides nothing
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/firebase/MoodSyncMessagingService.kt:23:15 Unresolved reference: onNewToken
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/firebase/MoodSyncMessagingService.kt:29:5 'onMessageReceived' overrides nothing
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/firebase/MoodSyncMessagingService.kt:29:51 Unresolved reference: RemoteMessage
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/firebase/MoodSyncMessagingService.kt:30:15 Unresolved reference: onMessageReceived
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/firebase/MoodSyncMessagingService.kt:60:54 Unresolved reference: it
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/firebase/MoodSyncMessagingService.kt:61:30 Unresolved reference: it
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/firebase/MoodSyncMessagingService.kt:61:54 Unresolved reference: it
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/firebase/MoodSyncMessagingService.kt:66:25 Unresolved reference: getString
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/firebase/MoodSyncMessagingService.kt:67:22 None of the following functions can be called with the arguments supplied:
  > public constructor Intent(p0: Context!, p1: Class<\*>!) defined in android.content.Intent
  > public constructor Intent(p0: String!, p1: Uri!) defined in android.content.Intent
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/firebase/MoodSyncMessagingService.kt:70:13 Type mismatch: inferred type is MoodSyncMessagingService but Context! was expected
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/firebase/MoodSyncMessagingService.kt:74:54 None of the following functions can be called with the arguments supplied:
  > public constructor Builder(p0: Context, p1: Notification) defined in androidx.core.app.NotificationCompat.Builder
  > public constructor Builder(p0: Context, p1: String) defined in androidx.core.app.NotificationCompat.Builder
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/firebase/MoodSyncMessagingService.kt:82:35 Unresolved reference: getSystemService
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/firebase/MoodSyncMessagingService.kt:110:27 Unresolved reference: applicationContext
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/firebase/MoodSyncMessagingService.kt:122:67 Unresolved reference: applicationContext
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/firebase/MoodSyncMessagingService.kt:125:17 Unresolved reference: sendBroadcast
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/firebase/MoodSyncMessagingService.kt:135:25 Unresolved reference: applicationContext
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/firebase/MoodSyncMessagingService.kt:159:9 Unresolved reference: sendBroadcast
  > e: file:///home/expo/workingdir/build/android/app/src/main/java/com/moodsync/app/firebase/MoodSyncMessagingService.kt:164:29 Unresolved reference: applicationContext
  > Task :app:compileReleaseKotlin
  > FAILED
  > Task :react-native-screens:buildCMakeRelWithDebInfo[x86]
  > Task :expo-modules-core:buildCMakeRelWithDebInfo[arm64-v8a]
  > Task :react-native-reanimated:buildCMakeRelWithDebInfo[arm64-v8a]
  > FAILURE: Build failed with an exception.

* What went wrong:
  Execution failed for task ':app:compileReleaseKotlin'.
  > A failure occurred while executing org.jetbrains.kotlin.compilerRunner.GradleCompilerRunnerWithWorkers$GradleKotlinCompilerWorkAction
  > Compilation error. See log for more details
* Try:
  > Run with --stacktrace option to get the stack trace.
  > Run with --info or --debug option to get more log output.
  > Run with --scan to get full insights.
  > Get more help at https://help.gradle.org.
  > BUILD FAILED in 4m 43s
  > Deprecated Gradle features were used in this build, making it incompatible with Gradle 9.0.
  > You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.
  > For more on this, please refer to https://docs.gradle.org/8.10.2/userguide/command_line_interface.html#sec:command_line_warnings in the Gradle documentation.
  > 635 actionable tasks: 635 executed
  > Error: Gradle build failed with unknown error. See logs for the "Run gradlew" phase for more information.

# Explicitly suppress Kotlin version check if needed

kotlin.suppressKotlinVersionCompatibilityCheck=true
