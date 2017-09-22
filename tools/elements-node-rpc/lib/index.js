var jsonrpc = require('./jsonrpc')

class Client {
    constructor(opts) {
        this.mClient = new jsonrpc.Client(opts);
    }

    //=============================================================================================
    // GENERAL
    //=============================================================================================
    //
    // Print all commands, or print help for a specified command.
    // 
    // Arguments:
    //   1. command    (string, optional) The command to print the help for.
    //
    //=============================================================================================
    printHelp(command) {
        this.help(command).then((result) => {
            console.info(result);
        });
    }

    //=============================================================================================
    // GENERAL
    //=============================================================================================
    //
    // List all commands, or get help for a specified command.
    // 
    // Arguments:
    //   1. command    (string, optional) The command to get help on
    // 
    // Result:
    //   text    (string) The help text
    //
    //=============================================================================================
    help(command) {
        // return the help for all available commands
        if (command == null)
            return this.mClient.call("help");

        // return the help info for the specified command
        if (typeof(command) === "string")
            return this.mClient.call("help", [command]);
        
        // command must be a string
        throw new Error(`The command '${command}' is invalid; must be a string.`);
    }

    //=============================================================================================
    // GENERAL
    //=============================================================================================
    //
    // Stop Elements server.
    //
    //=============================================================================================
    stop() {
        return this.mClient.call("stop");
    }

    //=============================================================================================
    // GENERAL
    //=============================================================================================
    //
    // DEPRECATED. Returns an object containing various state info.
    // 
    // Arguments:
    //   1. assetlabel    (string, optional) Hex asset id or asset label for balance. "*" retrieves 
    //                                       all known asset balances.
    // 
    // Result:
    //   {
    //     "version": xxxxx,           (numeric) the server version
    //     "protocolversion": xxxxx,   (numeric) the protocol version
    //     "walletversion": xxxxx,     (numeric) the wallet version
    //     "balance": xxxxxxx,         (numeric) the total bitcoin balance of the wallet
    //     "blocks": xxxxxx,           (numeric) the current number of blocks processed in the server
    //     "timeoffset": xxxxx,        (numeric) the time offset
    //     "connections": xxxxx,       (numeric) the number of connections
    //     "proxy": "host:port",       (string, optional) the proxy used by the server
    //     "difficulty": xxxxxx,       (numeric) the current difficulty
    //     "testnet": true|false,      (boolean) if the server is using testnet or not
    //     "keypoololdest": xxxxxx,    (numeric) the timestamp (seconds since Unix epoch) of the oldest
    //                                           pre-generated key in the key pool
    //     "keypoolsize": xxxx,        (numeric) how many new keys are pre-generated
    //     "unlocked_until": ttt,      (numeric) the timestamp in seconds since epoch (midnight Jan 1 1970 GMT) 
    //                                           that the wallet is unlocked for transfers, or 0 if the wallet 
    //                                           is locked
    //     "paytxfee": x.xxxx,         (numeric) the transaction fee set in BTC/kB
    //     "relayfee": x.xxxx,         (numeric) minimum relay fee for non-free transactions in BTC/kB
    //     "errors": "..."             (string) any error messages
    //   }
    //
    //=============================================================================================
    getInfo() {
        return this.mClient.call("getinfo");
    }

    //=============================================================================================
    // GENERAL
    //=============================================================================================
    //
    // Returns an object containing information about memory usage.
    // 
    // Result:
    //   {
    //     "locked": {               (json object) Information about locked memory manager
    //       "used": xxxxx,          (numeric) Number of bytes used
    //       "free": xxxxx,          (numeric) Number of bytes available in current arenas
    //       "total": xxxxxxx,       (numeric) Total number of bytes managed
    //       "locked": xxxxxx,       (numeric) Amount of bytes that succeeded locking. If this number 
    //                                         is smaller than total, locking pages failed at some 
    //                                         point and key data could be swapped to disk.
    //       "chunks_used": xxxxx,   (numeric) Number allocated chunks
    //       "chunks_free": xxxxx,   (numeric) Number unused chunks
    //     }
    //   }
    //
    //=============================================================================================
    getMemoryInfo() {
        return this.mClient.call("getmemoryinfo");
    }


    // --------------------------------------------------------------------------------------------
    // BLOCKCHAIN
    // --------------------------------------------------------------------------------------------
    //
    // Returns the hash of the best (tip) block in the longest blockchain.
    //
    // Result:
    //   "hex"    (string) the block hash hex encoded
    //
    // --------------------------------------------------------------------------------------------
    getBestBlockHash() {
        return this.mClient.call("getbestblockhash");
    }


    // --------------------------------------------------------------------------------------------
    // BLOCKCHAIN
    // --------------------------------------------------------------------------------------------
    //
    // If verbose is false, returns a string that is serialized, hex-encoded data for block 'hash'.
    // If verbose is true, returns an Object with information about block <hash>.
    // 
    // Arguments:
    //   1. blockhash    (string, required) The block hash
    //   2. verbose      (boolean, optional, default=true) true for a json object, false for the hex encoded data
    // 
    // Result(for verbose = true):
    //   {
    //     "hash" : "hash",              (string) the block hash (same as provided)
    //     "confirmations" : n,          (numeric) The number of confirmations, or - 1 if the block is not on the main chain
    //     "size" : n,                   (numeric) The block size
    //     "strippedsize" : n,           (numeric) The block size excluding witness data
    //     "weight" : n                  (numeric) The block weight as defined in BIP 141
    //     "height" : n,                 (numeric) The block height or index
    //     "version" : n,                (numeric) The block version
    //     "versionHex" : "00000000",    (string) The block version formatted in hexadecimal
    //     "merkleroot" : "xxxx",        (string) The merkle root
    //     "tx" : [                      (array of string) The transaction ids
    //       "transactionid"             (string) The transaction id
    //       , ...
    //     ],
    //     "time" : ttt,                 (numeric) The block time in seconds since epoch (Jan 1 1970 GMT)
    //     "mediantime" : ttt,           (numeric) The median block time in seconds since epoch (Jan 1 1970 GMT)
    //     "nonce" : n,                  (numeric) The nonce
    //     "bits" : "1d00ffff",          (string) The bits
    //     "difficulty" : x.xxx,         (numeric) The difficulty
    //     "chainwork" : "xxxx",         (string) Expected number of hashes required to produce the chain up to this block (in hex)
    //     "previousblockhash" : "hash", (string) The hash of the previous block
    //     "nextblockhash" : "hash"      (string) The hash of the next block
    //   }
    // 
    // Result(for verbose= false):
    //   "data"    (string) A string that is serialized, hex - encoded data for block 'hash'.
    //
    // --------------------------------------------------------------------------------------------
    getBlock(blockHash, verbose) {
        var params = [blockHash];

        if (verbose != undefined)
            params.push(verbose);

        return this.mClient.call("getblock", params);
    }

    // --------------------------------------------------------------------------------------------
    // BLOCKCHAIN
    // --------------------------------------------------------------------------------------------
    //
    // Returns an object containing various state info regarding blockchain processing.
    //
    // Result:
    //   {
    //     "chain": "xxxx",              (string) current network name as defined in BIP70 (main, test, regtest)
    //     "blocks": xxxxxx,             (numeric) the current number of blocks processed in the server
    //     "headers": xxxxxx,            (numeric) the current number of headers we have validated
    //     "bestblockhash": "...",       (string) the hash of the currently best block
    //     "difficulty": xxxxxx,         (numeric) the current difficulty
    //     "mediantime": xxxxxx,         (numeric) median time for the current best block
    //     "verificationprogress": xxxx, (numeric) estimate of verification progress [0..1]
    //     "chainwork": "xxxx"           (string) total amount of work in active chain, in hexadecimal
    //     "pruned": xx,                 (boolean) if the blocks are subject to pruning
    //     "pruneheight": xxxxxx,        (numeric) lowest-height complete block stored
    //     "softforks": [                (array) status of softforks in progress
    //        {
    //           "id": "xxxx",           (string) name of softfork
    //           "version": xx,          (numeric) block version
    //           "reject": {             (object) progress toward rejecting pre-softfork blocks
    //              "status": xx,        (boolean) true if threshold reached
    //           },
    //        }, ...
    //     ],
    //     "bip9_softforks": {           (object) status of BIP9 softforks in progress
    //        "xxxx" : {                 (string) name of the softfork
    //           "status": "xxxx",       (string) one of "defined", "started", "locked_in", "active", "failed"
    //           "bit": xx,              (numeric) the bit (0-28) in the block version field used to signal this softfork (only for "started" status)
    //           "startTime": xx,        (numeric) the minimum median time past of a block at which the bit gains its meaning
    //           "timeout": xx,          (numeric) the median time past of a block at which the deployment is considered failed if not yet locked in
    //           "since": xx             (numeric) height of the first block to which the status applies
    //        }
    //     }
    //   }
    //
    // --------------------------------------------------------------------------------------------
    getBlockChainInfo() {
        return this.mClient.call("getblockchaininfo");
    }

    // --------------------------------------------------------------------------------------------
    // BLOCKCHAIN
    // --------------------------------------------------------------------------------------------
    //
    // Returns the number of blocks in the longest blockchain.
    // 
    // Result:
    //   n    (numeric) The current block count
    //
    // --------------------------------------------------------------------------------------------
    getBlockCount() {
        return this.mClient.call("getblockcount");
    }

    // --------------------------------------------------------------------------------------------
    // BLOCKCHAIN
    // --------------------------------------------------------------------------------------------
    // Returns hash of block in best-block-chain at height provided.
    // 
    // Arguments:
    //   1. height    (numeric, required) The height index
    // 
    // Result:
    //   "hash"    (string) The block hash
    // --------------------------------------------------------------------------------------------
    getBlockHash(height) {
        return this.mClient.call("getblockhash", [height]);
    }

    // --------------------------------------------------------------------------------------------
    // BLOCKCHAIN
    // --------------------------------------------------------------------------------------------
    //
    // If verbose is false, returns a string that is serialized, hex-encoded data for blockheader 'hash'.
    // If verbose is true, returns an Object with information about blockheader <hash>.
    // 
    // Arguments:
    //   1. "hash"     (string, required) The block hash
    //   2. verbose    (boolean, optional, default=true) true for a json object, false for the hex encoded data
    // 
    // Result (for verbose = true):
    //   {
    //     "hash" : "hash",              (string) the block hash (same as provided)
    //     "confirmations" : n,          (numeric) The number of confirmations, or -1 if the block is not on the main chain
    //     "height" : n,                 (numeric) The block height or index
    //     "version" : n,                (numeric) The block version
    //     "versionHex" : "00000000",    (string) The block version formatted in hexadecimal
    //     "merkleroot" : "xxxx",        (string) The merkle root
    //     "time" : ttt,                 (numeric) The block time in seconds since epoch (Jan 1 1970 GMT)
    //     "mediantime" : ttt,           (numeric) The median block time in seconds since epoch (Jan 1 1970 GMT)
    //     "nonce" : n,                  (numeric) The nonce
    //     "bits" : "1d00ffff",          (string) The bits
    //     "difficulty" : x.xxx,         (numeric) The difficulty
    //     "chainwork" : "0000...1f3"    (string) Expected number of hashes required to produce the current chain (in hex)
    //     "previousblockhash" : "hash", (string) The hash of the previous block
    //     "nextblockhash" : "hash",     (string) The hash of the next block
    //   }
    // 
    // Result (for verbose=false):
    //   "data"    (string) A string that is serialized, hex-encoded data for block 'hash'.
    //
    // --------------------------------------------------------------------------------------------
    getBlockHeader(blockHash, verbose) {
        var params = [blockHash];
        
        if (verbose != undefined)
            params.push(verbose);

        return this.mClient.call("getblockheader", params);
    }

    // --------------------------------------------------------------------------------------------
    // BLOCKCHAIN
    // --------------------------------------------------------------------------------------------
    //
    // Return information about all known tips in the block tree, including the main chain as well 
    // as orphaned branches.
    //  
    // Result:
    //   [
    //     {
    //       "height": xxxx,     (numeric) height of the chain tip
    //       "hash": "xxxx",     (string) block hash of the tip
    //       "branchlen": 0      (numeric) zero for main chain
    //       "status": "active"  (string) "active" for the main chain
    //     },
    //     {
    //       "height": xxxx,
    //       "hash": "xxxx",
    //       "branchlen": 1      (numeric) length of branch connecting the tip to the main chain
    //       "status": "xxxx"    (string) status of the chain (active, valid-fork, valid-headers, headers-only, invalid)
    //     }
    //   ]
    //   
    // Possible values for status:
    //   1. "invalid"          This branch contains at least one invalid block
    //   2. "headers-only"     Not all blocks for this branch are available, but the headers are valid
    //   3. "valid-headers"    All blocks are available for this branch, but they were never fully validated
    //   4. "valid-fork"       This branch is not part of the active chain, but is fully validated
    //   5. "active"           This is the tip of the active main chain, which is certainly valid 
    //
    // --------------------------------------------------------------------------------------------
    getChainTips() {
        return this.mClient.call("getchaintips");
    }

