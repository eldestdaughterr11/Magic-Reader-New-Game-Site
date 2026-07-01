/**
 * ============================================================
 * RESET / CREATE ADMIN ACCOUNT — One-time setup script
 * ============================================================
 * HOW TO USE:
 * 1. Download your Firebase Service Account Key:
 *    - Go to: https://console.firebase.google.com
 *    - Click ⚙️ Project Settings → "Service accounts" tab
 *    - Click "Generate new private key" → confirm → save file
 *    - Rename it to: serviceAccountKey.json
 *    - Put it in: C:\xampp\htdocs\New Magic Reader website\
 *
 * 2. Open a terminal in this folder and run:
 *    node create-admin.js
 * ============================================================
 */

const admin = require("./functions/node_modules/firebase-admin");
const path  = require("path");
const fs    = require("fs");

// ─── NEW LOGIN CREDENTIALS (change if you want) ──────────────
const ADMIN_EMAIL    = "admin@example.com";   // existing email
const ADMIN_PASSWORD = "Admin@12345";          // ← new password
const ADMIN_NAME     = "Admin";
// ─────────────────────────────────────────────────────────────

const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

if (!fs.existsSync(serviceAccountPath)) {
  console.error("\n❌ serviceAccountKey.json not found!");
  console.error("\n📋 HOW TO GET IT:");
  console.error("   1. Go to https://console.firebase.google.com");
  console.error("   2. Click ⚙️ (top left, beside 'Project Overview')");
  console.error("   3. Click 'Project Settings'");
  console.error("   4. Click 'Service accounts' tab");
  console.error("   5. Click 'Generate new private key' → Download");
  console.error("   6. Rename the file to: serviceAccountKey.json");
  console.error("   7. Move it here: C:\\xampp\\htdocs\\New Magic Reader website\\");
  console.error("   8. Run this script again: node create-admin.js\n");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
});

const db   = admin.firestore();
const auth = admin.auth();

async function setupAdmin() {
  console.log("\n🔧 Setting up admin account...\n");

  try {
    let userRecord;

    try {
      // Try to get existing user
      userRecord = await auth.getUserByEmail(ADMIN_EMAIL);
      console.log(`✅ Found existing user: ${userRecord.uid}`);

      // Reset the password
      await auth.updateUser(userRecord.uid, {
        password: ADMIN_PASSWORD,
        displayName: ADMIN_NAME,
      });
      console.log(`✅ Password has been reset!`);

    } catch (err) {
      if (err.code === "auth/user-not-found") {
        // Create new user if doesn't exist
        userRecord = await auth.createUser({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          displayName: ADMIN_NAME,
        });
        console.log(`✅ New user created: ${userRecord.uid}`);
      } else {
        throw err;
      }
    }

    // Create or overwrite Firestore document with admin role
    await db.collection("users").doc(userRecord.uid).set({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      role: "admin",
      isBanned: false,
      createdAt: new Date().toISOString(),
    });

    console.log(`✅ Firestore document set with role: admin`);
    console.log("\n════════════════════════════════════════════");
    console.log("🎉 DONE! You can now log in with:");
    console.log(`   📧 Email    : ${ADMIN_EMAIL}`);
    console.log(`   🔑 Password : ${ADMIN_PASSWORD}`);
    console.log("════════════════════════════════════════════\n");

  } catch (err) {
    console.error("\n❌ Error:", err.message, "\n");
  } finally {
    process.exit(0);
  }
}

setupAdmin();
