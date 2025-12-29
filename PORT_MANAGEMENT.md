# Port Management Guide

## Quick Commands

### Kill Process on Port 3000
```powershell
.\kill-port-3000.ps1
```

### Start Development Server (Auto-kills port)
```powershell
.\start-dev.ps1
```

---

## Manual Port Management

### Check What's Running on Port 3000
```powershell
netstat -ano | findstr :3000
```

Output example:
```
TCP    0.0.0.0:3000    0.0.0.0:0    LISTENING    1204
```
The last number (1204) is the Process ID (PID).

### Kill Specific Process by PID
```powershell
# Replace 1204 with your actual PID
Stop-Process -Id 1204 -Force
```

### Kill All Node Processes
```powershell
Stop-Process -Name "node" -Force
```

---

## Common Scenarios

### Scenario 1: "Port 3000 Already in Use"

**Quick Fix:**
```powershell
.\kill-port-3000.ps1
npm run dev
```

**Or use the automated script:**
```powershell
.\start-dev.ps1
```

### Scenario 2: Multiple Node Processes Running

**Check all node processes:**
```powershell
Get-Process node
```

**Kill all node processes:**
```powershell
Stop-Process -Name "node" -Force
```

### Scenario 3: Use Different Port

If you want to keep the current process and use a different port:

```powershell
npm run dev -- -p 3001
```

Then access at: http://localhost:3001

---

## Port Management Scripts

### 1. kill-port-3000.ps1
- Finds process on port 3000
- Kills it
- Verifies it's free

**Usage:**
```powershell
.\kill-port-3000.ps1
```

### 2. start-dev.ps1
- Automatically kills port 3000
- Stops all node processes
- Cleans .next cache
- Starts fresh dev server

**Usage:**
```powershell
.\start-dev.ps1
```

---

## Troubleshooting

### Issue: "Access Denied" or "Cannot Kill Process"

**Solution:** Run PowerShell as Administrator

1. Right-click PowerShell
2. Select "Run as Administrator"
3. Navigate to project folder
4. Run the kill script

### Issue: Port Still in Use After Killing

**Solution:**
```powershell
# Wait a few seconds
Start-Sleep -Seconds 3

# Check again
netstat -ano | findstr :3000

# If still there, restart your computer (rare case)
```

### Issue: Don't Know What Process is Using Port 3000

**Find the process name:**
```powershell
# Get PID from netstat
$processId = (netstat -ano | findstr :3000 | findstr LISTENING | Select-Object -First 1) -split '\s+' | Select-Object -Last 1

# Get process details
Get-Process -Id $processId
```

---

## Prevention Tips

1. **Always stop dev server properly**
   - Use Ctrl+C in terminal
   - Don't just close the terminal window

2. **Use the start-dev.ps1 script**
   - It automatically handles cleanup

3. **Check before starting**
   ```powershell
   netstat -ano | findstr :3000
   ```

4. **Set up a different default port** (optional)
   
   Add to `package.json`:
   ```json
   "scripts": {
     "dev": "next dev -p 3001",
   }
   ```

---

## Alternative Ports

If port 3000 conflicts with other applications:

### Common Next.js Ports:
- 3000 (default)
- 3001
- 3002
- 4000
- 5000

### Change Default Port:

**Option 1: Command line**
```powershell
npm run dev -- -p 3001
```

**Option 2: package.json**
```json
"dev": "next dev -p 3001"
```

**Option 3: Environment variable**
Create `.env.local`:
```env
PORT=3001
```

---

## Quick Reference Table

| Command | Purpose |
|---------|---------|
| `.\kill-port-3000.ps1` | Kill port 3000 |
| `.\start-dev.ps1` | Clean start with auto-kill |
| `npm run dev` | Standard dev server |
| `npm run dev -- -p 3001` | Use port 3001 |
| `netstat -ano \| findstr :3000` | Check port 3000 |
| `Stop-Process -Name "node" -Force` | Kill all node |
| `Get-Process node` | List node processes |

---

## Emergency Recovery

If nothing works:

```powershell
# 1. Kill everything
Stop-Process -Name "node" -Force

# 2. Wait
Start-Sleep -Seconds 5

# 3. Verify
netstat -ano | findstr :3000

# 4. If still stuck, restart computer
Restart-Computer
```

---

**Last Updated:** December 19, 2025
