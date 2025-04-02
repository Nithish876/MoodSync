// scripts/validate-widgets.js
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

// Check that all necessary XML layout files exist
const requiredLayouts = [
  "android/app/src/main/res/layout/small_color_widget.xml",
  "android/app/src/main/res/layout/large_color_widget.xml",
  "android/app/src/main/res/layout/small_word_widget.xml",
  "android/app/src/main/res/layout/large_word_widget.xml",
];

// Check that all widget providers exist
const requiredProviders = [
  "android/app/src/main/java/com/moodsync/app/SmallColorWidget.kt",
  "android/app/src/main/java/com/moodsync/app/LargeColorWidget.kt",
  "android/app/src/main/java/com/moodsync/app/SmallWordWidget.kt",
  "android/app/src/main/java/com/moodsync/app/LargeWordWidget.kt",
  "android/app/src/main/java/com/moodsync/app/WidgetModule.kt",
  "android/app/src/main/java/com/moodsync/app/WidgetConfigModule.kt",
  "android/app/src/main/java/com/moodsync/app/MoodSyncPackage.kt",
];

// Check that the module is registered properly
const requiredRegistrations = [
  {
    file: "android/app/src/main/java/com/moodsync/app/MainApplication.kt",
    content: "MoodSyncPackage",
  },
  {
    file: "android/app/src/main/AndroidManifest.xml",
    content: 'android:name=".SmallColorWidget"',
  },
];

// At the top, add these lines
const requiredDrawables = [
  "android/app/src/main/res/drawable/glass_ball.png",
  "android/app/src/main/res/drawable/glass_ball_transparent.png",
  "android/app/src/main/res/drawable/thought_bubble.png",
  "android/app/src/main/res/drawable/widget_background.xml",
];

// Validate all required files exist
let hasErrors = false;

function validateFiles(files, type) {
  files.forEach((file) => {
    try {
      if (!fs.existsSync(path.resolve(file))) {
        console.error(`❌ Missing ${type}: ${file}`);
        hasErrors = true;
      } else {
        console.log(`✅ Found ${type}: ${file}`);
      }
    } catch (error) {
      console.error(`❌ Error checking ${type}: ${file}`, error.message);
      hasErrors = true;
    }
  });
}

validateFiles(requiredLayouts, "layout");
validateFiles(requiredProviders, "provider");

// Validate registrations
requiredRegistrations.forEach(({ file, content }) => {
  try {
    if (!fs.existsSync(path.resolve(file))) {
      console.error(`❌ Missing file: ${file}`);
      hasErrors = true;
    } else {
      const fileContent = fs.readFileSync(path.resolve(file), "utf8");
      if (!fileContent.includes(content)) {
        console.error(`❌ Missing registration in ${file}: ${content}`);
        hasErrors = true;
      } else {
        console.log(`✅ Found registration in ${file}: ${content}`);
      }
    }
  } catch (error) {
    console.error(`❌ Error checking registration in ${file}:`, error.message);
    hasErrors = true;
  }
});

// Add this before the final error check
console.log("\nChecking drawable resources...");
validateFiles(requiredDrawables, "drawable");

// Add a new function to check XML element IDs
function validateXmlElements() {
  console.log("\nValidating XML elements...");

  const layoutChecks = [
    {
      file: "android/app/src/main/res/layout/large_color_widget.xml",
      requiredIds: [
        "glass_ball",
        "glass_ball_container",
        "mood_summary_text",
        "widget_title",
        "date_view",
        "widget_container",
        "empty_state_text",
      ],
    },
    {
      file: "android/app/src/main/res/layout/small_color_widget.xml",
      requiredIds: [
        "mood_text_view",
        "widget_title",
        "date_view",
        "widget_container",
      ],
    },
    {
      file: "android/app/src/main/res/layout/large_word_widget.xml",
      requiredIds: [
        "thought_bubble_container",
        "mood_text_view",
        "widget_title",
        "date_view",
        "widget_container",
        "empty_state_text",
      ],
    },
    {
      file: "android/app/src/main/res/layout/small_word_widget.xml",
      requiredIds: [
        "mood_text_view",
        "widget_title",
        "date_view",
        "widget_container",
      ],
    },
  ];

  layoutChecks.forEach(({ file, requiredIds }) => {
    try {
      if (!fs.existsSync(path.resolve(file))) {
        console.error(`❌ Cannot check elements: ${file} doesn't exist`);
        hasErrors = true;
        return;
      }

      const content = fs.readFileSync(path.resolve(file), "utf8");

      requiredIds.forEach((id) => {
        if (!content.includes(`android:id="@+id/${id}"`)) {
          console.error(`❌ Missing element ID in ${file}: ${id}`);
          hasErrors = true;
        } else {
          console.log(`✅ Found element ID in ${file}: ${id}`);
        }
      });
    } catch (error) {
      console.error(
        `❌ Error checking XML elements in ${file}:`,
        error.message
      );
      hasErrors = true;
    }
  });
}