    // --------------------------------------------------------------------------------------------
    // BLOCKCHAIN
    // --------------------------------------------------------------------------------------------
    //
    // Returns the proof-of-work difficulty as a multiple of the minimum difficulty.
    // 
    // Result:
    //   n.nnn    (numeric) the proof-of-work difficulty as a multiple of the minimum difficulty.
    //
    // --------------------------------------------------------------------------------------------
    getDifficulty() {
        return this.mClient.call("getdifficulty");
    }

    // --------------------------------------------------------------------------------------------
    // BLOCKCHAIN
    // --------------------------------------------------------------------------------------------
    //
    // If txid is in the mempool, returns all in-mempool ancestors.
    // 
    // Arguments:
    //   1. txid       (string, required) The transaction id (must be in mempool)
    //   2. verbose    (boolean, optional, default=false) True for a json object, false for array of transaction ids
    // 
    // Result (for verbose=false):
    //   [
    //     "transactionid"  (string) The transaction id of an in-mempool ancestor transaction
    //     ,...
    //   ]
    //   
    // Result (for verbose=true):
    //   {
    //     "transactionid" : {
    //       "size" : n,             (numeric) virtual transaction size as defined in BIP 141. This is different from actual serialized size for witness transactions as witness data is discounted.
    //       "fee" : n,              (numeric) transaction fee in BTC
    //       "modifiedfee" : n,      (numeric) transaction fee with fee deltas used for mining priority
    //       "time" : n,             (numeric) local time transaction entered pool in seconds since 1 Jan 1970 GMT
    //       "height" : n,           (numeric) block height when transaction entered pool
    //       "startingpriority" : n, (numeric) DEPRECATED. Priority when transaction entered pool
    //       "currentpriority" : n,  (numeric) DEPRECATED. Transaction priority now
    //       "descendantcount" : n,  (numeric) number of in-mempool descendant transactions (including this one)
    //       "descendantsize" : n,   (numeric) virtual transaction size of in-mempool descendants (including this one)
    //       "descendantfees" : n,   (numeric) modified fees (see above) of in-mempool descendants (including this one)
    //       "ancestorcount" : n,    (numeric) number of in-mempool ancestor transactions (including this one)
    //       "ancestorsize" : n,     (numeric) virtual transaction size of in-mempool ancestors (including this one)
    //       "ancestorfees" : n,     (numeric) modified fees (see above) of in-mempool ancestors (including this one)
    //       "depends" : [           (array) unconfirmed transactions used as inputs for this transaction
    //         "transactionid",      (string) parent transaction id
    //          ... ]
    //     }, ...
    //   } 
    //
    // --------------------------------------------------------------------------------------------
    getMempoolAncestors(txId, verbose) {
        return this.mClient.call("getmempoolancestors");
    }

    // --------------------------------------------------------------------------------------------
    // BLOCKCHAIN
    // --------------------------------------------------------------------------------------------
    //
    // If txid is in the mempool, returns all in-mempool descendants.
    // 
    // Arguments:
    //   1. txid     (string, required) The transaction id (must be in mempool)
    //   2. verbose    (boolean, optional, default=false) True for a json object, false for array of transaction ids
    // 
    // Result (for verbose=false):
    //   [
    //     "transactionid"  (string) The transaction id of an in-mempool descendant transaction
    //     ,...
    //   ]
    // 
    // Result (for verbose=true):
    //   {
    //     "transactionid" : {
    //       "size" : n,             (numeric) virtual transaction size as defined in BIP 141. This is different from actual serialized size for witness transactions as witness data is discounted.
    //       "fee" : n,              (numeric) transaction fee in BTC
    //       "modifiedfee" : n,      (numeric) transaction fee with fee deltas used for mining priority
    //       "time" : n,             (numeric) local time transaction entered pool in seconds since 1 Jan 1970 GMT
    //       "height" : n,           (numeric) block height when transaction entered pool
    //       "startingpriority" : n, (numeric) DEPRECATED. Priority when transaction entered pool
    //       "currentpriority" : n,  (numeric) DEPRECATED. Transaction priority now
    //       "descendantcount" : n,  (numeric) number of in-mempool descendant transactions (including this one)
    //       "descendantsize" : n,   (numeric) virtual transaction size of in-mempool descendants (including this one)
    //       "descendantfees" : n,   (numeric) modified fees (see above) of in-mempool descendants (including this one)
    //       "ancestorcount" : n,    (numeric) number of in-mempool ancestor transactions (including this one)
    //       "ancestorsize" : n,     (numeric) virtual transaction size of in-mempool ancestors (including this one)
    //       "ancestorfees" : n,     (numeric) modified fees (see above) of in-mempool ancestors (including this one)
    //       "depends" : [           (array) unconfirmed transactions used as inputs for this transaction
    //         "transactionid",      (string) parent transaction id
    //          ... ]
    //     }, ...
    //   } 
    //
    // --------------------------------------------------------------------------------------------
    getMempoolDescendants(txId, verbose) {
        return this.mClient.call("getmempooldescendants");
    }

    // --------------------------------------------------------------------------------------------
    // BLOCKCHAIN
    // --------------------------------------------------------------------------------------------
    //
    // Returns mempool data for given transaction
    // 
    // Arguments:
    //   1. txid    (string, required) The transaction id (must be in mempool)
    // 
    // Result:
    //  {
    //    "size" : n,             (numeric) virtual transaction size as defined in BIP 141. This is different from actual serialized size for witness transactions as witness data is discounted.
    //    "fee" : n,              (numeric) transaction fee in BTC
    //    "modifiedfee" : n,      (numeric) transaction fee with fee deltas used for mining priority
    //    "time" : n,             (numeric) local time transaction entered pool in seconds since 1 Jan 1970 GMT
    //    "height" : n,           (numeric) block height when transaction entered pool
    //    "startingpriority" : n, (numeric) DEPRECATED. Priority when transaction entered pool
    //    "currentpriority" : n,  (numeric) DEPRECATED. Transaction priority now
    //    "descendantcount" : n,  (numeric) number of in-mempool descendant transactions (including this one)
    //    "descendantsize" : n,   (numeric) virtual transaction size of in-mempool descendants (including this one)
    //    "descendantfees" : n,   (numeric) modified fees (see above) of in-mempool descendants (including this one)
    //    "ancestorcount" : n,    (numeric) number of in-mempool ancestor transactions (including this one)
    //    "ancestorsize" : n,     (numeric) virtual transaction size of in-mempool ancestors (including this one)
    //    "ancestorfees" : n,     (numeric) modified fees (see above) of in-mempool ancestors (including this one)
    //    "depends" : [           (array) unconfirmed transactions used as inputs for this transaction
    //      "transactionid",      (string) parent transaction id
    //       ... ]
    //  } 
    //
    // --------------------------------------------------------------------------------------------
    getMempoolEntry(txId) {
        return this.mClient.call("getmempoolentry");
    }

    // --------------------------------------------------------------------------------------------
    // BLOCKCHAIN
    // --------------------------------------------------------------------------------------------
    //
    // Returns details on the active state of the TX memory pool.
    // 
    // Result:
    //   {
    //     "size": xxxxx,          (numeric) Current tx count
    //     "bytes": xxxxx,         (numeric) Sum of all virtual transaction sizes as defined in BIP 141. Differs from actual serialized size because witness data is discounted
    //     "usage": xxxxx,         (numeric) Total memory usage for the mempool
    //     "maxmempool": xxxxx,    (numeric) Maximum memory usage for the mempool
    //     "mempoolminfee": xxxxx  (numeric) Minimum fee for tx to be accepted
    //   }
    //
    // --------------------------------------------------------------------------------------------
    getMempoolInfo() {
        return this.mClient.call("getmempoolinfo");
    }

    // --------------------------------------------------------------------------------------------
    // BLOCKCHAIN
    // --------------------------------------------------------------------------------------------
    //
    // Returns all transaction ids in memory pool as a json array of string transaction ids.
    // 
    // Arguments:
    //   1. verbose    (boolean, optional, default=false) True for a json object, false for array of transaction ids
    // 
    // Result: (for verbose = false):
    //   [
    //     "transactionid"   (string) The transaction id
    //     , ...
    //   ]
    // 
    // Result: (for verbose = true):
    //   {
    //     "transactionid" : {
    //       "size" : n,             (numeric) virtual transaction size as defined in BIP 141. This is different from actual serialized size for witness transactions as witness data is discounted.
    //       "fee" : n,              (numeric) transaction fee in BTC
    //       "modifiedfee" : n,      (numeric) transaction fee with fee deltas used for mining priority
    //       "time" : n,             (numeric) local time transaction entered pool in seconds since 1 Jan 1970 GMT
    //       "height" : n,           (numeric) block height when transaction entered pool
    //       "startingpriority" : n, (numeric) DEPRECATED. Priority when transaction entered pool
    //       "currentpriority" : n,  (numeric) DEPRECATED. Transaction priority now
    //       "descendantcount" : n,  (numeric) number of in-mempool descendant transactions (including this one)
    //       "descendantsize" : n,   (numeric) virtual transaction size of in-mempool descendants (including this one)
    //       "descendantfees" : n,   (numeric) modified fees (see above) of in-mempool descendants (including this one)
    //       "ancestorcount" : n,    (numeric) number of in-mempool ancestor transactions (including this one)
    //       "ancestorsize" : n,     (numeric) virtual transaction size of in-mempool ancestors (including this one)
    //       "ancestorfees" : n,     (numeric) modified fees (see above) of in-mempool ancestors (including this one)
    //       "depends" : [           (array) unconfirmed transactions used as inputs for this transaction
    //         "transactionid",      (string) parent transaction id
    //          ... ]
    //     }, ...
    //   }
    //
    // --------------------------------------------------------------------------------------------
    getRawMempool(verbose) {
        return this.mClient.call("getrawmempool");
    }

    // --------------------------------------------------------------------------------------------
    // BLOCKCHAIN
    // --------------------------------------------------------------------------------------------
    //
    // Returns details about an unspent transaction output.
    // 
    // Arguments:
    //   1. txid               (string, required) The transaction id
    //   2. n                  (numeric, required) vout number
    //   3. include_mempool    (boolean, optional) Whether to include the mempool
    // 
    // Result:
    //   {
    //     "bestblock" : "hash",      (string) the block hash
    //     "confirmations" : n,       (numeric) The number of confirmations
    //     "value" : x.xxx,           (numeric) The transaction value in BTC.
    //     "amountcommitment": "hex", (string) the output's value commitment, if blinded
    //     "asset": "hex",            (string) the output's asset type, if unblinded
    //     "assetcommitment": "hex",  (string) the output's asset commitment, if blinded
    //     "scriptPubKey" : {
    //        "asm" : "code",         (string)
    //        "hex" : "hex",          (string)
    //        "reqSigs" : n,          (numeric) Number of required signatures
    //        "type" : "pubkeyhash",  (string) The type, eg pubkeyhash
    //        "addresses" : [         (array of string) array of bitcoin addresses
    //           "address"            (string) bitcoin address
    //           ,...
    //        ]
    //     },
    //     "version" : n,             (numeric) The version
    //     "coinbase" : true|false    (boolean) Coinbase or not
    //   }
    // 
    // --------------------------------------------------------------------------------------------
    getTxOut() {
        return this.mClient.call("gettxout");
    }

    // --------------------------------------------------------------------------------------------
    // BLOCKCHAIN
    // --------------------------------------------------------------------------------------------
    //
    // Returns a hex-encoded proof that "txid" was included in a block.
    // 
    // NOTE: By default this function only works sometimes. This is when there is an
    // unspent output in the utxo for this transaction. To make it always work,
    // you need to maintain a transaction index, using the -txindex command line option or
    // specify the block in which the transaction is included manually (by blockhash).
    // 
    // Arguments:
    //   1. txids: ["txid", ...]    (array, required) A json array of txids (A transaction hash) to filter
    //   2. blockhash               (string, optional) If specified, looks for txid in the block with this hash
    // 
    // Result:
    //   data    (string) A string that is a serialized, hex-encoded data for the proof.
    // 
    // --------------------------------------------------------------------------------------------
    getTxOutProof(txIds, blockHash) {
        return this.mClient.call("gettxoutproof");
    }

    // --------------------------------------------------------------------------------------------
    // BLOCKCHAIN
    // --------------------------------------------------------------------------------------------
    //
    // Returns statistics about the unspent transaction output set.
    // 
    // NOTE: this call may take some time.
    // 
    // Result:
    //   {
    //     "height":n,                (numeric) The current block height (index)
    //     "bestblock": "hex",        (string) the best block hash hex
    //     "transactions": n,         (numeric) The number of transactions
    //     "txouts": n,               (numeric) The number of output transactions
    //     "bytes_serialized": n,     (numeric) The serialized size
    //     "hash_serialized": "hash"  (string) The serialized hash
    //   }
    // 
    // --------------------------------------------------------------------------------------------
    getTxOutSetInfo() {
        return this.mClient.call("gettxoutsetinfo");
    }

