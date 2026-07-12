import os, sys
f = os.path.expandvars(sys.argv[1])
size = os.path.getsize(f)
print("Size:", size)
with open(f,"rb") as fp:
    d = fp.read()
print("First 4:", d[:4])
print("Last 200:", d[-200:])
cnt1 = d.count(b"PK\x03\x04")
cnt2 = d.count(b"PK\x01\x02")
print("Local headers:", cnt1)
print("Central dirs:", cnt2)
print("Has EOCD:", d[-22:-20] == b"PK\x05\x06")