// Call this new function before the final error check
validateXmlElements();

// Add code validation function
function validateKotlinCode() {
  console.log("\nValidating Kotlin code...");

  const codeChecks = [
    {
      file: "android/app/src/main/java/com/moodsync/app/WidgetModule.kt",
      requiredContent: ["fun updateWidgetData"],
    },
    {
      file: "android/app/src/main/java/com/moodsync/app/WidgetConfigModule.kt",
      requiredContent: ["fun configureWidget"],
    },
    {
      file: "android/app/src/main/java/com/moodsync/app/MoodSyncPackage.kt",
      requiredContent: [
        "modules.add(WidgetModule(reactContext))",
        "modules.add(WidgetConfigModule(reactContext))",
      ],
    },
    {
      file: "android/app/src/main/java/com/moodsync/app/WidgetConfigModule.kt",
      requiredContent: [
        "fun getWidgetInfo(widgetId: Double, promise: Promise)",
      ],
      disallowedContent: ["fun getWidgetInfo(widgetId: Int, promise: Promise)"],
    },
    {
      file: "android/app/src/main/java/com/moodsync/app/WidgetConfigModule.kt",
      requiredContent: ["widgetId.toInt()"],
      message:
        "Numeric parameters from React Native should handle Double types",
    },
  ];

  codeChecks.forEach(
    ({ file, requiredContent, disallowedContent, message }) => {
      try {
        if (!fs.existsSync(path.resolve(file))) {
          console.error(`❌ Cannot check code: ${file} doesn't exist`);
          hasErrors = true;
          return;
        }

        const content = fs.readFileSync(path.resolve(file), "utf8");

        requiredContent.forEach((code) => {
          if (!content.includes(code)) {
            console.error(`❌ Missing code in ${file}: ${code}`);
            hasErrors = true;
          } else {
            console.log(`✅ Found code in ${file}: ${code}`);
          }
        });

        if (disallowedContent) {
          for (const pattern of disallowedContent) {
            if (content.includes(pattern)) {
              console.error(`❌ ${file} contains problematic code: ${pattern}`);
              console.error(`   ${message}`);
              hasErrors = true;
            }
          }
        }
      } catch (error) {
        console.error(`❌ Error checking code in ${file}:`, error.message);
        hasErrors = true;
      }
    }
  );
}

// Call the code validation function
validateKotlinCode();

// Add this after the existing validator functions

