const fs = require("fs");
const path = require("path");

// Validate React Native side - Check for file existence
const requiredFiles = [
  "src/utils/widgetHelpers.ts",
  "src/screens/widget/WidgetScreen.tsx",
  "src/screens/widget/WidgetConfigScreen.tsx",
];

// Check for required functions in widgetHelpers.ts
const requiredHelperFunctions = [
  "updateUserColorMixData",
  "updateUserMoodPercentages",
  "updateUserWordCloud",
  "updateFriendColorMood",
  "updateFriendWordCloud",
  "refreshAllWidgets",
];

// Check for method calls in widget modules
const methodCallChecks = [
  {
    file: "src/utils/widgetHelpers.ts",
    patterns: [
      "WidgetModule.updateUserColorMixData",
      "WidgetModule.updateUserMoodPercentages",
      "WidgetModule.updateUserWordCloud",
      "WidgetModule.updateFriendColorMood",
      "WidgetModule.forceUpdateAllWidgets",
    ],
  },
  {
    file: "src/screens/widget/WidgetScreen.tsx",
    patterns: [
      "syncWidgetsWithCurrentMood",
      "WidgetModule.forceUpdateAllWidgets",
    ],
  },
];

// Check for error handling in widget functions
const errorHandlingChecks = [
  {
    file: "src/utils/widgetHelpers.ts",
    pattern: "try {",
    count: 5, // At least 5 try/catch blocks for error handling
  },
];

// Check for JSON.stringify usage
const jsonStringifyChecks = [
  {
    file: "src/utils/widgetHelpers.ts",
    pattern: "JSON.stringify",
    count: 5, // At least 5 usages to properly format data for native
  },
];

// Run all validations
console.log("Validating Widget Integration...\n");
let hasErrors = false;

// Check if files exist
console.log("Checking required files:");
requiredFiles.forEach((file) => {
  const filePath = path.resolve(file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ Found ${file}`);
  } else {
    console.error(`❌ Missing required file: ${file}`);
    hasErrors = true;
  }
});

// Check for required functions
console.log("\nChecking for required helper functions:");
if (fs.existsSync(path.resolve("src/utils/widgetHelpers.ts"))) {
  const content = fs.readFileSync(
    path.resolve("src/utils/widgetHelpers.ts"),
    "utf8"
  );
  requiredHelperFunctions.forEach((func) => {
    if (content.includes(`export const ${func}`)) {
      console.log(`✅ Found function ${func}`);
    } else {
      console.error(`❌ Missing required function: ${func}`);
      hasErrors = true;
    }
  });
} else {
  console.error("❌ Cannot check functions: widgetHelpers.ts not found");
  hasErrors = true;
}

// Check for method calls
console.log("\nChecking for method calls:");
methodCallChecks.forEach(({ file, patterns }) => {
  if (fs.existsSync(path.resolve(file))) {
    const content = fs.readFileSync(path.resolve(file), "utf8");
    patterns.forEach((pattern) => {
      if (content.includes(pattern)) {
        console.log(`✅ Found ${pattern} in ${file}`);
      } else {
        console.error(`❌ Missing required call: ${pattern} in ${file}`);
        hasErrors = true;
      }
    });
  } else {
    console.error(`❌ Cannot check method calls: ${file} not found`);
    hasErrors = true;
  }
});

// Check for error handling
console.log("\nChecking for error handling:");
errorHandlingChecks.forEach(({ file, pattern, count }) => {
  if (fs.existsSync(path.resolve(file))) {
    const content = fs.readFileSync(path.resolve(file), "utf8");
    const matches = content.match(new RegExp(pattern, "g"));
    const actual = matches ? matches.length : 0;
    if (actual >= count) {
      console.log(
        `✅ Found sufficient error handling in ${file}: ${actual} occurrences`
      );
    } else {
      console.error(
        `❌ Insufficient error handling in ${file}: found ${actual}, expected ${count}`
      );
      hasErrors = true;
    }
  } else {
    console.error(`❌ Cannot check error handling: ${file} not found`);
    hasErrors = true;
  }
});

// Check for JSON.stringify usage
console.log("\nChecking for proper data formatting:");
jsonStringifyChecks.forEach(({ file, pattern, count }) => {
  if (fs.existsSync(path.resolve(file))) {
    const content = fs.readFileSync(path.resolve(file), "utf8");
    const matches = content.match(new RegExp(pattern, "g"));
    const actual = matches ? matches.length : 0;
    if (actual >= count) {
      console.log(
        `✅ Found sufficient data formatting in ${file}: ${actual} occurrences`
      );
    } else {
      console.error(
        `❌ Insufficient data formatting in ${file}: found ${actual}, expected ${count}`
      );
      hasErrors = true;
    }
  } else {
    console.error(`❌ Cannot check data formatting: ${file} not found`);
    hasErrors = true;
  }
});

// Final result
if (hasErrors) {
  console.error(
    "\n❌ Widget integration validation failed. Please fix the issues above."
  );
  process.exit(1);
} else {
  console.log("\n✅ Widget integration validation passed!");
}