    // --------------------------------------------------------------------------------------------
    // BLOCKCHAIN
    // --------------------------------------------------------------------------------------------
    //
    // Treats a block as if it were received before others with the same work. A later preciousblock 
    // call can override the effect of an earlier one. The effects of preciousblock are not retained
    // across restarts.
    // 
    // Arguments:
    //   1. blockhash    (string, required) the hash of the block to mark as precious
    // 
    // --------------------------------------------------------------------------------------------
    preciousBlock() {
        return this.mClient.call("preciousblock");
    }

    // --------------------------------------------------------------------------------------------
    // BLOCKCHAIN
    // --------------------------------------------------------------------------------------------
    //
    // Arguments:
    //   1. height  (numeric, required) The block height to prune up to. May be set to a discrete 
    //                                  height, or a unix timestamp to prune blocks whose block time
    //                                  is at least 2 hours older than the provided timestamp.
    //
    // Result:
    //   n    (numeric) Height of the last block pruned.
    //
    // --------------------------------------------------------------------------------------------
    pruneBlockChain() {
        return this.mClient.call("pruneblockchain");
    }

    // --------------------------------------------------------------------------------------------
    // BLOCKCHAIN
    // --------------------------------------------------------------------------------------------
    //
    // Verifies blockchain database.
    // 
    // Arguments:
    //   1. checklevel    (numeric, optional, 0-4, default=3) How thorough the block verification is.
    //   2. nblocks       (numeric, optional, default=6, 0=all) The number of blocks to check.
    // 
    // Result:
    //   true|false       (boolean) Verified or not
    // 
    // --------------------------------------------------------------------------------------------
    verifyChain() {
        return this.mClient.call("verifychain");
    }

    // --------------------------------------------------------------------------------------------
    // BLOCKCHAIN
    // --------------------------------------------------------------------------------------------
    //
    // Verifies that a proof points to a transaction in a block, returning the transaction it commits to
    // and throwing an RPC error if the block is not in our best chain
    // 
    // Arguments:
    //   1. proof    (string, required) The hex-encoded proof generated by gettxoutproof
    // 
    // Result:
    //   ["txid"]    (array, strings) The txid(s) which the proof commits to, or empty array if the proof is invalid
    // 
    // --------------------------------------------------------------------------------------------
    verifyTxOutProof() {
        return this.mClient.call("verifytxoutproof");
    }

    // --------------------------------------------------------------------------------------------
    // BLOCKCHAIN
    // --------------------------------------------------------------------------------------------
    //
    // Removes invalidity status of a block and its descendants, reconsider them for activation. 
    // This can be used to undo the effects of invalidateblock.
    // 
    // Arguments:
    //   1. blockhash    (string, required) the hash of the block to reconsider
    //
    // --------------------------------------------------------------------------------------------
    reconsiderBlock(blockHash) {
        return this.mClient.call("reconsiderblock", [blockHash]);
    }

    // --------------------------------------------------------------------------------------------
    // BLOCKCHAIN
    // --------------------------------------------------------------------------------------------
    //
    // Permanently marks a block as invalid, as if it violated a consensus rule.
    // 
    // Arguments:
    //   1. blockhash    (string, required) the hash of the block to mark as invalid
    //
    // --------------------------------------------------------------------------------------------
    invalidateBlock(blockHash) {
        return this.mClient.call("invalidateblock", [blockHash]);
    }

    // --------------------------------------------------------------------------------------------
    // BLOCKCHAIN
    // --------------------------------------------------------------------------------------------
    //
    // Waits for a specific new block and returns useful info about it. 
    // 
    // Returns the current block on timeout or exit.
    // 
    // Arguments:
    //   1. timeout    (int, optional, default=0) Time in milliseconds to wait for a response. 0 indicates no timeout.
    // 
    // Result:
    //   {
    //     "hash" :    (string) The blockhash
    //     "height" :  (int) Block height
    //   }
    //
    // --------------------------------------------------------------------------------------------
    waitForNewBlock() {
        return this.mClient.call("waitfornewblock");
    }

    // --------------------------------------------------------------------------------------------
    // BLOCKCHAIN
    // --------------------------------------------------------------------------------------------
    //
    // Waits for a specific new block and returns useful info about it.
    // 
    // Returns the current block on timeout or exit.
    // 
    // Arguments:
    //   1. blockhash    (required, string) Block hash to wait for.
    //   2. timeout      (int, optional, default=0) Time in milliseconds to wait for a response. 0 indicates no timeout.
    // 
    // Result:
    //   {
    //     "hash" :          (string) The blockhash
    //     "height" :        (int) Block height
    //   }
    //
    // --------------------------------------------------------------------------------------------
    waitForBlock() {
        return this.mClient.call("waitforblock");
    }

    // --------------------------------------------------------------------------------------------
    // BLOCKCHAIN
    // --------------------------------------------------------------------------------------------
    //
    // Waits for (at least) block height and returns the height and hash of the current tip.
    // 
    // Returns the current block on timeout or exit.
    // 
    // Arguments:
    //   1. height     (required, int) Block height to wait for (int)
    //   2. timeout    (int, optional, default=0) Time in milliseconds to wait for a response. 0 indicates no timeout.
    // 
    // Result:
    //   {
    //     "hash" :    (string) The blockhash
    //     "height" :  (int) Block height
    //   }
    //
    // --------------------------------------------------------------------------------------------
    waitForBlockHeight() {
        return this.mClient.call("waitforblockheight");
    }


    // --------------------------------------------------------------------------------------------
    // GENERATING
    // --------------------------------------------------------------------------------------------
    //
     
    // 
    // --------------------------------------------------------------------------------------------
    combineBlockSigs() {
        return this.mClient.call("combineblocksigs");
    }

    // --------------------------------------------------------------------------------------------
    // GENERATING
    // --------------------------------------------------------------------------------------------
    //
     
    // 
    // --------------------------------------------------------------------------------------------
    generate() {
        return this.mClient.call("generate");
    }

    // --------------------------------------------------------------------------------------------
    // GENERATING
    // --------------------------------------------------------------------------------------------
    //
     
    // 
    // --------------------------------------------------------------------------------------------
    getNewBlockHex() {
        return this.mClient.call("getnewblockhex");
    }


    // --------------------------------------------------------------------------------------------
    // MINING
    // --------------------------------------------------------------------------------------------
    //
     
    // 
    // --------------------------------------------------------------------------------------------
    getBlockTemplate() {
        return this.mClient.call("getblocktemplate");
    }

    // --------------------------------------------------------------------------------------------
    // MINING
    // --------------------------------------------------------------------------------------------
    //
     
    // 
    // --------------------------------------------------------------------------------------------
    getMiningInfo() {
        return this.mClient.call("getmininginfo");
    }

    // --------------------------------------------------------------------------------------------
    // MINING
    // --------------------------------------------------------------------------------------------
    //
     
    // 
    // --------------------------------------------------------------------------------------------
    getNetworkHashPS() {
        return this.mClient.call("getnetworkhashps");
    }

    // --------------------------------------------------------------------------------------------
    // MINING
    // --------------------------------------------------------------------------------------------
    //
     
    // 
    // --------------------------------------------------------------------------------------------
    prioritiseTransaction() {
        return this.mClient.call("prioritisetransaction");
    }

    // --------------------------------------------------------------------------------------------
    // MINING
    // --------------------------------------------------------------------------------------------
    //
     
    // 
    // --------------------------------------------------------------------------------------------
    submitBlock() {
        return this.mClient.call("submitblock");
    }

    // --------------------------------------------------------------------------------------------
    // MINING
    // --------------------------------------------------------------------------------------------
    //
     
    // 
    // --------------------------------------------------------------------------------------------
    testProposedBlock() {
        return this.mClient.call("testproposedblock");
    }


    // --------------------------------------------------------------------------------------------
    // NETWORK
    // --------------------------------------------------------------------------------------------
    //
    // Attempts add or remove a node from the addnode list.
    // Or try a connection to a node once.
    // 
    // Arguments:
    //   1. "node"     (string, required) The node (see getpeerinfo for nodes)
    //   2. "command"  (string, required) 'add' to add a node to the list, 'remove' to remove a node from the list, 'onetry' to try a connection to the node once
    // 
    // --------------------------------------------------------------------------------------------
    addNode() {
        return this.mClient.call("addnode");
    }

    // --------------------------------------------------------------------------------------------
    // NETWORK
    // --------------------------------------------------------------------------------------------
    //
    // Clear all banned IPs.
    // 
    // --------------------------------------------------------------------------------------------
    clearBanned() {
        return this.mClient.call("clearbanned");
    }

    // --------------------------------------------------------------------------------------------
    // NETWORK
    // --------------------------------------------------------------------------------------------
    //
    // Immediately disconnects from the specified node.
    // 
    // Arguments:
    //   1. "address"     (string, required) The IP address/port of the node
    // 
    // --------------------------------------------------------------------------------------------
    disconnectNode() {
        return this.mClient.call("disconnectnode");
    }

    // --------------------------------------------------------------------------------------------
    // NETWORK
    // --------------------------------------------------------------------------------------------
    //
    // Returns information about the given added node, or all added nodes
    // (note that onetry addnodes are not listed here)
    // 
    // Arguments:
    //   1. "node"   (string, optional) If provided, return information about this specific node, otherwise all nodes are returned.
    // 
    // Result:
    //   [
    //     {
    //       "addednode" : "19  2.168.0.201",   (string) The node ip address or name (as provided to addnode)
    //       "connected" : true|false,          (boolean) If connected
    //       "addresses" : [                    (list of objects) Only when connected = true
    //          {
    //            "address" : "19  2.168.0.201:8333",  (string) The bitcoin server IP and port we're connected to
    //            "connected" : "outbound"           (string) connection, inbound or outbound
    //          }
    //        ]
    //     }
    //     ,...
    //   ]
    // 
    // --------------------------------------------------------------------------------------------
    getAddedNodeInfo() {
        return this.mClient.call("getaddednodeinfo");
    }

    // --------------------------------------------------------------------------------------------
    // NETWORK
    // --------------------------------------------------------------------------------------------
    //
    // Returns the number of connections to other nodes.
    // 
    // Result:
    //   n          (numeric) The connection count
    // 
    // --------------------------------------------------------------------------------------------
    getConnectionCount() {
        return this.mClient.call("getconnectioncount");
    }

    // --------------------------------------------------------------------------------------------
    // NETWORK
    // --------------------------------------------------------------------------------------------
    //
    // Returns information about network traffic, including bytes in, bytes out, and current time.
    // 
    // Result:
    //   {
    //     "totalbytesrecv": n,   (numeric) Total bytes received
    //     "totalbytessent": n,   (numeric) Total bytes sent
    //     "timemillis": t,       (numeric) Current UNIX time in milliseconds
    //     "uploadtarget":
    //     {
    //       "timeframe": n,                         (numeric) Length of the measuring timeframe in seconds
    //       "target": n,                            (numeric) Target in bytes
    //       "target_reached": true|false,           (boolean) True if target is reached
    //       "serve_historical_blocks": true|false,  (boolean) True if serving historical blocks
    //       "bytes_left_in_cycle": t,               (numeric) Bytes left in current time cycle
    //       "time_left_in_cycle": t                 (numeric) Seconds left in current time cycle
    //     }
    //   }
    // 
    // --------------------------------------------------------------------------------------------
    getNetTotals() {
        return this.mClient.call("getnettotals");
    }

    // --------------------------------------------------------------------------------------------
    // NETWORK
    // --------------------------------------------------------------------------------------------
    //
    // Returns an object containing various state info regarding P2P networking.
    // 
    // Result:
    //   {
    //     "version": xxxxx,                      (numeric) the server version
    //     "subversion": "/Satoshi:x.x.x/",     (string) the server subversion string
    //     "protocolversion": xxxxx,              (numeric) the protocol version
    //     "localservices": "xxxxxxxxxxxxxxxx", (string) the services we offer to the network
    //     "localrelay": true|false,              (bool) true if transaction relay is requested from peers
    //     "timeoffset": xxxxx,                   (numeric) the time offset
    //     "connections": xxxxx,                  (numeric) the number of connections
    //     "networkactive": true|false,           (bool) whether p2p networking is enabled
    //     "networks": [                          (array) information per network
    //     {
    //       "name": "xxx",                     (string) network (ipv4, ipv6 or onion)
    //       "limited": true|false,               (boolean) is the network limited using -onlynet?
    //       "reachable": true|false,             (boolean) is the network reachable?
    //       "proxy": "host:port"               (string) the proxy that is used for this network, or empty if none
    //       "proxy_randomize_credentials": true|false,  (string) Whether randomized credentials are used
    //     }
    //     ,...
    //     ],
    //     "relayfee": x.xxxxxxxx,                (numeric) minimum relay fee for non-free transactions in " + CURRENCY_UNIT + "/kB
    //     "incrementalfee": x.xxxxxxxx,          (numeric) minimum fee increment for mempool limiting or BIP 125 replacement in " + CURRENCY_UNIT + "/kB
    //     "localaddresses": [                    (array) list of local addresses
    //     {
    //       "address": "xxxx",                 (string) network address
    //       "port": xxx,                         (numeric) network port
    //       "score": xxx                         (numeric) relative score
    //     }
    //     ,...
    //     ]
    //     "warnings": "..."                    (string) any network warnings
    //   }
    // 
    // --------------------------------------------------------------------------------------------
    getNetworkInfo() {
        return this.mClient.call("getnetworkinfo");
    }