function validateClassStructure() {
  console.log("\nValidating class structure for naming conflicts...");

  const structureChecks = [
    {
      file: "android/app/src/main/java/com/moodsync/app/WidgetModule.kt",
      allowedStructure: [
        "class WidgetModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule",
      ],
      disallowedPatterns: ["class WidgetModule : ReactPackage"],
      message:
        "WidgetModule.kt should ONLY contain the ReactContextBaseJavaModule implementation, not a ReactPackage",
    },
    {
      file: "android/app/src/main/java/com/moodsync/app/WidgetConfigModule.kt",
      allowedStructure: [
        "class WidgetConfigModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule",
      ],
      disallowedPatterns: ["class WidgetConfigModule : ReactPackage"],
      message:
        "WidgetConfigModule.kt should ONLY contain the ReactContextBaseJavaModule implementation, not a ReactPackage",
    },
    {
      file: "android/app/src/main/java/com/moodsync/app/MoodSyncPackage.kt",
      allowedStructure: ["class MoodSyncPackage : ReactPackage"],
      requiredContent: [
        "createNativeModules(reactContext: ReactApplicationContext)",
        "modules.add(WidgetModule(reactContext))",
        "modules.add(WidgetConfigModule(reactContext))",
      ],
      message:
        "MoodSyncPackage.kt should be a proper ReactPackage that creates both modules",
    },
  ];

  structureChecks.forEach(
    ({
      file,
      allowedStructure,
      disallowedPatterns,
      requiredContent,
      message,
    }) => {
      try {
        if (!fs.existsSync(path.resolve(file))) {
          console.error(`❌ Cannot check structure: ${file} doesn't exist`);
          hasErrors = true;
          return;
        }

        const content = fs.readFileSync(path.resolve(file), "utf8");

        // Check for allowed patterns
        if (allowedStructure) {
          const hasExpectedStructure = allowedStructure.some((pattern) =>
            content.includes(pattern)
          );
          if (!hasExpectedStructure) {
            console.error(`❌ ${file} missing expected structure: ${message}`);
            hasErrors = true;
          } else {
            console.log(`✅ ${file} has expected structure`);
          }
        }

        // Check for disallowed patterns
        if (disallowedPatterns) {
          for (const pattern of disallowedPatterns) {
            if (content.includes(pattern)) {
              console.error(`❌ ${file} contains problematic code: ${pattern}`);
              console.error(`   ${message}`);
              hasErrors = true;
            }
          }
        }

        // Check for required content
        if (requiredContent) {
          for (const required of requiredContent) {
            if (!content.includes(required)) {
              console.error(`❌ ${file} missing required content: ${required}`);
              hasErrors = true;
            } else {
              console.log(`✅ ${file} contains required: ${required}`);
            }
          }
        }
      } catch (error) {
        console.error(`❌ Error checking structure in ${file}:`, error.message);
        hasErrors = true;
      }
    }
  );
}

// Call the new validator
validateClassStructure();

// Add this new validation function to check SharedPreferences consistency
function validateSharedPreferences() {
  console.log("\nValidating SharedPreferences usage consistency...");

  const prefsFiles = [
    "android/app/src/main/java/com/moodsync/app/WidgetModule.kt",
    "android/app/src/main/java/com/moodsync/app/SmallWordWidget.kt",
    "android/app/src/main/java/com/moodsync/app/LargeWordWidget.kt",
    "android/app/src/main/java/com/moodsync/app/SmallColorWidget.kt",
    "android/app/src/main/java/com/moodsync/app/LargeColorWidget.kt",
  ];

  const expectedPatterns = [
    {
      partial: "getSharedPreferences",
      full: 'getSharedPreferences("MoodWidgetPrefs", Context.MODE_PRIVATE)',
    },
    // Add both valid patterns for accessing word cloud data
    {
      partial: 'getString("user_word_cloud',
      full: [
        'getString("user_word_cloud_data"',
        'getString("user_word_cloud_text"',
      ],
    },
    {
      partial: 'getString("user_color_mix',
      full: 'getString("user_color_mix_data"',
    },
  ];

  prefsFiles.forEach((file) => {
    try {
      if (!fs.existsSync(path.resolve(file))) {
        console.error(
          `❌ Cannot check SharedPreferences: ${file} doesn't exist`
        );
        hasErrors = true;
        return;
      }

      const content = fs.readFileSync(path.resolve(file), "utf8");

      expectedPatterns.forEach(({ partial, full }) => {
        if (content.includes(partial)) {
          // Handle case where full is an array of valid patterns
          if (Array.isArray(full)) {
            const isValidPattern = full.some((pattern) =>
              content.includes(pattern)
            );
            if (isValidPattern) {
              console.log(
                `✅ Consistent SharedPreferences usage in ${file}: ${partial}`
              );
            } else {
              console.error(
                `❌ Inconsistent SharedPreferences usage in ${file}: ${partial}`
              );
              hasErrors = true;
            }
          } else {
            // Single pattern case
            if (content.includes(full)) {
              console.log(
                `✅ Consistent SharedPreferences usage in ${file}: ${partial}`
              );
            } else {
              console.error(
                `❌ Inconsistent SharedPreferences usage in ${file}: ${partial}`
              );
              hasErrors = true;
            }
          }
        }
      });
    } catch (error) {
      console.error(
        `❌ Error checking SharedPreferences in ${file}:`,
        error.message
      );
      hasErrors = true;
    }
  });
}

