# Network Addresses Explained Simply

## Physical Address (MAC)
The MAC address is like your device's permanent social security number. It's burned into your network card.

- Format: Six pairs of hex numbers (Example: `BC:0F:F3:CD:8B:FE`)
- First half (`BC:0F:F3`) tells you who made the card (like Dell)
- Second half (`CD:8B:FE`) is the unique serial number
- Can be found using command: `getmac` in Windows

Each pair in hex (like BC) can be converted:

* BC = 188 in decimal
* 0F = 15 in decimal
* F3 = 243 in decimal

## IP Address (IPv4)
Your logical network address - like your house address. Can change when you move networks.

### Private IP Ranges
These are for internal networks only (can't be used on internet):
- `10.x.x.x` - Big networks (lots of computers)
- `172.16.x.x` to `172.31.x.x` - Medium networks
- `192.168.x.x` - Small networks (home/small office)

### Public IP Addresses
- Everything else! Like `8.8.8.8` (Google) or `142.250.x.x`
- Used on the public internet
- Must be unique worldwide

## Subnet Mask
Tells your computer which part of the IP address is for the network and which is for hosts.

Example:

* IP Address:  192.168.1.100
* Subnet Mask: 255.255.255.0
* |Network-|Host

Common subnet masks:
- `255.255.255.0` = 254 hosts allowed
- `255.255.254.0` = 510 hosts allowed
- `255.255.0.0` = 65,534 hosts allowed

Important rule: Subnet masks must be continuous 1s followed by continuous 0s in binary:

```bash
Good: 11111111.11111111.11111110.00000000
Bad:  11111111.10101010.11111111.00000000
```

## Complete Network Configuration
A network interface needs all these settings:
1. MAC Address (built-in): `BC:0F:F3:CD:8B:FE`
2. IP Address: `192.168.1.100`
3. Subnet Mask: `255.255.255.0`
4. Default Gateway: `192.168.1.1`
5. DNS Server: `8.8.8.8`

## Simple Python Example to Show Network Info
```python
import socket
import uuid

def get_network_info():
    # Get hostname
    hostname = socket.gethostname()
    
    # Get IP address
    ip_address = socket.gethostbyname(hostname)
    
    # Get MAC address (one way to do it)
    mac = ':'.join(['{:02x}'.format((uuid.getnode() >> elements) & 0xff)
                   for elements in range(0,8*6,8)][::-1])
    
    print(f"Hostname: {hostname}")
    print(f"IP Address: {ip_address}")
    print(f"MAC Address: {mac}")

get_network_info()
```

### Quick Tips

MAC addresses are for local network communication
IP addresses are for routing across networks
Subnet masks help determine what's local vs remote
Private IPs can be reused in different networks
Public IPs must be unique worldwide

### What Happens in Communication?
When your computer sends data:
1. Uses IP address to determine if destination is local or remote
2. If local: Uses MAC address to deliver directly
3. If remote: Sends to gateway's MAC address to route outside
4. Gateway uses IP address to route to final destination

Remember: Every device needs both MAC and IP address to communicate on modern networks. MAC is for the physical connection, IP is for logical routing.

## Network Communication Process

### Traditional NIC Operation
When a message arrives:
1. NIC receives data
2. Interrupts CPU
3. CPU has to:
  - Process headers
  - Move data through kernel
  - Copy data multiple times
  - Finally deliver to application

Example packet structure:

```ini
[Ethernet Frame]
[IP Header - 20 bytes]
Version, TTL, Checksums, etc.
Source IP: 192.168.1.100
Dest IP: 192.168.1.200
[TCP Header - 20 bytes]
Source Port: 12345
Dest Port: 80
[Data]
Your actual message
```

### RDMA (Remote Direct Memory Access)
RDMA bypasses many traditional steps:
1. RNIC (RDMA NIC) still processes network headers
2. But then puts data DIRECTLY in application memory
3. No CPU interrupts needed
4. No kernel involvement
5. No extra copying

Think of it like:
- Regular NIC = Mail needs to go through many office workers
- RDMA = Delivery person has key to put package directly where it needs to go

### TTL (Time To Live)
A safety counter in IP packets:
- Starts at value like 64
- Each router reduces it by 1
- When it hits 0, packet is dropped
- Prevents infinite loops

Example:

Start → TTL=64
Router 1 → TTL=63
Router 2 → TTL=62
...
TTL=0 → Packet dropped

### Data Link Layer (Layer 2)
The "local delivery service" of networking:
- Handles physical addressing (MAC)
- Creates frames from raw data
- Manages local delivery
- Handles error checking

Like a postal carrier:
- Physical Layer = The roads
- Data Link = Rules for local delivery
- Frames = Envelopes with local addresses

### Network Address Relationships
Example of how addresses work together:
```python
# Simple network packet structure
packet = {
    "ethernet": {
        "source_mac": "BC:0F:F3:CD:8B:FE",
        "dest_mac": "AA:BB:CC:DD:EE:FF",
    },
    "ip": {
        "source": "192.168.1.100",
        "dest": "192.168.1.200",
        "ttl": 64
    },
    "tcp": {
        "source_port": 12345,
        "dest_port": 80
    },
    "data": "Hello, Network!"
}
```

### Why Multiple Addresses?
Each serves a purpose:

- MAC Address: Physical delivery on local network
- IP Address: Logical routing across networks
- Ports: Identifying specific applications
- Subnet Mask: Defining network boundaries

Like a complete mailing system:

- MAC = Building specific delivery instructions
- IP = Street address
- Subnet = Zip code (defines neighborhood)
- Ports = Apartment numbers