    // --------------------------------------------------------------------------------------------
    // NETWORK
    // --------------------------------------------------------------------------------------------
    //
    // Returns data about each connected network node as a json array of objects.
    // 
    // Result:
    //   [
    //     {
    //       "id": n,                   (numeric) Peer index
    //       "addr":"host:port",      (string) The ip address and port of the peer
    //       "addrlocal":"ip:port",   (string) local address
    //       "services":"xxxxxxxxxxxxxxxx",   (string) The services offered
    //       "relaytxes":true|false,    (boolean) Whether peer has asked us to relay transactions to it
    //       "lastsend": ttt,           (numeric) The time in seconds since epoch (Jan 1 1970 GMT) of the last send
    //       "lastrecv": ttt,           (numeric) The time in seconds since epoch (Jan 1 1970 GMT) of the last receive
    //       "bytessent": n,            (numeric) The total bytes sent
    //       "bytesrecv": n,            (numeric) The total bytes received
    //       "conntime": ttt,           (numeric) The connection time in seconds since epoch (Jan 1 1970 GMT)
    //       "timeoffset": ttt,         (numeric) The time offset in seconds
    //       "pingtime": n,             (numeric) ping time (if available)
    //       "minping": n,              (numeric) minimum observed ping time (if any at all)
    //       "pingwait": n,             (numeric) ping wait (if non-zero)
    //       "version": v,              (numeric) The peer version, such as 7001
    //       "subver": "/Satoshi:0.8.5/",  (string) The string version
    //       "inbound": true|false,     (boolean) Inbound (true) or Outbound (false)
    //       "addnode": true|false,     (boolean) Whether connection was due to addnode and is using an addnode slot
    //       "startingheight": n,       (numeric) The starting height (block) of the peer
    //       "banscore": n,             (numeric) The ban score
    //       "synced_headers": n,       (numeric) The last header we have in common with this peer
    //       "synced_blocks": n,        (numeric) The last block we have in common with this peer
    //       "inflight": [
    //          n,                        (numeric) The heights of blocks we're currently asking from this peer
    //          ...
    //       ],
    //       "whitelisted": true|false, (boolean) Whether the peer is whitelisted"					
    //       "bytessent_per_msg": {
    //          "addr": n,              (numeric) The total bytes sent aggregated by message type
    //          ...
    //       },
    //       "bytesrecv_per_msg": {
    //          "addr": n,              (numeric) The total bytes received aggregated by message type
    //          ...
    //       }
    //     }
    //     ,...
    //   ]
    //
    // --------------------------------------------------------------------------------------------
    getPeerInfo() {
        return this.mClient.call("getpeerinfo");
    }

    // --------------------------------------------------------------------------------------------
    // NETWORK
    // --------------------------------------------------------------------------------------------
    //
    // List all banned IPs/Subnets.
    // 
    // --------------------------------------------------------------------------------------------
    listBanned() {
        return this.mClient.call("listbanned");
    }

    // --------------------------------------------------------------------------------------------
    // NETWORK
    // --------------------------------------------------------------------------------------------
    //
    // Requests that a ping be sent to all other nodes, to measure ping time.
    // Results provided in getpeerinfo, pingtime and pingwait fields are decimal seconds.
    // Ping command is handled in queue with all other commands, so it measures processing backlog, not just network ping.
    // 
    // --------------------------------------------------------------------------------------------
    ping() {
        return this.mClient.call("ping");
    }

    // --------------------------------------------------------------------------------------------
    // NETWORK
    // --------------------------------------------------------------------------------------------
    //
    // Attempts add or remove a IP/Subnet from the banned list.
    // 
    // Arguments:
    //   1. "subnet"       (string, required) The IP/Subnet (see getpeerinfo for nodes ip) with a optional netmask (default is /32 = single ip)
    //   2. "command"      (string, required) 'add' to add a IP/Subnet to the list, 'remove' to remove a IP/Subnet from the list
    //   3. "bantime"      (numeric, optional) time in seconds how long (or until when if [absolute] is set) the ip is banned (0 or empty means using the default time of 24h which can also be overwritten by the -bantime startup argument)
    //   4. "absolute"     (boolean, optional) If set, the bantime must be a absolute timestamp in seconds since epoch (Jan 1 1970 GMT)
    // 
    // --------------------------------------------------------------------------------------------
    setBan() {
        return this.mClient.call("setban");
    }

    // --------------------------------------------------------------------------------------------
    // NETWORK
    // --------------------------------------------------------------------------------------------
    //
    // Disable/enable all p2p network activity.
    // 
    // Arguments:
    //   1. "state"        (boolean, required) true to enable networking, false to disable
    // 
    // --------------------------------------------------------------------------------------------
    setNetworkActive() {
        return this.mClient.call("setnetworkactive");
    }


    // --------------------------------------------------------------------------------------------
    // RAW TRANSACTIONS
    // --------------------------------------------------------------------------------------------
    //
    // Convert one or more outputs of a raw transaction into confidential ones using only wallet inputs.
    // Returns the hex-encoded raw transaction.
    // The output keys used can be specified by using a confidential address in createrawtransaction.
    // This call may add an additional 0-value unspendable output in order to balance the blinders.
    // 
    // Arguments:
    //   1. hexstring,          (string, required) A hex-encoded raw transaction.
    //   2. ignoreblindfail     (bool, optional, default=true) Return a transaction even when a blinding attempt fails due to number of blinded inputs/outputs.
    //   3. assetcommitments    (array, optional) An array of input asset generators. If provided, this list must be empty, or match the final input commitment list, including ordering, to make a valid surjection proof. This list does not include generators for issuances, as these assets are inherently unblinded.
    //        [                       
    //          "assetcommitment"   (string, optional) A hex-encoded asset commitment, one for each input. Null commitments must be "".
    //          , ...
    //        ]
    //   4. totalblinder          (string, optional) Ignored for now.
    // 
    // Result:
    //   transaction    (string) hex string of the transaction
    // 
    // --------------------------------------------------------------------------------------------
    blindRawTransaction() {
        return this.mClient.call("blindrawtransaction");
    }

    // --------------------------------------------------------------------------------------------
    // RAW TRANSACTIONS
    // --------------------------------------------------------------------------------------------
    //
    // Create a transaction spending the given inputs and creating new outputs.
    // 
    // Outputs can be addresses or data.
    // 
    // Returns hex-encoded raw transaction.
    // 
    // Note that the transaction's inputs are not signed, and it is not stored in the wallet or transmitted to the network.
    // 
    // Arguments:
    //   1. inputs           (array, required) A json array of json objects
    //        [
    //          {
    //            "txid":"id",    (string, required) The transaction id
    //            "vout":n,         (numeric, required) The output number
    //            "asset": "string"   (string, optional, default=bitcoin) The asset of the input, as a tag string or a hex value
    //            "sequence":n      (numeric, optional) The sequence number
    //          } 
    //          ,...
    //        ]
    //        
    //   2. outputs          (object, required) a json object with outputs
    //        {
    //          "address": x.xxx,    (numeric or string, required) The key is the bitcoin address, the numeric value (can be string) is the " + CURRENCY_UNIT + " amount
    //          "data": "hex"      (string, required) The key is "data", the value is hex encoded data
    //          "fee": x.xxx           (numeric or string, required) The key is "fee", the value the fee output you want to add.
    //          ,...
    //        }
    //        
    //   3. locktime         (numeric, optional, default=0) Raw locktime. Non-0 value also locktime-activates inputs
    //   
    //   4. output_assets    (strings, optional, default=bitcoin) A json object of assets to addresses
    //        {
    //            "address": "hex" 
    //             "fee": "hex" 
    //            ...
    //        }
    // 
    // Result:
    //   transaction    (string) hex string of the transaction
    //
    // --------------------------------------------------------------------------------------------
    createRawTransaction(inputs, outputs, lockTime, outputAssets) {
        return this.mClient.call("createrawtransaction");
    }

    // --------------------------------------------------------------------------------------------
    // RAW TRANSACTIONS
    // --------------------------------------------------------------------------------------------
    //
    // Return a JSON object representing the serialized, hex-encoded transaction.
    // 
    // Arguments:
    //   1. hexstring    (string, required) The transaction hex string
    // 
    // Result:
    //   {
    //     "txid" : "id",        (string) The transaction id
    //     "hash" : "id",        (string) The transaction hash (differs from txid for witness transactions)
    //     "size" : n,             (numeric) The transaction size
    //     "vsize" : n,            (numeric) The virtual transaction size (differs from size for witness transactions)
    //     "version" : n,          (numeric) The version
    //     "locktime" : ttt,       (numeric) The lock time
    //     "fee" : x.xxx,          (numeric) The transaction fee in " + CURRENCY_UNIT + 
    //   
    //     "vin" : [               (array of json objects)
    //        {
    //          "txid": "id",    (string) The transaction id
    //          "vout": n,         (numeric) The output number
    //          "scriptSig": {     (json object) The script
    //            "asm": "asm",  (string) asm
    //            "hex": "hex"   (string) hex
    //          },
    //          "txinwitness": ["hex", ...] (array of string) hex-encoded witness data (if any)
    //          "sequence": n     (numeric) The script sequence number
    //          "issuance"         (object) Info on issuance
    //        }
    //        ,...
    //     ],
    //     "vout" : [             (array of json objects)
    //        {
    //          "value" : x.xxx,            (numeric) The value in " + CURRENCY_UNIT + 
    //   
    //          "n" : n,                    (numeric) index
    //          "asset" : "hex"           (string) the asset id, if unblinded
    //          "assetcommitment" : "hex" (string) the asset tag, if blinded
    //          "scriptPubKey" : {          (json object)
    //            "asm" : "asm",          (string) the asm
    //            "hex" : "hex",          (string) the hex
    //            "reqSigs" : n,            (numeric) The required sigs
    //            "type" : "pubkeyhash",  (string) The type, eg 'pubkeyhash'
    //            "addresses" : [           (json array of string)
    //              "12tvKAXCxZjSmdNbao16dKXC8tRWfcF5oc"   (string) bitcoin address
    //              ,...
    //            ]
    //          }
    //        }
    //        ,...
    //     ],
    //   }
    // 
    // --------------------------------------------------------------------------------------------
    decodeRawTransaction() {
        return this.mClient.call("decoderawtransaction");
    }

    // --------------------------------------------------------------------------------------------
    // RAW TRANSACTIONS
    // --------------------------------------------------------------------------------------------
    //
    // Decode a hex-encoded script.
    // 
    // Arguments:
    //   1. "hexstring"     (string) the hex encoded script
    // 
    // Result:
    //   {
    //     "asm":"asm",   (string) Script public key
    //     "hex":"hex",   (string) hex encoded public key
    //     "type":"type", (string) The output type
    //     "reqSigs": n,    (numeric) The required signatures
    //     "addresses": [   (json array of string)
    //        "address"     (string) bitcoin address
    //        ,...
    //     ],
    //     "p2sh","address" (string) address of P2SH script wrapping this redeem script (not returned if the script is already a P2SH).
    //   }
    // 
    // --------------------------------------------------------------------------------------------
    decodeScript() {
        return this.mClient.call("decodescript");
    }