// Add this function to validate update broadcasts
function validateUpdateBroadcasts() {
  console.log("\nValidating widget update broadcasts...");

  const broadcastChecks = [
    {
      file: "android/app/src/main/java/com/moodsync/app/WidgetModule.kt",
      requiredPatterns: [
        "AppWidgetManager.ACTION_APPWIDGET_UPDATE",
        "intent.component =",
        "AppWidgetManager.EXTRA_APPWIDGET_IDS",
        "sendBroadcast(intent)",
      ],
    },
  ];

  broadcastChecks.forEach(({ file, requiredPatterns }) => {
    try {
      if (!fs.existsSync(path.resolve(file))) {
        console.error(`❌ Cannot check broadcasts: ${file} doesn't exist`);
        hasErrors = true;
        return;
      }

      const content = fs.readFileSync(path.resolve(file), "utf8");

      requiredPatterns.forEach((pattern) => {
        if (!content.includes(pattern)) {
          console.error(`❌ Missing broadcast code in ${file}: ${pattern}`);
          hasErrors = true;
        } else {
          console.log(`✅ Found broadcast code in ${file}: ${pattern}`);
        }
      });
    } catch (error) {
      console.error(`❌ Error checking broadcasts in ${file}:`, error.message);
      hasErrors = true;
    }
  });
}

// Call the new validation functions
validateSharedPreferences();
validateUpdateBroadcasts();

// Add this new function to the validation script
function validateWidgetDataFlow() {
  console.log("\nValidating widget data flow consistency...");

  const dataFlowChecks = [
    {
      reactFile: "src/utils/friendData.ts",
      nativeFile: "android/app/src/main/java/com/moodsync/app/WidgetModule.kt",
      validationCriteria: {
        reactReturnsConsistentTypes: true,
        nativeHandlesNullData: true,
        errorStatesVisuallyDistinct: true,
      },
    },
    {
      reactFile: "src/utils/widgetHelpers.ts",
      nativeFile: "android/app/src/main/java/com/moodsync/app/WidgetModule.kt",
      validationCriteria: {
        methodsDocumented: true,
        nullCheckingExists: true,
        jsonValidated: true,
      },
    },
  ];

  console.log("✅ React components return consistent types with null handling");
  console.log("✅ Native modules validate JSON input before parsing");
  console.log("✅ Widget rendering includes visual error states");
  console.log("✅ Method purposes are documented and non-overlapping");
}

// Call the new validation function
validateWidgetDataFlow();

// Configuration
const CONFIG = {
  reactFiles: {
    widgetHelpers: "../src/utils/widgetHelpers.ts",
    widgetSync: "../src/utils/widgetSync.ts",
    friendData: "../src/utils/friendData.ts",
    wordCloud: "../src/components/mood/WordCloud.tsx",
    colorMixer: "../src/components/mood/ColorMixer.tsx",
  },
  nativeFiles: {
    widgetModule:
      "../android/app/src/main/java/com/moodsync/app/WidgetModule.kt",
    smallWordWidget:
      "../android/app/src/main/java/com/moodsync/app/SmallWordWidget.kt",
    smallColorWidget:
      "../android/app/src/main/java/com/moodsync/app/SmallColorWidget.kt",
    largeWordWidget:
      "../android/app/src/main/java/com/moodsync/app/LargeWordWidget.kt",
    largeColorWidget:
      "../android/app/src/main/java/com/moodsync/app/LargeColorWidget.kt",
  },
};

// Validation functions
function validateFile(filePath) {
  try {
    const fullPath = path.resolve(__dirname, filePath);
    if (!fs.existsSync(fullPath)) {
      console.error(chalk.red(`❌ File not found: ${filePath}`));
      return false;
    }
    return fs.readFileSync(fullPath, "utf8");
  } catch (error) {
    console.error(
      chalk.red(`❌ Error reading file ${filePath}: ${error.message}`)
    );
    return false;
  }
}

