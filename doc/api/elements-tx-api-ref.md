# Elements Core Utility 

## elements-tx - v0.14.1.0-1e1a2e5

### Usage:
```
    elements-tx [options] <hex-tx> [commands]    Update hex-encoded bitcoin transaction
    elements-tx [options] -create [commands]     Create hex-encoded bitcoin transaction
```

 
### Options:
```
    -?
        This help message

    -create
        Create new, empty TX.

    -json
        Select JSON output

    -txid
        Output only the hex-encoded transaction id of the resultant transaction.
```


### Chain selection options:
```
    -chain=<chain>
        Use the chain <chain> (default: elements). Allowed values: main, testnet, 
        regtest, custom

    -regtest
        Enter regression test mode, which uses a special chain in which blocks 
        can be solved instantly. This is intended for regression testing tools 
        and app development.
```


### Custom chain selection options (only for -chain=custom):
```
    -chainpetname=<name>
        Alternative name for custom chain (default: custom). This changes 
        the genesis block.
```


### Commands:
```
    delin=N
        Delete input N from TX

    delout=N
        Delete output N from TX

    in=TXID:VOUT(:SEQUENCE_NUMBER)
        Add input to TX

    blind=V1,B1,AB1,ID1:V2,B2,AB2,ID2:VB3...
        Transaction input blinds(4-tuple of value, blinding, asset blinding, 
        asset id required)

    locktime=N
        Set TX lock time to N

    nversion=N
        Set TX version to N

    outaddr=VALUE:ADDRESS
        Add address-based output to TX

    outpubkey=VALUE:PUBKEY[:FLAGS]
        Add pay-to-pubkey output to TX. Optionally add the "W" flag to produce a
        pay-to-witness-pubkey-hash output. Optionally add the "S" flag to
        wrap the output in a pay-to-script-hash.

    outdata=[VALUE:]DATA
        Add data-based output to TX

    outscript=VALUE:SCRIPT[:FLAGS]
        Add raw script output to TX. Optionally add the "W" flag to produce a
        pay-to-witness-script-hash output. Optionally add the "S" flag to
        wrap the output in a pay-to-script-hash.

    outmultisig=VALUE:REQUIRED:PUBKEYS:PUBKEY1:PUBKEY2:....[:FLAGS]
        Add Pay To n-of-m Multi-sig output to TX. n = REQUIRED, m = PUBKEYS.
        Optionally add the "W" flag to produce a
        pay-to-witness-script-hash output. Optionally add the "S" flag to
        wrap the output in a pay-to-script-hash.

    sign=SIGHASH-FLAGS
        Add zero or more signatures to transaction. This command requires JSON
        registers:prevtxs=JSON object, privatekeys=JSON object. See
        signrawtransaction docs for format of sighash flags, JSON
        objects.
```


### Register Commands:
```
    load=NAME:FILENAME
        Load JSON file FILENAME into register NAME

    set=NAME:JSON-STRING
        Set register NAME to given JSON-STRING
```