    // --------------------------------------------------------------------------------------------
    // RAW TRANSACTIONS
    // --------------------------------------------------------------------------------------------
    //
    // Add inputs to a transaction until it has enough in value to meet its out value.
    // This will not modify existing inputs, and will add change outputs to the json output.
    // Note that inputs which were signed may need to be resigned after completion since in/outputs have been added.
    // The inputs added will not be signed, use signrawtransaction for that.
    // Note that all existing inputs must have their previous output transaction be in the wallet.
    // Note that all inputs selected must be of standard form and P2SH scripts must be
    // in the wallet using importaddress or addmultisigaddress (to calculate fees).
    // You can see whether this is the case by checking the "solvable" field in the listunspent output.
    // Only pay-to-pubkey, multisig, and P2SH versions thereof are currently supported for watch-only
    // Note: Existing fee outputs will be dropped to aid fee estimation
    // 
    // Arguments:
    //   1. "hexstring"           (string, required) The hex string of the raw transaction
    //   2. options                 (object, optional)
    //    {
    //      "changeAddress"          (string, optional, default pool address) The bitcoin address to receive the change
    //      "changePosition"    (numeric, optional, default random) The index of the change output (DISABLED)
    //      "includeWatching"        (boolean, optional, default false) Also select inputs which are watch only
    //      "lockUnspents"           (boolean, optional, default false) Lock selected unspent outputs
    //      "reserveChangeKey"       (boolean, optional, default true) Reserves the change output key from the keypool
    //      "feeRate"                (numeric, optional, default not set: makes wallet determine the fee) Set a specific feerate (" + CURRENCY_UNIT + " per KB)
    //      "subtractFeeFromOutputs" (array, optional) A json array of integers.
    //                               The fee will be equally deducted from the amount of each specified output.
    //                               The outputs are specified by their zero-based index, before any change output is added.
    //                               Those recipients will receive less bitcoins than you enter in their corresponding amount field.
    //                               If no outputs are specified here, the sender pays the fee.
    //                                   [vout_index,...]
    //    }
    //                          for backward compatibility: passing in a true instead of an object will result in {"includeWatching":true}
    // 
    // Result:
    //   {
    //     "hex":       "value", (string)  The resulting raw transaction (hex-encoded string)
    //     "fee":       n,         (numeric) Fee in " + CURRENCY_UNIT + " the resulting transaction pays
    //   }
    // 
    // --------------------------------------------------------------------------------------------
    fundRawTransaction() {
        return this.mClient.call("fundrawtransaction");
    }

    // --------------------------------------------------------------------------------------------
    // RAW TRANSACTIONS
    // --------------------------------------------------------------------------------------------
    //
    // NOTE: By default this function only works for mempool transactions. If the -txindex option is
    // enabled, it also works for blockchain transactions.
    // 
    // DEPRECATED: for now, it also works for transactions with unspent outputs.
    // 
    // Return the raw transaction data.
    // 
    // If verbose is 'true', returns an Object with information about 'txid'.
    // If verbose is 'false' or omitted, returns a string that is serialized, hex-encoded data for 'txid'.
    // 
    // Arguments:
    //   1. txid       (string, required) The transaction id
    //   2. verbose    (bool, optional, default=false) If false, return a string, otherwise return a json object
    // 
    // Result (if verbose is not set or set to false):
    //   data    (string) The serialized, hex-encoded data for 'txid'
    // 
    // Result (if verbose is set to true):
    //   {
    //     "hex" : "data",                  (string) The serialized, hex-encoded data for 'txid'
    //     "txid" : "id",                   (string) The transaction id (same as provided)
    //     "hash" : "id",                   (string) The transaction hash (differs from txid for witness transactions)
    //     "size" : n,                      (numeric) The serialized transaction size
    //     "vsize" : n,                     (numeric) The virtual transaction size (differs from size for witness transactions)
    //     "version" : n,                   (numeric) The version
    //     "locktime" : ttt,                (numeric) The lock time
    //     "vin" : [                        (array of json objects)
    //        {                             
    //          "txid": "id",               (string) The transaction id
    //          "vout": n,                  (numeric) 
    //          "scriptSig": {              (json object) The script
    //            "asm": "asm",             (string) asm
    //            "hex": "hex"              (string) hex
    //          },                          
    //          "sequence": n               (numeric) The script sequence number
    //          "txinwitness": [            (array of string) hex-encoded witness data (if any)
    //            "hex"
    //            , ...] 
    //          "issuance"                  (object) Info on issuance
    //        }                             
    //        ,...                          
    //     ],                               
    //     "vout" : [                       (array of json objects)
    //        {
    //          "value" : x.xxx,            (numeric) The value in " + CURRENCY_UNIT + 
    //   
    //          "amountcommitment": "hex",  (string) the output's value commitment, if blinded
    //          "fee_value" : x.xxx,        (numeric) The fee value in " + CURRENCY_UNIT + 
    //   
    //          "n" : n,                    (numeric) index
    //          "asset" : "hex"             (string) the asset id, if unblinded
    //          "assetcommitment" : "hex"   (string) the asset tag, if blinded
    //          "scriptPubKey" : {          (json object)
    //            "asm" : "asm",            (string) the asm
    //            "hex" : "hex",            (string) the hex
    //            "reqSigs" : n,            (numeric) The required sigs
    //            "type" : "pubkeyhash",    (string) The type, eg 'pubkeyhash'
    //            "addresses" : [           (json array of string)
    //              "address"               (string) bitcoin address
    //              ,...                    
    //            ]                         
    //          }                           
    //        }                             
    //        ,...                          
    //     ],                               
    //     "blockhash" : "hash",            (string) the block hash
    //     "confirmations" : n,             (numeric) The confirmations
    //     "time" : ttt,                    (numeric) The transaction time in seconds since epoch (Jan 1 1970 GMT)
    //     "blocktime" : ttt                (numeric) The block time in seconds since epoch (Jan 1 1970 GMT)
    //   }
    // 
    // --------------------------------------------------------------------------------------------
    getRawTransaction(txId, verbose) {
        return this.mClient.call("getrawtransaction");
    }

    // --------------------------------------------------------------------------------------------
    // RAW TRANSACTIONS
    // --------------------------------------------------------------------------------------------
    //
    // Convert one or more outputs of a raw transaction into confidential ones.
    // 
    // Returns the hex-encoded raw transaction.
    // 
    // The input raw transaction cannot have already-blinded outputs.
    // The output keys used can be specified by using a confidential address in createrawtransaction.
    // 
    // If an additional blinded output is required to make a balanced blinding, a 0-value unspendable output will be added. Since there is no access to the wallet the blinding pubkey from the last output with blinding key will be repeated.
    // 
    // Arguments:
    //   1. hexstring,              (string, required) A hex-encoded raw transaction.
    //   2. inputblinders           (array, required) An array with one entry per transaction input.
    //        [                     
    //          "inputblinder"      (string, required) A hex-encoded blinding factor, one for each input. Blinding factors can be found in the "blinder" output of listunspent.
    //          , ...
    //        ]
    //   3. inputamounts            (array, required) An array with one entry per transaction input.
    //        [                     
    //          "inputamount"       (numeric, required) An amount for each input.
    //          , ...
    //        ],
    //   4. inputassets             (array, required) An array with one entry per transaction input.
    //        [                     
    //          "inputasset"        (string, required) A hex-encoded asset id, one for each input.
    //          , ...
    //        ],
    //   5. inputassetblinders      (array, required) An array with one entry per transaction input.
    //        [                              
    //          "inputassetblinder" (string, required) A hex-encoded asset blinding factor, one for each input.
    //          , ...
    //        ],
    //   6. totalblinder            (string, optional) Ignored for now.
    //   7. ignoreblindfail         (bool, optional, default=true) Return a transaction even when a blinding attempt fails due to number of blinded inputs/outputs.
    // 
    // Result:
    //   transaction    (string) hex string of the transaction
    // 
    // --------------------------------------------------------------------------------------------
    rawBlindRawTransaction() {
        return this.mClient.call("rawblindrawtransaction");
    }

    // --------------------------------------------------------------------------------------------
    // RAW TRANSACTIONS
    // --------------------------------------------------------------------------------------------
    //
    // Submits raw transaction (serialized, hex-encoded) to local node and network.
    // Also see createrawtransaction and signrawtransaction calls.
    // 
    // Arguments:
    //   1. "hexstring"    (string, required) The hex string of the raw transaction)
    //   2. allowhighfees    (boolean, optional, default=false) Allow high fees
    //   3. allowblindfails  (boolean, optional, default=false) Allow outputs which have a pubkey attached (ie are blindable), which are unblinded
    // 
    // Result:
    //   "hex"             (string) The transaction hash in hex
    // 
    // --------------------------------------------------------------------------------------------
    sendRawTransaction() {
        return this.mClient.call("sendrawtransaction");
    }

    // --------------------------------------------------------------------------------------------
    // RAW TRANSACTIONS
    // --------------------------------------------------------------------------------------------
    //
    // Sign inputs for raw transaction (serialized, hex-encoded).
    // The second optional argument (may be null) is an array of previous transaction outputs that
    // this transaction depends on but may not yet be in the block chain.
    // The third optional argument (may be null) is an array of base58-encoded private
    // keys that, if given, will be the only keys used to sign the transaction.
    // 
    // NOTE: If wallet is enabled and encrypted then it will require a wallet passphrase to be set with walletpassphrase call. +             
    // 
    // Arguments:
    //   1. "hexstring"     (string, required) The transaction hex string
    //   2. "prevtxs"       (string, optional) An json array of previous dependent transaction outputs
    //      [               (json array of json objects, or 'null' if none provided)
    //        {
    //          "txid":"id",             (string, required) The transaction id
    //          "vout":n,                  (numeric, required) The output number
    //          "scriptPubKey": "hex",   (string, required) script key
    //          "redeemScript": "hex",   (string, required for P2SH or P2WSH) redeem script
    //          "amount": value            (numeric, required) The amount spent
    //        }
    //        ,...
    //     ]
    //   3. "privkeys"     (string, optional) A json array of base58-encoded private keys for signing
    //     [                  (json array of strings, or 'null' if none provided)
    //       "privatekey"   (string) private key in base58-encoding
    //       ,...
    //     ]
    //   4. "sighashtype"     (string, optional, default=ALL) The signature hash type. Must be one of
    //        "ALL
    // 
    //        "NONE
    // 
    //        "SINGLE
    // 
    //        "ALL|ANYONECANPAY
    // 
    //        "NONE|ANYONECANPAY
    // 
    //        "SINGLE|ANYONECANPAY
    // 
    // 
    // Result:
    //   {
    //     "hex" : "value",           (string) The hex-encoded raw transaction with signature(s)
    //     "complete" : true|false,   (boolean) If the transaction has a complete set of signatures
    //     "errors" : [                 (json array of objects) Script verification errors (if there are any)
    //       {
    //         "txid" : "hash",           (string) The hash of the referenced, previous transaction
    //         "vout" : n,                (numeric) The index of the output to spent and used as input
    //         "scriptSig" : "hex",       (string) The hex-encoded signature script
    //         "sequence" : n,            (numeric) Script sequence number
    //         "error" : "text"           (string) Verification or signing error related to the input
    //       }
    //       ,...
    //     ]
    //   }
    // 
    // --------------------------------------------------------------------------------------------
    signRawTransaction() {
        return this.mClient.call("signrawtransaction");
    }


    // --------------------------------------------------------------------------------------------
    // UTILITIES
    // --------------------------------------------------------------------------------------------
    //
     
    // 
    // --------------------------------------------------------------------------------------------
    createBlindedAddress() {
        return this.mClient.call("createblindedaddress");
    }

    // --------------------------------------------------------------------------------------------
    // UTILITIES
    // --------------------------------------------------------------------------------------------
    //
     
    // 
    // --------------------------------------------------------------------------------------------
    createMultiSig() {
        return this.mClient.call("createmultisig");
    }

    // --------------------------------------------------------------------------------------------
    // UTILITIES
    // --------------------------------------------------------------------------------------------
    //
     
    // 
    // --------------------------------------------------------------------------------------------
    estimateFee() {
        return this.mClient.call("estimatefee");
    }

    // --------------------------------------------------------------------------------------------
    // UTILITIES
    // --------------------------------------------------------------------------------------------
    //
     
    // 
    // --------------------------------------------------------------------------------------------
    estimatePriority() {
        return this.mClient.call("estimatepriority");
    }

    // --------------------------------------------------------------------------------------------
    // UTILITIES
    // --------------------------------------------------------------------------------------------
    //
     
    // 
    // --------------------------------------------------------------------------------------------
    estimateSmartFee() {
        return this.mClient.call("estimatesmartfee");
    }

    // --------------------------------------------------------------------------------------------
    // UTILITIES
    // --------------------------------------------------------------------------------------------
    //
     
    // 
    // --------------------------------------------------------------------------------------------
    estimateSmartPriority() {
        return this.mClient.call("estimatesmartpriority");
    }

    // --------------------------------------------------------------------------------------------
    // UTILITIES
    // --------------------------------------------------------------------------------------------
    //
     
    // 
    // --------------------------------------------------------------------------------------------
    signMessageWithPrivKey() {
        return this.mClient.call("signmessagewithprivkey");
    }

    // --------------------------------------------------------------------------------------------
    // UTILITIES
    // --------------------------------------------------------------------------------------------
    //
     
    // 
    // --------------------------------------------------------------------------------------------
    validateAddress() {
        return this.mClient.call("validateaddress");
    }

    // --------------------------------------------------------------------------------------------
    // UTILITIES
    // --------------------------------------------------------------------------------------------
    //
     
    // 
    // --------------------------------------------------------------------------------------------
    verifyMessage() {
        return this.mClient.call("verifymessage");
    }


    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
     