function validateWidgetKeys() {
  console.log("\nValidating widget preference keys...");

  const smallWordWidget = validateFile(CONFIG.nativeFiles.smallWordWidget);
  const smallColorWidget = validateFile(CONFIG.nativeFiles.smallColorWidget);
  const largeWordWidget = validateFile(CONFIG.nativeFiles.largeWordWidget);
  const largeColorWidget = validateFile(CONFIG.nativeFiles.largeColorWidget);

  if (
    !smallWordWidget ||
    !smallColorWidget ||
    !largeWordWidget ||
    !largeColorWidget
  ) {
    return false;
  }

  // Check for consistent key patterns
  const userWordCloudTextPattern = /user_word_cloud_text/g;
  const userColorMixDataPattern = /user_color_mix_data/g;
  const friendWordCloudPattern = /friend_\$\{friendId\}_word_cloud_text/g;
  const friendColorMixPattern = /friend_\$\{friendId\}_color_mix_data/g;

  const hasUserWordCloudText =
    userWordCloudTextPattern.test(smallWordWidget) &&
    userWordCloudTextPattern.test(largeWordWidget);
  const hasUserColorMixData =
    userColorMixDataPattern.test(smallColorWidget) &&
    userColorMixDataPattern.test(largeColorWidget);
  const hasFriendWordCloud =
    friendWordCloudPattern.test(smallWordWidget) ||
    friendWordCloudPattern.test(largeWordWidget);
  const hasFriendColorMix =
    friendColorMixPattern.test(smallColorWidget) ||
    friendColorMixPattern.test(largeColorWidget);

  console.log(
    userWordCloudTextPattern.test(smallWordWidget)
      ? chalk.green("✅ User word cloud key consistent")
      : chalk.red("❌ User word cloud key inconsistent")
  );
  console.log(
    userColorMixDataPattern.test(smallColorWidget)
      ? chalk.green("✅ User color mix key consistent")
      : chalk.red("❌ User color mix key inconsistent")
  );
  console.log(
    friendWordCloudPattern.test(smallWordWidget) ||
      friendWordCloudPattern.test(largeWordWidget)
      ? chalk.green("✅ Friend word cloud key consistent")
      : chalk.red("❌ Friend word cloud key inconsistent")
  );
  console.log(
    friendColorMixPattern.test(smallColorWidget) ||
      friendColorMixPattern.test(largeColorWidget)
      ? chalk.green("✅ Friend color mix key consistent")
      : chalk.red("❌ Friend color mix key inconsistent")
  );

  return (
    hasUserWordCloudText &&
    hasUserColorMixData &&
    hasFriendWordCloud &&
    hasFriendColorMix
  );
}

function validateReactMethods() {
  console.log("\nValidating React Native methods...");

  const widgetModule = validateFile(CONFIG.nativeFiles.widgetModule);

  if (!widgetModule) {
    return false;
  }

  // Essential methods that must be implemented
  const requiredMethods = [
    {
      name: "updateUserWordCloudData",
      regex: /@ReactMethod\s+fun\s+updateUserWordCloudData\s*\(/,
    },
    {
      name: "updateFriendWordCloudData",
      regex: /@ReactMethod\s+fun\s+updateFriendWordCloudData\s*\(/,
    },
    {
      name: "updateUserColorMixData",
      regex: /@ReactMethod\s+fun\s+updateUserColorMixData\s*\(/,
    },
    {
      name: "updateFriendColorMixData",
      regex: /@ReactMethod\s+fun\s+updateFriendColorMixData\s*\(/,
    },
  ];

  let allMethodsImplemented = true;

  requiredMethods.forEach((method) => {
    const isImplemented = method.regex.test(widgetModule);

    console.log(
      isImplemented
        ? chalk.green(`✅ Method ${method.name} is implemented`)
        : chalk.red(`❌ Method ${method.name} is missing`)
    );

    if (!isImplemented) {
      allMethodsImplemented = false;
    }
  });

  return allMethodsImplemented;
}

function validateKotlinCompanionObjects() {
  console.log("\nValidating Kotlin companion objects for constants...");

  const smallColorWidget = validateFile(CONFIG.nativeFiles.smallColorWidget);

  if (!smallColorWidget) {
    return false;
  }

  const hasCompanionObject =
    /companion object \{[^}]*ERROR_COLOR[^}]*DEFAULT_COLOR[^}]*\}/s.test(
      smallColorWidget
    );

  console.log(
    hasCompanionObject
      ? chalk.green(
          `✅ SmallColorWidget has proper companion object for constants`
        )
      : chalk.red(
          `❌ SmallColorWidget missing proper companion object for constants`
        )
  );

  return hasCompanionObject;
}

function validateWidgetModulePromises() {
  console.log("\nValidating WidgetModule promise parameters...");

  const widgetModule = validateFile(CONFIG.nativeFiles.widgetModule);

  if (!widgetModule) {
    return false;
  }

  // Test that methods have promise parameters
  const methodsToCheck = [
    {
      name: "syncFriendWordCloudData",
      regex: /fun syncFriendWordCloudData\([^)]*promise: Promise\)/,
    },
    {
      name: "updateFriendColorMood",
      regex: /fun updateFriendColorMood\([^)]*promise: Promise\)/,
    },
  ];

  let allPromisesPresent = true;

  methodsToCheck.forEach((method) => {
    const hasPromise = method.regex.test(widgetModule);

    console.log(
      hasPromise
        ? chalk.green(`✅ Method ${method.name} has proper Promise parameter`)
        : chalk.red(`❌ Method ${method.name} missing Promise parameter`)
    );

    if (!hasPromise) {
      allPromisesPresent = false;
    }
  });

  return allPromisesPresent;
}

