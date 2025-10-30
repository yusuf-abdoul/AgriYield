# HashConnect v3 Testing Guide

## 🧪 Testing the HashConnect Integration

I've created a direct test component that follows the exact HashConnect v3 documentation pattern to help diagnose the connection issues.

### 1. **Get a Real WalletConnect Project ID**

The placeholder Project ID won't work. You need to:

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Sign up/Login
3. Create a new project
4. Copy the Project ID (it looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

### 2. **Update Your .env File**

Replace the test Project ID with your real one:

```bash
VITE_WC_PROJECT_ID=your_actual_project_id_here
```

### 3. **Test the Integration**

1. **Start the development server:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Open the app in your browser** (usually `http://localhost:5173`)

3. **Look for the "HashConnect v3 Direct Test" component** at the top of the page

4. **Check the status indicators:**
   - ✅ **State:** Should show "Disconnected" initially
   - ✅ **Initialized:** Should show "Yes" if successful
   - ✅ **Project ID:** Should show your actual Project ID
   - ❌ **Error:** Should show "None" if everything is working

### 4. **Test the Pairing Modal**

1. **Click "Open Pairing Modal"** button
2. **A modal should appear** with:
   - QR code for mobile scanning
   - Pairing string for manual entry
   - Close button

3. **Test with HashPack:**
   - **Mobile:** Open HashPack app → Scan QR code → Approve connection
   - **Extension:** If you have HashPack browser extension, it should auto-popup

### 5. **Debug Information**

The test component shows:
- **Connection State:** Real-time status updates
- **Pairing Data:** Account information when connected
- **Console Logs:** Detailed debugging information

### 6. **Expected Behavior**

**✅ Working Correctly:**
- Modal opens when clicking "Open Pairing Modal"
- QR code and pairing string are displayed
- HashPack mobile app can scan and connect
- Connection state changes to "Connected" or "Paired"
- Account information appears in pairing data

**❌ Common Issues:**

1. **"VITE_WC_PROJECT_ID is missing"**
   - Solution: Set the environment variable in `.env` file

2. **"HashConnect not initialized"**
   - Check browser console for initialization errors
   - Verify Project ID is valid

3. **Modal doesn't open**
   - Check browser console for errors
   - Verify HashConnect instance is created successfully

4. **QR code doesn't appear**
   - Check if WalletConnect is properly initialized
   - Verify Project ID is correct

### 7. **Browser Console Debugging**

Open browser developer tools (F12) and check the Console tab for:

```
Creating HashConnect with project ID: your_project_id
Initializing HashConnect...
HashConnect initialized successfully
Opening pairing modal...
Pairing modal opened
```

If you see errors, they'll help identify the issue.

### 8. **Next Steps After Testing**

Once the direct test works:

1. **Remove the test component** from Home.jsx
2. **Fix the main WalletContext** based on what you learned
3. **Test the full integration** through the Navbar wallet button

### 9. **Alternative Testing**

If the direct test doesn't work, try:

1. **Check HashConnect version:** Should be v3.0.13 or later
2. **Clear browser cache** and restart dev server
3. **Try different browser** (Chrome, Firefox, Edge)
4. **Check if WalletConnect service is accessible** from your network

## 🔧 Quick Fixes

### If Modal Still Doesn't Open:

1. **Check the exact error** in browser console
2. **Verify Project ID format** (should be 32+ characters)
3. **Try with a fresh WalletConnect project**
4. **Check if any browser extensions are blocking WalletConnect**

### If QR Code Doesn't Load:

1. **Check network connectivity**
2. **Try disabling ad blockers**
3. **Verify WalletConnect service is accessible**

Let me know what you see in the test component and browser console, and I can help debug further! 🚀