    // 
    // --------------------------------------------------------------------------------------------
    abandonTransaction() {
        return this.mClient.call("abandontransaction");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // Add a nrequired-to-sign multisignature address to the wallet.
    // Each key is a Bitcoin address or hex-encoded public key.
    // If 'account' is specified (DEPRECATED), assign address to that account.
    // 
    // Arguments:
    //   1. nrequired        (numeric, required) The number of required signatures out of the n keys or addresses.
    //   2. "keys"         (string, required) A json array of bitcoin addresses or hex-encoded public keys
    //      [
    //        "address"  (string) bitcoin address or hex-encoded public key
    //        ...,
    //      ]
    //   3. "account"      (string, optional) DEPRECATED. An account to assign the addresses to.
    // 
    // Result:
    //   "address"         (string) A bitcoin address associated with the keys.
    // 
    // --------------------------------------------------------------------------------------------
    addMultiSigAddress() {
        return this.mClient.call("addmultisigaddress");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // Add a witness address for a script (with pubkey or redeemscript known).
    // It returns the witness script.
    // 
    // Arguments:
    //   1. "address"       (string, required) An address known to the wallet
    // 
    // Result:
    //   "witnessaddress",  (string) The value of the new address (P2SH of witness script).
    // 
    // --------------------------------------------------------------------------------------------
    addWitnessAddress() {
        return this.mClient.call("addwitnessaddress");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // Safely copies current wallet file to destination, which can be a directory or a path with filename.
    // 
    // Arguments:
    //   1. "destination"   (string) The destination directory or file
    // 
    // --------------------------------------------------------------------------------------------
    backupWallet() {
        return this.mClient.call("backupwallet");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // Claim coins from the main chain by creating a withdraw transaction with the necessary metadata after the corresponding Bitcoin transaction.
    // Note that the transaction will not be relayed unless it is buried at least 102 blocks deep.
    // If a transaction is not relayed it may require manual addition to a functionary mempool in order for it to be mined.
    // 
    // Arguments:
    //   1. "bitcoinTx"         (string, required) The raw bitcoin transaction (in hex) depositing bitcoin to the mainchain_address generated by getpeginaddress
    //   2. "txoutproof"        (string, required) A rawtxoutproof (in hex) generated by bitcoind's `gettxoutproof` containing a proof of only bitcoinTx
    //   3. "sidechain_address"  (string, optional) The sidechain_address generated by getpeginaddress. Only needed if not in wallet.
    // 
    // Result:
    //   "txid"                 (string) Txid of the resulting sidechain transaction
    // 
    // --------------------------------------------------------------------------------------------
    claimPegin() {
        return this.mClient.call("claimpegin");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------    
    //
    // Destroy an amount of a given asset.
    //             + HelpRequiringPassphrase() +
    // Arguments:
    //   1. "asset"       (string, required) Hex asset id or asset label to destroy.
    //   2. "amount"      (numeric or string, required) The amount to destroy in BTC (8 decimals above the minimal unit).
    //   3. "comment"     (string, optional) A comment used to store what the transaction is for. 
    //                              This is not part of the transaction, just kept in your wallet.
    // Result:
    //   "transactionid"  (string) The transaction id.
    // 
    // --------------------------------------------------------------------------------------------
    destroyAmount() {
        return this.mClient.call("destroyamount");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // Lists all known asset id/label pairs in this wallet. This list can be modified 
    // with `-assetdir` configuration argument.
    // 
    // --------------------------------------------------------------------------------------------
    dumpAssetLabels() {
        return this.mClient.call("dumpassetlabels");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
     
    //
    // --------------------------------------------------------------------------------------------
    dumpBlindingKey() {
        return this.mClient.call("dumpblindingkey");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
     
    // 
    // --------------------------------------------------------------------------------------------
    dumpIssuanceBlindingKey() {
        return this.mClient.call("dumpissuanceblindingkey");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
     
    // 
    // --------------------------------------------------------------------------------------------
    dumpPrivKey() {
        return this.mClient.call("dumpprivkey");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
     
    // 
    // --------------------------------------------------------------------------------------------
    dumpWallet() {
        return this.mClient.call("dumpwallet");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // Encrypts the wallet with 'passphrase'. This is for first time encryption.
    // After this, any calls that interact with private keys such as sending or signing 
    // will require the passphrase to be set prior the making these calls.
    // Use the walletpassphrase call for this, and then walletlock call.
    // If the wallet is already encrypted, use the walletpassphrasechange call.
    // Note that this will shutdown the server.
    // 
    // Arguments:
    //   1. "passphrase"    (string) The pass phrase to encrypt the wallet with. It must be at least 1 character, but should be long. 
    // 
    // --------------------------------------------------------------------------------------------
    encryptWallet() {
        return this.mClient.call("encryptwallet");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // DEPRECATED. Returns the account associated with the given address.
    // 
    // Arguments:
    //   1. "address"         (string, required) The bitcoin address for account lookup.
    // 
    // Result:
    //   "accountname"        (string) the account address
    // 
    // --------------------------------------------------------------------------------------------
    getAccount() {
        return this.mClient.call("getaccount");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // DEPRECATED. Returns the current Bitcoin address for receiving payments to this account.
    // 
    // Arguments:
    //   1. "account"       (string, required) The account name for the address. It can also be set to the empty string "" to represent the default account. The account does not need to exist, it will be created and a new address created  if there is no account by the given name.
    // 
    // Result:
    //   "address"          (string) The account bitcoin address
    // 
    // --------------------------------------------------------------------------------------------
    getAccountAddress() {
        return this.mClient.call("getaccountaddress");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // DEPRECATED. Returns the list of addresses for the given account.
    // 
    // Arguments:
    //   1. "account"        (string, required) The account name.
    // 
    // Result:
    //   [                     (json array of string)
    //     "address"         (string) a bitcoin address associated with the given account
    //     ,...
    //   ]
    // 
    // --------------------------------------------------------------------------------------------
    getAddressesByAccount() {
        return this.mClient.call("getaddressesbyaccount");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // If account is not specified, returns the server's total available balance.
    // If account is specified (DEPRECATED), returns the balance in the account.
    // Note that the account "" is not the same as leaving the parameter out.
    // The server total may be different to the balance in the default "" account.
    // 
    // Arguments:
    //   1. "account"         (string, optional) DEPRECATED. The account string may be given as a
    //                      specific account name to find the balance associated with wallet keys in
    //                      a named account, or as the empty string ("") to find the balance
    //                      associated with wallet keys not in any named account, or as "*" to find
    //                      the balance associated with all wallet keys regardless of account.
    //                      When this option is specified, it calculates the balance in a different
    //                      way than when it is not specified, and which can count spends twice when
    //                      there are conflicting pending transactions (such as those created by
    //                      the bumpfee command), temporarily resulting in low or even negative
    //                      balances. In general, account balance calculation is not considered
    //                      reliable and has resulted in confusing outcomes, so it is recommended to
    //                      avoid passing this argument.
    //   2. minconf           (numeric, optional, default=1) Only include transactions confirmed at least this many times.
    //   3. include_watchonly (bool, optional, default=false) Also include balance in watch-only addresses (see 'importaddress')
    //   4. "assetlabel"   (string, optional) Hex asset id or asset label for balance. IF THIS IS USED ALL OTHER ARGUMENTS ARE IGNORED
    // 
    // Result:
    //   amount              (numeric) The total amount in " + CURRENCY_UNIT + " received for this account.
    // 
    // --------------------------------------------------------------------------------------------
    getBalance() {
        return this.mClient.call("getbalance");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // Returns a new Bitcoin address for receiving payments.
    // If 'account' is specified (DEPRECATED), it is added to the address book 
    // so payments received with the address will be credited to 'account'.
    // 
    // Arguments:
    //   1. "account"        (string, optional) DEPRECATED. The account name for the address to be linked to. If not provided, the default account "" is used. It can also be set to the empty string "" to represent the default account. The account does not need to exist, it will be created if there is no account by the given name.
    // 
    // Result:
    //   "address"    (string) The new bitcoin address
    // 
    // --------------------------------------------------------------------------------------------
    getNewAddress() {
        return this.mClient.call("getnewaddress");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // Returns information needed for claimpegin to move coins to the sidechain.
    // The user should send coins from their Bitcoin wallet to the mainchain_address returned.
    // 
    // IMPORTANT: Like getaddress, getpeginaddress adds new secrets to wallet.dat, necessitating backup on a regular basis.
    // 
    // Arguments:
    //   1. "account"        (string, optional) The account name for the address to be linked to. if not provided, the default account "" is used. It can also be set to the empty string "" to represent the default account. The account does not need to exist, it will be created if there is no account by the given name.
    // 
    // Result:
    //   "mainchain_address"           (string) Mainchain Bitcoin deposit address to send bitcoin to
    //   "sidechain_address"           (string) The sidechain address in this wallet which must be used in `claimpegin` to retrieve pegged-in funds
    // 
    // --------------------------------------------------------------------------------------------
    getPeginAddress() {
        return this.mClient.call("getpeginaddress");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // Returns a new Bitcoin address, for receiving change.
    // This is for use with raw transactions, NOT normal use.
    // 
    // Result:
    //   "address"    (string) The address
    // 
    // --------------------------------------------------------------------------------------------
    getRawChangeAddress() {
        return this.mClient.call("getrawchangeaddress");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // DEPRECATED. Returns the total amount received by addresses with <account> in transactions with at least [minconf] confirmations.
    // 
    // Arguments:
    //   1. "account"      (string, required) The selected account, may be the default account using "".
    //   2. minconf          (numeric, optional, default=1) Only include transactions confirmed at least this many times.
    // 
    // Result:
    //   amount              (numeric) The total amount in " + CURRENCY_UNIT + " received for this account.
    // 
    // --------------------------------------------------------------------------------------------
    getReceivedByAccount() {
        return this.mClient.call("getreceivedbyaccount");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // Returns the total amount received by the given address in transactions with at least minconf confirmations.
    // 
    // Arguments:
    //   1. "address"         (string, required) The bitcoin address for transactions.
    //   2. minconf             (numeric, optional, default=1) Only include transactions confirmed at least this many times.
    //   3. "assetlabel"      (string, optional) Hex asset id or asset label for balance.
    // 
    // Result:
    //   amount   (numeric) The total amount in " + CURRENCY_UNIT + " received at this address.
    // 
    // --------------------------------------------------------------------------------------------
    getReceivedByAddress() {
        return this.mClient.call("getreceivedbyaddress");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // Get detailed information about in-wallet transaction <txid>
    // 
    // Arguments:
    //   1. "txid"                  (string, required) The transaction id
    //   2. "include_watchonly"     (bool, optional, default=false) Whether to include watch-only addresses in balance calculation and details[]
    //   3. "assetlabel"          (string, optional, default=bitcoin) Hex asset id or asset label for balance. "*" retrieves all known asset balances.
    // 
    // Result:
    //   {
    //     "amount" : x.xxx,        (numeric) The transaction amount in " + CURRENCY_UNIT + 
    //   
    //     "fee": x.xxx,            (numeric) The amount of the fee in " + CURRENCY_UNIT + ". This is negative and only available for the 
    //                                 'send' category of transactions.
    //     "confirmations" : n,     (numeric) The number of confirmations
    //     "blockhash" : "hash",  (string) The block hash
    //     "blockindex" : xx,       (numeric) The index of the transaction in the block that includes it
    //     "blocktime" : ttt,       (numeric) The time in seconds since epoch (1 Jan 1970 GMT)
    //     "txid" : "transactionid",   (string) The transaction id.
    //     "time" : ttt,            (numeric) The transaction time in seconds since epoch (1 Jan 1970 GMT)
    //     "timereceived" : ttt,    (numeric) The time received in seconds since epoch (1 Jan 1970 GMT)
    //     "bip125-replaceable": "yes|no|unknown",  (string) Whether this transaction could be replaced due to BIP125 (replace-by-fee);
    //                                                      may be unknown for unconfirmed transactions not in the mempool
    //     "details" : [
    //       {
    //         "account" : "accountname",      (string) DEPRECATED. The account name involved in the transaction, can be "" for the default account.
    //         "address" : "address",          (string) The bitcoin address involved in the transaction
    //         "category" : "send|receive",    (string) The category, either 'send' or 'receive'
    //         "amount" : x.xxx,                 (numeric) The amount in the asset below
    //         "amountblinder": "hex"            (string) The blinding factor of the amount.
    //         "asset": "asset"                (string) The asset id.
    //         "assetblinder": "hex"             (string) The blinding factor of the asset.
    //         "label" : "label",              (string) A comment for the address/transaction, if any
    //         "vout" : n,                       (numeric) the vout value
    //         "fee": x.xxx,                     (numeric) The amount of the fee in " + CURRENCY_UNIT + ". This is negative and only available for the 
    //                                              'send' category of transactions.
    //         "abandoned": xxx                  (bool) 'true' if the transaction has been abandoned (inputs are respendable). Only available for the 
    //                                              'send' category of transactions."			
    //       }
    //       ,...
    //     ],
    //     "hex" : "data"         (string) Raw data for transaction
    //   }
    // 
    // --------------------------------------------------------------------------------------------
    getTransaction() {
        return this.mClient.call("gettransaction");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // Returns the server's total unconfirmed balance
    // 
    // Arguments:
    //   1. "asset"               (string, optional) Hex asset id or asset label for balance.
    // 
    // --------------------------------------------------------------------------------------------
    getUnconfirmedBalance() {
        return this.mClient.call("getunconfirmedbalance");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // Returns an object containing various wallet state info.
    // 
    //   1. "assetlabel"               (string, optional) Hex asset id or asset label for balance. "*" retrieves all known asset balances.
    // 
    // Result:
    //   {
    //     "walletversion": xxxxx,       (numeric) the wallet version
    //     "balance": xxxxxxx,           (numeric) the total confirmed balance of the wallet in " + CURRENCY_UNIT + 
    //   
    //     "unconfirmed_balance": xxx,   (numeric) the total unconfirmed balance of the wallet in " + CURRENCY_UNIT + 
    //   
    //     "immature_balance": xxxxxx,   (numeric) the total immature balance of the wallet in " + CURRENCY_UNIT + 
    //   
    //     "txcount": xxxxxxx,           (numeric) the total number of transactions in the wallet
    //     "keypoololdest": xxxxxx,      (numeric) the timestamp (seconds since Unix epoch) of the oldest pre-generated key in the key pool
    //     "keypoolsize": xxxx,          (numeric) how many new keys are pre-generated
    //     "unlocked_until": ttt,        (numeric) the timestamp in seconds since epoch (midnight Jan 1 1970 GMT) that the wallet is unlocked for transfers, or 0 if the wallet is locked
    //     "paytxfee": x.xxxx,           (numeric) the transaction fee configuration, set in " + CURRENCY_UNIT + "/kB
    //     "hdmasterkeyid": "<hash160>" (string) the Hash160 of the HD master pubkey
    //   }
    // 
    // --------------------------------------------------------------------------------------------
    getWalletInfo() {
        return this.mClient.call("getwalletinfo");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
     
    // 
    // --------------------------------------------------------------------------------------------
    importAddress() {
        return this.mClient.call("importaddress");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
     
    // 
    // --------------------------------------------------------------------------------------------
    importBlindingKey() {
        return this.mClient.call("importblindingkey");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
     
    // 
    // --------------------------------------------------------------------------------------------
    importIssuanceBlindingKey() {
        return this.mClient.call("importissuanceblindingkey");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
     
    // 
    // --------------------------------------------------------------------------------------------
    importMulti() {
        return this.mClient.call("importmulti");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
     
    // 
    // --------------------------------------------------------------------------------------------
    importPrivKey() {
        return this.mClient.call("importprivkey");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
     
    // 
    // --------------------------------------------------------------------------------------------
    importPrunedFunds() {
        return this.mClient.call("importprunedfunds");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
     
    // 
    // --------------------------------------------------------------------------------------------
    importPubKey() {
        return this.mClient.call("importpubkey");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
     
    // 
    // --------------------------------------------------------------------------------------------
    importWallet() {
        return this.mClient.call("importwallet");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // Create an asset. Must have funds in wallet to do so. Returns asset hex id.
    // 
    // Arguments:
    //   1. "assetamount"           (numeric or string, required) Amount of asset to generate.
    //   2. "tokenamount"           (numeric or string, required) Amount of reissuance tokens to generate. These will allow you to reissue the asset if in wallet using `reissueasset`. These tokens are not consumed during reissuance.
    //   3. "blind"                 (bool, optional, default=true) Whether to blind the issuances.
    // 
    // Result:
    //   {                        (json object)
    //     "txid":"<txid>",   (string) Transaction id for issuance.
    //     "vin":"n",         (numeric) The input position of the issuance in the transaction.
    //     "entropy":"<entropy>" (string) Entropy of the asset type.
    //     "asset":"<asset>", (string) Asset type for issuance if known.
    //     "token":"<token>", (string) Token type for issuance.
    //   }
    // 
    // --------------------------------------------------------------------------------------------
    issueAsset() {
        return this.mClient.call("issueasset");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // Fills the keypool.
    //             + HelpRequiringPassphrase() + 
    // 
    // Arguments
    //   1. newsize     (numeric, optional, default=100) The new keypool size
    // 
    // --------------------------------------------------------------------------------------------
    keypoolRefill() {
        return this.mClient.call("keypoolrefill");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // DEPRECATED. Returns Object that has account names as keys, account balances as values.
    // 
    // Arguments:
    //   1. minconf             (numeric, optional, default=1) Only include transactions with at least this many confirmations
    //   2. include_watchonly   (bool, optional, default=false) Include balances in watch-only addresses (see 'importaddress')
    // 
    // Result:
    //   {                      (json object where keys are account names, and values are numeric balances
    //     "account": x.xxx,  (numeric) The property name is the account name, and the value is the total balance for the account.
    //     ...
    //   }
    // 
    // --------------------------------------------------------------------------------------------
    listAccounts() {
        return this.mClient.call("listaccounts");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // Lists groups of addresses which have had their common ownership
    // made public by common use as inputs or as the resulting change
    // in past transactions
    // 
    // Result:
    //   [
    //     [
    //       [
    //         "address",            (string) The bitcoin address
    //         amount,                 (numeric) The amount in " + CURRENCY_UNIT + 
    //   
    //         "account"             (string, optional) DEPRECATED. The account
    //       ]
    //       ,...
    //     ]
    //     ,...
    //   ]
    // 
    // --------------------------------------------------------------------------------------------
    listAddressGroupings() {
        return this.mClient.call("listaddressgroupings");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // List all issuances known to the wallet for the given asset, or for all issued assets if none provided.
    // 
    // Arguments:
    //   1. "asset"                 (string, optional) The asset whose issaunces you wish to list.
    // 
    // Result:
    //   [                     (json array of objects)
    //     {
    //       "txid":"<txid>",   (string) Transaction id for issuance.
    //       "entropy":"<entropy>" (string) Entropy of the asset type.
    //       "asset":"<asset>", (string) Asset type for issuance if known.
    //       "assetlabel":"<assetlabel>", (string) Asset label for issuance if set.
    //       "token":"<token>", (string) Token type for issuance.
    //       "vin":"n",         (numeric) The input position of the issuance in the transaction.
    //       "assetamount":"X.XX",     (numeric) The amount of asset issued. Is -1 if blinded and unknown to wallet.
    //       "tokenamount":"X.XX",     (numeric) The reissuance token amount issued. Is -1 if blinded and unknown to wallet.
    //       "isreissuance":"<bool>",  (bool) True if this is a reissuance.
    //       "assetblinds":"<blinder>" (string) Hex blinding factor for asset amounts.
    //       "tokenblinds":"<blinder>" (string) Hex blinding factor for token amounts.
    //     }
    //     ,...
    //   ]
    //   ""                 (array) List of transaction issuances and information in wallet
    // 
    // --------------------------------------------------------------------------------------------
    listIssuances() {
        return this.mClient.call("listissuances");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // Returns list of temporarily unspendable outputs.
    // See the lockunspent call to lock and unlock transactions for spending.
    // 
    // Result:
    //   [
    //     {
    //       "txid" : "transactionid",     (string) The transaction id locked
    //       "vout" : n                      (numeric) The vout value
    //     }
    //     ,...
    //   ]
    // 
    // --------------------------------------------------------------------------------------------
    listLockUnspent() {
        return this.mClient.call("listlockunspent");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // DEPRECATED. List balances by account.
    // 
    // Arguments:
    //   1. minconf           (numeric, optional, default=1) The minimum number of confirmations before payments are included.
    //   2. include_empty     (bool, optional, default=false) Whether to include accounts that haven't received any payments.
    //   3. include_watchonly (bool, optional, default=false) Whether to include watch-only addresses (see 'importaddress').
    // 
    // Result:
    //   [
    //     {
    //       "involvesWatchonly" : true,   (bool) Only returned if imported addresses were involved in transaction
    //       "account" : "accountname",  (string) The account name of the receiving account
    //       "amount" : x.xxx,             (numeric) The total amount received by addresses with this account
    //       "confirmations" : n,          (numeric) The number of confirmations of the most recent transaction included
    //       "label" : "label"           (string) A comment for the address/transaction, if any
    //     }
    //     ,...
    //   ]
    // 
    // --------------------------------------------------------------------------------------------
    listReceivedByAccount() {
        return this.mClient.call("listreceivedbyaccount");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // List balances by receiving address.
    // 
    // Arguments:
    //   1. minconf           (numeric, optional, default=1) The minimum number of confirmations before payments are included.
    //   2. include_empty     (bool, optional, default=false) Whether to include addresses that haven't received any payments.
    //   3. include_watchonly (bool, optional, default=false) Whether to include watch-only addresses (see 'importaddress').
    //   4.  "assetlabel"     (string, optional) The hex asset id or asset label to filter for.
    // 
    // Result:
    //   [
    //     {
    //       "involvesWatchonly" : true,        (bool) Only returned if imported addresses were involved in transaction
    //       "address" : "receivingaddress",  (string) The receiving address
    //       "account" : "accountname",       (string) DEPRECATED. The account of the receiving address. The default account is "".
    //       "amount" : x.xxx,                  (numeric) The total amount in " + CURRENCY_UNIT + " received by the address
    //       "confirmations" : n,               (numeric) The number of confirmations of the most recent transaction included
    //       "label" : "label",               (string) A comment for the address/transaction, if any
    //       "txids": [
    //          n,                                (numeric) The ids of transactions received with the address 
    //          ...
    //       ]
    //     }
    //     ,...
    //   ]
    // 
    // --------------------------------------------------------------------------------------------
    listReceivedByAddress() {
        return this.mClient.call("listreceivedbyaddress");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // Get all transactions in blocks since block [blockhash], or all transactions if omitted
    // 
    // Arguments:
    //   1. "blockhash"            (string, optional) The block hash to list transactions since
    //   2. target_confirmations:    (numeric, optional) The confirmations required, must be 1 or more
    //   3. include_watchonly:       (bool, optional, default=false) Include transactions to watch-only addresses (see 'importaddress')
    // 
    // Result:
    //   {
    //     "transactions": [
    //       "account":"accountname",       (string) DEPRECATED. The account name associated with the transaction. Will be "" for the default account.
    //       "address":"address",    (string) The bitcoin address of the transaction. Not present for move transactions (category = move).
    //       "category":"send|receive",     (string) The transaction category. 'send' has negative amounts, 'receive' has positive amounts.
    //       "amount": x.xxx,          (numeric) The amount in " + CURRENCY_UNIT + ". This is negative for the 'send' category, and for the 'move' category for moves 
    //                                             outbound. It is positive for the 'receive' category, and for the 'move' category for inbound funds.
    //       "vout" : n,               (numeric) the vout value
    //       "fee": x.xxx,             (numeric) The amount of the fee in " + CURRENCY_UNIT + ". This is negative and only available for the 'send' category of transactions.
    //       "confirmations": n,       (numeric) The number of confirmations for the transaction. Available for 'send' and 'receive' category of transactions.
    //                                             When it's < 0, it means the transaction conflicted that many blocks ago.
    //       "blockhash": "hashvalue",     (string) The block hash containing the transaction. Available for 'send' and 'receive' category of transactions.
    //       "blockindex": n,          (numeric) The index of the transaction in the block that includes it. Available for 'send' and 'receive' category of transactions.
    //       "blocktime": xxx,         (numeric) The block time in seconds since epoch (1 Jan 1970 GMT).
    //       "txid": "transactionid",  (string) The transaction id. Available for 'send' and 'receive' category of transactions.
    //       "time": xxx,              (numeric) The transaction time in seconds since epoch (Jan 1 1970 GMT).
    //       "timereceived": xxx,      (numeric) The time received in seconds since epoch (Jan 1 1970 GMT). Available for 'send' and 'receive' category of transactions.
    //       "bip125-replaceable": "yes|no|unknown",  (string) Whether this transaction could be replaced due to BIP125 (replace-by-fee);
    //                                                      may be unknown for unconfirmed transactions not in the mempool
    //       "abandoned": xxx,         (bool) 'true' if the transaction has been abandoned (inputs are respendable). Only available for the 'send' category of transactions.
    //       "comment": "...",       (string) If a comment is associated with the transaction.
    //       "label" : "label"       (string) A comment for the address/transaction, if any
    //       "to": "...",            (string) If a comment to is associated with the transaction.
    //      ],
    //     "lastblock": "lastblockhash"     (string) The hash of the last block
    //   }
    // 
    // --------------------------------------------------------------------------------------------
    listSinceBlock() {
        return this.mClient.call("listsinceblock");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // Returns up to 'count' most recent transactions skipping the first 'from' transactions for account 'account'.
    // 
    // Arguments:
    //   1. "account"    (string, optional) DEPRECATED. The account name. Should be "*".
    //   2. count          (numeric, optional, default=10) The number of transactions to return
    //   3. skip           (numeric, optional, default=0) The number of transactions to skip
    //   4. include_watchonly (bool, optional, default=false) Include transactions to watch-only addresses (see 'importaddress')
    // 
    // Result:
    //   [
    //     {
    //       "account":"accountname",       (string) DEPRECATED. The account name associated with the transaction. 
    //                                                   It will be "" for the default account.
    //       "address":"address",    (string) The bitcoin address of the transaction. Not present for 
    //                                                   move transactions (category = move).
    //       "category":"send|receive|move", (string) The transaction category. 'move' is a local (off blockchain)
    //                                                   transaction between accounts, and not associated with an address,
    //                                                   transaction id or block. 'send' and 'receive' transactions are 
    //                                                   associated with an address, transaction id and block details
    //       "amount": x.xxx,          (numeric) The amount in " + CURRENCY_UNIT + ". This is negative for the 'send' category, and for the
    //                                            'move' category for moves outbound. It is positive for the 'receive' category,
    //       "asset"                 (string) The asset id of the amount being moved.)
    //                                            and for the 'move' category for inbound funds.
    //       "label": "label",       (string) A comment for the address/transaction, if any
    //       "vout": n,                (numeric) the vout value
    //       "fee": x.xxx,             (numeric) The amount of the fee in " + CURRENCY_UNIT + ". This is negative and only available for the 
    //                                            'send' category of transactions.
    //       "confirmations": n,       (numeric) The number of confirmations for the transaction. Available for 'send' and 
    //                                            'receive' category of transactions. Negative confirmations indicate the
    //                                            transaction conflicts with the block chain
    //       "trusted": xxx,           (bool) Whether we consider the outputs of this unconfirmed transaction safe to spend.
    //       "blockhash": "hashvalue", (string) The block hash containing the transaction. Available for 'send' and 'receive'
    //                                             category of transactions.
    //       "blockindex": n,          (numeric) The index of the transaction in the block that includes it. Available for 'send' and 'receive'
    //                                             category of transactions.
    //       "blocktime": xxx,         (numeric) The block time in seconds since epoch (1 Jan 1970 GMT).
    //       "txid": "transactionid", (string) The transaction id. Available for 'send' and 'receive' category of transactions.
    //       "time": xxx,              (numeric) The transaction time in seconds since epoch (midnight Jan 1 1970 GMT).
    //       "timereceived": xxx,      (numeric) The time received in seconds since epoch (midnight Jan 1 1970 GMT). Available 
    //                                             for 'send' and 'receive' category of transactions.
    //       "comment": "...",       (string) If a comment is associated with the transaction.
    //       "otheraccount": "accountname",  (string) DEPRECATED. For the 'move' category of transactions, the account the funds came 
    //                                             from (for receiving funds, positive amounts), or went to (for sending funds,
    //                                             negative amounts).
    //       "bip125-replaceable": "yes|no|unknown",  (string) Whether this transaction could be replaced due to BIP125 (replace-by-fee);
    //       "blindingfactors": "..."  (string) The list of blinding factors for a given transaction in vout order
    //                                                        may be unknown for unconfirmed transactions not in the mempool
    //       "abandoned": xxx          (bool) 'true' if the transaction has been abandoned (inputs are respendable). Only available for the 
    //                                            'send' category of transactions.
    //     }
    //   ]
    // 
    // --------------------------------------------------------------------------------------------
    listTransactions() {
        return this.mClient.call("listtransactions");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // Returns array of unspent transaction outputs with between minconf and maxconf (inclusive) confirmations of the given asset type, or bitcoin if not provided.
    // Optionally filter to only include txouts paid to specified addresses.
    // 
    // Arguments:
    //   1. minconf                 (numeric, optional, default=1) The minimum confirmations to filter
    //   2. maxconf                 (numeric, optional, default=9999999) The maximum confirmations to filter
    //   3. "addresses"             (optional) A json array of bitcoin addresses to filter
    //     [
    //       "address"            (string) bitcoin address
    //       ,...
    //     ]
    //   4. include_unsafe (bool, optional, default=true) Include outputs that are not safe to spend
    //                   because they come from unconfirmed untrusted transactions or unconfirmed
    //                   replacement transactions (cases where we are less sure that a conflicting
    //                   transaction won't be mined).
    //   5.  "asset"                 (string, optional, default=bitcoin) The hex asset id or label to filter for. "*" is used to list all results.
    //       [                          (array of json object)
    //         {
    //           "txid": "txid",        (string) the transaction id 
    //           "vout": n,             (numeric) the vout value
    //           "address": "address",  (string) the bitcoin address
    //           "account": "account",  (string) DEPRECATED. The associated account, or "" for the default account
    //           "scriptPubKey": "key", (string) the script key
    //           "amount" : x.xxx,         (numeric) the transaction output amount in " + CURRENCY_UNIT + 
    //       
    //           "asset": "hex"       (string) the asset id for this output
    //           "assetcommitment": "hex" (string) the asset commitment for this output
    //           "assetlabel":"<assetlabel>", (string) Asset label for asset type if set.
    //           "confirmations": n,    (numeric) The number of confirmations
    //           "amountcommitment": "hex",     (string) the output's value commitment, if blinded
    //           "blinder": "blind"     (string) The value blinding factor used for a confidential output
    //           "assetblinder": "blind"(string) The asset blinding factor used for a confidential output
    //           "redeemScript": n      (string) The redeemScript if scriptPubKey is P2SH
    //           "spendable": xxx,      (bool) Whether we have the private keys to spend this output
    //           "solvable": xxx        (bool) Whether we know how to spend this output, ignoring the lack of keys
    //         }
    //         ,...
    //       ]
    // 
    // --------------------------------------------------------------------------------------------
    listUnspent() {
        return this.mClient.call("listunspent");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // Updates list of temporarily unspendable outputs.
    // Temporarily lock (unlock=false) or unlock (unlock=true) specified transaction outputs.
    // If no transaction outputs are specified when unlocking then all current locked transaction outputs are unlocked.
    // A locked transaction output will not be chosen by automatic coin selection, when spending bitcoins.
    // Locks are stored in memory only. Nodes start with zero locked outputs, and the locked output list
    // is always cleared (by virtue of process exit) when a node stops or fails.
    // Also see the listunspent call
    // 
    // Arguments:
    //   1. unlock            (boolean, required) Whether to unlock (true) or lock (false) the specified transactions
    //   2. "transactions"  (string, optional) A json array of objects. Each object the txid (string) vout (numeric)
    //      [           (json array of json objects)
    //        {
    //          "txid":"id",    (string) The transaction id
    //          "vout": n         (numeric) The output number
    //        }
    //        ,...
    //      ]
    // 
    // Result:
    //   true|false    (boolean) Whether the command was successful or not
    // 
    // --------------------------------------------------------------------------------------------
    lockUnspent() {
        return this.mClient.call("lockunspent");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // Create more of an already issued asset. Must have reissuance token in wallet to do so. Reissuing does not affect your reissuance token balance, only asset.
    // 
    // Arguments:
    //   1. "asset"                 (string, required) The asset you want to re-issue. The corresponding token must be in your wallet.
    //   2. "assetamount"           (numeric or string, required) Amount of additional asset to generate.
    // 
    // Result:
    //   {                        (json object)
    //     "txid":"<txid>",   (string) Transaction id for issuance.
    //     "vin":"n",         (numeric) The input position of the issuance in the transaction.
    //   }
    // 
    // --------------------------------------------------------------------------------------------
    reissueAsset() {
        return this.mClient.call("reissueasset");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
     
    // 
    // --------------------------------------------------------------------------------------------
    removePrunedFunds() {
        return this.mClient.call("removeprunedfunds");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // Send multiple times. Amounts are double-precision floating point numbers.
    //             + HelpRequiringPassphrase() + 
    // 
    // Arguments:
    //   1. "fromaccount"         (string, required) DEPRECATED. The account to send the funds from. Should be "" for the default account
    //   2. "amounts"             (string, required) A json object with addresses and amounts
    //     {
    //       "address":amount   (numeric or string) The bitcoin address is the key, the numeric amount (can be string) in " + CURRENCY_UNIT + " is the value
    //       ,...
    //     }
    //   3. minconf                 (numeric, optional, default=1) Only use the balance confirmed at least this many times.
    //   4. "comment"             (string, optional) A comment
    //   5. subtractfeefrom         (array, optional) A json array with addresses.
    //                            The fee will be equally deducted from the amount of each selected address.
    //                            Those recipients will receive less bitcoins than you enter in their corresponding amount field.
    //                            If no addresses are specified here, the sender pays the fee.
    //     [
    //       "address"          (string) Subtract fee from this address
    //       ,...
    //     ]
    //   6. "output_assets"     (string, optional, default=bitcoin) a json object of assets to addresses
    //    {
    //        "address": "hex" 
    //        ...
    //    }
    //   7. "ignoreblindfail""   (bool, default=true) Return a transaction even when a blinding attempt fails due to number of blinded inputs/outputs.
    // 
    // Result:
    //   "txid"                   (string) The transaction id for the send. Only 1 transaction is created regardless of 
    //                                     the number of addresses.
    // 
    // --------------------------------------------------------------------------------------------
    sendMany() {
        return this.mClient.call("sendmany");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // Send an amount to a given address.
    //             + HelpRequiringPassphrase() +
    // 
    // Arguments:
    //   1. "address"            (string, required) The bitcoin address to send to.
    //   2. "amount"             (numeric or string, required) The amount in " + CURRENCY_UNIT + " to send. eg 0.1
    //   3. "comment"            (string, optional) A comment used to store what the transaction is for. 
    //                              This is not part of the transaction, just kept in your wallet.
    //   4. "comment_to"         (string, optional) A comment to store the name of the person or organization 
    //                              to which you're sending the transaction. This is not part of the 
    //                              transaction, just kept in your wallet.
    //   5. subtractfeefromamount  (boolean, optional, default=false) The fee will be deducted from the amount being sent.
    //                              The recipient will receive less bitcoins than you enter in the amount field.
    //   6. "assetlabel"               (string, optional) Hex asset id or asset label for balance.
    //   7. "ignoreblindfail""   (bool, default=true) Return a transaction even when a blinding attempt fails due to number of blinded inputs/outputs.
    // 
    // Result:
    //   "txid"                  (string) The transaction id.
    // 
    // --------------------------------------------------------------------------------------------
    sendToAddress() {
        return this.mClient.call("sendtoaddress");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // Sends sidechain funds to the given mainchain address, through the federated withdraw mechanism
    //             + HelpRequiringPassphrase() +
    // 
    // Arguments:
    //   1. "address"        (string, required) The destination address on Bitcoin mainchain
    //   2. "amount"         (numeric, required) The amount being sent to Bitcoin mainchain
    // 
    // Result:
    //   "txid"              (string) Transaction ID of the resulting sidechain transaction
    // 
    // --------------------------------------------------------------------------------------------
    sendToMainChain() {
        return this.mClient.call("sendtomainchain");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // DEPRECATED. Sets the account associated with the given address.
    // 
    // Arguments:
    //   1. "address"         (string, required) The bitcoin address to be associated with an account.
    //   2. "account"         (string, required) The account to assign the address to.
    // 
    // --------------------------------------------------------------------------------------------
    setAccount() {
        return this.mClient.call("setaccount");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // Set the transaction fee per kB. Overwrites the paytxfee parameter.
    // 
    // Arguments:
    //   1. amount         (numeric or string, required) The transaction fee in " + CURRENCY_UNIT + "/kB
    // 
    // Result:
    //   true|false        (boolean) Returns true if successful
    // 
    // --------------------------------------------------------------------------------------------
    setTxFee() {
        return this.mClient.call("settxfee");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // Signs a block proposal, checking that it would be accepted first
    // 
    // Arguments:
    //   1. "blockhex"    (string, required) The hex-encoded block from getnewblockhex
    // 
    // Result
    //   sig      (hex) The signature
    // 
    // --------------------------------------------------------------------------------------------
    signBlock() {
        return this.mClient.call("signblock");
    }

    // --------------------------------------------------------------------------------------------
    // WALLET
    // --------------------------------------------------------------------------------------------
    //
    // Sign a message with the private key of an address
    //             + HelpRequiringPassphrase() + 
    // 
    // Arguments:
    //   1. "address"         (string, required) The bitcoin address to use for the private key.
    //   2. "message"         (string, required) The message to create a signature of.
    // 
    // Result:
    //   "signature"          (string) The signature of the message encoded in base 64
    // 
    // --------------------------------------------------------------------------------------------
    signMessage() {
        return this.mClient.call("signmessage");
    }
}

module.exports.Client = Client;