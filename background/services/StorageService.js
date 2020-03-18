import extensionizer from 'extensionizer'
import Utils from '../../lib/utils'

const StorageService = {
    storageKey: [
        'accounts',
        // 'tokens',
        'setting',
        'whitelist',
        'selectedAccount'
    ],
    storage: extensionizer.storage.local,
    accounts: null,
    selectedAccount: null,
    whitelist: {
        "social.empow > post": -1,
        "social.empow > comment": -1,
        "social.empow > share": -1,
        "social.empow > likeWithdraw": -1,
        "social.empow > delete": -1,
        "social.empow > report": -1,
        "social.empow > follow": -1,
        "social.empow > unfollow": -1,
        "social.empow > updateProfile": -1,
        "social.empow > blockContent": -1,
        "social.empow > like": -1,
        "social.empow > likeComment": -1,
        "social.empow > likeCommentWithdraw": -1,
        "social.empow > verifyPost": -1,
        "auth.empow > selectUsername": -1,
        "auth.empow > addNormalUsername": -1,
        "auth.empow > addPremiumUsername": -1
    },
    setting: {
        showZeroBalance: true,
        listCoinDisabled: {},
        currency: 'usd',
        autolock: 60 * 60 * 1000, // 60 minute
        network: {
            'MAINNET': 'MAINNET',
            'TESTNET': 'TESTNET'
        },
    },
    password: false,
    ready: false,
    init(password) {
        this.password = password
        this.ready = true
        this.saveAll()
    },
    getStorage(key) {
        return new Promise(resolve => (
            this.storage.get(key, data => {
                if(key in data)
                    return resolve(data[ key ]);

                resolve(false);
            })
        ));
    },

    async dataExists() {
        return !!(await this.getStorage('accounts'));
    },

    async unlock (password) {
        return new Promise( async (resolve, reject) => {
            if(this.ready) return reject('Wallet has unlocked')
            if(!this.dataExists) return reject('Data not exist')

            try {
                for(var i = 0; i < this.storageKey.length; i++) {
                    let key = this.storageKey[i];
    
                    const encrypted = await this.getStorage(key);
    
                    if(!encrypted)
                        continue;
    
                    this[ key ] = Utils.decrypt(
                        encrypted,
                        password
                    )

                }
                
                this.ready = true
                this.password = password

                resolve(true)
            } catch (error) {
                reject('Password not correct')
            }
        })
    },

    async addToken(type, address, name, symbol, decimal) {
        return new Promise( (resolve, reject) => {
            // check exist type
            if(!this.token.hasOwnProperty(type)) return reject(`${type} is not exist`)
            // check exist symbol
            const symbolLower = symbol.toLowerCase()
            if(this.token[type].hasOwnProperty(symbolLower)) return reject(`${name} already exist. You need remove and add again`)
            // add
            this.token[type][symbolLower] = {
                address,
                name,
                symbol: symbol.toUpperCase(),
                decimal
            }

            this.saveToken()

            resolve(true)
        })
    },

    async removeToken(type, symbol) {
        return new Promise( (resolve, reject) => {
            try {
                delete this.token[type][symbol.toLowerCase()]
            } catch (err) {
                reject(`Can't remove ${symbol}: ${err.message}`)
            }
        })
    },

    addWhitelist (contractAddress, timeExpired) {
        this.whitelist[contractAddress] = timeExpired
        this.saveWhitelist()
    },

    checkWhitelist (contractAddress) {
        if(!this.whitelist.hasOwnProperty(contractAddress)) return false;
        const timeExpired = this.whitelist[contractAddress]
        if(typeof timeExpired != 'number') return false;
        if(timeExpired == -1) return true;

        const now = new Date().getTime()

        if(now > timeExpired) {
            delete this.whitelist[contractAddress]
            return false;
        }

        return true;
    },

    saveAll() {
        this.saveAccounts()
        // this.saveTokens()
        this.saveSetting()
        this.saveWhitelist()
        this.saveSelectedAccount()
    },

    saveWhitelist () {
        this.save('whitelist')
    },

    saveAccounts (accounts = null) {
        if(accounts) this.accounts = accounts
        this.save('accounts')
    },

    // saveTokens () {
    //     this.save('tokens')
    // },
    
    saveSetting () {
        this.save('setting')
    },

    saveSelectedAccount(selectedAccount = null) {
        if(selectedAccount) this.selectedAccount = selectedAccount
        this.save('selectedAccount')
    },

    save(key) {

        if(!this.ready) throw new Error("Storage service not ready")

        this.storage.set({
            [key] : Utils.encrypt(this[ key ], this.password)
        })
        
    }
}

export default StorageService