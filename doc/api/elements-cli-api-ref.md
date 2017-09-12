# Elements Core RPC Client 

## elements-cli - v0.14.1.0-1e1a2e5

### Usage:
```
    elements-cli [options] <command> [params]                Send command to Elements Core
    elements-cli [options] -named <command> [name=value] ... Send command to Elements Core (with named arguments)
    elements-cli [options] help <command>                    Get help for a command
```


### Options:
```
    -?
        This help message
    
    -conf=<file>
        Specify configuration file (default: elements.conf)
    
    -datadir=<dir>
        Specify data directory
```
       
       
### Chain selection options:
```
    -chain=<chain>
        Use the chain <chain> (default: elements). Allowed values: main,
        testnet, regtest, custom
    
    -regtest
        Enter regression test mode, which uses a special chain in which blocks
        can be solved instantly. This is intended for regression testing
        tools and app development.
```


### Custom chain selection options (only for -chain=custom):
```
    -chainpetname=<name>
        Alternative name for custom chain (default: custom). This changes the
        genesis block.
    
    -named
        Pass named instead of positional arguments (default: false)
    
    -rpcconnect=<ip>
        Send commands to node running on <ip> (default: 127.0.0.1)
    
    -rpcport=<port>
        Connect to JSON-RPC on <port> (default: 8332)
    
    -rpcwait
        Wait for RPC server to start
    
    -rpcuser=<user>
        Username for JSON-RPC connections
    
    -rpcpassword=<pw>
        Password for JSON-RPC connections
    
    -rpcclienttimeout=<n>
        Timeout during HTTP requests (default: 900)
    
    -stdin
        Read extra arguments from standard input, one per line until EOF/Ctrl-D
        (recommended for sensitive information such as passphrases)
```
