#!/usr/bin/env python3
"""
CP Plus DVR (CP-UVR-0401E1V-I) Diagnostic & Stream Test Script
Tests connectivity, account lockout status, RTSP feeds, snapshots, and ONVIF.
"""

import sys
import socket
import subprocess
import json
import re

DVR_IP = "192.168.1.240"
DVR_PORT_HTTP = 80
DVR_PORT_HTTPS = 443
DVR_PORT_RTSP = 554
USERNAME = "admin"
PASSWORD = "14789"

def log(msg, symbol="ℹ️"):
    print(f"{symbol} {msg}")

def check_ping():
    log(f"Testing ICMP Ping to {DVR_IP}...", "📡")
    res = subprocess.run(["ping", "-c", "2", "-W", "2", DVR_IP], capture_output=True, text=True)
    if res.returncode == 0:
        log("Ping successful (DVR is online)", "✅")
        return True
    else:
        log("Ping failed! DVR is unreachable on network.", "❌")
        return False

def check_tcp_port(port, service_name):
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(3)
        s.connect((DVR_IP, port))
        s.close()
        log(f"Port {port} ({service_name}): OPEN", "✅")
        return True
    except Exception as e:
        log(f"Port {port} ({service_name}): CLOSED/UNREACHABLE ({e})", "❌")
        return False

def check_lockout_and_auth():
    log("Checking DVR Auth & Account Lockout status via HTTP API...", "🔍")
    cmd = [
        "curl", "-k", "-s", "--digest", "-u", f"{USERNAME}:{PASSWORD}",
        f"https://{DVR_IP}/cgi-bin/magicBox.cgi?action=getSystemInfo"
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    out = res.stdout.strip()
    
    if "ErrorCode" in out and "268632081" in out:
        m = re.search(r'"RmLock"\s*:\s*(\d+)', out)
        sec = int(m.group(1)) if m else 0
        mins = sec // 60
        rem_sec = sec % 60
        log(f"ACCOUNT LOCKED by DVR anti-brute-force policy!", "⚠️")
        log(f"Remaining lockout time: {mins}m {rem_sec}s ({sec} seconds)", "⏳")
        log("Quick fix: Reboot or power-cycle the physical DVR to clear the lock instantly.", "💡")
        return False
    elif "appType" in out or "version" in out:
        log("Authentication successful! Account is unlocked.", "🎉")
        print("DVR System Details:")
        for line in out.splitlines():
            print(f"  {line}")
        return True
    else:
        log(f"Response: {out}", "ℹ️")
        return False

def test_rtsp_channel(channel=1, subtype=0):
    url = f"rtsp://{USERNAME}:{PASSWORD}@{DVR_IP}:{DVR_PORT_RTSP}/cam/realmonitor?channel={channel}&subtype={subtype}"
    log(f"Testing RTSP Channel {channel} (subtype={subtype})...", "🎥")
    cmd = [
        "ffprobe", "-v", "error",
        "-rtsp_transport", "tcp",
        "-select_streams", "v:0",
        "-show_entries", "stream=codec_name,width,height,avg_frame_rate",
        "-of", "default=noprint_wrappers=1",
        url
    ]
    try:
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
        if res.returncode == 0:
            log(f"Stream OK: {res.stdout.strip().replace(chr(10), ', ')}", "✅")
            return True
        else:
            log(f"ffprobe failed: {res.stderr.strip()}", "❌")
            return False
    except subprocess.TimeoutExpired:
        log("Stream probe timed out (check if account is locked).", "⏱️")
        return False

def test_snapshot(channel=1):
    log(f"Testing snapshot extraction from Channel {channel}...", "📸")
    out_file = f"/tmp/cam{channel}_snapshot.jpg"
    cmd = [
        "curl", "-k", "-s", "--digest", "-u", f"{USERNAME}:{PASSWORD}",
        f"https://{DVR_IP}/cgi-bin/snapshot.cgi?channel={channel}",
        "-o", out_file
    ]
    subprocess.run(cmd)
    try:
        size = subprocess.run(["stat", "-c", "%s", out_file], capture_output=True, text=True).stdout.strip()
        if int(size) > 1000:
            log(f"Snapshot saved to {out_file} ({size} bytes)", "✅")
            return True
        else:
            log(f"Snapshot returned empty or error ({size} bytes)", "❌")
            return False
    except Exception as e:
        log(f"Error checking snapshot file: {e}", "❌")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("CP PLUS DVR (CP-UVR-0401E1V-I) DIAGNOSTIC TOOL")
    print("=" * 60)
    
    if not check_ping():
        sys.exit(1)
        
    print("\n--- Port Checks ---")
    check_tcp_port(DVR_PORT_HTTP, "HTTP / ONVIF")
    check_tcp_port(DVR_PORT_HTTPS, "HTTPS / Web UI")
    check_tcp_port(DVR_PORT_RTSP, "RTSP Video Stream")
    check_tcp_port(25001, "CP Plus Media Port")
    
    print("\n--- Auth & Lock Status ---")
    unlocked = check_lockout_and_auth()
    
    if unlocked:
        print("\n--- RTSP Stream Probe ---")
        for ch in range(1, 5):
            test_rtsp_channel(ch, subtype=0)
            
        print("\n--- Snapshot Probe ---")
        test_snapshot(1)
    else:
        print("\nSkipping active RTSP/Snapshot tests until account lockout clears.")
        print("To clear immediately: Power cycle the DVR.")