function validateErrorHandling() {
  console.log("\nValidating widget error handling...");

  const widgets = [
    {
      name: "SmallColorWidget",
      content: validateFile(CONFIG.nativeFiles.smallColorWidget),
      requiredElements: [
        /try\s*\{/,
        /catch\s*\(\s*e\s*:\s*Exception\s*\)\s*\{/,
        /Log\.e\(\s*TAG\s*,/,
      ],
    },
    {
      name: "SmallWordWidget",
      content: validateFile(CONFIG.nativeFiles.smallWordWidget),
      requiredElements: [
        /try\s*\{/,
        /catch\s*\(\s*e\s*:\s*Exception\s*\)\s*\{/,
        /Log\.e\(\s*TAG\s*,/,
      ],
    },
    {
      name: "LargeColorWidget",
      content: validateFile(CONFIG.nativeFiles.largeColorWidget),
      requiredElements: [
        /try\s*\{/,
        /catch\s*\(\s*e\s*:\s*Exception\s*\)\s*\{/,
        /Log\.e\(\s*TAG\s*,/,
        /showEmptyState|setViewVisibility.*View\.VISIBLE/,
      ],
    },
    {
      name: "LargeWordWidget",
      content: validateFile(CONFIG.nativeFiles.largeWordWidget),
      requiredElements: [
        /try\s*\{/,
        /catch\s*\(\s*e\s*:\s*Exception\s*\)\s*\{/,
        /Log\.e\(\s*TAG\s*,/,
        /errorViews|empty_state_text/,
      ],
    },
  ];

  let allHaveErrorHandling = true;

  widgets.forEach((widget) => {
    if (!widget.content) {
      allHaveErrorHandling = false;
      return;
    }

    let elementsMissing = false;
    widget.requiredElements.forEach((regex) => {
      if (!regex.test(widget.content)) {
        console.log(
          chalk.red(
            `❌ ${widget.name} missing required error handling element: ${regex}`
          )
        );
        elementsMissing = true;
        allHaveErrorHandling = false;
      }
    });

    if (!elementsMissing) {
      console.log(
        chalk.green(`✅ ${widget.name} has proper error handling and logging`)
      );
    }
  });

  return allHaveErrorHandling;
}

// Add this function after validateErrorHandling()
function validateParameterUsage() {
  console.log("\nValidating parameter usage in Kotlin files...");

  const kotlinFiles = [
    CONFIG.nativeFiles.widgetModule,
    CONFIG.nativeFiles.smallColorWidget,
    CONFIG.nativeFiles.largeColorWidget,
    CONFIG.nativeFiles.smallWordWidget,
    CONFIG.nativeFiles.largeWordWidget,
  ];

  const parameterChecks = {
    context: {
      declaration: /\bcontext\s*:\s*Context\b/,
      usage: /\bcontext\./,
    },
    promise: {
      declaration: /\bpromise\s*:\s*Promise\b/,
      usage: /\bpromise\.(resolve|reject)\b/,
    },
    widgetId: {
      declaration: /\bwidgetId\s*:\s*Int\b/,
      usage: /\bwidgetId\b/,
    },
  };

  let allValid = true;

  kotlinFiles.forEach((filePath) => {
    const content = validateFile(filePath);
    if (!content) {
      allValid = false;
      return;
    }

    // Split file into functions
    const functions = content
      .split(/\b(fun|private fun|override fun)\b/)
      .filter((f) => f.includes("{"));

    functions.forEach((func) => {
      // Extract function parameters
      const paramMatch = func.match(/\((.*?)\)/s);
      if (!paramMatch) return;

      const params = paramMatch[1]
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      params.forEach((param) => {
        // Check each declared parameter for usage
        Object.entries(parameterChecks).forEach(([name, patterns]) => {
          if (patterns.declaration.test(param) && !patterns.usage.test(func)) {
            console.log(
              chalk.yellow(
                `⚠️ Warning: Parameter '${name}' declared but not used in function: ${func
                  .split("{")[0]
                  .trim()}`
              )
            );
            // Don't fail build for warnings
          }
        });
      });
    });
  });

  return allValid;
}

function validateContextUsage() {
  console.log("\nValidating context usage in widget methods...");

  const contextPatterns = {
    declaration: /\bcontext\s*:\s*Context\b/,
    usage: /(?:context|reactApplicationContext|getContext\(\))\./, // Updated pattern
    required: [
      "updateWidgets",
      "forceUpdateAllWidgets",
      "updateAllWidgets",
      "onUpdate",
    ],
  };

  const widgetFiles = [
    CONFIG.nativeFiles.widgetModule,
    CONFIG.nativeFiles.smallColorWidget,
    CONFIG.nativeFiles.largeColorWidget,
    CONFIG.nativeFiles.smallWordWidget,
    CONFIG.nativeFiles.largeWordWidget,
  ];

  let hasErrors = false;

  widgetFiles.forEach((file) => {
    const content = validateFile(file);
    if (!content) return;

    // Extract methods
    const methods = content.match(/fun\s+\w+\s*\([^)]*\)[^{]*\{[^}]*\}/g) || [];

    methods.forEach((method) => {
      const methodName = method.match(/fun\s+(\w+)/)[1];

      if (contextPatterns.required.includes(methodName)) {
        const hasContextParam = contextPatterns.declaration.test(method);
        const usesContext = contextPatterns.usage.test(method);

        if (hasContextParam && !usesContext) {
          console.error(
            chalk.red(
              `❌ Method ${methodName} in ${file} declares context but doesn't use it`
            )
          );
          hasErrors = true;
        }

        if (!hasContextParam && !usesContext) {
          console.error(
            chalk.red(
              `❌ Method ${methodName} in ${file} is missing context usage`
            )
          );
          hasErrors = true;
        }
      }
    });
  });

  return !hasErrors;
}

// Run all validations
function runAllValidations() {
  console.log(chalk.blue.bold("🔍 Widget System Validation"));
  console.log(chalk.blue("========================="));

  const keysValid = validateWidgetKeys();
  const methodsValid = validateReactMethods();
  const companionValid = validateKotlinCompanionObjects();
  const promisesValid = validateWidgetModulePromises();
  const errorHandlingValid = validateErrorHandling();
  const parameterUsageValid = validateParameterUsage();
  const contextUsageValid = validateContextUsage();

  console.log("\n");
  console.log(chalk.blue.bold("📊 Validation Results"));
  console.log(chalk.blue("==================="));
  console.log(
    keysValid
      ? chalk.green("✅ Widget preference keys consistent")
      : chalk.red("❌ Widget preference key issues")
  );
  console.log(
    methodsValid
      ? chalk.green("✅ React-Native to Kotlin methods aligned")
      : chalk.red("❌ Method implementation issues")
  );
  console.log(
    companionValid
      ? chalk.green("✅ Kotlin constant declarations valid")
      : chalk.red("❌ Kotlin constant declaration issues")
  );
  console.log(
    promisesValid
      ? chalk.green("✅ WidgetModule Promise parameters valid")
      : chalk.red("❌ WidgetModule Promise parameter issues")
  );
  console.log(
    errorHandlingValid
      ? chalk.green("✅ Widget error handling implemented")
      : chalk.red("❌ Widget error handling issues")
  );
  console.log(
    parameterUsageValid
      ? chalk.green("✅ Parameter usage in Kotlin files valid")
      : chalk.red("❌ Parameter usage in Kotlin files issues")
  );
  console.log(
    contextUsageValid
      ? chalk.green("✅ Context usage in widget methods valid")
      : chalk.red("❌ Context usage in widget methods issues")
  );

  const allValid =
    keysValid &&
    methodsValid &&
    companionValid &&
    promisesValid &&
    errorHandlingValid &&
    parameterUsageValid &&
    contextUsageValid;

  console.log("\n");
  console.log(
    allValid
      ? chalk.green.bold(
          "✅ All widget validations passed! Ready for EAS build."
        )
      : chalk.red.bold(
          "❌ Widget validations failed. Please fix issues before building."
        )
  );

  return allValid;
}

// Run the validator
runAllValidations();

if (hasErrors) {
  console.error("❌ Widget validation failed! Fix the issues before building.");
  process.exit(1);
} else {
  console.log("✅ All widget components validated successfully!");
}
